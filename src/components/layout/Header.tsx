import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Phone, Menu, User, LogIn, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WeWashLogo from '@/components/brand/WeWashLogo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/quote', label: 'Get Quote' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const openWhatsApp = () => {
    window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-wewash-navy py-2 border-b border-border/30">
        <div className="container-wewash">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6 text-foreground/80">
              <a href="tel:+260768671420" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Phone className="h-3.5 w-3.5 text-secondary" />
                <span>+260 768 671 420</span>
              </a>
              <span className="opacity-30">|</span>
              <a href="mailto:booking@wewashglobal.com" className="hover:text-secondary transition-colors">
                booking@wewashglobal.com
              </a>
            </div>
            <div className="flex items-center gap-4 text-foreground/70 text-xs">
              <span>🇿🇲 Premium Services Across Zambia</span>
              <span className="opacity-30">|</span>
              <span>🇩🇰 A WeMuve Company</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-lg shadow-card border-b border-border/50' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}>
        <div className="container-wewash">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <WeWashLogo variant="light" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative text-sm font-medium transition-colors hover:text-secondary ${
                    isActive(link.href) 
                      ? 'text-secondary' 
                      : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                onClick={openWhatsApp}
                className="btn-whatsapp gap-2"
                size="sm"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              
              {user ? (
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="gap-2 border-border/50"
                  size="sm"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="gap-2 border-border/50"
                  size="sm"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
              
              <Button 
                onClick={() => navigate('/quote')}
                className="btn-gold gap-2"
                size="sm"
              >
                Get Quote
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-border">
                    <WeWashLogo variant="light" />
                  </div>
                  
                  <div className="flex-1 py-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-6 py-3 text-base font-medium transition-colors ${
                          isActive(link.href)
                            ? 'text-secondary bg-secondary/10'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="p-6 border-t border-border space-y-3">
                    <Button
                      onClick={() => { openWhatsApp(); setIsOpen(false); }}
                      className="w-full btn-whatsapp"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp Inquiry
                    </Button>
                    <Button
                      onClick={() => { navigate('/quote'); setIsOpen(false); }}
                      className="w-full btn-gold"
                    >
                      Get Your Free Quote
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
