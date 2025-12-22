-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION generate_school_code()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.school_code := 'SCH-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('school_code_seq')::TEXT, 3, '0');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;