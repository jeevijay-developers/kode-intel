import { AdminLayout } from "@/components/layout/AdminLayout";
import { useSchools } from "@/hooks/useSchools";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { Building2, Users, UserCheck, UserX, BookOpen, GraduationCap, TrendingUp, Activity, Clock, ArrowRight, Plus, Settings, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: schools, isLoading: schoolsLoading } = useSchools();
  const { data: studentsResult, isLoading: studentsLoading } = useStudents(undefined, { page: 1, pageSize: 100 });
  const { courses, isLoading: coursesLoading } = useCourses();

  const totalSchools = schools?.length || 0;
  const activeSchools = schools?.filter((s) => s.is_active).length || 0;
  const totalStudents = studentsResult?.totalCount || 0;
  const activeStudents = studentsResult?.data.filter((s) => s.is_active).length || 0;
  const inactiveStudents = totalStudents - activeStudents;
  const totalCourses = courses?.length || 0;
  const publishedCourses = courses?.filter((c) => c.is_published).length || 0;

  const recentSchools = schools?.slice(0, 5) || [];
  const recentStudents = studentsResult?.data.slice(0, 5) || [];

  const isLoading = schoolsLoading || studentsLoading || coursesLoading;

  // Mock chart data
  const enrollmentData = [
    { name: "Mon", students: 12 },
    { name: "Tue", students: 19 },
    { name: "Wed", students: 15 },
    { name: "Thu", students: 25 },
    { name: "Fri", students: 22 },
    { name: "Sat", students: 8 },
    { name: "Sun", students: 5 },
  ];

  const courseCompletionData = [
    { name: "Class 3", completed: 85, enrolled: 120 },
    { name: "Class 4", completed: 65, enrolled: 100 },
    { name: "Class 5", completed: 45, enrolled: 80 },
    { name: "Class 6", completed: 30, enrolled: 60 },
  ];

  // Quick actions
  const quickActions = [
    { title: "Add School", icon: Building2, onClick: () => navigate("/schools"), color: "primary" },
    { title: "Add Student", icon: Users, onClick: () => navigate("/students"), color: "turquoise" },
    { title: "Create Course", icon: BookOpen, onClick: () => navigate("/courses"), color: "sunny" },
    { title: "Bulk Upload", icon: Upload, onClick: () => navigate("/bulk-upload"), color: "purple" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your LMS overview.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button size="sm" className="gap-1.5 bg-gradient-to-r from-primary to-secondary">
              <Plus className="h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Main Metrics */}
        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[120px]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Schools"
              value={totalSchools}
              icon={Building2}
              color="primary"
              description={`${activeSchools} active`}
            />
            <StatCard
              title="Total Students"
              value={totalStudents}
              icon={Users}
              color="turquoise"
              description="Across all schools"
            />
            <StatCard
              title="Active Students"
              value={activeStudents}
              icon={UserCheck}
              color="lime"
              description="With active access"
              trend={totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}
            />
            <StatCard
              title="Total Courses"
              value={totalCourses}
              icon={BookOpen}
              color="sunny"
              description={`${publishedCourses} published`}
            />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Enrollment Chart */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollmentData}>
                    <defs>
                      <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#enrollmentGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Course Completion */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-turquoise" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="enrolled" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" fill="hsl(var(--turquoise))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Card
                key={action.title}
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                onClick={action.onClick}
              >
                <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-${action.color} to-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{action.title}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Recent Schools
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/schools")}>
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {schoolsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-14" />
                  ))}
                </div>
              ) : recentSchools.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground text-sm">No schools added yet</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => navigate("/schools")}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add School
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentSchools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate("/schools")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{school.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {school.school_code} • {school.city}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          school.is_active
                            ? "bg-lime/10 text-lime border-lime/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        }
                      >
                        {school.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-turquoise" />
                  Recent Students
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/students")}>
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-14" />
                  ))}
                </div>
              ) : recentStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground text-sm">No students added yet</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => navigate("/students")}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Student
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate("/students")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-turquoise/10 flex items-center justify-center">
                          <GraduationCap className="h-4 w-4 text-turquoise" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{student.student_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Class {student.class}
                            {student.section ? `-${student.section}` : ""} • {student.schools?.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          student.is_active
                            ? "bg-lime/10 text-lime border-lime/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        }
                      >
                        {student.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary">
                  <AnimatedCounter value={totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0} suffix="%" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Active Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-turquoise">
                  <AnimatedCounter value={publishedCourses} />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Live Courses</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-sunny">
                  <AnimatedCounter value={activeSchools} />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Active Schools</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-coral">
                  <AnimatedCounter value={inactiveStudents} />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Pending Activation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
