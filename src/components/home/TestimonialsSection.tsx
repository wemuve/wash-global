import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Grace Mwanza',
      role: 'Homeowner, Lusaka',
      text: "WeWash has transformed how I manage my home. Their team is professional, punctual, and the quality is exceptional.",
      initials: 'GM',
    },
    {
      name: 'David Chishimba',
      role: 'Property Manager, Kitwe',
      text: "Managing multiple properties became so much easier. Their facility management service is top-notch.",
      initials: 'DC',
    },
    {
      name: 'Thandiwe Phiri',
      role: 'Business Owner, Ndola',
      text: "Finding a reliable cleaning service was challenging until we found WeWash. They always deliver excellence.",
      initials: 'TP',
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container-wewash">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-secondary text-xs uppercase tracking-[0.25em] font-medium mb-4">Testimonials</p>
          <h2 className="text-foreground font-light">
            What Our Clients <span className="font-bold">Say</span>
          </h2>
        </div>

        {/* Testimonials — asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/30">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-background p-8 md:p-10">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-secondary fill-secondary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground font-light leading-relaxed mb-8">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-xs font-medium text-foreground/60 border border-border/30">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Locations */}
        <div className="mt-16 flex flex-wrap gap-8 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          <span>Trusted across</span>
          <span className="text-foreground">Lusaka</span>
          <span className="text-foreground">Copperbelt</span>
          <span className="text-foreground">Livingstone</span>
          <span className="text-muted-foreground/50">& expanding nationally</span>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
