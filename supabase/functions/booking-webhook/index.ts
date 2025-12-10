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

interface ValidationError {
  field: string;
  message: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 5000];

// Validation helpers
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const zambianPhoneRegex = /^(\+?260|0)?[97]\d{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM)?$/i;

function sanitizeText(text: string, maxLength: number): string {
  return text
    .substring(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

function validateBookingWebhook(payload: any): { valid: boolean; errors: ValidationError[]; sanitized?: BookingWebhookRequest } {
  const errors: ValidationError[] = [];

  // Booking ID validation
  if (!payload.booking_id || typeof payload.booking_id !== 'string') {
    errors.push({ field: 'booking_id', message: 'Booking ID is required' });
  } else if (!uuidRegex.test(payload.booking_id)) {
    errors.push({ field: 'booking_id', message: 'Invalid booking ID format' });
  }

  // Customer name validation
  if (!payload.customer_name || typeof payload.customer_name !== 'string') {
    errors.push({ field: 'customer_name', message: 'Customer name is required' });
  } else if (payload.customer_name.trim().length < 2) {
    errors.push({ field: 'customer_name', message: 'Customer name must be at least 2 characters' });
  } else if (payload.customer_name.length > 100) {
    errors.push({ field: 'customer_name', message: 'Customer name cannot exceed 100 characters' });
  }

  // Customer phone validation
  if (!payload.customer_phone || typeof payload.customer_phone !== 'string') {
    errors.push({ field: 'customer_phone', message: 'Customer phone is required' });
  } else {
    const cleanPhone = payload.customer_phone.replace(/\s/g, '');
    if (!zambianPhoneRegex.test(cleanPhone)) {
      errors.push({ field: 'customer_phone', message: 'Please enter a valid Zambian phone number' });
    }
  }

  // Customer email validation (optional)
  if (payload.customer_email && typeof payload.customer_email === 'string' && payload.customer_email.trim()) {
    if (!emailRegex.test(payload.customer_email)) {
      errors.push({ field: 'customer_email', message: 'Please enter a valid email address' });
    } else if (payload.customer_email.length > 255) {
      errors.push({ field: 'customer_email', message: 'Email cannot exceed 255 characters' });
    }
  }

  // Customer address validation
  if (!payload.customer_address || typeof payload.customer_address !== 'string') {
    errors.push({ field: 'customer_address', message: 'Customer address is required' });
  } else if (payload.customer_address.trim().length < 10) {
    errors.push({ field: 'customer_address', message: 'Please provide a more detailed address' });
  } else if (payload.customer_address.length > 500) {
    errors.push({ field: 'customer_address', message: 'Address cannot exceed 500 characters' });
  }

  // Service name validation
  if (!payload.service_name || typeof payload.service_name !== 'string') {
    errors.push({ field: 'service_name', message: 'Service name is required' });
  } else if (payload.service_name.length > 200) {
    errors.push({ field: 'service_name', message: 'Service name cannot exceed 200 characters' });
  }

  // Scheduled date validation
  if (!payload.scheduled_date || typeof payload.scheduled_date !== 'string') {
    errors.push({ field: 'scheduled_date', message: 'Scheduled date is required' });
  } else if (!dateRegex.test(payload.scheduled_date)) {
    errors.push({ field: 'scheduled_date', message: 'Invalid date format (use YYYY-MM-DD)' });
  }

  // Scheduled time validation
  if (!payload.scheduled_time || typeof payload.scheduled_time !== 'string') {
    errors.push({ field: 'scheduled_time', message: 'Scheduled time is required' });
  } else if (!timeRegex.test(payload.scheduled_time)) {
    errors.push({ field: 'scheduled_time', message: 'Invalid time format' });
  }

  // Total amount validation
  if (typeof payload.total_amount !== 'number' || isNaN(payload.total_amount)) {
    errors.push({ field: 'total_amount', message: 'Total amount must be a valid number' });
  } else if (payload.total_amount < 0) {
    errors.push({ field: 'total_amount', message: 'Total amount cannot be negative' });
  } else if (payload.total_amount > 10000000) {
    errors.push({ field: 'total_amount', message: 'Total amount exceeds maximum allowed' });
  }

  // Vehicle year validation (optional)
  if (payload.vehicle_year !== undefined && payload.vehicle_year !== null) {
    const year = Number(payload.vehicle_year);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      errors.push({ field: 'vehicle_year', message: 'Invalid vehicle year' });
    }
  }

  // Webhook URL validation (optional)
  if (payload.n8n_webhook_url && typeof payload.n8n_webhook_url === 'string') {
    try {
      const url = new URL(payload.n8n_webhook_url);
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push({ field: 'n8n_webhook_url', message: 'Webhook URL must use HTTP or HTTPS' });
      }
    } catch {
      errors.push({ field: 'n8n_webhook_url', message: 'Invalid webhook URL' });
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Return sanitized data
  const sanitized: BookingWebhookRequest = {
    booking_id: payload.booking_id.trim(),
    customer_name: sanitizeText(payload.customer_name, 100),
    customer_phone: payload.customer_phone.replace(/\s/g, '').substring(0, 15),
    customer_email: payload.customer_email?.trim().substring(0, 255) || undefined,
    customer_address: sanitizeText(payload.customer_address, 500),
    service_name: sanitizeText(payload.service_name, 200),
    service_category: payload.service_category ? sanitizeText(payload.service_category, 100) : undefined,
    scheduled_date: payload.scheduled_date,
    scheduled_time: payload.scheduled_time,
    total_amount: Math.round(payload.total_amount * 100) / 100,
    status: payload.status ? sanitizeText(payload.status, 50) : 'pending',
    special_instructions: payload.special_instructions ? sanitizeText(payload.special_instructions, 1000) : undefined,
    vehicle_make: payload.vehicle_make ? sanitizeText(payload.vehicle_make, 50) : undefined,
    vehicle_model: payload.vehicle_model ? sanitizeText(payload.vehicle_model, 50) : undefined,
    vehicle_year: payload.vehicle_year ? Number(payload.vehicle_year) : undefined,
    vehicle_type: payload.vehicle_type ? sanitizeText(payload.vehicle_type, 30) : undefined,
    vehicle_color: payload.vehicle_color ? sanitizeText(payload.vehicle_color, 30) : undefined,
    license_plate: payload.license_plate ? sanitizeText(payload.license_plate, 20) : undefined,
    vehicle_notes: payload.vehicle_notes ? sanitizeText(payload.vehicle_notes, 500) : undefined,
    parking_details: payload.parking_details ? sanitizeText(payload.parking_details, 200) : undefined,
    water_available: typeof payload.water_available === 'boolean' ? payload.water_available : true,
    electricity_available: typeof payload.electricity_available === 'boolean' ? payload.electricity_available : true,
    n8n_webhook_url: payload.n8n_webhook_url?.trim().substring(0, 500) || undefined,
    retry_count: typeof payload.retry_count === 'number' ? Math.min(payload.retry_count, 10) : 0,
  };

  return { valid: true, errors: [], sanitized };
}

const sendWebhookWithRetry = async (webhookUrl: string, payload: any, retryCount = 0): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`Attempting webhook delivery (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
    
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
      console.error(`Webhook failed with status ${response.status}`);
      
      if ((response.status >= 500 || response.status === 429) && retryCount < MAX_RETRIES) {
        console.log(`Retrying webhook in ${RETRY_DELAYS[retryCount]}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[retryCount]));
        return sendWebhookWithRetry(webhookUrl, payload, retryCount + 1);
      }
      
      return { success: false, error: `HTTP ${response.status}` };
    }

    console.log("Webhook delivered successfully");
    return { success: true };

  } catch (error) {
    console.error(`Webhook delivery error (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying webhook in ${RETRY_DELAYS[retryCount]}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[retryCount]));
      return sendWebhookWithRetry(webhookUrl, payload, retryCount + 1);
    }
    
    return { success: false, error: 'Network error' };
  }
};

const generateMessageTemplates = (data: BookingWebhookRequest) => {
  const isCarDetailing = data.service_category === 'Mobile Car Detailing';
  
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawPayload = await req.json();
    
    // Validate and sanitize input
    const validation = validateBookingWebhook(rawPayload);
    if (!validation.valid) {
      console.error('Booking webhook validation failed:', validation.errors);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: validation.errors,
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const webhookData = validation.sanitized!;
    
    console.log("=== BOOKING WEBHOOK RECEIVED ===");
    console.log("Booking ID:", webhookData.booking_id);
    console.log("Service:", webhookData.service_name);

    // Generate service-specific message templates
    const { whatsappMessage, emailContent } = generateMessageTemplates(webhookData);

    // Prepare enhanced data for n8n workflow
    const n8nPayload = {
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
      status: webhookData.status,
      special_instructions: webhookData.special_instructions || "",
      vehicle_make: webhookData.vehicle_make || "",
      vehicle_model: webhookData.vehicle_model || "",
      vehicle_year: webhookData.vehicle_year || null,
      vehicle_type: webhookData.vehicle_type || "",
      vehicle_color: webhookData.vehicle_color || "",
      license_plate: webhookData.license_plate || "",
      vehicle_notes: webhookData.vehicle_notes || "",
      parking_details: webhookData.parking_details || "",
      water_available: webhookData.water_available,
      electricity_available: webhookData.electricity_available,
      timestamp: new Date().toISOString(),
      source: "wewash_booking_system",
      webhook_version: "2.0",
      whatsapp_message: whatsappMessage,
      email_subject: `Booking Confirmation - ${webhookData.service_name} | WeWash Zambia`,
      email_content: emailContent,
      is_car_detailing: webhookData.service_category === 'Mobile Car Detailing',
      requires_vehicle_access: webhookData.service_category === 'Mobile Car Detailing',
      has_email: !!webhookData.customer_email,
      has_whatsapp: !!webhookData.customer_phone,
    };

    let webhookResult = { success: false, error: "No webhook URL provided" };
    
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

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("=== BOOKING WEBHOOK ERROR ===");
    console.error("Error:", error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "An error occurred processing the webhook",
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
