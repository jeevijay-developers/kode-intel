/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Brain,
  User,
  Rocket,
  Search,
  Inbox,
  Lock,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useCourse, useChapters } from "@/hooks/useCourses";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CourseContentViewer } from "@/components/courses/CourseContentViewer";

export default function StudentCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { student, loading, isTrialExpired } = useStudentAuth();
  const { data: course, isLoading: courseLoading } = useCourse(id);
  const { chapters } = useChapters(id);

  const isTrial = student?.subscription_status === "trial" && !isTrialExpired();
  const isActive = student?.subscription_status === "active" || student?.is_active;
  const hasFullAccess = isActive && !isTrial;

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  // Start course progress if not started
  const { data: courseProgress } = useQuery({
    queryKey: ["course-progress", student?.id, id],
    queryFn: async () => {
      if (!student || !id) return null;
      const { data, error } = await supabase
        .from("student_course_progress")
        .select("*")
        .eq("student_id", student.id)
        .eq("course_id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!student && !!id,
  });

  const startCourse = useMutation({
    mutationFn: async () => {
      if (!student || !id) return;
      const { error } = await supabase.from("student_course_progress").insert({
        student_id: student.id,
        course_id: id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-progress"] });
      toast({ title: "Course started! 🎉" });
    },
  });

  // Auto-start course on first view
  useEffect(() => {
    if (student && id && courseProgress === null && !courseLoading) {
      startCourse.mutate();
    }
  }, [student, id, courseProgress, courseLoading]);

  // Handlers for content viewer
  const handleVideoClick = (video: any) => {
    navigate(`/student/video/${video.id}`);
  };

  const handleQuizClick = (quiz: any) => {
    navigate(`/student/quiz/${quiz.id}`);
  };

  const handleEbookClick = (ebook: any) => {
    navigate(`/student/ebook/${ebook.id}`);
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl flex items-center gap-2">
          Loading... <Rocket className="h-5 w-5" />
        </div>
      </div>
    );
  }

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          {/* Course card skeleton */}
          <Card>
            <div className="flex flex-col sm:flex-row">
              <Skeleton className="w-full sm:w-48 h-28 sm:h-40" />
              <div className="p-4 flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </Card>
          {/* Content skeleton */}
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="lg:w-72 h-[400px] rounded-xl" />
            <Skeleton className="flex-1 h-[500px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            Course not found
          </h2>
          <Button onClick={() => navigate("/student")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const publishedChapters = chapters.filter((c) => c.is_published);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/student")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground hidden sm:block">
                My Course
              </span>
            </div>
          </div>
          {isTrial && (
            <Badge className="bg-sunny text-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              Free Trial
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/student/profile")}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Course Header */}
        <Card className="mb-4 sm:mb-6 overflow-hidden animate-slide-up">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 h-28 sm:h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="h-10 w-10 sm:h-16 sm:w-16 text-primary/50" />
              )}
            </div>
            <div className="p-3 sm:p-6 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-4 line-clamp-2">{course.description}</p>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Badge
                  variant="outline"
                  className="text-xs sm:text-base py-0.5 sm:py-1 px-2 sm:px-3 flex items-center gap-1"
                >
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" /> {publishedChapters.length} Ch.
                </Badge>
                {isTrial && (
                  <Badge className="bg-sunny/20 text-sunny border-sunny/30 text-xs sm:text-base py-0.5 sm:py-1 px-2 sm:px-3">
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" /> Ch.1 Free
                  </Badge>
                )}
                {courseProgress?.completed_at && (
                  <Badge className="bg-primary/20 text-primary text-xs sm:text-base py-0.5 sm:py-1 px-2 sm:px-3 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> Done
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Trial Banner */}
        {isTrial && (
          <Card className="mb-4 sm:mb-6 bg-gradient-to-r from-sunny/10 to-coral/10 border-sunny/30 animate-slide-up stagger-1">
            <CardContent className="py-3 sm:py-4 px-3 sm:px-5">
              <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-sunny shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-1 sm:gap-2">
                      <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Trial: Ch.1 Unlocked
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      Subscribe to unlock all chapters
                    </p>
                  </div>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-sunny to-coral text-foreground h-8 sm:h-9 text-xs sm:text-sm">
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Content - New Structured UI */}
        <div className="animate-slide-up stagger-2">
          {publishedChapters.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Inbox className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                  <p className="text-sm sm:text-lg text-muted-foreground">
                    No content yet. Check back soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <CourseContentViewer
              chapters={publishedChapters}
              studentId={student.id}
              isLocked={(index) => isTrial && index > 0}
              onVideoClick={handleVideoClick}
              onQuizClick={handleQuizClick}
              onEbookClick={handleEbookClick}
            />
          )}
        </div>
      </main>
    </div>
  );
}
