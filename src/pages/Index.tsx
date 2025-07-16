import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Shield, Clock, Phone, Star, CheckCircle, Users, Calendar, MapPin, LogIn, Briefcase, Home, UserCheck, Building, Bug, Car } from 'lucide-react';
const Index = () => {
  const navigate = useNavigate();
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
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-wewash-blue backdrop-blur supports-[backdrop-filter]:bg-wewash-blue/95 border-b border-wewash-blue-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/lovable-uploads/93791de6-069c-4110-8d97-625f4c9a2cc3.png" alt="WeWash Zambia Logo" className="h-12 w-auto sm:h-16 object-contain opacity-90 bg-gray-600/80 rounded-lg p-1" />
              
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="whatsapp" size="sm" className="hidden sm:flex">
                <Phone className="mr-2 h-4 w-4" />
                WhatsApp Support
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')} size="sm" className="border-white text-white hover:bg-white hover:text-wewash-blue">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-wewash-blue via-wewash-blue-dark to-wewash-blue-light text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-wewash-blue/90 to-wewash-blue-dark/90"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Elite Cleaning and 
            <span className="text-wewash-gold"> Property Services</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Premium multi-service company offering professional cleaning, home maintenance, 
            trained maids, facility management, and fumigation services in Zambia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="mobile" onClick={() => navigate('/booking')} className="bg-wewash-gold hover:bg-wewash-gold-dark text-wewash-gold-dark hover:text-white shadow-gold">
              <Calendar className="mr-2 h-5 w-5" />
              Book a Service
            </Button>
            <Button variant="outline" size="mobile" className="border-white text-white hover:bg-white hover:text-wewash-blue">
              <Phone className="mr-2 h-5 w-5" />
              WhatsApp Support
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-wewash-gold/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Premium Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions for all your cleaning and property maintenance needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => <Card key={index} className="shadow-elegant hover:shadow-primary transition-all duration-300 transform hover:scale-105 border-0">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-wewash-blue mr-2 flex-shrink-0" />
                        {feature}
                      </li>)}
                  </ul>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose WeWash Zambia?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our professional, reliable, and premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mb-6">
                  <reason.icon className="h-8 w-8 text-wewash-gold-dark" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-wewash-blue to-wewash-blue-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Premium Service?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Book your service today and discover why WeWash Zambia is the trusted choice 
            for premium cleaning and property services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="mobile" onClick={() => navigate('/booking')} className="bg-wewash-gold hover:bg-wewash-gold-dark text-wewash-gold-dark hover:text-white">
              <Calendar className="mr-2 h-5 w-5" />
              Book Your Service Now
            </Button>
            <Button variant="outline" size="mobile" className="border-white text-white hover:bg-white hover:text-wewash-blue">
              <Phone className="mr-2 h-5 w-5" />
              Get Free Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wewash-blue text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/lovable-uploads/93791de6-069c-4110-8d97-625f4c9a2cc3.png" alt="WeWash Zambia Logo" className="h-12 w-auto" />
                <span className="ml-2 text-2xl font-bold text-wewash-gold">
              </span>
              </div>
              <p className="text-white/80 mb-4">
                Elite Cleaning and Property Services - Your trusted partner for premium 
                cleaning and maintenance solutions in Zambia.
              </p>
              <div className="flex items-center text-white/80">
                <MapPin className="h-4 w-4 mr-2" />
                Lusaka, Zambia
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-white/80">
                <li>Professional Cleaning</li>
                <li>Home Maintenance</li>
                <li>Trained Maids</li>
                <li>Facility Management</li>
                <li>Fumigation Services</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <Button variant="whatsapp" size="sm" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  WhatsApp Support
                </Button>
                <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white hover:text-wewash-blue" onClick={() => navigate('/login')}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Client Login
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 WeWash Zambia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;