import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Briefcase,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const services = [
  'Home Cleaning',
  'Car Detailing',
  'Fumigation',
  'Facility Management',
  'Office Cleaning',
  'Domestic Staff',
];

const areas = [
  'Lusaka Central',
  'Lusaka South',
  'Lusaka East',
  'Lusaka West',
  'Chilanga',
  'Kafue',
];

const VendorRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    specializations: [] as string[],
    serviceAreas: [] as string[],
  });

  const handleCheckbox = (field: 'specializations' | 'serviceAreas', value: string) => {
    const current = form[field];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setForm({ ...form, [field]: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.specializations.length === 0) {
      toast({ title: 'Please select at least one service', variant: 'destructive' });
      return;
    }
    if (form.serviceAreas.length === 0) {
      toast({ title: 'Please select at least one service area', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('vendors').insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        specializations: form.specializations,
        service_areas: form.serviceAreas,
        is_active: false,
        is_verified: false,
      });

      if (error) throw error;

      toast({
        title: 'Application Submitted!',
        description: "We'll review your application and get back to you soon.",
      });

      navigate('/');
    } catch (error) {
      console.error('Vendor registration error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-wewash-navy py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-wewash-navy via-wewash-navy to-primary/20" />
        <div className="container-wewash relative">
          <div className="max-w-3xl">
            <span className="badge-gold mb-6">Join Our Team</span>
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-6">
              Become a WeWash
              <span className="text-wewash-gold"> Vendor</span>
            </h1>
            <p className="text-xl text-white/80">
              Join our network of professional service providers and grow your business 
              with consistent work opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section-spacing">
        <div className="container-wewash max-w-2xl">
          <div className="bg-background rounded-2xl shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+260 XXX XXX XXX"
                    required
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4" />
                  Services You Provide
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={form.specializations.includes(service)}
                        onCheckedChange={() => handleCheckbox('specializations', service)}
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  Service Areas
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {areas.map((area) => (
                    <label
                      key={area}
                      className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={form.serviceAreas.includes(area)}
                        onCheckedChange={() => handleCheckbox('serviceAreas', area)}
                      />
                      <span className="text-sm">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2">Experience & Background</Label>
                <Textarea
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="Tell us about your experience in the industry..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="btn-primary w-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Benefits */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-center mb-6">Why Join WeWash?</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { title: 'Consistent Work', description: 'Regular job assignments from our growing customer base' },
                { title: 'Fair Compensation', description: 'Competitive rates with transparent payment terms' },
                { title: 'Training & Support', description: 'Professional development and ongoing support' },
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-muted flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VendorRegistration;
