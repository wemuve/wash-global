import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { bookingFormSchema } from '@/lib/validation';

export interface BookingData {
  // Service info - accepts either ID or name
  service_id?: string;
  serviceName?: string;
  package_id?: string;
  packageName?: string;
  // Customer info
  customer_name?: string;
  customerName?: string;
  customer_phone?: string;
  customerPhone?: string;
  customer_email?: string;
  customerEmail?: string;
  customer_address?: string;
  customerAddress?: string;
  // Schedule
  scheduled_date?: string;
  scheduledDate?: string;
  scheduled_time?: string;
  scheduledTime?: string;
  // Pricing
  total_amount?: number;
  totalAmount?: number;
  currency?: string;
  // Instructions
  special_instructions?: string;
  specialInstructions?: string;
  // Car detailing specific fields
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_color?: string;
  vehicle_type?: string;
  license_plate?: string;
  parking_details?: string;
  vehicle_notes?: string;
  water_available?: boolean;
  electricity_available?: boolean;
}

export const useBookingSimple = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createBooking = async (bookingData: BookingData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating booking with data:', bookingData);

      // Normalize field names (support both conventions)
      const normalizedData = {
        service_id: bookingData.service_id || null,
        package_id: bookingData.package_id || null,
        customer_name: bookingData.customer_name || bookingData.customerName || '',
        customer_phone: bookingData.customer_phone || bookingData.customerPhone || '',
        customer_email: bookingData.customer_email || bookingData.customerEmail || null,
        customer_address: bookingData.customer_address || bookingData.customerAddress || '',
        scheduled_date: bookingData.scheduled_date || bookingData.scheduledDate || '',
        scheduled_time: bookingData.scheduled_time || bookingData.scheduledTime || '',
        total_amount: bookingData.total_amount || bookingData.totalAmount || 0,
        special_instructions: bookingData.special_instructions || bookingData.specialInstructions || null,
        currency: bookingData.currency || 'ZMW',
        vehicle_make: bookingData.vehicle_make || null,
        vehicle_model: bookingData.vehicle_model || null,
        vehicle_year: bookingData.vehicle_year || null,
        vehicle_color: bookingData.vehicle_color || null,
        vehicle_type: bookingData.vehicle_type || null,
        license_plate: bookingData.license_plate || null,
        parking_details: bookingData.parking_details || null,
        vehicle_notes: bookingData.vehicle_notes || null,
        water_available: bookingData.water_available ?? null,
        electricity_available: bookingData.electricity_available ?? null,
        user_id: null,
        status: 'pending'
      };

      // Validate required fields
      if (!normalizedData.customer_name || !normalizedData.customer_phone || !normalizedData.customer_address) {
        throw new Error('Please fill in all required fields');
      }

      // Simple direct insert
      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert(normalizedData)
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(insertError.message);
      }

      if (!data) {
        throw new Error('No data returned from booking creation');
      }

      console.log('Booking created successfully:', data);

      // Send notifications in parallel (WhatsApp + Email)
      const notificationPromises = [];
      
      // WhatsApp notification
      notificationPromises.push(
        supabase.functions.invoke('send-whatsapp', {
          body: {
            type: 'booking',
            data: {
              customerName: data.customer_name,
              customerPhone: data.customer_phone,
              customerEmail: data.customer_email,
              service: bookingData.serviceName || 'Service',
              package: bookingData.packageName || 'Standard',
              scheduledDate: data.scheduled_date,
              scheduledTime: data.scheduled_time,
              address: data.customer_address,
              totalAmount: data.total_amount,
              source: 'Website Booking',
            },
          },
        }).catch(err => console.warn('WhatsApp notification failed:', err))
      );
      
      // Email notification to booking@wewashglobal.com
      notificationPromises.push(
        supabase.functions.invoke('send-booking-email', {
          body: {
            customerName: data.customer_name,
            customerPhone: data.customer_phone,
            customerEmail: data.customer_email,
            service: bookingData.serviceName || 'Service',
            package: bookingData.packageName || 'Standard',
            scheduledDate: data.scheduled_date,
            scheduledTime: data.scheduled_time,
            address: data.customer_address,
            totalAmount: data.total_amount,
            currency: data.currency || 'ZMW',
            specialInstructions: data.special_instructions,
            vehicleInfo: data.vehicle_make ? {
              make: data.vehicle_make,
              model: data.vehicle_model,
              year: data.vehicle_year,
              color: data.vehicle_color,
              type: data.vehicle_type,
              licensePlate: data.license_plate,
            } : undefined,
          },
        }).catch(err => console.warn('Email notification failed:', err))
      );

      // Wait for all notifications (don't block on failures)
      await Promise.allSettled(notificationPromises);
      console.log('Notifications sent');

      toast({
        title: "Booking Confirmed!",
        description: "Your service has been scheduled. We'll contact you shortly.",
      });

      return { success: true, booking: data };

    } catch (error: any) {
      console.error('Booking creation failed:', error);
      const errorMessage = error.message || 'Failed to create booking';
      setError(errorMessage);
      
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
