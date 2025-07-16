import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  user_id: string;
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
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
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

      // Refresh bookings list
      await fetchBookings();

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