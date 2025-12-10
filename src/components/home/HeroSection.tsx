import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2,
  Star
} from 'lucide-react';
import heroImage from '@/assets/hero-cleaning-professionals.jpg';

const HeroSection = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank');
  };

  const highlights = [
    'Professional & Trained Staff',
    'Eco-Friendly Products',
    'Satisfaction Guaranteed',
    '24/7 Customer Support',
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float-gentle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative container-wewash py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-6 animate-fade-up">
            <Star className="h-4 w-4 text-wewash-gold fill-wewash-gold" />
            <span>Premium Cleaning Services in Zambia</span>
          </div>

          {/* Headline */}
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Premium Cleaning &
            <span className="block text-wewash-gold">Property Services</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            From home cleaning to facility management, we deliver exceptional 
            service for residential, commercial, and institutional clients.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {highlights.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-white/90">
                <CheckCircle2 className="h-5 w-5 text-wewash-gold" />
                <span className="text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={() => navigate('/book')}
              className="btn-gold text-lg px-8 py-6 gap-2"
            >
              Book a Service
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
            <div className="flex items-center gap-2 text-white/80">
              <CheckCircle2 className="h-5 w-5 text-wewash-gold" />
              <span className="text-sm">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <CheckCircle2 className="h-5 w-5 text-wewash-gold" />
              <span className="text-sm">Background Checked Staff</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <CheckCircle2 className="h-5 w-5 text-wewash-gold" />
              <span className="text-sm">Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
