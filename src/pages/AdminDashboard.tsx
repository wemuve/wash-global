import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
  DollarSign,
  RefreshCw,
  CreditCard,
  Receipt,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface Lead {
  id: string;
  customer_name: string;
  customer_phone: string;
  source: string;
  status: string;
  created_at: string;
}

interface Vendor {
  id: string;
  name: string;
  phone: string;
  is_active: boolean;
  total_jobs: number;
  rating: number;
}

interface Payment {
  id: string;
  customer_name: string;
  customer_phone: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_provider: string;
  transaction_id: string;
  service_name: string;
  status: string;
  receipt_number: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  useEffect(() => {
    fetchData();
    
    // Set up realtime subscription for payments
    const channel = supabase
      .channel('payments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          console.log('Payment update:', payload);
          fetchPayments();
          if (payload.eventType === 'INSERT' || (payload.eventType === 'UPDATE' && payload.new.status === 'completed')) {
            toast({
              title: '💰 New Payment Received!',
              description: `${payload.new.customer_name} - ZMW ${payload.new.amount}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBookings(),
        fetchLeads(),
        fetchVendors(),
        fetchPayments()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setBookings(data);
  };

  const fetchLeads = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setLeads(data);
  };

  const fetchVendors = async () => {
    const { data } = await supabase.from('vendors').select('*').order('created_at', { ascending: false });
    if (data) setVendors(data);
  };

  const fetchPayments = async () => {
    const { data } = await supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) setPayments(data);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast({ title: 'Status updated successfully' });
      fetchBookings();
    } catch (error) {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'new').length,
    activeVendors: vendors.filter(v => v.is_active).length,
    revenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0),
    totalPayments: payments.length,
    completedPayments: payments.filter(p => p.status === 'completed').length,
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', name: 'Bookings', icon: Calendar },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'leads', name: 'Leads', icon: UserPlus },
    { id: 'vendors', name: 'Vendors', icon: Users },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800',
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
  };

  const paymentMethodLabels: Record<string, string> = {
    mtn: 'MTN Money',
    airtel: 'Airtel Money',
    zamtel: 'Zamtel Money',
  };

  return (
    <Layout>
      <section className="bg-wewash-navy py-8">
        <div className="container-wewash">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/70">Manage bookings, payments, leads, and vendors</p>
            </div>
            <Button onClick={fetchData} variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-wewash">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                  {tab.id === 'payments' && stats.completedPayments > 0 && (
                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.completedPayments}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-background rounded-xl p-6 shadow-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">{stats.totalBookings}</p>
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
                      <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-background rounded-xl p-6 shadow-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payments</p>
                      <p className="text-2xl font-bold">{stats.completedPayments}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-background rounded-xl p-6 shadow-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-wewash-gold/20 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-wewash-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">ZMW {stats.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-background rounded-xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.scheduled_date} at {booking.scheduled_time}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || 'bg-gray-100'}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background rounded-xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Recent Payments</h3>
                  <div className="space-y-3">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{payment.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{payment.service_name} - {paymentMethodLabels[payment.payment_method] || payment.payment_method}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">ZMW {Number(payment.amount).toLocaleString()}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[payment.status] || 'bg-gray-100'}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-background rounded-xl shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.customer_name}</TableCell>
                      <TableCell>{booking.customer_phone}</TableCell>
                      <TableCell>{booking.scheduled_date} at {booking.scheduled_time}</TableCell>
                      <TableCell>ZMW {booking.total_amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || 'bg-gray-100'}`}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="bg-background rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Payments ({payments.length})</h3>
                <div className="text-sm text-muted-foreground">
                  Total Revenue: <span className="font-bold text-green-600">ZMW {stats.revenue.toLocaleString()}</span>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{payment.customer_phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{payment.service_name || 'N/A'}</TableCell>
                      <TableCell className="font-semibold">
                        {payment.currency} {Number(payment.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded bg-muted text-xs font-medium">
                          {paymentMethodLabels[payment.payment_method] || payment.payment_method}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{payment.transaction_id}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[payment.status] || 'bg-gray-100'}`}>
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(payment.created_at).toLocaleString('en-ZM', { 
                          timeZone: 'Africa/Lusaka',
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </TableCell>
                      <TableCell>
                        {payment.status === 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedReceipt(payment)}
                            className="gap-1"
                          >
                            <Receipt className="h-3 w-3" />
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === 'leads' && (
            <div className="bg-background rounded-xl shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.customer_name}</TableCell>
                      <TableCell>{lead.customer_phone}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-100'}`}>
                          {lead.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Vendors Tab */}
          {activeTab === 'vendors' && (
            <div className="bg-background rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Vendors ({vendors.length})</h3>
                <Button onClick={() => navigate('/vendor-registration')} className="btn-primary gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Vendor
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Total Jobs</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>{vendor.total_jobs || 0}</TableCell>
                      <TableCell>{vendor.rating || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${vendor.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {vendor.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>

      {/* Receipt Modal */}
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Digital Receipt
            </DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold text-primary">WeWash Zambia</h2>
                <p className="text-sm text-muted-foreground">Professional Cleaning Services</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receipt No:</span>
                  <span className="font-mono font-medium">{selectedReceipt.receipt_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-xs">{selectedReceipt.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(selectedReceipt.created_at).toLocaleString('en-ZM', { timeZone: 'Africa/Lusaka' })}</span>
                </div>
              </div>

              <div className="border-t border-b py-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{selectedReceipt.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{selectedReceipt.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span>{selectedReceipt.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{paymentMethodLabels[selectedReceipt.payment_method] || selectedReceipt.payment_method}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid:</span>
                <span className="text-green-600">{selectedReceipt.currency} {Number(selectedReceipt.amount).toLocaleString()}</span>
              </div>

              <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                <p>Thank you for choosing WeWash Zambia!</p>
                <p>Questions? Contact us at +260 XXX XXX XXX</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminDashboard;
