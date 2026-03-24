import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2,
  Sparkles,
  Shield,
  Award,
  Leaf
} from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank');
  };

  const highlights = [
    'Certified & Vetted Professionals',
    'Premium Eco-Friendly Products',
    'Bespoke Quotes After Assessment',
    'Pay Only After Service Delivery',
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[hsl(220_35%_12%)]" />
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Animated glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container-wewash py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 ring-1 ring-secondary/30 text-secondary text-sm mb-6 animate-fade-up">
            <Sparkles className="h-4 w-4 fill-secondary" />
            <span>Premium Cleaning & Property Services — Lusaka, Zambia</span>
          </div>

          {/* Headline */}
          <h1 className="text-foreground text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Bespoke Cleaning.
            <span className="block text-secondary">Unmatched Standards.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Managed cleaning and property services tailored to your exact requirements. 
            <span className="text-secondary font-semibold"> Request a personalised quote — pay only after service.</span>
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {highlights.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={() => navigate('/quote')}
              className="btn-gold text-lg px-8 py-6 gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Get Your Free Quote
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              onClick={openWhatsApp}
              className="btn-whatsapp text-lg px-8 py-6 gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Inquiry
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5 text-secondary" />
              <span className="text-sm">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-5 w-5 text-secondary" />
              <span className="text-sm">Background Checked Staff</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Leaf className="h-5 w-5 text-secondary" />
              <span className="text-sm">Eco-Friendly Products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-secondary/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-secondary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
