import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, MapPin, Phone, Mail, User, Package, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface BookingData {
  id: string;
  serviceCategory: string;
  specificService: string;
  packageTier: string;
  date: Date;
  time: string;
  location: string;
  name: string;
  email: string;
  phone: string;
}

const BookingConfirmation = () => {
  const [booking, setBooking] = useState<BookingData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const lastBooking = localStorage.getItem('lastBooking');
    if (lastBooking) {
      const bookingData = JSON.parse(lastBooking);
      // Convert date string back to Date object
      if (bookingData.date) {
        bookingData.date = new Date(bookingData.date);
      }
      setBooking(bookingData);
    } else {
      // If no booking data, redirect to booking page
      navigate('/booking');
    }
  }, [navigate]);

  const serviceCategories: { [key: string]: string } = {
    'cleaning': 'Cleaning Services',
    'maintenance': 'Home Maintenance',
    'maids': 'Trained Maids',
    'facility': 'Facility Management',
    'fumigation': 'Fumigation Services'
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-wewash-blue mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-wewash-gold-light/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-foreground">Thank you for booking with WeWash Zambia</p>
          <p className="text-muted-foreground mt-2">Your booking reference: <span className="font-mono font-bold text-wewash-blue">{booking.id}</span></p>
        </div>

        {/* Booking Details Card */}
        <Card className="shadow-elegant border-0 mb-6">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Booking Summary
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Your service has been scheduled and our team will contact you shortly
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Service Details */}
            <div className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
              <Package className="h-6 w-6 text-wewash-blue mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Service Details</h3>
                <p className="text-muted-foreground">{serviceCategories[booking.serviceCategory]} - {booking.specificService}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-wewash-gold text-wewash-gold-dark text-sm rounded-full font-medium">
                  {booking.packageTier} Package
                </span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
              <Calendar className="h-6 w-6 text-wewash-blue mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Scheduled Date & Time</h3>
                <p className="text-muted-foreground">{format(booking.date, "EEEE, MMMM d, yyyy")}</p>
                <p className="text-muted-foreground">{booking.time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
              <MapPin className="h-6 w-6 text-wewash-blue mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Service Location</h3>
                <p className="text-muted-foreground">{booking.location}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
              <User className="h-6 w-6 text-wewash-blue mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Contact Information</h3>
                <div className="space-y-1 mt-2">
                  <p className="text-muted-foreground flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {booking.name}
                  </p>
                  <p className="text-muted-foreground flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {booking.email}
                  </p>
                  <p className="text-muted-foreground flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {booking.phone}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="shadow-lg border-wewash-blue/20 mb-6">
          <CardHeader>
            <CardTitle className="text-wewash-blue">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-wewash-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Confirmation Call</p>
                  <p className="text-sm text-muted-foreground">Our team will call you within 2 hours to confirm the details and answer any questions.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-wewash-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Service Preparation</p>
                  <p className="text-sm text-muted-foreground">We'll prepare our team and equipment for your specific service requirements.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-wewash-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Service Delivery</p>
                  <p className="text-sm text-muted-foreground">Our professional team will arrive at your location on time and deliver exceptional service.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="premium" 
            size="mobile" 
            onClick={() => navigate('/booking')}
            className="flex-1"
          >
            Make Another Booking
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="mobile" 
            onClick={() => navigate('/')}
            className="flex-1"
          >
            Back to Home
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <Card className="bg-wewash-blue-light/10 border-wewash-blue/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Need help or have questions about your booking?
              </p>
              <Button variant="whatsapp" size="sm">
                <Phone className="mr-2 h-4 w-4" />
                Contact Support via WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;