import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { booking_id, action } = await req.json();

    if (action === 'match') {
      // Get booking
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

      // Get active vendors with onboarding complete
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

      // Rank by: tier (Elite=4, Gold=3, Silver=2, Bronze=1) * 25 + avg_rating * 10 + completion_rate * 0.5
      const tierScore: Record<string, number> = { elite: 4, gold: 3, silver: 2, bronze: 1 };
      const ranked = vendors
        .map(v => ({
          ...v,
          score: (tierScore[v.tier] || 1) * 25 + (v.avg_rating || 0) * 10 + (v.completion_rate || 0) * 0.5,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      // Create offers with 15-min expiry
      const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();
      const offers = ranked.map((v, i) => ({
        booking_id,
        vendor_id: v.id,
        priority_rank: i + 1,
        expires_at: expiresAt,
        status: 'pending',
      }));

      await supabase.from('job_offers').insert(offers);

      // Auto-assign to top ranked
      await supabase.from('job_assignments').insert({
        booking_id,
        vendor_id: ranked[0].id,
        status: 'assigned',
      });

      // Update booking status
      await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', booking_id);

      return new Response(JSON.stringify({
        matched: ranked.length,
        assigned_to: ranked[0].name,
        tier: ranked[0].tier,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'check_expired') {
      // Check for expired offers and reassign
      const { data: expired } = await supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString());

      if (expired && expired.length > 0) {
        // Mark as expired
        const ids = expired.map(e => e.id);
        await supabase.from('job_offers').update({ status: 'expired' }).in('id', ids);

        // For each booking with expired offers, check if there's a next available
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
      // Recalculate vendor performance metrics
      const { vendor_id } = await req.json().catch(() => ({ vendor_id: null }));
      if (!vendor_id) {
        return new Response(JSON.stringify({ error: 'vendor_id required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get performance logs
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

        // Auto tier progression
        await supabase.rpc('update_vendor_tier', { vendor_uuid: vendor_id });
        // Check suspension
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
