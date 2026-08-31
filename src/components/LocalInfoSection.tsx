import React from 'react';
import { MapPin, Clock, Phone, Mail, ExternalLink } from 'lucide-react';

export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=-15.387526,28.322817';

const LocalInfoSection = () => {
  return (
    <section className="py-20 border-t border-border">
      <div className="container-wewash">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="badge-gold mb-5 inline-block">Find us in Lusaka</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Based in Kabulonga, working across Lusaka
            </h2>
            <p className="text-muted-foreground font-light max-w-xl">
              Our teams leave from our Kabulonga office every morning and cover Kabulonga,
              Woodlands, Rhodes Park, Ibex Hill, Roma, Avondale, Meanwood and the rest of
              Lusaka. Transport is quoted from the office, both ways.
            </p>
          </div>

          <address className="not-italic grid sm:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-1">Office</p>
                <p className="text-sm text-muted-foreground font-light">
                  D13 Antelope Close, Kabulonga
                  <br />
                  Lusaka 10101, Zambia
                </p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary inline-flex items-center gap-1 mt-2 hover:underline"
                >
                  Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-1">Opening hours</p>
                <p className="text-sm text-muted-foreground font-light">
                  Monday – Saturday: 07:00 – 19:00
                  <br />
                  Sunday: 08:00 – 16:00
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-1">Phone & WhatsApp</p>
                <a
                  href="tel:+260768671420"
                  className="text-sm text-muted-foreground font-light hover:text-foreground"
                >
                  +260 768 671 420
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-1">Email</p>
                <a
                  href="mailto:booking@wewashglobal.com"
                  className="text-sm text-muted-foreground font-light hover:text-foreground break-all"
                >
                  booking@wewashglobal.com
                </a>
              </div>
            </div>
          </address>
        </div>
      </div>
    </section>
  );
};

export default LocalInfoSection;
