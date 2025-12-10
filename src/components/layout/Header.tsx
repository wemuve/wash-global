import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Phone, Menu, X, User, LogIn, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
      <div className="hidden md:block header-gradient text-primary-foreground py-2">
        <div className="container-wewash">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+260768671420" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Phone className="h-4 w-4" />
                <span>+260 768 671 420</span>
              </a>
              <span className="opacity-60">|</span>
              <a href="mailto:contact@wewashglobal.com" className="hover:opacity-80 transition-opacity">
                contact@wewashglobal.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="opacity-80">🇿🇲 Serving Zambia</span>
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
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/eab6e2be-5d58-4fd1-8145-f8535ed2a78e.png" 
                alt="WeWash Global" 
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.href) 
                      ? 'text-primary' 
                      : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                onClick={openWhatsApp}
                className="btn-whatsapp gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              
              {user ? (
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
              
              <Button 
                onClick={() => navigate('/book')}
                className="btn-premium"
              >
                Book Now
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
                    <img 
                      src="/lovable-uploads/eab6e2be-5d58-4fd1-8145-f8535ed2a78e.png" 
                      alt="WeWash Global" 
                      className="h-10 w-auto"
                    />
                  </div>
                  
                  <div className="flex-1 py-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-6 py-3 text-base font-medium transition-colors ${
                          isActive(link.href)
                            ? 'text-primary bg-primary-muted'
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
                      onClick={() => { navigate('/book'); setIsOpen(false); }}
                      className="w-full btn-premium"
                    >
                      Book Now
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
