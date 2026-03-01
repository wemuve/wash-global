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
  ArrowRight,
  AlertTriangle
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
      description: 'Professional residential cleaning managed by trained, supervised teams. From regular maintenance to deep cleaning and post-construction.',
      image: cleaningImage,
      features: [
        'General Cleaning – From K550 (1 Bed)',
        'Deep Cleaning – From K850 (1 Bed)',
        'Post-Construction – From K1,500 (1 Bed)',
        'Window Cleaning – From K35/window',
      ],
      pricing: 'Starting from K550 (1 Bedroom – Light Condition)',
    },
    {
      id: 'car-detailing',
      icon: Car,
      title: 'Mobile Car Detailing',
      description: 'Premium mobile car detailing delivered to your location by our professionally trained detailing team.',
      image: carDetailingImage,
      features: [
        'Interior Deep Clean – From K450 (Small Car)',
        'Full Detailing – From K650 (Small Car)',
        'SUV Full Detailing – From K850',
        'Seat Removal – From K150–K250',
      ],
      pricing: 'Starting from K450 (Small Car – Interior Only)',
    },
    {
      id: 'fumigation',
      icon: Bug,
      title: 'Fumigation & Pest Control',
      description: 'Structured pest control solutions with professional-grade chemicals and certified application methods.',
      image: fumigationImage,
      features: [
        'Residential Fumigation – From K400',
        'Commercial Fumigation – From K800',
        'Termite Treatment – From K1,200',
        'Preventive Treatments Available',
      ],
      pricing: 'Starting from K400 (Residential)',
    },
    {
      id: 'facility-management',
      icon: Building2,
      title: 'Facility Management',
      description: 'Comprehensive, managed property operations for commercial and institutional clients with quality control systems.',
      image: facilityImage,
      features: [
        'Building Maintenance',
        'Grounds Keeping',
        'Security Coordination',
        'Vendor Management',
      ],
      pricing: 'Custom quotes – Professional assessment required',
    },
    {
      id: 'office-cleaning',
      icon: Briefcase,
      title: 'Office & Commercial Cleaning',
      description: 'Reliable, structured cleaning operations for workplaces with supervised teams and quality audits.',
      image: maintenanceImage,
      features: [
        'Daily Cleaning – From K200/day',
        'Weekly Cleaning – From K800/week',
        'Monthly Contract – From K2,800/month',
        'Sanitisation Services',
      ],
      pricing: 'Starting from K200/day',
    },
    {
      id: 'trained-maids',
      icon: Users,
      title: 'Trained Maids & Housekeepers',
      description: 'Vetted, professionally trained domestic staff managed through our structured placement and supervision system.',
      image: maidsImage,
      features: [
        'Background Checked & Verified',
        'Professionally Trained',
        'Daily – From K150/day',
        'Live-in – From K2,500/month',
      ],
      pricing: 'Starting from K150/day',
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Our Services | WeWash Global – Premium Cleaning & Facility Management</title>
        <meta name="description" content="Professional cleaning, car detailing, fumigation, and facility management services in Zambia. All prices are starting estimates – final quote after assessment." />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-card to-primary/10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container-wewash relative">
          <div className="max-w-3xl">
            <span className="badge-gold mb-6">Our Services</span>
            <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Premium Property
              <span className="text-primary"> Services</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Professionally managed, structured operations backed by our Danish parent company WeMuve. 
              All prices are <span className="text-secondary font-bold">starting estimates</span> — 
              final quotes confirmed after professional assessment.
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
                        loading="lazy"
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
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-lg font-semibold text-primary">
                          {service.pricing}
                        </span>
                        <Button 
                          onClick={() => navigate('/quote')}
                          className="btn-gold gap-2"
                        >
                          Get Your Estimate
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        * Starting estimate only. Final price confirmed after assessment of condition, transport, labour & materials.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Global Disclaimer */}
          <div className="mt-16 max-w-3xl mx-auto p-5 rounded-xl bg-secondary/10 ring-1 ring-secondary/20">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground mb-1">
                  Starting From (Estimate Only – Final Quote After Confirmation)
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This is an automated estimate based on provided details. Final pricing is confirmed after 
                  workload assessment, transport calculation, labor requirement, and cleaning intensity review 
                  by our sales manager.
                </p>
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
            Every project is unique. Let our team assess your requirements and provide a confirmed final quotation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/quote')}
              className="btn-gold gap-2"
            >
              AI Price Estimator
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
