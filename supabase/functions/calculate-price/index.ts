import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRICING_CONTEXT = `You are WeWash Global's AI pricing assistant. Calculate service prices based on job descriptions.

BASE PRICES (ZMW - Zambian Kwacha):
- Home Cleaning: ZMW 350 (standard 2-3 bedroom)
- Deep Cleaning: ZMW 550 
- Move In/Out: ZMW 750
- Car Detailing Basic: ZMW 150
- Car Detailing Full: ZMW 350
- Car Detailing Premium: ZMW 500
- Fumigation Residential: ZMW 400
- Fumigation Commercial: ZMW 800+
- Office Cleaning Daily: ZMW 200
- Trained Maids Daily: ZMW 150

DISTANCE PRICING:
- 0-10km from CBD: No extra charge
- 10-20km: +ZMW 50
- 20-30km: +ZMW 100
- 30-50km: +ZMW 150
- 50km+: +ZMW 200

SIZE MULTIPLIERS:
- Small (1-2 bedrooms / small office): 1x
- Medium (3-4 bedrooms / medium office): 1.3x
- Large (5+ bedrooms / large office): 1.6x
- Extra Large (mansion / commercial): 2x+

CONDITION MULTIPLIERS:
- Clean/Maintained: 1x
- Average: 1.2x
- Dirty/Neglected: 1.5x
- Very Dirty/Hoarder: 2x

ADDITIONAL SERVICES:
- Windows (per window): +ZMW 20
- Carpets (per room): +ZMW 100
- Upholstery: +ZMW 150
- Garden cleanup: +ZMW 200
- Kitchen deep clean: +ZMW 150
- Bathroom deep clean: +ZMW 100

Analyze the job description and return a JSON response with this EXACT structure:
{
  "estimatedPrice": number,
  "priceRange": { "min": number, "max": number },
  "breakdown": [
    { "item": "Base Service", "amount": number },
    { "item": "Distance (Xkm)", "amount": number },
    { "item": "Size adjustment", "amount": number }
  ],
  "serviceType": "string",
  "confidence": "high" | "medium" | "low",
  "notes": "string explaining the estimate",
  "needsQuote": boolean
}

Set needsQuote=true if:
- Job is very complex
- Multiple services needed
- Commercial/institutional
- Recurring/contract work
- Special requirements mentioned

Be helpful and accurate. Always provide a reasonable estimate even for complex jobs.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, location, serviceType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `Calculate price for this cleaning job:

Service Type: ${serviceType || 'Not specified'}
Location: ${location || 'Lusaka (unknown distance)'}
Job Description: ${jobDescription}

Analyze carefully and provide accurate pricing in JSON format.`;

    console.log("AI Price Calculator: Processing request");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: PRICING_CONTEXT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    console.log("AI Response:", aiResponse);

    // Extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const priceData = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(priceData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback response
    return new Response(JSON.stringify({
      estimatedPrice: 400,
      priceRange: { min: 300, max: 600 },
      breakdown: [{ item: "Estimated service", amount: 400 }],
      serviceType: serviceType || "General Cleaning",
      confidence: "low",
      notes: "Unable to parse job details. Please provide more information or contact us for a quote.",
      needsQuote: true,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Price calculator error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      estimatedPrice: 350,
      priceRange: { min: 250, max: 500 },
      breakdown: [{ item: "Base estimate", amount: 350 }],
      confidence: "low",
      needsQuote: true,
      notes: "Error calculating price. Please contact us for a quote."
    }), {
      status: 200, // Return 200 with fallback data
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
