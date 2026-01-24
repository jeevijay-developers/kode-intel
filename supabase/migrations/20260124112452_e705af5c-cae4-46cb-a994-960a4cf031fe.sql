-- Create institution_type enum
CREATE TYPE public.institution_type AS ENUM ('school', 'corporate', 'coaching', 'other');

-- Create institution_accounts table
CREATE TABLE public.institution_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL,
  institution_type institution_type NOT NULL DEFAULT 'school',
  contact_person TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expected_student_count INTEGER DEFAULT 0,
  logo_url TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create institution_students mapping table
CREATE TABLE public.institution_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institution_accounts(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(institution_id, student_id)
);

-- Create institution_course_access table
CREATE TABLE public.institution_course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institution_accounts(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_count INTEGER NOT NULL DEFAULT 0,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(institution_id, course_id)
);

-- Create institution_payments table
CREATE TABLE public.institution_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institution_accounts(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  invoice_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.institution_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for institution_accounts
CREATE POLICY "Allow public registration" ON public.institution_accounts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Institutions can view own data" ON public.institution_accounts
  FOR SELECT USING (true);

CREATE POLICY "Institutions can update own data" ON public.institution_accounts
  FOR UPDATE USING (true);

-- RLS Policies for institution_students
CREATE POLICY "Allow all operations on institution_students" ON public.institution_students
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for institution_course_access
CREATE POLICY "Allow all operations on institution_course_access" ON public.institution_course_access
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for institution_payments
CREATE POLICY "Allow all operations on institution_payments" ON public.institution_payments
  FOR ALL USING (true) WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_institution_accounts_updated_at
  BEFORE UPDATE ON public.institution_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();