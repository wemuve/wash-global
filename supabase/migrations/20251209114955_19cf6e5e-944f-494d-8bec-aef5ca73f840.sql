-- Create service_categories table
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Sparkles',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create package_tiers table
CREATE TABLE public.package_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('standard', 'premium', 'vip')),
  description TEXT,
  price_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_hours DECIMAL(4,2) DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table for guest bookings (no auth required)
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- nullable for guest bookings
  service_id UUID REFERENCES public.services(id),
  package_id UUID REFERENCES public.package_tiers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  -- Vehicle details for car detailing
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_color TEXT,
  vehicle_type TEXT,
  license_plate TEXT,
  parking_details TEXT,
  vehicle_notes TEXT,
  water_available BOOLEAN,
  electricity_available BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for service data (needed for displaying services)
CREATE POLICY "Anyone can view service categories" 
ON public.service_categories FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view package tiers" 
ON public.package_tiers FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view active services" 
ON public.services FOR SELECT 
USING (true);

-- Allow anyone to create bookings (guest checkout)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (true);

-- Bookings can only be viewed by the owner or if no user_id (admin access would be added later)
CREATE POLICY "Users can view own bookings" 
ON public.bookings FOR SELECT 
USING (user_id IS NULL OR auth.uid() = user_id);

-- Insert sample service categories
INSERT INTO public.service_categories (name, description, icon) VALUES
('Home Cleaning', 'Professional home cleaning services', 'Home'),
('Car Detailing', 'Mobile car wash and detailing services', 'Car'),
('Fumigation', 'Pest control and fumigation services', 'Bug'),
('Carpet & Sofa', 'Deep cleaning for carpets and upholstery', 'Sofa'),
('Window Polishing', 'Professional window cleaning services', 'Square'),
('Facility Management', 'Commercial facility management', 'Building'),
('Office Cleaning', 'Commercial office cleaning services', 'Building2'),
('Trainee Maids', 'Maid onboarding and training services', 'Users');

-- Insert sample package tiers
INSERT INTO public.package_tiers (name, type, description, price_multiplier, features, is_active) VALUES
('Standard', 'standard', 'Our basic service package', 1.00, '["Basic cleaning", "Standard equipment"]', true),
('Premium', 'premium', 'Enhanced service with extras', 1.50, '["Deep cleaning", "Premium products", "Priority scheduling"]', true),
('VIP', 'vip', 'Our top-tier service experience', 2.00, '["White-glove service", "Premium products", "Priority scheduling", "Dedicated team", "Quality guarantee"]', true);

-- Insert sample services
INSERT INTO public.services (category_id, name, description, base_price, duration_hours, is_active)
SELECT 
  sc.id,
  s.name,
  s.description,
  s.base_price,
  s.duration_hours,
  true
FROM public.service_categories sc
CROSS JOIN LATERAL (
  VALUES 
    ('General Cleaning (2 rooms)', 'Basic room cleaning', 650, 2),
    ('Deep Cleaning', 'Thorough deep cleaning', 950, 4),
    ('Post-Construction Cleaning', 'Cleanup after construction', 1200, 6)
) AS s(name, description, base_price, duration_hours)
WHERE sc.name = 'Home Cleaning';

-- Insert car detailing services
INSERT INTO public.services (category_id, name, description, base_price, duration_hours, is_active)
SELECT 
  sc.id,
  s.name,
  s.description,
  s.base_price,
  s.duration_hours,
  true
FROM public.service_categories sc
CROSS JOIN LATERAL (
  VALUES 
    ('Small Car (e.g. Vitz, Corolla)', 'Mobile detailing for small vehicles', 450, 2),
    ('Big Car (e.g. Alphard, Noah)', 'Mobile detailing for larger vehicles', 550, 3),
    ('SUV & Canta', 'Mobile detailing for SUVs', 750, 4)
) AS s(name, description, base_price, duration_hours)
WHERE sc.name = 'Car Detailing';

-- Insert other services
INSERT INTO public.services (category_id, name, description, base_price, duration_hours, is_active)
SELECT sc.id, 'Fumigation Service', 'Professional fumigation', 250, 2, true
FROM public.service_categories sc WHERE sc.name = 'Fumigation';

INSERT INTO public.services (category_id, name, description, base_price, duration_hours, is_active)
SELECT sc.id, 'Carpet & Sofa Cleaning', 'Deep cleaning service', 300, 3, true
FROM public.service_categories sc WHERE sc.name = 'Carpet & Sofa';

INSERT INTO public.services (category_id, name, description, base_price, duration_hours, is_active)
SELECT sc.id, 'Window Polishing', 'Professional window cleaning', 350, 2, true
FROM public.service_categories sc WHERE sc.name = 'Window Polishing';

INSERT INTO public.services (category_id, name, description, base_price, duration_hours, is_active)
SELECT sc.id, 'Facility Management', 'Complete facility management', 1500, 8, true
FROM public.service_categories sc WHERE sc.name = 'Facility Management';

INSERT INTO public.services (category_id, name, description, base_price, duration_hours, is_active)
SELECT sc.id, 'Office Cleaning', 'Commercial office cleaning', 1200, 4, true
FROM public.service_categories sc WHERE sc.name = 'Office Cleaning';

INSERT INTO public.services (category_id, name, description, base_price, duration_hours, is_active)
SELECT sc.id, 'Trainee Maid Onboarding', 'Maid training and placement', 650, 8, true
FROM public.service_categories sc WHERE sc.name = 'Trainee Maids';