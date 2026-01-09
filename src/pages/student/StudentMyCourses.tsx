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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground font-display flex items-center gap-2">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
            <span className="truncate">My Courses</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {isTrial ? "Trial: Ch.1 unlocked" : "Continue learning"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/public-courses")}
          className="gap-1 sm:gap-2 shrink-0 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
        >
          <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Browse</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="h-24 sm:h-36 bg-muted rounded-t-xl" />
                <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-4 sm:h-5 bg-muted rounded w-3/4" />
                  <div className="h-3 sm:h-4 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : enrolledCourses.length === 0 ? (
        <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2">
          <CardContent className="py-10 sm:py-16 text-center px-3">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
              No Courses Yet!
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto">
              Start your coding adventure by enrolling in a course!
            </p>

            {/* Suggested Course */}
            {suggestedCourse && (
              <div className="max-w-xs sm:max-w-sm mx-auto mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 flex items-center justify-center gap-2">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-sunny fill-sunny" />
                  For Class {student.class}
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
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => navigate("/public-courses")}
            >
              <BookOpen className="h-4 w-4 mr-1.5" />
              Browse All
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
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
            <div className="mt-6 sm:mt-8">
              <h2 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-sunny fill-sunny" />
                Recommended
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
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
