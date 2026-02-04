-- Create enum for content block types
CREATE TYPE public.content_block_type AS ENUM (
  'text',
  'image',
  'callout',
  'block_visual',
  'video_embed',
  'activity',
  'divider'
);

-- Create enum for worksheet question types
CREATE TYPE public.worksheet_question_type AS ENUM (
  'fill_blank',
  'true_false',
  'match_column',
  'short_answer',
  'ordering',
  'block_reasoning'
);

-- 1. Digital Books table (main container per chapter)
CREATE TABLE public.digital_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  cover_image_url TEXT,
  learning_objectives JSONB DEFAULT '[]'::jsonb,
  estimated_reading_time INTEGER DEFAULT 10,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(chapter_id)
);

-- 2. Book Pages table
CREATE TABLE public.book_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  digital_book_id UUID NOT NULL REFERENCES public.digital_books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  title TEXT,
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Page Content Blocks table
CREATE TABLE public.page_content_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.book_pages(id) ON DELETE CASCADE,
  block_type public.content_block_type NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER DEFAULT 0,
  class_level_min INTEGER DEFAULT 3,
  class_level_max INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Book Reading Progress table
CREATE TABLE public.book_reading_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  digital_book_id UUID NOT NULL REFERENCES public.digital_books(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 1,
  completed_pages INTEGER[] DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE,
  reading_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, digital_book_id)
);

-- 5. Worksheet Questions table (extended question types)
CREATE TABLE public.worksheet_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  question_type public.worksheet_question_type NOT NULL,
  question_data JSONB NOT NULL,
  difficulty_level TEXT DEFAULT 'medium',
  xp_reward INTEGER DEFAULT 5,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Worksheet Progress table
CREATE TABLE public.worksheet_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.worksheet_questions(id) ON DELETE CASCADE,
  answer_data JSONB,
  is_correct BOOLEAN DEFAULT false,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, question_id)
);

-- Enable RLS on all tables
ALTER TABLE public.digital_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheet_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheet_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for digital_books
CREATE POLICY "Digital books are viewable by everyone"
  ON public.digital_books FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage digital books"
  ON public.digital_books FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  ));

-- RLS Policies for book_pages
CREATE POLICY "Book pages are viewable by everyone"
  ON public.book_pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage book pages"
  ON public.book_pages FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  ));

-- RLS Policies for page_content_blocks
CREATE POLICY "Content blocks are viewable by everyone"
  ON public.page_content_blocks FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage content blocks"
  ON public.page_content_blocks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  ));

-- RLS Policies for book_reading_progress
CREATE POLICY "Students can view their own reading progress"
  ON public.book_reading_progress FOR SELECT
  USING (true);

CREATE POLICY "Students can manage their own reading progress"
  ON public.book_reading_progress FOR ALL
  USING (true);

-- RLS Policies for worksheet_questions
CREATE POLICY "Worksheet questions are viewable by everyone"
  ON public.worksheet_questions FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage worksheet questions"
  ON public.worksheet_questions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  ));

-- RLS Policies for worksheet_progress
CREATE POLICY "Students can view their own worksheet progress"
  ON public.worksheet_progress FOR SELECT
  USING (true);

CREATE POLICY "Students can manage their own worksheet progress"
  ON public.worksheet_progress FOR ALL
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_digital_books_chapter ON public.digital_books(chapter_id);
CREATE INDEX idx_book_pages_book ON public.book_pages(digital_book_id);
CREATE INDEX idx_content_blocks_page ON public.page_content_blocks(page_id);
CREATE INDEX idx_reading_progress_student ON public.book_reading_progress(student_id);
CREATE INDEX idx_worksheet_questions_chapter ON public.worksheet_questions(chapter_id);
CREATE INDEX idx_worksheet_progress_student ON public.worksheet_progress(student_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_digital_books_updated_at
  BEFORE UPDATE ON public.digital_books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_book_pages_updated_at
  BEFORE UPDATE ON public.book_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_book_reading_progress_updated_at
  BEFORE UPDATE ON public.book_reading_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_worksheet_questions_updated_at
  BEFORE UPDATE ON public.worksheet_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();