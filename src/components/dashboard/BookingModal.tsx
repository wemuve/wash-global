import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, CheckCircle } from 'lucide-react';
import { useBookingSimple } from '@/hooks/useBookingSimple';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prefilledData?: {
    serviceType?: string;
    estimatedPrice?: number;
  };
}

const services = [
  { id: 'home-cleaning', name: 'Home Cleaning', basePrice: 350 },
  { id: 'office-cleaning', name: 'Office & Commercial Cleaning', basePrice: 500 },
  { id: 'deep-cleaning', name: 'Deep Cleaning', basePrice: 550 },
  { id: 'car-detailing', name: 'Mobile Car Detailing', basePrice: 250 },
  { id: 'fumigation', name: 'Fumigation & Pest Control', basePrice: 400 },
  { id: 'facility-management', name: 'Facility Management', basePrice: 800 },
  { id: 'maid-services', name: 'Professional Maid Services', basePrice: 1500 },
];

const packages = [
  { id: 'basic', name: 'Basic Package', multiplier: 1.0 },
  { id: 'standard', name: 'Standard Package', multiplier: 1.5 },
  { id: 'premium', name: 'Premium Package', multiplier: 2.0 },
  { id: 'vip', name: 'VIP Package', multiplier: 3.0 },
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  prefilledData 
}) => {
  const { user } = useAuth();
  const { createBooking, isLoading } = useBookingSimple();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceId: prefilledData?.serviceType || '',
    packageId: 'standard',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    scheduledDate: undefined as Date | undefined,
    scheduledTime: '',
    specialInstructions: '',
  });

  const selectedService = services.find(s => s.id === formData.serviceId);
  const selectedPackage = packages.find(p => p.id === formData.packageId);
  
  const calculatePrice = () => {
    if (!selectedService || !selectedPackage) return 0;
    return Math.round(selectedService.basePrice * selectedPackage.multiplier);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      return formData.serviceId && formData.packageId;
    }
    if (currentStep === 2) {
      return formData.customerName && formData.customerPhone && formData.customerAddress;
    }
    if (currentStep === 3) {
      return formData.scheduledDate && formData.scheduledTime;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      toast({
        title: 'Please complete all required fields',
        variant: 'destructive'
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast({
        title: 'Please complete all required fields',
        variant: 'destructive'
      });
      return;
    }

    const bookingData = {
      service_id: formData.serviceId,
      service_name: selectedService?.name || '',
      package_id: formData.packageId,
      package_name: selectedPackage?.name || '',
      customer_name: formData.customerName,
      customer_phone: formData.customerPhone,
      customer_email: formData.customerEmail || undefined,
      customer_address: formData.customerAddress,
      scheduled_date: format(formData.scheduledDate!, 'yyyy-MM-dd'),
      scheduled_time: formData.scheduledTime,
      special_instructions: formData.specialInstructions || undefined,
      total_amount: prefilledData?.estimatedPrice || calculatePrice(),
      user_id: user?.id,
    };

    const result = await createBooking(bookingData);
    
    if (result.success) {
      setBookingComplete(true);
      setTimeout(() => {
        onSuccess();
        resetForm();
      }, 2000);
    }
  };

  const resetForm = () => {
    setStep(1);
    setBookingComplete(false);
    setFormData({
      serviceId: '',
      packageId: 'standard',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      scheduledDate: undefined,
      scheduledTime: '',
      specialInstructions: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (bookingComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground">
              You'll receive a WhatsApp confirmation shortly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Book a Service
          </DialogTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Select Service *</Label>
                <Select 
                  value={formData.serviceId} 
                  onValueChange={(v) => handleInputChange('serviceId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - From K{service.basePrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select Package *</Label>
                <Select 
                  value={formData.packageId} 
                  onValueChange={(v) => handleInputChange('packageId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map(pkg => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.multiplier}x)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedService && selectedPackage && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">Estimated Price</p>
                  <p className="text-2xl font-bold text-primary">
                    K{(prefilledData?.estimatedPrice || calculatePrice()).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Payment after service completion
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Customer Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="e.g., 0971234567"
                />
              </div>

              <div>
                <Label>Email (Optional)</Label>
                <Input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label>Address *</Label>
                <Textarea
                  value={formData.customerAddress}
                  onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                  placeholder="Enter your full address with area/compound"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Select Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduledDate 
                        ? format(formData.scheduledDate, "PPP") 
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.scheduledDate}
                      onSelect={(d) => handleInputChange('scheduledDate', d)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Select Time *</Label>
                <Select 
                  value={formData.scheduledTime} 
                  onValueChange={(v) => handleInputChange('scheduledTime', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Special Instructions (Optional)</Label>
                <Textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Review Your Booking</h3>
              
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{selectedPackage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {formData.scheduledDate && format(formData.scheduledDate, 'PPP')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{formData.scheduledTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-right max-w-[200px]">
                    {formData.customerAddress}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    K{(prefilledData?.estimatedPrice || calculatePrice()).toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Payment will be collected after service completion via Mobile Money
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext} className="flex-1">
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
