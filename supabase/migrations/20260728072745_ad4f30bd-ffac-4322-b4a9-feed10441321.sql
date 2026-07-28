CREATE TABLE public.loan_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  amount numeric NOT NULL,
  term_months integer NOT NULL,
  rate numeric NOT NULL,
  monthly_payment numeric NOT NULL,
  monthly_income numeric,
  employment text,
  purpose text,
  id_front_path text,
  id_back_path text,
  selfie_path text,
  mobile_provider text,
  mobile_number text,
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.loan_applications TO anon, authenticated;
GRANT SELECT, UPDATE ON public.loan_applications TO authenticated;
GRANT ALL ON public.loan_applications TO service_role;

ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.loan_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins view all applications"
  ON public.loan_applications FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update applications"
  ON public.loan_applications FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_loan_applications_updated_at
  BEFORE UPDATE ON public.loan_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Allow anonymous visitors to upload ID documents for pending applications
CREATE POLICY "Anyone can upload application documents"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'application-uploads');

CREATE POLICY "Admins can view application uploads"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'application-uploads' AND has_role(auth.uid(), 'admin'::app_role));