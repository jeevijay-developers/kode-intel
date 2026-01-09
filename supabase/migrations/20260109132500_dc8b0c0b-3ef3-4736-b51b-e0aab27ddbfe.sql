-- Add student_type column to distinguish individual vs school-provided students
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS student_type text NOT NULL DEFAULT 'school_provided';

-- Add comment for clarity
COMMENT ON COLUMN public.students.student_type IS 'Either "individual" or "school_provided"';

-- Make school_id nullable for individual students
ALTER TABLE public.students 
ALTER COLUMN school_id DROP NOT NULL;

-- Add index for student_type
CREATE INDEX IF NOT EXISTS idx_students_type ON public.students(student_type);