CREATE OR REPLACE FUNCTION public.sync_profile_kyc_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid;
  approved_types int;
  rejected_count int;
  total_count int;
  new_status text;
BEGIN
  uid := COALESCE(NEW.user_id, OLD.user_id);

  SELECT
    COUNT(DISTINCT doc_type) FILTER (WHERE status = 'approved'),
    COUNT(*) FILTER (WHERE status = 'rejected'),
    COUNT(*)
  INTO approved_types, rejected_count, total_count
  FROM public.kyc_documents WHERE user_id = uid;

  IF approved_types >= 3 THEN
    new_status := 'approved';
  ELSIF rejected_count > 0 THEN
    new_status := 'rejected';
  ELSE
    new_status := 'pending';
  END IF;

  UPDATE public.profiles SET kyc_status = new_status, updated_at = now()
    WHERE id = uid;
  RETURN NEW;
END;
$function$;