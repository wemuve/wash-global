import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Package, Phone, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  serviceType: string;
  packageTier: string;
  date: Date;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Mock data - in real app this would come from Supabase
    const mockBookings: Booking[] = [
      {
        id: 'BK001234',
        serviceType: 'Deep House Cleaning',
        packageTier: 'Premium',
        date: new Date('2024-12-20'),
        time: '10:00 AM',
        location: '123 Kabulonga Road, Lusaka',
        status: 'confirmed',
        price: 450
      },
      {
        id: 'BK001235',
        serviceType: 'Office Cleaning',
        packageTier: 'Standard',
        date: new Date('2024-12-15'),
        time: '8:00 AM',
        location: 'Levy Mall, Lusaka',
        status: 'completed',
        price: 300
      },
      {
        id: 'BK001236',
        serviceType: 'Fumigation Services',
        packageTier: 'VIP',
        date: new Date('2024-12-25'),
        time: '2:00 PM',
        location: '456 Woodlands Drive, Lusaka',
        status: 'pending',
        price: 800
      }
    ];

    setBookings(mockBookings);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wewash-blue-light/10 to-wewash-gold-light/10">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">WeWash Zambia</h1>
            <p className="text-primary-foreground/80">Welcome back, {user?.name}</p>
          </div>
          <Button variant="secondary" onClick={logout} className="bg-white/20 hover:bg-white/30 border-0">
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Quick Actions */}
        <div className="mb-8">
          <Card className="shadow-elegant border-0 bg-gradient-to-r from-wewash-blue to-wewash-blue-dark text-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Need a service?</h2>
                  <p className="text-white/80">Book your next WeWash service in just a few clicks</p>
                </div>
                <Button 
                  variant="default" 
                  size="mobile" 
                  onClick={() => navigate('/booking')}
                  className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Book New Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-wewash-blue mb-2">{bookings.length}</div>
              <p className="text-muted-foreground">Total Bookings</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{pastBookings.filter(b => b.status === 'completed').length}</div>
              <p className="text-muted-foreground">Completed Services</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{upcomingBookings.length}</div>
              <p className="text-muted-foreground">Upcoming Services</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Upcoming Services</h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{booking.serviceType}</h3>
                          <Badge className={`${getStatusColor(booking.status)} border`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-2 text-wewash-blue" />
                            {format(booking.date, "MMM d, yyyy")} at {booking.time}
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-wewash-blue" />
                            {booking.packageTier} Package
                          </div>
                          <div className="flex items-center md:col-span-2">
                            <MapPin className="h-4 w-4 mr-2 text-wewash-blue" />
                            {booking.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                        <div className="text-2xl font-bold text-wewash-blue mb-2">
                          K{booking.price}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Booking ID: {booking.id}
                        </p>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Services</h3>
                <p className="text-muted-foreground mb-4">You don't have any upcoming bookings</p>
                <Button variant="premium" onClick={() => navigate('/booking')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Book Your First Service
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Bookings */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Service History</h2>
          {pastBookings.length > 0 ? (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="shadow-lg opacity-90">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{booking.serviceType}</h3>
                          <Badge className={`${getStatusColor(booking.status)} border`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-2 text-wewash-blue" />
                            {format(booking.date, "MMM d, yyyy")} at {booking.time}
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-wewash-blue" />
                            {booking.packageTier} Package
                          </div>
                          <div className="flex items-center md:col-span-2">
                            <MapPin className="h-4 w-4 mr-2 text-wewash-blue" />
                            {booking.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                        <div className="text-2xl font-bold text-wewash-blue mb-2">
                          K{booking.price}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Booking ID: {booking.id}
                        </p>
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Service History</h3>
                <p className="text-muted-foreground">Your completed services will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;