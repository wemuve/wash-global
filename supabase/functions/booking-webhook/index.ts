
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
  customer_address: string;
  service_name: string;
  service_category?: string;
  scheduled_date: string;
  scheduled_time: string;
  total_amount: number;
  status?: string;
  special_instructions?: string;
  // Enhanced vehicle information for car detailing services
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_type?: string;
  vehicle_color?: string;
  license_plate?: string;
  vehicle_notes?: string;
  parking_details?: string;
  water_available?: boolean;
  electricity_available?: boolean;
  // Webhook configuration
  n8n_webhook_url?: string;
  retry_count?: number;
}

interface WebhookResponse {
  success: boolean;
  message: string;
  booking_id: string;
  webhook_delivered?: boolean;
  webhook_error?: string;
  retry_count?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 5000]; // milliseconds

const sendWebhookWithRetry = async (webhookUrl: string, payload: any, retryCount = 0): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`Attempting webhook delivery (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "WeWash-Booking-System/1.0",
      },
      body: JSON.stringify(payload),
    });

    console.log(`Webhook response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Webhook failed with status ${response.status}:`, errorText);
      
      // Retry on 5xx errors or specific 4xx errors
      if ((response.status >= 500 || response.status === 429) && retryCount < MAX_RETRIES) {
        console.log(`Retrying webhook in ${RETRY_DELAYS[retryCount]}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[retryCount]));
        return sendWebhookWithRetry(webhookUrl, payload, retryCount + 1);
      }
      
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const responseData = await response.text();
    console.log("Webhook delivered successfully:", responseData);
    return { success: true };

  } catch (error) {
    console.error(`Webhook delivery error (attempt ${retryCount + 1}):`, error);
    
    // Retry on network errors
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying webhook in ${RETRY_DELAYS[retryCount]}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[retryCount]));
      return sendWebhookWithRetry(webhookUrl, payload, retryCount + 1);
    }
    
    return { success: false, error: error.message };
  }
};

