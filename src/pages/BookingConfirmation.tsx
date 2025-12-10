import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  ArrowRight,
  Home,
  MessageCircle,
  Sparkles,
  Clock,
  User
} from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, serviceName, packageName } = location.state || {};

  if (!booking) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">No booking found</h1>
            <Button onClick={() => navigate('/book')} className="btn-primary">
              Make a Booking
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Booking Confirmed | WeWash Global</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="section-spacing">
        <div className="container-wewash max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-success/30 shadow-glow">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-success mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-muted-foreground">Thank you for booking with WeWash Global</p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-card rounded-2xl ring-1 ring-border p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg text-foreground">Booking Details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono text-sm text-foreground">{booking.id?.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium text-foreground">{serviceName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Package</span>
                <span className="font-medium text-foreground">{packageName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </span>
                <span className="font-medium text-foreground">
                  {new Date(booking.scheduled_date).toLocaleDateString('en-ZM', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </span>
                <span className="font-medium text-foreground">{booking.scheduled_time}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </span>
                <span className="font-medium text-foreground text-right max-w-[200px]">{booking.customer_address}</span>
              </div>
            </div>

            <div className="border-t border-border my-4 pt-4">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-foreground">Estimated Total</span>
                <span className="font-bold text-primary">ZMW {Number(booking.total_amount).toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Pay via Mobile Money after service completion
              </p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-primary/10 rounded-2xl p-6 mb-6 ring-1 ring-primary/30">
            <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">WhatsApp Confirmation</p>
                  <p className="text-sm text-muted-foreground">You'll receive a WhatsApp message with your booking details</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Team Assignment</p>
                  <p className="text-sm text-muted-foreground">We'll assign our best team for your service</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Service & Payment</p>
                  <p className="text-sm text-muted-foreground">After service completion, pay via MTN, Airtel, or Zamtel Money</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card rounded-xl p-4 mb-6 text-center ring-1 ring-border">
            <p className="text-sm text-muted-foreground mb-2">
              Questions about your booking?
            </p>
            <a 
              href="https://wa.me/260768671420" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              Chat with us on WhatsApp
            </a>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/book')}
              className="btn-primary flex-1 gap-2"
            >
              Make Another Booking
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1 gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingConfirmation;