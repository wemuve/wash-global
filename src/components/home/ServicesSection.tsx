import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  SprayCan, 
  Car, 
  Bug, 
  Building2, 
  Briefcase, 
  UserCheck,
  Sparkles,
  Leaf
} from 'lucide-react';

import cleaningServicesImage from '@/assets/cleaning-services.jpg';
import mobileCarDetailingImage from '@/assets/mobile-car-detailing.jpg';
import fumigationServicesImage from '@/assets/fumigation-services.jpg';
import facilityManagementImage from '@/assets/facility-management.jpg';
import trainedMaidsImage from '@/assets/trained-maids.jpg';
import homeMaintenanceImage from '@/assets/home-maintenance.jpg';

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: SprayCan,
      title: 'Home Cleaning',
      description: 'Deep cleaning, regular maintenance, and post-construction cleaning for homes of all sizes.',
      image: cleaningServicesImage,
      price: 'From K650',
      features: ['General Cleaning', 'Deep Cleaning', 'Post-Construction'],
    },
    {
      icon: Car,
      title: 'Mobile Car Detailing',
      description: 'Professional car wash and detailing services delivered to your doorstep.',
      image: mobileCarDetailingImage,
      price: 'From K450',
      features: ['Exterior Wash', 'Interior Detailing', 'Full Detail Package'],
    },
    {
      icon: Bug,
      title: 'Fumigation Services',
      description: 'Complete pest control solutions for residential and commercial properties.',
      image: fumigationServicesImage,
      price: 'From K250',
      features: ['Pest Control', 'Termite Treatment', 'Preventive Care'],
    },
    {
      icon: Building2,
      title: 'Facility Management',
      description: 'Comprehensive property management for commercial and institutional clients.',
      image: facilityManagementImage,
      price: 'From K1,500',
      features: ['Building Maintenance', 'Grounds Care', 'Staff Management'],
    },
    {
      icon: Briefcase,
      title: 'Office Cleaning',
      description: 'Keep your workplace pristine with our professional office cleaning services.',
      image: cleaningServicesImage,
      price: 'From K1,200',
      features: ['Daily Cleaning', 'Window Cleaning', 'Carpet Care'],
    },
    {
      icon: UserCheck,
      title: 'Trained Maids',
      description: 'Professionally trained domestic workers for your home or business.',
      image: trainedMaidsImage,
      price: 'From K650',
      features: ['Background Checked', 'Fully Trained', 'Ongoing Support'],
    },
  ];

  const openWhatsApp = (service: string) => {
    window.open(`https://wa.me/260768671420?text=Hello, I would like to inquire about ${service} services.`, '_blank');
  };

  return (
    <section className="section-spacing bg-gradient-subtle" id="services">
      <div className="container-wewash">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-primary mb-4">Our Services</span>
          <h2 className="text-foreground mb-4">
            Complete Property Care Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            From residential cleaning to commercial facility management, we provide 
            comprehensive services tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="service-card group overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 rounded-full bg-wewash-gold text-wewash-navy text-sm font-semibold">
                      {service.price}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-1">{service.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature, i) => (
                      <span 
                        key={i} 
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openWhatsApp(service.title)}
                    >
                      Inquire
                    </Button>
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary-hover"
                      onClick={() => navigate('/book')}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Need a custom solution? We tailor our services to your specific requirements.
          </p>
          <Button 
            onClick={() => navigate('/contact')}
            className="btn-premium gap-2"
          >
            Get Custom Quote
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
