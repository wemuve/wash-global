import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hello, I would like to get a quote for your services.', '_blank');
  };

  return (
    <section className="py-24 md:py-32 bg-card/50">
      {/* Single gold line */}
      <div className="container-wewash">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-secondary text-xs uppercase tracking-[0.25em] font-medium mb-6">Get Started</p>

          <h2 className="text-foreground text-4xl md:text-5xl font-light mb-6">
            Ready for
            <span className="block font-bold text-secondary">Premium Service?</span>
          </h2>

          <p className="text-muted-foreground font-light leading-relaxed mb-10 max-w-lg mx-auto">
            Every space is unique. Our experts deliver a tailored quote that reflects 
            your exact requirements — no surprises, no hidden costs.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              onClick={() => navigate('/quote')}
              className="btn-gold text-sm uppercase tracking-wider px-10 py-6 gap-3"
            >
              Request a Free Quote
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              onClick={openWhatsApp}
              variant="outline"
              className="border-border/40 text-foreground/70 hover:text-foreground text-sm uppercase tracking-wider px-10 py-6 gap-3"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          <a href="tel:+260768671420" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-secondary transition-colors">
            <Phone className="h-3.5 w-3.5" />
            +260 768 671 420
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
