import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AIPriceCalculator from '@/components/booking/AIPriceCalculator';
import VoiceAgentButton from '@/components/dashboard/VoiceAgentButton';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Sparkles, ClipboardList, Phone, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ELEVENLABS_AGENT_ID = 'domain_pk_6939d88162dc8194a3b663d6b1565ea600f1fa0fd59a280e';

const GetQuote = () => {
  const navigate = useNavigate();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const handlePriceCalculated = (price: number) => {
    setCalculatedPrice(price);
  };

  const handleBookNow = (result: any) => {
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
        <title>Get Starting Estimate | WeWash Global AI Price Estimator</title>
        <meta name="description" content="Get a starting price estimate for premium cleaning services in Zambia. AI-powered estimator with transport and condition multipliers. Final quote after professional assessment." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-background via-card to-primary/10 py-12 lg:py-20">
        <div className="container-wewash">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-gold mb-4">AI-Powered Estimator</span>
            <h1 className="text-foreground text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Get Your <span className="text-primary">Starting Estimate</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Our AI provides an indicative starting price based on your requirements. 
              <span className="text-secondary font-semibold"> Final pricing is confirmed after a professional assessment</span> of 
              scope, condition, transport, labour, and materials by our sales manager.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-spacing -mt-8">
        <div className="container-wewash max-w-2xl">
          {/* Voice Agent */}
          <div className="mb-6 p-4 bg-card rounded-xl border border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2 text-foreground">
                  <Phone className="h-5 w-5 text-primary" />
                  Speak to Our AI Assistant
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get instant answers about services and pricing
                </p>
              </div>
              <VoiceAgentButton agentId={ELEVENLABS_AGENT_ID} />
            </div>
          </div>
          
          <AIPriceCalculator 
            onPriceCalculated={handlePriceCalculated}
            onBookNow={handleBookNow}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing bg-muted/30">
        <div className="container-wewash">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">1. Describe Your Job</h3>
              <p className="text-sm text-muted-foreground">
                Service type, bedrooms, condition, location, and special requirements
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">2. AI Starting Estimate</h3>
              <p className="text-sm text-muted-foreground">
                Includes base price, condition multiplier, and Yango transport estimate
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">3. Professional Confirmation</h3>
              <p className="text-sm text-muted-foreground">
                Sales manager confirms final quote after workload and site assessment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="container-wewash text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Prefer to Speak to Someone?</h2>
          <p className="text-muted-foreground mb-6">
            Our team is available on WhatsApp for professional quotes and assessments
          </p>
          <Button 
            onClick={() => window.open('https://wa.me/260768671420?text=Hello, I need a professional quote for my requirements', '_blank')}
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
