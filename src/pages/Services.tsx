import React from 'react';
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
      {/* Hero */}
      <section className="relative bg-wewash-navy py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-wewash-navy via-wewash-navy to-primary/20" />
        <div className="container-wewash relative">
          <div className="max-w-3xl">
            <span className="badge-gold mb-6">Our Services</span>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Comprehensive Property
              <span className="text-wewash-gold"> Services</span>
            </h1>
            <p className="text-xl text-white/80">
              From home cleaning to facility management, we offer a full range of 
              professional services for residential, commercial, and institutional clients.
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
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
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
                    
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-primary">
                        {service.pricing}
                      </span>
                      <Button 
                        onClick={() => navigate('/book')}
                        className="btn-primary gap-2"
                      >
                        Book Now
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-primary">
        <div className="container-wewash text-center">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
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
