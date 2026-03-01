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
  AlertTriangle,
} from 'lucide-react';

import diverseHomeCleaningImage from '@/assets/diverse-home-cleaning.jpg';
import diverseCarDetailingImage from '@/assets/diverse-car-detailing.jpg';
import diversePestControlImage from '@/assets/diverse-pest-control.jpg';
import diverseFacilityImage from '@/assets/diverse-facility-management.jpg';
import diverseOfficeImage from '@/assets/diverse-office-cleaning.jpg';
import diverseMaidImage from '@/assets/diverse-professional-maid.jpg';

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: SprayCan,
      title: 'Home Cleaning',
      description: 'Professionally managed cleaning for homes of all sizes – general, deep, and post-construction.',
      image: diverseHomeCleaningImage,
      price: 'From K550',
      priceNote: '1 Bed – Light Condition',
      features: ['General Cleaning', 'Deep Cleaning', 'Post-Construction'],
    },
    {
      icon: Car,
      title: 'Mobile Car Detailing',
      description: 'Premium car detailing delivered to your location by trained professionals.',
      image: diverseCarDetailingImage,
      price: 'From K450',
      priceNote: 'Small Car – Interior',
      features: ['Interior Deep Clean', 'Full Detailing', 'Seat Removal'],
    },
    {
      icon: Bug,
      title: 'Fumigation Services',
      description: 'Structured pest control with professional-grade chemicals and certified methods.',
      image: diversePestControlImage,
      price: 'From K400',
      priceNote: 'Residential',
      features: ['Pest Control', 'Termite Treatment', 'Preventive Care'],
    },
    {
      icon: Building2,
      title: 'Facility Management',
      description: 'Comprehensive managed property operations for commercial and institutional clients.',
      image: diverseFacilityImage,
      price: 'From K2,500',
      priceNote: 'Monthly Contract',
      features: ['Building Maintenance', 'Grounds Care', 'Staff Management'],
    },
    {
      icon: Briefcase,
      title: 'Office Cleaning',
      description: 'Reliable, structured cleaning with supervised teams and quality control.',
      image: diverseOfficeImage,
      price: 'From K200',
      priceNote: 'Per Day',
      features: ['Daily Cleaning', 'Window Cleaning', 'Sanitisation'],
    },
    {
      icon: UserCheck,
      title: 'Trained Maids',
      description: 'Vetted, professionally trained domestic staff with ongoing supervision.',
      image: diverseMaidImage,
      price: 'From K150',
      priceNote: 'Per Day',
      features: ['Background Checked', 'Fully Trained', 'Ongoing Support'],
    },
  ];

  const openWhatsApp = (service: string) => {
    window.open(`https://wa.me/260768671420?text=Hello, I would like a professional quote for ${service} services.`, '_blank');
  };

  return (
    <section className="section-spacing bg-gradient-subtle" id="services">
      <div className="container-wewash">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-primary mb-4">Our Services</span>
          <h2 className="text-foreground mb-4">
            Premium Property Care Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            Professionally managed, quality-controlled services delivered by trained teams. 
            All prices are <span className="text-secondary font-semibold">starting estimates</span>.
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
                    <div className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                      <span>{service.price}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-1">{service.title}</h3>
                    <p className="text-white/60 text-xs">{service.priceNote}</p>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature, i) => (
                      <span 
                        key={i} 
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground italic mb-4">
                    * Starting estimate – final price after assessment
                  </p>

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
                      onClick={() => navigate('/quote')}
                    >
                      Get Estimate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pricing Disclaimer */}
        <div className="mt-12 max-w-2xl mx-auto p-5 rounded-2xl bg-secondary/5 ring-1 ring-secondary/20">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-foreground mb-1">
                Starting From (Estimate Only – Final Quote After Confirmation)
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All prices are starting estimates. Final pricing confirmed after professional assessment of 
                condition, transport, labour, and materials by our sales manager.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Button 
            onClick={() => navigate('/quote')}
            className="btn-premium gap-2"
          >
            Get Your Professional Estimate
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
