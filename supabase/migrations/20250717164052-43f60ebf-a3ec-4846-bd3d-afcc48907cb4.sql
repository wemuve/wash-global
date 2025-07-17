-- Allow guest bookings by making user_id nullable in bookings table
ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow guest bookings
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own pending bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON bookings;

-- Create new policies that allow both authenticated and guest bookings
CREATE POLICY "Authenticated users can create their own bookings" 
ON bookings 
FOR INSERT 
WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can view their own bookings" 
ON bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" 
ON bookings 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Users can update their own pending bookings" 
ON bookings 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending'::booking_status);

CREATE POLICY "Admins can manage all bookings" 
ON bookings 
FOR ALL 
USING (is_admin(auth.uid()));