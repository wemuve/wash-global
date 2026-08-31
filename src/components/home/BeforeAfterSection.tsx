import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import bedroomBefore from '@/assets/work/bedroom-before.jpg';
import bedroomAfter from '@/assets/work/bedroom-after.jpg';
import bathroomBefore from '@/assets/work/bathroom-before.jpg';
import bathroomAfter from '@/assets/work/bathroom-after.jpg';

const jobs = [
  {
    title: 'Bedroom deep clean',
    place: 'Kabulonga, 2 bedrooms',
    note: 'Bedding stripped, floors scrubbed, everything put back the way it should be.',
    before: bedroomBefore,
    after: bedroomAfter,
  },
  {
    title: 'Bathroom restoration',
    place: 'Woodlands, tenancy hand-over',
    note: 'Stained tiles and grout brought back before the landlord walked through.',
    before: bathroomBefore,
    after: bathroomAfter,
  },
];

const BeforeAfterSection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-spacing bg-gradient-subtle">
      <div className="container-wewash">
        <div className="max-w-2xl mb-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-secondary mb-4">Real jobs</p>
          <h2 className="text-foreground mb-4">Our own photos. No stock images.</h2>
          <p className="text-lg text-muted-foreground">
            These are rooms our team worked on in Lusaka — shot before we started and again when
            we packed up.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <article
              key={job.title}
              className="rounded-3xl overflow-hidden bg-card border border-border/40"
            >
              <div className="grid grid-cols-2">
                <figure className="relative">
                  <img src={job.before} alt={`${job.title} before`} className="w-full h-56 md:h-72 object-cover" loading="lazy" />
                  <figcaption className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/85 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Before
                  </figcaption>
                </figure>
                <figure className="relative border-l border-border/40">
                  <img src={job.after} alt={`${job.title} after`} className="w-full h-56 md:h-72 object-cover" loading="lazy" />
                  <figcaption className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-secondary text-xs uppercase tracking-[0.18em] text-secondary-foreground">
                    After
                  </figcaption>
                </figure>
              </div>
              <div className="p-6">
                <h3 className="text-foreground mb-1">{job.title}</h3>
                <p className="text-sm text-secondary mb-3">{job.place}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{job.note}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Button onClick={() => navigate('/quote')} variant="outline" className="gap-2">
            Get a price for your place
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
