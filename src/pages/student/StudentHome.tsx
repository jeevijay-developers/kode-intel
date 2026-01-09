/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { LevelProgress } from "@/components/gamification/LevelProgress";
import { CourseCard } from "@/components/student/CourseCard";
import {
  BookOpen,
  Brain,
  Video,
  HelpCircle,
  Target,
  Trophy,
  Award,
  Flame,
  Clock,
  AlertTriangle,
  Rocket,
  Star,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OutletContext {
  student: any;
  points: any;
}

export default function StudentHome() {
  const navigate = useNavigate();
  const { student, points } = useOutletContext<OutletContext>();
  const { getTrialDaysRemaining, isTrialExpired } = useStudentAuth();
  const { badges, achievements, earnedBadgesCount, totalBadges } = useGamification(student?.id);

  const isTrial = student?.subscription_status === "trial";
  const isActive = student?.subscription_status === "active" || student?.is_active;

  // Fetch enrolled courses (courses student has started)
  const { data: enrolledCourses = [], isLoading: enrolledLoading } = useQuery({
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
        .select("*, chapters(count)")
        .eq("is_published", true)
        .ilike("title", `%Class ${classNum}%`)
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!student?.class,
  });

  // Fetch chapter counts for suggested course
  const { data: suggestedChaptersCount = 0 } = useQuery({
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

  // Stats
  const { data: videoStats } = useQuery({
    queryKey: ["student-video-stats", student?.id],
    queryFn: async () => {
      if (!student || enrolledCourses.length === 0) return { completed: 0, total: 0 };
      const courseIds = enrolledCourses.map((c: any) => c.id);
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id")
        .in("course_id", courseIds)
        .eq("is_published", true);
      const chapterIds = chapters?.map((c) => c.id) || [];
      if (chapterIds.length === 0) return { completed: 0, total: 0 };
      const { count: totalVideos } = await supabase
        .from("chapter_videos")
        .select("*", { count: "exact", head: true })
        .in("chapter_id", chapterIds)
        .eq("is_published", true);
      const { data: completedVideos } = await supabase
        .from("student_video_progress")
        .select("*")
        .eq("student_id", student.id)
        .eq("is_completed", true);
      return { completed: completedVideos?.length || 0, total: totalVideos || 0 };
    },
    enabled: !!student && enrolledCourses.length > 0,
  });

  const { data: quizStats } = useQuery({
    queryKey: ["student-quiz-stats", student?.id],
    queryFn: async () => {
      if (!student || enrolledCourses.length === 0) return { passed: 0, total: 0 };
      const courseIds = enrolledCourses.map((c: any) => c.id);
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id")
        .in("course_id", courseIds)
        .eq("is_published", true);
      const chapterIds = chapters?.map((c) => c.id) || [];
      if (chapterIds.length === 0) return { passed: 0, total: 0 };
      const { count: totalQuizzes } = await supabase
        .from("chapter_quizzes")
        .select("*", { count: "exact", head: true })
        .in("chapter_id", chapterIds)
        .eq("is_published", true);
      const { data: attempts } = await supabase
        .from("student_quiz_attempts")
        .select("quiz_id, passed")
        .eq("student_id", student.id);
      const uniquePassed = new Set(
        attempts?.filter((a) => a.passed).map((a) => a.quiz_id)
      ).size;
      return { passed: uniquePassed, total: totalQuizzes || 0 };
    },
    enabled: !!student && enrolledCourses.length > 0,
  });

  const videoProgress = videoStats?.total
    ? Math.round((videoStats.completed / videoStats.total) * 100)
    : 0;
  const quizProgress = quizStats?.total
    ? Math.round((quizStats.passed / quizStats.total) * 100)
    : 0;

  const isEnrolledInSuggested = enrolledCourses.some(
    (c: any) => c.id === suggestedCourse?.id
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Trial Banners */}
      {isTrial && !isTrialExpired() && (
        <Card className="bg-gradient-to-r from-sunny/20 via-coral/10 to-sunny/20 border-sunny/30 overflow-hidden">
          <CardContent className="py-4 px-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sunny/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-sunny" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">
                    🎉 Free Trial Active!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getTrialDaysRemaining()} days remaining • First chapter unlocked
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-sunny to-coral text-foreground font-bold px-4 py-2 text-lg">
                {getTrialDaysRemaining()} Days Left
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {isTrialExpired() && !isActive && (
        <Card className="bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive/30">
          <CardContent className="py-4 px-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-10 w-10 text-destructive" />
                <div>
                  <p className="font-bold text-foreground text-lg">Trial Expired</p>
                  <p className="text-sm text-muted-foreground">
                    Subscribe to unlock all content
                  </p>
                </div>
              </div>
              <Button variant="destructive">Upgrade Now</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome + Level */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
          <CardContent className="pt-6 pb-6 relative">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display">
                  Welcome back, {student.student_name.split(" ")[0]}! 👋
                </h1>
                <p className="text-muted-foreground text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Class {student.class}
                  {student.section && ` • Section ${student.section}`}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="bg-primary/10 border-primary/30">
                    <Rocket className="h-3 w-3 mr-1" />
                    Level {points.current_level}
                  </Badge>
                  <Badge variant="outline" className="bg-sunny/10 text-sunny border-sunny/30">
                    <Award className="h-3 w-3 mr-1" />
                    {earnedBadgesCount} Badges
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <LevelProgress
          totalPoints={points.total_points}
          currentLevel={points.current_level}
          streakDays={points.streak_days}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-3 shadow-lg">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-foreground">{enrolledCourses.length}</p>
            <p className="text-sm text-muted-foreground">My Courses</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-turquoise/5 to-turquoise/10">
          <CardContent className="pt-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Video className="h-7 w-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {videoStats?.completed || 0}
            </p>
            <p className="text-sm text-muted-foreground">Videos Watched</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-sunny/5 to-sunny/10">
          <CardContent className="pt-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sunny to-coral flex items-center justify-center mx-auto mb-3 shadow-lg">
              <HelpCircle className="h-7 w-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {quizStats?.passed || 0}
            </p>
            <p className="text-sm text-muted-foreground">Quizzes Passed</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-purple/5 to-purple/10">
          <CardContent className="pt-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple to-pink flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-foreground">{earnedBadgesCount}</p>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* My Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 font-display">
            📚 My Learning Journey
          </h2>
          {enrolledCourses.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/student/my-courses")}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>

        {enrolledLoading ? (
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
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Start Your Learning Adventure!
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Browse our amazing courses and start learning today!
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                onClick={() => navigate("/public-courses")}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.slice(0, 3).map((course: any) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={true}
                isLocked={false}
                progress={course.progress?.completed_at ? 100 : 30}
              />
            ))}
          </div>
        )}
      </div>

      {/* Suggested Course */}
      {suggestedCourse && !isEnrolledInSuggested && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2 font-display">
            <Star className="h-5 w-5 text-sunny fill-sunny" />
            Recommended for You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard
              course={suggestedCourse}
              isEnrolled={false}
              isLocked={false}
              isSuggested={true}
              chaptersCount={suggestedChaptersCount}
              onEnroll={() => navigate(`/student/course/${suggestedCourse.id}`)}
            />
          </div>
        </div>
      )}

      {/* Progress Circles */}
      {enrolledCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              📊 My Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-16 flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Video className="h-4 w-4 text-turquoise" /> Videos
                </span>
                <CircularProgress value={videoProgress} size={110} strokeWidth={10} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-coral" /> Quizzes
                </span>
                <CircularProgress value={quizProgress} size={110} strokeWidth={10} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Award className="h-5 w-5 text-sunny" /> My Badges
            </CardTitle>
            <Badge variant="outline">
              {earnedBadgesCount}/{totalBadges}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4">
            {badges.slice(0, 10).map((badge) => (
              <BadgeCard
                key={badge.id}
                name={badge.name}
                description={badge.description || undefined}
                icon={badge.icon}
                color={badge.color}
                earned={badge.earned}
                size="md"
                showName={false}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
