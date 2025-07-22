-- Let's create a more explicit policy for guest bookings
DROP POLICY IF EXISTS "Anyone can create bookings including guests" ON public.bookings;

-- Create separate policies for clarity
CREATE POLICY "Guests can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (user_id IS NULL);

CREATE POLICY "Authenticated users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- Test the policy with a simple insert to debug
-- INSERT INTO public.bookings (
--   service_id, package_id, customer_name, customer_phone, 
--   customer_address, scheduled_date, scheduled_time, total_amount, user_id
-- ) VALUES (
--   'cf58ee0d-bb5f-422f-bc81-02a718df8fbd',
--   '44a10881-b06d-4e20-a7b8-0f8080a0b416',
--   'Test User',
--   '+1234567890',
--   'Test Address',
--   '2025-07-30',
--   '12:00:00',
--   1040,
--   NULL
-- );