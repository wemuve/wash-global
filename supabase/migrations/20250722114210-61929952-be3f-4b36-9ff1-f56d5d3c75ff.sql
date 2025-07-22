-- Drop the overly restrictive booking policy that's preventing guest bookings
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create a more permissive policy for booking creation that allows guest bookings
CREATE POLICY "Anyone can create bookings including guests" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  -- Allow if user_id is null (guest booking) OR if user_id matches authenticated user
  user_id IS NULL OR auth.uid() = user_id
);