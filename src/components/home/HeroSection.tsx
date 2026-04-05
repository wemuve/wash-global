import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank');
  };

  return (
    <section className="relative min-h-[92vh] flex items-center bg-background">
      {/* Minimal background — single subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />

      {/* Single gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="relative container-wewash py-24">
        <div className="max-w-2xl">
          {/* Small label */}
          <p className="text-secondary text-xs uppercase tracking-[0.25em] font-medium mb-8">
            Premium Property Services — Lusaka, Zambia
          </p>

          {/* Headline — large, clean typography */}
          <h1 className="text-foreground text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-8">
            Bespoke Cleaning.
            <span className="block font-bold text-secondary mt-2">Unmatched Standards.</span>
          </h1>

          {/* Subheadline — understated */}
          <p className="text-lg text-muted-foreground font-light leading-relaxed mb-12 max-w-lg">
            Managed cleaning and property services tailored to your exact requirements. 
            Request a personalised quote — pay only after service.
          </p>

          {/* CTAs — clean, spaced */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button 
              onClick={() => navigate('/quote')}
              className="btn-gold text-sm uppercase tracking-wider px-10 py-6 gap-3"
            >
              Get Your Free Quote
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              onClick={openWhatsApp}
              variant="outline"
              className="border-border/40 text-foreground/70 hover:text-foreground hover:border-foreground/30 text-sm uppercase tracking-wider px-10 py-6 gap-3"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          {/* Trust line — minimal */}
          <div className="flex flex-wrap gap-8 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <span>Licensed & Insured</span>
            <span className="text-border">—</span>
            <span>Background Checked</span>
            <span className="text-border">—</span>
            <span>Eco-Friendly</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
