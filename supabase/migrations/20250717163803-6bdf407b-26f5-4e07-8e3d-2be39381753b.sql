-- Remove existing services and categories that aren't offered
DELETE FROM services;
DELETE FROM service_categories;

-- Insert the new service categories that we actually offer
INSERT INTO service_categories (name, description, icon) VALUES
('Cleaning Services', 'Professional residential and commercial cleaning services', 'cleaning'),
('Fumigation Services', 'Pest control and fumigation services for homes and businesses', 'bug-spray'),
('Mobile Car Detailing', 'Professional car cleaning and detailing at your location', 'car'),
('Window Polishing', 'Professional window cleaning and polishing services', 'window'),
('Facility Management', 'Comprehensive facility management and maintenance services', 'building');

-- Insert the specific services we offer
INSERT INTO services (category_id, name, description, base_price, duration_hours) VALUES
-- Cleaning Services
((SELECT id FROM service_categories WHERE name = 'Cleaning Services'), 'Residential Cleaning', 'Complete home cleaning service including all rooms', 150.00, 3),
((SELECT id FROM service_categories WHERE name = 'Cleaning Services'), 'Office Cleaning', 'Professional office and workspace cleaning', 200.00, 2),
((SELECT id FROM service_categories WHERE name = 'Cleaning Services'), 'Deep Cleaning', 'Thorough deep cleaning service for homes and offices', 300.00, 5),
((SELECT id FROM service_categories WHERE name = 'Cleaning Services'), 'Post-Construction Cleaning', 'Specialized cleaning after construction or renovation', 400.00, 6),

-- Fumigation Services
((SELECT id FROM service_categories WHERE name = 'Fumigation Services'), 'Residential Fumigation', 'Complete pest control and fumigation for homes', 250.00, 4),
((SELECT id FROM service_categories WHERE name = 'Fumigation Services'), 'Commercial Fumigation', 'Professional fumigation services for businesses', 500.00, 6),
((SELECT id FROM service_categories WHERE name = 'Fumigation Services'), 'Termite Treatment', 'Specialized termite control and prevention', 350.00, 5),

-- Mobile Car Detailing (keeping existing ones that are relevant)
((SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 'Exterior Wash & Wax', 'Complete exterior wash with premium wax protection', 150.00, 2),
((SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 'Interior Deep Clean', 'Thorough interior cleaning including seats, carpets, and dashboard', 200.00, 3),
((SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 'Full Service Detail', 'Complete interior and exterior detailing package', 350.00, 4),
((SELECT id FROM service_categories WHERE name = 'Mobile Car Detailing'), 'Engine Bay Cleaning', 'Professional engine bay degreasing and cleaning', 100.00, 1),

-- Window Polishing
((SELECT id FROM service_categories WHERE name = 'Window Polishing'), 'Residential Window Cleaning', 'Professional window cleaning for homes', 80.00, 2),
((SELECT id FROM service_categories WHERE name = 'Window Polishing'), 'Commercial Window Cleaning', 'Professional window cleaning for office buildings', 150.00, 3),
((SELECT id FROM service_categories WHERE name = 'Window Polishing'), 'High-Rise Window Cleaning', 'Specialized high-rise window cleaning service', 300.00, 5);

-- Note: Facility Management will redirect to WhatsApp, so no specific services needed