import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Users,
  CheckCircle,
  Plus,
  ArrowRight,
  GraduationCap,
  Loader2,
} from "lucide-react";
import type { Institution } from "@/hooks/useInstitutionAuth";

export default function InstitutionCourses() {
  const navigate = useNavigate();
  const { institution } = useOutletContext<{ institution: Institution }>();

  // Fetch all published courses
  const { data: allCourses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("order_index");
      return data || [];
    },
  });

  // Fetch institution's course access
  const { data: courseAccess = [], isLoading: accessLoading } = useQuery({
    queryKey: ["institution-course-access", institution.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("institution_course_access")
        .select("*, courses(*)")
        .eq("institution_id", institution.id);
      return data || [];
    },
  });

  const accessedCourseIds = courseAccess.map((a: { course_id: string }) => a.course_id);
  const purchasedCourses = allCourses.filter((c: { id: string }) => accessedCourseIds.includes(c.id));
  const availableCourses = allCourses.filter((c: { id: string }) => !accessedCourseIds.includes(c.id));

  const isLoading = coursesLoading || accessLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display">Course Management</h1>
        <p className="text-muted-foreground">
          Manage course access for your institution
        </p>
      </div>

      {/* Active Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-lime" />
            Active Courses ({purchasedCourses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchasedCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No courses yet</p>
              <p className="text-muted-foreground mb-4">
                Request access to courses for your students
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchasedCourses.map((course: { id: string; title: string; description?: string; thumbnail_url?: string }) => {
                const access = courseAccess.find((a: { course_id: string }) => a.course_id === course.id);
                return (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="h-12 w-12 text-primary/50" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {course.description || "AI & Computational Thinking"}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="gap-1">
                          <Users className="h-3 w-3" />
                          {access?.student_count || 0} students
                        </Badge>
                        <Badge className="bg-lime/20 text-lime">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Available Courses ({availableCourses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableCourses.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-lime mb-4" />
              <p className="font-medium">You have access to all courses!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCourses.map((course: { id: string; title: string; description?: string; thumbnail_url?: string }) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover opacity-70" />
                    ) : (
                      <GraduationCap className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {course.description || "AI & Computational Thinking"}
                    </p>
                    <Button className="w-full gap-2" variant="outline">
                      <Plus className="h-4 w-4" />
                      Request Access
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact for More */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Need More Courses or Custom Content?</h3>
          <p className="text-muted-foreground mb-4">
            Contact us to discuss custom course packages for your institution
          </p>
          <Button className="gap-2">
            Contact Sales
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}