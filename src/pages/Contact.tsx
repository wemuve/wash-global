import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to leads table
      const { error } = await supabase.from('leads').insert({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        message: form.message,
        source: 'contact_form',
      });

      if (error) throw error;

      // Send email notification to booking@wewashglobal.com
      try {
        await supabase.functions.invoke('send-booking-email', {
          body: {
            customerName: form.name,
            customerPhone: form.phone,
            customerEmail: form.email,
            service: 'Contact Form Inquiry',
            package: 'General',
            scheduledDate: new Date().toISOString().split('T')[0],
            scheduledTime: 'N/A',
            address: 'N/A',
            totalAmount: 0,
            specialInstructions: form.message,
          },
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
      }

      toast({
        title: 'Message Sent!',
        description: "We'll get back to you within 24 hours.",
      });

      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+260 768 671 420',
      href: 'tel:+260768671420',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'booking@wewashglobal.com',
      href: 'mailto:booking@wewashglobal.com',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+260 768 671 420',
      href: 'https://wa.me/260768671420',
    },
    {
      icon: Clock,
      label: 'Hours',
      value: 'Mon-Sat 7am-7pm, Sun 8am-4pm',
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Contact Us | WeWash Global - Get in Touch</title>
        <meta name="description" content="Contact WeWash Global for professional cleaning services in Zambia. Reach us via phone, email, or WhatsApp. Response within 24 hours guaranteed." />
        <meta name="keywords" content="contact WeWash, cleaning service Lusaka, WhatsApp cleaning service, Zambia cleaning company" />
        <link rel="canonical" href="https://wewashglobal.com/contact" />
        <meta property="og:title" content="Contact WeWash Global" />
        <meta property="og:description" content="Get in touch with our team for quotes and bookings. Response within 24 hours." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-card to-primary/10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container-wewash relative">
          <div className="max-w-3xl">
            <span className="badge-gold mb-6">Contact Us</span>
            <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Get In
              <span className="text-primary"> Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions? Need a quote? We're here to help. 
              Reach out and we'll respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-spacing">
        <div className="container-wewash">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    required
                    className="bg-card"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="bg-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+260 XXX XXX XXX"
                      required
                      className="bg-card"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your needs..."
                    rows={5}
                    required
                    className="bg-card"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="btn-primary w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              
              <div className="space-y-4 mb-8">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-card ring-1 ring-border">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a 
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-semibold text-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Locations */}
              <div className="bg-gradient-to-br from-primary/20 to-card rounded-2xl p-6 ring-1 ring-primary/30">
                <h3 className="text-foreground font-bold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Our Locations
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-foreground font-medium">Zambia (Headquarters)</p>
                      <p className="text-muted-foreground text-sm">Lusaka, Zambia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;