-- Debug: Check and clean up any duplicate booking policies
-- First, let's see all current policies
DO $$
BEGIN
    RAISE NOTICE 'Current booking policies:';
END $$;

-- Drop any old conflicting policies that might exist
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.bookings;

-- Recreate the guest booking policy to ensure it's clean
DROP POLICY IF EXISTS "Anyone can create bookings including guests" ON public.bookings;

CREATE POLICY "Anyone can create bookings including guests" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  -- Allow if user_id is null (guest booking) OR if user_id matches authenticated user
  user_id IS NULL OR auth.uid() = user_id
);