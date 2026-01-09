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
} from "lucide-react";
import courseBannerClass3 from "@/assets/course-banner-class3.png";

export default function GuestDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-turquoise/20 via-primary/10 to-secondary/20 border-turquoise/30 overflow-hidden">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-turquoise to-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  Welcome, Guest! 👋
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Explore Class 3 content for free
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="gap-1.5 bg-gradient-to-r from-primary to-secondary text-xs sm:text-sm shrink-0"
              onClick={() => navigate("/student/signup")}
            >
              <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Sign Up for Full Access
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <Card className="bg-gradient-to-br from-sunny/10 to-sunny/5 border-sunny/20">
          <CardContent className="p-2.5 sm:p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-sunny fill-sunny" />
              <span className="text-xs sm:text-sm text-muted-foreground">XP</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-sunny">0</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-coral/10 to-coral/5 border-coral/20">
          <CardContent className="p-2.5 sm:p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-coral" />
              <span className="text-xs sm:text-sm text-muted-foreground">Streak</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-coral">0 days</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-turquoise/10 to-turquoise/5 border-turquoise/20">
          <CardContent className="p-2.5 sm:p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-turquoise" />
              <span className="text-xs sm:text-sm text-muted-foreground">Courses</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-turquoise">1</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-2.5 sm:p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Badges</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
          <div
            className="relative rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => navigate("/guest/courses")}
          >
            <img
              src={courseBannerClass3}
              alt="Class 3 Course"
              className="w-full h-28 sm:h-36 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3 sm:p-4">
              <Badge className="mb-1.5 sm:mb-2 bg-turquoise/80 text-white text-xs w-fit">
                <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 fill-current" />
                Class 3
              </Badge>
              <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1">
                Thinking & Smart Machines
              </h3>
              <p className="text-white/80 text-xs sm:text-sm line-clamp-1 mb-2">
                Learn about AI, smart devices, and how machines think!
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Progress value={0} className="w-20 sm:w-32 h-1.5 sm:h-2" />
                  <span className="text-white/80 text-xs">0%</span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-1 text-xs h-7 px-2 sm:h-8 sm:px-3"
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
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
          onClick={() => navigate("/guest/courses")}
        >
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-xs sm:text-sm truncate">View Course</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Class 3 content
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
          onClick={() => navigate("/compiler")}
        >
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-turquoise/10 flex items-center justify-center shrink-0">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-turquoise" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-xs sm:text-sm truncate">Code Lab</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Try coding!
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* Upgrade CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  Unlock All Courses & Features
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sign up to access all classes, earn badges, and track progress!
                </p>
              </div>
            </div>
            <Button
              className="gap-1.5 bg-gradient-to-r from-primary to-secondary text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => navigate("/student/signup")}
            >
              <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Sign Up Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
