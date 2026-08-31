import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LocalInfoSection, { MAPS_URL } from '@/components/LocalInfoSection';
import { Button } from '@/components/ui/button';
import { Car, Sparkles, Armchair, ShieldCheck, CheckCircle2, ArrowRight, Phone } from 'lucide-react';

import carTeam from '@/assets/car-detailing-team.jpg.asset.json';
import carSeats from '@/assets/car-detailing-seats.jpg.asset.json';
import carExterior from '@/assets/work/car-exterior-done.jpg.asset.json';
import carInterior from '@/assets/work/car-interior-clean.jpg.asset.json';

const gallery = [
  { url: carTeam.url, alt: 'WeWash car detailing crew working on a vehicle in Lusaka' },
  { url: carSeats.url, alt: 'Deep-cleaned car seats after a WeWash interior detail' },
  { url: carExterior.url, alt: 'Finished car exterior wash and polish by WeWash Lusaka' },
  { url: carInterior.url, alt: 'Clean car interior after a full WeWash valet in Lusaka' },
];

const offers = [
  {
    icon: Sparkles,
    title: 'Interior detail',
    price: 'From K450',
    note: 'Small car',
    description:
      'Seats, carpets, roof lining, dashboard, door panels and boot. We shampoo, extract and dress every surface properly.',
    points: ['Seat and carpet shampoo', 'Dashboard and trim dressing', 'Roof lining and glass', 'Odour treatment'],
  },
  {
    icon: Car,
    title: 'Exterior wash & polish',
    price: 'From K350',
    note: 'Small car',
    description:
      'A careful hand wash, wheel and tyre detail, then a polish that brings the paint back. No rushed drive-through jobs.',
    points: ['Hand wash and foam', 'Wheels, tyres and arches', 'Machine or hand polish', 'Wax finish'],
  },
  {
    icon: Armchair,
    title: 'Full valet (in & out)',
    price: 'From K700',
    note: 'Small car',
    description:
      'The complete job — interior detail and exterior wash and polish in one visit, at your home or office.',
    points: ['Everything in both packages', 'Engine bay wipe-down on request', 'We come to you', 'Water and power brought along if needed'],
  },
  {
    icon: ShieldCheck,
    title: 'Fleet & office plans',
    price: 'Custom quote',
    note: 'Monthly',
    description:
      'Scheduled detailing for company vehicles. Same team, agreed days, invoiced monthly — your fleet stays presentable.',
    points: ['Weekly or fortnightly visits', 'Per-vehicle pricing', 'Monthly invoicing', 'Condition reports'],
  },
];

const CarDetailing = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Helmet>
        <title>Mobile Car Detailing in Lusaka – We Come to You | WeWash</title>
        <meta
          name="description"
          content="Mobile car detailing in Lusaka. Interior detailing from K450, exterior wash & polish from K350, full valet from K700. We come to your home or office. Book today."
        />
        <link rel="canonical" href="https://wewashglobal.com/services/car-detailing" />
        <meta property="og:title" content="Mobile Car Detailing in Lusaka – We Come to You | WeWash" />
        <meta
          property="og:description"
          content="Professional mobile car detailing across Lusaka. Interior, exterior and full valet packages done at your doorstep."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wewashglobal.com/services/car-detailing" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wewashglobal.com/" },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://wewashglobal.com/services" },
            { "@type": "ListItem", "position": 3, "name": "Car Detailing", "item": "https://wewashglobal.com/services/car-detailing" }
          ]
        })}</script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Mobile car detailing',
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
              price: '450',
              description: 'Mobile interior car detailing, starting from K450',
            },
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-background via-card to-primary/10">
        <div className="container-wewash">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-gold mb-6 inline-block">Mobile Car Detailing</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Your car, detailed properly —
                <span className="text-primary"> at your doorstep</span>
              </h1>
              <p className="text-lg text-muted-foreground font-light mb-8 max-w-xl">
                We come to your house or office anywhere in Lusaka and do the car the way
                it should be done — inside and out. Every photo on this page is our own work.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate('/book-now')}>
                  Book a detailing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      'https://wa.me/260768671420?text=Hello WeWash, I would like to book a car detailing.',
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
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What detailing costs</h2>
          <p className="text-muted-foreground font-light mb-12 max-w-2xl">
            These are starting prices for a small car. Bigger vehicles and heavy condition
            change the figure — we confirm the exact price with you before we start.
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

export default CarDetailing;
