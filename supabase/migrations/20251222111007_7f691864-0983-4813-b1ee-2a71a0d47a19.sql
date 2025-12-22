-- Create schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT,
  mobile_number TEXT NOT NULL,
  email TEXT,
  username TEXT NOT NULL UNIQUE,
  temp_password TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sequence for school codes
CREATE SEQUENCE school_code_seq START 1;

-- Function to generate school code
CREATE OR REPLACE FUNCTION generate_school_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.school_code := 'SCH-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('school_code_seq')::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-generating school code
CREATE TRIGGER set_school_code
  BEFORE INSERT ON public.schools
  FOR EACH ROW
  WHEN (NEW.school_code IS NULL OR NEW.school_code = '')
  EXECUTE FUNCTION generate_school_code();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- For now, allow public read/write (Super Admin panel - will add auth later)
CREATE POLICY "Allow all operations on schools" 
  ON public.schools 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on students" 
  ON public.students 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_students_school_id ON public.students(school_id);
CREATE INDEX idx_students_class ON public.students(class);
CREATE INDEX idx_students_is_active ON public.students(is_active);
CREATE INDEX idx_schools_is_active ON public.schools(is_active);