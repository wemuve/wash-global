import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppPayload {
  type: 'booking' | 'lead' | 'inquiry' | 'confirmation' | 'reminder' | 'promo';
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
    promoCode?: string;
    promoDiscount?: string;
    reminderType?: 'day_before' | 'hour_before' | 'follow_up';
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
    let recipientPhone = '';
    const { type, data } = payload;

    switch (type) {
      case 'booking':
        // Admin notification for new booking
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
        // Send to admin
        recipientPhone = ''; // Will use default from webhook
        break;

      case 'confirmation':
        // Customer confirmation message
        message = `✅ *Booking Confirmed - WeWash!*

Hi ${data.customerName}! 👋

Your booking has been confirmed:

🛠️ *Service:* ${data.service || 'Cleaning Service'}
📅 *Date:* ${data.scheduledDate}
⏰ *Time:* ${data.scheduledTime}
📍 *Location:* ${data.address}

💰 *Total:* K${data.totalAmount?.toLocaleString()}

Our team will arrive on time. Please ensure access to the location.

Need to reschedule? Reply to this message or call us.

Thank you for choosing WeWash! 🧹✨`;
        recipientPhone = data.customerPhone;
        break;

      case 'reminder':
        const reminderText = data.reminderType === 'day_before' 
          ? 'tomorrow' 
          : data.reminderType === 'hour_before' 
            ? 'in 1 hour'
            : 'soon';
        
        message = `⏰ *Reminder - WeWash Service ${reminderText}!*

Hi ${data.customerName}! 👋

Just a friendly reminder about your upcoming service:

🛠️ *Service:* ${data.service}
📅 *Date:* ${data.scheduledDate}
⏰ *Time:* ${data.scheduledTime}
📍 *Location:* ${data.address}

Please ensure:
✓ Access to the location
✓ Water/electricity available (if needed)
✓ Valuables secured

Reply if you need to reschedule!

- The WeWash Team 🧹`;
        recipientPhone = data.customerPhone;
        break;

      case 'promo':
        message = `🎁 *Special Offer from WeWash!*

Hi ${data.customerName}! 👋

${data.message || 'We have an exclusive offer just for you!'}

${data.promoCode ? `🏷️ *Use Code:* ${data.promoCode}` : ''}
${data.promoDiscount ? `💰 *Save:* ${data.promoDiscount}` : ''}

Book now at wewashglobal.com or reply to schedule!

Offer valid for limited time only! ⏳

- The WeWash Team ✨`;
        recipientPhone = data.customerPhone;
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

    console.log(`Sending ${type} WhatsApp notification`, { recipientPhone: recipientPhone || 'admin' });

    // Send to webhook (n8n, Make, Zapier, or direct WhatsApp API)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        phone: recipientPhone || data.customerPhone,
        type,
        rawData: data,
        timestamp: new Date().toISOString(),
        sendToCustomer: ['confirmation', 'reminder', 'promo'].includes(type),
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
