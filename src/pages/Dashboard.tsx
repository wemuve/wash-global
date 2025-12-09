import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Settings, 
  LogOut, 
  Plus,
  Loader2,
  Package,
  Star,
  FileText,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  total_amount: number;
  service_id: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  user_type: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('scheduled_date', { ascending: false });

      if (bookingsData) {
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const upcomingBookings = bookings.filter(b => 
    new Date(b.scheduled_date) >= new Date() && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(b => 
    new Date(b.scheduled_date) < new Date() || b.status === 'completed'
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome, {profile?.full_name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your bookings and account settings
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/')} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
              <Button onClick={handleSignOut} variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">
                      {bookings.filter(b => b.status === 'completed').length}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-wewash-gold">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">
                      K{bookings.reduce((sum, b) => sum + Number(b.total_amount), 0).toLocaleString()}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-wewash-gold/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              {/* Upcoming Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Bookings
                  </CardTitle>
                  <CardDescription>Your scheduled services</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No upcoming bookings</p>
                      <Button onClick={() => navigate('/')} className="mt-4" variant="outline">
                        Book a Service
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div 
                          key={booking.id} 
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status.replace('_', ' ')}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                #{booking.id.slice(0, 8)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {format(new Date(booking.scheduled_date), 'MMM d, yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {booking.scheduled_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {booking.customer_address}
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 text-right">
                            <p className="text-lg font-semibold text-primary">
                              K{Number(booking.total_amount).toLocaleString()}
                            </p>
                            <Button variant="ghost" size="sm" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Past Bookings */}
              {pastBookings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      Past Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pastBookings.slice(0, 5).map((booking) => (
                        <div 
                          key={booking.id} 
                          className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
                        >
                          <div className="flex items-center gap-4">
                            <Badge className={getStatusColor(booking.status)} variant="outline">
                              {booking.status}
                            </Badge>
                            <span className="text-sm">
                              {format(new Date(booking.scheduled_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <span className="font-medium">
                            K{Number(booking.total_amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-lg">{profile?.full_name || 'Not set'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-lg">{user?.email || 'Not set'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-lg">{profile?.phone || 'Not set'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                      <Badge variant="outline" className="capitalize">
                        {profile?.user_type || 'Home'}
                      </Badge>
                    </div>
                    {profile?.company_name && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Company</label>
                        <p className="text-lg">{profile.company_name}</p>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Stay updated on your bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
