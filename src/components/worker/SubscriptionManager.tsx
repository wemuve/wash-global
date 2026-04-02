import React, { useState, useEffect } from 'react';
import { Calendar, Repeat, DollarSign, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  service_name: string;
  frequency: string;
  base_price: number;
  discount_percentage: number;
  final_price: number;
  status: string;
  next_booking_date: string | null;
  preferred_day: string | null;
  preferred_time: string | null;
  total_bookings_made: number;
}

const SubscriptionManager: React.FC = () => {
  const { toast } = useToast();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setSubs((data || []) as unknown as Subscription[]);
    setLoading(false);
  };

  useEffect(() => { fetchSubs(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const updates: Record<string, unknown> = { status };
    if (status === 'cancelled') updates.cancelled_at = new Date().toISOString();

    await supabase.from('subscriptions').update(updates).eq('id', id);
    toast({ title: `Subscription ${status}` });
    fetchSubs();
  };

  const freqLabel = (f: string) => f === 'weekly' ? 'Weekly' : f === 'biweekly' ? 'Bi-Weekly' : 'Monthly';

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading subscriptions...</div>;

  if (subs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Repeat className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No active subscriptions</p>
        <p className="text-sm">Set up recurring cleaning services to save up to 15%</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subs.map((sub) => (
        <div key={sub.id} className="bg-background rounded-xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold">{sub.service_name}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Repeat className="h-3 w-3" /> {freqLabel(sub.frequency)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              sub.status === 'active' ? 'bg-green-100 text-green-800' :
              sub.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {sub.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <p className="text-muted-foreground">Price</p>
              <p className="font-semibold">ZMW {sub.final_price.toLocaleString()}</p>
              {sub.discount_percentage > 0 && (
                <p className="text-xs text-green-600">{sub.discount_percentage}% discount</p>
              )}
            </div>
            <div>
              <p className="text-muted-foreground">Next Service</p>
              <p className="font-semibold">{sub.next_booking_date || 'TBD'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Services</p>
              <p className="font-semibold">{sub.total_bookings_made}</p>
            </div>
          </div>

          {sub.status !== 'cancelled' && (
            <div className="flex gap-2">
              {sub.status === 'active' && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(sub.id, 'paused')} className="gap-1">
                  <Pause className="h-3 w-3" /> Pause
                </Button>
              )}
              {sub.status === 'paused' && (
                <Button size="sm" onClick={() => updateStatus(sub.id, 'active')} className="gap-1">
                  <Play className="h-3 w-3" /> Resume
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => updateStatus(sub.id, 'cancelled')} className="gap-1">
                <X className="h-3 w-3" /> Cancel
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubscriptionManager;
