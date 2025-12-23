import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  is_global: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChapterVideo {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  duration_minutes: number | null;
  order_index: number;
  is_published: boolean;
}

export interface ChapterEbook {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  file_url: string;
  order_index: number;
  is_published: boolean;
}

export interface ChapterQuiz {
  id: string;
  chapter_id: string | null;
  course_id: string | null;
  title: string;
  description: string | null;
  passing_score: number;
  order_index: number;
  is_published: boolean;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  order_index: number;
}

export interface QuizOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export function useCourses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data as Course[];
    },
  });

  const createCourse = useMutation({
    mutationFn: async (course: Partial<Course>) => {
      const { data, error } = await supabase
        .from("courses")
        .insert([course as any])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Course created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating course", description: error.message, variant: "destructive" });
    },
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Course> & { id: string }) => {
      const { data, error } = await supabase
        .from("courses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Course updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating course", description: error.message, variant: "destructive" });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Course deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting course", description: error.message, variant: "destructive" });
    },
  });

  return { courses, isLoading, createCourse, updateCourse, deleteCourse };
}

export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      if (error) throw error;
      return data as Course;
    },
    enabled: !!courseId,
  });
}

export function useChapters(courseId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ["chapters", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");
      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!courseId,
  });

  const createChapter = useMutation({
    mutationFn: async (chapter: Partial<Chapter>) => {
      const { data, error } = await supabase
        .from("chapters")
        .insert([chapter as any])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
      toast({ title: "Chapter created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating chapter", description: error.message, variant: "destructive" });
    },
  });

  const updateChapter = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Chapter> & { id: string }) => {
      const { data, error } = await supabase
        .from("chapters")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
      toast({ title: "Chapter updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating chapter", description: error.message, variant: "destructive" });
    },
  });

  const deleteChapter = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chapters").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
      toast({ title: "Chapter deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting chapter", description: error.message, variant: "destructive" });
    },
  });

  return { chapters, isLoading, createChapter, updateChapter, deleteChapter };
}

export function useChapterVideos(chapterId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["chapter-videos", chapterId],
    queryFn: async () => {
      if (!chapterId) return [];
      const { data, error } = await supabase
        .from("chapter_videos")
        .select("*")
        .eq("chapter_id", chapterId)
        .order("order_index");
      if (error) throw error;
      return data as ChapterVideo[];
    },
    enabled: !!chapterId,
  });

  const createVideo = useMutation({
    mutationFn: async (video: Partial<ChapterVideo>) => {
      const { data, error } = await supabase
        .from("chapter_videos")
        .insert([video as any])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-videos", chapterId] });
      toast({ title: "Video added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error adding video", description: error.message, variant: "destructive" });
    },
  });

  const updateVideo = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ChapterVideo> & { id: string }) => {
      const { data, error } = await supabase
        .from("chapter_videos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-videos", chapterId] });
      toast({ title: "Video updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating video", description: error.message, variant: "destructive" });
    },
  });

  const deleteVideo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chapter_videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-videos", chapterId] });
      toast({ title: "Video deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting video", description: error.message, variant: "destructive" });
    },
  });

  return { videos, isLoading, createVideo, updateVideo, deleteVideo };
}

export function useChapterEbooks(chapterId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ebooks = [], isLoading } = useQuery({
    queryKey: ["chapter-ebooks", chapterId],
    queryFn: async () => {
      if (!chapterId) return [];
      const { data, error } = await supabase
        .from("chapter_ebooks")
        .select("*")
        .eq("chapter_id", chapterId)
        .order("order_index");
      if (error) throw error;
      return data as ChapterEbook[];
    },
    enabled: !!chapterId,
  });

  const createEbook = useMutation({
    mutationFn: async (ebook: Partial<ChapterEbook>) => {
      const { data, error } = await supabase
        .from("chapter_ebooks")
        .insert([ebook as any])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-ebooks", chapterId] });
      toast({ title: "Ebook added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error adding ebook", description: error.message, variant: "destructive" });
    },
  });

  const deleteEbook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chapter_ebooks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-ebooks", chapterId] });
      toast({ title: "Ebook deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting ebook", description: error.message, variant: "destructive" });
    },
  });

  return { ebooks, isLoading, createEbook, deleteEbook };
}

export function useChapterQuizzes(chapterId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["chapter-quizzes", chapterId],
    queryFn: async () => {
      if (!chapterId) return [];
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .select("*")
        .eq("chapter_id", chapterId)
        .order("order_index");
      if (error) throw error;
      return data as ChapterQuiz[];
    },
    enabled: !!chapterId,
  });

  const createQuiz = useMutation({
    mutationFn: async (quiz: Partial<ChapterQuiz>) => {
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .insert([quiz as any])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-quizzes", chapterId] });
      toast({ title: "Quiz created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating quiz", description: error.message, variant: "destructive" });
    },
  });

  const deleteQuiz = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chapter_quizzes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-quizzes", chapterId] });
      toast({ title: "Quiz deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting quiz", description: error.message, variant: "destructive" });
    },
  });

  return { quizzes, isLoading, createQuiz, deleteQuiz };
}

