import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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