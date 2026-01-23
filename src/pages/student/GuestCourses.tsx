import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Play,
  Video,
  Star,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Clock,
  FileText,
  HelpCircle,
  ArrowLeft,
  Rocket,
  User,
  Phone,
} from "lucide-react";
import { useCourses, useChapters } from "@/hooks/useCourses";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import KodeIntelPlayer from "@/components/student/KodeIntelPlayer";
import mascot from "@/assets/kodi-mascot-3d.png";

const classes = ["Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

interface GuestInfo {
  name: string;
  mobile: string;
  selectedClass: string;
  registeredAt: Date;
}

export default function GuestCourses() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showRegistration, setShowRegistration] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  // Check for existing guest session
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

  const { courses: allCourses = [], isLoading: coursesLoading } = useCourses();

  // Filter courses based on selected class
  const filteredCourses = allCourses.filter(course => 
    course.is_published && 
    (guestInfo ? course.title.toLowerCase().includes(guestInfo.selectedClass.toLowerCase().replace(" ", "")) : true)
  );

  // Fetch chapters for selected course
  const { data: chapters = [] } = useQuery({
    queryKey: ["guest-chapters", selectedCourse?.id],
    queryFn: async () => {
      if (!selectedCourse?.id) return [];
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("course_id", selectedCourse.id)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCourse?.id,
  });

  // Fetch videos for active chapter
  const { data: chapterVideos = [] } = useQuery({
    queryKey: ["guest-chapter-videos", activeChapter],
    queryFn: async () => {
      if (!activeChapter) return [];
      const { data, error } = await supabase
        .from("chapter_videos")
        .select("*")
        .eq("chapter_id", activeChapter)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeChapter,
  });

  // Fetch ebooks for active chapter
  const { data: chapterEbooks = [] } = useQuery({
    queryKey: ["guest-chapter-ebooks", activeChapter],
    queryFn: async () => {
      if (!activeChapter) return [];
      const { data, error } = await supabase
        .from("chapter_ebooks")
        .select("*")
        .eq("chapter_id", activeChapter)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeChapter,
  });

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

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setActiveChapter(null);
    setActiveVideo(null);
  };

  const isTrialExpired = () => {
    if (!guestInfo) return true;
    const registeredAt = new Date(guestInfo.registeredAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff >= 24;
  };

  const getTimeRemaining = () => {
    if (!guestInfo) return "0h";
    const registeredAt = new Date(guestInfo.registeredAt);
    const now = new Date();
    const hoursDiff = 24 - (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60);
    if (hoursDiff <= 0) return "Expired";
    return `${Math.floor(hoursDiff)}h ${Math.floor((hoursDiff % 1) * 60)}m`;
  };

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  // Video Player View
  if (activeVideo) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveVideo(null)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>
        
        <Card className="overflow-hidden">
          <KodeIntelPlayer
            videoId={extractVideoId(activeVideo.youtube_url)}
            title={activeVideo.title}
          />
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-2">{activeVideo.title}</h2>
            {activeVideo.description && (
              <p className="text-muted-foreground text-sm">{activeVideo.description}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Course Detail View
  if (selectedCourse) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedCourse(null)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <Card className="mb-4 overflow-hidden">
          <div className="relative h-32 sm:h-40">
            <img
              src={selectedCourse.thumbnail_url || "/placeholder.svg"}
              alt={selectedCourse.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="mb-2 bg-primary/90">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Free Trial
              </Badge>
              <h1 className="text-white font-bold text-lg sm:text-xl">{selectedCourse.title}</h1>
            </div>
          </div>
        </Card>

        {/* Chapters Accordion */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <h3 className="font-bold text-base mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Course Chapters
            </h3>
            
            <Accordion
              type="single"
              collapsible
              value={activeChapter || undefined}
              onValueChange={(val) => setActiveChapter(val || null)}
            >
              {chapters.map((chapter: any, index: number) => (
                <AccordionItem key={chapter.id} value={chapter.id} className="border-b last:border-0">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{chapter.title}</p>
                        {chapter.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{chapter.description}</p>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-2 pl-11">
                      {/* Videos */}
                      {chapterVideos.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            Videos
                          </p>
                          {chapterVideos.map((video: any) => (
                            <button
                              key={video.id}
                              onClick={() => setActiveVideo(video)}
                              className="w-full flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                <Play className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{video.title}</p>
                                {video.duration_minutes && (
                                  <p className="text-xs text-muted-foreground">
                                    {video.duration_minutes} min
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Ebooks */}
                      {chapterEbooks.length > 0 && (
                        <div className="space-y-2 mt-3">
                          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Study Materials
                          </p>
                          {chapterEbooks.map((ebook: any) => (
                            <a
                              key={ebook.id}
                              href={ebook.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-turquoise/20 flex items-center justify-center shrink-0">
                                <FileText className="h-4 w-4 text-turquoise" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{ebook.title}</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}

                      {chapterVideos.length === 0 && chapterEbooks.length === 0 && (
                        <p className="text-sm text-muted-foreground py-2">
                          No content available yet
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

              {chapters.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No chapters available yet</p>
                </div>
              )}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Courses Grid
  return (
    <div className="p-3 sm:p-4 lg:p-6 animate-fade-in">
      {/* Registration Modal */}
      <Dialog open={showRegistration} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4">
              <img src={mascot} alt="Kodi" className="w-20 h-20 mx-auto animate-bounce-gentle" />
            </div>
            <DialogTitle className="text-xl font-bold font-display">
              Start Your Free Trial! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              Get <span className="text-primary font-semibold">24 hours</span> of unlimited access to explore all courses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Your Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Mobile Number
              </Label>
              <Input
                id="mobile"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="h-11"
                type="tel"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                Select Your Class
              </Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose your class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleRegistration}
            disabled={!name.trim() || !mobile.trim() || !selectedClass}
            className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-secondary text-base font-semibold"
          >
            <Rocket className="h-5 w-5" />
            Start Free Trial
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/student/login")}
              className="text-primary hover:underline font-medium"
            >
              Login here
            </button>
          </p>
        </DialogContent>
      </Dialog>

      {/* Header with Trial Timer */}
      {guestInfo && (
        <Card className="mb-4 bg-gradient-to-r from-primary/10 via-turquoise/10 to-secondary/10 border-primary/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    Welcome, {guestInfo.name}! 👋
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {guestInfo.selectedClass} • Free Trial
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-primary">
                  <Clock className="h-4 w-4" />
                  <span className="font-bold text-sm">{getTimeRemaining()}</span>
                </div>
                <p className="text-xs text-muted-foreground">remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-display flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            All Courses
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore AI & Computational Thinking courses
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {coursesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded-t-lg" />
              <CardContent className="p-3">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allCourses
            .filter((course) => course.is_published)
            .map((course, index) => (
              <Card
                key={course.id}
                className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                onClick={() => handleCourseClick(course)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-20 sm:h-24">
                  <img
                    src={course.thumbnail_url || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <Badge className="absolute top-2 left-2 text-[10px] bg-primary/90 backdrop-blur-sm">
                    <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                    Free
                  </Badge>
                </div>
                <CardContent className="p-2.5 sm:p-3">
                  <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                      {course.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Empty State */}
      {!coursesLoading && allCourses.filter((c) => c.is_published).length === 0 && (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-bold text-lg mb-2">No Courses Available</h3>
          <p className="text-muted-foreground text-sm">
            Check back soon for new content!
          </p>
        </Card>
      )}

      {/* Upgrade CTA */}
      {guestInfo && (
        <Card className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-base sm:text-lg mb-1">
                  Enjoying the trial? 🚀
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sign up for unlimited access, track your progress, and earn badges!
                </p>
              </div>
              <Button
                onClick={() => navigate("/student/signup")}
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                <Sparkles className="h-4 w-4" />
                Sign Up Free
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
