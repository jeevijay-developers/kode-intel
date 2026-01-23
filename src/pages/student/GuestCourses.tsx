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

  // Fetch all content for the selected course (videos, quizzes, ebooks per chapter)
  const { data: allChapterVideos = [] } = useQuery({
    queryKey: ["guest-all-chapter-videos", selectedCourse?.id],
    queryFn: async () => {
      if (!selectedCourse?.id) return [];
      const chapterIds = chapters.map((c: any) => c.id);
      if (chapterIds.length === 0) return [];
      const { data, error } = await supabase
        .from("chapter_videos")
        .select("*")
        .in("chapter_id", chapterIds)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCourse?.id && chapters.length > 0,
  });

  const { data: allChapterQuizzes = [] } = useQuery({
    queryKey: ["guest-all-chapter-quizzes", selectedCourse?.id],
    queryFn: async () => {
      if (!selectedCourse?.id) return [];
      const chapterIds = chapters.map((c: any) => c.id);
      if (chapterIds.length === 0) return [];
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .select("*")
        .in("chapter_id", chapterIds)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCourse?.id && chapters.length > 0,
  });

  const { data: allChapterEbooks = [] } = useQuery({
    queryKey: ["guest-all-chapter-ebooks", selectedCourse?.id],
    queryFn: async () => {
      if (!selectedCourse?.id) return [];
      const chapterIds = chapters.map((c: any) => c.id);
      if (chapterIds.length === 0) return [];
      const { data, error } = await supabase
        .from("chapter_ebooks")
        .select("*")
        .in("chapter_id", chapterIds)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCourse?.id && chapters.length > 0,
  });

  // Helper functions to get content by chapter
  const getChapterVideos = (chapterId: string) => 
    allChapterVideos.filter((v: any) => v.chapter_id === chapterId);
  
  const getChapterQuizzes = (chapterId: string) => 
    allChapterQuizzes.filter((q: any) => q.chapter_id === chapterId);
  
  const getChapterEbooks = (chapterId: string) => 
    allChapterEbooks.filter((e: any) => e.chapter_id === chapterId);

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

        {/* Course Modules */}
        <div className="space-y-3">
          {chapters.map((chapter: any, chapterIndex: number) => {
            const videos = getChapterVideos(chapter.id);
            const quizzes = getChapterQuizzes(chapter.id);
            const ebooks = getChapterEbooks(chapter.id);
            
            return (
              <Card key={chapter.id} className="overflow-hidden">
                {/* Chapter Header */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 sm:p-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-sm font-bold text-white">{chapterIndex + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium">Chapter {chapterIndex + 1}</p>
                      <h4 className="font-bold text-sm sm:text-base">{chapter.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {videos.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                          <Video className="h-2.5 w-2.5 mr-0.5" />
                          {videos.length}
                        </Badge>
                      )}
                      {quizzes.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                          <HelpCircle className="h-2.5 w-2.5 mr-0.5" />
                          {quizzes.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <CardContent className="p-3 sm:p-4 space-y-4">
                  {/* Video Lectures Section */}
                  {videos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-coral/20 flex items-center justify-center">
                          <Play className="h-3 w-3 text-coral" />
                        </div>
                        <h5 className="font-semibold text-sm">Video Lectures</h5>
                        <Badge variant="outline" className="text-[10px] ml-auto">{videos.length} videos</Badge>
                      </div>
                      <div className="space-y-1.5 pl-8">
                        {videos.map((video: any, videoIndex: number) => (
                          <button
                            key={video.id}
                            onClick={() => setActiveVideo(video)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted transition-all hover:translate-x-1 text-left group"
                          >
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                              <span className="text-xs font-medium text-primary">{videoIndex + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{video.title}</p>
                              {video.duration_minutes && (
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  {video.duration_minutes} min
                                </p>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quizzes Section */}
                  {quizzes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-purple/20 flex items-center justify-center">
                          <HelpCircle className="h-3 w-3 text-purple" />
                        </div>
                        <h5 className="font-semibold text-sm">Quizzes</h5>
                        <Badge variant="outline" className="text-[10px] ml-auto">{quizzes.length} quiz{quizzes.length > 1 ? 'zes' : ''}</Badge>
                      </div>
                      <div className="space-y-1.5 pl-8">
                        {quizzes.map((quiz: any, quizIndex: number) => (
                          <div
                            key={quiz.id}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 text-left"
                          >
                            <div className="w-7 h-7 rounded-full bg-purple/10 flex items-center justify-center shrink-0">
                              <HelpCircle className="h-3.5 w-3.5 text-purple" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{quiz.title}</p>
                              <p className="text-[10px] text-muted-foreground">Passing score: {quiz.passing_score}%</p>
                            </div>
                            <Badge className="bg-purple/20 text-purple border-purple/30 text-[10px]">
                              Interactive
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* E-Books Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-turquoise/20 flex items-center justify-center">
                        <FileText className="h-3 w-3 text-turquoise" />
                      </div>
                      <h5 className="font-semibold text-sm">Study Materials</h5>
                      {ebooks.length > 0 && (
                        <Badge variant="outline" className="text-[10px] ml-auto">{ebooks.length} sample{ebooks.length > 1 ? 's' : ''}</Badge>
                      )}
                    </div>
                    
                    {ebooks.length > 0 ? (
                      <div className="space-y-1.5 pl-8">
                        {ebooks.map((ebook: any) => (
                          <a
                            key={ebook.id}
                            href={ebook.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted transition-all hover:translate-x-1 group"
                          >
                            <div className="w-7 h-7 rounded-full bg-turquoise/10 flex items-center justify-center shrink-0">
                              <FileText className="h-3.5 w-3.5 text-turquoise" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate group-hover:text-turquoise transition-colors">{ebook.title}</p>
                              <p className="text-[10px] text-muted-foreground">Sample Preview</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
                          </a>
                        ))}
                      </div>
                    ) : null}

                    {/* Physical Book Notice */}
                    <div className="mt-2 pl-8">
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-sunny/10 border border-sunny/20">
                        <BookOpen className="h-4 w-4 text-sunny shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-medium text-sunny-foreground">Theory + Worksheet Books</p>
                          <p className="text-muted-foreground mt-0.5">
                            Complete study materials with theory and worksheets are available as physical books.
                            <button
                              onClick={() => navigate("/store")}
                              className="text-primary hover:underline ml-1 font-medium"
                            >
                              Visit Book Store →
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty State */}
                  {videos.length === 0 && quizzes.length === 0 && ebooks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Sparkles className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Content coming soon!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {chapters.length === 0 && (
            <Card className="p-8 text-center">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
              <h3 className="font-bold text-lg mb-1">No Chapters Yet</h3>
              <p className="text-muted-foreground text-sm">Course content is being prepared</p>
            </Card>
          )}
        </div>
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
