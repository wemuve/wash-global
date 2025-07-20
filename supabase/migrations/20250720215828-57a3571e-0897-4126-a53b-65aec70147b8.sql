
-- Fix the RLS policy for guest bookings
DROP POLICY IF EXISTS "Authenticated users can create their own bookings" ON bookings;

-- Create a new policy with correct NULL handling for guest bookings
CREATE POLICY "Users can create bookings" 
ON bookings 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL) OR  -- Guest bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)  -- Authenticated user bookings
);
