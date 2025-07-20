import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  user_id?: string | null;
  service_id: string;
  package_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  scheduled_date: string;
  scheduled_time: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  special_instructions?: string | null;
  assigned_team?: string | null;
  // Vehicle information for car detailing services
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  vehicle_year?: number | null;
  vehicle_type?: string | null;
  vehicle_color?: string | null;
  license_plate?: string | null;
  vehicle_notes?: string | null;
  parking_details?: string | null;
  water_available?: boolean | null;
  electricity_available?: boolean | null;
  created_at: string;
  updated_at: string;
  services?: {
    id: string;
    name: string;
    description: string;
    base_price: number;
    service_categories?: {
      name: string;
      icon: string;
    } | null;
  } | null;
  package_tiers?: {
    id: string;
    name: string;
    type: string;
    price_multiplier: number;
  } | null;
  profiles?: {
    full_name: string;
    phone?: string | null;
  } | null;
}

interface CreateBookingData {
  service_id: string;
  package_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  scheduled_date: string;
  scheduled_time: string;
  total_amount: number;
  special_instructions?: string;
  user_id?: string; // Optional for guest bookings
  // Vehicle information for car detailing services
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_type?: string;
  vehicle_color?: string;
  license_plate?: string;
  vehicle_notes?: string;
  parking_details?: string;
  water_available?: boolean;
  electricity_available?: boolean;
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          services (
            id,
            name,
            description,
            base_price,
            service_categories (
              name,
              icon
            )
          ),
          package_tiers (
            id,
            name,
            type,
            price_multiplier
          ),
          profiles (
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      // If not admin, only show user's bookings
      if (user.role !== 'admin') {
        query = query.eq('user_id', user.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setBookings((data as any) || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: CreateBookingData): Promise<{ success: boolean; error?: string; booking?: Booking }> => {
    try {
      console.log('🔍 BOOKING DEBUG: User object:', user);
      console.log('🔍 BOOKING DEBUG: Booking data user_id:', bookingData.user_id);
      console.log('🔍 BOOKING DEBUG: Final user_id to use:', bookingData.user_id || user?.id || null);
      
      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          // Use provided user_id or current user's id, or null for guest bookings
          user_id: bookingData.user_id || user?.id || null,
        })
        .select(`
          *,
          services (
            id,
            name,
            description,
            base_price,
            service_categories (
              name,
              icon
            )
          ),
          package_tiers (
            id,
            name,
            type,
            price_multiplier
          )
        `)
        .single();

      if (insertError) throw insertError;

      // Trigger n8n webhook for booking confirmation
      try {
        const webhookResponse = await supabase.functions.invoke('booking-webhook', {
          body: {
            booking_id: data.id,
            customer_name: data.customer_name,
            customer_phone: data.customer_phone,
            customer_email: user?.email || '',
            service_name: data.services?.name || 'Service',
            scheduled_date: data.scheduled_date,
            scheduled_time: data.scheduled_time,
            total_amount: data.total_amount,
            customer_address: data.customer_address,
            special_instructions: data.special_instructions,
            // Vehicle information
            vehicle_make: data.vehicle_make,
            vehicle_model: data.vehicle_model,
            vehicle_year: data.vehicle_year,
            vehicle_type: data.vehicle_type,
            vehicle_color: data.vehicle_color,
            license_plate: data.license_plate,
            vehicle_notes: data.vehicle_notes,
            parking_details: data.parking_details,
            water_available: data.water_available,
            electricity_available: data.electricity_available,
            // n8n webhook URL
            n8n_webhook_url: 'https://fixflow.app.n8n.cloud/webhook-test/ff8d1119-605c-4024-a25a-6342663517fb'
          }
        });
        
        console.log('Webhook triggered successfully:', webhookResponse);
      } catch (webhookError) {
        console.error('Webhook error (non-blocking):', webhookError);
        // Don't fail the booking if webhook fails
      }

      // Refresh bookings list only if user is logged in
      if (user) {
        await fetchBookings();
      }

      return { success: true, booking: data as any };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An error occurred' 
      };
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<{ success: boolean; error?: string }> => {
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      // Refresh bookings list
      await fetchBookings();

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An error occurred' 
      };
    }
  };

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.total_amount, 0),
    };

    return stats;
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    getBookingStats,
    refetch: fetchBookings,
  };
};
