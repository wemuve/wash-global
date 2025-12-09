import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  ArrowRight, 
  ArrowLeft,
  Check,
  Home,
  Car,
  Bug,
  Building2,
  Briefcase,
  Users,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Star,
  Crown,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useBookingSimple } from '@/hooks/useBookingSimple';
import { usePayment } from '@/hooks/usePayment';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const services = [
  { id: 'home-cleaning', name: 'Home Cleaning', icon: Home, basePrice: 350 },
  { id: 'car-detailing', name: 'Car Detailing', icon: Car, basePrice: 150 },
  { id: 'fumigation', name: 'Fumigation', icon: Bug, basePrice: 400 },
  { id: 'facility', name: 'Facility Management', icon: Building2, basePrice: 2500 },
  { id: 'office', name: 'Office Cleaning', icon: Briefcase, basePrice: 200 },
  { id: 'maids', name: 'Trained Maids', icon: Users, basePrice: 150 },
];

const packages = [
  { id: 'standard', name: 'Standard', icon: Shield, multiplier: 1, description: 'Essential service with quality assurance' },
  { id: 'premium', name: 'Premium', icon: Star, multiplier: 1.5, description: 'Enhanced service with premium products' },
  { id: 'vip', name: 'VIP', icon: Crown, multiplier: 2, description: 'White-glove service for discerning clients' },
];

const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

