import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { 
  Home, 
  Car, 
  Bug, 
  Building2, 
  Briefcase, 
  Users,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import cleaningImage from '@/assets/cleaning-services.jpg';
import carDetailingImage from '@/assets/mobile-car-detailing.jpg';
import fumigationImage from '@/assets/fumigation-services.jpg';
import facilityImage from '@/assets/facility-management.jpg';
import maintenanceImage from '@/assets/home-maintenance.jpg';
import maidsImage from '@/assets/trained-maids.jpg';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'home-cleaning',
      icon: Home,
      title: 'Home Cleaning',
      description: 'Professional residential cleaning services tailored to your needs. From regular maintenance to deep cleaning.',
      image: cleaningImage,
      features: [
        'Standard & Deep Cleaning',
        'Move In/Out Cleaning',
        'Post-Construction Cleaning',
        'Window & Carpet Cleaning',
      ],
      pricing: 'Starting from ZMW 350',
    },
    {
      id: 'car-detailing',
      icon: Car,
      title: 'Mobile Car Detailing',
      description: 'We come to you! Professional car wash and detailing services at your location.',
      image: carDetailingImage,
      features: [
        'Exterior Wash & Polish',
        'Interior Deep Clean',
        'Engine Bay Cleaning',
        'Ceramic Coating',
      ],
      pricing: 'Starting from ZMW 150',
    },
    {
      id: 'fumigation',
      icon: Bug,
      title: 'Fumigation & Pest Control',
      description: 'Eliminate pests and protect your property with our comprehensive pest control solutions.',
      image: fumigationImage,
      features: [
        'Insect Control',
        'Rodent Elimination',
        'Termite Treatment',
        'Preventive Treatments',
      ],
      pricing: 'Starting from ZMW 400',
    },
    {
      id: 'facility-management',
      icon: Building2,
      title: 'Facility Management',
      description: 'Complete property management solutions for commercial and institutional clients.',
      image: facilityImage,
      features: [
        'Building Maintenance',
        'Grounds Keeping',
        'Security Coordination',
        'Vendor Management',
      ],
      pricing: 'Custom quotes',
    },
    {
      id: 'office-cleaning',
      icon: Briefcase,
      title: 'Office & Commercial Cleaning',
      description: 'Keep your workplace spotless and professional with our commercial cleaning services.',
      image: maintenanceImage,
      features: [
        'Daily/Weekly Cleaning',
        'Sanitization Services',
        'Floor Care',
        'Waste Management',
      ],
      pricing: 'Starting from ZMW 200/day',
    },
    {
      id: 'trained-maids',
      icon: Users,
      title: 'Trained Maids & Housekeepers',
      description: 'Vetted, trained, and reliable domestic staff for your home or business.',
      image: maidsImage,
      features: [
        'Background Checked',
        'Professionally Trained',
        'Daily or Live-in Options',
        'Replacement Guarantee',
      ],
      pricing: 'Starting from ZMW 150/day',
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Our Services | WeWash Global - Professional Cleaning & Facility Management</title>
        <meta name="description" content="Explore WeWash Global's comprehensive services: home cleaning, mobile car detailing, fumigation, facility management, and trained housekeepers in Zambia." />
        <meta name="keywords" content="cleaning services Zambia, car detailing Lusaka, fumigation services, facility management, trained maids, housekeepers" />
        <link rel="canonical" href="https://wewashglobal.com/services" />
        <meta property="og:title" content="Professional Cleaning Services | WeWash Global" />
        <meta property="og:description" content="From home cleaning to facility management - comprehensive property services in Zambia." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-card to-primary/10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container-wewash relative">
          <div className="max-w-3xl">
            <span className="badge-gold mb-6">Our Services</span>
            <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Comprehensive Property
              <span className="text-primary"> Services</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Bespoke solutions for residential, commercial, and institutional clients. 
              All prices are <span className="text-primary font-semibold">starting estimates</span> — 
              your exact quote is provided after a professional assessment of your specific requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-spacing">
        <div className="container-wewash">
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isReversed = index % 2 === 1;
              
              return (
                <div 
                  key={service.id}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className={isReversed ? 'lg:order-2' : ''}>
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] ring-1 ring-primary/20">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                          <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={isReversed ? 'lg:order-1' : ''}>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-foreground">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-primary">
                          {service.pricing}
                        </span>
                        <Button 
                          onClick={() => navigate('/quote')}
                          className="btn-gold gap-2"
                        >
                          Get Exact Quote
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        * Final price based on site assessment — size, condition, location & materials
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-gradient-to-br from-primary/20 via-card to-background">
        <div className="container-wewash text-center">
          <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            We offer tailored packages for businesses and institutions. 
            Contact us for a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/contact')}
              className="btn-gold gap-2"
            >
              Get Custom Quote
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/260768671420', '_blank')}
              className="btn-whatsapp gap-2"
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;