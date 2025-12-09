import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Phone, Calendar } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hello, I would like to get a quote for your services.', '_blank');
  };

  return (
    <section className="relative section-spacing overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-header" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-wewash-blue/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-wewash-gold/10 blur-3xl" />
      </div>

      <div className="relative container-wewash">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-6">
            <Calendar className="h-4 w-4" />
            <span>Schedule your service today</span>
          </div>

          {/* Headline */}
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Experience
            <span className="block text-wewash-gold">Premium Service?</span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Get a free, no-obligation quote within 2 hours. Our team is ready to 
            help you with all your cleaning and property management needs.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              onClick={() => navigate('/book')}
              className="btn-gold text-lg px-10 py-6 gap-2"
            >
              Book Online
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
          <div className="flex flex-col sm:flex-row justify-center gap-8 text-white/80">
            <a href="tel:+260768671420" className="flex items-center justify-center gap-2 hover:text-white transition-colors">
              <Phone className="h-5 w-5" />
              <span>+260 768 671 420 (Zambia)</span>
            </a>
            <a href="tel:+4560678193" className="flex items-center justify-center gap-2 hover:text-white transition-colors">
              <Phone className="h-5 w-5" />
              <span>+45 60 67 81 93 (Denmark)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