const paymentMethods = [
  { id: 'mtn', name: 'MTN Money', color: 'bg-yellow-400', textColor: 'text-yellow-900' },
  { id: 'airtel', name: 'Airtel Money', color: 'bg-red-500', textColor: 'text-white' },
  { id: 'zamtel', name: 'Zamtel Money', color: 'bg-green-500', textColor: 'text-white' },
];

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createBooking, isLoading } = useBookingSimple();
  const { initiatePayment, simulatePaymentCompletion, loading: paymentLoading } = usePayment();
  
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    serviceId: '',
    packageId: 'standard',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    instructions: '',
    paymentMethod: '' as 'mtn' | 'airtel' | 'zamtel' | '',
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentTransactionRef, setPaymentTransactionRef] = useState('');

  const selectedService = services.find(s => s.id === booking.serviceId);
  const selectedPackage = packages.find(p => p.id === booking.packageId);
  const totalPrice = selectedService && selectedPackage 
    ? selectedService.basePrice * selectedPackage.multiplier 
    : 0;

  const handleSubmit = async () => {
    if (!selectedService || !selectedPackage || !booking.paymentMethod) {
      toast({
        title: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    setProcessingPayment(true);

    try {
      // First, create the booking
      const result = await createBooking({
        serviceName: selectedService.name,
        packageName: selectedPackage.name,
        scheduledDate: booking.date,
        scheduledTime: booking.time,
        customerName: booking.name,
        customerPhone: booking.phone,
        customerEmail: booking.email,
        customerAddress: booking.address,
        specialInstructions: booking.instructions,
        totalAmount: totalPrice,
        currency: 'ZMW',
      });

      if (!result.success) {
        throw new Error('Failed to create booking');
      }

      // Initiate payment
      const paymentResult = await initiatePayment({
        amount: totalPrice,
        currency: 'ZMW',
        customerName: booking.name,
        customerPhone: booking.phone,
        customerEmail: booking.email,
        serviceName: selectedService.name,
        bookingId: result.booking?.id,
        paymentMethod: booking.paymentMethod as 'mtn' | 'airtel' | 'zamtel',
      });

      if (paymentResult.success && paymentResult.transactionRef) {
        setPaymentTransactionRef(paymentResult.transactionRef);
        
        // Send WhatsApp notification via booking webhook
        await supabase.functions.invoke('booking-webhook', {
          body: {
            booking_id: result.booking?.id,
            customer_name: booking.name,
            customer_phone: booking.phone,
            customer_email: booking.email,
            customer_address: booking.address,
            service_name: selectedService.name,
            scheduled_date: booking.date,
            scheduled_time: booking.time,
            total_amount: totalPrice,
            status: 'pending_payment',
            special_instructions: booking.instructions,
          }
        });

        toast({
          title: '📱 Complete payment on your phone',
          description: `Check your ${booking.paymentMethod.toUpperCase()} Money for payment prompt`,
        });

        // For demo: simulate payment completion after 3 seconds
        setTimeout(async () => {
          if (paymentResult.transactionRef) {
            const confirmResult = await simulatePaymentCompletion(paymentResult.transactionRef);
            if (confirmResult.success) {
              navigate('/booking-confirmation', { 
                state: { 
                  booking: result.booking,
                  serviceName: selectedService.name,
                  packageName: selectedPackage.name,
                  paymentMethod: booking.paymentMethod,
                  receiptNumber: confirmResult.receiptNumber,
                  transactionRef: paymentResult.transactionRef,
                } 
              });
            }
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Booking/payment error:', error);
      toast({
        title: 'Booking Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return booking.serviceId !== '';
      case 2: return booking.packageId !== '';
      case 3: return booking.date !== '' && booking.time !== '';
      case 4: return booking.name !== '' && booking.phone !== '' && booking.address !== '';
      case 5: return booking.paymentMethod !== '';
      default: return false;
    }
  };

  return (
    <Layout>
      {/* Progress Header */}
      <section className="bg-wewash-navy py-8">
        <div className="container-wewash">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  step >= s 
                    ? 'bg-wewash-gold text-wewash-navy' 
                    : 'bg-white/20 text-white/60'
                }`}>
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 6 && (
                  <div className={`w-6 md:w-12 h-1 mx-1 md:mx-2 ${
                    step > s ? 'bg-wewash-gold' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-white/80">
            {step === 1 && 'Select Service'}
            {step === 2 && 'Choose Package'}
            {step === 3 && 'Pick Date & Time'}
            {step === 4 && 'Your Details'}
            {step === 5 && 'Payment Method'}
            {step === 6 && 'Confirm & Pay'}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-spacing">
        <div className="container-wewash max-w-4xl">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                What service do you need?
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => {
                  const Icon = service.icon;
                  const isSelected = booking.serviceId === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setBooking({ ...booking, serviceId: service.id })}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        isSelected 
                          ? 'border-primary bg-primary-muted' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        isSelected ? 'bg-primary' : 'bg-muted'
                      }`}>
                        <Icon className={`h-6 w-6 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
                      <p className="text-sm text-primary font-medium">From ZMW {service.basePrice}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Package Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Choose your package
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                  const Icon = pkg.icon;
                  const isSelected = booking.packageId === pkg.id;
                  const price = selectedService ? selectedService.basePrice * pkg.multiplier : 0;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setBooking({ ...booking, packageId: pkg.id })}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        isSelected 
                          ? 'border-primary bg-primary-muted ring-2 ring-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        isSelected ? 'bg-primary' : 'bg-muted'
                      }`}>
                        <Icon className={`h-6 w-6 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{pkg.description}</p>
                      <p className="text-lg font-bold text-primary">ZMW {price}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                When would you like the service?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4" />
                    Select Date
                  </Label>
                  <Input
                    type="date"
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4" />
                    Select Time
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setBooking({ ...booking, time })}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          booking.time === time
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-primary/10'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Customer Details */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Your contact details
              </h2>
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    Phone Number (for Mobile Money)
                  </Label>
                  <Input
                    type="tel"
                    value={booking.phone}
                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                    placeholder="+260 XXX XXX XXX"
                    required
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4" />
                    Email (Optional)
                  </Label>
                  <Input
                    type="email"
                    value={booking.email}
                    onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Service Address
                  </Label>
                  <Textarea
                    value={booking.address}
                    onChange={(e) => setBooking({ ...booking, address: e.target.value })}
                    placeholder="Full address for the service"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2">Special Instructions (Optional)</Label>
                  <Textarea
                    value={booking.instructions}
                    onChange={(e) => setBooking({ ...booking, instructions: e.target.value })}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment Method */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                Choose Payment Method
              </h2>
              <p className="text-center text-muted-foreground mb-6">
                Pay instantly with Mobile Money
              </p>
              <div className="max-w-md mx-auto grid gap-4">
                {paymentMethods.map((method) => {
                  const isSelected = booking.paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setBooking({ ...booking, paymentMethod: method.id as 'mtn' | 'airtel' | 'zamtel' })}
                      className={`p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isSelected 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl ${method.color} flex items-center justify-center`}>
                        <Smartphone className={`h-7 w-7 ${method.textColor}`} />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-foreground">{method.name}</h3>
                        <p className="text-sm text-muted-foreground">Pay with your {method.name} wallet</p>
                      </div>
                      {isSelected && (
                        <Check className="h-6 w-6 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-6">
                Secure payment powered by DPO/Paystack Zambia
              </p>
            </div>
          )}

          {/* Step 6: Confirmation */}
          {step === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Confirm & Pay
              </h2>
              <div className="max-w-lg mx-auto bg-muted/50 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{selectedPackage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{new Date(booking.date).toLocaleDateString('en-ZM', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{booking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{booking.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{booking.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-right max-w-[200px]">{booking.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{paymentMethods.find(m => m.id === booking.paymentMethod)?.name}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">ZMW {totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                You will receive a payment prompt on your phone after confirming.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="gap-2"
                disabled={processingPayment}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {step < 6 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || paymentLoading || processingPayment}
                className="btn-gold gap-2"
              >
                {processingPayment ? (
                  <>
                    <span className="animate-pulse">Processing...</span>
                  </>
                ) : (
                  <>
                    Pay ZMW {totalPrice.toLocaleString()}
                    <CreditCard className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
