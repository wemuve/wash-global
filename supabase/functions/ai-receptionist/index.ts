import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WEWASH_CONTEXT = `You are the AI Receptionist for WeWash Global, a premium cleaning and property services company based in Zambia with connections to Denmark.

COMPANY INFORMATION:
- Website: wewashglobal.com
- WhatsApp: +260 768 671 420
- Email: hello@wewashglobal.com
- Location: Lusaka, Zambia (with Denmark connection)
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

YOUR ROLE:
1. Answer questions about services and pricing
2. Help customers book services by collecting: name, phone, address, service type, preferred date/time
3. Be friendly, professional, and helpful
4. When customer wants to book, collect all details and confirm the booking
5. Always mention WhatsApp (+260 768 671 420) for direct contact
6. For complex quotes, suggest speaking with our team

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Receptionist error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
