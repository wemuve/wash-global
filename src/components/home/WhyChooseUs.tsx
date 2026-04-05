import React from 'react';
import { Shield, Clock, Star, Users, Leaf, Award, HeartHandshake, Zap } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    { icon: Shield, title: 'Fully Insured', description: 'Comprehensive insurance coverage for your peace of mind.' },
    { icon: Users, title: 'Expert Team', description: 'Trained, background-checked professionals.' },
    { icon: Clock, title: 'Punctual', description: 'On-schedule arrivals and timely completion.' },
    { icon: Star, title: 'Quality Guaranteed', description: 'Not satisfied? We redo it — no extra cost.' },
    { icon: Leaf, title: 'Eco-Friendly', description: 'Environmentally safe products and practices.' },
    { icon: Award, title: 'Certified', description: 'Industry-certified international standards.' },
    { icon: HeartHandshake, title: '24/7 Support', description: 'Round-the-clock customer assistance.' },
    { icon: Zap, title: 'Fast Response', description: 'Quick quotes and rapid service deployment.' },
  ];

  return (
    <section className="py-24 md:py-32 bg-card/30">
      <div className="container-wewash">
        {/* Header */}
        <div className="max-w-xl mb-20">
          <p className="text-secondary text-xs uppercase tracking-[0.25em] font-medium mb-4">Why WeWash</p>
          <h2 className="text-foreground font-light">
            The WeWash <span className="font-bold">Difference</span>
          </h2>
        </div>

        {/* Features — 2-column clean list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group">
                <Icon className="h-5 w-5 text-secondary mb-4" />
                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom statement */}
        <div className="mt-20 pt-12 border-t border-border/30 max-w-2xl">
          <p className="text-xl text-foreground font-light leading-relaxed">
            Every quote is customised after a thorough assessment. 
            <span className="text-secondary font-medium"> That's the WeWash standard.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
