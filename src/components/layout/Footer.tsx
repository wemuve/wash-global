import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Linkedin, Twitter, Shield, Award, Clock } from 'lucide-react';
import WeWashLogo from '@/components/brand/WeWashLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const services = [
    { name: 'Home Cleaning', href: '/services#cleaning' },
    { name: 'Car Detailing', href: '/services#car-detailing' },
    { name: 'Fumigation', href: '/services#fumigation' },
    { name: 'Facility Management', href: '/services#facility' },
    { name: 'Office Cleaning', href: '/services#office' },
    { name: 'Sofa & Carpet Cleaning', href: '/services#upholstery' },
  ];
  const company = [
    { name: 'About Us', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Get Quote', href: '/quote' },
    { name: 'Contact', href: '/contact' },
  ];

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank');
  };

  return (
    <footer className="bg-card border-t border-border">
      {/* CTA Section */}
      <div className="border-b border-border">
        <div className="container-wewash section-spacing-sm">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Experience <span className="text-secondary">Premium Service?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every space deserves a bespoke approach. Request your free, no-obligation quote
              and let our experts tailor a solution to your exact needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={openWhatsApp} className="btn-whatsapp gap-2">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </Button>
              <Link to="/quote">
                <Button className="btn-gold gap-2 w-full sm:w-auto">
                  Request Free Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wewash py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <WeWashLogo variant="light" className="mb-6" />
            <p className="text-muted-foreground mb-6 max-w-sm">
              WeWash Global delivers bespoke, premium-grade cleaning and facility management services
              for discerning homes, businesses, and institutions across Zambia. A daughter company of WeMuve, Denmark.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-secondary" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4 text-secondary" />
                <span>Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-secondary" />
                <span>24/7 Support</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-secondary/20 transition-colors">
                  <Icon className="h-5 w-5 text-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map(item => (
                <li key={item.name}>
                  <Link to={item.href} className="text-muted-foreground hover:text-secondary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Company</h3>
            <ul className="space-y-3">
              {company.map(item => (
                <li key={item.name}>
                  <Link to={item.href} className="text-muted-foreground hover:text-secondary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+260768671420" className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                  <Phone className="h-4 w-4 text-secondary" />
                  +260 768 671 420
                </a>
              </li>
              <li>
                <a href="mailto:booking@wewashglobal.com" className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                  <Mail className="h-4 w-4 text-secondary" />
                  booking@wewashglobal.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-secondary" />
                  <span>D13 Antelope Close, Kabulonga, Lusaka</span>
                </div>
              </li>
              <li>
                <a href="https://wa.me/260768671420" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                  <MessageCircle className="h-4 w-4 text-secondary" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container-wewash py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} WeWash Global — A WeMuve (Denmark) Company. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-secondary transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
