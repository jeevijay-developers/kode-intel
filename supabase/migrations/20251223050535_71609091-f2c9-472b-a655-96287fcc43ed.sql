-- Make chapter_id nullable in chapter_quizzes to allow standalone quizzes
ALTER TABLE public.chapter_quizzes 
ALTER COLUMN chapter_id DROP NOT NULL;

-- Add a course_id to associate quizzes with courses (for organization)
ALTER TABLE public.chapter_quizzes 
ADD COLUMN course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE;

-- Create an index for faster queries
CREATE INDEX idx_chapter_quizzes_course_id ON public.chapter_quizzes(course_id);