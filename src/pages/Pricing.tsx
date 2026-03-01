import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Crown,
  Shield,
  Truck,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const packages = [
    {
      name: 'Standard',
      icon: Shield,
      description: 'Professional cleaning with quality-assured systems and trained teams',
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
      description: 'Enhanced service with premium products and priority scheduling',
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
      description: 'White-glove managed service for the most discerning clients',
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

  const homeCleaningPrices = [
    { service: 'General Cleaning – 1 Bedroom', price: 'From K550' },
    { service: 'General Cleaning – 2 Bedroom', price: 'From K700' },
    { service: 'General Cleaning – 3 Bedroom', price: 'From K900' },
    { service: 'General Cleaning – 4 Bedroom', price: 'From K1,100' },
    { service: 'Deep Cleaning – 1 Bedroom', price: 'From K850' },
    { service: 'Deep Cleaning – 2 Bedroom', price: 'From K1,200' },
    { service: 'Deep Cleaning – 3 Bedroom', price: 'From K1,800' },
    { service: 'Deep Cleaning – 4 Bedroom', price: 'From K2,500' },
    { service: 'Post-Construction – 1 Bedroom', price: 'From K1,500' },
    { service: 'Post-Construction – 2 Bedroom', price: 'From K2,000' },
    { service: 'Post-Construction – 3 Bedroom', price: 'From K2,800' },
    { service: 'Post-Construction – 4 Bedroom', price: 'From K3,500' },
  ];

  const windowPrices = [
    { service: 'Interior Standard Window', price: 'From K35/each' },
    { service: 'Interior Large Aluminum Window', price: 'From K60/each' },
    { service: 'Exterior Window (height-dependent)', price: 'From K50–K80/each' },
  ];

  const carDetailingPrices = [
    { service: 'Interior Deep Clean – Small Car', price: 'From K450' },
    { service: 'Interior Deep Clean – SUV', price: 'From K550' },
    { service: 'Full Detailing – Small Car', price: 'From K650' },
    { service: 'Full Detailing – SUV', price: 'From K850' },
    { service: 'Seat Removal Add-On', price: 'From K150–K250' },
  ];

  const otherServices = [
    { service: 'Residential Fumigation', price: 'From K400' },
    { service: 'Commercial Fumigation', price: 'From K800' },
    { service: 'Termite Treatment', price: 'From K1,200' },
    { service: 'Office Cleaning (Daily)', price: 'From K200/day' },
    { service: 'Office Cleaning (Weekly)', price: 'From K800/week' },
    { service: 'Office Cleaning (Monthly)', price: 'From K2,800/month' },
    { service: 'Maid Service (Daily)', price: 'From K150/day' },
    { service: 'Maid Service (Live-in Monthly)', price: 'From K2,500/month' },
    { service: 'Facility Management', price: 'From K2,500/month' },
  ];

  const transportPrices = [
    { distance: '0–5 km from Kabulonga', price: 'K120 return' },
    { distance: '5–10 km', price: 'K180 return' },
    { distance: '10–20 km', price: 'K250 return' },
    { distance: '20 km+', price: 'K350–K450 return' },
  ];

  const renderPriceTable = (title: string, items: { service?: string; distance?: string; price: string }[], isTransport = false) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-foreground mb-3">{title}</h3>
      <div className="bg-card rounded-xl ring-1 ring-border overflow-hidden">
        <div className="grid grid-cols-2 bg-primary/10 font-semibold text-sm">
          <div className="p-3 text-foreground">{isTransport ? 'Distance' : 'Service'}</div>
          <div className="p-3 text-right text-foreground">Price (ZMW)</div>
        </div>
        {items.map((item, index) => (
          <div key={index} className={`grid grid-cols-2 ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
            <div className="p-3 border-b border-border/50 text-sm text-foreground">
              {isTransport ? item.distance : item.service}
            </div>
            <div className="p-3 border-b border-border/50 text-right text-sm font-semibold text-primary">
              {item.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <Helmet>
        <title>Pricing | WeWash Global – Premium Service Pricing in Zambia</title>
        <meta name="description" content="View starting prices for all WeWash Global premium services. All prices are estimates – final quotes confirmed after professional assessment." />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-card to-primary/10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container-wewash relative">
          <div className="max-w-3xl">
            <span className="badge-gold mb-6">Pricing Guide</span>
            <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Starting Price
              <span className="text-primary"> Guide</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              All prices shown are <span className="text-secondary font-bold">starting estimates</span>. 
              Final pricing is tailored after a professional assessment of scope, condition, 
              transport, labour, and materials.
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
              Each tier multiplies the base starting price. Choose based on your 
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
                      <p className="text-sm text-muted-foreground">{pkg.multiplier} base price</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{pkg.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className={`h-5 w-5 mt-0.5 ${
                          pkg.popular ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => navigate('/quote')}
                    className={`w-full gap-2 ${pkg.popular ? 'btn-primary' : ''}`}
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    Get Your Estimate
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Price Tables */}
      <section className="section-spacing bg-card/50">
        <div className="container-wewash">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-success mb-4">Starting Prices</span>
            <h2 className="text-foreground mb-4">Detailed Price Guide</h2>
            <p className="text-lg text-muted-foreground">
              All prices are <span className="text-primary font-semibold">starting from</span> rates for 
              light-condition, standard-tier service. Condition multipliers and transport are additional.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {renderPriceTable('Home Cleaning', homeCleaningPrices)}
            {renderPriceTable('Window Cleaning', windowPrices)}
            {renderPriceTable('Car Detailing', carDetailingPrices)}
            {renderPriceTable('Other Services', otherServices)}

            {/* Transport Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Transport Estimate (Yango Return Trip)
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                From our base at D13 Antelope Close, Kabulonga. Transport is always shown separately.
              </p>
              {renderPriceTable('', transportPrices, true)}
            </div>

            {/* Condition Multipliers */}
            <div className="mb-8 p-5 rounded-xl bg-primary/5 ring-1 ring-primary/20">
              <h3 className="text-lg font-bold text-foreground mb-3">Condition Multipliers</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Base prices assume light/well-maintained condition. Pricing adjusts based on actual workload:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Light', mult: '1.0x', desc: 'Well-maintained' },
                  { label: 'Moderate', mult: '1.2x', desc: 'Average dirt' },
                  { label: 'Heavy', mult: '1.4x', desc: 'Neglected' },
                  { label: 'Post-Construction', mult: '1.6x', desc: 'Debris present' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 rounded-lg bg-card border border-border/50">
                    <p className="text-lg font-bold text-primary">{item.mult}</p>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mandatory Disclaimer */}
            <div className="p-5 rounded-xl bg-secondary/10 ring-1 ring-secondary/20">
              <div className="flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-bold mb-2">
                    Starting From (Estimate Only – Final Quote After Confirmation)
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is an automated estimate based on provided details. Final pricing is confirmed after 
                    workload assessment, transport calculation, labor requirement, and cleaning intensity review 
                    by our sales manager. No exceptions.
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• <strong className="text-foreground">Property size</strong> — rooms, square footage, vehicle type</li>
                    <li>• <strong className="text-foreground">Condition & workload</strong> — dirt level, damage, debris</li>
                    <li>• <strong className="text-foreground">Location & transport</strong> — Yango return trip from Kabulonga</li>
                    <li>• <strong className="text-foreground">Labour & materials</strong> — team size, chemicals, equipment</li>
                    <li>• <strong className="text-foreground">Special requirements</strong> — windows, carpets, seat removal</li>
                  </ul>
                  <p className="mt-3 text-sm text-secondary font-medium">
                    Request a free, no-obligation professional assessment to get your exact price.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-gradient-to-br from-primary/20 via-card to-background">
        <div className="container-wewash text-center">
          <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-4">
            Get Your Professional Assessment
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Our sales manager will assess your requirements and provide a confirmed final quotation 
            before any work begins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/quote')}
              className="btn-gold gap-2"
            >
              Get AI Estimate
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/260768671420?text=Hello, I need a professional quote for my cleaning requirements.', '_blank')}
              variant="outline"
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Request Quote on WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
