/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import {
  BookOpen,
  Play,
  User,
  Brain,
  Video,
  FileText,
  HelpCircle,
  Target,
  Code,
  ChevronRight,
  Star,
  CheckCircle,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, AlertTriangle } from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { student, loading, signOut, getTrialDaysRemaining, isTrialExpired } = useStudentAuth();

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  // Fetch courses available to the student
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["student-courses", student?.school_id],
    queryFn: async () => {
      if (!student) return [];

      // Get global courses and school-specific courses
      const { data: globalCourses, error: globalError } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .eq("is_global", true);

      if (globalError) throw globalError;

      const { data: assignedCourses, error: assignedError } = await supabase
        .from("course_school_assignments")
        .select("courses(*)")
        .eq("school_id", student.school_id);

      if (assignedError) throw assignedError;

      const schoolCourses =
        assignedCourses
          ?.map((a: any) => a.courses)
          .filter((c: any) => c?.is_published) || [];

      // Combine and deduplicate
      const allCourses = [...(globalCourses || []), ...schoolCourses];
      const uniqueCourses = allCourses.filter(
        (course, index, self) =>
          index === self.findIndex((c) => c.id === course.id)
      );

      return uniqueCourses;
    },
    enabled: !!student,
  });

  // Fetch student progress
  const { data: progress = [] } = useQuery({
    queryKey: ["student-progress", student?.id],
    queryFn: async () => {
      if (!student) return [];
      const { data, error } = await supabase
        .from("student_course_progress")
        .select("*")
        .eq("student_id", student.id);
      if (error) throw error;
      return data;
    },
    enabled: !!student,
  });

  // Fetch video progress stats
  const { data: videoStats } = useQuery({
    queryKey: ["student-video-stats", student?.id],
    queryFn: async () => {
      if (!student) return { completed: 0, total: 0 };

      // Get total videos from courses the student has access to
      const courseIds = courses.map((c: any) => c.id);
      if (courseIds.length === 0) return { completed: 0, total: 0 };

      const { data: chapters } = await supabase
        .from("chapters")
        .select("id")
        .in("course_id", courseIds)
        .eq("is_published", true);

      const chapterIds = chapters?.map((c) => c.id) || [];
      if (chapterIds.length === 0) return { completed: 0, total: 0 };

      const { count: totalVideos } = await supabase
        .from("chapter_videos")
        .select("*", { count: "exact", head: true })
        .in("chapter_id", chapterIds)
        .eq("is_published", true);

      const { data: completedVideos } = await supabase
        .from("student_video_progress")
        .select("*")
        .eq("student_id", student.id)
        .eq("is_completed", true);

      return {
        completed: completedVideos?.length || 0,
        total: totalVideos || 0,
      };
    },
    enabled: !!student && courses.length > 0,
  });

  // Fetch quiz stats
  const { data: quizStats } = useQuery({
    queryKey: ["student-quiz-stats", student?.id],
    queryFn: async () => {
      if (!student) return { passed: 0, attempted: 0, total: 0 };

      const courseIds = courses.map((c: any) => c.id);
      if (courseIds.length === 0) return { passed: 0, attempted: 0, total: 0 };

      const { data: chapters } = await supabase
        .from("chapters")
        .select("id")
        .in("course_id", courseIds)
        .eq("is_published", true);

      const chapterIds = chapters?.map((c) => c.id) || [];
      if (chapterIds.length === 0) return { passed: 0, attempted: 0, total: 0 };

      const { count: totalQuizzes } = await supabase
        .from("chapter_quizzes")
        .select("*", { count: "exact", head: true })
        .in("chapter_id", chapterIds)
        .eq("is_published", true);

      const { data: attempts } = await supabase
        .from("student_quiz_attempts")
        .select("quiz_id, passed")
        .eq("student_id", student.id);

      const uniqueAttempted = new Set(attempts?.map((a) => a.quiz_id)).size;
      const passed = attempts?.filter((a) => a.passed).length || 0;
      const uniquePassed = new Set(
        attempts?.filter((a) => a.passed).map((a) => a.quiz_id)
      ).size;

      return {
        passed: uniquePassed,
        attempted: uniqueAttempted,
        total: totalQuizzes || 0,
      };
    },
    enabled: !!student && courses.length > 0,
  });

  // Fetch ebook count
  const { data: ebookStats } = useQuery({
    queryKey: ["student-ebook-stats", student?.id],
    queryFn: async () => {
      if (!student) return { total: 0 };

      const courseIds = courses.map((c: any) => c.id);
      if (courseIds.length === 0) return { total: 0 };

      const { data: chapters } = await supabase
        .from("chapters")
        .select("id")
        .in("course_id", courseIds)
        .eq("is_published", true);

      const chapterIds = chapters?.map((c) => c.id) || [];
      if (chapterIds.length === 0) return { total: 0 };

      const { count: totalEbooks } = await supabase
        .from("chapter_ebooks")
        .select("*", { count: "exact", head: true })
        .in("chapter_id", chapterIds)
        .eq("is_published", true);

      return { total: totalEbooks || 0 };
    },
    enabled: !!student && courses.length > 0,
  });

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading... 🚀</div>
      </div>
    );
  }

  const videoProgress = videoStats?.total
    ? Math.round((videoStats.completed / videoStats.total) * 100)
    : 0;
  const quizProgress = quizStats?.total
    ? Math.round((quizStats.passed / quizStats.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img
              src="/src/assets/brain-logo.png"
              alt="Logo"
              className="h-10 w-12"
            />
            <span className="text-2xl font-bold text-foreground hidden sm:block">
              KODE INTEL
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/compiler")}
              className="gap-2"
            >
              <Code className="h-5 w-5" />
              <span className="hidden sm:inline">Compiler</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/student/profile")}
              className="gap-2"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Trial Status Banner */}
        {student.subscription_status === 'trial' && !isTrialExpired() && (
          <Card className="mb-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Free Trial Active</p>
                    <p className="text-sm text-muted-foreground">
                      {getTrialDaysRemaining()} days remaining in your free trial
                    </p>
                  </div>
                </div>
                <Badge className="bg-amber-500 text-white">
                  {getTrialDaysRemaining()} Days Left
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trial Expired Banner */}
        {isTrialExpired() && student.subscription_status !== 'active' && (
          <Card className="mb-4 bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive/30">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Trial Expired</p>
                    <p className="text-sm text-muted-foreground">
                      Contact your school to continue learning
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Contact School
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section - Child Friendly */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Hello, {student.student_name}!
                </h1>
                <p className="text-muted-foreground text-lg">
                  Class {student.class}
                  {student.section && ` - Section ${student.section}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Dashboard */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              📊 My Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="">
                  <CardContent className="pt-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {courses.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </CardContent>
                </Card>

                <Card className="">
                  <CardContent className="pt-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {videoStats?.completed || 0}/{videoStats?.total || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Videos Watched
                    </p>
                  </CardContent>
                </Card>

                <Card className="">
                  <CardContent className="pt-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <HelpCircle className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {quizStats?.passed || 0}/{quizStats?.total || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quizzes Passed
                    </p>
                  </CardContent>
                </Card>

                <Card className="">
                  <CardContent className="pt-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {ebookStats?.total || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ebooks Available
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Circles */}
              <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium flex items-center gap-2 mb-3">
                    <Video className="h-4 w-4 text-primary" /> Video Progress
                  </span>
                  <CircularProgress
                    value={videoProgress}
                    size={100}
                    strokeWidth={10}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-primary" /> Quiz Progress
                  </span>
                  <CircularProgress
                    value={quizProgress}
                    size={100}
                    strokeWidth={10}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Courses Section */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            📚 My Courses
          </h2>

          {coursesLoading ? (
            <div className="grid gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-medium text-foreground">
                  No courses yet!
                </h3>
                <p className="text-muted-foreground text-center mt-2">
                  Ask your teacher to assign courses to your class
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => {
                const courseProgress = progress.find(
                  (p: any) => p.course_id === course.id
                );
                const isCompleted = courseProgress?.completed_at;
                const isStarted = !!courseProgress;

                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group relative"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  >
                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      {isCompleted ? (
                        <Badge className="bg-primary text-primary-foreground shadow-lg">
                          ✅ Completed
                        </Badge>
                      ) : isStarted ? (
                        <Badge className="bg-blue-500 text-white shadow-lg">
                          📖 In Progress
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500 text-white shadow-lg">
                          🆕 New
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-0">
                      {/* Thumbnail with colored accent */}
                      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        {/* Colored left border accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary" />

                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-16 w-16 text-primary/40" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-lg text-foreground line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                          {course.description ||
                            "Start learning this exciting course!"}
                        </p>

                        {/* Stats row */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold">4.8</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              {course.lesson_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <HelpCircle className="h-3 w-3" />
                              {course.quiz_count || 0}
                            </span>
                          </div>
                        </div>

                        {/* Action button */}
                        <Button
                          className="w-full rounded-full gap-2 bg-primary hover:bg-primary/90 group-hover:shadow-lg transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/student/courses/${course.id}`);
                          }}
                        >
                          {isCompleted ? (
                            <>
                              Review Course <CheckCircle className="h-4 w-4" />
                            </>
                          ) : isStarted ? (
                            <>
                              Continue Learning <Play className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Start Course <ChevronRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
