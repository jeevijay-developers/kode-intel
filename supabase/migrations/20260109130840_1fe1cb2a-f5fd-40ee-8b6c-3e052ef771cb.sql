-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'primary',
  points_required INTEGER NOT NULL DEFAULT 0,
  badge_type TEXT NOT NULL DEFAULT 'achievement',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_badges junction table
CREATE TABLE public.student_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, badge_id)
);

-- Create student_points table for tracking XP
CREATE TABLE public.student_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  target_value INTEGER NOT NULL DEFAULT 1,
  points_reward INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_achievements junction table
CREATE TABLE public.student_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, achievement_id)
);

-- Add activation status to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS activation_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS activated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS activated_by UUID;

-- Enable RLS on all new tables
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badges (publicly viewable)
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);

-- RLS Policies for student_badges
CREATE POLICY "Students can view their own badges" ON public.student_badges FOR SELECT USING (true);
CREATE POLICY "System can insert student badges" ON public.student_badges FOR INSERT WITH CHECK (true);

-- RLS Policies for student_points
CREATE POLICY "Student points are viewable" ON public.student_points FOR SELECT USING (true);
CREATE POLICY "System can manage student points" ON public.student_points FOR ALL USING (true);

-- RLS Policies for achievements
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements FOR SELECT USING (true);

-- RLS Policies for student_achievements
CREATE POLICY "Student achievements are viewable" ON public.student_achievements FOR SELECT USING (true);
CREATE POLICY "System can manage student achievements" ON public.student_achievements FOR ALL USING (true);

-- Seed initial badges
INSERT INTO public.badges (name, description, icon, color, points_required, badge_type) VALUES
('First Step', 'Complete your first video lesson', 'play', 'primary', 0, 'milestone'),
('Quiz Master', 'Pass your first quiz', 'trophy', 'sunny', 0, 'milestone'),
('Bookworm', 'Read your first ebook', 'book', 'turquoise', 0, 'milestone'),
('Code Warrior', 'Run your first program', 'code', 'purple', 0, 'milestone'),
('Rising Star', 'Earn 100 points', 'star', 'sunny', 100, 'level'),
('Super Learner', 'Earn 500 points', 'zap', 'coral', 500, 'level'),
('AI Champion', 'Earn 1000 points', 'brain', 'primary', 1000, 'level'),
('Genius Coder', 'Earn 2500 points', 'rocket', 'purple', 2500, 'level'),
('Week Warrior', 'Maintain a 7-day streak', 'flame', 'coral', 0, 'streak'),
('Month Master', 'Maintain a 30-day streak', 'crown', 'sunny', 0, 'streak');

-- Seed initial achievements
INSERT INTO public.achievements (name, description, icon, achievement_type, target_value, points_reward) VALUES
('Video Starter', 'Watch 5 videos', 'play', 'videos_watched', 5, 25),
('Video Pro', 'Watch 20 videos', 'play', 'videos_watched', 20, 100),
('Video Master', 'Watch 50 videos', 'play', 'videos_watched', 50, 250),
('Quiz Beginner', 'Pass 3 quizzes', 'help-circle', 'quizzes_passed', 3, 30),
('Quiz Expert', 'Pass 10 quizzes', 'help-circle', 'quizzes_passed', 10, 100),
('Quiz Legend', 'Pass 25 quizzes', 'help-circle', 'quizzes_passed', 25, 300),
('Course Explorer', 'Start 2 courses', 'book-open', 'courses_started', 2, 20),
('Course Champion', 'Complete 1 course', 'check-circle', 'courses_completed', 1, 200),
('Code Novice', 'Run 10 programs', 'code', 'programs_run', 10, 50),
('Code Expert', 'Run 50 programs', 'code', 'programs_run', 50, 200);

-- Update existing students to be activated
UPDATE public.students SET activation_status = 'active' WHERE activation_status = 'pending';