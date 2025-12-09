-- Create payments table for tracking all transactions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'ZMW',
  payment_method TEXT NOT NULL,
  payment_provider TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  provider_reference TEXT,
  service_name TEXT,
  status TEXT DEFAULT 'pending',
  receipt_number TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sequence for receipt numbers
CREATE SEQUENCE IF NOT EXISTS receipt_seq START 1;

-- Create function to generate receipt numbers
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.receipt_number := 'RCP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('receipt_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$function$;

-- Create trigger for receipt number generation
CREATE TRIGGER generate_payment_receipt
  BEFORE INSERT ON public.payments
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION public.generate_receipt_number();

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policy for admins to see all payments
CREATE POLICY "Admins can view all payments"
  ON public.payments
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Policy for admins to manage payments
CREATE POLICY "Admins can manage payments"
  ON public.payments
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Policy for service role (webhooks)
CREATE POLICY "Service role can manage payments"
  ON public.payments
  FOR ALL
  USING (auth.role() = 'service_role');

-- Enable realtime for payments
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;

-- Add trigger for updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();