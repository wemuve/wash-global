import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useBookingSimple } from '@/hooks/useBookingSimple';
import { useNavigate } from 'react-router-dom';
import {
  Home, Car, Bug, Building2, Briefcase, Users,
  Calendar, Clock, User, Phone, MapPin, Mail,
  CheckCircle2, ArrowRight, Loader2, Sparkles
} from 'lucide-react';

const serviceOptions = [
  { id: 'home-cleaning', name: 'Home Cleaning', icon: Home, from: 650 },
  { id: 'car-detailing', name: 'Car Detailing', icon: Car, from: 450 },
  { id: 'fumigation', name: 'Fumigation', icon: Bug, from: 400 },
  { id: 'facility', name: 'Facility Management', icon: Building2, from: 2500 },
  { id: 'office', name: 'Office Cleaning', icon: Briefcase, from: 1200 },
  { id: 'maids', name: 'Trained Maids', icon: Users, from: 850 },
];

const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

const BookNow = () => {
  const navigate = useNavigate();
  const { createBooking, isLoading } = useBookingSimple();

  const [form, setForm] = useState({
    service: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    time: '',
    instructions: '',
  });

  const selectedService = serviceOptions.find(s => s.id === form.service);
  const isValid = form.service && form.name.length >= 2 && form.phone.length >= 9 && form.address.length >= 5 && form.date && form.time;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !selectedService) return;

    const result = await createBooking({
      serviceName: selectedService.name,
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email || undefined,
      customerAddress: form.address,
      scheduledDate: form.date,
      scheduledTime: form.time,
      specialInstructions: form.instructions || undefined,
      totalAmount: selectedService.from,
      currency: 'ZMW',
    });

    if (result.success) {
      navigate('/booking-confirmation', {
        state: {
          booking: result.booking,
          serviceName: selectedService.name,
        },
      });
    }
  };

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  return (
    <Layout>
      <Helmet>
        <title>Book Now | WeWash Global - Quick & Easy Booking</title>
        <meta name="description" content="Book professional cleaning services in Lusaka, Zambia. Simple booking, no upfront payment. WeWash Global." />
      </Helmet>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Quick Booking
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Book Your Service
            </h1>
            <p className="text-muted-foreground">
              Select a service, fill your details, and we'll handle the rest. No upfront payment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Service Selection */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                Choose a Service
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceOptions.map((svc) => {
                  const Icon = svc.icon;
                  const selected = form.service === svc.id;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => update('service', svc.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selected
                          ? 'border-primary bg-primary/10 ring-1 ring-primary'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-2 ${selected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="font-medium text-foreground text-sm">{svc.name}</p>
                      <p className="text-xs text-primary mt-1">From K{svc.from}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Your Details */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                Your Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-1.5 mb-1.5 text-sm">
                    <User className="h-3.5 w-3.5 text-primary" /> Full Name *
                  </Label>
                  <Input
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="John Mwale"
                    className="bg-card"
                    required
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-1.5 mb-1.5 text-sm">
                    <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number *
                  </Label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="+260 97X XXX XXX"
                    className="bg-card"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="flex items-center gap-1.5 mb-1.5 text-sm">
                    <Mail className="h-3.5 w-3.5 text-primary" /> Email (Optional)
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="john@example.com"
                    className="bg-card"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="flex items-center gap-1.5 mb-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Service Address *
                  </Label>
                  <Textarea
                    value={form.address}
                    onChange={e => update('address', e.target.value)}
                    placeholder="Area, street name, house number (e.g. Kabulonga, off Mwela Rd, Plot 123)"
                    rows={2}
                    className="bg-card"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 3. Date & Time */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                Pick Date & Time
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-1.5 mb-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Date *
                  </Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={e => update('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-card"
                    required
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-1.5 mb-1.5 text-sm">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Time *
                  </Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {timeSlots.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update('time', t)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all ${
                          form.time === t
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border hover:border-primary/40 text-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Special Instructions */}
            <div>
              <Label className="text-sm mb-1.5 block text-muted-foreground">Special Instructions (Optional)</Label>
              <Textarea
                value={form.instructions}
                onChange={e => update('instructions', e.target.value)}
                placeholder="Number of rooms, areas to focus on, access details, etc."
                rows={3}
                className="bg-card"
              />
            </div>

            {/* Estimate Banner */}
            {selectedService && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Starting estimate for {selectedService.name}</p>
                  <p className="text-2xl font-bold text-primary">From ZMW {selectedService.from}</p>
                  <p className="text-xs text-muted-foreground mt-1">Final price confirmed after site assessment</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-primary/60" />
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full h-14 text-lg font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Confirm Booking
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              No upfront payment required. Pay via Mobile Money after service completion.
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default BookNow;
