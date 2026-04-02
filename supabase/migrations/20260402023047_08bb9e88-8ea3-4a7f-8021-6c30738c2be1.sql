
-- Create worker tier enum
CREATE TYPE public.worker_tier AS ENUM ('bronze', 'silver', 'gold', 'elite');
CREATE TYPE public.onboarding_status AS ENUM ('pending', 'training', 'quiz', 'active', 'suspended', 'removed');
CREATE TYPE public.complaint_severity AS ENUM ('minor', 'major');
CREATE TYPE public.subscription_frequency AS ENUM ('weekly', 'biweekly', 'monthly');
CREATE TYPE public.subscription_status AS ENUM ('active', 'paused', 'cancelled');
CREATE TYPE public.job_offer_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- Extend vendors table with tier/performance/onboarding fields
ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS tier worker_tier DEFAULT 'bronze',
  ADD COLUMN IF NOT EXISTS onboarding_status onboarding_status DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS training_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS training_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS quiz_passed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS quiz_passed_at timestamptz,
  ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS id_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS id_document_url text,
  ADD COLUMN IF NOT EXISTS avg_rating numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completion_rate numeric DEFAULT 100,
  ADD COLUMN IF NOT EXISTS punctuality_score numeric DEFAULT 100,
  ADD COLUMN IF NOT EXISTS complaint_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS serious_complaint_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS repeat_booking_rate numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_completed_jobs integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS suspension_reason text,
  ADD COLUMN IF NOT EXISTS suspended_at timestamptz,
  ADD COLUMN IF NOT EXISTS location_lat numeric,
  ADD COLUMN IF NOT EXISTS location_lng numeric;

-- Training modules table
CREATE TABLE public.training_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_type text NOT NULL DEFAULT 'video',
  content_url text,
  duration_minutes integer DEFAULT 10,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  quiz_questions jsonb DEFAULT '[]'::jsonb,
  passing_score integer DEFAULT 70,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active training modules" ON public.training_modules
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Admins can manage training modules" ON public.training_modules
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

