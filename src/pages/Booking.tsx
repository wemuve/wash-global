
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
import { CalendarIcon, CheckCircle, ArrowRight, ArrowLeft, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useBookings } from '@/hooks/useBookings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  // Vehicle information for car detailing services
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleType: string;
  vehicleColor: string;
  licensePlate: string;
  vehicleNotes: string;
  parkingDetails: string;
  waterAvailable: boolean;
  electricityAvailable: boolean;
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
    specialInstructions: '',
    // Vehicle information for car detailing services
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleType: '',
    vehicleColor: '',
    licensePlate: '',
    vehicleNotes: '',
    parkingDetails: '',
    waterAvailable: true,
    electricityAvailable: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { categories, services, packages, loading, error, getServicesByCategory, getServicePrice, refetch } = useServices();
  const { createBooking } = useBookings();

  // Enhanced debugging function
  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugMessage = `[${timestamp}] ${message}`;
    console.log('🔍 BOOKING DEBUG:', debugMessage);
    setDebugInfo(prev => [...prev.slice(-9), debugMessage]); // Keep last 10 messages
  };

  // Enhanced authentication and data loading monitoring - Allow guests for B2B bookings
  useEffect(() => {
    addDebugInfo(`Authentication check - isAuthenticated: ${isAuthenticated}, user: ${user ? 'present' : 'null'}`);
    
    addDebugInfo(`Services loading: ${loading}, error: ${error || 'none'}`);
    addDebugInfo(`Data loaded - Categories: ${categories.length}, Services: ${services.length}, Packages: ${packages.length}`);
    
    if (error) {
      addDebugInfo(`Service loading error: ${error}`);
    }
  }, [isAuthenticated, user, loading, error, categories.length, services.length, packages.length]);

  // Enhanced loading state with timeout handling
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-wewash-blue-light/10 to-wewash-gold-light/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading services...</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Categories: {categories.length}</p>
            <p>Services: {services.length}</p>
            <p>Packages: {packages.length}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              addDebugInfo('Manual refresh triggered');
              refetch();
            }}
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  // Error state display
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-wewash-blue-light/10 to-wewash-gold-light/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Services</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2">
            <Button 
              onClick={() => {
                addDebugInfo('Retry button clicked');
                refetch();
              }}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check for empty data after loading
  if (!loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-wewash-blue-light/10 to-wewash-gold-light/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Services Available</AlertTitle>
            <AlertDescription className="mt-2">
              No service categories are currently available. Please contact support.
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2">
            <Button 
              onClick={() => {
                addDebugInfo('Refresh empty state clicked');
                refetch();
              }}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const timeSlots = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

  // Check if the selected service category is car detailing
  const selectedCategory = categories.find(c => c.id === bookingData.serviceCategory);
  const isCarDetailing = selectedCategory?.name === 'Mobile Car Detailing';
  const totalSteps = isCarDetailing ? 6 : 5;

  const handleNext = () => {
    addDebugInfo(`Moving from step ${step} to ${step + 1}`);
    
    // Handle facility management WhatsApp redirect
    if (step === 1 && bookingData.serviceCategory === 'whatsapp-facility') {
      window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about facility management services.', '_blank');
      return;
    }
    
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    addDebugInfo(`Moving from step ${step} to ${step - 1}`);
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    addDebugInfo('Submit booking attempt started');
    
    if (!bookingData.date) {
      addDebugInfo(`Submit validation failed - date: ${bookingData.date ? 'present' : 'null'}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const totalAmount = getServicePrice(bookingData.specificService, bookingData.packageTier || undefined);
      addDebugInfo(`Calculated total amount: ${totalAmount}`);
      
      const bookingPayload = {
        service_id: bookingData.specificService,
        package_id: bookingData.packageTier || undefined,
        customer_name: bookingData.name,
        customer_phone: bookingData.phone,
        customer_address: bookingData.location,
        scheduled_date: format(bookingData.date, 'yyyy-MM-dd'),
        scheduled_time: bookingData.time,
        total_amount: totalAmount,
        special_instructions: bookingData.specialInstructions || undefined,
        ...(user && { user_id: user.id }), // Only include user_id if user is logged in
        // Include vehicle information if it's a car detailing service
        ...(isCarDetailing && {
          vehicle_make: bookingData.vehicleMake || undefined,
          vehicle_model: bookingData.vehicleModel || undefined,
          vehicle_year: bookingData.vehicleYear ? parseInt(bookingData.vehicleYear) : undefined,
          vehicle_type: bookingData.vehicleType || undefined,
          vehicle_color: bookingData.vehicleColor || undefined,
          license_plate: bookingData.licensePlate || undefined,
          vehicle_notes: bookingData.vehicleNotes || undefined,
          parking_details: bookingData.parkingDetails || undefined,
          water_available: bookingData.waterAvailable,
          electricity_available: bookingData.electricityAvailable,
        })
      };
      
      addDebugInfo(`Booking payload: ${JSON.stringify(bookingPayload, null, 2)}`);
      
      const result = await createBooking(bookingPayload);
      addDebugInfo(`Booking result: ${JSON.stringify(result)}`);
      
      if (result.success) {
        addDebugInfo('Booking created successfully');
        toast({
          title: "Booking Submitted Successfully!",
          description: `Your booking has been created and is pending confirmation.`,
        });
        
        navigate('/booking-confirmation');
      } else {
        addDebugInfo(`Booking failed: ${result.error}`);
        toast({
          title: "Booking Failed",
          description: result.error || "An error occurred while creating your booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addDebugInfo(`Booking exception: ${errorMessage}`);
      console.error('Booking submission error:', error);
      
      toast({
        title: "Booking Failed",
        description: `An unexpected error occurred: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      addDebugInfo('Submit booking attempt completed');
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
                  {categories.map((category) => {
                    // For Facility Management, show special option
                    if (category.name === 'Facility Management') {
                      return (
                        <SelectItem key={category.id} value="whatsapp-facility">
                          {category.name} - Contact WhatsApp Support
                        </SelectItem>
                      );
                    }
                    return (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {bookingData.serviceCategory && bookingData.serviceCategory !== 'whatsapp-facility' && (
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

            {bookingData.serviceCategory === 'whatsapp-facility' && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">Facility Management Services</p>
                  <p className="text-muted-foreground">For facility management services, please contact our WhatsApp support for personalized consultation and quotes.</p>
                  <Button 
                    onClick={() => window.open('https://wa.me/260768671420?text=Hello, I would like to inquire about facility management services.', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Contact WhatsApp Support
                  </Button>
                </div>
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
                  <SelectItem value="none">No Package (Standard Price)</SelectItem>
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
                  K{getServicePrice(bookingData.specificService, bookingData.packageTier === 'none' ? undefined : bookingData.packageTier || undefined).toFixed(2)}
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
        // Vehicle Information step (only for car detailing)
        if (isCarDetailing) {
          return (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">🚗 Vehicle Information</h4>
                <p className="text-sm text-blue-700">Please provide details about your vehicle for our mobile car detailing service.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleMake">Vehicle Make *</Label>
                  <Input
                    id="vehicleMake"
                    placeholder="e.g., Toyota, BMW"
                    value={bookingData.vehicleMake}
                    onChange={(e) => setBookingData({...bookingData, vehicleMake: e.target.value})}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="e.g., Camry, X5"
                    value={bookingData.vehicleModel}
                    onChange={(e) => setBookingData({...bookingData, vehicleModel: e.target.value})}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleYear">Year</Label>
                  <Input
                    id="vehicleYear"
                    placeholder="e.g., 2020"
                    value={bookingData.vehicleYear}
                    onChange={(e) => setBookingData({...bookingData, vehicleYear: e.target.value})}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select value={bookingData.vehicleType} onValueChange={(value) => 
                    setBookingData({...bookingData, vehicleType: value})
                  }>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="wagon">Station Wagon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleColor">Vehicle Color</Label>
                  <Input
                    id="vehicleColor"
                    placeholder="e.g., White, Black"
                    value={bookingData.vehicleColor}
                    onChange={(e) => setBookingData({...bookingData, vehicleColor: e.target.value})}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    placeholder="e.g., ABC 123"
                    value={bookingData.licensePlate}
                    onChange={(e) => setBookingData({...bookingData, licensePlate: e.target.value})}
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="parkingDetails">Parking Details & Access Instructions</Label>
                <Textarea
                  id="parkingDetails"
                  placeholder="Where should we park? Any gates, security, or access instructions..."
                  value={bookingData.parkingDetails}
                  onChange={(e) => setBookingData({...bookingData, parkingDetails: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Utilities Available</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="waterAvailable"
                      checked={bookingData.waterAvailable}
                      onChange={(e) => setBookingData({...bookingData, waterAvailable: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="waterAvailable" className="text-sm">Water source available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="electricityAvailable"
                      checked={bookingData.electricityAvailable}
                      onChange={(e) => setBookingData({...bookingData, electricityAvailable: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="electricityAvailable" className="text-sm">Electricity available</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="vehicleNotes">Additional Vehicle Notes</Label>
                <Textarea
                  id="vehicleNotes"
                  placeholder="Any special conditions, damages, or requirements we should know about..."
                  value={bookingData.vehicleNotes}
                  onChange={(e) => setBookingData({...bookingData, vehicleNotes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          );
        }
        // Fall through to special instructions for non-car detailing
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
        // Special Instructions step for car detailing OR Review step for regular services
        if (isCarDetailing) {
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special requests or instructions for our car detailing team..."
                  value={bookingData.specialInstructions}
                  onChange={(e) => setBookingData({...bookingData, specialInstructions: e.target.value})}
                  rows={4}
                />
              </div>
            </div>
          );
        }
        // Fall through to review for non-car detailing
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
                <span className="font-medium">Total Amount:</span> K{getServicePrice(bookingData.specificService, bookingData.packageTier === 'none' ? undefined : bookingData.packageTier || undefined).toFixed(2)}
              </div>
            </div>
          </div>
        );

      case 6:
        // Review step for car detailing
        if (isCarDetailing) {
          const selectedService = services.find(s => s.id === bookingData.specificService);
          const selectedPackage = packages.find(p => p.id === bookingData.packageTier);
          const selectedCategory = categories.find(c => c.id === bookingData.serviceCategory);
          
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Car Detailing Booking</h3>
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
                  <span className="font-medium">Vehicle:</span> {bookingData.vehicleMake} {bookingData.vehicleModel} ({bookingData.vehicleYear}) - {bookingData.vehicleColor}
                </div>
                {bookingData.licensePlate && (
                  <div>
                    <span className="font-medium">License Plate:</span> {bookingData.licensePlate}
                  </div>
                )}
                <div>
                  <span className="font-medium">Total Amount:</span> K{getServicePrice(bookingData.specificService, bookingData.packageTier === 'none' ? undefined : bookingData.packageTier || undefined).toFixed(2)}
                </div>
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return bookingData.serviceCategory && (bookingData.specificService || bookingData.serviceCategory === 'whatsapp-facility');
      case 2:
        return bookingData.date && bookingData.time;
      case 3:
        return bookingData.location && bookingData.name && bookingData.phone;
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
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
              <div key={i} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  i <= step ? "bg-wewash-blue text-white" : "bg-muted text-muted-foreground"
                )}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i}
                </div>
                {i < totalSteps && <div className={cn("w-8 h-0.5", i < step ? "bg-wewash-blue" : "bg-muted")} />}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>
              Step {step} of {totalSteps}: {
                step === 1 ? 'Service Selection' : 
                step === 2 ? 'Date & Time' : 
                step === 3 ? 'Contact Details' : 
                step === 4 ? (isCarDetailing ? 'Vehicle Information' : 'Special Instructions') :
                step === 5 ? (isCarDetailing ? 'Special Instructions' : 'Review & Submit') :
                'Review & Submit'
              }
            </CardTitle>
            <CardDescription>
              {step === 1 ? 'Choose your service and package' : 
               step === 2 ? 'Select your preferred date and time' : 
               step === 3 ? 'Provide your contact information' : 
               step === 4 ? (isCarDetailing ? 'Enter your vehicle details' : 'Add any special instructions') :
               step === 5 ? (isCarDetailing ? 'Add any special instructions' : 'Review your booking details before submitting') :
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

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2"
                >
                  {bookingData.serviceCategory === 'whatsapp-facility' ? 'Contact WhatsApp Support' : 'Next'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Booking
                  {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
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

        {/* Debug Panel (only visible in development or when there are errors) */}
        {(process.env.NODE_ENV === 'development' || error) && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <strong>Auth:</strong> {isAuthenticated ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>User:</strong> {user ? 'Present' : 'Null'}
                  </div>
                  <div>
                    <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <strong>Categories:</strong> {categories.length}
                  </div>
                  <div>
                    <strong>Services:</strong> {services.length}
                  </div>
                  <div>
                    <strong>Packages:</strong> {packages.length}
                  </div>
                </div>
                {error && (
                  <div className="text-xs text-red-600">
                    <strong>Error:</strong> {error}
                  </div>
                )}
                <div className="mt-4">
                  <strong className="text-xs">Recent Activity:</strong>
                  <div className="mt-2 max-h-32 overflow-y-auto text-xs font-mono bg-white p-2 rounded border">
                    {debugInfo.length === 0 ? (
                      <div className="text-gray-500">No debug info yet...</div>
                    ) : (
                      debugInfo.map((info, i) => (
                        <div key={i} className="text-gray-700">{info}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Booking;
