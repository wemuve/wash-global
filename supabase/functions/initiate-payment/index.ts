import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  bookingId?: string;
  paymentMethod: 'mtn' | 'airtel' | 'zamtel';
  returnUrl?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: PaymentRequest = await req.json();
    const { amount, currency, customerName, customerPhone, customerEmail, serviceName, bookingId, paymentMethod, returnUrl } = payload;

    console.log('Initiating payment:', { amount, customerName, paymentMethod, serviceName });

    // Generate a unique transaction reference
    const transactionRef = `WW-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create pending payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId || null,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        amount: amount,
        currency: currency || 'ZMW',
        payment_method: paymentMethod,
        payment_provider: 'dpo_paystack',
        transaction_id: transactionRef,
        service_name: serviceName,
        status: 'pending',
        metadata: {
          initiated_at: new Date().toISOString(),
          return_url: returnUrl
        }
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      throw new Error('Failed to create payment record');
    }

    // For demo purposes, we'll simulate the payment initiation
    // In production, you would integrate with DPO/Paystack API here
    const paymentUrl = `${returnUrl || supabaseUrl}?payment_id=${payment.id}&transaction_ref=${transactionRef}`;

    // Send WhatsApp notification for new payment request
    const whatsappMessage = `🔔 New Payment Request\n\n` +
      `Customer: ${customerName}\n` +
      `Phone: ${customerPhone}\n` +
      `Service: ${serviceName}\n` +
      `Amount: ${currency} ${amount.toLocaleString()}\n` +
      `Method: ${paymentMethod.toUpperCase()}\n` +
      `Reference: ${transactionRef}\n` +
      `Status: Pending`;

    // Log the WhatsApp message (in production, integrate with WhatsApp Business API)
    console.log('WhatsApp notification:', whatsappMessage);

    return new Response(
      JSON.stringify({
        success: true,
        paymentId: payment.id,
        transactionRef: transactionRef,
        paymentUrl: paymentUrl,
        message: 'Payment initiated successfully. Complete payment using your mobile money.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Payment initiation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Payment initiation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
