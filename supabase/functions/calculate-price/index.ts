import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateChatCompletion } from 'npm:@lovable.dev/ai-gateway@0.1.11';
import { ASSESSMENT_MESSAGE } from '../_shared/solarcare-pricing.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRICING_CONTEXT = `You are WeWash Global's AI pricing assistant for Zambia. Calculate service prices based on job descriptions using the EXACT master price structure below.

MASTER PRICE STRUCTURE (ZMW - Zambian Kwacha):

HOME CLEANING - General Cleaning (Interior Only):
- 1 Bedroom: K550
- 2 Bedroom: K700
- 3 Bedroom: K900
- 4 Bedroom: K1,100

HOME CLEANING - Deep Cleaning:
- 1 Bedroom: K850
- 2 Bedroom: K1,200
- 3 Bedroom: K1,800
- 4 Bedroom: K2,500

HOME CLEANING - Post-Construction Cleaning:
- 1 Bedroom: K1,500
- 2 Bedroom: K2,000
- 3 Bedroom: K2,800
- 4 Bedroom: K3,500

WINDOWS:
- Interior Standard Window: K35 each
- Interior Large Aluminum Window: K60 each
- Exterior Window: K50–K80 each depending on height

CAR DETAILING:
- Interior Deep Clean Small Car: K450
- Interior Deep Clean SUV: K550
- Full Detailing Small Car: K650
- Full Detailing SUV: K850
- Seat Removal Add-On: K150–K250 depending on vehicle size

FUMIGATION:
- Residential: K400+
- Commercial: K800+
- Termite Treatment: K1,200+

OFFICE CLEANING:
- Daily: K200/day
- Weekly: K800/week
- Monthly: K2,800/month

MAID SERVICE:
- Daily: K150/day
- Live-in Monthly: K2,500/month

FACILITY MANAGEMENT:
- Starting from K2,500/month

TRANSPORT CALCULATION (from D13 Antelope Close, Kabulonga):
- 0–5km: K120 return
- 5–10km: K180 return
- 10–20km: K250 return
- 20km+: K350–K450 return

CONDITION MULTIPLIERS:
- Light/Clean condition: 1.0x
- Moderate dirt: 1.2x
- Heavy dirt: 1.4x
- Post-construction debris: 1.6x

TOTAL FORMULA:
(Base Service Price + Window Add-ons) × Condition Multiplier + Transport Estimate = Estimated Total

IMPORTANT RULES:
1. ALL prices are "Starting From" estimates
2. Never show a price lower than the base price for the service type and size
3. Always include transport as a separate line item
4. Always apply condition multiplier based on described condition
5. If bedrooms not specified for home cleaning, assume 2 bedrooms
6. If condition not described, assume "Moderate dirt" (1.2x)
7. If location not specified, assume 10-20km (K250 transport)

Return a JSON response with this EXACT structure:
{
  "estimatedPrice": number (total including everything),
  "priceRange": { "min": number, "max": number },
  "breakdown": [
    { "item": "Base Service (describe)", "amount": number },
    { "item": "Window Add-ons (if any)", "amount": number },
    { "item": "Condition Adjustment (Xx multiplier)", "amount": number },
    { "item": "Transport Estimate (Yango Return)", "amount": number }
  ],
  "serviceType": "string",
  "confidence": "high" | "medium" | "low",
  "conditionMultiplier": number,
  "transportEstimate": number,
  "notes": "string explaining the estimate and what factors could change final price",
  "needsQuote": boolean
}

Remove zero-amount items from breakdown.
Set needsQuote=true if: job is complex, multiple services, commercial/institutional, recurring/contract, or special requirements.
Always be realistic with Zambian market pricing. Never underquote.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Paid AI estimate: signed-in users only.
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const authClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
    const { data: claims } = token ? await authClient.auth.getClaims(token) : { data: null };
    if (!claims?.claims?.sub || claims.claims.role !== 'authenticated') {
      return new Response(JSON.stringify({ error: 'Please sign in to get an AI estimate' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { jobDescription, location, serviceType } = await req.json();
    // Do not pass SolarCare to the unrelated master-price prompt or its monetary fallback.
    // Approved SolarCare calculations are handled by solarcare-pricing with structured inputs.
    if (/solarcare|solar\s*(panel|farm|clean)|photovoltaic|\bpv\b/i.test(`${serviceType || ''} ${jobDescription || ''}`)) {
      return new Response(JSON.stringify({ serviceType: 'SolarCare', estimatedPrice: null, priceRange: null, breakdown: [], needsQuote: true, notes: ASSESSMENT_MESSAGE, followUp: ['Which SolarCare package and installation type?', 'What panel count, surface area or capacity is known?', 'What safe access, water quality, equipment and schedule are required?'] }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (typeof jobDescription !== 'string' || jobDescription.length < 3 || jobDescription.length > 2000) {
      return new Response(JSON.stringify({ error: 'Invalid job description' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userPrompt = `Calculate price for this cleaning job:

Service Type: ${serviceType || 'Not specified'}
Location: ${location || 'Lusaka (unknown distance from Kabulonga)'}
Job Description: ${jobDescription}

Analyze carefully using the master price structure. Include transport and condition multiplier. Return JSON only.`;

    console.log("AI Price Estimator: Processing request");

    const data = await generateChatCompletion({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: PRICING_CONTEXT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
    });
    const aiResponse = data.choices?.[0]?.message?.content || '';

    console.log("AI Response:", aiResponse);

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const priceData = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(priceData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      estimatedPrice: 1200,
      priceRange: { min: 900, max: 1800 },
      breakdown: [
        { item: "Base Service Estimate", amount: 700 },
        { item: "Condition Adjustment (1.2x)", amount: 140 },
        { item: "Transport Estimate (Yango Return)", amount: 250 },
      ],
      serviceType: serviceType || "General Cleaning",
      confidence: "low",
      conditionMultiplier: 1.2,
      transportEstimate: 250,
      notes: "Unable to parse full job details. This is a rough estimate. Please request a professional assessment for accurate pricing.",
      needsQuote: true,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Price estimator error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      estimatedPrice: 1000,
      priceRange: { min: 700, max: 1500 },
      breakdown: [
        { item: "Base Estimate", amount: 700 },
        { item: "Transport Estimate (Yango Return)", amount: 250 },
      ],
      confidence: "low",
      conditionMultiplier: 1.0,
      transportEstimate: 250,
      needsQuote: true,
      notes: "Error calculating price. Please contact our sales team for an accurate quote."
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
