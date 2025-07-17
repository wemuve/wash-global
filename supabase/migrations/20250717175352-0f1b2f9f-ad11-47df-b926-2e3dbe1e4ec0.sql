-- Update RLS policies to allow public access to services data for guest bookings

-- Drop existing restrictive policies for service_categories
DROP POLICY IF EXISTS "Anyone can view service categories" ON service_categories;

-- Create new public policy for service_categories
CREATE POLICY "Public can view service categories" 
ON service_categories 
FOR SELECT 
TO public
USING (true);

-- Drop existing restrictive policies for services
DROP POLICY IF EXISTS "Anyone can view active services" ON services;

-- Create new public policy for services
CREATE POLICY "Public can view active services" 
ON services 
FOR SELECT 
TO public
USING (is_active = true);

-- Drop existing restrictive policies for package_tiers
DROP POLICY IF EXISTS "Anyone can view active packages" ON package_tiers;

-- Create new public policy for package_tiers
CREATE POLICY "Public can view active packages" 
ON package_tiers 
FOR SELECT 
TO public
USING (is_active = true);