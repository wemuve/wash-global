-- Phase 1: Fix Database Function Security (HIGH PRIORITY)
-- Update all functions to include proper search_path to prevent schema injection attacks

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = $1 AND role = 'admin'
  );
$function$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix track_booking_status_change function
CREATE OR REPLACE FUNCTION public.track_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.booking_status_history (booking_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'client'::public.user_role)
  );
  RETURN NEW;
END;
$function$;

-- Phase 2: Role Security Enhancement (MEDIUM PRIORITY)
-- Add role protection to prevent users from escalating their own roles

-- Create function to validate role changes
CREATE OR REPLACE FUNCTION public.validate_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Prevent users from changing their own role
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Only allow role changes if the current user is an admin and not changing their own role
    IF NOT (
      public.is_admin(auth.uid()) AND 
      auth.uid() != NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Unauthorized role change attempt';
    END IF;
    
    -- Log role changes for audit trail
    INSERT INTO public.booking_status_history (booking_id, old_status, new_status, changed_by, notes)
    VALUES (
      gen_random_uuid(), -- Use a dummy booking_id for role changes
      OLD.role::text,
      NEW.role::text,
      auth.uid(),
      'Role change for user: ' || NEW.user_id::text
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for role validation
DROP TRIGGER IF EXISTS validate_profile_role_change ON public.profiles;
CREATE TRIGGER validate_profile_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_change();

-- Phase 3: Booking Security Enhancement (MEDIUM PRIORITY)
-- Add validation for booking status transitions

-- Create function to validate booking status changes
CREATE OR REPLACE FUNCTION public.validate_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only allow certain status transitions
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Define valid status transitions
    CASE OLD.status
      WHEN 'pending' THEN
        IF NEW.status NOT IN ('confirmed', 'cancelled') THEN
          RAISE EXCEPTION 'Invalid status transition from pending to %', NEW.status;
        END IF;
      WHEN 'confirmed' THEN
        IF NEW.status NOT IN ('in_progress', 'cancelled') THEN
          RAISE EXCEPTION 'Invalid status transition from confirmed to %', NEW.status;
        END IF;
      WHEN 'in_progress' THEN
        IF NEW.status NOT IN ('completed', 'cancelled') THEN
          RAISE EXCEPTION 'Invalid status transition from in_progress to %', NEW.status;
        END IF;
      WHEN 'completed' THEN
        -- Completed bookings cannot be changed except by admins
        IF NOT public.is_admin(auth.uid()) THEN
          RAISE EXCEPTION 'Cannot modify completed bookings';
        END IF;
      WHEN 'cancelled' THEN
        -- Cancelled bookings cannot be changed except by admins
        IF NOT public.is_admin(auth.uid()) THEN
          RAISE EXCEPTION 'Cannot modify cancelled bookings';
        END IF;
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for booking status validation
DROP TRIGGER IF EXISTS validate_booking_status ON public.bookings;
CREATE TRIGGER validate_booking_status
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_booking_status_change();

-- Ensure existing triggers are properly configured
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS track_booking_status_changes ON public.bookings;
CREATE TRIGGER track_booking_status_changes
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.track_booking_status_change();