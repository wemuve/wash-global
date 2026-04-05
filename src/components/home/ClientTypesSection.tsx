import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const ClientTypesSection = () => {
  const navigate = useNavigate();

  const clientTypes = [
    {
      label: 'B2C',
      title: 'Home Clients',
      description: 'Premium cleaning and maintenance for homeowners and tenants.',
      features: ['Flexible scheduling', 'Pay per service', 'Loyalty rewards', 'Family-safe products'],
      cta: 'Book for Home',
    },
    {
      label: 'B2B',
      title: 'Businesses',
      description: 'Scalable facility management for offices, hotels, and commercial properties.',
      features: ['Contract pricing', 'Dedicated account manager', 'SLA guarantees', 'Monthly invoicing'],
      cta: 'Business Inquiry',
      featured: true,
    },
    {
      label: 'B2G',
      title: 'Government',
      description: 'Compliant solutions for schools, hospitals, and public institutions.',
      features: ['Tender-ready proposals', 'Compliance certified', 'Bulk pricing', 'Audit reports'],
      cta: 'Request Proposal',
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-card/30">
      <div className="container-wewash">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-secondary text-xs uppercase tracking-[0.25em] font-medium mb-4">Solutions</p>
          <h2 className="text-foreground font-light">
            Tailored for <span className="font-bold">Every Client</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/30">
          {clientTypes.map((type, index) => (
            <div 
              key={index} 
              className={`bg-background p-8 md:p-10 flex flex-col ${type.featured ? 'ring-1 ring-secondary/20' : ''}`}
            >
              {/* Label */}
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">{type.label}</span>

              <h3 className="text-2xl font-semibold text-foreground mb-3">{type.title}</h3>
              <p className="text-sm text-muted-foreground font-light mb-8">{type.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {type.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                    <span className="text-foreground/80 font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => navigate('/quote')}
                variant={type.featured ? 'default' : 'outline'}
                className={`w-full gap-2 ${type.featured ? 'btn-gold' : 'border-border/40 text-foreground/70'}`}
              >
                {type.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientTypesSection;
