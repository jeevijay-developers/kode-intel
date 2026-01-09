/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/student/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Sparkles,
  Star,
  ShoppingBag,
} from "lucide-react";

interface OutletContext {
  student: any;
  points: any;
}

export default function StudentMyCourses() {
  const navigate = useNavigate();
  const { student } = useOutletContext<OutletContext>();

  const isTrial = student?.subscription_status === "trial";
  const isActive = student?.subscription_status === "active" || student?.is_active;

  // Fetch enrolled courses
  const { data: enrolledCourses = [], isLoading } = useQuery({
    queryKey: ["enrolled-courses", student?.id],
    queryFn: async () => {
      if (!student) return [];
      const { data } = await supabase
        .from("student_course_progress")
        .select("*, courses(*)")
        .eq("student_id", student.id);
      return data?.map((p: any) => ({ ...p.courses, progress: p })) || [];
    },
    enabled: !!student,
  });

  // Fetch suggested course based on class
  const { data: suggestedCourse } = useQuery({
    queryKey: ["suggested-course", student?.class],
    queryFn: async () => {
      if (!student?.class) return null;
      const classNum = parseInt(student.class) || 0;
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .ilike("title", `%Class ${classNum}%`)
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!student?.class,
  });

  // Fetch chapter counts
  const { data: chaptersCount = 0 } = useQuery({
    queryKey: ["chapters-count", suggestedCourse?.id],
    queryFn: async () => {
      if (!suggestedCourse?.id) return 0;
      const { count } = await supabase
        .from("chapters")
        .select("*", { count: "exact", head: true })
        .eq("course_id", suggestedCourse.id)
        .eq("is_published", true);
      return count || 0;
    },
    enabled: !!suggestedCourse?.id,
  });

  const isEnrolledInSuggested = enrolledCourses.some(
    (c: any) => c.id === suggestedCourse?.id
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display flex items-center gap-2">
            📚 My Courses
          </h1>
          <p className="text-muted-foreground">
            {isTrial
              ? "Trial: First chapter unlocked in each course"
              : "Continue your learning journey"}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/public-courses")}
          className="gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          Browse More
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="h-36 bg-muted rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : enrolledCourses.length === 0 ? (
        <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2">
          <CardContent className="py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No Courses Yet!
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start your coding adventure by enrolling in a course. We have
              amazing content waiting for you!
            </p>

            {/* Suggested Course */}
            {suggestedCourse && (
              <div className="max-w-sm mx-auto mb-6">
                <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-2">
                  <Star className="h-4 w-4 text-sunny fill-sunny" />
                  Recommended for Class {student.class}
                </p>
                <CourseCard
                  course={suggestedCourse}
                  isEnrolled={false}
                  isLocked={false}
                  isSuggested={true}
                  chaptersCount={chaptersCount}
                  onEnroll={() => navigate(`/student/course/${suggestedCourse.id}`)}
                />
              </div>
            )}

            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => navigate("/public-courses")}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Browse All Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course: any) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={true}
                isLocked={false}
                progress={course.progress?.completed_at ? 100 : 30}
              />
            ))}
          </div>

          {/* Suggested Course if not enrolled */}
          {suggestedCourse && !isEnrolledInSuggested && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-sunny fill-sunny" />
                Recommended for You
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CourseCard
                  course={suggestedCourse}
                  isEnrolled={false}
                  isLocked={false}
                  isSuggested={true}
                  chaptersCount={chaptersCount}
                  onEnroll={() => navigate(`/student/course/${suggestedCourse.id}`)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
