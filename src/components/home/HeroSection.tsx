import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Star } from 'lucide-react';
import bedroomAfter from '@/assets/work/bedroom-after.jpg';
import bedroomDetail from '@/assets/work/bedroom-detail.jpg';

const HeroSection = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hi WeWash, I need a cleaning quote.', '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_30%_11%)] to-background" />

      <div className="relative container-wewash pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-secondary mb-6">
              Lusaka · Cleaning &amp; Property Care
            </p>

            <h1 className="text-foreground text-[2.75rem] md:text-6xl lg:text-[4.25rem] leading-[1.03] mb-6">
              We don&apos;t just clean.
              <span className="block text-secondary">We restore.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-8">
              Homes, offices and cars across Lusaka — handled by trained people who show up on
              time and finish properly. Tell us what you need, we&apos;ll come look, and you get
              one honest price before any work starts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button onClick={() => navigate('/quote')} className="btn-gold text-base px-8 py-6 gap-2">
                Get my price
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={openWhatsApp} className="btn-whatsapp text-base px-8 py-6 gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-8 border-t border-border/40">
              <div>
                <p className="text-2xl font-display font-semibold text-foreground">1,200+</p>
                <p className="text-sm text-muted-foreground">jobs finished in Lusaka</p>
              </div>
              <div>
                <p className="text-2xl font-display font-semibold text-foreground">Same week</p>
                <p className="text-sm text-muted-foreground">bookings, most areas</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-secondary fill-secondary" />
                <p className="text-sm text-muted-foreground">4.8 average from repeat clients</p>
              </div>
            </div>
          </div>

          {/* Right — real work */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 overflow-hidden rounded-3xl border border-border/40">
              <img
                src={bedroomAfter}
                alt="Bedroom in Lusaka after a WeWash deep clean"
                className="w-full h-[280px] md:h-[340px] object-cover"
                loading="eager"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/40">
              <img
                src={bedroomDetail}
                alt="Freshly made bed after professional cleaning"
                className="w-full h-40 object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl border border-secondary/25 bg-secondary/5 p-5 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every price on this site is a <span className="text-secondary font-semibold">starting point</span>.
                The real quote comes after we see the space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
