import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validActions = ['match', 'check_expired', 'update_performance'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Require authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const authSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: authError } = await authSupabase.auth.getClaims(token);
    if (authError || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Use service role for data operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    const { booking_id, action, vendor_id } = body;

    // Validate action
    if (!action || !validActions.includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'match') {
      if (!booking_id || !uuidRegex.test(booking_id)) {
        return new Response(JSON.stringify({ error: 'Valid booking_id required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: booking, error: bErr } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', booking_id)
        .single();

      if (bErr || !booking) {
        return new Response(JSON.stringify({ error: 'Booking not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: vendors } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .eq('onboarding_status', 'active');

      if (!vendors || vendors.length === 0) {
        return new Response(JSON.stringify({ error: 'No available workers', matched: 0 }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const tierScore: Record<string, number> = { elite: 4, gold: 3, silver: 2, bronze: 1 };
      const ranked = vendors
        .map(v => ({
          ...v,
          score: (tierScore[v.tier] || 1) * 25 + (v.avg_rating || 0) * 10 + (v.completion_rate || 0) * 0.5,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();
      const offers = ranked.map((v, i) => ({
        booking_id,
        vendor_id: v.id,
        priority_rank: i + 1,
        expires_at: expiresAt,
        status: 'pending',
      }));

      await supabase.from('job_offers').insert(offers);
      await supabase.from('job_assignments').insert({
        booking_id,
        vendor_id: ranked[0].id,
        status: 'assigned',
      });
      await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', booking_id);

      return new Response(JSON.stringify({
        matched: ranked.length,
        assigned_to: ranked[0].name,
        tier: ranked[0].tier,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'check_expired') {
      const { data: expired } = await supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString());

      if (expired && expired.length > 0) {
        const ids = expired.map(e => e.id);
        await supabase.from('job_offers').update({ status: 'expired' }).in('id', ids);

        const bookingIds = [...new Set(expired.map(e => e.booking_id))];
        for (const bid of bookingIds) {
          const { data: nextOffer } = await supabase
            .from('job_offers')
            .select('*')
            .eq('booking_id', bid)
            .eq('status', 'pending')
            .order('priority_rank')
            .limit(1)
            .single();

          if (nextOffer) {
            await supabase.from('job_assignments')
              .update({ vendor_id: nextOffer.vendor_id, status: 'assigned' })
              .eq('booking_id', bid);
          }
        }

        return new Response(JSON.stringify({ expired: expired.length, reassigned: bookingIds.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ expired: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'update_performance') {
      if (!vendor_id || !uuidRegex.test(vendor_id)) {
        return new Response(JSON.stringify({ error: 'Valid vendor_id required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: logs } = await supabase
        .from('worker_performance_logs')
        .select('*')
        .eq('vendor_id', vendor_id);

      if (logs && logs.length > 0) {
        const ratings = logs.filter(l => l.customer_rating != null).map(l => l.customer_rating!);
        const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
        const completionRate = (logs.filter(l => l.was_completed).length / logs.length) * 100;
        const punctuality = (logs.filter(l => l.was_on_time).length / logs.length) * 100;
        const repeatRate = (logs.filter(l => l.was_repeat_customer).length / logs.length) * 100;
        const complaints = logs.filter(l => l.had_complaint).length;
        const seriousComplaints = logs.filter(l => l.complaint_severity === 'major').length;

        await supabase.from('vendors').update({
          avg_rating: Math.round(avgRating * 10) / 10,
          completion_rate: Math.round(completionRate),
          punctuality_score: Math.round(punctuality),
          repeat_booking_rate: Math.round(repeatRate),
          complaint_count: complaints,
          serious_complaint_count: seriousComplaints,
          total_completed_jobs: logs.filter(l => l.was_completed).length,
        }).eq('id', vendor_id);

        await supabase.rpc('update_vendor_tier', { vendor_uuid: vendor_id });
        await supabase.rpc('check_vendor_suspension', { vendor_uuid: vendor_id });
      }

      return new Response(JSON.stringify({ updated: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