export function useQuizQuestions(quizId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["quiz-questions", quizId],
    queryFn: async () => {
      if (!quizId) return [];
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order_index");
      if (error) throw error;
      return data as QuizQuestion[];
    },
    enabled: !!quizId,
  });

  const createQuestion = useMutation({
    mutationFn: async (question: Partial<QuizQuestion>) => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .insert([question as any])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
      toast({ title: "Question added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error adding question", description: error.message, variant: "destructive" });
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
      toast({ title: "Question deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting question", description: error.message, variant: "destructive" });
    },
  });

  return { questions, isLoading, createQuestion, deleteQuestion };
}

export function useQuizOptions(questionId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: options = [], isLoading } = useQuery({
    queryKey: ["quiz-options", questionId],
    queryFn: async () => {
      if (!questionId) return [];
      const { data, error } = await supabase
        .from("quiz_options")
        .select("*")
        .eq("question_id", questionId)
        .order("order_index");
      if (error) throw error;
      return data as QuizOption[];
    },
    enabled: !!questionId,
  });

  const createOption = useMutation({
    mutationFn: async (option: Partial<QuizOption>) => {
      const { data, error } = await supabase
        .from("quiz_options")
        .insert([option as any])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-options", questionId] });
    },
    onError: (error: Error) => {
      toast({ title: "Error adding option", description: error.message, variant: "destructive" });
    },
  });

  const updateOption = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<QuizOption> & { id: string }) => {
      const { data, error } = await supabase
        .from("quiz_options")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-options", questionId] });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating option", description: error.message, variant: "destructive" });
    },
  });

  const deleteOption = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("quiz_options").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-options", questionId] });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting option", description: error.message, variant: "destructive" });
    },
  });

  return { options, isLoading, createOption, updateOption, deleteOption };
}

export function useCourseSchoolAssignments(courseId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["course-assignments", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from("course_school_assignments")
        .select("*, schools(*)")
        .eq("course_id", courseId);
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const assignSchool = useMutation({
    mutationFn: async ({ courseId, schoolId }: { courseId: string; schoolId: string }) => {
      const { error } = await supabase
        .from("course_school_assignments")
        .insert({ course_id: courseId, school_id: schoolId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-assignments", courseId] });
      toast({ title: "School assigned successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error assigning school", description: error.message, variant: "destructive" });
    },
  });

  const removeSchool = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from("course_school_assignments")
        .delete()
        .eq("id", assignmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-assignments", courseId] });
      toast({ title: "School removed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error removing school", description: error.message, variant: "destructive" });
    },
  });

  return { assignments, isLoading, assignSchool, removeSchool };
}

// Hook for managing all quizzes (standalone quiz management)
export function useAllQuizzes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["all-quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ChapterQuiz[];
    },
  });

  const createQuiz = useMutation({
    mutationFn: async (quiz: { 
      title: string; 
      description?: string; 
      passing_score?: number; 
      course_id?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .insert([{
          title: quiz.title,
          description: quiz.description || null,
          passing_score: quiz.passing_score || 60,
          course_id: quiz.course_id || null,
          chapter_id: null,
          order_index: 0,
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-quizzes"] });
      toast({ title: "Quiz created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating quiz", description: error.message, variant: "destructive" });
    },
  });

  const updateQuiz = useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string; 
      title?: string; 
      description?: string; 
      passing_score?: number;
      course_id?: string | null;
      chapter_id?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["chapter-quizzes"] });
      toast({ title: "Quiz updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating quiz", description: error.message, variant: "destructive" });
    },
  });

  const deleteQuiz = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chapter_quizzes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["chapter-quizzes"] });
      toast({ title: "Quiz deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting quiz", description: error.message, variant: "destructive" });
    },
  });

  const assignToChapter = useMutation({
    mutationFn: async ({ quizId, chapterId }: { quizId: string; chapterId: string }) => {
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .update({ chapter_id: chapterId })
        .eq("id", quizId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["chapter-quizzes"] });
      toast({ title: "Quiz assigned to chapter" });
    },
    onError: (error: Error) => {
      toast({ title: "Error assigning quiz", description: error.message, variant: "destructive" });
    },
  });

  const unassignFromChapter = useMutation({
    mutationFn: async (quizId: string) => {
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .update({ chapter_id: null })
        .eq("id", quizId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["chapter-quizzes"] });
      toast({ title: "Quiz unassigned from chapter" });
    },
    onError: (error: Error) => {
      toast({ title: "Error unassigning quiz", description: error.message, variant: "destructive" });
    },
  });

  return { quizzes, isLoading, createQuiz, updateQuiz, deleteQuiz, assignToChapter, unassignFromChapter };
}
