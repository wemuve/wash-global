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
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useBookingSimple } from '@/hooks/useBookingSimple';
import { useNavigate } from 'react-router-dom';

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

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createBooking, isLoading } = useBookingSimple();
  
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
  });

  const selectedService = services.find(s => s.id === booking.serviceId);
  const selectedPackage = packages.find(p => p.id === booking.packageId);
  const totalPrice = selectedService && selectedPackage 
    ? selectedService.basePrice * selectedPackage.multiplier 
    : 0;

  const handleSubmit = async () => {
    if (!selectedService || !selectedPackage) return;

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

    if (result.success) {
      navigate('/booking-confirmation', { 
        state: { 
          booking: result.booking,
          serviceName: selectedService.name,
          packageName: selectedPackage.name,
        } 
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return booking.serviceId !== '';
      case 2: return booking.packageId !== '';
      case 3: return booking.date !== '' && booking.time !== '';
      case 4: return booking.name !== '' && booking.phone !== '' && booking.address !== '';
      default: return false;
    }
  };

  return (
    <Layout>
      {/* Progress Header */}
      <section className="bg-wewash-navy py-8">
        <div className="container-wewash">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s 
                    ? 'bg-wewash-gold text-wewash-navy' 
                    : 'bg-white/20 text-white/60'
                }`}>
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 5 && (
                  <div className={`w-12 md:w-20 h-1 mx-2 ${
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
            {step === 5 && 'Confirm Booking'}
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
                    Phone Number
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

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Confirm your booking
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
                <div className="border-t pt-4 flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">ZMW {totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Payment will be collected on-site after service completion.
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
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {step < 5 ? (
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
                disabled={isLoading}
                className="btn-gold gap-2"
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
                <CreditCard className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
