import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Star,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  User,
  Camera,
  Play,
  CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JobAssignment {
  id: string;
  booking_id: string;
  status: string;
  assigned_at: string;
  started_at: string | null;
  completed_at: string | null;
  bookings?: {
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    scheduled_date: string;
    scheduled_time: string;
    total_amount: number;
    special_instructions: string | null;
  };
}

const VendorDashboard = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<JobAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_assignments')
        .select(`
          *,
          bookings (
            customer_name,
            customer_phone,
            customer_address,
            scheduled_date,
            scheduled_time,
            total_amount,
            special_instructions
          )
        `)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (assignmentId: string, status: string, field: string) => {
    try {
      const updates: Record<string, unknown> = { status };
      if (field === 'started_at') updates.started_at = new Date().toISOString();
      if (field === 'completed_at') updates.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('job_assignments')
        .update(updates)
        .eq('id', assignmentId);

      if (error) throw error;

      toast({ title: `Job ${status}` });
      fetchAssignments();
    } catch (error) {
      toast({ title: 'Error updating job', variant: 'destructive' });
    }
  };

  const pendingJobs = assignments.filter(a => a.status === 'assigned' || a.status === 'accepted');
  const activeJobs = assignments.filter(a => a.status === 'in_progress');
  const completedJobs = assignments.filter(a => a.status === 'completed');

  const stats = {
    totalJobs: assignments.length,
    pendingJobs: pendingJobs.length,
    activeJobs: activeJobs.length,
    completedJobs: completedJobs.length,
    earnings: completedJobs.reduce((sum, job) => sum + (job.bookings?.total_amount || 0), 0),
  };

  const tabs = [
    { id: 'pending', name: 'Pending', count: stats.pendingJobs },
    { id: 'active', name: 'In Progress', count: stats.activeJobs },
    { id: 'completed', name: 'Completed', count: stats.completedJobs },
  ];

  const getJobsForTab = () => {
    switch (activeTab) {
      case 'pending': return pendingJobs;
      case 'active': return activeJobs;
      case 'completed': return completedJobs;
      default: return [];
    }
  };

  const JobCard = ({ job }: { job: JobAssignment }) => {
    const booking = job.bookings;
    if (!booking) return null;

    return (
      <div className="bg-background rounded-xl p-6 shadow-card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{booking.customer_name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {booking.scheduled_date} at {booking.scheduled_time}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
            job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
            job.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
            'bg-green-100 text-green-800'
          }`}>
            {job.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${booking.customer_phone}`} className="text-primary hover:underline">
              {booking.customer_phone}
            </a>
          </p>
          <p className="text-sm flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{booking.customer_address}</span>
          </p>
          {booking.special_instructions && (
            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
              Note: {booking.special_instructions}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="font-semibold text-primary">
            ZMW {booking.total_amount.toLocaleString()}
          </p>
          
          <div className="flex gap-2">
            {job.status === 'assigned' && (
              <Button 
                size="sm"
                onClick={() => updateJobStatus(job.id, 'accepted', '')}
                className="btn-primary gap-1"
              >
                <CheckCircle2 className="h-4 w-4" />
                Accept
              </Button>
            )}
            {job.status === 'accepted' && (
              <Button 
                size="sm"
                onClick={() => updateJobStatus(job.id, 'in_progress', 'started_at')}
                className="btn-primary gap-1"
              >
                <Play className="h-4 w-4" />
                Start Job
              </Button>
            )}
            {job.status === 'in_progress' && (
              <Button 
                size="sm"
                onClick={() => updateJobStatus(job.id, 'completed', 'completed_at')}
                className="btn-gold gap-1"
              >
                <CheckCheck className="h-4 w-4" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <section className="bg-wewash-navy py-8">
        <div className="container-wewash">
          <h1 className="text-2xl font-bold text-white">Vendor Dashboard</h1>
          <p className="text-white/70">Manage your job assignments</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-wewash">
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-background rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold">{stats.totalJobs}</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingJobs}</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedJobs}</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-wewash-gold/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-wewash-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Earnings</p>
                  <p className="text-2xl font-bold">ZMW {stats.earnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="grid md:grid-cols-2 gap-6">
            {getJobsForTab().map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            {getJobsForTab().length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                No jobs in this category
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VendorDashboard;
