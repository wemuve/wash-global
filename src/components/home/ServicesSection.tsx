import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
      title: 'Home Cleaning',
      description: 'General, deep, and post-construction cleaning for homes of all sizes.',
      image: diverseHomeCleaningImage,
      price: 'From K550',
      note: '1 Bed – Light Condition',
    },
    {
      title: 'Mobile Car Detailing',
      description: 'Premium detailing delivered to your location by trained professionals.',
      image: diverseCarDetailingImage,
      price: 'From K450',
      note: 'Small Car – Interior',
    },
    {
      title: 'Fumigation',
      description: 'Professional-grade pest control with certified methods.',
      image: diversePestControlImage,
      price: 'From K400',
      note: 'Residential',
    },
    {
      title: 'Facility Management',
      description: 'Comprehensive managed property operations for commercial clients.',
      image: diverseFacilityImage,
      price: 'From K2,500',
      note: 'Monthly Contract',
    },
    {
      title: 'Office Cleaning',
      description: 'Reliable, structured cleaning with supervised teams.',
      image: diverseOfficeImage,
      price: 'From K200',
      note: 'Per Day',
    },
    {
      title: 'Trained Maids',
      description: 'Vetted, professionally trained domestic staff with ongoing supervision.',
      image: diverseMaidImage,
      price: 'From K150',
      note: 'Per Day',
    },
  ];

  return (
    <section className="py-24 md:py-32" id="services">
      <div className="container-wewash">
        {/* Section Header */}
        <div className="max-w-xl mb-16">
          <p className="text-secondary text-xs uppercase tracking-[0.25em] font-medium mb-4">Our Services</p>
          <h2 className="text-foreground font-light mb-4">
            Premium Property <span className="font-bold">Care Solutions</span>
          </h2>
          <p className="text-muted-foreground font-light">
            All prices are starting estimates. Final pricing confirmed after professional assessment.
          </p>
        </div>

        {/* Services Grid — clean cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group bg-background p-1"
            >
              <div className="overflow-hidden">
                {/* Image */}
                <div className="aspect-[3/2] relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  
                  {/* Price overlay */}
                  <div className="absolute bottom-4 left-4">
                    <span className="text-secondary text-sm font-semibold">{service.price}</span>
                    <span className="text-foreground/40 text-xs ml-2">{service.note}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="py-6 px-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4">{service.description}</p>
                  <button 
                    onClick={() => navigate('/quote')}
                    className="text-xs uppercase tracking-[0.15em] text-secondary hover:text-secondary-hover transition-colors inline-flex items-center gap-2"
                  >
                    Get Estimate
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground font-light text-center max-w-xl mx-auto">
            Starting estimates only — final quote confirmed after assessment of condition, transport, labour, and materials.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
