-- Fix bookings table RLS policy - restrict to authenticated users
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

-- Users can only view their own bookings (when logged in)
CREATE POLICY "Users can view own bookings" 
ON public.bookings 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin') 
  OR has_role(auth.uid(), 'manager')
);

-- Allow authenticated users to update their own bookings
CREATE POLICY "Users can update own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Allow admins to delete bookings
CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
USING (has_role(auth.uid(), 'admin'));