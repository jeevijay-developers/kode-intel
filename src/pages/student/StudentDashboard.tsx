import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  FileText,
  HelpCircle,
  LogOut,
  GraduationCap,
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
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Student Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {student.student_name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Hello, {student.student_name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Class {student.class}
            {student.section && ` - Section ${student.section}`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                  <p className="text-sm text-muted-foreground">Available Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{progress.length}</p>
                  <p className="text-sm text-muted-foreground">Courses Started</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {progress.filter((p: any) => p.completed_at).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Quizzes Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">My Courses</h2>
          {coursesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-32 bg-muted rounded-t-lg" />
                  <CardContent className="space-y-2 p-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">No courses available</h3>
                <p className="text-muted-foreground">
                  Contact your school administrator for course access
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course: any) => {
                const courseProgress = progress.find((p: any) => p.course_id === course.id);
                const isCompleted = courseProgress?.completed_at;
                const isStarted = !!courseProgress;

                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  >
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-12 w-12 text-primary/50" />
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        {isCompleted ? (
                          <Badge variant="default">Completed</Badge>
                        ) : isStarted ? (
                          <Badge variant="secondary">In Progress</Badge>
                        ) : null}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {course.description || "No description"}
                      </p>
                      {isStarted && !isCompleted && (
                        <Progress value={30} className="h-2" />
                      )}
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
