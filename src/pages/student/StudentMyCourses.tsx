/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/student/CourseCard";
import { MobileCourseCard } from "@/components/dashboard/MobileCourseCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Sparkles,
  Star,
  ShoppingBag,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

interface OutletContext {
  student: any;
  points: any;
}

export default function StudentMyCourses() {
  const navigate = useNavigate();
  const { student } = useOutletContext<OutletContext>();

  const isTrial = student?.subscription_status === "trial";

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
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground font-display flex items-center gap-2">
            <GraduationCap className="h-5 w-5 lg:h-6 lg:w-6 text-primary shrink-0" />
            <span className="truncate">My Courses</span>
          </h1>
          <p className="text-xs lg:text-sm text-muted-foreground">
            {isTrial ? "Trial: Chapter 1 unlocked" : "Continue learning"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/public-courses")}
          className="gap-1.5 shrink-0 h-9 text-sm rounded-full"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Browse</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 lg:h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : enrolledCourses.length === 0 ? (
        <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2 rounded-2xl">
          <CardContent className="py-12 lg:py-16 text-center px-4">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 lg:mb-6">
              <Sparkles className="h-10 w-10 lg:h-12 lg:w-12 text-primary" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2 lg:mb-3">
              No Courses Yet!
            </h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-6 lg:mb-8 max-w-md mx-auto">
              Start your coding adventure by enrolling in a course!
            </p>

            {/* Suggested Course */}
            {suggestedCourse && (
              <div className="max-w-sm mx-auto mb-4 lg:mb-6">
                <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-2">
                  <Star className="h-4 w-4 text-sunny fill-sunny" />
                  Recommended for Class {student.class}
                </p>
                
                {/* Mobile Suggested */}
                <div className="lg:hidden">
                  <MobileCourseCard
                    id={suggestedCourse.id}
                    title={suggestedCourse.title}
                    description={suggestedCourse.description}
                    thumbnail={suggestedCourse.thumbnail_url}
                    isCompleted={false}
                    isStarted={false}
                    onClick={() => navigate(`/student/courses/${suggestedCourse.id}`)}
                  />
                </div>
                
                {/* Desktop Suggested */}
                <div className="hidden lg:block">
                  <CourseCard
                    course={suggestedCourse}
                    isEnrolled={false}
                    isLocked={false}
                    isSuggested={true}
                    chaptersCount={chaptersCount}
                    onEnroll={() => navigate(`/student/courses/${suggestedCourse.id}`)}
                  />
                </div>
              </div>
            )}

            <Button
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-full px-6"
              onClick={() => navigate("/public-courses")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Browse All Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Course List */}
          <div className="lg:hidden space-y-3">
            {enrolledCourses.map((course: any) => (
              <MobileCourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                thumbnail={course.thumbnail_url}
                isCompleted={!!course.progress?.completed_at}
                isStarted={true}
                onClick={() => navigate(`/student/courses/${course.id}`)}
              />
            ))}
          </div>

          {/* Desktop Course Grid */}
          <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
            <div className="mt-6 lg:mt-8">
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-sunny fill-sunny" />
                Recommended for You
              </h2>
              
              {/* Mobile */}
              <div className="lg:hidden">
                <MobileCourseCard
                  id={suggestedCourse.id}
                  title={suggestedCourse.title}
                  description={suggestedCourse.description}
                  thumbnail={suggestedCourse.thumbnail_url}
                  isCompleted={false}
                  isStarted={false}
                  onClick={() => navigate(`/student/courses/${suggestedCourse.id}`)}
                />
              </div>
              
              {/* Desktop */}
              <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <CourseCard
                  course={suggestedCourse}
                  isEnrolled={false}
                  isLocked={false}
                  isSuggested={true}
                  chaptersCount={chaptersCount}
                  onEnroll={() => navigate(`/student/courses/${suggestedCourse.id}`)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
