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
          <span className="badge-success mb-4">Why Choose WeWash</span>
          <h2 className="text-foreground mb-4">
            The WeWash Difference
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
                className="feature-card text-center group hover:bg-primary-muted"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                  <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
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

        {/* Trust Stats */}
        <div className="mt-20 bg-wewash-navy rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-wewash-gold mb-2">5+</div>
              <div className="text-white/70">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-wewash-gold mb-2">5,000+</div>
              <div className="text-white/70">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-wewash-gold mb-2">10,000+</div>
              <div className="text-white/70">Jobs Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-wewash-gold mb-2">4.9</div>
              <div className="text-white/70">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
