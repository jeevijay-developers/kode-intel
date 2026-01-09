
-- Add trial-related columns to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS trial_start_date timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS trial_end_date timestamp with time zone DEFAULT (now() + interval '7 days'),
ADD COLUMN IF NOT EXISTS is_trial_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trial';

-- Create a function to check if trial is expired
CREATE OR REPLACE FUNCTION public.check_trial_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.trial_end_date < now() AND NEW.is_trial_active = true THEN
    NEW.is_trial_active := false;
    NEW.subscription_status := 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-update trial status
DROP TRIGGER IF EXISTS update_trial_status ON public.students;
CREATE TRIGGER update_trial_status
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.check_trial_status();

-- Update existing students to have trial dates
UPDATE public.students 
SET trial_start_date = created_at,
    trial_end_date = created_at + interval '7 days',
    is_trial_active = CASE WHEN created_at + interval '7 days' > now() THEN true ELSE false END,
    subscription_status = CASE WHEN created_at + interval '7 days' > now() THEN 'trial' ELSE 'expired' END
WHERE trial_start_date IS NULL;
