import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Zap,
  Trophy,
  Target,
  Brain,
  Lightbulb,
  User,
  Phone,
  Timer,
  Video,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useCourses, useChapters } from "@/hooks/useCourses";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import mascot from "@/assets/kodi-mascot-3d.png";
import { GuestProgressCard } from "@/components/dashboard/GuestProgressCard";

// Course banner images mapping
import courseBannerClass3 from "@/assets/course-banner-class3.png";
import courseBannerAiIntro from "@/assets/course-banner-ai-intro.png";
import courseBannerComputational from "@/assets/course-banner-computational.png";
import courseBannerAlgorithms from "@/assets/course-banner-algorithms.png";
import courseBannerPatterns from "@/assets/course-banner-patterns.png";
import courseBannerMl from "@/assets/course-banner-ml.png";

export interface GuestInfo {
  name: string;
  mobile: string;
  selectedClass: string;
  registeredAt: Date;
}

const classColors: Record<string, { from: string; to: string; accent: string }> = {
  "3": { from: "from-coral", to: "to-sunny", accent: "coral" },
  "4": { from: "from-turquoise", to: "to-lime", accent: "turquoise" },
  "5": { from: "from-primary", to: "to-secondary", accent: "primary" },
  "6": { from: "from-purple", to: "to-primary", accent: "purple" },
  "7": { from: "from-sunny", to: "to-coral", accent: "sunny" },
  "8": { from: "from-lime", to: "to-turquoise", accent: "lime" },
  "9": { from: "from-secondary", to: "to-purple", accent: "secondary" },
  "10": { from: "from-primary", to: "to-turquoise", accent: "primary" },
};

const classOptions = [
  { value: "3", label: "Class 3", description: "Age 8-9" },
  { value: "4", label: "Class 4", description: "Age 9-10" },
  { value: "5", label: "Class 5", description: "Age 10-11" },
  { value: "6", label: "Class 6", description: "Age 11-12" },
  { value: "7", label: "Class 7", description: "Age 12-13" },
  { value: "8", label: "Class 8", description: "Age 13-14" },
  { value: "9", label: "Class 9", description: "Age 14-15" },
  { value: "10", label: "Class 10", description: "Age 15-16" },
];

const getClassNumber = (title: string): string => {
  const match = title.match(/class\s*(\d+)/i);
  return match ? match[1] : "3";
};

const getCourseBanner = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("class 3")) return courseBannerClass3;
  if (lowerTitle.includes("ai") && lowerTitle.includes("intro")) return courseBannerAiIntro;
  if (lowerTitle.includes("computational")) return courseBannerComputational;
  if (lowerTitle.includes("algorithm")) return courseBannerAlgorithms;
  if (lowerTitle.includes("pattern")) return courseBannerPatterns;
  if (lowerTitle.includes("machine") || lowerTitle.includes("ml")) return courseBannerMl;
  return courseBannerClass3;
};

