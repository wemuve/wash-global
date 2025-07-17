import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingWebhookRequest {
  booking_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_name: string;
  scheduled_date: string;
  scheduled_time: string;
  total_amount: number;
  n8n_webhook_url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData: BookingWebhookRequest = await req.json();
    
    console.log("Received booking webhook data:", webhookData);

    // Prepare data for n8n workflow
    const n8nPayload = {
      booking_id: webhookData.booking_id,
      customer_name: webhookData.customer_name,
      customer_phone: webhookData.customer_phone,
      customer_email: webhookData.customer_email || "",
      service_name: webhookData.service_name,
      scheduled_date: webhookData.scheduled_date,
      scheduled_time: webhookData.scheduled_time,
      total_amount: webhookData.total_amount,
      timestamp: new Date().toISOString(),
      source: "wewash_booking_system",
      // WhatsApp message template
      whatsapp_message: `🎉 *Booking Confirmation*\n\nHello ${webhookData.customer_name}!\n\nYour booking has been confirmed:\n📋 Service: ${webhookData.service_name}\n📅 Date: ${webhookData.scheduled_date}\n⏰ Time: ${webhookData.scheduled_time}\n💰 Amount: K${webhookData.total_amount}\n\nWe'll contact you soon to confirm details.\n\nThank you for choosing WeWash Zambia! 🧽✨`,
      // Email subject and content
      email_subject: `Booking Confirmation - WeWash Zambia`,
      email_content: `Dear ${webhookData.customer_name},\n\nThank you for your booking with WeWash Zambia!\n\nBooking Details:\nService: ${webhookData.service_name}\nDate: ${webhookData.scheduled_date}\nTime: ${webhookData.scheduled_time}\nAmount: K${webhookData.total_amount}\n\nWe will contact you within 24 hours to confirm the appointment and discuss any specific requirements.\n\nBest regards,\nWeWash Zambia Team\n+260 768 671 420`
    };

    // Send to n8n webhook if URL is provided
    if (webhookData.n8n_webhook_url) {
      try {
        const n8nResponse = await fetch(webhookData.n8n_webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(n8nPayload),
        });

        console.log("n8n webhook response status:", n8nResponse.status);
        
        if (!n8nResponse.ok) {
          console.error("n8n webhook failed:", await n8nResponse.text());
        }
      } catch (error) {
        console.error("Error sending to n8n webhook:", error);
        // Continue processing even if webhook fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Booking webhook processed successfully",
        booking_id: webhookData.booking_id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in booking webhook:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);