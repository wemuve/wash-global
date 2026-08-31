import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hi WeWash, can I get a quote?', '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-[hsl(220_30%_11%)]">
      <div className="container-wewash section-spacing">
        <div className="rounded-[2rem] border border-secondary/25 bg-card/60 px-8 py-14 md:px-16 md:py-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-secondary mb-4">Get a price</p>
              <h2 className="text-foreground mb-5">
                Tell us about the space.
                <span className="block text-secondary">We&apos;ll tell you the price.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                It takes about a minute. We come back with a proper quote — not a range, not a
                surprise at the end.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/quote')} className="btn-gold text-base px-8 py-6 gap-2 w-full">
                Request a quote
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={openWhatsApp} className="btn-whatsapp text-base px-8 py-6 gap-2 w-full">
                <MessageCircle className="h-4 w-4" />
                Message us on WhatsApp
              </Button>
              <a
                href="tel:+260768671420"
                className="flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-secondary transition-colors"
              >
                <Phone className="h-4 w-4 text-secondary" />
                <span>+260 768 671 420</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
