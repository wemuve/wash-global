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
  signature?: string;
}

// Verify webhook signature using HMAC
async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return expectedSig === signature;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const webhookSecret = Deno.env.get('PAYMENT_WEBHOOK_SECRET');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const rawBody = await req.text();
    const payload: WebhookPayload = JSON.parse(rawBody);

    // Verify webhook signature if secret is configured
    if (webhookSecret) {
      const signature = req.headers.get('x-webhook-signature') || payload.signature || '';
      if (!signature) {
        console.error('Missing webhook signature');
        return new Response(
          JSON.stringify({ error: 'Missing signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const isValid = await verifySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      console.warn('PAYMENT_WEBHOOK_SECRET not configured - webhook signature verification skipped');
    }

    const { transactionRef, status, providerReference, amount, paidAt, metadata } = payload;

    // Validate required fields
    if (!transactionRef || typeof transactionRef !== 'string' || transactionRef.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid transactionRef' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validStatuses = ['completed', 'failed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment webhook received:', { transactionRef, status });

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

    // Prevent duplicate processing
    if (payment.status === 'completed') {
      return new Response(
        JSON.stringify({ success: true, message: 'Payment already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify amount matches if provided
    if (amount !== undefined && Math.abs(amount - payment.amount) > 0.01) {
      console.error('Amount mismatch:', { expected: payment.amount, received: amount });
      return new Response(
        JSON.stringify({ error: 'Amount mismatch' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        provider_reference: providerReference ? String(providerReference).substring(0, 200) : null,
        receipt_number: receiptNumber,
        metadata: {
          ...payment.metadata,
          ...(metadata || {}),
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

    console.log('Payment webhook processed successfully:', { transactionRef, status });

    return new Response(
      JSON.stringify({
        success: true,
        receiptNumber: receiptNumber,
        message: `Payment ${status} processed successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
