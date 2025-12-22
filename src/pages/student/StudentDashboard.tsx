import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  Trophy,
  Star,
  User,
  Brain,
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold text-foreground hidden sm:block">AI & CT Learning</span>
          </div>
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

        {/* Quick Stats - Large Touch Friendly Tiles */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {}}>
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{courses.length}</p>
              <p className="text-muted-foreground">Courses</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {}}>
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Play className="h-7 w-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{inProgressCourses}</p>
              <p className="text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {}}>
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{completedCourses}</p>
              <p className="text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/student/profile")}>
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Star className="h-7 w-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">0</p>
              <p className="text-muted-foreground">Badges</p>
            </CardContent>
          </Card>
        </div>

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
