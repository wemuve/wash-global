import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  transactionRef: string;
  status: 'completed' | 'failed' | 'cancelled';
  providerReference?: string;
  amount?: number;
  paidAt?: string;
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: WebhookPayload = await req.json();
    const { transactionRef, status, providerReference, amount, paidAt, metadata } = payload;

    console.log('Payment webhook received:', { transactionRef, status, providerReference });

    // Find the payment by transaction reference
    const { data: payment, error: findError } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionRef)
      .single();

    if (findError || !payment) {
      console.error('Payment not found:', findError);
      return new Response(
        JSON.stringify({ error: 'Payment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate receipt number for completed payments
    let receiptNumber = null;
    if (status === 'completed') {
      const timestamp = Date.now().toString(36).toUpperCase();
      receiptNumber = `RCP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${timestamp}`;
    }

    // Update payment status
    const { data: updatedPayment, error: updateError } = await supabase
      .from('payments')
      .update({
        status: status,
        provider_reference: providerReference,
        receipt_number: receiptNumber,
        metadata: {
          ...payment.metadata,
          ...metadata,
          completed_at: status === 'completed' ? (paidAt || new Date().toISOString()) : null,
          webhook_received_at: new Date().toISOString()
        }
      })
      .eq('id', payment.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating payment:', updateError);
      throw new Error('Failed to update payment');
    }

    // If payment completed, update booking status
    if (status === 'completed' && payment.booking_id) {
      await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', payment.booking_id);
    }

    // Send WhatsApp notification for completed payment
    if (status === 'completed') {
      const whatsappMessage = `✅ PAYMENT CONFIRMED\n\n` +
        `📧 Receipt: ${receiptNumber}\n` +
        `👤 Customer: ${payment.customer_name}\n` +
        `📱 Phone: ${payment.customer_phone}\n` +
        `🛠️ Service: ${payment.service_name}\n` +
        `💰 Amount: ${payment.currency} ${payment.amount.toLocaleString()}\n` +
        `💳 Method: ${payment.payment_method.toUpperCase()}\n` +
        `🔖 Ref: ${transactionRef}\n` +
        `⏰ Time: ${new Date().toLocaleString('en-ZM', { timeZone: 'Africa/Lusaka' })}\n\n` +
        `📅 Please add to calendar!`;

      console.log('WhatsApp payment confirmation:', whatsappMessage);

      // In production, send to WhatsApp Business API
      // await sendWhatsAppMessage(ADMIN_PHONE, whatsappMessage);
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment: updatedPayment,
        receiptNumber: receiptNumber,
        message: `Payment ${status} processed successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Webhook processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
