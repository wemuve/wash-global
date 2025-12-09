import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentData {
  amount: number;
  currency?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  bookingId?: string;
  paymentMethod: 'mtn' | 'airtel' | 'zamtel';
}

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionRef?: string;
  paymentUrl?: string;
  receiptNumber?: string;
  payment?: Record<string, unknown>;
  message?: string;
  error?: string;
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const initiatePayment = async (data: PaymentData): Promise<PaymentResult> => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('initiate-payment', {
        body: {
          ...data,
          currency: data.currency || 'ZMW',
          returnUrl: window.location.origin + '/booking-confirmation'
        }
      });

      if (error) throw error;

      if (result.success) {
        toast({
          title: 'Payment Initiated',
          description: `Reference: ${result.transactionRef}. Complete payment on your phone.`,
        });
      }

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Payment initiation failed';
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const simulatePaymentCompletion = async (transactionRef: string): Promise<PaymentResult> => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('payment-webhook', {
        body: {
          transactionRef,
          status: 'completed',
          providerReference: `PROV-${Date.now()}`,
          paidAt: new Date().toISOString()
        }
      });

      if (error) throw error;

      if (result.success) {
        toast({
          title: '✅ Payment Confirmed!',
          description: `Receipt: ${result.receiptNumber}`,
        });
      }

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Payment confirmation failed';
      toast({
        title: 'Confirmation Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    simulatePaymentCompletion,
    loading
  };
};
