import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const validTypes = ['booking', 'lead', 'inquiry', 'confirmation', 'reminder', 'promo'] as const;
type MessageType = typeof validTypes[number];

const zambianPhoneRegex = /^(\+?260|0)?[97]\d{8}$/;

function sanitizeText(text: string, maxLength: number): string {
  return text.substring(0, maxLength).replace(/<[^>]*>/g, '').trim();
}

function validatePayload(payload: any): { valid: boolean; error?: string; type?: MessageType; data?: any } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Invalid payload' };
  }

  if (!payload.type || !validTypes.includes(payload.type)) {
    return { valid: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` };
  }

  if (!payload.data || typeof payload.data !== 'object') {
    return { valid: false, error: 'Data object is required' };
  }

  const { data } = payload;

  if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.trim().length < 2) {
    return { valid: false, error: 'Valid customer name is required (min 2 chars)' };
  }

  if (!data.customerPhone || typeof data.customerPhone !== 'string') {
    return { valid: false, error: 'Customer phone is required' };
  }

  const cleanPhone = data.customerPhone.replace(/\s/g, '');
  if (!zambianPhoneRegex.test(cleanPhone)) {
    return { valid: false, error: 'Invalid Zambian phone number format' };
  }

  // Sanitize all string fields
  const sanitizedData = {
    customerName: sanitizeText(data.customerName, 100),
    customerPhone: cleanPhone.substring(0, 15),
    customerEmail: data.customerEmail ? sanitizeText(String(data.customerEmail), 255) : undefined,
    service: data.service ? sanitizeText(String(data.service), 200) : undefined,
    package: data.package ? sanitizeText(String(data.package), 100) : undefined,
    scheduledDate: data.scheduledDate ? sanitizeText(String(data.scheduledDate), 20) : undefined,
    scheduledTime: data.scheduledTime ? sanitizeText(String(data.scheduledTime), 20) : undefined,
    address: data.address ? sanitizeText(String(data.address), 500) : undefined,
    totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : undefined,
    message: data.message ? sanitizeText(String(data.message), 500) : undefined,
    source: data.source ? sanitizeText(String(data.source), 50) : undefined,
    promoCode: data.promoCode ? sanitizeText(String(data.promoCode), 20) : undefined,
    promoDiscount: data.promoDiscount ? sanitizeText(String(data.promoDiscount), 20) : undefined,
    reminderType: ['day_before', 'hour_before', 'follow_up'].includes(data.reminderType) ? data.reminderType : undefined,
  };

  return { valid: true, type: payload.type as MessageType, data: sanitizedData };
}

function buildMessage(type: MessageType, data: any): { message: string; recipientPhone: string } {
  let message = '';
  let recipientPhone = '';

  switch (type) {
    case 'booking':
      message = `🎉 *New Booking Received!*\n\n👤 *Customer:* ${data.customerName}\n📱 *Phone:* ${data.customerPhone}\n${data.customerEmail ? `📧 *Email:* ${data.customerEmail}\n` : ''}\n🛠️ *Service:* ${data.service || 'Not specified'}\n📦 *Package:* ${data.package || 'Standard'}\n📅 *Date:* ${data.scheduledDate || 'TBD'}\n⏰ *Time:* ${data.scheduledTime || 'TBD'}\n📍 *Location:* ${data.address || 'Not provided'}\n\n💰 *Total:* K${data.totalAmount?.toLocaleString() || '0'}\n\n🔗 *Source:* ${data.source || 'Website'}`;
      break;
    case 'confirmation':
      message = `✅ *Booking Confirmed - WeWash!*\n\nHi ${data.customerName}! 👋\n\nYour booking has been confirmed:\n\n🛠️ *Service:* ${data.service || 'Cleaning Service'}\n📅 *Date:* ${data.scheduledDate}\n⏰ *Time:* ${data.scheduledTime}\n📍 *Location:* ${data.address}\n\n💰 *Total:* K${data.totalAmount?.toLocaleString()}\n\nOur team will arrive on time. Please ensure access to the location.\n\nNeed to reschedule? Reply to this message or call us.\n\nThank you for choosing WeWash! 🧹✨`;
      recipientPhone = data.customerPhone;
      break;
    case 'reminder':
      const reminderText = data.reminderType === 'day_before' ? 'tomorrow' : data.reminderType === 'hour_before' ? 'in 1 hour' : 'soon';
      message = `⏰ *Reminder - WeWash Service ${reminderText}!*\n\nHi ${data.customerName}! 👋\n\nJust a friendly reminder about your upcoming service:\n\n🛠️ *Service:* ${data.service}\n📅 *Date:* ${data.scheduledDate}\n⏰ *Time:* ${data.scheduledTime}\n📍 *Location:* ${data.address}\n\nPlease ensure:\n✓ Access to the location\n✓ Water/electricity available (if needed)\n✓ Valuables secured\n\nReply if you need to reschedule!\n\n- The WeWash Team 🧹`;
      recipientPhone = data.customerPhone;
      break;
    case 'promo':
      message = `🎁 *Special Offer from WeWash!*\n\nHi ${data.customerName}! 👋\n\n${data.message || 'We have an exclusive offer just for you!'}\n\n${data.promoCode ? `🏷️ *Use Code:* ${data.promoCode}` : ''}\n${data.promoDiscount ? `💰 *Save:* ${data.promoDiscount}` : ''}\n\nBook now at wewashglobal.com or reply to schedule!\n\nOffer valid for limited time only! ⏳\n\n- The WeWash Team ✨`;
      recipientPhone = data.customerPhone;
      break;
    case 'lead':
      message = `🔔 *New Lead Captured!*\n\n👤 *Name:* ${data.customerName}\n📱 *Phone:* ${data.customerPhone}\n${data.customerEmail ? `📧 *Email:* ${data.customerEmail}` : ''}\n\n💬 *Inquiry:* ${data.message || 'General inquiry'}\n🛠️ *Interested In:* ${data.service || 'Not specified'}\n\n🔗 *Source:* ${data.source || 'AI Receptionist'}\n\n⏳ *Follow up within 15 minutes for best conversion!*`;
      break;
    case 'inquiry':
      message = `📩 *New Inquiry*\n\n👤 *From:* ${data.customerName}\n📱 *Phone:* ${data.customerPhone}\n${data.customerEmail ? `📧 *Email:* ${data.customerEmail}` : ''}\n\n💬 *Message:*\n${data.message || 'No message provided'}\n\n🔗 *Source:* ${data.source || 'Contact Form'}`;
      break;
  }

  return { message, recipientPhone };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate: require JWT for customer-facing messages
    const authHeader = req.headers.get('Authorization');
    const rawPayload = await req.json();
    const validation = validatePayload(rawPayload);

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type, data } = validation;

    // For customer-facing messages (confirmation, reminder, promo), require authentication
    const customerFacingTypes: MessageType[] = ['confirmation', 'reminder', 'promo'];
    if (customerFacingTypes.includes(type!)) {
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ error: 'Authentication required for customer messages' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      );

      const token = authHeader.replace('Bearer ', '');
      const { data: claims, error: authError } = await supabase.auth.getClaims(token);
      if (authError || !claims?.claims) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const webhookUrl = Deno.env.get('WHATSAPP_WEBHOOK_URL');
    if (!webhookUrl) {
      console.error('WHATSAPP_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'WhatsApp webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, recipientPhone } = buildMessage(type!, data);

    console.log(`Sending ${type} WhatsApp notification`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        phone: recipientPhone || data.customerPhone,
        type,
        timestamp: new Date().toISOString(),
        sendToCustomer: customerFacingTypes.includes(type!),
      }),
    });

    if (!response.ok) {
      console.error('Webhook error:', response.status);
      throw new Error(`Webhook failed: ${response.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, type }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send notification' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
