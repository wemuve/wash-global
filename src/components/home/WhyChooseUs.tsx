import React from 'react';
import { 
  Shield, 
  Clock, 
  Star, 
  Users, 
  Leaf, 
  Award,
  HeartHandshake,
  Zap
} from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'All our services are backed by comprehensive insurance for your peace of mind.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our professionals are thoroughly trained and background-checked.',
    },
    {
      icon: Clock,
      title: 'Punctual Service',
      description: 'We respect your time with on-schedule arrivals and timely completion.',
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: "Not satisfied? We'll redo the service at no extra cost.",
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'We use environmentally safe products and sustainable practices.',
    },
    {
      icon: Award,
      title: 'Certified Excellence',
      description: 'Industry-certified processes meeting international standards.',
    },
    {
      icon: HeartHandshake,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs.',
    },
    {
      icon: Zap,
      title: 'Fast Response',
      description: 'Quick quotes and rapid service deployment when you need it.',
    },
  ];

  return (
    <section className="section-spacing">
      <div className="container-wewash">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary mb-4">Why Choose WeWash</span>
          <h2 className="text-foreground mb-4">
            The WeWash <span className="text-secondary">Difference</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We combine expertise, reliability, and exceptional customer service 
            to deliver outstanding results every time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="feature-card text-center group hover:border-secondary/30"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary transition-colors">
                  <Icon className="h-7 w-7 text-secondary group-hover:text-secondary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Banner */}
        <div className="mt-20 rounded-3xl p-8 md:p-12 text-center border border-secondary/20 bg-gradient-to-br from-[hsl(220_30%_10%)] to-[hsl(220_35%_8%)]">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            A Premium Service, <span className="text-secondary">Tailored to You</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            We don't believe in one-size-fits-all. Every quote is customised after a thorough 
            assessment of your property, requirements, and expectations. That's the WeWash difference.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5 text-secondary" />
              <span>Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-5 w-5 text-secondary" />
              <span>Certified Professionals</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Leaf className="h-5 w-5 text-secondary" />
              <span>Eco-Friendly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
