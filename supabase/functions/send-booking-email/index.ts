import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  package: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  totalAmount: number;
  currency?: string;
  specialInstructions?: string;
  vehicleInfo?: {
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    type?: string;
    licensePlate?: string;
  };
}

// HTML-escape user data to prevent XSS in emails
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function sanitizeText(text: string, maxLength: number): string {
  return text.substring(0, maxLength).trim();
}

function validateBookingEmail(payload: any): { valid: boolean; error?: string; sanitized?: BookingEmailRequest } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Invalid payload' };
  }

  if (!payload.customerName || typeof payload.customerName !== 'string' || payload.customerName.trim().length < 2) {
    return { valid: false, error: 'Valid customer name is required' };
  }

  if (!payload.customerPhone || typeof payload.customerPhone !== 'string') {
    return { valid: false, error: 'Customer phone is required' };
  }

  if (!payload.service || typeof payload.service !== 'string') {
    return { valid: false, error: 'Service is required' };
  }

  if (!payload.scheduledDate || !payload.scheduledTime || !payload.address) {
    return { valid: false, error: 'Date, time, and address are required' };
  }

  if (typeof payload.totalAmount !== 'number' || payload.totalAmount < 0) {
    return { valid: false, error: 'Valid total amount is required' };
  }

  const sanitized: BookingEmailRequest = {
    customerName: sanitizeText(payload.customerName, 100),
    customerPhone: sanitizeText(payload.customerPhone, 20),
    customerEmail: payload.customerEmail ? sanitizeText(String(payload.customerEmail), 255) : undefined,
    service: sanitizeText(payload.service, 200),
    package: sanitizeText(payload.package || 'Standard', 100),
    scheduledDate: sanitizeText(payload.scheduledDate, 20),
    scheduledTime: sanitizeText(payload.scheduledTime, 20),
    address: sanitizeText(payload.address, 500),
    totalAmount: Math.round(payload.totalAmount * 100) / 100,
    currency: sanitizeText(payload.currency || 'ZMW', 5),
    specialInstructions: payload.specialInstructions ? sanitizeText(String(payload.specialInstructions), 1000) : undefined,
    vehicleInfo: payload.vehicleInfo ? {
      make: payload.vehicleInfo.make ? sanitizeText(String(payload.vehicleInfo.make), 50) : undefined,
      model: payload.vehicleInfo.model ? sanitizeText(String(payload.vehicleInfo.model), 50) : undefined,
      year: typeof payload.vehicleInfo.year === 'number' ? payload.vehicleInfo.year : undefined,
      color: payload.vehicleInfo.color ? sanitizeText(String(payload.vehicleInfo.color), 30) : undefined,
      type: payload.vehicleInfo.type ? sanitizeText(String(payload.vehicleInfo.type), 30) : undefined,
      licensePlate: payload.vehicleInfo.licensePlate ? sanitizeText(String(payload.vehicleInfo.licensePlate), 20) : undefined,
    } : undefined,
  };

  return { valid: true, sanitized };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawPayload = await req.json();
    
    const validation = validateBookingEmail(rawPayload);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const booking = validation.sanitized!;
    
    console.log("Sending booking email notification");

    // HTML-escape all user-provided data before embedding in HTML
    const safeName = escapeHtml(booking.customerName);
    const safePhone = escapeHtml(booking.customerPhone);
    const safeEmail = booking.customerEmail ? escapeHtml(booking.customerEmail) : '';
    const safeService = escapeHtml(booking.service);
    const safePackage = escapeHtml(booking.package);
    const safeDate = escapeHtml(booking.scheduledDate);
    const safeTime = escapeHtml(booking.scheduledTime);
    const safeAddress = escapeHtml(booking.address);
    const safeCurrency = escapeHtml(booking.currency || 'ZMW');
    const safeInstructions = booking.specialInstructions ? escapeHtml(booking.specialInstructions) : '';

    let vehicleSection = '';
    if (booking.vehicleInfo && booking.vehicleInfo.make) {
      vehicleSection = `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #374151;">Vehicle Details</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
            ${escapeHtml(String(booking.vehicleInfo.year || ''))} ${escapeHtml(booking.vehicleInfo.make)} ${escapeHtml(booking.vehicleInfo.model || '')}<br/>
            ${booking.vehicleInfo.color ? `Color: ${escapeHtml(booking.vehicleInfo.color)}` : ''}<br/>
            ${booking.vehicleInfo.licensePlate ? `Plate: ${escapeHtml(booking.vehicleInfo.licensePlate)}` : ''}
          </td>
        </tr>
      `;
    }

    // Build phone link safely - only digits
    const phoneDigits = booking.customerPhone.replace(/\D/g, '');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Received</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 32px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🧹 New Booking Received!</h1>
                      <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 16px;">WeWash Global Booking System</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 32px;">
                      <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">📋 Booking Details</h2>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #374151;">Customer Name</strong></td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">${safeName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #374151;">Phone</strong></td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                            <a href="tel:${phoneDigits}" style="color: #0ea5e9; text-decoration: none;">${safePhone}</a>
                          </td>
                        </tr>
                        ${safeEmail ? `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #374151;">Email</strong></td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                            <a href="mailto:${safeEmail}" style="color: #0ea5e9; text-decoration: none;">${safeEmail}</a>
                          </td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #374151;">Service</strong></td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">${safeService} (${safePackage})</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #374151;">Date &amp; Time</strong></td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">📅 ${safeDate} at ${safeTime}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #374151;">Location</strong></td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">📍 ${safeAddress}</td>
                        </tr>
                        ${vehicleSection}
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #374151;">Amount</strong></td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <span style="color: #059669; font-size: 18px; font-weight: 700;">${safeCurrency} ${booking.totalAmount.toLocaleString()}</span>
                          </td>
                        </tr>
                        ${safeInstructions ? `
                        <tr>
                          <td colspan="2" style="padding: 12px 0;">
                            <strong style="color: #374151;">Special Instructions:</strong>
                            <p style="color: #6b7280; margin: 8px 0 0 0; font-style: italic;">${safeInstructions}</p>
                          </td>
                        </tr>
                        ` : ''}
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                        <tr>
                          <td align="center">
                            <a href="https://wa.me/${phoneDigits}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 12px;">📱 WhatsApp Customer</a>
                            <a href="tel:${phoneDigits}" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">📞 Call Customer</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        This is an automated notification from WeWash Global Booking System.<br/>
                        <a href="https://wewash.co.zm" style="color: #0ea5e9; text-decoration: none;">wewash.co.zm</a> | +260 768 671 420
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "WeWash Bookings <bookings@wewashglobal.com>",
      to: ["booking@wewashglobal.com"],
      subject: `🧹 New Booking: ${safeService} - ${safeName}`,
      html: emailHtml,
      reply_to: booking.customerEmail || undefined,
    });

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
