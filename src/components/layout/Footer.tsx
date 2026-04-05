import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import WeWashLogo from '@/components/brand/WeWashLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Home Cleaning', href: '/services#cleaning' },
    { name: 'Car Detailing', href: '/services#car-detailing' },
    { name: 'Fumigation', href: '/services#fumigation' },
    { name: 'Facility Management', href: '/services#facility' },
    { name: 'Office Cleaning', href: '/services#office' },
  ];

  const company = [
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Get Quote', href: '/quote' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="border-t border-border/30">
      <div className="container-wewash py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <WeWashLogo variant="light" className="mb-6" />
            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xs">
              Bespoke cleaning and facility management for discerning homes, businesses, and institutions across Zambia.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-medium mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map(item => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-muted-foreground font-light hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-medium mb-6">Company</h4>
            <ul className="space-y-3">
              {company.map(item => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-muted-foreground font-light hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-medium mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+260768671420" className="flex items-center gap-2 text-sm text-muted-foreground font-light hover:text-foreground transition-colors">
                  <Phone className="h-3.5 w-3.5 text-secondary" />
                  +260 768 671 420
                </a>
              </li>
              <li>
                <a href="mailto:booking@wewashglobal.com" className="flex items-center gap-2 text-sm text-muted-foreground font-light hover:text-foreground transition-colors">
                  <Mail className="h-3.5 w-3.5 text-secondary" />
                  booking@wewashglobal.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-muted-foreground font-light">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 text-secondary flex-shrink-0" />
                  <span>Kabulonga, Lusaka</span>
                </div>
              </li>
              <li>
                <a href="https://wa.me/260768671420" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground font-light hover:text-foreground transition-colors">
                  <MessageCircle className="h-3.5 w-3.5 text-secondary" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border/20">
        <div className="container-wewash py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/60 font-light">© {currentYear} WeWash Global. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground/60 font-light">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
