-- Drop existing policies and recreate with explicit authentication checks

-- PROFILES TABLE: Strengthen with explicit auth checks
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- PAYMENTS TABLE: Strengthen with explicit auth and service role checks
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can manage payments" ON public.payments;

CREATE POLICY "Admins can manage payments" 
ON public.payments 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert payments" 
ON public.payments 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update payments" 
ON public.payments 
FOR UPDATE 
TO service_role
USING (true);

CREATE POLICY "Service role can select payments" 
ON public.payments 
FOR SELECT 
TO service_role
USING (true);

-- QUOTES TABLE: Strengthen with explicit auth checks
DROP POLICY IF EXISTS "Admins can manage quotes" ON public.quotes;
DROP POLICY IF EXISTS "Customers can view own quotes" ON public.quotes;

CREATE POLICY "Admins can manage quotes" 
ON public.quotes 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Customers can view own quotes" 
ON public.quotes 
FOR SELECT 
TO authenticated
USING (customer_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));