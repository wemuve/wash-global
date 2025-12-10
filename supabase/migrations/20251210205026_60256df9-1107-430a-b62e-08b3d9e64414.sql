-- Drop existing policies on profiles that may allow anonymous access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create new stricter policies for profiles - explicitly require authentication
CREATE POLICY "Authenticated users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Drop existing policies on bookings
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

-- Create new stricter policies for bookings
-- Allow public booking creation (for non-logged-in customers) but require essential fields
CREATE POLICY "Public can create bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  customer_name IS NOT NULL 
  AND customer_phone IS NOT NULL 
  AND customer_address IS NOT NULL
);

-- Only authenticated users can view their own bookings, or admins/managers can view all
CREATE POLICY "Authenticated users can view own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'manager'::app_role)
);

-- Only authenticated users can update their own bookings
CREATE POLICY "Authenticated users can update own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'manager'::app_role)
);

-- Only admins can delete bookings
CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));