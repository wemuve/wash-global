import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WEWASH_CONTEXT = `You are the AI Receptionist for WeWash Global, a premium cleaning and property services company based in Lusaka, Zambia. WeWash is a daughter brand of WeMuve, our parent company in Denmark.

COMPANY INFORMATION:
- Website: wewash.co.zm
- WhatsApp: +260 768 671 420
- Email: hello@wewash.co.zm
- Location: Lusaka, Zambia
- Operating Hours: Monday-Saturday 7am-7pm, Sunday 8am-4pm

SERVICES & PRICING (Zambian Kwacha - ZMW):

1. HOME CLEANING:
   - Standard Clean: ZMW 350 (2-3 bedroom house)
   - Deep Clean: ZMW 550 (includes windows, carpets)
   - Move In/Out Clean: ZMW 750

2. MOBILE CAR DETAILING:
   - Basic Wash: ZMW 150
   - Full Detail: ZMW 350
   - Premium Detail: ZMW 500 (includes interior shampooing)

3. FUMIGATION & PEST CONTROL:
   - Residential: ZMW 400
   - Commercial: ZMW 800+
   - Termite Treatment: ZMW 1,200+

4. FACILITY MANAGEMENT:
   - Custom quotes based on property size
   - Monthly contracts available
   - Starting from ZMW 2,500/month

5. OFFICE CLEANING:
   - Daily: ZMW 200/day
   - Weekly: ZMW 800/week
   - Monthly Contract: ZMW 2,800/month

6. TRAINED MAIDS & HOUSEKEEPERS:
   - Daily: ZMW 150/day
   - Live-in: ZMW 2,500/month
   - Part-time: ZMW 100/session

PACKAGE TIERS:
- Standard: Base price
- Premium: 1.5x price (includes premium products, extended warranty)
- VIP: 2x price (priority scheduling, dedicated team, 24/7 support)

PAYMENT:
- Customers pay AFTER the service is completed
- We accept: Cash, Mobile Money (MTN, Airtel), Bank Transfer
- No upfront payment required

YOUR ROLE:
1. Answer questions about services and pricing
2. Help customers book services by collecting: name, phone, address, service type, preferred date/time
3. Be friendly, professional, and helpful
4. When customer wants to book, collect all details and confirm the booking
5. Always mention WhatsApp (+260 768 671 420) for direct contact
6. For complex quotes, suggest speaking with our team
7. IMPORTANT: When a customer shares their contact information (name AND phone number), acknowledge it and let them know our team will reach out

LEAD CAPTURE:
When you detect a customer's name and phone number in the conversation, respond with a special JSON block at the END of your message like this:
[LEAD_DATA]{"name":"Customer Name","phone":"0971234567","service":"Service they're interested in","message":"Brief summary of inquiry"}[/LEAD_DATA]

This helps our team follow up quickly. Only include this when you have BOTH name and phone.

BOOKING PROCESS:
When a customer wants to book, collect:
- Full name
- Phone number
- Address/Location
- Service type
- Preferred date
- Preferred time slot
- Any special instructions

Respond in a friendly, professional tone. Keep responses concise but helpful. Use currency ZMW for Zambia.`;

// Validation helpers
interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: { messages: Array<{ role: string; content: string }> };
}

function sanitizeText(text: string, maxLength: number): string {
  // Remove potential injection patterns and limit length
  return text
    .substring(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

function validateMessages(payload: any): ValidationResult {
  // Check if messages array exists
  if (!payload || !Array.isArray(payload.messages)) {
    return { valid: false, error: 'Messages array is required' };
  }

  // Limit number of messages to prevent abuse
  if (payload.messages.length > 50) {
    return { valid: false, error: 'Too many messages in conversation history' };
  }

  const sanitizedMessages: Array<{ role: string; content: string }> = [];

  for (let i = 0; i < payload.messages.length; i++) {
    const msg = payload.messages[i];
    
    // Validate message structure
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: `Invalid message at index ${i}` };
    }

    // Validate role
    const validRoles = ['user', 'assistant', 'system'];
    if (!msg.role || !validRoles.includes(msg.role)) {
      return { valid: false, error: `Invalid role at message ${i}` };
    }

    // Validate content
    if (typeof msg.content !== 'string') {
      return { valid: false, error: `Invalid content at message ${i}` };
    }

    // Limit message length (10,000 chars per message)
    if (msg.content.length > 10000) {
      return { valid: false, error: `Message ${i} exceeds maximum length` };
    }

    // Sanitize and add message
    sanitizedMessages.push({
      role: msg.role,
      content: sanitizeText(msg.content, 10000),
    });
  }

  return { valid: true, sanitized: { messages: sanitizedMessages } };
}

