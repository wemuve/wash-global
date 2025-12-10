-- Fix Security Definer View warning
-- Change vendors_public view to use SECURITY INVOKER (respects querying user's permissions)
ALTER VIEW public.vendors_public SET (security_invoker = on);