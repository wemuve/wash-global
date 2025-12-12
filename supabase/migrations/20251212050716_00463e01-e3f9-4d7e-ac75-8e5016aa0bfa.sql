-- Drop the overly permissive policy that allows anyone to view vendor data
DROP POLICY IF EXISTS "Anyone can view active vendors public info" ON public.vendors;

-- Create a new policy that only allows authenticated users to view active vendors
-- This prevents anonymous access to sensitive data like bank_details
CREATE POLICY "Authenticated users can view active vendors" 
ON public.vendors 
FOR SELECT 
USING (is_active = true AND auth.uid() IS NOT NULL);

-- Add a policy for vendors to view their own full record (including their own bank details)
CREATE POLICY "Vendors can view own record" 
ON public.vendors 
FOR SELECT 
USING (user_id = auth.uid());