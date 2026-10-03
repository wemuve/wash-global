ALTER FUNCTION public.enforce_booking_integrity() SECURITY INVOKER;
ALTER FUNCTION public.protect_vendor_privileged_fields() SECURITY INVOKER;
REVOKE EXECUTE ON FUNCTION public.enforce_booking_integrity() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_vendor_privileged_fields() FROM PUBLIC, anon, authenticated;