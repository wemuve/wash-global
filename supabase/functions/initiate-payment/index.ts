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

interface ValidationError {
  field: string;
  message: string;
}

// Zambian phone regex
const zambianPhoneRegex = /^(\+?260|0)?[97]\d{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validatePaymentRequest(payload: any): { valid: boolean; errors: ValidationError[]; sanitized?: PaymentRequest } {
  const errors: ValidationError[] = [];

  // Amount validation
  if (typeof payload.amount !== 'number' || isNaN(payload.amount)) {
    errors.push({ field: 'amount', message: 'Amount must be a valid number' });
  } else if (payload.amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
  } else if (payload.amount > 1000000) {
    errors.push({ field: 'amount', message: 'Amount cannot exceed 1,000,000 ZMW' });
  }

  // Customer name validation
  if (!payload.customerName || typeof payload.customerName !== 'string') {
    errors.push({ field: 'customerName', message: 'Customer name is required' });
  } else if (payload.customerName.trim().length < 2) {
    errors.push({ field: 'customerName', message: 'Customer name must be at least 2 characters' });
  } else if (payload.customerName.length > 100) {
    errors.push({ field: 'customerName', message: 'Customer name cannot exceed 100 characters' });
  }

  // Customer phone validation
  if (!payload.customerPhone || typeof payload.customerPhone !== 'string') {
    errors.push({ field: 'customerPhone', message: 'Customer phone is required' });
  } else if (!zambianPhoneRegex.test(payload.customerPhone.replace(/\s/g, ''))) {
    errors.push({ field: 'customerPhone', message: 'Please enter a valid Zambian phone number' });
  }

  // Customer email validation (optional)
  if (payload.customerEmail && typeof payload.customerEmail === 'string' && payload.customerEmail.trim()) {
    if (!emailRegex.test(payload.customerEmail)) {
      errors.push({ field: 'customerEmail', message: 'Please enter a valid email address' });
    } else if (payload.customerEmail.length > 255) {
      errors.push({ field: 'customerEmail', message: 'Email cannot exceed 255 characters' });
    }
  }

  // Service name validation
  if (!payload.serviceName || typeof payload.serviceName !== 'string') {
    errors.push({ field: 'serviceName', message: 'Service name is required' });
  } else if (payload.serviceName.length > 200) {
    errors.push({ field: 'serviceName', message: 'Service name cannot exceed 200 characters' });
  }

  // Payment method validation
  const validPaymentMethods = ['mtn', 'airtel', 'zamtel'];
  if (!payload.paymentMethod || !validPaymentMethods.includes(payload.paymentMethod)) {
    errors.push({ field: 'paymentMethod', message: 'Payment method must be mtn, airtel, or zamtel' });
  }

  // Booking ID validation (optional)
  if (payload.bookingId && typeof payload.bookingId === 'string' && payload.bookingId.trim()) {
    if (!uuidRegex.test(payload.bookingId)) {
      errors.push({ field: 'bookingId', message: 'Invalid booking ID format' });
    }
  }

  // Currency validation
  const validCurrencies = ['ZMW', 'USD'];
  const currency = payload.currency || 'ZMW';
  if (!validCurrencies.includes(currency)) {
    errors.push({ field: 'currency', message: 'Currency must be ZMW or USD' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Return sanitized data
  const sanitized: PaymentRequest = {
    amount: Math.round(payload.amount * 100) / 100, // Round to 2 decimal places
    currency: currency,
    customerName: payload.customerName.trim().substring(0, 100),
    customerPhone: payload.customerPhone.replace(/\s/g, '').substring(0, 15),
    customerEmail: payload.customerEmail?.trim().substring(0, 255) || undefined,
    serviceName: payload.serviceName.trim().substring(0, 200),
    bookingId: payload.bookingId?.trim() || undefined,
    paymentMethod: payload.paymentMethod,
    returnUrl: payload.returnUrl?.substring(0, 500) || undefined,
  };

  return { valid: true, errors: [], sanitized };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const rawPayload = await req.json();
    
    // Validate and sanitize input
    const validation = validatePaymentRequest(rawPayload);
    if (!validation.valid) {
      console.error('Payment validation failed:', validation.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validation.errors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount, currency, customerName, customerPhone, customerEmail, serviceName, bookingId, paymentMethod, returnUrl } = validation.sanitized!;

    console.log('Initiating payment:', { amount, customerName: customerName.substring(0, 20), paymentMethod, serviceName });

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
        currency: currency,
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
    const paymentUrl = `${returnUrl || supabaseUrl}?payment_id=${payment.id}&transaction_ref=${transactionRef}`;

    // Log notification (sanitized - no PII in logs)
    console.log('Payment initiated:', { transactionRef, paymentMethod, amount, currency });

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
      JSON.stringify({ error: 'Payment initiation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
