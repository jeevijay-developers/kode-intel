import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  BookOpen,
  TrendingUp,
  CreditCard,
  ArrowRight,
  Plus,
  Download,
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Institution } from "@/hooks/useInstitutionAuth";

export default function InstitutionDashboard() {
  const navigate = useNavigate();
  const { institution } = useOutletContext<{ institution: Institution }>();

  // Fetch student count
  const { data: studentCount = 0 } = useQuery({
    queryKey: ["institution-students-count", institution.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("institution_students")
        .select("*", { count: "exact", head: true })
        .eq("institution_id", institution.id);
      return count || 0;
    },
  });

  // Fetch course access count
  const { data: courseCount = 0 } = useQuery({
    queryKey: ["institution-courses-count", institution.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("institution_course_access")
        .select("*", { count: "exact", head: true })
        .eq("institution_id", institution.id);
      return count || 0;
    },
  });

  // Fetch recent payments
  const { data: recentPayments = [] } = useQuery({
    queryKey: ["institution-recent-payments", institution.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("institution_payments")
        .select("*")
        .eq("institution_id", institution.id)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  // Fetch top students from this institution
  const { data: topStudents = [] } = useQuery({
    queryKey: ["institution-top-students", institution.id],
    queryFn: async () => {
      // Get student IDs for this institution
      const { data: mappings } = await supabase
        .from("institution_students")
        .select("student_id")
        .eq("institution_id", institution.id)
        .limit(10);

      if (!mappings || mappings.length === 0) return [];

      const studentIds = mappings.map((m: { student_id: string }) => m.student_id);
      
      // Get students with their points
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, student_name, class")
        .in("id", studentIds);
      
      // Get points for these students
      const { data: pointsData } = await supabase
        .from("student_points")
        .select("student_id, total_points")
        .in("student_id", studentIds)
        .order("total_points", { ascending: false })
        .limit(3);
      
      // Merge data
      return (pointsData || []).map((p: { student_id: string; total_points: number }) => {
        const student = studentsData?.find((s: { id: string }) => s.id === p.student_id);
        return {
          id: p.student_id,
          name: student?.student_name || "Unknown",
          class: student?.class || "",
          points: p.total_points,
        };
      });
    },
  });

  // Calculate pending amount (simplified)
  const pendingAmount = recentPayments
    .filter((p: { status: string }) => p.status === "pending")
    .reduce((sum: number, p: { amount: number }) => sum + (p.amount || 0), 0);

  const stats = [
    {
      title: "Total Students",
      value: studentCount,
      icon: Users,
      color: "text-turquoise",
      bgColor: "bg-turquoise/10",
      action: () => navigate("/institution/students"),
    },
    {
      title: "Active Courses",
      value: courseCount,
      icon: BookOpen,
      color: "text-coral",
      bgColor: "bg-coral/10",
      action: () => navigate("/institution/courses"),
    },
    {
      title: "Completion Rate",
      value: "78%",
      icon: TrendingUp,
      color: "text-lime",
      bgColor: "bg-lime/10",
      action: () => navigate("/institution/reports"),
    },
    {
      title: "Pending Payment",
      value: `₹${pendingAmount.toLocaleString()}`,
      icon: CreditCard,
      color: "text-sunny",
      bgColor: "bg-sunny/10",
      action: () => navigate("/institution/payments"),
    },
  ];

  const quickActions = [
    { label: "Add Students", icon: Plus, onClick: () => navigate("/institution/students") },
    { label: "View Reports", icon: Download, onClick: () => navigate("/institution/reports") },
    { label: "Request Course", icon: BookOpen, onClick: () => navigate("/institution/courses") },
    { label: "Make Payment", icon: CreditCard, onClick: () => navigate("/institution/payments") },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            Welcome back, {institution.contact_person.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at {institution.institution_name}
          </p>
        </div>
        <Badge className="self-start bg-primary/10 text-primary border-primary/20">
          <Clock className="h-3 w-3 mr-1" />
          Last login: Today
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
            onClick={stat.action}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={action.onClick}
              >
                <action.icon className="h-5 w-5 text-primary" />
                <span className="text-xs sm:text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-sunny" />
              Top Performing Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentCount === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No students added yet</p>
                <Button onClick={() => navigate("/institution/students")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Students
                </Button>
              </div>
            ) : topStudents.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Students haven't earned points yet</p>
                <p className="text-sm text-muted-foreground mt-1">Points are earned by watching videos and completing quizzes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topStudents.map((student: { id: string; name: string; class: string; points: number }, index: number) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.class}</p>
                    </div>
                    <Badge variant="secondary">{student.points} pts</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-lime mb-3" />
                <p className="font-medium">No pending payments</p>
                <p className="text-sm text-muted-foreground">All dues are cleared</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPayments.slice(0, 3).map((payment: { id: string; amount: number; status: string; created_at: string }) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">₹{payment.amount?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      className={
                        payment.status === "completed"
                          ? "bg-lime/20 text-lime"
                          : payment.status === "pending"
                          ? "bg-sunny/20 text-sunny"
                          : "bg-coral/20 text-coral"
                      }
                    >
                      {payment.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {payment.status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {payment.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" onClick={() => navigate("/institution/payments")}>
                  View All Payments
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}