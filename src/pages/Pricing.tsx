import React from 'react';
import { Helmet } from 'react-helmet-async';
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
    { name: 'Home Cleaning (Standard)', price: 'From ZMW 350' },
    { name: 'Home Cleaning (Deep)', price: 'From ZMW 550' },
    { name: 'Move In/Out Cleaning', price: 'From ZMW 750' },
    { name: 'Basic Car Wash', price: 'From ZMW 150' },
    { name: 'Full Car Detail', price: 'From ZMW 350' },
    { name: 'Premium Car Detail', price: 'From ZMW 500' },
    { name: 'Residential Fumigation', price: 'From ZMW 400' },
    { name: 'Commercial Fumigation', price: 'From ZMW 800' },
    { name: 'Termite Treatment', price: 'From ZMW 1,200' },
    { name: 'Office Cleaning (Daily)', price: 'From ZMW 200/day' },
    { name: 'Office Cleaning (Weekly)', price: 'From ZMW 800/week' },
    { name: 'Office Cleaning (Monthly)', price: 'From ZMW 2,800/month' },
    { name: 'Maid Service (Daily)', price: 'From ZMW 150/day' },
    { name: 'Maid Service (Live-in)', price: 'From ZMW 2,500/month' },
    { name: 'Facility Management', price: 'From ZMW 2,500/month' },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Pricing | WeWash Global - Transparent Service Pricing in Zambia</title>
        <meta name="description" content="View transparent pricing for all WeWash Global services. Standard, Premium, and VIP packages available. Pay after service completion." />
        <meta name="keywords" content="cleaning prices Zambia, car wash prices Lusaka, fumigation cost, maid service rates" />
        <link rel="canonical" href="https://wewashglobal.com/pricing" />
        <meta property="og:title" content="Service Pricing | WeWash Global" />
        <meta property="og:description" content="Transparent pricing for professional cleaning and facility services in Zambia." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-card to-primary/10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container-wewash relative">
          <div className="max-w-3xl">
            <span className="badge-gold mb-6">Pricing</span>
            <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transparent
              <span className="text-primary"> Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              All prices shown are <span className="text-wewash-gold font-semibold">starting estimates</span>. 
              Final pricing is tailored after a professional assessment of your specific needs.
              <span className="text-primary font-semibold"> Pay only after service completion.</span>
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
                      ? 'bg-gradient-to-br from-primary/20 to-primary/5 ring-2 ring-primary shadow-glow' 
                      : 'bg-card ring-1 ring-border'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      pkg.popular ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className={`h-6 w-6 ${pkg.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pkg.multiplier} base price
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    {pkg.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className={`h-5 w-5 mt-0.5 ${
                          pkg.popular ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <span className="text-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => navigate('/book')}
                    className={`w-full gap-2 ${pkg.popular ? 'btn-primary' : ''}`}
                    variant={pkg.popular ? 'default' : 'outline'}
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
      <section className="section-spacing bg-card/50">
        <div className="container-wewash">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-success mb-4">Starting Prices</span>
            <h2 className="text-foreground mb-4">Service Price Guide</h2>
            <p className="text-lg text-muted-foreground">
              All prices shown are <span className="text-primary font-semibold">starting estimates</span> for standard-tier service. 
              Final pricing is determined after a professional assessment of your specific requirements including 
              property size, condition, location, labour, transport, and materials needed.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
              <div className="grid grid-cols-2 bg-primary text-primary-foreground font-semibold">
                <div className="p-4 border-b border-primary-foreground/20">Service</div>
                <div className="p-4 border-b border-primary-foreground/20 text-right">Price (ZMW)</div>
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
            
            {/* Important Disclaimer */}
            <div className="mt-6 p-5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <p className="text-sm text-foreground font-semibold mb-2">⚠️ Important: Prices Are Starting Estimates</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All prices listed above are <strong className="text-foreground">starting from</strong> rates for basic scope. 
                Your final quote will be provided after a <strong className="text-foreground">professional on-site or virtual assessment</strong> that considers:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• <strong className="text-foreground">Property size</strong> — number of rooms, square footage, or vehicle type</li>
                <li>• <strong className="text-foreground">Condition & workload</strong> — level of dirt, damage, or neglect</li>
                <li>• <strong className="text-foreground">Location & transport</strong> — distance from our base of operations</li>
                <li>• <strong className="text-foreground">Labour & materials</strong> — team size, specialist chemicals, and equipment required</li>
                <li>• <strong className="text-foreground">Special requirements</strong> — windows, carpets, upholstery, or add-on services</li>
              </ul>
              <p className="mt-3 text-sm text-primary font-medium">
                Request a free, no-obligation quote to get your exact price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-gradient-to-br from-primary/20 via-card to-background">
        <div className="container-wewash text-center">
          <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Quote?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
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
              className="gap-2"
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