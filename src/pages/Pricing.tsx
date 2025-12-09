import React from 'react';
import Layout from '@/components/layout/Layout';
import { 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Crown,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const packages = [
    {
      name: 'Standard',
      icon: Shield,
      description: 'Essential cleaning services with quality assurance',
      multiplier: '1x',
      features: [
        'Professional cleaning staff',
        'Quality cleaning products',
        'Standard scheduling',
        'Email support',
        '24-hour satisfaction guarantee',
      ],
      popular: false,
    },
    {
      name: 'Premium',
      icon: Star,
      description: 'Enhanced service with premium products and priority support',
      multiplier: '1.5x',
      features: [
        'Everything in Standard',
        'Premium eco-friendly products',
        'Priority scheduling',
        'Phone & WhatsApp support',
        'Extended service warranty',
        'Dedicated team assignment',
      ],
      popular: true,
    },
    {
      name: 'VIP',
      icon: Crown,
      description: 'White-glove service for the most discerning clients',
      multiplier: '2x',
      features: [
        'Everything in Premium',
        'Luxury-grade products',
        'Same-day scheduling',
        '24/7 dedicated support',
        'Personal account manager',
        'Complimentary add-ons',
        'Monthly quality audits',
      ],
      popular: false,
    },
  ];

  const services = [
    { name: 'Home Cleaning (Standard)', price: 'ZMW 350' },
    { name: 'Home Cleaning (Deep)', price: 'ZMW 550' },
    { name: 'Move In/Out Cleaning', price: 'ZMW 750' },
    { name: 'Basic Car Wash', price: 'ZMW 150' },
    { name: 'Full Car Detail', price: 'ZMW 350' },
    { name: 'Premium Car Detail', price: 'ZMW 500' },
    { name: 'Residential Fumigation', price: 'ZMW 400' },
    { name: 'Commercial Fumigation', price: 'From ZMW 800' },
    { name: 'Termite Treatment', price: 'From ZMW 1,200' },
    { name: 'Office Cleaning (Daily)', price: 'ZMW 200/day' },
    { name: 'Office Cleaning (Weekly)', price: 'ZMW 800/week' },
    { name: 'Office Cleaning (Monthly)', price: 'ZMW 2,800/month' },
    { name: 'Maid Service (Daily)', price: 'ZMW 150/day' },
    { name: 'Maid Service (Live-in)', price: 'ZMW 2,500/month' },
    { name: 'Facility Management', price: 'From ZMW 2,500/month' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-wewash-navy py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-wewash-navy via-wewash-navy to-primary/20" />
        <div className="container-wewash relative">
          <div className="max-w-3xl">
            <span className="badge-gold mb-6">Pricing</span>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transparent
              <span className="text-wewash-gold"> Pricing</span>
            </h1>
            <p className="text-xl text-white/80">
              Choose the package that fits your needs. All prices are in Zambian Kwacha (ZMW).
              Custom quotes available for large or recurring projects.
            </p>
          </div>
        </div>
      </section>

      {/* Package Tiers */}
      <section className="section-spacing">
        <div className="container-wewash">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-primary mb-4">Service Tiers</span>
            <h2 className="text-foreground mb-4">Choose Your Service Level</h2>
            <p className="text-lg text-muted-foreground">
              Each tier multiplies the base service price. Choose based on your 
              requirements for products, scheduling, and support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <div 
                  key={index}
                  className={`relative rounded-2xl p-8 ${
                    pkg.popular 
                      ? 'bg-primary text-primary-foreground ring-4 ring-wewash-gold' 
                      : 'bg-muted/50'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-wewash-gold text-wewash-navy px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      pkg.popular ? 'bg-white/20' : 'bg-primary/10'
                    }`}>
                      <Icon className={`h-6 w-6 ${pkg.popular ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                      <p className={`text-sm ${pkg.popular ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {pkg.multiplier} base price
                      </p>
                    </div>
                  </div>
                  
                  <p className={`mb-6 ${pkg.popular ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {pkg.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className={`h-5 w-5 mt-0.5 ${
                          pkg.popular ? 'text-wewash-gold' : 'text-primary'
                        }`} />
                        <span className={pkg.popular ? 'text-white/90' : 'text-foreground'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => navigate('/book')}
                    className={`w-full gap-2 ${pkg.popular ? 'btn-gold' : 'btn-primary'}`}
                  >
                    Select {pkg.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Prices */}
      <section className="section-spacing bg-muted/30">
        <div className="container-wewash">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-success mb-4">Base Prices</span>
            <h2 className="text-foreground mb-4">Service Price Guide</h2>
            <p className="text-lg text-muted-foreground">
              Standard tier base prices. Multiply by tier multiplier for Premium (1.5x) or VIP (2x).
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-background rounded-2xl shadow-card overflow-hidden">
              <div className="grid grid-cols-2 bg-primary text-primary-foreground font-semibold">
                <div className="p-4 border-b border-white/10">Service</div>
                <div className="p-4 border-b border-white/10 text-right">Price (ZMW)</div>
              </div>
              {services.map((service, index) => (
                <div 
                  key={index}
                  className={`grid grid-cols-2 ${
                    index % 2 === 0 ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="p-4 border-b border-border text-foreground">
                    {service.name}
                  </div>
                  <div className="p-4 border-b border-border text-right font-semibold text-primary">
                    {service.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-wewash-navy">
        <div className="container-wewash text-center">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Quote?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            For large projects, recurring services, or special requirements, 
            contact us for a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/contact')}
              className="btn-gold gap-2"
            >
              Request Quote
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/book')}
              variant="outline"
              className="border-white text-white hover:bg-white/10 gap-2"
            >
              Book Now
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
