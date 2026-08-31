import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LocalInfoSection, { MAPS_URL } from '@/components/LocalInfoSection';
import { Button } from '@/components/ui/button';
import { Waves, Hammer, Droplets, Wrench, CheckCircle2, ArrowRight, Phone } from 'lucide-react';

import pool29 from '@/assets/pools/pool-29.jpg.asset.json';
import pool32 from '@/assets/pools/pool-32.jpg.asset.json';
import pool34 from '@/assets/pools/pool-34.jpg.asset.json';
import pool37 from '@/assets/pools/pool-37.jpg.asset.json';

const gallery = [
  { url: pool29.url, alt: 'Swimming pool excavation and concrete shell work on a WeWash site in Lusaka' },
  { url: pool32.url, alt: 'WeWash technicians tiling a new swimming pool in Lusaka' },
  { url: pool34.url, alt: 'Finished swimming pool with clear blue water built by WeWash in Lusaka' },
  { url: pool37.url, alt: 'Serviced backyard pool with balanced water in Lusaka' },
];

const offers = [
  {
    icon: Hammer,
    title: 'Pool construction',
    price: 'Custom quote',
    note: 'Site visit required',
    description:
      'Excavation, shell, plumbing, filtration, tiling and finishing. We quote after seeing the ground and agreeing the size and finish.',
    points: ['Design and setting out', 'Shell, plumbing and pump room', 'Tiling and coping', 'Handover with a care plan'],
  },
  {
    icon: Droplets,
    title: 'Pool cleaning & servicing',
    price: 'From K800',
    note: 'Per visit',
    description:
      'Brushing, vacuuming, skimming, basket and filter clean, plus chemical balancing so the water stays safe to swim in.',
    points: ['Full clean and vacuum', 'Filter and basket service', 'Chlorine and pH balancing', 'Water test report'],
  },
  {
    icon: Waves,
    title: 'Monthly maintenance',
    price: 'From K2,500',
    note: 'Per month',
    description:
      'A scheduled visit plan so you never have to think about the pool. Chemicals and routine checks included in the plan.',
    points: ['Weekly or fortnightly visits', 'Chemicals included', 'Pump and filter checks', 'Same team every visit'],
  },
  {
    icon: Wrench,
    title: 'Repairs',
    price: 'From K1,200',
    note: 'After assessment',
    description:
      'Leaks, cracked tiles, failing pumps, blocked lines and worn filters. We find the fault first, then quote the fix.',
    points: ['Leak detection', 'Pump and motor repair', 'Tile and grout repair', 'Pipework and filtration'],
  },
];

const Pools = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Helmet>
        <title>Swimming Pool Construction, Cleaning & Repairs in Lusaka | WeWash</title>
        <meta
          name="description"
          content="Swimming pool construction, servicing, cleaning and repairs in Lusaka. Pool cleaning from K800 per visit, maintenance from K2,500/month. Kabulonga office, open Mon–Sat."
        />
        <link rel="canonical" href="https://wewashglobal.com/pools" />
        <meta property="og:title" content="Swimming Pool Construction, Cleaning & Repairs in Lusaka | WeWash" />
        <meta
          property="og:description"
          content="We build, service, clean and repair swimming pools across Lusaka. Real projects, honest starting prices."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wewashglobal.com/pools" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wewashglobal.com/" },
            { "@type": "ListItem", "position": 2, "name": "Swimming Pool Services", "item": "https://wewashglobal.com/pools" }
          ]
        })}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Swimming pool construction, cleaning, servicing and repair',
            provider: {
              '@type': 'LocalBusiness',
              name: 'WeWash Zambia',
              telephone: '+260768671420',
              email: 'booking@wewashglobal.com',
              hasMap: MAPS_URL,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'D13 Antelope Close, Kabulonga',
                addressLocality: 'Lusaka',
                addressRegion: 'Lusaka Province',
                postalCode: '10101',
                addressCountry: 'ZM',
              },
              openingHours: ['Mo-Sa 07:00-19:00', 'Su 08:00-16:00'],
            },
            areaServed: { '@type': 'City', name: 'Lusaka' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'ZMW',
              price: '800',
              description: 'Pool cleaning and servicing, starting from K800 per visit',
            },
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-background via-card to-primary/10">
        <div className="container-wewash">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-gold mb-6 inline-block">Swimming Pools</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Pools built, serviced and
                <span className="text-primary"> kept swimmable</span>
              </h1>
              <p className="text-lg text-muted-foreground font-light mb-8 max-w-xl">
                We dig, build and tile new pools in Lusaka, and we look after pools that
                already exist — cleaning, chemicals, pumps and repairs. Every photo on this
                page is our own work.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate('/book-now')}>
                  Request a pool quote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      'https://wa.me/260768671420?text=Hello WeWash, I would like a quote for my swimming pool.',
                      '_blank',
                    )
                  }
                >
                  <Phone className="mr-2 h-4 w-4" /> WhatsApp us
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((img) => (
                <img
                  key={img.url}
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-40 md:h-48 object-cover rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quotes */}
      <section className="py-20">
        <div className="container-wewash">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What a pool job costs</h2>
          <p className="text-muted-foreground font-light mb-12 max-w-2xl">
            These are starting prices. The final figure comes after we see the pool — size,
            condition and distance from our Kabulonga office all change the number.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {offers.map((o) => (
              <article key={o.title} className="rounded-2xl border border-border p-8 bg-card">
                <o.icon className="h-8 w-8 text-primary mb-5" />
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <h3 className="text-xl font-semibold">{o.title}</h3>
                  <div className="text-right">
                    <p className="text-primary font-semibold">{o.price}</p>
                    <p className="text-xs text-muted-foreground">{o.note}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-light mb-5">{o.description}</p>
                <ul className="space-y-2 mb-6">
                  {o.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm font-light">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" onClick={() => navigate('/book-now')}>
                  Get a quote
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LocalInfoSection />
    </Layout>
  );
};

export default Pools;
