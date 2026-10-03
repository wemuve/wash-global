-- Bookings: price and status for non-staff are controlled server-side
CREATE OR REPLACE FUNCTION public.enforce_booking_integrity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_min numeric;
  v_is_staff boolean := auth.uid() IS NOT NULL AND (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
BEGIN
  IF current_user NOT IN ('anon','authenticated') OR v_is_staff THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
    NEW.discount_amount := 0;
    IF NEW.service_id IS NOT NULL THEN
      SELECT s.base_price * COALESCE((SELECT p.price_multiplier FROM package_tiers p WHERE p.id = NEW.package_id AND p.is_active), 1)
        INTO v_min FROM services s WHERE s.id = NEW.service_id AND s.is_active;
      IF v_min IS NULL THEN RAISE EXCEPTION 'Unknown service'; END IF;
      IF NEW.total_amount IS NULL OR NEW.total_amount < v_min THEN NEW.total_amount := v_min; END IF;
    END IF;
    IF NEW.total_amount IS NULL OR NEW.total_amount < 0 OR NEW.total_amount > 100000 THEN
      RAISE EXCEPTION 'Invalid booking amount';
    END IF;
  ELSE
    NEW.total_amount := OLD.total_amount;
    NEW.discount_amount := OLD.discount_amount;
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled' THEN
      NEW.status := OLD.status;
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS enforce_booking_integrity ON public.bookings;
CREATE TRIGGER enforce_booking_integrity BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_integrity();

-- Vendors: workers cannot change their own status, tier or performance fields
CREATE OR REPLACE FUNCTION public.protect_vendor_privileged_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF current_user NOT IN ('anon','authenticated') OR has_role(auth.uid(),'admin') THEN
    RETURN NEW;
  END IF;
  NEW.is_active := OLD.is_active;
  NEW.is_verified := OLD.is_verified;
  NEW.onboarding_status := OLD.onboarding_status;
  NEW.tier := OLD.tier;
  NEW.commission_rate := OLD.commission_rate;
  NEW.id_verified := OLD.id_verified;
  NEW.quiz_passed := OLD.quiz_passed;
  NEW.quiz_passed_at := OLD.quiz_passed_at;
  NEW.training_completed := OLD.training_completed;
  NEW.training_completed_at := OLD.training_completed_at;
  NEW.rating := OLD.rating;
  NEW.avg_rating := OLD.avg_rating;
  NEW.total_reviews := OLD.total_reviews;
  NEW.total_jobs := OLD.total_jobs;
  NEW.total_completed_jobs := OLD.total_completed_jobs;
  NEW.completion_rate := OLD.completion_rate;
  NEW.punctuality_score := OLD.punctuality_score;
  NEW.complaint_count := OLD.complaint_count;
  NEW.serious_complaint_count := OLD.serious_complaint_count;
  NEW.repeat_booking_rate := OLD.repeat_booking_rate;
  NEW.suspension_reason := OLD.suspension_reason;
  NEW.suspended_at := OLD.suspended_at;
  NEW.user_id := OLD.user_id;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS protect_vendor_privileged_fields ON public.vendors;
CREATE TRIGGER protect_vendor_privileged_fields BEFORE UPDATE ON public.vendors
FOR EACH ROW EXECUTE FUNCTION public.protect_vendor_privileged_fields();

DROP POLICY IF EXISTS "Vendors can update own profile" ON public.vendors;
CREATE POLICY "Vendors can update own profile" ON public.vendors
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Leads: open submissions, but only well-formed new leads
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
CREATE POLICY "Anyone can create leads" ON public.leads
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND assigned_to IS NULL AND booking_id IS NULL AND converted_at IS NULL
  AND length(customer_name) BETWEEN 2 AND 100
  AND length(customer_phone) BETWEEN 7 AND 20
  AND (message IS NULL OR length(message) <= 2000)
);

-- Catalogue: only active rows are public
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Anyone can view package tiers" ON public.package_tiers;
CREATE POLICY "Anyone can view package tiers" ON public.package_tiers FOR SELECT USING (is_active = true);