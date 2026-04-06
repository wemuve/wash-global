-- Fix referrals INSERT policy: restrict to authenticated users and enforce referrer_id = auth.uid()
DROP POLICY IF EXISTS "Anyone can create referrals" ON public.referrals;
CREATE POLICY "Authenticated users can create own referrals"
  ON public.referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = referrer_id);

-- Fix referral_codes: remove public enumeration of active codes, replace with RPC validation
DROP POLICY IF EXISTS "Anyone can view active referral codes for validation" ON public.referral_codes;

-- Create a secure RPC for code validation instead of exposing the table
CREATE OR REPLACE FUNCTION public.validate_referral_code(code_to_check text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.referral_codes
    WHERE code = code_to_check AND is_active = true
  )
$$;