const generateMessageTemplates = (data: BookingWebhookRequest) => {
  const isCarDetailing = data.service_category === 'Mobile Car Detailing';
  
  // Enhanced WhatsApp message with service-specific details
  let whatsappMessage = `🎉 *Booking Confirmation - WeWash Zambia*\n\nHello ${data.customer_name}!\n\nYour booking has been confirmed:\n\n`;
  whatsappMessage += `📋 *Service:* ${data.service_name}\n`;
  whatsappMessage += `📅 *Date:* ${data.scheduled_date}\n`;
  whatsappMessage += `⏰ *Time:* ${data.scheduled_time}\n`;
  whatsappMessage += `📍 *Location:* ${data.customer_address}\n`;
  whatsappMessage += `💰 *Amount:* K${data.total_amount}\n\n`;
  
  if (isCarDetailing && data.vehicle_make) {
    whatsappMessage += `🚗 *Vehicle Details:*\n`;
    whatsappMessage += `• ${data.vehicle_make} ${data.vehicle_model || ''} ${data.vehicle_year || ''}\n`;
    if (data.vehicle_color) whatsappMessage += `• Color: ${data.vehicle_color}\n`;
    if (data.license_plate) whatsappMessage += `• License: ${data.license_plate}\n`;
    whatsappMessage += `\n`;
  }
  
  if (data.special_instructions) {
    whatsappMessage += `📝 *Special Instructions:* ${data.special_instructions}\n\n`;
  }
  
  whatsappMessage += `We'll contact you within 24 hours to confirm details and coordinate our team's arrival.\n\n`;
  whatsappMessage += `Thank you for choosing WeWash Zambia! 🧽✨\n`;
  whatsappMessage += `📞 Contact: +260 768 671 420`;

  // Enhanced email content
  let emailContent = `Dear ${data.customer_name},\n\nThank you for your booking with WeWash Zambia!\n\n`;
  emailContent += `BOOKING DETAILS:\n`;
  emailContent += `Service: ${data.service_name}\n`;
  emailContent += `Date: ${data.scheduled_date}\n`;
  emailContent += `Time: ${data.scheduled_time}\n`;
  emailContent += `Location: ${data.customer_address}\n`;
  emailContent += `Amount: K${data.total_amount}\n\n`;
  
  if (isCarDetailing && data.vehicle_make) {
    emailContent += `VEHICLE INFORMATION:\n`;
    emailContent += `Vehicle: ${data.vehicle_make} ${data.vehicle_model || ''} ${data.vehicle_year || ''}\n`;
    if (data.vehicle_color) emailContent += `Color: ${data.vehicle_color}\n`;
    if (data.license_plate) emailContent += `License Plate: ${data.license_plate}\n`;
    if (data.parking_details) emailContent += `Parking Details: ${data.parking_details}\n`;
    emailContent += `Water Available: ${data.water_available ? 'Yes' : 'No'}\n`;
    emailContent += `Electricity Available: ${data.electricity_available ? 'Yes' : 'No'}\n\n`;
  }
  
  if (data.special_instructions) {
    emailContent += `SPECIAL INSTRUCTIONS:\n${data.special_instructions}\n\n`;
  }
  
  emailContent += `WHAT'S NEXT:\n`;
  emailContent += `1. We will contact you within 24 hours to confirm the appointment\n`;
  emailContent += `2. Our professional team will arrive at the scheduled time\n`;
  emailContent += `3. We'll complete the service to your satisfaction\n\n`;
  emailContent += `If you have any questions or need to make changes, please contact us at +260 768 671 420.\n\n`;
  emailContent += `Best regards,\nWeWash Zambia Team\nProfessional Cleaning Services\n+260 768 671 420`;

  return { whatsappMessage, emailContent };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData: BookingWebhookRequest = await req.json();
    
    console.log("=== BOOKING WEBHOOK RECEIVED ===");
    console.log("Booking ID:", webhookData.booking_id);
    console.log("Customer:", webhookData.customer_name);
    console.log("Service:", webhookData.service_name);
    console.log("Webhook URL provided:", !!webhookData.n8n_webhook_url);

    // Validate required fields
    if (!webhookData.booking_id || !webhookData.customer_name || !webhookData.service_name) {
      throw new Error("Missing required booking data fields");
    }

    // Generate service-specific message templates
    const { whatsappMessage, emailContent } = generateMessageTemplates(webhookData);

    // Prepare enhanced data for n8n workflow
    const n8nPayload = {
      // Core booking information
      booking_id: webhookData.booking_id,
      customer_name: webhookData.customer_name,
      customer_phone: webhookData.customer_phone,
      customer_email: webhookData.customer_email || "",
      customer_address: webhookData.customer_address,
      service_name: webhookData.service_name,
      service_category: webhookData.service_category || "General",
      scheduled_date: webhookData.scheduled_date,
      scheduled_time: webhookData.scheduled_time,
      total_amount: webhookData.total_amount,
      status: webhookData.status || "pending",
      special_instructions: webhookData.special_instructions || "",
      
      // Vehicle information (for car detailing services)
      vehicle_make: webhookData.vehicle_make || "",
      vehicle_model: webhookData.vehicle_model || "",
      vehicle_year: webhookData.vehicle_year || null,
      vehicle_type: webhookData.vehicle_type || "",
      vehicle_color: webhookData.vehicle_color || "",
      license_plate: webhookData.license_plate || "",
      vehicle_notes: webhookData.vehicle_notes || "",
      parking_details: webhookData.parking_details || "",
      water_available: webhookData.water_available ?? true,
      electricity_available: webhookData.electricity_available ?? true,
      
      // System metadata
      timestamp: new Date().toISOString(),
      source: "wewash_booking_system",
      webhook_version: "2.0",
      
      // Communication templates
      whatsapp_message: whatsappMessage,
      email_subject: `Booking Confirmation - ${webhookData.service_name} | WeWash Zambia`,
      email_content: emailContent,
      
      // Service type flags for n8n workflow logic
      is_car_detailing: webhookData.service_category === 'Mobile Car Detailing',
      requires_vehicle_access: webhookData.service_category === 'Mobile Car Detailing',
      
      // Customer communication preferences
      has_email: !!webhookData.customer_email,
      has_whatsapp: !!webhookData.customer_phone,
    };

    let webhookResult = { success: false, error: "No webhook URL provided" };
    
    // Send to n8n webhook with retry logic
    if (webhookData.n8n_webhook_url) {
      console.log("=== SENDING TO N8N WEBHOOK ===");
      webhookResult = await sendWebhookWithRetry(webhookData.n8n_webhook_url, n8nPayload);
      
      if (webhookResult.success) {
        console.log("✅ Webhook delivered successfully to n8n");
      } else {
        console.error("❌ Webhook delivery failed:", webhookResult.error);
      }
    } else {
      console.log("⚠️ No webhook URL provided, skipping external notification");
    }

    const response: WebhookResponse = {
      success: true,
      message: "Booking webhook processed successfully",
      booking_id: webhookData.booking_id,
      webhook_delivered: webhookResult.success,
      webhook_error: webhookResult.error,
      retry_count: webhookData.retry_count || 0,
    };

    console.log("=== WEBHOOK PROCESSING COMPLETE ===");
    console.log("Response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("=== BOOKING WEBHOOK ERROR ===");
    console.error("Error details:", error);
    console.error("Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
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
