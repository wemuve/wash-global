import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Shield, Clock, Phone, Star, CheckCircle, Users, Calendar, MapPin, LogIn, Briefcase, Home, UserCheck, Building, Bug, Car, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import heroImage from '@/assets/hero-cleaning-professionals.jpg';
import cleaningServicesImage from '@/assets/cleaning-services.jpg';
import homeMaintenanceImage from '@/assets/home-maintenance.jpg';
import trainedMaidsImage from '@/assets/trained-maids.jpg';
import facilityManagementImage from '@/assets/facility-management.jpg';
import fumigationServicesImage from '@/assets/fumigation-services.jpg';
import mobileCarDetailingImage from '@/assets/mobile-car-detailing.jpg';
const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const services = [{
    icon: Sparkles,
    title: "Cleaning Services",
    description: "Professional deep cleaning, office cleaning, carpet and window cleaning services",
    features: ["Deep House Cleaning", "Office Cleaning", "Carpet Cleaning", "Window Cleaning"]
  }, {
    icon: Home,
    title: "Home Maintenance",
    description: "Expert plumbing, electrical, painting and general repair services",
    features: ["Plumbing Repairs", "Electrical Work", "Painting", "General Repairs"]
  }, {
    icon: UserCheck,
    title: "Trained Maids",
    description: "Reliable and professional maid services for your home",
    features: ["Daily Maid Service", "Weekly Service", "Part-time", "Live-in Options"]
  }, {
    icon: Building,
    title: "Facility Management",
    description: "Complete building maintenance and property management solutions",
    features: ["Building Maintenance", "Security Services", "Landscaping", "Property Management"]
  }, {
    icon: Bug,
    title: "Fumigation Services",
    description: "Professional pest control and fumigation for residential and commercial properties",
    features: ["Residential Fumigation", "Commercial Service", "Pest Control", "Termite Treatment"]
  }, {
    icon: Car,
    title: "Mobile Car Detailing",
    description: "Professional mobile car detailing and full valet services at your location",
    features: ["Full Car Wash", "Interior Detailing", "Wax & Polish", "Mobile Service"]
  }];
  const whyChooseUs = [{
    icon: Shield,
    title: "Trusted & Insured",
    description: "All our services are fully insured and our staff are background-checked"
  }, {
    icon: Clock,
    title: "Punctual Service",
    description: "We arrive on time and complete work within the agreed timeframe"
  }, {
    icon: Star,
    title: "Premium Quality",
    description: "Using professional-grade equipment and eco-friendly products"
  }, {
    icon: Users,
    title: "Expert Team",
    description: "Trained professionals with years of experience in their respective fields"
  }];
  return <div className="min-h-screen bg-background">
      {/* Palmgren-style Header with Contact Info */}
      <div className="header-gradient text-white py-3">
        <div className="container-palmgren">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+260 768 671 420</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Contact@wewashzm.com
            </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container-palmgren">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/lovable-uploads/eab6e2be-5d58-4fd1-8145-f8535ed2a78e.png" alt="WeWash Zambia Logo" className="h-12 w-auto object-contain" />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-foreground hover:text-primary font-medium transition-colors">Home</a>
              <a href="#services" className="text-foreground hover:text-primary font-medium transition-colors">Services</a>
              <a href="#about" className="text-foreground hover:text-primary font-medium transition-colors">About</a>
              <a href="#contact" className="text-foreground hover:text-primary font-medium transition-colors">Contact</a>
              
              {/* Authentication buttons */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
                  <Button 
                    onClick={() => logout()}
                    variant="outline"
                    size="sm"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    size="sm"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </div>
              )}
              
              <Button 
                onClick={() => window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                WhatsApp Inquiry
              </Button>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              {!isAuthenticated && (
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="sm"
                >
                  <LogIn className="h-3 w-3 mr-1" />
                  Login
                </Button>
              )}
              <Button 
                onClick={() => window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Palmgren style with large image and CTA */}
      <section className="relative min-h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(37, 99, 235, 0.7)), url(${heroImage})`
      }} />
        <div className="relative container-palmgren text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            PROFESSIONAL CLEANING TO<br />
            <span className="text-blue-200">HOME SERVICES & FACILITY MANA</span>
          </h1>
          <div className="mt-12 space-y-4">
            <Button 
              onClick={() => window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-12 py-6 mr-4"
            >
              WhatsApp Inquiry
            </Button>
            <Button 
              onClick={() => navigate('/booking')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-6"
            >
              Book Service Online
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section - Palmgren style image cards */}
      <section id="services" className="section-spacing bg-gradient-subtle">
        <div className="container-palmgren">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Cleaning Services */}
            <div className="service-card group">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{
                backgroundImage: `url(${cleaningServicesImage})`
              }} />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Button className="btn-palmgren w-full">
                    CLEANING SERVICES
                  </Button>
                </div>
              </div>
            </div>

            {/* Home Maintenance */}
            <div className="service-card group">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{
                backgroundImage: `url(${homeMaintenanceImage})`
              }} />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Button className="btn-palmgren w-full">
                    HOME MAINTENANCE
                  </Button>
                </div>
              </div>
            </div>

            {/* Trained Maids */}
            <div className="service-card group">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{
                backgroundImage: `url(${trainedMaidsImage})`
              }} />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Button className="btn-palmgren w-full">
                    TRAINED MAIDS
                  </Button>
                </div>
              </div>
            </div>

            {/* Facility Management */}
            <div className="service-card group">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{
                backgroundImage: `url(${facilityManagementImage})`
              }} />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Button className="btn-palmgren w-full">
                    FACILITY MANAGEMENT
                  </Button>
                </div>
              </div>
            </div>

            {/* Fumigation Services */}
            <div className="service-card group">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{
                backgroundImage: `url(${fumigationServicesImage})`
              }} />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Button className="btn-palmgren w-full">
                    FUMIGATION SERVICES
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Car Detailing */}
            <div className="service-card group">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{
                backgroundImage: `url(${mobileCarDetailingImage})`
              }} />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Button className="btn-palmgren w-full">
                    MOBILE CAR DETAILING
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Section - like Palmgren */}
      <section className="section-spacing">
        <div className="container-palmgren text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            CHOOSE WEWASH AS YOUR REGULAR<br />
            BUSINESS PARTNER
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              WeWash Zambia is a professional cleaning and property service company based in Lusaka. 
              We offer comprehensive solutions for residential and commercial properties, delivering 
              exceptional quality at competitive prices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              
              <div>
                <h3 className="text-xl font-semibold mb-4">LUSAKA</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Lusaka Central, Zambia</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+260 768 671 420</span>
                  </div>
                  <div className="flex items-center">
                    <span>contact@wewashzm.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Palmgren style simple footer */}
      <footer id="contact" className="section-spacing bg-palmgren-gray border-t">
        <div className="container-palmgren">
          <div className="text-center mb-12">
            <img src="/lovable-uploads/eab6e2be-5d58-4fd1-8145-f8535ed2a78e.png" alt="WeWash Zambia" className="h-16 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional cleaning and property services in Zambia. 
              Contact us for an obligation-free quote.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground mb-4">LUSAKA</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center justify-center md:justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Lusaka Central, Zambia</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+260 768 671 420</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <span>contact@wewashzm.com</span>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground mb-4">COVERAGE AREA</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center justify-center md:justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Aarhus, Denmark</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+45 60 67 81 93</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <span>partner@wewashzm.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about your services.', '_blank')}
              className="btn-palmgren mb-8"
            >
              WhatsApp Inquiry
            </Button>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>CVR: ZM001234 &copy; 2024 WeWash Zambia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;