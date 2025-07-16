-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('client', 'admin');

-- Create enum for package types
CREATE TYPE public.package_type AS ENUM ('standard', 'premium', 'vip');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service categories table
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  duration_hours INTEGER NOT NULL DEFAULT 2,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create package tiers table
CREATE TABLE public.package_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type package_type NOT NULL,
  description TEXT,
  price_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  features TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  package_id UUID REFERENCES public.package_tiers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  special_instructions TEXT,
  assigned_team TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking status history for audit trail
CREATE TABLE public.booking_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  old_status booking_status,
  new_status booking_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = $1 AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to track booking status changes
CREATE OR REPLACE FUNCTION public.track_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.booking_status_history (booking_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for booking status tracking
CREATE TRIGGER track_booking_status_updates
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.track_booking_status_change();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for service_categories (public read, admin write)
CREATE POLICY "Anyone can view service categories" ON public.service_categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage service categories" ON public.service_categories
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for services (public read, admin write)
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Admins can view all services" ON public.services
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for package_tiers (public read, admin write)
CREATE POLICY "Anyone can view active packages" ON public.package_tiers
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Admins can view all packages" ON public.package_tiers
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage packages" ON public.package_tiers
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for booking_status_history
CREATE POLICY "Users can view history of their bookings" ON public.booking_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all booking history" ON public.booking_status_history
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert status history" ON public.booking_status_history
  FOR INSERT WITH CHECK (true);

-- Insert initial service categories
INSERT INTO public.service_categories (name, description, icon) VALUES
('Laundry Services', 'Professional washing and cleaning services', '👕'),
('Dry Cleaning', 'Specialized dry cleaning for delicate items', '🧥'),
('Ironing & Pressing', 'Professional ironing and garment pressing', '👔'),
('Pickup & Delivery', 'Convenient pickup and delivery services', '🚚');

-- Insert initial services
INSERT INTO public.services (category_id, name, description, base_price, duration_hours) VALUES
((SELECT id FROM public.service_categories WHERE name = 'Laundry Services'), 'Standard Wash & Fold', 'Regular washing, drying, and folding service', 25.00, 2),
((SELECT id FROM public.service_categories WHERE name = 'Laundry Services'), 'Delicate Care Wash', 'Gentle washing for delicate fabrics', 35.00, 3),
((SELECT id FROM public.service_categories WHERE name = 'Dry Cleaning'), 'Suit Cleaning', 'Professional dry cleaning for suits', 45.00, 24),
((SELECT id FROM public.service_categories WHERE name = 'Dry Cleaning'), 'Dress Cleaning', 'Specialized cleaning for dresses and formal wear', 40.00, 24),
((SELECT id FROM public.service_categories WHERE name = 'Ironing & Pressing'), 'Shirt Pressing', 'Professional shirt ironing and pressing', 15.00, 1),
((SELECT id FROM public.service_categories WHERE name = 'Pickup & Delivery'), 'Same Day Service', 'Express pickup and delivery within 24 hours', 20.00, 24);

-- Insert package tiers
INSERT INTO public.package_tiers (name, type, description, price_multiplier, features) VALUES
('Standard Package', 'standard', 'Basic service with quality guarantee', 1.00, ARRAY['Quality washing', 'Standard delivery', 'Basic customer support']),
('Premium Package', 'premium', 'Enhanced service with faster delivery', 1.30, ARRAY['Priority processing', 'Faster delivery', 'Premium detergents', 'Dedicated support']),
('VIP Package', 'vip', 'Luxury service with premium care', 1.60, ARRAY['Express processing', 'Same-day delivery', 'Luxury detergents', 'White-glove service', '24/7 support']);