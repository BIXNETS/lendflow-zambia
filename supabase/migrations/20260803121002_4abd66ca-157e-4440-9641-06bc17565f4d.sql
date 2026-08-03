
ALTER TABLE public.loan_applications
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_id text,
  ADD COLUMN IF NOT EXISTS product_title text,
  ADD COLUMN IF NOT EXISTS service_fee_pct numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS service_fee numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS decision_notes text,
  ADD COLUMN IF NOT EXISTS decided_by uuid,
  ADD COLUMN IF NOT EXISTS decided_at timestamptz,
  ADD COLUMN IF NOT EXISTS loan_id uuid REFERENCES public.loans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS currency_code text NOT NULL DEFAULT 'ZMW';

CREATE INDEX IF NOT EXISTS loan_applications_user_id_idx ON public.loan_applications(user_id);

DROP POLICY IF EXISTS "Borrowers view own applications" ON public.loan_applications;
CREATE POLICY "Borrowers view own applications" ON public.loan_applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS application_id uuid REFERENCES public.loan_applications(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audience text NOT NULL DEFAULT 'borrower',
  kind text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  application_id uuid REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  loan_id uuid REFERENCES public.loans(id) ON DELETE CASCADE,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users mark own notifications read" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all notifications" ON public.notifications
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER notifications_updated_at BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications(user_id, created_at DESC);
