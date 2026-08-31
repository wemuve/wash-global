import React from 'react';
import roomPrep from '@/assets/work/room-prep.jpg';

const steps = [
  {
    n: '01',
    title: 'Tell us what you need',
    body: 'A message on WhatsApp or the quote form is enough. Rooms, size, condition — that is all we need to start.',
  },
  {
    n: '02',
    title: 'We look before we price',
    body: 'For anything bigger than a standard clean, our manager checks the space or asks for photos. Transport, hours, chemicals and labour all go into the number.',
  },
  {
    n: '03',
    title: 'You get one clear price',
    body: 'One figure, written down, agreed before anyone starts. No add-ons at the door.',
  },
  {
    n: '04',
    title: 'We clean, then you pay',
    body: 'A supervised team does the work and walks you through it. If something is not right, we come back.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="section-spacing">
      <div className="container-wewash">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-[11px] uppercase tracking-[0.28em] text-secondary mb-4">How it works</p>
            <h2 className="text-foreground mb-5">Why our price is never a guess</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              A one-bedroom flat that needs a tidy and a four-bedroom house after builders left are
              not the same job. So we don&apos;t charge them the same. The prices you see are where
              a job starts — the final one comes after we&apos;ve seen it.
            </p>
            <img
              src={roomPrep}
              alt="WeWash team preparing a room for deep cleaning in Lusaka"
              className="rounded-3xl w-full h-64 object-cover border border-border/40"
              loading="lazy"
            />
          </div>

          <ol className="space-y-2">
            {steps.map((s) => (
              <li key={s.n} className="grid grid-cols-[auto_1fr] gap-6 py-7 border-b border-border/40">
                <span className="font-display text-sm text-secondary pt-1">{s.n}</span>
                <div>
                  <h3 className="text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
