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
      const customerName = (bookingData.customer_name || bookingData.customerName || '').trim();
      const customerPhone = (bookingData.customer_phone || bookingData.customerPhone || '').trim();
      const customerAddress = (bookingData.customer_address || bookingData.customerAddress || '').trim();
      const customerEmail = (bookingData.customer_email || bookingData.customerEmail || '').trim() || null;
      const scheduledDate = bookingData.scheduled_date || bookingData.scheduledDate || '';
      const scheduledTime = bookingData.scheduled_time || bookingData.scheduledTime || '';
      
      // Validate required fields first
      if (!customerName || customerName.length < 2) {
        throw new Error('Please enter your full name');
      }
      if (!customerPhone || customerPhone.length < 9) {
        throw new Error('Please enter a valid phone number');
      }
      if (!customerAddress || customerAddress.length < 5) {
        throw new Error('Please enter your address');
      }
      if (!scheduledDate) {
        throw new Error('Please select a date');
      }
      if (!scheduledTime) {
        throw new Error('Please select a time');
      }
      
      const normalizedData: Record<string, unknown> = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_address: customerAddress,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        total_amount: bookingData.total_amount || bookingData.totalAmount || 0,
        special_instructions: bookingData.special_instructions || bookingData.specialInstructions || null,
        currency: bookingData.currency || 'ZMW',
        user_id: null,
        status: 'pending'
      };
      
      // Only add service_id/package_id if they are valid UUIDs
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (bookingData.service_id && uuidRegex.test(bookingData.service_id)) {
        normalizedData.service_id = bookingData.service_id;
      }
      if (bookingData.package_id && uuidRegex.test(bookingData.package_id)) {
        normalizedData.package_id = bookingData.package_id;
      }
      
      // Add vehicle fields if present
      if (bookingData.vehicle_make) normalizedData.vehicle_make = bookingData.vehicle_make;
      if (bookingData.vehicle_model) normalizedData.vehicle_model = bookingData.vehicle_model;
      if (bookingData.vehicle_year) normalizedData.vehicle_year = bookingData.vehicle_year;
      if (bookingData.vehicle_color) normalizedData.vehicle_color = bookingData.vehicle_color;
      if (bookingData.vehicle_type) normalizedData.vehicle_type = bookingData.vehicle_type;
      if (bookingData.license_plate) normalizedData.license_plate = bookingData.license_plate;
      if (bookingData.parking_details) normalizedData.parking_details = bookingData.parking_details;
      if (bookingData.vehicle_notes) normalizedData.vehicle_notes = bookingData.vehicle_notes;
      if (bookingData.water_available !== undefined) normalizedData.water_available = bookingData.water_available;
      if (bookingData.electricity_available !== undefined) normalizedData.electricity_available = bookingData.electricity_available;

      console.log('Normalized booking data:', normalizedData);

      // Simple direct insert - cast to any to bypass strict typing
      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert(normalizedData as any)
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

      // Send notifications in parallel (WhatsApp admin + customer confirmation + Email)
      const notificationPromises = [];
      
      const notificationData = {
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerEmail: data.customer_email,
        service: bookingData.serviceName || 'Cleaning Service',
        package: bookingData.packageName || 'Standard',
        scheduledDate: data.scheduled_date,
        scheduledTime: data.scheduled_time,
        address: data.customer_address,
        totalAmount: data.total_amount,
      };
      
      // WhatsApp admin notification (new booking alert)
      notificationPromises.push(
        supabase.functions.invoke('send-whatsapp', {
          body: {
            type: 'booking',
            data: {
              ...notificationData,
              source: 'Website Booking',
            },
          },
        }).catch(err => console.warn('WhatsApp admin notification failed:', err))
      );
      
      // WhatsApp customer confirmation message
      notificationPromises.push(
        supabase.functions.invoke('send-whatsapp', {
          body: {
            type: 'confirmation',
            data: notificationData,
          },
        }).catch(err => console.warn('WhatsApp customer confirmation failed:', err))
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
