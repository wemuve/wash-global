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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingEmailRequest = await req.json();
    
    console.log("Sending booking email notification for:", booking.customerName);

    // Format vehicle info if present
    let vehicleSection = '';
    if (booking.vehicleInfo && booking.vehicleInfo.make) {
      vehicleSection = `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #374151;">Vehicle Details</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
            ${booking.vehicleInfo.year || ''} ${booking.vehicleInfo.make} ${booking.vehicleInfo.model}<br/>
            ${booking.vehicleInfo.color ? `Color: ${booking.vehicleInfo.color}` : ''}<br/>
            ${booking.vehicleInfo.licensePlate ? `Plate: ${booking.vehicleInfo.licensePlate}` : ''}
          </td>
        </tr>
      `;
    }

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
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 32px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🧹 New Booking Received!</h1>
                      <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 16px;">WeWash Global Booking System</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 32px;">
                      <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">📋 Booking Details</h2>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Customer Name</strong>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                            ${booking.customerName}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Phone</strong>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                            <a href="tel:${booking.customerPhone}" style="color: #0ea5e9; text-decoration: none;">${booking.customerPhone}</a>
                          </td>
                        </tr>
                        ${booking.customerEmail ? `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Email</strong>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                            <a href="mailto:${booking.customerEmail}" style="color: #0ea5e9; text-decoration: none;">${booking.customerEmail}</a>
                          </td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Service</strong>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                            ${booking.service} (${booking.package})
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Date & Time</strong>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                            📅 ${booking.scheduledDate} at ${booking.scheduledTime}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Location</strong>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                            📍 ${booking.address}
                          </td>
                        </tr>
                        ${vehicleSection}
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #374151;">Amount</strong>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <span style="color: #059669; font-size: 18px; font-weight: 700;">${booking.currency || 'ZMW'} ${booking.totalAmount.toLocaleString()}</span>
                          </td>
                        </tr>
                        ${booking.specialInstructions ? `
                        <tr>
                          <td colspan="2" style="padding: 12px 0;">
                            <strong style="color: #374151;">Special Instructions:</strong>
                            <p style="color: #6b7280; margin: 8px 0 0 0; font-style: italic;">${booking.specialInstructions}</p>
                          </td>
                        </tr>
                        ` : ''}
                      </table>
                      
                      <!-- Action Buttons -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                        <tr>
                          <td align="center">
                            <a href="https://wa.me/${booking.customerPhone.replace(/\D/g, '')}" 
                               style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 12px;">
                              📱 WhatsApp Customer
                            </a>
                            <a href="tel:${booking.customerPhone}" 
                               style="display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                              📞 Call Customer
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
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
      subject: `🧹 New Booking: ${booking.service} - ${booking.customerName}`,
      html: emailHtml,
      reply_to: booking.customerEmail || undefined,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
