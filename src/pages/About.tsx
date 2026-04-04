import React from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Globe, 
  Users, 
  Target, 
  Heart, 
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for perfection in every service we deliver, ensuring our clients receive nothing but the best.',
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Honesty and transparency are at the core of everything we do. Trust is earned through consistent action.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in empowering local communities by creating employment and training opportunities.',
    },
    {
      icon: Globe,
      title: 'Innovation',
      description: 'Embracing technology and new methods to deliver faster, better, and more efficient services.',
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>About WeWash Global | Our Story & Mission | Cleaning Services Zambia</title>
        <meta name="description" content="Learn about WeWash Global. We provide premium cleaning and property services across Zambia with the highest standards of excellence." />
        <link rel="canonical" href="https://wewash.co.zm/about" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-wewash-navy py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-wewash-navy via-wewash-navy to-primary/20" />
        <div className="container-wewash relative">
          <div className="max-w-3xl">
            <span className="badge-gold mb-6">About WeWash</span>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transforming Spaces,
              <span className="text-wewash-gold"> Building Trust</span>
            </h1>
            <p className="text-xl text-white/80">
              WeWash Global is redefining cleaning and property services in Zambia 
              with professionalism, reliability, and a commitment to excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-spacing">
        <div className="container-wewash">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-primary mb-4">Our Story</span>
              <h2 className="text-foreground mb-6">
                Born in Zambia, Backed by Global Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  WeWash Global started with a simple mission: to provide world-class cleaning 
                  and property services that people can truly rely on. Founded in Lusaka, Zambia, 
                  we've built our reputation on consistent quality, trained professionals, and 
                  genuine customer care.
                </p>
                <p>
                  <strong className="text-foreground">WeWash operates with world-class standards</strong>, 
                  leveraging international best practices in operational excellence, training methodologies, 
                  and technology that we bring directly to the Zambian market.
                </p>
                <p>
                  Today, we serve homes, businesses, and institutions across Zambia, combining 
                  international best practices with deep local understanding. Every member of 
                  our team is carefully selected, thoroughly trained, and committed to the 
                  WeWash standard of excellence.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-wewash-gold/10 rounded-3xl p-8">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-background rounded-2xl p-6 text-center shadow-card">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">Lusaka, Zambia</h3>
                    <p className="text-sm text-muted-foreground">Operations Headquarters</p>
                  </div>
                  <div className="bg-background rounded-2xl p-6 text-center shadow-card border-2 border-wewash-gold/30">
                    <Building2 className="h-8 w-8 text-wewash-gold mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">WeMuve - Denmark</h3>
                    <p className="text-sm text-muted-foreground">Parent Company</p>
                    <p className="text-xs text-muted-foreground mt-1">International Standards & Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing bg-muted/30">
        <div className="container-wewash">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-success mb-4">Our Values</span>
            <h2 className="text-foreground mb-4">What Drives Us</h2>
            <p className="text-lg text-muted-foreground">
              Our core values guide every decision we make and every service we deliver.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="feature-card text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-spacing">
        <div className="container-wewash">
          <div className="bg-wewash-navy rounded-3xl p-8 md:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-white/80 text-lg mb-6">
                  To deliver exceptional cleaning and property management services that exceed 
                  expectations, create local employment, and set new standards for the industry 
                  in Africa.
                </p>
                <ul className="space-y-3">
                  {[
                    'Professional service delivery',
                    'Community empowerment through jobs',
                    'Environmental responsibility',
                    'Continuous innovation',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/90">
                      <CheckCircle2 className="h-5 w-5 text-wewash-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
                <p className="text-white/80 text-lg mb-6">
                  To become Africa's most trusted cleaning and facility management brand, 
                  recognized for quality, reliability, and positive community impact.
                </p>
                <Button 
                  onClick={() => navigate('/book')}
                  className="btn-gold gap-2"
                >
                  Book a Service
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
