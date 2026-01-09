import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  Trophy,
  Rocket,
  Star,
  Sparkles,
  Flame,
  Target,
  ArrowRight,
  UserPlus,
  Code,
  Zap,
} from "lucide-react";
import courseBannerClass3 from "@/assets/course-banner-class3.png";
import { MascotWidget } from "@/components/dashboard/MascotWidget";
import { StatCard } from "@/components/dashboard/StatCard";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { LeaderboardMini } from "@/components/dashboard/LeaderboardMini";
import { FunFactCarousel } from "@/components/dashboard/FunFactCarousel";
import { SampleEbookViewer } from "@/components/student/SampleEbookViewer";

export default function GuestDashboard() {
  const navigate = useNavigate();

  // Mock leaderboard data for guests
  const mockLeaderboard = [
    { id: "1", name: "Alex", points: 1250, avatar: "🦊" },
    { id: "2", name: "Sara", points: 1120, avatar: "🐱" },
    { id: "3", name: "Raj", points: 980, avatar: "🐼" },
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-in">
      {/* Welcome Banner with Mascot */}
      <Card className="bg-gradient-to-br from-turquoise/20 via-primary/10 to-secondary/20 border-turquoise/30 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-turquoise/10 to-transparent rounded-tr-full" />
        
        <CardContent className="p-4 sm:p-5 lg:p-6 relative">
          <div className="flex flex-col gap-4">
            {/* Mascot Widget */}
            <MascotWidget 
              name="Explorer"
              messages={[
                "Welcome to KodeIntel! 🎉",
                "Ready to explore AI & coding? 🚀",
                "Let's learn something amazing! ✨",
                "Your adventure begins here! 🌟",
              ]}
            />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-display">
                  Welcome, Guest! 👋
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Explore Class 3 content for free • Sign up to unlock everything!
                </p>
              </div>
              <Button
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-primary to-secondary text-xs sm:text-sm shrink-0 hover:opacity-90 transition-all hover:scale-105"
                onClick={() => navigate("/student/signup")}
              >
                <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Sign Up Free
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid - Using new StatCard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="XP"
          value={0}
          icon={Star}
          color="sunny"
          size="sm"
        />
        <StatCard
          title="Streak"
          value={0}
          icon={Flame}
          suffix=" days"
          color="coral"
          size="sm"
        />
        <StatCard
          title="Courses"
          value={1}
          icon={BookOpen}
          color="turquoise"
          size="sm"
        />
        <StatCard
          title="Badges"
          value={0}
          icon={Trophy}
          color="purple"
          size="sm"
        />
      </div>

      {/* Daily Challenge */}
      <DailyChallenge
        title="Watch Your First Video"
        description="Complete a lesson to earn bonus XP!"
        reward={50}
        type="video"
        onClick={() => navigate("/guest/courses")}
      />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {/* Continue Learning - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-bounce-gentle" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div
                className="relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => navigate("/guest/courses")}
              >
                <img
                  src={courseBannerClass3}
                  alt="Class 3 Course"
                  className="w-full h-32 sm:h-40 lg:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-3 sm:p-4 lg:p-5">
                  <Badge className="mb-2 bg-turquoise/90 text-white text-xs w-fit backdrop-blur-sm">
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 fill-current" />
                    Class 3
                  </Badge>
                  <h3 className="text-white font-bold text-base sm:text-lg lg:text-xl mb-1 font-display">
                    Thinking & Smart Machines
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm line-clamp-2 mb-3">
                    Learn about AI, smart devices, and how machines think! Perfect for curious minds.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Progress value={0} className="w-24 sm:w-36 h-2" />
                      <span className="text-white/80 text-xs font-medium">0%</span>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5 bg-primary/90 backdrop-blur-sm hover:bg-primary text-xs h-8 px-3 group-hover:scale-105 transition-transform"
                    >
                      <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Start
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
              onClick={() => navigate("/guest/courses")}
            >
              <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base truncate">Explore Course</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Videos, Quizzes & More
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
              </CardContent>
            </Card>
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
                    Write & Run Code
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
              </CardContent>
            </Card>
          </div>

          {/* Sample E-Books Section */}
          <SampleEbookViewer />
        </div>

        {/* Sidebar Content */}
        <div className="space-y-3 sm:space-y-4">
          {/* Fun Facts */}
          <FunFactCarousel />

          {/* Leaderboard */}
          <div onClick={() => navigate("/guest/leaderboard")} className="cursor-pointer">
            <LeaderboardMini
              entries={mockLeaderboard}
              title="Top Learners This Week"
            />
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-purple/10 border-primary/20 overflow-hidden relative">
        {/* Sparkle decorations */}
        <Sparkles className="absolute top-3 right-3 h-5 w-5 text-sunny animate-pulse" />
        <Zap className="absolute bottom-3 left-3 h-4 w-4 text-primary opacity-50" />
        
        <CardContent className="p-4 sm:p-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-xl animate-bounce-gentle">
                <Rocket className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg font-display">
                  Unlock All Courses & Features
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sign up to access all classes (3-8), earn badges, track progress, and join the leaderboard!
                </p>
              </div>
            </div>
            <Button
              className="gap-1.5 bg-gradient-to-r from-primary to-secondary text-sm w-full sm:w-auto hover:opacity-90 transition-all hover:scale-105 shadow-lg"
              onClick={() => navigate("/student/signup")}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up Now — It's Free!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
