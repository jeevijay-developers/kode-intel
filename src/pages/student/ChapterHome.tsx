import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Code2, FileQuestion, Play, Lock, CheckCircle2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChapterHome() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { student, loading } = useStudentAuth();

  // Fetch chapter details with content counts
  const { data: chapter, isLoading } = useQuery({
    queryKey: ["chapter-home", chapterId],
    queryFn: async () => {
      if (!chapterId) return null;

      const { data, error } = await supabase
        .from("chapters")
        .select(`
          *,
          courses(id, title),
          digital_books(id, title, is_published),
          coding_modules(id, title, is_published),
          worksheet_questions(id, is_published)
        `)
        .eq("id", chapterId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!chapterId,
  });

  // Fetch student progress for this chapter
  const { data: progress } = useQuery({
    queryKey: ["chapter-progress", chapterId, student?.id],
    queryFn: async () => {
      if (!chapterId || !student?.id) return null;

      const [bookProgress, codingProgress, worksheetProgress] = await Promise.all([
        supabase
          .from("book_reading_progress")
          .select("completed_at")
          .eq("student_id", student.id)
          .eq("digital_book_id", chapter?.digital_books?.[0]?.id || "")
          .maybeSingle(),
        supabase
          .from("coding_progress")
          .select("completed_at")
          .eq("student_id", student.id)
          .in("module_id", chapter?.coding_modules?.map((m: any) => m.id) || []),
        supabase
          .from("worksheet_progress")
          .select("is_correct")
          .eq("student_id", student.id)
          .eq("chapter_id", chapterId),
      ]);

      return {
        bookCompleted: !!bookProgress.data?.completed_at,
        codingCompleted: (codingProgress.data?.length || 0) >= (chapter?.coding_modules?.length || 0),
        worksheetCompleted:
          (worksheetProgress.data?.length || 0) >= (chapter?.worksheet_questions?.length || 0),
        worksheetCorrect: worksheetProgress.data?.filter((w: any) => w.is_correct).length || 0,
      };
    },
    enabled: !!chapterId && !!student?.id && !!chapter,
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading chapter...</div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Chapter not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const digitalBook = chapter.digital_books?.[0];
  const codingModules = chapter.coding_modules?.filter((m: any) => m.is_published) || [];
  const worksheetQuestions = chapter.worksheet_questions?.filter((q: any) => q.is_published) || [];

  const modules = [
    {
      id: "theory",
      title: "Theory",
      subtitle: "Digital Book",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-400",
      available: !!digitalBook?.is_published,
      completed: progress?.bookCompleted,
      count: digitalBook ? "Read" : "Coming Soon",
      onClick: () => digitalBook && navigate(`/student/book/${digitalBook.id}`),
    },
    {
      id: "coding",
      title: "Coding",
      subtitle: "Block Programming",
      icon: Code2,
      color: "from-purple-500 to-pink-400",
      available: codingModules.length > 0,
      completed: progress?.codingCompleted,
      count: codingModules.length > 0 ? `${codingModules.length} Lessons` : "Coming Soon",
      onClick: () => codingModules.length > 0 && navigate(`/student/coding/${codingModules[0].id}`),
    },
    {
      id: "worksheet",
      title: "Worksheet",
      subtitle: "Practice & Assess",
      icon: FileQuestion,
      color: "from-green-500 to-emerald-400",
      available: worksheetQuestions.length > 0,
      completed: progress?.worksheetCompleted,
      count: worksheetQuestions.length > 0 ? `${worksheetQuestions.length} Questions` : "Coming Soon",
      onClick: () => worksheetQuestions.length > 0 && navigate(`/student/worksheet/${chapterId}`),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/student/courses/${chapter.courses?.id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="truncate">
              <p className="font-semibold text-foreground text-sm truncate">
                Chapter {chapter.order_index}: {chapter.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {chapter.courses?.title}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/student/profile")}
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-background px-4 py-8">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Chapter {chapter.order_index}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {chapter.title}
          </h1>
          {chapter.description && (
            <p className="text-muted-foreground max-w-lg mx-auto">
              {chapter.description}
            </p>
          )}
        </div>
      </div>

      {/* Module Cards */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Learning Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <button
                key={module.id}
                onClick={module.onClick}
                disabled={!module.available}
                className={cn(
                  "relative p-6 rounded-2xl border-2 text-left transition-all",
                  module.available
                    ? "bg-card border-border hover:border-primary/50 hover:shadow-lg cursor-pointer"
                    : "bg-muted/50 border-muted cursor-not-allowed opacity-60"
                )}
              >
                {/* Completed Badge */}
                {module.completed && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                    module.available
                      ? `bg-gradient-to-br ${module.color}`
                      : "bg-muted"
                  )}
                >
                  {module.available ? (
                    <Icon className="w-7 h-7 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  {module.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {module.subtitle}
                </p>

                {/* Count/Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">
                    {module.count}
                  </span>
                  {module.available && (
                    <Play className="w-4 h-4 text-primary" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Your Progress
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  progress?.bookCompleted ? "bg-green-500" : "bg-muted-foreground/30"
                )}
              />
              <span className="text-sm text-muted-foreground">Theory</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  progress?.codingCompleted ? "bg-green-500" : "bg-muted-foreground/30"
                )}
              />
              <span className="text-sm text-muted-foreground">Coding</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  progress?.worksheetCompleted ? "bg-green-500" : "bg-muted-foreground/30"
                )}
              />
              <span className="text-sm text-muted-foreground">Worksheet</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
