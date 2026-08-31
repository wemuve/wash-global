import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

import loungeEvening from '@/assets/gallery/lounge-evening.jpg.asset.json';
import livingRoomLounge from '@/assets/gallery/living-room-lounge.jpg.asset.json';
import loungeFinished from '@/assets/gallery/lounge-finished.jpg.asset.json';
import floorVacuum from '@/assets/gallery/floor-vacuum.jpg.asset.json';
import sofaCleaned from '@/assets/gallery/sofa-cleaned.jpg.asset.json';
import sofaUpholstery from '@/assets/gallery/sofa-upholstery.jpg.asset.json';
import kitchenUnits from '@/assets/gallery/kitchen-units.jpg.asset.json';
import kitchenBlinds from '@/assets/gallery/kitchen-blinds.jpg.asset.json';
import bedroomStrip from '@/assets/gallery/bedroom-strip.jpg.asset.json';

const shots = [
  {
    src: loungeEvening.url,
    alt: 'Lounge cleaned by WeWash in Lusaka with sofas, rug and tiled floor finished',
    caption: 'Lounge finished',
    place: 'Two-bedroom flat, Lusaka',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    src: floorVacuum.url,
    alt: 'Industrial vacuum on a polished marble floor during a WeWash deep clean',
    caption: 'Floors mid-clean',
    place: 'Move-out clean',
    span: '',
  },
  {
    src: sofaUpholstery.url,
    alt: 'Fabric sofa being cleaned during a WeWash upholstery job',
    caption: 'Upholstery wash',
    place: 'Three-seater, fabric',
    span: '',
  },
  {
    src: livingRoomLounge.url,
    alt: 'Open-plan kitchen and living room cleaned by WeWash',
    caption: 'Open-plan reset',
    place: 'Kitchen and lounge',
    span: 'md:col-span-2',
  },
  {
    src: kitchenBlinds.url,
    alt: 'Stained kitchen blinds and sink before a WeWash deep clean',
    caption: 'Blinds before treatment',
    place: 'Kitchen window',
    span: '',
  },
  {
    src: bedroomStrip.url,
    alt: 'Bedroom with bedding stripped ahead of a WeWash deep clean',
    caption: 'Bedding stripped',
    place: 'Deep clean, day one',
    span: '',
  },
  {
    src: kitchenUnits.url,
    alt: 'Kitchen cupboards and cooker cleaned inside and out by WeWash',
    caption: 'Cupboards and cooker',
    place: 'Inside and out',
    span: '',
  },
  {
    src: sofaCleaned.url,
    alt: 'Two-seater sofa after upholstery cleaning by WeWash',
    caption: 'Sofa, after',
    place: 'Dried and re-set',
    span: '',
  },
  {
    src: loungeFinished.url,
    alt: 'Living room rug and floor after a WeWash clean in Lusaka',
    caption: 'Rug and floors done',
    place: 'Handed back to the client',
    span: '',
  },
];

const WorkGallerySection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-spacing" id="our-work">
      <div className="container-wewash">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-secondary mb-4">Our work</p>
            <h2 className="text-foreground mb-4">Photos from jobs we actually did</h2>
            <p className="text-lg text-muted-foreground">
              Homes, sofas, kitchens and floors around Lusaka — shot by our own team on the day.
              Nothing here is a stock photo.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/book-now')} className="gap-2 shrink-0">
            Book a clean
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-4">
          {shots.map((shot) => (
            <figure
              key={shot.src}
              className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-card ${shot.span}`}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220_35%_8%/0.85)] via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm font-medium text-white">{shot.caption}</p>
                <p className="text-xs text-white/70">{shot.place}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkGallerySection;
