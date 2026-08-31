import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, SprayCan, Car, Bug, Building2, Briefcase, UserCheck } from 'lucide-react';

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
      title: 'Home cleaning',
      description: 'Regular cleans, deep cleans, and the heavy work after builders leave.',
      image: diverseHomeCleaningImage,
      price: 'From K550',
      priceNote: '1 bedroom, light condition',
    },
    {
      icon: Car,
      title: 'Mobile car detailing',
      description: 'We come to your house or office and do the car properly, inside and out.',
      image: diverseCarDetailingImage,
      price: 'From K450',
      priceNote: 'Small car, interior',
    },
    {
      icon: Bug,
      title: 'Fumigation',
      description: 'Roaches, termites, rodents — treated with licensed chemicals and a follow-up.',
      image: diversePestControlImage,
      price: 'From K400',
      priceNote: 'Residential',
    },
    {
      icon: Building2,
      title: 'Facility management',
      description: 'We run the day-to-day upkeep of buildings, grounds and site staff.',
      image: diverseFacilityImage,
      price: 'From K2,500',
      priceNote: 'Monthly contract',
    },
    {
      icon: Briefcase,
      title: 'Office cleaning',
      description: 'Daily or weekly teams with a supervisor and a checklist you can see.',
      image: diverseOfficeImage,
      price: 'From K200',
      priceNote: 'Per day',
    },
    {
      icon: UserCheck,
      title: 'Trained maids',
      description: 'Vetted domestic staff, trained by us and still checked on after placement.',
      image: diverseMaidImage,
      price: 'From K150',
      priceNote: 'Per day',
    },
  ];

  return (
    <section className="section-spacing" id="services">
      <div className="container-wewash">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-secondary mb-4">What we do</p>
            <h2 className="text-foreground mb-4">Six services, one team you can call</h2>
            <p className="text-lg text-muted-foreground">
              Prices below are starting points for a light job. Yours may be more or less — we
              confirm it after we&apos;ve looked.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/services')} className="gap-2 shrink-0">
            See all services
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group rounded-3xl overflow-hidden bg-card border border-border/40 transition-all duration-300 hover:border-secondary/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={`${service.title} in Lusaka by WeWash`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220_35%_8%)] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-background/70 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="h-5 w-5 text-secondary" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="flex items-end justify-between pt-5 border-t border-border/40">
                    <div>
                      <p className="font-display text-lg text-secondary">{service.price}</p>
                      <p className="text-xs text-muted-foreground">{service.priceNote}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="gap-1 text-foreground" onClick={() => navigate('/quote')}>
                      Get price
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-sm text-muted-foreground max-w-2xl">
          Starting prices assume a light-condition job. Transport, hours on site, materials and how
          dirty the space actually is all change the final figure — which we agree with you before
          we start.
        </p>
      </div>
    </section>
  );
};

export default ServicesSection;
