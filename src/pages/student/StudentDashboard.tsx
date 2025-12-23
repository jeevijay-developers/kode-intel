import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Play,
  Trophy,
  Star,
  User,
  Brain,
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
  Target,
  Code,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { student, loading, signOut } = useStudentAuth();

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

      const schoolCourses = assignedCourses
        ?.map((a: any) => a.courses)
        .filter((c: any) => c?.is_published) || [];

      // Combine and deduplicate
      const allCourses = [...(globalCourses || []), ...schoolCourses];
      const uniqueCourses = allCourses.filter(
        (course, index, self) => index === self.findIndex((c) => c.id === course.id)
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
      
      const chapterIds = chapters?.map(c => c.id) || [];
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

      return { completed: completedVideos?.length || 0, total: totalVideos || 0 };
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
      
      const chapterIds = chapters?.map(c => c.id) || [];
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

      const uniqueAttempted = new Set(attempts?.map(a => a.quiz_id)).size;
      const passed = attempts?.filter(a => a.passed).length || 0;
      const uniquePassed = new Set(attempts?.filter(a => a.passed).map(a => a.quiz_id)).size;

      return { passed: uniquePassed, attempted: uniqueAttempted, total: totalQuizzes || 0 };
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
      
      const chapterIds = chapters?.map(c => c.id) || [];
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

  const handleSignOut = () => {
    signOut();
    navigate("/student/login");
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading... 🚀</div>
      </div>
    );
  }

  const completedCourses = progress.filter((p: any) => p.completed_at).length;
  const inProgressCourses = progress.filter((p: any) => !p.completed_at).length;
  const videoProgress = videoStats?.total ? Math.round((videoStats.completed / videoStats.total) * 100) : 0;
  const quizProgress = quizStats?.total ? Math.round((quizStats.passed / quizStats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold text-foreground hidden sm:block">AI & CT Learning</span>
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
        {/* Welcome Section - Child Friendly */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-3xl">👋</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Hello, {student.student_name}!
                </h1>
                <p className="text-muted-foreground text-lg">
                  Class {student.class}{student.section && ` - Section ${student.section}`}
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
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="ebooks">Ebooks</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                      <p className="text-sm text-muted-foreground">Courses</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {videoStats?.completed || 0}/{videoStats?.total || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Videos Watched</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <HelpCircle className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {quizStats?.passed || 0}/{quizStats?.total || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Quizzes Passed</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{ebookStats?.total || 0}</p>
                      <p className="text-sm text-muted-foreground">Ebooks Available</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4 pt-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" /> Video Progress
                      </span>
                      <span className="text-sm text-muted-foreground">{videoProgress}%</span>
                    </div>
                    <Progress value={videoProgress} className="h-3" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" /> Quiz Progress
                      </span>
                      <span className="text-sm text-muted-foreground">{quizProgress}%</span>
                    </div>
                    <Progress value={quizProgress} className="h-3" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="videos" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{videoStats?.completed || 0}</div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Videos Completed
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl font-bold text-foreground mb-2">{videoStats?.total || 0}</div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Video className="h-5 w-5" />
                        Total Videos
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-primary font-bold">{videoProgress}%</span>
                  </div>
                  <Progress value={videoProgress} className="h-4" />
                </div>
                {videoStats?.completed === videoStats?.total && videoStats?.total > 0 && (
                  <div className="text-center py-4 bg-primary/10 rounded-xl">
                    <Trophy className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="font-bold text-lg">All Videos Completed! 🎉</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="quizzes" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{quizStats?.passed || 0}</div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Trophy className="h-5 w-5 text-primary" />
                        Passed
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl font-bold text-foreground mb-2">{quizStats?.attempted || 0}</div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Target className="h-5 w-5" />
                        Attempted
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl font-bold text-muted-foreground mb-2">{quizStats?.total || 0}</div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <HelpCircle className="h-5 w-5" />
                        Total
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Pass Rate</span>
                    <span className="text-primary font-bold">{quizProgress}%</span>
                  </div>
                  <Progress value={quizProgress} className="h-4" />
                </div>
                {quizStats?.passed === quizStats?.total && quizStats?.total > 0 && (
                  <div className="text-center py-4 bg-primary/10 rounded-xl">
                    <Star className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="font-bold text-lg">All Quizzes Passed! 🌟</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ebooks" className="space-y-4">
                <Card className="bg-muted/50">
                  <CardContent className="pt-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2">{ebookStats?.total || 0}</div>
                    <p className="text-muted-foreground">Ebooks Available to Read</p>
                  </CardContent>
                </Card>
                <p className="text-center text-muted-foreground">
                  Explore your courses to access digital books and reading materials!
                </p>
              </TabsContent>
            </Tabs>
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
                <h3 className="text-xl font-medium text-foreground">No courses yet!</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Ask your teacher to assign courses to your class
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {courses.map((course: any) => {
                const courseProgress = progress.find((p: any) => p.course_id === course.id);
                const isCompleted = courseProgress?.completed_at;
                const isStarted = !!courseProgress;

                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="w-28 h-28 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                          {course.thumbnail_url ? (
                            <img
                              src={course.thumbnail_url}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="h-10 w-10 text-primary/50" />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 py-3 pr-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                              {course.title}
                            </h3>
                            {isCompleted ? (
                              <Badge className="bg-primary/20 text-primary shrink-0">
                                ✅ Done
                              </Badge>
                            ) : isStarted ? (
                              <Badge variant="secondary" className="shrink-0">
                                📖 Learning
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="shrink-0">
                                🆕 New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {course.description || "Start learning this exciting course!"}
                          </p>
                          {isStarted && !isCompleted && (
                            <div className="mt-2">
                              <Progress value={30} className="h-2" />
                            </div>
                          )}
                        </div>
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
