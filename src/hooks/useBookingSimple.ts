import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BookingData {
  service_id: string;
  package_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  scheduled_date: string;
  scheduled_time: string;
  total_amount: number;
  special_instructions?: string;
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

      // Simple direct insert - no complex logic
      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert({
          service_id: bookingData.service_id,
          package_id: bookingData.package_id,
          customer_name: bookingData.customer_name,
          customer_phone: bookingData.customer_phone,
          customer_address: bookingData.customer_address,
          scheduled_date: bookingData.scheduled_date,
          scheduled_time: bookingData.scheduled_time,
          total_amount: bookingData.total_amount,
          special_instructions: bookingData.special_instructions,
          vehicle_make: bookingData.vehicle_make,
          vehicle_model: bookingData.vehicle_model,
          vehicle_year: bookingData.vehicle_year,
          vehicle_color: bookingData.vehicle_color,
          vehicle_type: bookingData.vehicle_type,
          license_plate: bookingData.license_plate,
          parking_details: bookingData.parking_details,
          vehicle_notes: bookingData.vehicle_notes,
          water_available: bookingData.water_available,
          electricity_available: bookingData.electricity_available,
          user_id: null, // Always null for guest bookings
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(insertError.message);
      }

      console.log('Booking created successfully:', data);

      toast({
        title: "Booking Confirmed!",
        description: "Your service has been scheduled successfully.",
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