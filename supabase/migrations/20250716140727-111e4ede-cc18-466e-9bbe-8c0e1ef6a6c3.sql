-- Add vehicle information columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN vehicle_make text,
ADD COLUMN vehicle_model text,
ADD COLUMN vehicle_year integer,
ADD COLUMN vehicle_type text,
ADD COLUMN vehicle_color text,
ADD COLUMN license_plate text,
ADD COLUMN vehicle_notes text,
ADD COLUMN parking_details text,
ADD COLUMN water_available boolean DEFAULT true,
ADD COLUMN electricity_available boolean DEFAULT true;

-- Insert Mobile Car Detailing service category
INSERT INTO public.service_categories (name, description, icon) VALUES
('Mobile Car Detailing', 'Professional car detailing services at your location', '🚗');

-- Insert car detailing services
INSERT INTO public.services (name, description, category_id, base_price, duration_hours) VALUES
('Exterior Wash & Wax', 'Complete exterior wash with premium wax protection', 
 (SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 
 150.00, 3),
('Interior Deep Clean', 'Thorough interior cleaning including seats, carpets, and dashboard', 
 (SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 
 200.00, 4),
('Full Service Detail', 'Complete interior and exterior detailing package', 
 (SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 
 350.00, 6),
('Paint Protection', 'Professional paint protection and ceramic coating application', 
 (SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 
 500.00, 8),
('Engine Bay Cleaning', 'Professional engine bay degreasing and cleaning', 
 (SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 
 100.00, 2),
('Headlight Restoration', 'Restore cloudy and yellowed headlights to like-new condition', 
 (SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 
 80.00, 2),
('Scratch Removal', 'Professional scratch removal and paint touch-up services', 
 (SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 
 250.00, 4),
('Premium Ceramic Coating', 'Long-lasting ceramic coating for ultimate paint protection', 
 (SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 
 800.00, 8);

-- Add new package tiers for car detailing with vehicle size considerations
INSERT INTO public.package_tiers (name, description, type, price_multiplier, features) VALUES
('Small Vehicle Package', 'For compact cars, sedans, and hatchbacks', 'standard', 1.00, ARRAY['Standard pricing', 'Quick service', 'Suitable for small vehicles']),
('Medium Vehicle Package', 'For SUVs, crossovers, and mid-size vehicles', 'premium', 1.3, ARRAY['Medium vehicle pricing', 'Extended service time', 'Suitable for SUVs and crossovers']),
('Large Vehicle Package', 'For trucks, large SUVs, and commercial vehicles', 'vip', 1.6, ARRAY['Large vehicle pricing', 'Extended service time', 'Suitable for trucks and large vehicles']);

-- Create index for better performance on vehicle searches
CREATE INDEX idx_bookings_vehicle_info ON public.bookings(vehicle_make, vehicle_model, vehicle_year);

-- Add comments to document the vehicle information columns
COMMENT ON COLUMN public.bookings.vehicle_make IS 'Vehicle manufacturer (e.g., Toyota, BMW)';
COMMENT ON COLUMN public.bookings.vehicle_model IS 'Vehicle model (e.g., Camry, X5)';
COMMENT ON COLUMN public.bookings.vehicle_year IS 'Year of manufacture';
COMMENT ON COLUMN public.bookings.vehicle_type IS 'Type of vehicle (sedan, SUV, hatchback, truck, etc.)';
COMMENT ON COLUMN public.bookings.vehicle_color IS 'Vehicle color';
COMMENT ON COLUMN public.bookings.license_plate IS 'Vehicle registration/license plate number';
COMMENT ON COLUMN public.bookings.vehicle_notes IS 'Special notes about vehicle condition or requirements';
COMMENT ON COLUMN public.bookings.parking_details IS 'Parking location and access instructions';
COMMENT ON COLUMN public.bookings.water_available IS 'Whether water source is available at location';
COMMENT ON COLUMN public.bookings.electricity_available IS 'Whether electricity is available at location';