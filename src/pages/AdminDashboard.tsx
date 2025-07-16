import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CalendarDays, 
  MapPin, 
  Package, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';

interface AdminBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  packageTier: string;
  date: Date;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<AdminBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  useEffect(() => {
    // Mock data - in real app this would come from Supabase
    const mockBookings: AdminBooking[] = [
      {
        id: 'BK001234',
        clientName: 'John Doe',
        clientEmail: 'john@email.com',
        clientPhone: '+260 977 123 456',
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
        clientName: 'Jane Smith',
        clientEmail: 'jane@email.com',
        clientPhone: '+260 966 789 012',
        serviceType: 'Office Cleaning',
        packageTier: 'Standard',
        date: new Date('2024-12-15'),
        time: '8:00 AM',
        location: 'Levy Mall, Lusaka',
        status: 'pending',
        price: 300
      },
      {
        id: 'BK001236',
        clientName: 'Mike Johnson',
        clientEmail: 'mike@email.com',
        clientPhone: '+260 955 345 678',
        serviceType: 'Fumigation Services',
        packageTier: 'VIP',
        date: new Date('2024-12-25'),
        time: '2:00 PM',
        location: '456 Woodlands Drive, Lusaka',
        status: 'completed',
        price: 800
      },
      {
        id: 'BK001237',
        clientName: 'Sarah Wilson',
        clientEmail: 'sarah@email.com',
        clientPhone: '+260 977 901 234',
        serviceType: 'Trained Maids',
        packageTier: 'Premium',
        date: new Date('2024-12-18'),
        time: '9:00 AM',
        location: '789 Roma Park, Lusaka',
        status: 'pending',
        price: 600
      },
      {
        id: 'BK001238',
        clientName: 'David Brown',
        clientEmail: 'david@email.com',
        clientPhone: '+260 966 567 890',
        serviceType: 'Home Maintenance',
        packageTier: 'Standard',
        date: new Date('2024-12-22'),
        time: '11:00 AM',
        location: '321 Avondale Road, Lusaka',
        status: 'confirmed',
        price: 400
      }
    ];

    setBookings(mockBookings);
    setFilteredBookings(mockBookings);
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Service filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(booking => booking.serviceType.includes(serviceFilter));
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, serviceFilter]);

  const handleStatusUpdate = (bookingId: string, newStatus: 'confirmed' | 'completed') => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

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

  const totalBookings = bookings.length;
  const activeClients = new Set(bookings.map(b => b.clientEmail)).size;
  const completedJobs = bookings.filter(b => b.status === 'completed').length;
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wewash-blue-light/10 to-wewash-gold-light/10">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">WeWash Admin Dashboard</h1>
            <p className="text-primary-foreground/80">Welcome back, {user?.name}</p>
          </div>
          <Button variant="secondary" onClick={logout} className="bg-white/20 hover:bg-white/30 border-0">
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold text-wewash-blue">{totalBookings}</p>
                </div>
                <Package className="h-8 w-8 text-wewash-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                  <p className="text-3xl font-bold text-green-600">{activeClients}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Jobs</p>
                  <p className="text-3xl font-bold text-blue-600">{completedJobs}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold text-wewash-gold-dark">K{totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-wewash-gold-dark" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Booking Management
            </CardTitle>
            <CardDescription>
              View and manage all customer bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client name, email, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Maids">Maids</SelectItem>
                  <SelectItem value="Fumigation">Fumigation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.clientName}</p>
                          <p className="text-sm text-muted-foreground">{booking.clientEmail}</p>
                          <p className="text-sm text-muted-foreground">{booking.clientPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.serviceType}</p>
                          <Badge variant="outline" className="mt-1">
                            {booking.packageTier}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-wewash-blue" />
                          <div>
                            <p className="text-sm">{format(booking.date, "MMM d, yyyy")}</p>
                            <p className="text-sm text-muted-foreground">{booking.time}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-wewash-blue mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{booking.location}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(booking.status)} border`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">K{booking.price}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {booking.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="w-full"
                            >
                              Confirm
                            </Button>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleStatusUpdate(booking.id, 'completed')}
                              className="w-full"
                            >
                              Complete
                            </Button>
                          )}
                          {booking.status === 'completed' && (
                            <Badge variant="outline" className="w-full justify-center">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;