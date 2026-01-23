import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Play,
  Rocket,
  Star,
  Sparkles,
  ArrowRight,
  UserPlus,
  Code,
  Clock,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import mascot from "@/assets/kodi-mascot-3d.png";

interface GuestInfo {
  name: string;
  mobile: string;
  selectedClass: string;
  registeredAt: Date;
}

export default function GuestDashboard() {
  const navigate = useNavigate();
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const { courses: allCourses = [] } = useCourses();

  useEffect(() => {
    const stored = localStorage.getItem("guestInfo");
    if (stored) {
      setGuestInfo(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      if (!guestInfo) return;
      const registeredAt = new Date(guestInfo.registeredAt);
      const now = new Date();
      const hoursDiff = 24 - (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff <= 0) {
        setTimeRemaining("Expired");
      } else {
        setTimeRemaining(`${Math.floor(hoursDiff)}h ${Math.floor((hoursDiff % 1) * 60)}m left`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [guestInfo]);

  const publishedCourses = allCourses.filter((c) => c.is_published);

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 animate-fade-in">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-br from-primary/10 via-turquoise/10 to-secondary/10 border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
        
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <img
              src={mascot}
              alt="Kodi Mascot"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain animate-bounce-gentle"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg sm:text-xl font-bold font-display">
                  Welcome{guestInfo ? `, ${guestInfo.name}` : ""}! 👋
                </h1>
                {timeRemaining && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {timeRemaining}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {guestInfo
                  ? `Explore ${guestInfo.selectedClass} courses and all content during your trial!`
                  : "Start your free 1-day trial to explore all courses!"}
              </p>
              {!guestInfo && (
                <Button
                  size="sm"
                  onClick={() => navigate("/guest/courses")}
                  className="gap-2 bg-gradient-to-r from-primary to-secondary"
                >
                  <Rocket className="h-4 w-4" />
                  Start Free Trial
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
          onClick={() => navigate("/guest/courses")}
        >
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base">Explore Courses</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                All Classes Available
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group bg-gradient-to-br from-turquoise/5 to-turquoise/10 border-turquoise/20"
          onClick={() => navigate("/compiler")}
        >
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base">Code Lab</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Write & Run Code
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* All Courses by Class */}
      <Card>
        <CardHeader className="p-3 sm:p-4 pb-2">
          <CardTitle className="flex items-center justify-between text-base sm:text-lg">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              All Courses
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/guest/courses")}
              className="text-xs gap-1"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {publishedCourses.slice(0, 8).map((course, index) => (
              <div
                key={course.id}
                onClick={() => navigate("/guest/courses")}
                className="cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <div className="relative h-16 sm:h-20">
                    <img
                      src={course.thumbnail_url || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <Badge className="absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 bg-primary/90">
                      <Star className="h-2 w-2 mr-0.5 fill-current" />
                      Free
                    </Badge>
                  </div>
                  <CardContent className="p-2">
                    <h4 className="font-medium text-[11px] sm:text-xs line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {publishedCourses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No courses available yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Preview */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="p-3 text-center bg-gradient-to-br from-sunny/10 to-sunny/5 border-sunny/20">
          <Play className="h-6 w-6 mx-auto mb-1 text-sunny" />
          <p className="text-[10px] sm:text-xs font-medium">HD Videos</p>
        </Card>
        <Card className="p-3 text-center bg-gradient-to-br from-turquoise/10 to-turquoise/5 border-turquoise/20">
          <BookOpen className="h-6 w-6 mx-auto mb-1 text-turquoise" />
          <p className="text-[10px] sm:text-xs font-medium">E-Books</p>
        </Card>
        <Card className="p-3 text-center bg-gradient-to-br from-coral/10 to-coral/5 border-coral/20">
          <Code className="h-6 w-6 mx-auto mb-1 text-coral" />
          <p className="text-[10px] sm:text-xs font-medium">Code Lab</p>
        </Card>
      </div>

      {/* Upgrade CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-purple/10 border-primary/20 overflow-hidden relative">
        <Sparkles className="absolute top-3 right-3 h-5 w-5 text-sunny animate-pulse" />
        
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-xl animate-bounce-gentle">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-base sm:text-lg font-display">
                Ready for Full Access?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Sign up to track progress, earn badges, and unlock all features!
              </p>
            </div>
            <Button
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => navigate("/student/signup")}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up Free
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
