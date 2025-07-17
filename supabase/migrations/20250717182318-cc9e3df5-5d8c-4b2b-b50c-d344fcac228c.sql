-- Add missing service categories
INSERT INTO public.service_categories (name, description, icon) VALUES 
('Carpet & Sofa Cleaning', 'Professional carpet and upholstery cleaning services', 'armchair'),
('Trainee Maids', 'Onboarding services for professional maid training', 'user-check');

-- Get the new category IDs for reference
-- We'll need to update services with the new pricing structure

-- First, let's update existing services with new pricing based on the provided list

-- Home Cleaning Services (update existing Cleaning Services)
UPDATE public.services SET 
  name = 'General Cleaning (2 rooms)',
  base_price = 650.00,
  description = 'General cleaning service for 2-room homes'
WHERE name = 'Residential Cleaning';

UPDATE public.services SET 
  base_price = 950.00,
  description = 'Thorough deep cleaning service for homes and offices'
WHERE name = 'Deep Cleaning';

UPDATE public.services SET 
  base_price = 1200.00,
  description = 'Specialized cleaning after construction or renovation'
WHERE name = 'Post-Construction Cleaning';

UPDATE public.services SET 
  base_price = 1200.00,
  description = 'Professional office and workspace cleaning'
WHERE name = 'Office Cleaning';

-- Car Detailing Services - clear existing and add new structured pricing
DELETE FROM public.services WHERE category_id = (SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing');

INSERT INTO public.services (category_id, name, description, base_price, duration_hours) VALUES
((SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 'Small Car (Vitz, Corolla)', 'Professional detailing for small vehicles', 450.00, 2),
((SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 'Big Car (Alphard, Noah)', 'Professional detailing for large vehicles', 550.00, 3),
((SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 'SUV & Canta', 'Professional detailing for SUVs and utility vehicles', 750.00, 4);

-- Update Fumigation Services pricing
UPDATE public.services SET 
  base_price = 250.00,
  description = 'Professional pest control and fumigation services'
WHERE name = 'Residential Fumigation';

UPDATE public.services SET 
  base_price = 300.00,
  description = 'Professional fumigation services for businesses'
WHERE name = 'Commercial Fumigation';

UPDATE public.services SET 
  base_price = 350.00,
  description = 'Specialized termite control and prevention'
WHERE name = 'Termite Treatment';

-- Update Window Polishing pricing
UPDATE public.services SET 
  base_price = 350.00,
  description = 'Professional window cleaning for homes'
WHERE name = 'Residential Window Cleaning';

UPDATE public.services SET 
  base_price = 400.00,
  description = 'Professional window cleaning for office buildings'
WHERE name = 'Commercial Window Cleaning';

UPDATE public.services SET 
  base_price = 500.00,
  description = 'Specialized high-rise window cleaning service'
WHERE name = 'High-Rise Window Cleaning';

-- Add Facility Management service
INSERT INTO public.services (category_id, name, description, base_price, duration_hours) VALUES
((SELECT id FROM service_categories WHERE name = 'Facility Management'), 'Facility Management', 'Complete building maintenance and property management solutions', 1500.00, 8);

-- Add new Carpet & Sofa Cleaning services
INSERT INTO public.services (category_id, name, description, base_price, duration_hours) VALUES
((SELECT id FROM service_categories WHERE name = 'Carpet & Sofa Cleaning'), 'Carpet Cleaning', 'Professional carpet cleaning services', 300.00, 2),
((SELECT id FROM service_categories WHERE name = 'Carpet & Sofa Cleaning'), 'Sofa Cleaning', 'Professional upholstery cleaning services', 350.00, 2);

-- Add new Trainee Maids services
INSERT INTO public.services (category_id, name, description, base_price, duration_hours) VALUES
((SELECT id FROM service_categories WHERE name = 'Trainee Maids'), 'Maid Training Program', 'Professional maid onboarding and training services', 650.00, 4),
((SELECT id FROM service_categories WHERE name = 'Trainee Maids'), 'Live-in Maid Service', 'Trained live-in domestic assistance', 800.00, 8);