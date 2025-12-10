import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { leadCaptureSchema, LeadCaptureData } from '@/lib/validation';

interface LeadData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message?: string;
  serviceInterest?: string[];
  source?: string;
}

export const useLeadCapture = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const captureLead = async (data: LeadData): Promise<{ success: boolean; leadId?: string }> => {
    setIsLoading(true);

    try {
      // Validate input
      const validationResult = leadCaptureSchema.safeParse({
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail,
        message: data.message,
        service_interest: data.serviceInterest,
        source: data.source,
      });

      if (!validationResult.success) {
        console.error('Lead validation failed:', validationResult.error);
        // Still try to capture - validation is for security, not blocking
      }

      // Insert lead into database
      const { data: lead, error } = await supabase
        .from('leads')
        .insert({
          customer_name: data.customerName.trim(),
          customer_phone: data.customerPhone.trim(),
          customer_email: data.customerEmail?.trim() || null,
          message: data.message?.trim() || null,
          service_interest: data.serviceInterest || [],
          source: data.source || 'ai_receptionist',
          status: 'new',
        })
        .select()
        .single();

      if (error) {
        console.error('Error capturing lead:', error);
        throw error;
      }

      // Send WhatsApp notification
      try {
        await supabase.functions.invoke('send-whatsapp', {
          body: {
            type: 'lead',
            data: {
              customerName: data.customerName,
              customerPhone: data.customerPhone,
              customerEmail: data.customerEmail,
              message: data.message,
              service: data.serviceInterest?.join(', '),
              source: data.source || 'AI Receptionist',
            },
          },
        });
      } catch (whatsappError) {
        console.error('WhatsApp notification failed:', whatsappError);
        // Don't fail the lead capture if WhatsApp fails
      }

      console.log('Lead captured successfully:', lead.id);
      return { success: true, leadId: lead.id };
    } catch (error) {
      console.error('Lead capture error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your information. Please try again.',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { captureLead, isLoading };
};
