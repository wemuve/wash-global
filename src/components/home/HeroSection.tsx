import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2,
  Star,
  Sparkles
} from 'lucide-react';
import heroImage from '@/assets/hero-diverse-team.jpg';

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
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Animated glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative container-wewash py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 ring-1 ring-primary/30 text-primary text-sm mb-6 animate-fade-up">
            <Star className="h-4 w-4 fill-primary" />
            <span>Premium Cleaning Services in Zambia</span>
          </div>

          {/* Headline */}
          <h1 className="text-foreground text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Premium Cleaning &
            <span className="block text-primary">Property Services</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Bespoke cleaning and property solutions, tailored to your exact requirements. 
            <span className="text-primary font-semibold"> Get a personalised quote — pay only after service.</span>
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {highlights.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary" />
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
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-sm">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-sm">Background Checked Staff</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-sm">No Upfront Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;