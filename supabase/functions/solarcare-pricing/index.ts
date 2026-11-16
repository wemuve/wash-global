import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { SOLAR_PRICING_KEY, solarPricingConfigSchema, emptySolarPricing, calculateSolarEstimate, solarScopeSchema } from '../_shared/solarcare-pricing.ts';
import { solarEnquirySchema } from '../_shared/solarcare.ts';

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);
  const url = Deno.env.get('SUPABASE_URL'), key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return response({ error: 'Service unavailable' }, 503);
  const db = createClient(url, key);
  try {
    const body = await req.json();
    const { data: setting, error: readError } = await db.from('app_settings').select('value').eq('key', SOLAR_PRICING_KEY).maybeSingle();
    if (readError) return response({ error: 'Pricing settings unavailable' }, 503);
    const config = setting?.value || emptySolarPricing();
    if (body.action === 'estimate') {
      const enquiry = solarEnquirySchema.safeParse(body.enquiry);
      const scope = solarScopeSchema.safeParse(body.scope);
      if (!enquiry.success || !scope.success) return response({ error: 'Check the installation and contact details.' }, 400);
      return response(calculateSolarEstimate({ ...enquiry.data, ...scope.data }, config));
    }
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const { data: { user } } = await db.auth.getUser(token || '');
    if (!user) return response({ error: 'Sign in required' }, 401);
    const { data: roles } = await db.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin');
    if (!roles?.length) return response({ error: 'Administrator access required' }, 403);
    if (body.action === 'read') return response({ config });
    if (body.action === 'save') {
      const parsed = solarPricingConfigSchema.safeParse(body.config);
      if (!parsed.success) return response({ error: parsed.error.issues.map(i => i.message).join(' ') }, 400);
      const { error } = await db.from('app_settings').upsert({ key: SOLAR_PRICING_KEY, value: parsed.data, category: 'solarcare', is_public: false, description: 'Independent SolarCare rates; approved only after pilot-cost validation.' }, { onConflict: 'key' });
      if (error) return response({ error: 'Pricing settings could not be saved.' }, 500);
      return response({ success: true, config: parsed.data });
    }
    if (body.action === 'override') {
      if (typeof body.leadId !== 'string' || !/^[\da-f-]{36}$/i.test(body.leadId) || typeof body.amount !== 'number' || !Number.isFinite(body.amount) || body.amount < 0 || body.amount > 100000000 || typeof body.reason !== 'string' || body.reason.trim().length < 10 || body.reason.length > 1000) return response({ error: 'A valid SolarCare enquiry, amount and assessment reason are required.' }, 400);
      const { data: lead } = await db.from('leads').select('source,notes').eq('id', body.leadId).single();
      if (!lead?.source.startsWith('solarcare_')) return response({ error: 'SolarCare enquiry not found' }, 404);
      const { error } = await db.from('leads').update({ notes: { ...lead.notes, solarcareOverride: { amount: body.amount, currency: 'ZMW', reason: body.reason.trim(), approvedBy: user.id, approvedAt: new Date().toISOString(), subjectToConfirmation: true } } }).eq('id', body.leadId);
      if (error) return response({ error: 'Quotation override could not be saved.' }, 500);
      return response({ success: true });
    }
    return response({ error: 'Invalid action' }, 400);
  } catch { return response({ error: 'Invalid request' }, 400); }
});