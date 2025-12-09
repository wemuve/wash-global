import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ArrowRight,
  Receipt,
  CreditCard,
  Home,
  MessageCircle
} from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, serviceName, packageName, paymentMethod, receiptNumber, transactionRef } = location.state || {};

  if (!booking) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No booking found</h1>
            <Button onClick={() => navigate('/book')} className="btn-primary">
              Make a Booking
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const paymentMethodLabels: Record<string, string> = {
    mtn: 'MTN Money',
    airtel: 'Airtel Money',
    zamtel: 'Zamtel Money',
  };

  return (
    <Layout>
      <section className="section-spacing">
        <div className="container-wewash max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce-once">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-lg text-foreground">Thank you for booking with WeWash Zambia</p>
          </div>

          {/* Receipt Card */}
          <div className="bg-background rounded-2xl shadow-card p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <Receipt className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Digital Receipt</h2>
            </div>

            <div className="space-y-3 text-sm">
              {receiptNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receipt No:</span>
                  <span className="font-mono font-medium">{receiptNumber}</span>
                </div>
              )}
              {transactionRef && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Ref:</span>
                  <span className="font-mono text-xs">{transactionRef}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID:</span>
                <span className="font-mono text-xs">{booking.id?.slice(0, 8)}...</span>
              </div>
            </div>

            <div className="border-t my-4"></div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package</span>
                <span className="font-medium">{packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {new Date(booking.scheduled_date).toLocaleDateString('en-ZM', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{booking.scheduled_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium text-right max-w-[200px]">{booking.customer_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{paymentMethodLabels[paymentMethod] || paymentMethod}</span>
              </div>
            </div>

            <div className="border-t my-4"></div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total Paid</span>
              <span className="text-green-600">ZMW {Number(booking.total_amount).toLocaleString()}</span>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-muted/50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Confirmation Call</p>
                  <p className="text-sm text-muted-foreground">We'll call you within 24 hours to confirm details</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Team Assignment</p>
                  <p className="text-sm text-muted-foreground">We'll assign our best team for your service</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Service Delivery</p>
                  <p className="text-sm text-muted-foreground">Our team arrives on time and delivers excellent service</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-primary/5 rounded-xl p-4 mb-6 text-center">
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
