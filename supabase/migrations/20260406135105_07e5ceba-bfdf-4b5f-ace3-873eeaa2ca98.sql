CREATE OR REPLACE FUNCTION public.get_referral_code_owner(code_to_check text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id FROM public.referral_codes
  WHERE code = code_to_check AND is_active = true
  LIMIT 1
$$;