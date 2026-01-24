import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import type { Institution } from "@/hooks/useInstitutionAuth";

export default function InstitutionReports() {
  const { institution } = useOutletContext<{ institution: Institution }>();
  const [classFilter, setClassFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("month");

  // Mock data for demonstration
  const overallStats = {
    totalStudents: 156,
    activeStudents: 142,
    averageCompletion: 78,
    averageScore: 85,
    totalVideosWatched: 1245,
    totalQuizzesCompleted: 892,
  };

  const classWiseStats = [
    { class: "Class 3", students: 24, completion: 82, avgScore: 88 },
    { class: "Class 4", students: 22, completion: 79, avgScore: 85 },
    { class: "Class 5", students: 20, completion: 75, avgScore: 82 },
    { class: "Class 6", students: 18, completion: 72, avgScore: 80 },
    { class: "Class 7", students: 20, completion: 78, avgScore: 84 },
    { class: "Class 8", students: 18, completion: 80, avgScore: 86 },
    { class: "Class 9", students: 16, completion: 76, avgScore: 83 },
    { class: "Class 10", students: 18, completion: 74, avgScore: 81 },
  ];

  const topPerformers = [
    { name: "Aarav Sharma", class: "Class 5", score: 98, badges: 12 },
    { name: "Priya Patel", class: "Class 6", score: 96, badges: 10 },
    { name: "Rahul Kumar", class: "Class 4", score: 95, badges: 11 },
    { name: "Ananya Singh", class: "Class 7", score: 94, badges: 9 },
    { name: "Vikram Reddy", class: "Class 5", score: 93, badges: 8 },
  ];

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
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Students", value: overallStats.activeStudents, icon: Users, color: "text-turquoise" },
          { label: "Avg Completion", value: `${overallStats.averageCompletion}%`, icon: Target, color: "text-lime" },
          { label: "Avg Quiz Score", value: `${overallStats.averageScore}%`, icon: Trophy, color: "text-sunny" },
          { label: "Videos Watched", value: overallStats.totalVideosWatched, icon: BookOpen, color: "text-coral" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Class-wise Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Class-wise Performance
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
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                          <span>Completion</span>
                          <span className="font-medium">{classData.completion}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            style={{ width: `${classData.completion}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Avg Score</span>
                          <span className="font-medium">{classData.avgScore}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-lime to-turquoise rounded-full"
                            style={{ width: `${classData.avgScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-sunny" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((student, index) => (
                <div
                  key={student.name}
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
                    <p className="font-bold text-sm">{student.score}%</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Trophy className="h-3 w-3" />
                      {student.badges}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-primary/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold">{overallStats.totalVideosWatched}</p>
              <p className="text-sm text-muted-foreground">Videos Watched</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-lime/5">
              <div className="w-12 h-12 rounded-full bg-lime/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-lime" />
              </div>
              <p className="text-3xl font-bold">{overallStats.totalQuizzesCompleted}</p>
              <p className="text-sm text-muted-foreground">Quizzes Completed</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-sunny/5">
              <div className="w-12 h-12 rounded-full bg-sunny/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-sunny" />
              </div>
              <p className="text-3xl font-bold">245h</p>
              <p className="text-sm text-muted-foreground">Total Learning Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}