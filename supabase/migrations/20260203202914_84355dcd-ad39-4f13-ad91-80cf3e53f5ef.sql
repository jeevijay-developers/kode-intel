-- Create coding_modules table (links coding activities to chapters)
CREATE TABLE public.coding_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  initial_blocks_xml TEXT, -- Starter blocks as XML
  objective_text TEXT,
  validation_rules JSONB, -- Rules to validate completion
  xp_reward INTEGER NOT NULL DEFAULT 10,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  class_level INTEGER NOT NULL DEFAULT 5 CHECK (class_level >= 3 AND class_level <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coding_projects table (student saved work)
CREATE TABLE public.coding_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  blocks_xml TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'free' CHECK (project_type IN ('lesson', 'free')),
  module_id UUID REFERENCES public.coding_modules(id) ON DELETE SET NULL,
  class_level INTEGER NOT NULL DEFAULT 5,
  thumbnail_data TEXT, -- Base64 canvas snapshot
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coding_progress table (completion tracking)
CREATE TABLE public.coding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.coding_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, module_id)
);

-- Create block_categories table (admin-configurable)
CREATE TABLE public.block_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#4C97FF',
  icon TEXT,
  min_class_level INTEGER NOT NULL DEFAULT 3 CHECK (min_class_level >= 3 AND min_class_level <= 10),
  max_class_level INTEGER NOT NULL DEFAULT 10 CHECK (max_class_level >= 3 AND max_class_level <= 10),
  blocks_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.coding_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.block_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coding_modules (public read, admin write)
CREATE POLICY "Coding modules are viewable by everyone"
ON public.coding_modules FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage coding modules"
ON public.coding_modules FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

-- RLS Policies for coding_projects (students own their projects)
CREATE POLICY "Students can view their own projects"
ON public.coding_projects FOR SELECT
USING (student_id IN (
  SELECT id FROM public.students WHERE id = student_id
));

CREATE POLICY "Students can create their own projects"
ON public.coding_projects FOR INSERT
WITH CHECK (student_id IN (
  SELECT id FROM public.students WHERE id = student_id
));

CREATE POLICY "Students can update their own projects"
ON public.coding_projects FOR UPDATE
USING (student_id IN (
  SELECT id FROM public.students WHERE id = student_id
));

CREATE POLICY "Students can delete their own projects"
ON public.coding_projects FOR DELETE
USING (student_id IN (
  SELECT id FROM public.students WHERE id = student_id
));

-- RLS Policies for coding_progress (students own their progress)
CREATE POLICY "Students can view their own progress"
ON public.coding_progress FOR SELECT
USING (student_id IN (
  SELECT id FROM public.students WHERE id = student_id
));

CREATE POLICY "Students can create their own progress"
ON public.coding_progress FOR INSERT
WITH CHECK (student_id IN (
  SELECT id FROM public.students WHERE id = student_id
));

CREATE POLICY "Students can update their own progress"
ON public.coding_progress FOR UPDATE
USING (student_id IN (
  SELECT id FROM public.students WHERE id = student_id
));

-- RLS Policies for block_categories (public read)
CREATE POLICY "Block categories are viewable by everyone"
ON public.block_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage block categories"
ON public.block_categories FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

-- Create indexes for performance
CREATE INDEX idx_coding_modules_chapter ON public.coding_modules(chapter_id);
CREATE INDEX idx_coding_modules_class ON public.coding_modules(class_level);
CREATE INDEX idx_coding_projects_student ON public.coding_projects(student_id);
CREATE INDEX idx_coding_progress_student ON public.coding_progress(student_id);
CREATE INDEX idx_coding_progress_module ON public.coding_progress(module_id);

-- Trigger for updated_at on coding_modules
CREATE TRIGGER update_coding_modules_updated_at
BEFORE UPDATE ON public.coding_modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on coding_projects
CREATE TRIGGER update_coding_projects_updated_at
BEFORE UPDATE ON public.coding_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();