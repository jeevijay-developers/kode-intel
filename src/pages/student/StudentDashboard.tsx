/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { LevelProgress } from "@/components/gamification/LevelProgress";
import { MobileWelcomeCard } from "@/components/dashboard/MobileWelcomeCard";
import { MobileProgressSection } from "@/components/dashboard/MobileProgressSection";
import { MobileBadgesCarousel } from "@/components/dashboard/MobileBadgesCarousel";
import { MobileCourseCard } from "@/components/dashboard/MobileCourseCard";
import { MobileQuickActions } from "@/components/dashboard/MobileQuickActions";
import { MobileAchievementsPreview } from "@/components/dashboard/MobileAchievementsPreview";
import { MobileDailyStreak } from "@/components/dashboard/MobileDailyStreak";
import { StudentBottomNav } from "@/components/student/StudentBottomNav";
import {
  BookOpen,
  Play,
  User,
  Brain,
  Video,
  FileText,
  HelpCircle,
  Target,
  Code,
  ChevronRight,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trophy,
  Award,
  Flame,
  LogOut,
  Sparkles,
  Zap,
  GraduationCap,
  Rocket,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useGamification } from "@/hooks/useGamification";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import brainLogo from "@/assets/brain-logo.png";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { student, loading, signOut, getTrialDaysRemaining, isTrialExpired } = useStudentAuth();
  const { badges, achievements, points, earnedBadgesCount, totalBadges } = useGamification(student?.id);

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  // Fetch courses available to the student
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["student-courses", student?.school_id],
    queryFn: async () => {
      if (!student) return [];
      const { data: globalCourses } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .eq("is_global", true);

      const { data: assignedCourses } = await supabase
        .from("course_school_assignments")
        .select("courses(*)")
        .eq("school_id", student.school_id);

      const schoolCourses =
        assignedCourses
          ?.map((a: any) => a.courses)
          .filter((c: any) => c?.is_published) || [];

      const allCourses = [...(globalCourses || []), ...schoolCourses];
      return allCourses.filter(
        (course, index, self) =>
          index === self.findIndex((c) => c.id === course.id)
      );
    },
    enabled: !!student,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["student-progress", student?.id],
    queryFn: async () => {
      if (!student) return [];
      const { data } = await supabase
        .from("student_course_progress")
        .select("*")
        .eq("student_id", student.id);
      return data || [];
    },
    enabled: !!student,
  });

  const { data: videoStats } = useQuery({
    queryKey: ["student-video-stats", student?.id],
    queryFn: async () => {
      if (!student) return { completed: 0, total: 0 };
      const courseIds = courses.map((c: any) => c.id);
      if (courseIds.length === 0) return { completed: 0, total: 0 };
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
    enabled: !!student && courses.length > 0,
  });

  const { data: quizStats } = useQuery({
    queryKey: ["student-quiz-stats", student?.id],
    queryFn: async () => {
      if (!student) return { passed: 0, total: 0 };
      const courseIds = courses.map((c: any) => c.id);
      if (courseIds.length === 0) return { passed: 0, total: 0 };
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
    enabled: !!student && courses.length > 0,
  });

  const handleSignOut = () => {
    signOut();
    navigate("/student/login");
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 animate-bounce" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const videoProgress = videoStats?.total
    ? Math.round((videoStats.completed / videoStats.total) * 100)
    : 0;
  const quizProgress = quizStats?.total
    ? Math.round((quizStats.passed / quizStats.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header - Hidden on mobile */}
      <header className="hidden lg:flex bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img src={brainLogo} alt="Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-foreground font-display">
              Kode<span className="text-primary">Intel</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sunny/10 border border-sunny/30">
              <Star className="h-4 w-4 text-sunny fill-sunny" />
              <span className="text-sm font-bold text-sunny">{points.total_points} XP</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-coral/10 border border-coral/30">
              <Flame className="h-4 w-4 text-coral" />
              <span className="text-sm font-bold text-coral">{points.streak_days} Day</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/compiler")} className="gap-2">
              <Code className="h-5 w-5" />
              <span>Compiler</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/student/profile")} className="gap-2">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2" onClick={() => navigate("/")}>
            <img src={brainLogo} alt="Logo" className="h-8 w-8" />
            <span className="font-bold font-display">
              Kode<span className="text-primary">Intel</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/compiler")}
              className="h-9 w-9"
            >
              <Code className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut}
              className="h-9 w-9 text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 lg:py-6 space-y-4 lg:space-y-6 pb-24 lg:pb-6">
        {/* Trial Banners */}
        {student.subscription_status === 'trial' && !isTrialExpired() && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-sunny/20 to-coral/20 border border-sunny/30">
            <div className="w-10 h-10 rounded-full bg-sunny/20 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-sunny" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">Free Trial Active</p>
              <p className="text-xs text-muted-foreground">
                {getTrialDaysRemaining()} days remaining
              </p>
            </div>
            <Badge className="bg-sunny text-foreground font-bold text-xs flex-shrink-0">
              {getTrialDaysRemaining()}d
            </Badge>
          </div>
        )}

        {isTrialExpired() && student.subscription_status !== 'active' && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-destructive/20 to-destructive/10 border border-destructive/30">
            <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">Trial Expired</p>
              <p className="text-xs text-muted-foreground">Contact your school to continue</p>
            </div>
          </div>
        )}

        {/* Mobile Welcome Card */}
        <div className="lg:hidden">
          <MobileWelcomeCard
            studentName={student.student_name}
            studentClass={student.class}
            section={student.section}
            level={points.current_level}
            xp={points.total_points}
            streak={points.streak_days}
            onProfileClick={() => navigate("/student/profile")}
          />
        </div>

        {/* Desktop Welcome + Level Progress */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20 overflow-hidden">
            <CardContent className="pt-6 pb-6 relative">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display">
                    Hello, {student.student_name.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Class {student.class}
                    {student.section && ` - Section ${student.section}`}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-primary/10">
                      Level {points.current_level}
                    </Badge>
                    <Badge variant="outline" className="bg-sunny/10 text-sunny border-sunny/30">
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

        {/* Mobile Quick Actions */}
        <div className="lg:hidden">
          <MobileQuickActions
            actions={[
              {
                icon: <BookOpen className="h-5 w-5 text-white" />,
                label: "My Courses",
                description: `${courses.length} available`,
                gradient: "bg-gradient-to-br from-primary to-secondary",
                onClick: () => navigate("/student/my-courses"),
              },
              {
                icon: <Code className="h-5 w-5 text-white" />,
                label: "Code Lab",
                description: "Write & Run",
                gradient: "bg-gradient-to-br from-turquoise to-lime",
                onClick: () => navigate("/compiler"),
              },
              {
                icon: <HelpCircle className="h-5 w-5 text-white" />,
                label: "Take Quiz",
                description: `${quizStats?.passed || 0} passed`,
                gradient: "bg-gradient-to-br from-sunny to-coral",
                onClick: () => navigate("/student/quiz"),
              },
              {
                icon: <Trophy className="h-5 w-5 text-white" />,
                label: "Achievements",
                description: `${earnedBadgesCount} earned`,
                gradient: "bg-gradient-to-br from-purple to-primary",
                onClick: () => navigate("/student/achievements"),
              },
            ]}
          />
        </div>

        {/* Desktop Quick Stats */}
        <div className="hidden lg:grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
            <CardContent className="pt-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{courses.length}</p>
              <p className="text-sm text-muted-foreground">Courses</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
            <CardContent className="pt-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center mx-auto mb-2">
                <Video className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {videoStats?.completed || 0}/{videoStats?.total || 0}
              </p>
              <p className="text-sm text-muted-foreground">Videos</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
            <CardContent className="pt-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sunny to-coral flex items-center justify-center mx-auto mb-2">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {quizStats?.passed || 0}/{quizStats?.total || 0}
              </p>
              <p className="text-sm text-muted-foreground">Quizzes</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
            <CardContent className="pt-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple to-pink flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{earnedBadgesCount}</p>
              <p className="text-sm text-muted-foreground">Badges</p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Daily Streak */}
        <div className="lg:hidden">
          <MobileDailyStreak
            currentStreak={points.streak_days}
            totalXP={points.total_points}
            level={points.current_level}
          />
        </div>

        {/* Mobile Progress Section */}
        <div className="lg:hidden">
          <MobileProgressSection
            videoProgress={videoProgress}
            quizProgress={quizProgress}
            videosCompleted={videoStats?.completed || 0}
            videosTotal={videoStats?.total || 0}
            quizzesPassed={quizStats?.passed || 0}
            quizzesTotal={quizStats?.total || 0}
          />
        </div>

        {/* Desktop Progress Circles */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-5 w-5 text-primary" /> My Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-12 flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Video className="h-4 w-4 text-turquoise" /> Videos
                </span>
                <CircularProgress value={videoProgress} size={100} strokeWidth={10} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-coral" /> Quizzes
                </span>
                <CircularProgress value={quizProgress} size={100} strokeWidth={10} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Badges Carousel */}
        <div className="lg:hidden">
          <MobileBadgesCarousel
            badges={badges}
            earnedCount={earnedBadgesCount}
            totalCount={totalBadges}
          />
        </div>

        {/* Mobile Achievements Preview */}
        <div className="lg:hidden">
          <MobileAchievementsPreview
            achievements={achievements}
            completedCount={achievements.filter(a => a.completed).length}
            totalCount={achievements.length}
          />
        </div>

        {/* Desktop Badges Section */}
        <Card className="hidden lg:block">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-5 w-5 text-sunny" /> My Badges
              </CardTitle>
              <Badge variant="outline">{earnedBadgesCount}/{totalBadges}</Badge>
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

        {/* Desktop Achievements Section */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-5 w-5 text-primary" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.slice(0, 6).map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  name={achievement.name}
                  description={achievement.description || undefined}
                  icon={achievement.icon}
                  progress={achievement.progress}
                  targetValue={achievement.target_value}
                  pointsReward={achievement.points_reward}
                  completed={achievement.completed}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Courses Section */}
        <div>
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-foreground flex items-center gap-2 font-display">
              <BookOpen className="h-5 w-5 text-primary" />
              My Courses
            </h2>
            <button 
              onClick={() => navigate("/student/my-courses")}
              className="lg:hidden flex items-center gap-1 text-sm text-primary font-medium active:opacity-70 transition-opacity"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {coursesLoading ? (
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 lg:h-48 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No courses yet!</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Ask your teacher to assign courses
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Course List */}
              <div className="lg:hidden space-y-3">
                {courses.slice(0, 4).map((course: any) => {
                  const courseProgress = progress.find((p: any) => p.course_id === course.id);
                  return (
                    <MobileCourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      thumbnail={course.thumbnail_url}
                      isCompleted={!!courseProgress?.completed_at}
                      isStarted={!!courseProgress}
                      onClick={() => navigate(`/student/courses/${course.id}`)}
                    />
                  );
                })}
                {courses.length > 4 && (
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl"
                    onClick={() => navigate("/student/my-courses")}
                  >
                    View All {courses.length} Courses
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>

              {/* Desktop Course Grid */}
              <div className="hidden lg:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: any) => {
                  const courseProgress = progress.find((p: any) => p.course_id === course.id);
                  const isCompleted = courseProgress?.completed_at;
                  const isStarted = !!courseProgress;

                  return (
                    <Card
                      key={course.id}
                      className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group relative"
                      onClick={() => navigate(`/student/courses/${course.id}`)}
                    >
                      <div className="absolute top-4 right-4 z-10">
                        {isCompleted ? (
                          <Badge className="bg-primary text-primary-foreground shadow-lg">
                            <CheckCircle className="h-3 w-3 mr-1" /> Completed
                          </Badge>
                        ) : isStarted ? (
                          <Badge className="bg-turquoise text-white shadow-lg">
                            <Play className="h-3 w-3 mr-1" /> In Progress
                          </Badge>
                        ) : (
                          <Badge className="bg-sunny text-foreground shadow-lg">
                            <Sparkles className="h-3 w-3 mr-1" /> New
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-0">
                        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-primary to-secondary" />
                          {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="h-16 w-16 text-primary/40" />
                          )}
                        </div>

                        <div className="p-5 space-y-3">
                          <h3 className="font-bold text-lg text-foreground line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                            {course.description || "Start learning this exciting course!"}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-sunny text-sunny" />
                              <span className="text-sm font-semibold">4.8</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" /> 6 Chapters
                              </span>
                            </div>
                          </div>

                          <Button
                            className="w-full rounded-full gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/student/courses/${course.id}`);
                            }}
                          >
                            {isCompleted ? (
                              <>Review Course <CheckCircle className="h-4 w-4" /></>
                            ) : isStarted ? (
                              <>Continue <Play className="h-4 w-4" /></>
                            ) : (
                              <>Start Course <ChevronRight className="h-4 w-4" /></>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <StudentBottomNav />
    </div>
  );
}
