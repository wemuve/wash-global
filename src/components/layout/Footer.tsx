import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Shield,
  Award,
  Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Home Cleaning', href: '/services#cleaning' },
    { name: 'Car Detailing', href: '/services#car-detailing' },
    { name: 'Fumigation', href: '/services#fumigation' },
    { name: 'Facility Management', href: '/services#facility' },
    { name: 'Office Cleaning', href: '/services#office' },
    { name: 'Trainee Maids', href: '/services#maids' },
  ];

  const company = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/about#team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
  ];

  const support = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Help Center', href: '/help' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank');
  };

  return (
    <footer className="bg-wewash-navy text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="container-wewash section-spacing-sm">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience Premium Service?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Join thousands of satisfied customers across Zambia and Denmark. 
              Get a free quote today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={openWhatsApp} className="btn-whatsapp gap-2">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </Button>
              <Link to="/book">
                <Button className="btn-gold gap-2 w-full sm:w-auto">
                  Book a Service
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
            <img 
              src="/lovable-uploads/eab6e2be-5d58-4fd1-8145-f8535ed2a78e.png" 
              alt="WeWash Global" 
              className="h-12 w-auto mb-6"
            />
            <p className="text-white/70 mb-6 max-w-sm">
              WeWash Global delivers premium cleaning and facility management services 
              for homes, businesses, and institutions across Zambia and Denmark.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Shield className="h-4 w-4 text-wewash-gold" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Award className="h-4 w-4 text-wewash-gold" />
                <span>Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="h-4 w-4 text-wewash-gold" />
                <span>24/7 Support</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <div className="text-sm text-white/50 mb-1">Zambia</div>
                <a href="tel:+260768671420" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                  +260 768 671 420
                </a>
              </li>
              <li>
                <div className="text-sm text-white/50 mb-1">Denmark</div>
                <a href="tel:+4560678193" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                  +45 60 67 81 93
                </a>
              </li>
              <li>
                <a href="mailto:contact@wewashglobal.com" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                  contact@wewashglobal.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-white/70">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>Lusaka, Zambia & Aarhus, Denmark</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-wewash py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>© {currentYear} WeWash Global. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
