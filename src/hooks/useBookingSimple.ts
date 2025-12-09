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

      if (!data) {
        throw new Error('No data returned from booking creation');
      }

      console.log('Booking created successfully:', data);

      // Send booking data to AI agent webhook
      try {
        const webhookUrl = 'https://fixflow.app.n8n.cloud/webhook-test/68919d41-3f08-45ee-b018-e2b8ac1d5085';
        
        const webhookPayload = {
          booking_id: data.id,
          service_id: data.service_id,
          package_id: data.package_id,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_address: data.customer_address,
          scheduled_date: data.scheduled_date,
          scheduled_time: data.scheduled_time,
          total_amount: data.total_amount,
          status: data.status,
          special_instructions: data.special_instructions,
          // Vehicle details (if applicable)
          vehicle_make: data.vehicle_make,
          vehicle_model: data.vehicle_model,
          vehicle_year: data.vehicle_year,
          vehicle_color: data.vehicle_color,
          vehicle_type: data.vehicle_type,
          license_plate: data.license_plate,
          parking_details: data.parking_details,
          vehicle_notes: data.vehicle_notes,
          water_available: data.water_available,
          electricity_available: data.electricity_available,
          // Metadata
          created_at: data.created_at,
          booking_source: 'wewash_website',
          currency: 'ZMW', // Zambian Kwacha
          webhook_timestamp: new Date().toISOString()
        };

        console.log('Sending booking data to AI agent webhook:', webhookPayload);

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        });

        if (webhookResponse.ok) {
          console.log('Webhook sent successfully to AI agent');
        } else {
          console.warn('Webhook failed but booking was created:', webhookResponse.status);
        }
      } catch (webhookError) {
        console.warn('Failed to send webhook to AI agent (booking still created):', webhookError);
        // Don't fail the booking if webhook fails
      }

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