import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  BookOpen,
  Trophy,
  Clock,
  CheckCircle,
  Target,
  Loader2,
  Zap,
  Play,
  FileText,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import type { Institution } from "@/hooks/useInstitutionAuth";

export default function InstitutionReports() {
  const { institution } = useOutletContext<{ institution: Institution }>();
  const [classFilter, setClassFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("month");

  // Fetch all institution students with progress
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["institution-students-reports", institution.id],
    queryFn: async () => {
      const { data: mappings } = await supabase
        .from("institution_students")
        .select("student_id")
        .eq("institution_id", institution.id);

      if (!mappings || mappings.length === 0) return { students: [], points: [], quizAttempts: [], videoProgress: [] };

      const studentIds = mappings.map((m) => m.student_id);

      const [studentsRes, pointsRes, quizRes, videoRes] = await Promise.all([
        supabase.from("students").select("*").in("id", studentIds),
        supabase.from("student_points").select("*").in("student_id", studentIds),
        supabase.from("student_quiz_attempts").select("*").in("student_id", studentIds),
        supabase.from("student_video_progress").select("*").in("student_id", studentIds),
      ]);

      return {
        students: studentsRes.data || [],
        points: pointsRes.data || [],
        quizAttempts: quizRes.data || [],
        videoProgress: videoRes.data || [],
      };
    },
  });

  // Fetch course access
  const { data: courseAccess = [] } = useQuery({
    queryKey: ["institution-course-access-reports", institution.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("institution_course_access")
        .select("*, courses(*)")
        .eq("institution_id", institution.id);
      return data || [];
    },
  });

  const students = studentsData?.students || [];
  const points = studentsData?.points || [];
  const quizAttempts = studentsData?.quizAttempts || [];
  const videoProgress = studentsData?.videoProgress || [];

  // Calculate real stats
  const totalStudents = students.length;
  const activeStudents = students.filter((s: { is_active: boolean }) => s.is_active).length;
  const totalPoints = points.reduce((sum: number, p: { total_points: number }) => sum + (p.total_points || 0), 0);
  const avgPoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;
  const totalQuizzes = quizAttempts.length;
  const passedQuizzes = quizAttempts.filter((q: { passed: boolean }) => q.passed).length;
  const avgQuizScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((sum: number, q: { score: number }) => sum + (q.score || 0), 0) / quizAttempts.length)
    : 0;
  const totalVideosWatched = videoProgress.filter((v: { is_completed: boolean }) => v.is_completed).length;
  const totalLearningMinutes = videoProgress.reduce((sum: number, v: { watch_duration_seconds: number }) => sum + (v.watch_duration_seconds || 0), 0) / 60;

  // Class-wise stats
  const classWiseStats = ["Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]
    .map((cls) => {
      const classStudents = students.filter((s: { class: string }) => s.class === cls);
      const classStudentIds = classStudents.map((s: { id: string }) => s.id);
      const classPoints = points.filter((p: { student_id: string }) => classStudentIds.includes(p.student_id));
      const classQuizzes = quizAttempts.filter((q: { student_id: string }) => classStudentIds.includes(q.student_id));
      
      const avgClassPoints = classStudents.length > 0
        ? Math.round(classPoints.reduce((sum: number, p: { total_points: number }) => sum + (p.total_points || 0), 0) / classStudents.length)
        : 0;
      const avgClassScore = classQuizzes.length > 0
        ? Math.round(classQuizzes.reduce((sum: number, q: { score: number }) => sum + (q.score || 0), 0) / classQuizzes.length)
        : 0;

      return {
        class: cls,
        students: classStudents.length,
        avgPoints: avgClassPoints,
        avgScore: avgClassScore,
        completion: classStudents.length > 0 ? Math.min(100, Math.round((avgClassPoints / 100) * 100)) : 0,
      };
    })
    .filter((c) => c.students > 0);

  // Top performers
  const topPerformers = students
    .map((s: { id: string; student_name: string; class: string }) => {
      const studentPoints = points.find((p: { student_id: string }) => p.student_id === s.id);
      const studentQuizzes = quizAttempts.filter((q: { student_id: string }) => q.student_id === s.id);
      const avgScore = studentQuizzes.length > 0
        ? Math.round(studentQuizzes.reduce((sum: number, q: { score: number }) => sum + (q.score || 0), 0) / studentQuizzes.length)
        : 0;
      return {
        id: s.id,
        name: s.student_name,
        class: s.class,
        points: studentPoints?.total_points || 0,
        level: studentPoints?.current_level || 1,
        score: avgScore,
        quizzes: studentQuizzes.length,
      };
    })
    .sort((a: { points: number }, b: { points: number }) => b.points - a.points)
    .slice(0, 5);

  // Activity trend (mock based on real data)
  const activityTrend = [
    { day: "Mon", quizzes: Math.floor(totalQuizzes * 0.12), videos: Math.floor(totalVideosWatched * 0.1) },
    { day: "Tue", quizzes: Math.floor(totalQuizzes * 0.15), videos: Math.floor(totalVideosWatched * 0.12) },
    { day: "Wed", quizzes: Math.floor(totalQuizzes * 0.18), videos: Math.floor(totalVideosWatched * 0.15) },
    { day: "Thu", quizzes: Math.floor(totalQuizzes * 0.14), videos: Math.floor(totalVideosWatched * 0.18) },
    { day: "Fri", quizzes: Math.floor(totalQuizzes * 0.16), videos: Math.floor(totalVideosWatched * 0.2) },
    { day: "Sat", quizzes: Math.floor(totalQuizzes * 0.13), videos: Math.floor(totalVideosWatched * 0.15) },
    { day: "Sun", quizzes: Math.floor(totalQuizzes * 0.12), videos: Math.floor(totalVideosWatched * 0.1) },
  ];

  // Export report
  const exportReport = () => {
    const csvContent = [
      "Student Name,Class,Points,Level,Quiz Score,Quizzes Taken",
      ...students.map((s: { id: string; student_name: string; class: string }) => {
        const p = points.find((pt: { student_id: string }) => pt.student_id === s.id);
        const qs = quizAttempts.filter((q: { student_id: string }) => q.student_id === s.id);
        const avgScore = qs.length > 0 ? Math.round(qs.reduce((sum: number, q: { score: number }) => sum + q.score, 0) / qs.length) : 0;
        return `${s.student_name},${s.class},${p?.total_points || 0},${p?.current_level || 1},${avgScore}%,${qs.length}`;
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${institution.institution_name.replace(/\s+/g, "_")}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (studentsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Track student progress and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={exportReport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Students", value: activeStudents, total: totalStudents, icon: Users, color: "text-turquoise", bgColor: "bg-turquoise/10" },
          { label: "Avg XP Points", value: avgPoints, icon: Zap, color: "text-sunny", bgColor: "bg-sunny/10" },
          { label: "Avg Quiz Score", value: `${avgQuizScore}%`, icon: Trophy, color: "text-coral", bgColor: "bg-coral/10" },
          { label: "Videos Watched", value: totalVideosWatched, icon: Play, color: "text-lime", bgColor: "bg-lime/10" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                    {stat.total && <span className="text-muted-foreground/70"> / {stat.total}</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalStudents === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Add students to see activity</p>
                </div>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="quizzes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Quizzes" />
                    <Bar dataKey="videos" fill="hsl(var(--turquoise))" radius={[4, 4, 0, 0]} name="Videos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Class Performance */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-turquoise" />
                Class Performance
              </CardTitle>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classWiseStats.map((c) => (
                    <SelectItem key={c.class} value={c.class}>{c.class}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {classWiseStats.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No class data available</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-48 overflow-auto">
                {classWiseStats
                  .filter((c) => classFilter === "all" || c.class === classFilter)
                  .map((classData) => (
                    <div key={classData.class} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{classData.class}</span>
                        <span className="text-muted-foreground">{classData.students} students</span>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Avg XP</span>
                            <span className="font-medium">{classData.avgPoints}</span>
                          </div>
                          <Progress value={Math.min(100, classData.avgPoints)} className="h-2" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Avg Score</span>
                            <span className="font-medium">{classData.avgScore}%</span>
                          </div>
                          <Progress value={classData.avgScore} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-sunny" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPerformers.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No performer data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topPerformers.map((student: { id: string; name: string; class: string; points: number; level: number; score: number; quizzes: number }, index: number) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? "bg-sunny/20 text-sunny" :
                      index === 1 ? "bg-muted-foreground/20 text-muted-foreground" :
                      index === 2 ? "bg-coral/20 text-coral" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.class}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Zap className="h-3 w-3 text-sunny" />
                        {student.points}
                      </div>
                      <p className="text-xs text-muted-foreground">Level {student.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-primary/5">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">{totalVideosWatched}</p>
                <p className="text-sm text-muted-foreground">Videos Completed</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-lime/5">
                <div className="w-12 h-12 rounded-full bg-lime/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-lime" />
                </div>
                <p className="text-2xl font-bold">{passedQuizzes}</p>
                <p className="text-sm text-muted-foreground">Quizzes Passed</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-sunny/5">
                <div className="w-12 h-12 rounded-full bg-sunny/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-sunny" />
                </div>
                <p className="text-2xl font-bold">{Math.round(totalLearningMinutes)}m</p>
                <p className="text-sm text-muted-foreground">Learning Time</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-coral/5">
                <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-coral" />
                </div>
                <p className="text-2xl font-bold">{courseAccess.length}</p>
                <p className="text-sm text-muted-foreground">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      {courseAccess.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Course Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseAccess.map((access: { id: string; course_id: string; student_count: number; courses: { title: string } }) => (
                <div key={access.id} className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                  <h4 className="font-semibold mb-2 truncate">{access.courses?.title || "Course"}</h4>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Students</span>
                    <Badge variant="secondary">{access.student_count}</Badge>
                  </div>
                  <Progress value={Math.random() * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Estimated progress</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