export default function GuestDashboard() {
  const navigate = useNavigate();
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showRegistration, setShowRegistration] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedClass, setSelectedClass] = useState("5");
  const { courses: allCourses = [], isLoading: coursesLoading } = useCourses();

  useEffect(() => {
    const stored = localStorage.getItem("guestInfo");
    if (stored) {
      const parsed = JSON.parse(stored);
      const registeredAt = new Date(parsed.registeredAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setGuestInfo(parsed);
      } else {
        localStorage.removeItem("guestInfo");
        setShowRegistration(true);
      }
    } else {
      setShowRegistration(true);
    }
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      if (!guestInfo) return;
      const registeredAt = new Date(guestInfo.registeredAt);
      const now = new Date();
      const endTime = new Date(registeredAt.getTime() + 24 * 60 * 60 * 1000);
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [guestInfo]);

  const handleRegistration = () => {
    if (!name.trim() || !mobile.trim() || !selectedClass) return;
    
    const info: GuestInfo = {
      name: name.trim(),
      mobile: mobile.trim(),
      selectedClass,
      registeredAt: new Date(),
    };
    localStorage.setItem("guestInfo", JSON.stringify(info));
    setGuestInfo(info);
    setShowRegistration(false);
  };

  const publishedCourses = allCourses.filter((c) => c.is_published);
  
  // Filter courses by selected class
  const filteredCourses = guestInfo?.selectedClass 
    ? publishedCourses.filter(course => {
        const courseClass = getClassNumber(course.title);
        return courseClass === guestInfo.selectedClass;
      })
    : publishedCourses;
  
  // Group courses by class for display
  const coursesByClass = publishedCourses.reduce((acc, course) => {
    const classNum = getClassNumber(course.title);
    if (!acc[classNum]) acc[classNum] = [];
    acc[classNum].push(course);
    return acc;
  }, {} as Record<string, typeof publishedCourses>);

  const isExpired = timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0 && guestInfo;

  return (
    <div className="min-h-screen">
      {/* Registration Modal */}
      <Dialog open={showRegistration} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md border-2 border-primary/20 shadow-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto mb-2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl scale-150" />
              <img src={mascot} alt="Kodi" className="w-24 h-24 mx-auto relative z-10 drop-shadow-xl animate-bounce-gentle" />
            </div>
            <DialogTitle className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to KodeIntel! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Start your <span className="text-primary font-bold">FREE 24-Hour</span> trial and explore all courses!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-coral/10 to-coral/5 border border-coral/20">
                <Video className="h-5 w-5 mx-auto text-coral mb-1" />
                <p className="text-[10px] font-medium">HD Videos</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple/10 to-purple/5 border border-purple/20">
                <HelpCircle className="h-5 w-5 mx-auto text-purple mb-1" />
                <p className="text-[10px] font-medium">Quizzes</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-turquoise/10 to-turquoise/5 border border-turquoise/20">
                <Code className="h-5 w-5 mx-auto text-turquoise mb-1" />
                <p className="text-[10px] font-medium">Code Lab</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="h-12 text-base border-2 focus:border-primary"
                  type="tel"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="class" className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Select Your Class
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-12 text-base border-2 focus:border-primary bg-background">
                    <SelectValue placeholder="Choose your class" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-2 z-50">
                    {classOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="cursor-pointer hover:bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{option.label}</span>
                          <span className="text-muted-foreground text-xs">({option.description})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleRegistration}
            disabled={!name.trim() || !mobile.trim() || !selectedClass}
            className="w-full h-14 gap-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500 text-lg font-bold shadow-xl"
          >
            <Rocket className="h-5 w-5" />
            Start My Free Trial
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/student/login")}
              className="text-primary hover:underline font-semibold"
            >
              Login here
            </button>
          </p>
        </DialogContent>
      </Dialog>

      <div className="p-3 sm:p-4 lg:p-6 space-y-5 animate-fade-in">
        {/* Hero Welcome Banner with Timer */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/15 to-turquoise/20 border border-primary/20 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-turquoise/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-sunny to-coral rounded-full blur-xl opacity-50 scale-110" />
                <img
                  src={mascot}
                  alt="Kodi Mascot"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain relative z-10 drop-shadow-lg animate-bounce-gentle"
                />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-display">
                    Hello{guestInfo ? `, ${guestInfo.name}` : ""}! 
                  </h1>
                  <Badge className="bg-gradient-to-r from-sunny to-coral text-white border-0 shadow-md">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Free Trial
                  </Badge>
                  {guestInfo?.selectedClass && (
                    <Badge variant="outline" className="border-primary/30 text-primary font-semibold">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Class {guestInfo.selectedClass}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Exploring Class {guestInfo?.selectedClass || "5"} courses • Watch videos, take quizzes, and practice coding!
                </p>
                
                {/* Trial Timer */}
                {guestInfo && (
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-inner">
                    <Timer className="h-5 w-5 text-coral animate-pulse" />
                    <div className="flex items-center gap-1">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold font-mono text-primary">{String(timeRemaining.hours).padStart(2, '0')}</div>
                        <div className="text-[9px] text-muted-foreground uppercase">Hours</div>
                      </div>
                      <span className="text-lg font-bold text-muted-foreground">:</span>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold font-mono text-primary">{String(timeRemaining.minutes).padStart(2, '0')}</div>
                        <div className="text-[9px] text-muted-foreground uppercase">Mins</div>
                      </div>
                      <span className="text-lg font-bold text-muted-foreground">:</span>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold font-mono text-coral">{String(timeRemaining.seconds).padStart(2, '0')}</div>
                        <div className="text-[9px] text-muted-foreground uppercase">Secs</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card + Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Progress Summary Card */}
          <GuestProgressCard className="lg:col-span-1 order-2 lg:order-1" />
          
          {/* Quick Actions */}
          <div className="lg:col-span-2 order-1 lg:order-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { 
              icon: BookOpen, 
              label: "Explore Courses", 
              desc: "All Classes", 
              path: "/guest/courses",
              iconBg: "bg-gradient-to-br from-primary/20 to-primary/5",
              iconColor: "text-primary"
            },
            { 
              icon: Code, 
              label: "Code Lab", 
              desc: "Write & Run", 
              path: "/compiler",
              iconBg: "bg-gradient-to-br from-turquoise/20 to-turquoise/5",
              iconColor: "text-turquoise"
            },
            { 
              icon: Brain, 
              label: "AI Learning", 
              desc: "Smart Skills", 
              path: "/guest/courses",
              iconBg: "bg-gradient-to-br from-purple/20 to-purple/5",
              iconColor: "text-purple"
            },
            { 
              icon: Trophy, 
              label: "Leaderboard", 
              desc: "Top Learners", 
              path: "/guest/leaderboard",
              iconBg: "bg-gradient-to-br from-sunny/20 to-sunny/5",
              iconColor: "text-sunny"
            },
          ].map((action, idx) => (
            <Card
              key={action.label}
              className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group overflow-hidden"
              onClick={() => navigate(action.path)}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <CardContent className="p-3 sm:p-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${action.iconBg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-md`}>
                  <action.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.iconColor}`} />
                </div>
                <h3 className="font-bold text-xs sm:text-sm">{action.label}</h3>
                <p className="text-[10px] text-muted-foreground">{action.desc}</p>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

        {/* Courses for Selected Class */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg font-display">
                {guestInfo?.selectedClass 
                  ? `Class ${guestInfo.selectedClass} Learning Modules` 
                  : "Learning Modules"}
              </h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {guestInfo?.selectedClass 
                  ? `AI & Computational Thinking curriculum for Class ${guestInfo.selectedClass}`
                  : "Classes 3-10 • AI & Computational Thinking"}
              </p>
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {coursesLoading ? (
              // Skeleton Loading State
              Array.from({ length: 4 }).map((_, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <Skeleton className="h-28 sm:h-32 w-full" />
                  <CardContent className="p-3 sm:p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <div className="flex gap-2 mt-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredCourses.length > 0 ? filteredCourses.map((course, index) => {
              const classNum = getClassNumber(course.title);
              const colors = classColors[classNum] || classColors["3"];
              
              return (
                <Card
                  key={course.id}
                  onClick={() => navigate("/guest/courses", { state: { selectedCourse: course } })}
                  className="cursor-pointer group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/30"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Course Banner */}
                  <div className="relative h-28 sm:h-32 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.to} opacity-90`} />
                    <img
                      src={course.thumbnail_url || getCourseBanner(course.title)}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCourseBanner(course.title);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Class Badge */}
                    <Badge className={`absolute top-2 left-2 bg-white/90 text-foreground border-0 shadow-lg backdrop-blur-sm text-[10px] font-bold`}>
                      Class {classNum}
                    </Badge>
                    
                    {/* Free Badge */}
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-sunny to-coral text-white border-0 shadow-lg text-[10px]">
                      <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                      Free
                    </Badge>
                    
                    {/* Course Icon */}
                    <div className="absolute bottom-3 left-3 flex items-end gap-2">
                      <div className={`w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30`}>
                        <Lightbulb className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Play Button */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                        <Play className="h-4 w-4 text-primary fill-primary ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <CardContent className="p-3 sm:p-4 bg-gradient-to-b from-background to-muted/20">
                    <h3 className="font-bold text-sm sm:text-base line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mb-3">
                        {course.description}
                      </p>
                    )}
                    
                    {/* Course Stats */}
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        Videos
                      </span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        Quizzes
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        E-Books
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            }) : (
              <Card className="col-span-full p-8 text-center bg-gradient-to-br from-muted/50 to-muted/20 border-dashed">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-bold text-lg mb-2">No Courses Available</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  No courses available for Class {guestInfo?.selectedClass || "5"} yet.
                </p>
                <p className="text-xs text-muted-foreground">
                  Try exploring other classes or check back soon!
                </p>
              </Card>
            )}
          </div>

          {publishedCourses.length === 0 && !coursesLoading && (
            <Card className="p-8 text-center bg-gradient-to-br from-muted/50 to-muted/20">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-bold text-lg mb-2">No Courses Yet</h3>
              <p className="text-muted-foreground text-sm">Check back soon for amazing content!</p>
            </Card>
          )}
        </div>

        {/* Features Highlight */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-coral/10 to-coral/5 border-coral/20 hover:shadow-lg transition-all">
            <Play className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-coral" />
            <p className="text-[10px] sm:text-xs font-medium">HD Video Lectures</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-purple/10 to-purple/5 border-purple/20 hover:shadow-lg transition-all">
            <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-purple" />
            <p className="text-[10px] sm:text-xs font-medium">Interactive Quizzes</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-turquoise/10 to-turquoise/5 border-turquoise/20 hover:shadow-lg transition-all">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-turquoise" />
            <p className="text-[10px] sm:text-xs font-medium">Study Materials</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-lime/10 to-lime/5 border-lime/20 hover:shadow-lg transition-all">
            <Code className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-lime" />
            <p className="text-[10px] sm:text-xs font-medium">Live Code Editor</p>
          </Card>
        </div>

        {/* Upgrade CTA */}
        <Card className="overflow-hidden relative bg-gradient-to-r from-primary/15 via-secondary/15 to-purple/15 border-primary/20 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sunny/30 to-transparent rounded-full blur-2xl" />
          <Sparkles className="absolute top-4 right-4 h-6 w-6 text-sunny animate-pulse" />
          
          <CardContent className="p-5 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-xl animate-bounce-gentle">
                <Rocket className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg sm:text-xl font-display mb-1">
                  Ready for Full Access? 🚀
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sign up to track progress, earn badges, compete on leaderboard, and unlock all features!
                </p>
              </div>
              <Button
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500 text-base font-semibold shadow-xl h-12"
                onClick={() => navigate("/student/signup")}
              >
                <UserPlus className="h-5 w-5" />
                Sign Up Free
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
