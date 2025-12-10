import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppPayload {
  type: 'booking' | 'lead' | 'inquiry';
  data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    service?: string;
    package?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    address?: string;
    totalAmount?: number;
    message?: string;
    source?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: WhatsAppPayload = await req.json();
    const webhookUrl = Deno.env.get('WHATSAPP_WEBHOOK_URL');

    if (!webhookUrl) {
      console.error('WHATSAPP_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'WhatsApp webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format message based on type
    let message = '';
    const { type, data } = payload;

    switch (type) {
      case 'booking':
        message = `🎉 *New Booking Received!*

👤 *Customer:* ${data.customerName}
📱 *Phone:* ${data.customerPhone}
${data.customerEmail ? `📧 *Email:* ${data.customerEmail}` : ''}

🛠️ *Service:* ${data.service || 'Not specified'}
📦 *Package:* ${data.package || 'Standard'}
📅 *Date:* ${data.scheduledDate || 'TBD'}
⏰ *Time:* ${data.scheduledTime || 'TBD'}
📍 *Location:* ${data.address || 'Not provided'}

💰 *Total:* K${data.totalAmount?.toLocaleString() || '0'}

🔗 *Source:* ${data.source || 'Website'}`;
        break;

      case 'lead':
        message = `🔔 *New Lead Captured!*

👤 *Name:* ${data.customerName}
📱 *Phone:* ${data.customerPhone}
${data.customerEmail ? `📧 *Email:* ${data.customerEmail}` : ''}

💬 *Inquiry:* ${data.message || 'General inquiry'}
🛠️ *Interested In:* ${data.service || 'Not specified'}

🔗 *Source:* ${data.source || 'AI Receptionist'}

⏳ *Follow up within 15 minutes for best conversion!*`;
        break;

      case 'inquiry':
        message = `📩 *New Inquiry*

👤 *From:* ${data.customerName}
📱 *Phone:* ${data.customerPhone}
${data.customerEmail ? `📧 *Email:* ${data.customerEmail}` : ''}

💬 *Message:*
${data.message || 'No message provided'}

🔗 *Source:* ${data.source || 'Contact Form'}`;
        break;
    }

    // Send to webhook (n8n, Make, Zapier, or direct WhatsApp API)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        phone: data.customerPhone,
        type,
        rawData: data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error:', response.status, errorText);
      throw new Error(`Webhook failed: ${response.status}`);
    }

    console.log('WhatsApp notification sent successfully:', type);

    return new Response(
      JSON.stringify({ success: true, type }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
