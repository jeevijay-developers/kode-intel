import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Sparkles,
  Target,
  Calendar,
  BarChart3,
  GraduationCap,
  Activity,
  Star,
  Zap,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { Institution } from "@/hooks/useInstitutionAuth";
import { useState, useEffect } from "react";

// Animated Counter Component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

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

  // Fetch all institution students with their details
  const { data: studentsWithProgress = [] } = useQuery({
    queryKey: ["institution-students-progress", institution.id],
    queryFn: async () => {
      const { data: mappings } = await supabase
        .from("institution_students")
        .select("student_id")
        .eq("institution_id", institution.id);

      if (!mappings || mappings.length === 0) return [];

      const studentIds = mappings.map((m) => m.student_id);

      const { data: students } = await supabase
        .from("students")
        .select("id, student_name, class, is_active")
        .in("id", studentIds);

      const { data: points } = await supabase
        .from("student_points")
        .select("student_id, total_points, current_level, streak_days")
        .in("student_id", studentIds);

      return (students || []).map((s) => {
        const p = points?.find((pt) => pt.student_id === s.id);
        return {
          ...s,
          total_points: p?.total_points || 0,
          current_level: p?.current_level || 1,
          streak_days: p?.streak_days || 0,
        };
      });
    },
  });

  // Top students sorted by points
  const topStudents = [...studentsWithProgress]
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 5);

  // Calculate stats
  const activeStudents = studentsWithProgress.filter((s) => s.is_active).length;
  const totalPoints = studentsWithProgress.reduce((sum, s) => sum + s.total_points, 0);
  const avgPoints = studentsWithProgress.length > 0 ? Math.round(totalPoints / studentsWithProgress.length) : 0;
  const pendingAmount = recentPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedPayments = recentPayments.filter((p) => p.status === "completed").length;

  // Mock enrollment trend data (you can replace with real data)
  const enrollmentTrend = [
    { month: "Jan", students: Math.floor(studentCount * 0.3) },
    { month: "Feb", students: Math.floor(studentCount * 0.4) },
    { month: "Mar", students: Math.floor(studentCount * 0.5) },
    { month: "Apr", students: Math.floor(studentCount * 0.65) },
    { month: "May", students: Math.floor(studentCount * 0.8) },
    { month: "Jun", students: studentCount },
  ];

  // Class distribution data
  const classDistribution = studentsWithProgress.reduce((acc, s) => {
    const cls = s.class || "Unknown";
    acc[cls] = (acc[cls] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(classDistribution).map(([name, value]) => ({
    name: `Class ${name}`,
    value,
  }));

  const pieColors = ["hsl(var(--primary))", "hsl(var(--turquoise))", "hsl(var(--coral))", "hsl(var(--sunny))", "hsl(var(--lime))", "hsl(var(--purple))"];

  const stats = [
    {
      title: "Total Students",
      value: studentCount,
      icon: Users,
      color: "text-turquoise",
      bgColor: "bg-turquoise/10",
      gradient: "from-turquoise to-lime",
      change: "+12%",
      action: () => navigate("/institution/students"),
    },
    {
      title: "Active Courses",
      value: courseCount,
      icon: BookOpen,
      color: "text-coral",
      bgColor: "bg-coral/10",
      gradient: "from-coral to-sunny",
      change: "+3",
      action: () => navigate("/institution/courses"),
    },
    {
      title: "Avg. XP Points",
      value: avgPoints,
      icon: Zap,
      color: "text-sunny",
      bgColor: "bg-sunny/10",
      gradient: "from-sunny to-coral",
      change: "+28%",
      action: () => navigate("/institution/reports"),
    },
    {
      title: "Pending Payment",
      value: `₹${pendingAmount.toLocaleString()}`,
      isString: true,
      icon: CreditCard,
      color: pendingAmount > 0 ? "text-coral" : "text-lime",
      bgColor: pendingAmount > 0 ? "bg-coral/10" : "bg-lime/10",
      gradient: pendingAmount > 0 ? "from-coral to-sunny" : "from-lime to-turquoise",
      change: pendingAmount > 0 ? "Due" : "Paid",
      action: () => navigate("/institution/payments"),
    },
  ];

  const quickActions = [
    { label: "Add Students", icon: Plus, color: "text-turquoise", onClick: () => navigate("/institution/students") },
    { label: "View Reports", icon: BarChart3, color: "text-purple", onClick: () => navigate("/institution/reports") },
    { label: "Request Course", icon: BookOpen, color: "text-coral", onClick: () => navigate("/institution/courses") },
    { label: "Make Payment", icon: CreditCard, color: "text-sunny", onClick: () => navigate("/institution/payments") },
  ];

  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good Morning" : today.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-turquoise/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-sunny/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <Sparkles className="absolute top-4 right-4 h-6 w-6 text-sunny animate-pulse" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
              <GraduationCap className="h-3 w-3 mr-1" />
              Institution Portal
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              {greeting}, {institution.contact_person.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening at <span className="font-semibold text-foreground">{institution.institution_name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-background/50">
              <Calendar className="h-3 w-3 mr-1" />
              {today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group overflow-hidden relative"
            onClick={stat.action}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {stat.isString ? stat.value : <AnimatedCounter value={stat.value as number} />}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Enrollment Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentCount === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Add students to see trends</p>
                </div>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollmentTrend}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorStudents)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Class Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-turquoise" />
              Class Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No students enrolled yet</p>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 ml-4">
                  {pieData.slice(0, 4).map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-4 flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                onClick={action.onClick}
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <action.icon className={`h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
                </div>
                <span className="text-xs sm:text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-sunny" />
                Top Performers
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/institution/students")}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {topStudents.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground mb-2">No student data yet</p>
                <Button size="sm" onClick={() => navigate("/institution/students")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Students
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {topStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-transparent hover:from-muted transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-sunny/20 text-sunny"
                        : index === 1
                        ? "bg-muted text-muted-foreground"
                        : index === 2
                        ? "bg-coral/20 text-coral"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {index === 0 ? <Star className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{student.student_name}</p>
                      <p className="text-xs text-muted-foreground">Class {student.class} • Level {student.current_level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">{student.total_points}</p>
                      <p className="text-[10px] text-muted-foreground">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Status
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/institution/payments")}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-lime/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-8 w-8 text-lime" />
                </div>
                <p className="font-medium">All Clear!</p>
                <p className="text-sm text-muted-foreground">No pending payments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Summary */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Payments</p>
                    <p className="text-lg font-bold">{recentPayments.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-lg font-bold text-lime">{completedPayments}</p>
                  </div>
                </div>

                {recentPayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        payment.status === "completed" ? "bg-lime/20" : "bg-sunny/20"
                      }`}>
                        {payment.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-lime" />
                        ) : (
                          <Clock className="h-4 w-4 text-sunny" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">₹{payment.amount?.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        payment.status === "completed"
                          ? "bg-lime/20 text-lime border-lime/30"
                          : "bg-sunny/20 text-sunny border-sunny/30"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Summary */}
      {studentCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple" />
              Institution Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Active Students</span>
                  <span className="text-sm font-semibold">{activeStudents}/{studentCount}</span>
                </div>
                <Progress value={(activeStudents / studentCount) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Course Enrollment</span>
                  <span className="text-sm font-semibold">{courseCount} courses</span>
                </div>
                <Progress value={Math.min(courseCount * 20, 100)} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Payment Completion</span>
                  <span className="text-sm font-semibold">{recentPayments.length > 0 ? Math.round((completedPayments / recentPayments.length) * 100) : 100}%</span>
                </div>
                <Progress value={recentPayments.length > 0 ? (completedPayments / recentPayments.length) * 100 : 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
