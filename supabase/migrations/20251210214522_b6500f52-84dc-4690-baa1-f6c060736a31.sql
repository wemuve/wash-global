-- Fix bookings SELECT policy to ensure only booking owners can view their own data
-- Drop the existing policy
DROP POLICY IF EXISTS "Authenticated users can view own bookings" ON public.bookings;

-- Create a stricter policy that ensures:
-- 1. Users can only see bookings where they are the owner (user_id matches)
-- 2. Admins/managers can see all bookings
-- 3. Vendors can only see bookings assigned to them via job_assignments
CREATE POLICY "Users can view own bookings or assigned"
ON public.bookings
FOR SELECT
USING (
  -- Must be authenticated
  auth.uid() IS NOT NULL
  AND (
    -- User owns this booking
    (user_id IS NOT NULL AND auth.uid() = user_id)
    -- OR user is admin/manager
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'manager'::app_role)
    -- OR user is a vendor assigned to this booking
    OR EXISTS (
      SELECT 1 FROM job_assignments ja
      JOIN vendors v ON ja.vendor_id = v.id
      WHERE ja.booking_id = bookings.id
      AND v.user_id = auth.uid()
    )
  )
);