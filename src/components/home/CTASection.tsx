import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Phone, Sparkles } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hello, I would like to get a quote for your services.', '_blank');
  };

  return (
    <section className="relative section-spacing overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220_35%_8%)] via-[hsl(220_30%_12%)] to-[hsl(220_35%_8%)]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
        {/* Gold accent line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      </div>

      <div className="relative container-wewash">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 ring-1 ring-secondary/20 text-secondary text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Request your bespoke service quote</span>
          </div>

          {/* Headline */}
          <h2 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Experience
            <span className="block text-secondary">Premium Service?</span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Every space is unique. Our experts conduct a professional assessment to deliver 
            a tailored quote that reflects your exact requirements — no surprises, no hidden costs.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              onClick={() => navigate('/quote')}
              className="btn-gold text-lg px-10 py-6 gap-2"
            >
              Request a Free Quote
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              onClick={openWhatsApp}
              className="btn-whatsapp text-lg px-10 py-6 gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Get Quote via WhatsApp
            </Button>
          </div>

          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row justify-center gap-8 text-muted-foreground">
            <a href="tel:+260768671420" className="flex items-center justify-center gap-2 hover:text-secondary transition-colors">
              <Phone className="h-5 w-5 text-secondary" />
              <span>+260 768 671 420 (Zambia)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
