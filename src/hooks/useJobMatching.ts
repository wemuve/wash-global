import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const OFFER_TIMEOUT_MINUTES = 15;

export function useJobMatching() {
  const { toast } = useToast();

  const matchWorkersToJob = async (bookingId: string) => {
    try {
      // Get booking details
      const { data: booking } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (!booking) throw new Error('Booking not found');

      // Get eligible active vendors, ordered by tier priority
      const { data: vendors } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .eq('onboarding_status', 'active')
        .order('tier', { ascending: false });

      if (!vendors || vendors.length === 0) {
        toast({ title: 'No available workers found', variant: 'destructive' });
        return [];
      }

      // Rank vendors by: tier > rating > completion rate
      const tierOrder = { elite: 4, gold: 3, silver: 2, bronze: 1 };
      const ranked = vendors
        .map(v => ({
          ...v,
          score: (tierOrder[(v as any).tier as keyof typeof tierOrder] || 1) * 25 +
            ((v as any).avg_rating || 0) * 10 +
            ((v as any).completion_rate || 0) * 0.5
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      // Create job offers
      const expiresAt = new Date(Date.now() + OFFER_TIMEOUT_MINUTES * 60000).toISOString();
      const offers = ranked.map((v, i) => ({
        booking_id: bookingId,
        vendor_id: v.id,
        priority_rank: i + 1,
        expires_at: expiresAt,
        status: i === 0 ? 'pending' : 'pending' as const,
      }));

      const { error } = await supabase
        .from('job_offers')
        .insert(offers);

      if (error) throw error;

      // Auto-assign to top-ranked worker
      const topVendor = ranked[0];
      const { error: assignError } = await supabase
        .from('job_assignments')
        .insert({
          booking_id: bookingId,
          vendor_id: topVendor.id,
          status: 'assigned',
        });

      if (assignError) throw assignError;

      toast({ title: `Job offered to ${ranked.length} workers` });
      return ranked;
    } catch (error) {
      console.error('Job matching error:', error);
      toast({ title: 'Error matching workers', variant: 'destructive' });
      return [];
    }
  };

  const acceptOffer = async (offerId: string) => {
    try {
      const { data: offer } = await supabase
        .from('job_offers')
        .select('*')
        .eq('id', offerId)
        .single();

      if (!offer) throw new Error('Offer not found');

      // Accept this offer
      await supabase
        .from('job_offers')
        .update({ status: 'accepted', responded_at: new Date().toISOString() })
        .eq('id', offerId);

      // Decline all other offers for same booking
      await supabase
        .from('job_offers')
        .update({ status: 'declined' })
        .eq('booking_id', (offer as any).booking_id)
        .neq('id', offerId);

      // Update or create job assignment
      await supabase
        .from('job_assignments')
        .update({ vendor_id: (offer as any).vendor_id, status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('booking_id', (offer as any).booking_id);

      toast({ title: 'Job accepted!' });
    } catch (error) {
      console.error('Accept offer error:', error);
      toast({ title: 'Error accepting offer', variant: 'destructive' });
    }
  };

  const declineOffer = async (offerId: string, reason?: string) => {
    try {
      const { data: offer } = await supabase
        .from('job_offers')
        .select('*')
        .eq('id', offerId)
        .single();

      if (!offer) throw new Error('Offer not found');

      await supabase
        .from('job_offers')
        .update({ status: 'declined', responded_at: new Date().toISOString(), decline_reason: reason })
        .eq('id', offerId);

      // Find next available worker
      const { data: nextOffer } = await supabase
        .from('job_offers')
        .select('*')
        .eq('booking_id', (offer as any).booking_id)
        .eq('status', 'pending')
        .order('priority_rank')
        .limit(1)
        .single();

      if (nextOffer) {
        // Reassign to next worker
        await supabase
          .from('job_assignments')
          .update({ vendor_id: (nextOffer as any).vendor_id, status: 'assigned' })
          .eq('booking_id', (offer as any).booking_id);
      }

      toast({ title: 'Job declined' });
    } catch (error) {
      console.error('Decline offer error:', error);
    }
  };

  return { matchWorkersToJob, acceptOffer, declineOffer };
}
