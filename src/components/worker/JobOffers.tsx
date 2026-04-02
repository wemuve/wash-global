import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, DollarSign, CheckCircle2, X, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useJobMatching } from '@/hooks/useJobMatching';

interface JobOffer {
  id: string;
  booking_id: string;
  status: string;
  priority_rank: number;
  expires_at: string;
  bookings?: {
    customer_name: string;
    customer_address: string;
    scheduled_date: string;
    scheduled_time: string;
    total_amount: number;
    special_instructions: string | null;
  };
}

const JobOffers: React.FC = () => {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const { acceptOffer, declineOffer } = useJobMatching();

  const fetchOffers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('job_offers')
      .select(`*, bookings (customer_name, customer_address, scheduled_date, scheduled_time, total_amount, special_instructions)`)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    setOffers((data || []) as unknown as JobOffer[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();

    // Realtime subscription
    const channel = supabase
      .channel('job-offers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_offers' }, () => {
        fetchOffers();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const mins = Math.floor(diff / 60000);
    return `${mins} min remaining`;
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading offers...</div>;

  if (offers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Timer className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No pending job offers</p>
        <p className="text-sm">New offers will appear here in real-time</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Pending Job Offers ({offers.length})</h3>
      {offers.map((offer) => {
        const booking = offer.bookings;
        if (!booking) return null;

        return (
          <div key={offer.id} className="bg-background rounded-xl p-5 shadow-card border-l-4 border-primary">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold">{booking.customer_name}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Timer className="h-3 w-3" /> {getTimeRemaining(offer.expires_at)}
                </p>
              </div>
              <span className="text-lg font-bold text-primary">
                ZMW {booking.total_amount?.toLocaleString()}
              </span>
            </div>

            <div className="space-y-1.5 mb-4 text-sm">
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {booking.scheduled_date} at {booking.scheduled_time}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {booking.customer_address}
              </p>
              {booking.special_instructions && (
                <p className="text-muted-foreground bg-muted/50 p-2 rounded">
                  {booking.special_instructions}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 gap-1"
                onClick={async () => { await acceptOffer(offer.id); fetchOffers(); }}
              >
                <CheckCircle2 className="h-4 w-4" /> Accept
              </Button>
              <Button
                variant="outline"
                className="gap-1"
                onClick={async () => { await declineOffer(offer.id); fetchOffers(); }}
              >
                <X className="h-4 w-4" /> Decline
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobOffers;
