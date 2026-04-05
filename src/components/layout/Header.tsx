import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Phone, Menu, User, LogIn, MessageCircle, X } from 'lucide-react';
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
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-xl border-b border-border/30' 
        : 'bg-transparent'
    }`}>
      <div className="container-wewash">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <WeWashLogo variant="light" />
          </Link>

          {/* Desktop Navigation — centered */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-[13px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 ${
                  isActive(link.href) 
                    ? 'text-secondary' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="gap-2 text-foreground/70 hover:text-foreground"
                size="sm"
              >
                <User className="h-4 w-4" />
                Dashboard
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="gap-2 text-foreground/70 hover:text-foreground"
                size="sm"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
            
            <Button 
              onClick={() => navigate('/quote')}
              className="btn-gold gap-2 text-xs uppercase tracking-wider"
              size="sm"
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground/70">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm p-0 border-l border-border/30">
              <div className="flex flex-col h-full">
                <div className="p-8 flex justify-between items-center">
                  <WeWashLogo variant="light" />
                </div>
                
                <div className="flex-1 px-8 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-4 text-lg font-light tracking-wide border-b border-border/20 transition-colors ${
                        isActive(link.href)
                          ? 'text-secondary'
                          : 'text-foreground/70 hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                
                <div className="p-8 space-y-3">
                  <Button
                    onClick={() => { openWhatsApp(); setIsOpen(false); }}
                    className="w-full btn-whatsapp"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
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
  );
};

export default Header;