-- Worker training progress
CREATE TABLE public.training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES public.training_modules(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  quiz_score integer,
  quiz_attempts integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, module_id)
);

ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own training progress" ON public.training_progress
  FOR SELECT TO public USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Vendors can update own training progress" ON public.training_progress
  FOR INSERT TO public WITH CHECK (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Vendors can modify own progress" ON public.training_progress
  FOR UPDATE TO public USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage training progress" ON public.training_progress
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

-- Service checklists
CREATE TABLE public.service_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  checklist_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  expected_duration_minutes integer,
  required_tools jsonb DEFAULT '[]'::jsonb,
  quality_checkpoints jsonb DEFAULT '[]'::jsonb,
  requires_before_photos boolean DEFAULT false,
  requires_after_photos boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active checklists" ON public.service_checklists
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Admins can manage checklists" ON public.service_checklists
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

-- Job checklist completions
CREATE TABLE public.job_checklist_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.job_assignments(id) ON DELETE CASCADE,
  checklist_id uuid NOT NULL REFERENCES public.service_checklists(id),
  completed_items jsonb DEFAULT '[]'::jsonb,
  completion_percentage numeric DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_checklist_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage own completions" ON public.job_checklist_completions
  FOR ALL TO public USING (
    assignment_id IN (
      SELECT ja.id FROM job_assignments ja
      JOIN vendors v ON ja.vendor_id = v.id
      WHERE v.user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin')
  );

-- Worker complaints
CREATE TABLE public.worker_complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id),
  assignment_id uuid REFERENCES public.job_assignments(id),
  severity complaint_severity NOT NULL DEFAULT 'minor',
  category text NOT NULL,
  description text NOT NULL,
  resolution text,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.worker_complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage complaints" ON public.worker_complaints
  FOR ALL TO public USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Vendors can view own complaints" ON public.worker_complaints
  FOR SELECT TO public USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

-- Subscriptions for recurring bookings
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  customer_address text NOT NULL,
  service_id uuid REFERENCES public.services(id),
  service_name text NOT NULL,
  frequency subscription_frequency NOT NULL DEFAULT 'weekly',
  preferred_vendor_id uuid REFERENCES public.vendors(id),
  preferred_day text,
  preferred_time text,
  base_price numeric NOT NULL,
  discount_percentage numeric DEFAULT 10,
  final_price numeric NOT NULL,
  status subscription_status DEFAULT 'active',
  next_booking_date date,
  last_booking_date date,
  total_bookings_made integer DEFAULT 0,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT TO public USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can create subscriptions" ON public.subscriptions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

-- Job offers for automated matching
CREATE TABLE public.job_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  vendor_id uuid NOT NULL REFERENCES public.vendors(id),
  status job_offer_status DEFAULT 'pending',
  priority_rank integer DEFAULT 1,
  offered_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  responded_at timestamptz,
  decline_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own offers" ON public.job_offers
  FOR SELECT TO public USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Vendors can update own offers" ON public.job_offers
  FOR UPDATE TO public USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage offers" ON public.job_offers
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

-- Performance logs for tracking individual job metrics
CREATE TABLE public.worker_performance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES public.job_assignments(id),
  booking_id uuid REFERENCES public.bookings(id),
  customer_rating integer,
  was_on_time boolean,
  was_completed boolean DEFAULT true,
  had_complaint boolean DEFAULT false,
  complaint_severity complaint_severity,
  was_repeat_customer boolean DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.worker_performance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own logs" ON public.worker_performance_logs
  FOR SELECT TO public USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage logs" ON public.worker_performance_logs
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

-- Function to auto-update vendor tier based on performance
CREATE OR REPLACE FUNCTION public.update_vendor_tier(vendor_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_avg_rating numeric;
  v_completion_rate numeric;
  v_total_completed integer;
  v_new_tier worker_tier;
BEGIN
  SELECT avg_rating, completion_rate, total_completed_jobs
  INTO v_avg_rating, v_completion_rate, v_total_completed
  FROM vendors WHERE id = vendor_uuid;

  IF v_avg_rating >= 4.8 AND v_completion_rate >= 98 AND v_total_completed >= 50 THEN
    v_new_tier := 'elite';
  ELSIF v_avg_rating >= 4.6 AND v_completion_rate >= 95 AND v_total_completed >= 25 THEN
    v_new_tier := 'gold';
  ELSIF v_avg_rating >= 4.2 AND v_completion_rate >= 90 AND v_total_completed >= 10 THEN
    v_new_tier := 'silver';
  ELSE
    v_new_tier := 'bronze';
  END IF;

  UPDATE vendors SET tier = v_new_tier, updated_at = now() WHERE id = vendor_uuid;
END;
$$;

-- Function to check and suspend poor performers
CREATE OR REPLACE FUNCTION public.check_vendor_suspension(vendor_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_serious_complaints integer;
  v_total_jobs integer;
  v_low_ratings integer;
  should_suspend boolean := false;
BEGIN
  SELECT serious_complaint_count, total_completed_jobs
  INTO v_serious_complaints, v_total_jobs
  FROM vendors WHERE id = vendor_uuid;

  -- 2 serious complaints in first 5 jobs
  IF v_total_jobs <= 5 AND v_serious_complaints >= 2 THEN
    should_suspend := true;
  END IF;

  -- 3 ratings below 3.0
  SELECT COUNT(*) INTO v_low_ratings
  FROM worker_performance_logs
  WHERE vendor_id = vendor_uuid AND customer_rating < 3;

  IF v_low_ratings >= 3 THEN
    should_suspend := true;
  END IF;

  IF should_suspend THEN
    UPDATE vendors
    SET onboarding_status = 'suspended',
        suspended_at = now(),
        suspension_reason = 'Automatic suspension due to poor performance',
        is_active = false,
        updated_at = now()
    WHERE id = vendor_uuid;
  END IF;

  RETURN should_suspend;
END;
$$;

-- Enable realtime for job_offers
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_offers;
