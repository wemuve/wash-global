import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ExternalLink, Sparkles } from 'lucide-react';

interface WhatsAppCatalogProps {
  variant?: 'button' | 'card' | 'inline';
  className?: string;
}

// WeWash WhatsApp Business number
const WHATSAPP_BUSINESS_NUMBER = '260974000000'; // Update with actual number
const WHATSAPP_CATALOG_LINK = `https://wa.me/c/${WHATSAPP_BUSINESS_NUMBER}`;

const services = [
  { id: 'home-cleaning', name: 'Home Cleaning', price: 'From K650' },
  { id: 'car-detailing', name: 'Car Detailing', price: 'From K450' },
  { id: 'fumigation', name: 'Fumigation', price: 'From K400' },
  { id: 'facility', name: 'Facility Management', price: 'From K2,500' },
  { id: 'office', name: 'Office Cleaning', price: 'From K1,200' },
  { id: 'maids', name: 'Trained Maids', price: 'From K850' },
];

const WhatsAppCatalog: React.FC<WhatsAppCatalogProps> = ({ variant = 'button', className = '' }) => {
  const openCatalog = () => {
    window.open(WHATSAPP_CATALOG_LINK, '_blank');
  };

  const openServiceChat = (serviceName: string) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in your ${serviceName} service. Can you provide more details and pricing?`
    );
    window.open(`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${message}`, '_blank');
  };

  if (variant === 'button') {
    return (
      <Button 
        onClick={openCatalog}
        className={`btn-whatsapp gap-2 ${className}`}
      >
        <MessageSquare className="h-4 w-4" />
        Browse on WhatsApp
        <ExternalLink className="h-3 w-3" />
      </Button>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20 ${className}`}>
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">Browse services on WhatsApp</p>
          <p className="text-sm text-muted-foreground">View our full catalog and order directly</p>
        </div>
        <Button 
          onClick={openCatalog}
          size="sm" 
          className="btn-whatsapp"
        >
          Open Catalog
        </Button>
      </div>
    );
  }

  // Card variant
  return (
    <Card className={`border-success/30 overflow-hidden ${className}`}>
      <div className="h-1 bg-gradient-to-r from-success via-success/70 to-success" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-success" />
          WhatsApp Catalog
        </CardTitle>
        <CardDescription>
          Browse and order our services directly on WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Service Links */}
        <div className="grid grid-cols-2 gap-2">
          {services.slice(0, 4).map((service) => (
            <button
              key={service.id}
              onClick={() => openServiceChat(service.name)}
              className="p-3 text-left bg-muted/50 hover:bg-muted rounded-xl transition-colors"
            >
              <p className="font-medium text-foreground text-sm">{service.name}</p>
              <p className="text-xs text-muted-foreground">{service.price}</p>
            </button>
          ))}
        </div>

        {/* Full Catalog Button */}
        <Button 
          onClick={openCatalog}
          className="w-full btn-whatsapp gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          View Full Catalog
          <ExternalLink className="h-3 w-3" />
        </Button>

        {/* Features */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-wewash-gold mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Why WhatsApp?</p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                <li>• Chat directly with our team</li>
                <li>• Get instant price quotes</li>
                <li>• Book with voice messages</li>
                <li>• Pay via mobile money in chat</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppCatalog;