// Validate lead data before saving
function validateLeadData(leadData: any): { valid: boolean; sanitized?: any } {
  if (!leadData || typeof leadData !== 'object') {
    return { valid: false };
  }

  const zambianPhoneRegex = /^(\+?260|0)?[97]\d{8}$/;
  
  // Validate name
  if (!leadData.name || typeof leadData.name !== 'string' || leadData.name.trim().length < 2) {
    return { valid: false };
  }

  // Validate phone
  if (!leadData.phone || typeof leadData.phone !== 'string') {
    return { valid: false };
  }

  const cleanPhone = leadData.phone.replace(/\s/g, '');
  if (!zambianPhoneRegex.test(cleanPhone)) {
    console.log('Invalid phone format in lead data:', cleanPhone);
    return { valid: false };
  }

  return {
    valid: true,
    sanitized: {
      name: sanitizeText(leadData.name, 100),
      phone: cleanPhone.substring(0, 15),
      service: leadData.service ? sanitizeText(String(leadData.service), 200) : null,
      message: leadData.message ? sanitizeText(String(leadData.message), 500) : null,
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawPayload = await req.json();
    
    // Validate and sanitize input
    const validation = validateMessages(rawPayload);
    if (!validation.valid) {
      console.error('AI Receptionist validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = validation.sanitized!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("AI Receptionist: Processing request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: WEWASH_CONTEXT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a transform stream to intercept and process lead data
    const { readable, writable } = new TransformStream({
      transform: async (chunk, controller) => {
        const text = new TextDecoder().decode(chunk);
        
        // Check for lead data pattern
        const leadMatch = text.match(/\[LEAD_DATA\](.*?)\[\/LEAD_DATA\]/s);
        if (leadMatch && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
          try {
            const rawLeadData = JSON.parse(leadMatch[1]);
            
            // Validate lead data before saving
            const leadValidation = validateLeadData(rawLeadData);
            if (leadValidation.valid) {
              const leadData = leadValidation.sanitized;
              console.log("Valid lead detected, saving...");
              
              // Save lead to database
              const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
              await supabase.from('leads').insert({
                customer_name: leadData.name,
                customer_phone: leadData.phone,
                service_interest: leadData.service ? [leadData.service] : [],
                message: leadData.message,
                source: 'ai_receptionist',
                status: 'new',
              });

              // Send WhatsApp notification
              const WHATSAPP_WEBHOOK_URL = Deno.env.get("WHATSAPP_WEBHOOK_URL");
              if (WHATSAPP_WEBHOOK_URL) {
                try {
                  await fetch(WHATSAPP_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      message: `🔔 *New Lead from AI Receptionist!*\n\n👤 *Name:* ${leadData.name}\n📱 *Phone:* ${leadData.phone}\n🛠️ *Interest:* ${leadData.service || 'General'}\n💬 *Message:* ${leadData.message || 'N/A'}`,
                      phone: leadData.phone,
                      type: 'lead',
                      timestamp: new Date().toISOString(),
                    }),
                  });
                  console.log("WhatsApp notification sent for lead");
                } catch (whatsappError) {
                  console.error("WhatsApp notification failed:", whatsappError);
                }
              }
            } else {
              console.log("Invalid lead data format, skipping save");
            }
            
            // Remove the lead data block from the response
            const cleanedText = text.replace(/\[LEAD_DATA\].*?\[\/LEAD_DATA\]/s, '');
            controller.enqueue(new TextEncoder().encode(cleanedText));
            return;
          } catch (parseError) {
            console.error("Failed to parse lead data:", parseError);
          }
        }
        
        controller.enqueue(chunk);
      }
    });

    response.body?.pipeTo(writable);

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Receptionist error:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
