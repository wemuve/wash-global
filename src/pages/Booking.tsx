import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useBookings } from '@/hooks/useBookings';

interface BookingData {
  serviceCategory: string;
  specificService: string;
  packageTier: string;
  date: Date | undefined;
  time: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  specialInstructions: string;
}

const Booking = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceCategory: '',
    specificService: '',
    packageTier: '',
    date: undefined,
    time: '',
    location: '',
    name: '',
    email: '',
    phone: '',
    specialInstructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { categories, services, packages, loading, getServicesByCategory, getServicePrice } = useServices();
  const { createBooking } = useBookings();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-wewash-blue-light/10 to-wewash-gold-light/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  const timeSlots = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user || !bookingData.date) return;
    
    setIsSubmitting(true);
    
    try {
      const totalAmount = getServicePrice(bookingData.specificService, bookingData.packageTier || undefined);
      
      const result = await createBooking({
        service_id: bookingData.specificService,
        package_id: bookingData.packageTier || undefined,
        customer_name: bookingData.name,
        customer_phone: bookingData.phone,
        customer_address: bookingData.location,
        scheduled_date: format(bookingData.date, 'yyyy-MM-dd'),
        scheduled_time: bookingData.time,
        total_amount: totalAmount,
        special_instructions: bookingData.specialInstructions || undefined,
      });
      
      if (result.success) {
        toast({
          title: "Booking Submitted Successfully!",
          description: `Your booking has been created and is pending confirmation.`,
        });
        
        navigate('/booking-confirmation');
      } else {
        toast({
          title: "Booking Failed",
          description: result.error || "An error occurred while creating your booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceCategory">Select Service Category</Label>
              <Select value={bookingData.serviceCategory} onValueChange={(value) => 
                setBookingData({...bookingData, serviceCategory: value, specificService: ''})
              }>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a service category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {bookingData.serviceCategory && (
              <div>
                <Label htmlFor="specificService">Select Specific Service</Label>
                <Select value={bookingData.specificService} onValueChange={(value) => 
                  setBookingData({...bookingData, specificService: value})
                }>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose specific service" />
                  </SelectTrigger>
                  <SelectContent>
                    {getServicesByCategory(bookingData.serviceCategory).map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - K{service.base_price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="packageTier">Select Package Tier (Optional)</Label>
              <Select value={bookingData.packageTier} onValueChange={(value) => 
                setBookingData({...bookingData, packageTier: value})
              }>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose package tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Package (Standard Price)</SelectItem>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name} (+{Math.round((pkg.price_multiplier - 1) * 100)}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {bookingData.specificService && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-2">Estimated Price:</div>
                <div className="text-2xl font-bold text-wewash-blue">
                  K{getServicePrice(bookingData.specificService, bookingData.packageTier || undefined).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Preferred Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal",
                      !bookingData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingData.date ? format(bookingData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingData.date}
                    onSelect={(date) => setBookingData({...bookingData, date})}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time">Select Preferred Time</Label>
              <Select value={bookingData.time} onValueChange={(value) => 
                setBookingData({...bookingData, time: value})
              }>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Service Location</Label>
              <Input
                id="location"
                placeholder="Enter full address"
                value={bookingData.location}
                onChange={(e) => setBookingData({...bookingData, location: e.target.value})}
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={bookingData.name}
                onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={bookingData.email}
                onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+260 XXX XXX XXX"
                value={bookingData.phone}
                onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                className="h-12"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Any special requests or instructions for our team..."
                value={bookingData.specialInstructions}
                onChange={(e) => setBookingData({...bookingData, specialInstructions: e.target.value})}
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        const selectedService = services.find(s => s.id === bookingData.specificService);
        const selectedPackage = packages.find(p => p.id === bookingData.packageTier);
        const selectedCategory = categories.find(c => c.id === bookingData.serviceCategory);
        
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Your Booking</h3>
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <span className="font-medium">Service:</span> {selectedCategory?.name} - {selectedService?.name}
              </div>
              <div>
                <span className="font-medium">Package:</span> {selectedPackage?.name || 'Standard'}
              </div>
              <div>
                <span className="font-medium">Date & Time:</span> {bookingData.date ? format(bookingData.date, "PPP") : ''} at {bookingData.time}
              </div>
              <div>
                <span className="font-medium">Location:</span> {bookingData.location}
              </div>
              <div>
                <span className="font-medium">Contact:</span> {bookingData.name} ({bookingData.email}, {bookingData.phone})
              </div>
              <div>
                <span className="font-medium">Total Amount:</span> K{getServicePrice(bookingData.specificService, bookingData.packageTier || undefined).toFixed(2)}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return bookingData.serviceCategory && bookingData.specificService;
      case 2:
        return bookingData.date && bookingData.time;
      case 3:
        return bookingData.location && bookingData.name && bookingData.email && bookingData.phone;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wewash-blue-light/10 to-wewash-gold-light/10 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wewash-blue mb-2">Book a Service</h1>
          <p className="text-muted-foreground">Complete the form to schedule your WeWash service</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <React.Fragment key={i}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  i <= step ? "bg-wewash-blue text-white" : "bg-muted text-muted-foreground"
                )}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i}
                </div>
                {i < 5 && <div className={cn("w-8 h-0.5", i < step ? "bg-wewash-blue" : "bg-muted")} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>
              Step {step} of 5: {
                step === 1 ? 'Service Selection' : 
                step === 2 ? 'Date & Time' : 
                step === 3 ? 'Contact Details' : 
                step === 4 ? 'Special Instructions' :
                'Review & Submit'
              }
            </CardTitle>
            <CardDescription>
              {step === 1 ? 'Choose your service and package' : 
               step === 2 ? 'Select your preferred date and time' : 
               step === 3 ? 'Provide your contact information' : 
               step === 4 ? 'Add any special instructions' :
               'Review your booking details before submitting'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
                size="mobile"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {step < 5 ? (
                <Button
                  variant="premium"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  size="mobile"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  size="mobile"
                >
                  Submit Booking
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Booking;