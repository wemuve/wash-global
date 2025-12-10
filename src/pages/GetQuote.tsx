import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AIPriceCalculator from '@/components/booking/AIPriceCalculator';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Calculator, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const GetQuote = () => {
  const navigate = useNavigate();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const handlePriceCalculated = (price: number) => {
    setCalculatedPrice(price);
  };

  const handleBookNow = (result: any) => {
    // Navigate to booking with pre-filled data
    navigate('/book', { 
      state: { 
        estimatedPrice: result.estimatedPrice,
        serviceType: result.serviceType,
      } 
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Get Instant Quote | WeWash Zambia AI Price Calculator</title>
        <meta name="description" content="Get an instant price estimate for cleaning services in Zambia. Our AI calculates prices based on your job description, location, and requirements." />
      </Helmet>

      {/* Hero */}
      <section className="bg-wewash-navy py-12 lg:py-20">
        <div className="container-wewash">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-gold mb-4">AI-Powered Pricing</span>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Get Your Price in <span className="text-wewash-gold">Seconds</span>
            </h1>
            <p className="text-lg text-white/80">
              Describe your cleaning job and our AI will calculate an instant estimate.
              No waiting, no callbacks - just accurate pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-spacing -mt-8">
        <div className="container-wewash max-w-2xl">
          <AIPriceCalculator 
            onPriceCalculated={handlePriceCalculated}
            onBookNow={handleBookNow}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing bg-muted/30">
        <div className="container-wewash">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Describe Your Job</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about the space, condition, and any special requirements
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-wewash-gold/20 flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-7 w-7 text-wewash-gold" />
              </div>
              <h3 className="font-semibold mb-2">2. Get AI Estimate</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your description and calculates a fair price
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Book or Get Quote</h3>
              <p className="text-sm text-muted-foreground">
                Book instantly or chat with us on WhatsApp for complex jobs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="container-wewash text-center">
          <h2 className="text-2xl font-bold mb-4">Need to Talk to Someone?</h2>
          <p className="text-muted-foreground mb-6">
            Our team is available on WhatsApp for any questions or custom quotes
          </p>
          <Button 
            onClick={() => window.open('https://wa.me/260768671420?text=Hello, I need help with a quote', '_blank')}
            className="btn-whatsapp gap-2"
            size="lg"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default GetQuote;
