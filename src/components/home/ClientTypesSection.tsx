import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Building2, Landmark, ArrowRight, CheckCircle2 } from 'lucide-react';

const ClientTypesSection = () => {
  const navigate = useNavigate();

  const clientTypes = [
    {
      icon: Home,
      title: 'Home Clients',
      subtitle: 'B2C Solutions',
      description: 'Premium cleaning and maintenance services for homeowners and tenants.',
      features: [
        'Flexible scheduling',
        'Pay per service',
        'Loyalty rewards',
        'Family-safe products',
      ],
      cta: 'Book for Home',
      color: 'primary',
    },
    {
      icon: Building2,
      title: 'Businesses',
      subtitle: 'B2B Solutions',
      description: 'Scalable facility management for offices, hotels, and commercial properties.',
      features: [
        'Contract pricing',
        'Dedicated account manager',
        'SLA guarantees',
        'Monthly invoicing',
      ],
      cta: 'Business Inquiry',
      color: 'secondary',
      popular: true,
    },
    {
      icon: Landmark,
      title: 'Government',
      subtitle: 'B2G Solutions',
      description: 'Compliant solutions for schools, hospitals, and public institutions.',
      features: [
        'Tender-ready proposals',
        'Compliance certified',
        'Bulk pricing',
        'Audit reports',
      ],
      cta: 'Request Proposal',
      color: 'success',
    },
  ];

  return (
    <section className="section-spacing">
      <div className="container-wewash">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-primary mb-4">Solutions For Everyone</span>
          <h2 className="text-foreground mb-4">
            Tailored Services for Every Client
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're a homeowner, business manager, or government official, 
            we have the right solution for your needs.
          </p>
        </div>

        {/* Client Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {clientTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <Card 
                key={index} 
                className={`pricing-card relative ${type.popular ? 'popular' : ''}`}
              >
                {type.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="badge-gold px-4 py-1.5">Most Popular</span>
                  </div>
                )}
                
                <CardContent className="p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    type.popular ? 'bg-primary' : 'bg-primary-muted'
                  }`}>
                    <Icon className={`h-8 w-8 ${type.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-foreground">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">{type.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6">{type.description}</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button 
                    onClick={() => navigate('/book')}
                    className={`w-full gap-2 ${type.popular ? 'btn-premium' : ''}`}
                    variant={type.popular ? 'default' : 'outline'}
                  >
                    {type.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClientTypesSection;
