-- Create question type enum
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'true_false');

-- Courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_global BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course school assignments (for specific school access)
CREATE TABLE public.course_school_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, school_id)
);

-- Chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chapter videos (YouTube links)
CREATE TABLE public.chapter_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chapter ebooks
CREATE TABLE public.chapter_ebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chapter quizzes
CREATE TABLE public.chapter_quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER NOT NULL DEFAULT 60,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quiz questions
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.chapter_quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL DEFAULT 'multiple_choice',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quiz options
CREATE TABLE public.quiz_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Student course progress
CREATE TABLE public.student_course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, course_id)
);

-- Student video progress
CREATE TABLE public.student_video_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.chapter_videos(id) ON DELETE CASCADE,
  watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  watch_duration_seconds INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(student_id, video_id)
);

-- Student quiz attempts
CREATE TABLE public.student_quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.chapter_quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Student quiz answers
CREATE TABLE public.student_quiz_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.student_quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.quiz_options(id) ON DELETE SET NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_school_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quiz_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (admins can manage, public can read published)
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage course assignments" ON public.course_school_assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage chapters" ON public.chapters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage videos" ON public.chapter_videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage ebooks" ON public.chapter_ebooks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage quizzes" ON public.chapter_quizzes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage questions" ON public.quiz_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage options" ON public.quiz_options FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All can manage student progress" ON public.student_course_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All can manage video progress" ON public.student_video_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All can manage quiz attempts" ON public.student_quiz_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All can manage quiz answers" ON public.student_quiz_answers FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapter_videos_updated_at BEFORE UPDATE ON public.chapter_videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapter_ebooks_updated_at BEFORE UPDATE ON public.chapter_ebooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapter_quizzes_updated_at BEFORE UPDATE ON public.chapter_quizzes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for ebooks
INSERT INTO storage.buckets (id, name, public) VALUES ('course-ebooks', 'course-ebooks', true);

-- Storage policies for ebooks
CREATE POLICY "Anyone can view ebooks" ON storage.objects FOR SELECT USING (bucket_id = 'course-ebooks');
CREATE POLICY "Authenticated users can upload ebooks" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'course-ebooks');
CREATE POLICY "Authenticated users can update ebooks" ON storage.objects FOR UPDATE USING (bucket_id = 'course-ebooks');
CREATE POLICY "Authenticated users can delete ebooks" ON storage.objects FOR DELETE USING (bucket_id = 'course-ebooks');