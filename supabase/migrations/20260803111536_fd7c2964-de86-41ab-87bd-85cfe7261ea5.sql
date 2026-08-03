-- COUNTRY SETTINGS
CREATE TABLE public.country_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL UNIQUE,
  country_name text NOT NULL,
  currency_code text NOT NULL,
  currency_symbol text NOT NULL,
  min_loan_amount numeric NOT NULL DEFAULT 500,
  max_loan_amount numeric NOT NULL DEFAULT 50000,
  min_term_months integer NOT NULL DEFAULT 3,
  max_term_months integer NOT NULL DEFAULT 24,
  commitment_pct_min numeric NOT NULL DEFAULT 10,
  commitment_pct_max numeric NOT NULL DEFAULT 15,
  eligibility_rules jsonb NOT NULL DEFAULT '{"min_age":18,"max_active_loans":1,"require_kyc":true,"min_monthly_income":0}'::jsonb,
  payment_methods jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.country_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.country_settings TO authenticated;
GRANT ALL ON public.country_settings TO service_role;

ALTER TABLE public.country_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active countries" ON public.country_settings
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert countries" ON public.country_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update countries" ON public.country_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete countries" ON public.country_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER country_settings_updated_at BEFORE UPDATE ON public.country_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LOANS additions
ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS amount_paid numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency_code text NOT NULL DEFAULT 'ZMW',
  ADD COLUMN IF NOT EXISTS country_code text;

-- PAYMENT TRANSACTIONS
CREATE TABLE public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_ref text NOT NULL,
  tx_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  amount numeric NOT NULL,
  currency_code text NOT NULL,
  msisdn text,
  loan_id uuid REFERENCES public.loans(id) ON DELETE SET NULL,
  application_id uuid REFERENCES public.loan_applications(id) ON DELETE SET NULL,
  user_id uuid,
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_ref)
);

GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view transactions" ON public.payment_transactions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Borrowers view own transactions" ON public.payment_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- WEBHOOK EVENTS
CREATE TABLE public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_id text NOT NULL,
  event_type text,
  signature_valid boolean NOT NULL DEFAULT false,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed_at timestamptz,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);

GRANT SELECT ON public.webhook_events TO authenticated;
GRANT ALL ON public.webhook_events TO service_role;

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view webhook events" ON public.webhook_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_payment_tx_loan ON public.payment_transactions(loan_id);
CREATE INDEX idx_webhook_events_created ON public.webhook_events(created_at DESC);

-- SEED COUNTRIES
INSERT INTO public.country_settings
  (country_code, country_name, currency_code, currency_symbol, min_loan_amount, max_loan_amount, min_term_months, max_term_months, commitment_pct_min, commitment_pct_max, eligibility_rules, payment_methods, sort_order)
VALUES
  ('ZM','Zambia','ZMW','K',500,50000,3,24,10,15,
   '{"min_age":18,"max_active_loans":1,"require_kyc":true,"min_monthly_income":1000}'::jsonb,
   '[{"code":"mtn_momo","name":"MTN MoMo","enabled":true},{"code":"airtel_money","name":"Airtel Money","enabled":true},{"code":"zamtel_kwacha","name":"Zamtel Kwacha","enabled":false}]'::jsonb, 1),
  ('GH','Ghana','GHS','GHS',300,60000,3,24,10,15,
   '{"min_age":18,"max_active_loans":1,"require_kyc":true,"min_monthly_income":800}'::jsonb,
   '[{"code":"mtn_momo","name":"MTN MoMo","enabled":true},{"code":"vodafone_cash","name":"Vodafone Cash","enabled":true},{"code":"airteltigo","name":"AirtelTigo Money","enabled":true}]'::jsonb, 2),
  ('KE','Kenya','KES',
   'KSh',1000,80000,3,24,10,15,
   '{"min_age":18,"max_active_loans":1,"require_kyc":true,"min_monthly_income":10000}'::jsonb,
   '[{"code":"mpesa","name":"M-Pesa","enabled":true},{"code":"airtel_money","name":"Airtel Money","enabled":true}]'::jsonb, 3),
  ('NG','Nigeria','NGN','NGN',5000,500000,3,18,10,15,
   '{"min_age":18,"max_active_loans":1,"require_kyc":true,"min_monthly_income":50000}'::jsonb,
   '[{"code":"paga","name":"Paga","enabled":true},{"code":"opay","name":"OPay","enabled":false}]'::jsonb, 4);