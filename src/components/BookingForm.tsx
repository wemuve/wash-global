import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useServices } from '@/hooks/useServices';
import { useBookingSimple, BookingData } from '@/hooks/useBookingSimple';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const BookingForm = () => {
  const navigate = useNavigate();
  const { categories, services, packages, loading } = useServices();
  const { createBooking, isLoading, error } = useBookingSimple();

  const [formData, setFormData] = useState({
    service_id: '',
    package_id: '',
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    scheduled_date: '',
    scheduled_time: '',
    special_instructions: '',
    // Car detailing fields
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    vehicle_color: '',
    vehicle_type: '',
    license_plate: '',
    parking_details: '',
    vehicle_notes: '',
    water_available: true,
    electricity_available: true,
  });

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const selectedService = services.find(s => s.id === formData.service_id);
  const selectedPackage = packages.find(p => p.id === formData.package_id);
  const isCarDetailing = selectedService?.service_categories?.name === 'Mobile Car Detailing';
  const totalAmount = selectedService && selectedPackage 
    ? selectedService.base_price * selectedPackage.price_multiplier 
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData: BookingData = {
      ...formData,
      vehicle_year: formData.vehicle_year ? parseInt(formData.vehicle_year) : undefined,
      total_amount: totalAmount,
    };

    const result = await createBooking(bookingData);
    if (result.success) {
      navigate('/booking-confirmation', { state: { booking: result.booking } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Book a Service</h1>
        <p className="text-muted-foreground">Fill out the form to schedule your WeWash service</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
                {error}
              </div>
            )}

            {/* Service Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Service *</Label>
                <Select value={formData.service_id} onValueChange={(value) => setFormData({...formData, service_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - TSh {service.base_price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="package">Package *</Label>
                <Select value={formData.package_id} onValueChange={(value) => setFormData({...formData, package_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map(pkg => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} (×{pkg.price_multiplier})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {totalAmount > 0 && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="font-semibold">Total Amount: TSh {totalAmount}</p>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              
              <div>
                <Label htmlFor="customer_name">Full Name *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="customer_phone">Phone Number *</Label>
                <Input
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="customer_address">Address *</Label>
                <Textarea
                  id="customer_address"
                  value={formData.customer_address}
                  onChange={(e) => setFormData({...formData, customer_address: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schedule</h3>
              
              <div>
                <Label htmlFor="scheduled_date">Preferred Date *</Label>
                <Input
                  id="scheduled_date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <Label htmlFor="scheduled_time">Preferred Time *</Label>
                <Select value={formData.scheduled_time} onValueChange={(value) => setFormData({...formData, scheduled_time: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
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
            </div>

            {/* Car Detailing Fields */}
            {isCarDetailing && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vehicle Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicle_make">Vehicle Make</Label>
                    <Input
                      id="vehicle_make"
                      value={formData.vehicle_make}
                      onChange={(e) => setFormData({...formData, vehicle_make: e.target.value})}
                      placeholder="e.g., Toyota"
                    />
                  </div>

                  <div>
                    <Label htmlFor="vehicle_model">Vehicle Model</Label>
                    <Input
                      id="vehicle_model"
                      value={formData.vehicle_model}
                      onChange={(e) => setFormData({...formData, vehicle_model: e.target.value})}
                      placeholder="e.g., Corolla"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicle_year">Year</Label>
                    <Input
                      id="vehicle_year"
                      type="number"
                      value={formData.vehicle_year}
                      onChange={(e) => setFormData({...formData, vehicle_year: e.target.value})}
                      placeholder="e.g., 2020"
                    />
                  </div>

                  <div>
                    <Label htmlFor="vehicle_color">Color</Label>
                    <Input
                      id="vehicle_color"
                      value={formData.vehicle_color}
                      onChange={(e) => setFormData({...formData, vehicle_color: e.target.value})}
                      placeholder="e.g., White"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="license_plate">License Plate</Label>
                  <Input
                    id="license_plate"
                    value={formData.license_plate}
                    onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
                    placeholder="e.g., T123ABC"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="water_available"
                      checked={formData.water_available}
                      onCheckedChange={(checked) => setFormData({...formData, water_available: checked as boolean})}
                    />
                    <Label htmlFor="water_available">Water Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="electricity_available"
                      checked={formData.electricity_available}
                      onCheckedChange={(checked) => setFormData({...formData, electricity_available: checked as boolean})}
                    />
                    <Label htmlFor="electricity_available">Electricity Available</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <Label htmlFor="special_instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="special_instructions"
                value={formData.special_instructions}
                onChange={(e) => setFormData({...formData, special_instructions: e.target.value})}
                placeholder="Any special requirements or notes..."
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !formData.service_id || !formData.package_id || !formData.customer_name || !formData.customer_phone || !formData.customer_address || !formData.scheduled_date || !formData.scheduled_time}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                'Book Service'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;