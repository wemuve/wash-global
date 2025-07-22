import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  image: string;
  services: Array<{
    name: string;
    price: string;
    description?: string;
  }>;
}
export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  image,
  services
}) => {
  return <Card className="service-card group overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Service Image */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{
        backgroundImage: `url(${image})`
      }} />
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
        
        {/* Service Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className="text-white font-bold text-lg md:text-xl mb-2">
            {title}
          </h3>
        </div>
      </div>

      {/* Service Details */}
      <CardContent className="p-4 md:p-6">
        

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button variant="outline" className="w-full" onClick={() => window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about ' + title + ' services.', '_blank')}>
            WhatsApp Inquiry
          </Button>
        </div>

        {/* Pricing Note */}
        <div className="mt-4 text-xs text-muted-foreground text-center">
          * Pricing varies based on size, dirt level, distance, and specific client needs
        </div>
      </CardContent>
    </Card>;
};