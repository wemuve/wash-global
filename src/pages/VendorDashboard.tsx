import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
  Briefcase, Clock, CheckCircle2, DollarSign, Calendar,
  MapPin, Phone, Play, CheckCheck, Bell, Award, BarChart3,
  ClipboardList, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WorkerPerformance from '@/components/worker/WorkerPerformance';
import JobOffers from '@/components/worker/JobOffers';
import ServiceChecklist from '@/components/worker/ServiceChecklist';

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
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('offers');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [vendorRes, assignRes] = await Promise.all([
        supabase.from('vendors').select('*').eq('user_id', user.id).single(),
        supabase.from('job_assignments').select(`*, bookings (customer_name, customer_phone, customer_address, scheduled_date, scheduled_time, total_amount, special_instructions)`).order('assigned_at', { ascending: false }),
      ]);

      if (vendorRes.data) setVendor(vendorRes.data);
      setAssignments(assignRes.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (assignmentId: string, status: string, field: string) => {
    const updates: Record<string, unknown> = { status };
    if (field === 'started_at') updates.started_at = new Date().toISOString();
    if (field === 'completed_at') updates.completed_at = new Date().toISOString();

    const { error } = await supabase.from('job_assignments').update(updates).eq('id', assignmentId);
    if (error) { toast({ title: 'Error updating job', variant: 'destructive' }); return; }
    toast({ title: `Job ${status}` });
    fetchData();
  };

  const pendingJobs = assignments.filter(a => a.status === 'assigned' || a.status === 'accepted');
  const activeJobs = assignments.filter(a => a.status === 'in_progress');
  const completedJobs = assignments.filter(a => a.status === 'completed');

  const stats = {
    totalJobs: assignments.length,
    pendingJobs: pendingJobs.length,
    activeJobs: activeJobs.length,
    completedJobs: completedJobs.length,
    earnings: completedJobs.reduce((sum, j) => sum + (j.bookings?.total_amount || 0), 0),
  };

  const tabs = [
    { id: 'offers', name: 'Job Offers', icon: Bell },
    { id: 'pending', name: 'Pending', count: stats.pendingJobs, icon: Clock },
    { id: 'active', name: 'In Progress', count: stats.activeJobs, icon: Play },
    { id: 'completed', name: 'Completed', count: stats.completedJobs, icon: CheckCircle2 },
    { id: 'performance', name: 'Performance', icon: BarChart3 },
  ];

  const getJobsForTab = () => {
    switch (activeTab) {
      case 'pending': return pendingJobs;
      case 'active': return activeJobs;
      case 'completed': return completedJobs;
      default: return [];
    }
  };

  // Check onboarding status
  if (vendor && vendor.onboarding_status !== 'active') {
    return (
      <Layout>
        <section className="bg-wewash-navy py-8">
          <div className="container-wewash">
            <h1 className="text-2xl font-bold text-white">Worker Dashboard</h1>
          </div>
        </section>
        <section className="section-spacing">
          <div className="container-wewash text-center py-12">
            <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Complete Your Onboarding</h2>
            <p className="text-muted-foreground mb-4">
              You need to complete onboarding before accessing job assignments.
            </p>
            <Button onClick={() => window.location.href = '/worker-onboarding'}>
              Continue Onboarding
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Worker Dashboard | WeWash Zambia</title>
      </Helmet>
      <section className="bg-wewash-navy py-8">
        <div className="container-wewash">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Worker Dashboard</h1>
              <p className="text-white/70">Manage your assignments and performance</p>
            </div>
            {vendor && (
              <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Award className="h-4 w-4 text-secondary" />
                <span className="text-white text-sm font-medium capitalize">{vendor.tier || 'Bronze'} Tier</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-wewash">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'bg-primary/10 text-primary' },
              { label: 'Pending', value: stats.pendingJobs, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Completed', value: stats.completedJobs, icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
              { label: 'Earnings', value: `ZMW ${stats.earnings.toLocaleString()}`, icon: DollarSign, color: 'bg-secondary/20 text-secondary' },
            ].map((s, i) => (
              <div key={i} className="bg-background rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-bold">{s.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
                {tab.count !== undefined && ` (${tab.count})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'offers' && <JobOffers />}

          {activeTab === 'performance' && vendor && <WorkerPerformance vendor={vendor} />}

          {['pending', 'active', 'completed'].includes(activeTab) && (
            <div className="grid md:grid-cols-2 gap-4">
              {getJobsForTab().map((job) => {
                const booking = job.bookings;
                if (!booking) return null;

                return (
                  <div key={job.id} className="bg-background rounded-xl p-5 shadow-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{booking.customer_name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {booking.scheduled_date} at {booking.scheduled_time}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        job.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-3 text-sm">
                      <p className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <a href={`tel:${booking.customer_phone}`} className="text-primary hover:underline">
                          {booking.customer_phone}
                        </a>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                        <span>{booking.customer_address}</span>
                      </p>
                    </div>

                    {/* Checklist toggle for active jobs */}
                    {job.status === 'in_progress' && (
                      <div className="mb-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 w-full"
                          onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                        >
                          <ClipboardList className="h-3.5 w-3.5" />
                          {expandedJob === job.id ? 'Hide Checklist' : 'Show Checklist'}
                        </Button>
                        {expandedJob === job.id && (
                          <div className="mt-3">
                            <ServiceChecklist assignmentId={job.id} serviceName="General" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <p className="font-semibold text-primary">ZMW {booking.total_amount.toLocaleString()}</p>
                      <div className="flex gap-2">
                        {job.status === 'assigned' && (
                          <Button size="sm" onClick={() => updateJobStatus(job.id, 'accepted', '')} className="gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                          </Button>
                        )}
                        {job.status === 'accepted' && (
                          <Button size="sm" onClick={() => updateJobStatus(job.id, 'in_progress', 'started_at')} className="gap-1">
                            <Play className="h-3.5 w-3.5" /> Start
                          </Button>
                        )}
                        {job.status === 'in_progress' && (
                          <Button size="sm" onClick={() => updateJobStatus(job.id, 'completed', 'completed_at')} className="gap-1">
                            <CheckCheck className="h-3.5 w-3.5" /> Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {getJobsForTab().length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  No jobs in this category
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default VendorDashboard;
