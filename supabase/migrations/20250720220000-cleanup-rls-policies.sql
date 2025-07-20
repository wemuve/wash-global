
-- Clean up and fix RLS policies for better guest/authenticated user handling

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;

-- Create a simpler, more reliable policy for booking creation
CREATE POLICY "Anyone can create bookings" 
ON bookings 
FOR INSERT 
WITH CHECK (
  -- Allow guest bookings (no auth required)
  (auth.uid() IS NULL AND user_id IS NULL) OR 
  -- Allow authenticated users to create bookings for themselves
  (auth.uid() IS NOT NULL AND (user_id IS NULL OR auth.uid() = user_id))
);

-- Ensure the select policy works for both cases
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view appropriate bookings" 
ON bookings 
FOR SELECT 
USING (
  -- Admins can see all bookings
  is_admin(auth.uid()) OR
  -- Users can see their own bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Allow viewing of guest bookings by the system (for webhook processing)
  (user_id IS NULL)
);
