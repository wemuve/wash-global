-- Clean up and fix RLS policies for booking system

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own pending bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;

-- Create simplified, working RLS policies
-- Allow anyone (guest or authenticated) to create bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  -- Guest bookings: user_id is null
  user_id IS NULL 
  OR 
  -- Authenticated bookings: user_id matches current user
  auth.uid() = user_id
);

-- Allow users to view their own bookings, guests cannot view (since they have no user_id)
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (
  auth.uid() = user_id
);

-- Allow users to update their own pending bookings
CREATE POLICY "Users can update their own pending bookings" 
ON public.bookings 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  AND status = 'pending'
);

-- Admin policies (unchanged)
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL 
USING (is_admin(auth.uid()));

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;