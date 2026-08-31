import React from 'react';
import { Shield, Clock, Users, Leaf, RefreshCw, Wallet } from 'lucide-react';

const WhyChooseUs = () => {
  const points = [
    {
      icon: Users,
      title: 'People we actually know',
      description: 'Every cleaner is vetted, trained by us and supervised on site. Nobody is sent to your home off the street.',
    },
    {
      icon: Clock,
      title: 'We arrive when we said',
      description: 'You get a time slot and a call if anything shifts. Waiting all morning is not part of the deal.',
    },
    {
      icon: RefreshCw,
      title: 'Not happy? We come back',
      description: 'Point out what was missed within 48 hours and we return and redo it. No argument, no extra charge.',
    },
    {
      icon: Wallet,
      title: 'Pay after the work',
      description: 'You settle once the job is done and you have looked around. No deposits for standard cleans.',
    },
    {
      icon: Shield,
      title: 'Insured and accountable',
      description: 'Our teams are covered, and there is a manager whose name and number you can call.',
    },
    {
      icon: Leaf,
      title: 'Products that are safe indoors',
      description: 'Proper commercial-grade chemicals, used correctly — safe around children, pets and finished surfaces.',
    },
  ];

  return (
    <section className="section-spacing bg-gradient-subtle">
      <div className="container-wewash">
        <div className="max-w-2xl mb-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-secondary mb-4">Why people stay with us</p>
          <h2 className="text-foreground mb-4">The boring things done right</h2>
          <p className="text-lg text-muted-foreground">
            Most clients come to us after being let down somewhere else. This is what we fix.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40 rounded-3xl overflow-hidden border border-border/40">
          {points.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="bg-card p-8 transition-colors hover:bg-muted/40">
                <Icon className="h-6 w-6 text-secondary mb-5" />
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
