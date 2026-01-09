/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { LevelProgress } from "@/components/gamification/LevelProgress";
import { CourseCard } from "@/components/student/CourseCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { MascotWidget } from "@/components/dashboard/MascotWidget";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
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
  Code,
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

  // Fetch enrolled courses
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

  // Fetch suggested course
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

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = student.student_name.split(" ")[0];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Trial Banners */}
      {isTrial && !isTrialExpired() && (
        <Card className="bg-gradient-to-r from-sunny/20 via-coral/10 to-sunny/20 border-sunny/30 overflow-hidden animate-fade-in">
          <CardContent className="py-3 sm:py-4 px-4 sm:px-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sunny/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-sunny" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm sm:text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-sunny" />
                    Free Trial Active
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {getTrialDaysRemaining()} days remaining • First chapter unlocked
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-sunny to-coral text-foreground font-bold px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-lg">
                {getTrialDaysRemaining()} Days Left
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {isTrialExpired() && !isActive && (
        <Card className="bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive/30">
          <CardContent className="py-3 sm:py-4 px-4 sm:px-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive" />
                <div>
                  <p className="font-bold text-foreground text-sm sm:text-lg">Trial Expired</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Subscribe to unlock all content
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm">Upgrade Now</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome + Mascot + Level */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-6">
        <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
          <CardContent className="p-3 sm:p-6 relative">
            {/* Mascot Widget */}
            <MascotWidget 
              name={firstName}
              messages={[
                `${getGreeting()}! Ready to learn? 🚀`,
                "You're making great progress! 💪",
                "Keep up the amazing work! ⭐",
                "Every lesson counts! 🎯",
              ]}
              className="mb-3 sm:mb-4"
            />
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shrink-0">
                <Brain className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground font-display truncate">
                  {getGreeting()}, {firstName}! 👋
                </h1>
                <p className="text-muted-foreground text-sm sm:text-lg flex items-center gap-1 sm:gap-2">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span className="truncate">Class {student.class}{student.section && ` • ${student.section}`}</span>
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 flex-wrap">
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-xs sm:text-sm px-1.5 sm:px-2.5 py-0.5">
                    <Rocket className="h-3 w-3 mr-0.5 sm:mr-1" />
                    Lv.{points.current_level}
                  </Badge>
                  <Badge variant="outline" className="bg-sunny/10 text-sunny border-sunny/30 text-xs sm:text-sm px-1.5 sm:px-2.5 py-0.5">
                    <Award className="h-3 w-3 mr-0.5 sm:mr-1" />
                    {earnedBadgesCount} Badges
                  </Badge>
                  {points.streak_days > 0 && (
                    <Badge variant="outline" className="bg-coral/10 text-coral border-coral/30 text-xs sm:text-sm px-1.5 sm:px-2.5 py-0.5 animate-pulse">
                      <Flame className="h-3 w-3 mr-0.5 sm:mr-1" />
                      {points.streak_days} Day Streak 🔥
                    </Badge>
                  )}
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

      {/* Quick Stats with new StatCard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <StatCard
          title="Courses"
          value={enrolledCourses.length}
          icon={BookOpen}
          color="primary"
        />
        <StatCard
          title="Videos"
          value={videoStats?.completed || 0}
          icon={Video}
          color="turquoise"
        />
        <StatCard
          title="Quizzes"
          value={quizStats?.passed || 0}
          icon={HelpCircle}
          color="sunny"
        />
        <StatCard
          title="Badges"
          value={earnedBadgesCount}
          icon={Trophy}
          color="purple"
        />
      </div>

      {/* Daily Challenge */}
      <DailyChallenge
        title="Complete Today's Lesson"
        description="Watch a video or pass a quiz to keep your streak!"
        reward={25}
        type="streak"
        progress={points.streak_days > 0 ? 1 : 0}
        maxProgress={1}
        isCompleted={points.streak_days > 0}
        onClick={() => enrolledCourses.length > 0 ? navigate(`/student/course/${enrolledCourses[0].id}`) : navigate("/public-courses")}
      />

      {/* My Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-xl font-bold text-foreground flex items-center gap-2 font-display">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            My Courses
          </h2>
          {enrolledCourses.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-8" onClick={() => navigate("/student/my-courses")}>
              All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          )}
        </div>

        {enrolledLoading ? (
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
            <CardContent className="py-8 sm:py-12 text-center px-3">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Sparkles className="h-7 w-7 sm:h-10 sm:w-10 text-primary animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 font-display">
                Start Learning!
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
                Browse courses and start your journey!
              </p>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                onClick={() => navigate("/public-courses")}
              >
                <BookOpen className="h-4 w-4 mr-1.5" />
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
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
          <h2 className="text-base sm:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2 font-display">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-sunny fill-sunny" />
            Recommended For You
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
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

      {/* Progress Overview */}
      {enrolledCourses.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="flex items-center justify-around gap-4 sm:gap-8">
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 text-muted-foreground">
                  <Video className="h-3 w-3 sm:h-4 sm:w-4 text-turquoise" /> Videos
                </span>
                <ProgressRing 
                  value={videoProgress} 
                  size={80} 
                  strokeWidth={8}
                  color="turquoise"
                  className="sm:hidden"
                />
                <ProgressRing 
                  value={videoProgress} 
                  size={120} 
                  strokeWidth={10}
                  color="turquoise"
                  className="hidden sm:block"
                />
                <span className="text-xs text-muted-foreground mt-2">
                  {videoStats?.completed || 0}/{videoStats?.total || 0}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 text-muted-foreground">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-coral" /> Quizzes
                </span>
                <ProgressRing 
                  value={quizProgress} 
                  size={80} 
                  strokeWidth={8}
                  color="coral"
                  className="sm:hidden"
                />
                <ProgressRing 
                  value={quizProgress} 
                  size={120} 
                  strokeWidth={10}
                  color="coral"
                  className="hidden sm:block"
                />
                <span className="text-xs text-muted-foreground mt-2">
                  {quizStats?.passed || 0}/{quizStats?.total || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges Section */}
      {badges.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-xl font-bold text-foreground flex items-center gap-2 font-display">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-sunny" />
              Your Badges
            </h2>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-8">
              All Badges <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {badges.slice(0, 6).map((badge: any) => (
              <BadgeCard
                key={badge.id}
                name={badge.name}
                description={badge.description}
                icon={badge.icon}
                color={badge.color}
                earned={badge.earned}
                size="sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <Card
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group bg-gradient-to-br from-turquoise/5 to-turquoise/10 border-turquoise/20"
          onClick={() => navigate("/compiler")}
        >
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm sm:text-base truncate">Code Lab</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Practice coding
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group bg-gradient-to-br from-purple/5 to-purple/10 border-purple/20"
          onClick={() => navigate("/public-courses")}
        >
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple to-pink flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm sm:text-base truncate">All Courses</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Explore more
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
