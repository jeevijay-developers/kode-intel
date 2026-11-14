CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_uid, 'admin') OR public.has_role(_uid, 'super_admin')
$$;

-- Curriculum content: public reads of published items, admin-only writes
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Public reads published courses" ON public.courses FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage chapters" ON public.chapters;
CREATE POLICY "Public reads published chapters" ON public.chapters FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage chapters" ON public.chapters FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage videos" ON public.chapter_videos;
CREATE POLICY "Public reads published videos" ON public.chapter_videos FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage videos" ON public.chapter_videos FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage ebooks" ON public.chapter_ebooks;
CREATE POLICY "Public reads published ebooks" ON public.chapter_ebooks FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage ebooks" ON public.chapter_ebooks FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.chapter_quizzes;
CREATE POLICY "Public reads published quizzes" ON public.chapter_quizzes FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage quizzes" ON public.chapter_quizzes FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage questions" ON public.quiz_questions;
CREATE POLICY "Public reads questions of published quizzes" ON public.quiz_questions FOR SELECT USING (
  public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.chapter_quizzes q WHERE q.id = quiz_id AND q.is_published));
CREATE POLICY "Admins manage questions" ON public.quiz_questions FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage options" ON public.quiz_options;
CREATE POLICY "Public reads options of published quizzes" ON public.quiz_options FOR SELECT USING (
  public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.quiz_questions qq JOIN public.chapter_quizzes q ON q.id = qq.quiz_id WHERE qq.id = question_id AND q.is_published));
CREATE POLICY "Admins manage options" ON public.quiz_options FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Admin-only operational / personal data
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    ('course_school_assignments','Admins can manage course assignments'),
    ('schools','Allow all operations on schools'),
    ('students','Allow all operations on students'),
    ('institution_course_access','Allow all operations on institution_course_access'),
    ('institution_payments','Allow all operations on institution_payments'),
    ('institution_students','Allow all operations on institution_students'),
    ('student_course_progress','All can manage student progress'),
    ('student_quiz_attempts','All can manage quiz attempts'),
    ('student_quiz_answers','All can manage quiz answers'),
    ('student_video_progress','All can manage video progress'),
    ('book_reading_progress','Students can manage their own reading progress'),
    ('book_reading_progress','Students can view their own reading progress'),
    ('worksheet_progress','Students can manage their own worksheet progress'),
    ('worksheet_progress','Students can view their own worksheet progress'),
    ('student_achievements','System can manage student achievements'),
    ('student_achievements','Student achievements are viewable'),
    ('student_points','System can manage student points'),
    ('student_points','Student points are viewable'),
    ('student_badges','Students can view their own badges'),
    ('student_badges','System can insert student badges')
  ) v(t,p) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.p, r.t);
  END LOOP;
  FOR r IN SELECT unnest(ARRAY['course_school_assignments','schools','students','institution_course_access','institution_payments','institution_students','student_course_progress','student_quiz_attempts','student_quiz_answers','student_video_progress','book_reading_progress','worksheet_progress','student_achievements','student_points','student_badges']) AS t LOOP
    EXECUTE format('CREATE POLICY "Admins manage %s" ON public.%I FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()))', r.t, r.t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Institutions can update own data" ON public.institution_accounts;
CREATE POLICY "Admins update institutions" ON public.institution_accounts FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Storage: only admins may change book files
DROP POLICY IF EXISTS "Authenticated users can update ebooks" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete ebooks" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update sample books" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete sample books" ON storage.objects;
CREATE POLICY "Admins update book files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('course-ebooks','sample-books') AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id IN ('course-ebooks','sample-books') AND public.is_admin(auth.uid()));
CREATE POLICY "Admins delete book files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('course-ebooks','sample-books') AND public.is_admin(auth.uid()));