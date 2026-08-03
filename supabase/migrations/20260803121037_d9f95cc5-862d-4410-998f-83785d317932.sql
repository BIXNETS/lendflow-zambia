
ALTER TABLE public.loans ALTER COLUMN tier_id DROP NOT NULL;
ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS product_id text,
  ADD COLUMN IF NOT EXISTS product_title text,
  ADD COLUMN IF NOT EXISTS service_fee numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_repayment numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS msisdn text;
