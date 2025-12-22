-- Make school_code have a default so it can be auto-generated
ALTER TABLE public.schools ALTER COLUMN school_code SET DEFAULT '';