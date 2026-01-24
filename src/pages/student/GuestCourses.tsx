import { useState, useEffect, Suspense, lazy } from "react";
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
  ChevronLeft,
  GraduationCap,
  Clock,
  FileText,
  HelpCircle,
  ArrowLeft,
  Rocket,
  User,
  Phone,
  Code,
  Timer,
  Eye,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCourses, useChapters } from "@/hooks/useCourses";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import KodeIntelPlayer from "@/components/student/KodeIntelPlayer";
import mascot from "@/assets/kodi-mascot-3d.png";
import { SampleEbookViewer } from "@/components/student/SampleEbookViewer";
import { ChangeClassModal } from "@/components/guest/ChangeClassModal";
import { useGuestProgress } from "@/hooks/useGuestProgress";

const GuestPdfPreview = lazy(() => import("@/components/student/GuestPdfPreview"));

// Course banner imports
import bannerClass3 from "@/assets/course-banner-class3.png";
import bannerPatterns from "@/assets/course-banner-patterns.png";
import bannerComputational from "@/assets/course-banner-computational.png";
import bannerAlgorithms from "@/assets/course-banner-algorithms.png";
import bannerDataStructures from "@/assets/course-banner-data-structures.png";
import bannerAIIntro from "@/assets/course-banner-ai-intro.png";
import bannerML from "@/assets/course-banner-ml.png";
import bannerAIProjects from "@/assets/course-banner-ai-projects.png";

// Banner mapping by class number
const courseBanners: Record<string, string> = {
  "3": bannerClass3,
  "4": bannerPatterns,
  "5": bannerComputational,
  "6": bannerAlgorithms,
  "7": bannerDataStructures,
  "8": bannerAIIntro,
  "9": bannerML,
  "10": bannerAIProjects,
};

// Available sample PDFs with their class numbers
const availableSamplePdfs = [
  { classNum: "4", pdfUrl: "/ebooks/class-4-chapter-1.pdf", label: "Class 4" },
  { classNum: "6", pdfUrl: "/ebooks/class-6-chapter-1.pdf", label: "Class 6" },
  { classNum: "7", pdfUrl: "/ebooks/class-7-chapter-1.pdf", label: "Class 7" },
];

// Get the best matching sample PDF for a class (exact match or nearest available)
const getSamplePdfForClass = (classNum: string): { classNum: string; pdfUrl: string; label: string } => {
  // First try exact match
  const exact = availableSamplePdfs.find(p => p.classNum === classNum);
  if (exact) return exact;
  
  // Fallback logic based on class range
  const num = parseInt(classNum);
  if (num <= 4) return availableSamplePdfs[0]; // Class 4 sample
  if (num <= 6) return availableSamplePdfs[1]; // Class 6 sample
  return availableSamplePdfs[2]; // Class 7 sample for 7+
};

const classes = ["Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

interface GuestInfo {
  name: string;
  mobile: string;
  selectedClass?: string;
  registeredAt: Date;
}

export default function GuestCourses() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isVideoWatched, isQuizCompleted, getQuizScore, isEbookViewed, markVideoWatched, markEbookViewed, getStats } = useGuestProgress();
  const [showRegistration, setShowRegistration] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedClass, setSelectedClass] = useState("5");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [activePdf, setActivePdf] = useState<{ title: string; pdfUrl: string; classNum: string; ebookId?: string } | null>(null);
  const [pdfPageNumber, setPdfPageNumber] = useState(1);
  const [pdfNumPages, setPdfNumPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [pdfWidth, setPdfWidth] = useState<number>(600);
  const [showChangeClass, setShowChangeClass] = useState(false);
  // Removed showAllCourses toggle as per UX requirements

  useEffect(() => {
    // Avoid touching window during SSR-like environments; also reduces layout thrash on mobile.
    const update = () => {
      if (typeof window === "undefined") return;
      setPdfWidth(Math.min(window.innerWidth * 0.85, 600));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
        if (parsed.selectedClass) {
          setSelectedClass(parsed.selectedClass);
        }
      } else {
        localStorage.removeItem("guestInfo");
        setShowRegistration(true);
      }
    } else {
      setShowRegistration(true);
    }
  }, []);

  const { courses: allCourses = [], isLoading: coursesLoading } = useCourses();

  // Helper to get class number from course title
  const getClassFromTitle = (title: string): string => {
    const match = title.match(/class\s*(\d+)/i);
    return match ? match[1] : "";
  };

  // Filter courses based on selected class - only show class-specific courses
  const filteredCourses = allCourses.filter(course => {
    if (!course.is_published) return false;
    if (!guestInfo?.selectedClass) return true;
    const courseClass = getClassFromTitle(course.title);
    return courseClass === guestInfo.selectedClass;
  });

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

  const handleClassChange = (newClass: string) => {
    if (guestInfo) {
      const updatedInfo = { ...guestInfo, selectedClass: newClass };
      localStorage.setItem("guestInfo", JSON.stringify(updatedInfo));
      setGuestInfo(updatedInfo);
      setSelectedClass(newClass);
    }
    setShowChangeClass(false);
  };

  const handleRegistrationSimple = () => {
    if (!name.trim() || !mobile.trim() || !selectedClass) return;
    
    const info: GuestInfo = {
      name: name.trim(),
      mobile: mobile.trim(),
      selectedClass: selectedClass,
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
    setActiveQuiz(null);
    setActivePdf(null);
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

  // Get class number from course title
  const getClassNumFromCourse = (title: string): string => {
    const match = title.match(/class\s*(\d+)/i);
    return match ? match[1] : "3";
  };


  // Mark video as watched when viewing (moved here to avoid hooks in conditionals)
  useEffect(() => {
    if (activeVideo?.id) {
      markVideoWatched(activeVideo.id);
    }
  }, [activeVideo?.id, markVideoWatched]);

  // Mark ebook as viewed when viewing
  useEffect(() => {
    if (activePdf?.ebookId) {
      markEbookViewed(activePdf.ebookId);
    }
  }, [activePdf?.ebookId, markEbookViewed]);

  // PDF Viewer View
  if (activePdf) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 animate-fade-in h-[calc(100vh-120px)] flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setActivePdf(null);
            setPdfPageNumber(1);
            setPdfNumPages(0);
          }}
          className="mb-3 gap-2 self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>
        
        <Card className="flex-1 overflow-hidden flex flex-col">
          {/* PDF Header */}
          <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-turquoise/10 to-turquoise/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-sm sm:text-base truncate">{activePdf.title}</h2>
                <p className="text-xs text-muted-foreground">Class {activePdf.classNum} • Sample Preview (Non-downloadable)</p>
              </div>
              <Badge className="bg-sunny/20 text-sunny text-[10px] shrink-0">
                <Eye className="h-3 w-3 mr-1" />
                Preview Only
              </Badge>
            </div>
          </div>
          
          {/* PDF Content */}
          <div className="flex-1 overflow-hidden bg-muted/30">
            <ScrollArea className="h-full">
              <div className="flex justify-center p-4 min-h-full">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-96">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  }
                >
                  <GuestPdfPreview
                    file={activePdf.pdfUrl}
                    pageNumber={pdfPageNumber}
                    width={pdfWidth}
                    onLoadSuccess={(numPages) => {
                      setPdfNumPages(numPages);
                      setPdfLoading(false);
                    }}
                  />
                </Suspense>
              </div>
            </ScrollArea>
          </div>

          {/* PDF Navigation */}
          {pdfNumPages > 0 && (
            <div className="p-3 border-t bg-background/95 backdrop-blur shrink-0">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPdfPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pdfPageNumber <= 1}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <span className="text-xs sm:text-sm font-medium px-3 py-1.5 bg-muted rounded-full">
                  {pdfPageNumber} / {pdfNumPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPdfPageNumber((prev) => Math.min(prev + 1, pdfNumPages))}
                  disabled={pdfPageNumber >= pdfNumPages}
                  className="gap-1 text-xs"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Physical Book Note */}
              <div className="mt-3 p-2 rounded-lg bg-sunny/10 border border-sunny/20 text-center">
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  📚 <span className="font-medium text-foreground">This is a sample preview only.</span> Complete Theory + Worksheet books available as physical copies.
                  <button
                    onClick={() => navigate("/store")}
                    className="text-primary hover:underline ml-1 font-medium"
                  >
                    Buy Now →
                  </button>
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

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
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-lg">{activeVideo.title}</h2>
              <Badge className="bg-lime/20 text-lime border-lime/30 text-[10px]">
                <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                Watched
              </Badge>
            </div>
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
    const classMatch = selectedCourse.title.match(/class\s*(\d+)/i);
    const selectedClassNum = classMatch ? classMatch[1] : "3";
    const selectedBanner = courseBanners[selectedClassNum] || bannerClass3;
    const selectedGradient: Record<string, string> = {
      "3": "from-coral to-sunny",
      "4": "from-turquoise to-lime",
      "5": "from-primary to-secondary",
      "6": "from-purple to-primary",
      "7": "from-sunny to-coral",
      "8": "from-lime to-turquoise",
      "9": "from-secondary to-purple",
      "10": "from-primary to-turquoise",
    };
    const detailGradient = selectedGradient[selectedClassNum] || selectedGradient["3"];
    
    return (
      <div className="p-3 sm:p-4 lg:p-6 animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedCourse(null)}
          className="mb-3 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>

        {/* Course Header with Banner */}
        <Card className="mb-4 overflow-hidden shadow-xl">
          <div className="relative h-36 sm:h-44 md:h-52">
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${detailGradient}`} />
            {/* Banner Image */}
            <img
              src={selectedBanner}
              alt={selectedCourse.title}
              className="w-full h-full object-cover mix-blend-overlay opacity-60"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
              <Badge className="mb-2 bg-white/95 text-foreground border-0 shadow-lg text-xs font-bold">
                Class {selectedClassNum}
              </Badge>
              <Badge className="mb-2 ml-2 bg-gradient-to-r from-sunny to-coral text-white border-0 shadow-lg text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Free Trial
              </Badge>
              <h1 className="text-white font-bold text-base sm:text-lg md:text-xl leading-tight drop-shadow-lg">{selectedCourse.title}</h1>
              {selectedCourse.description && (
                <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-2">{selectedCourse.description}</p>
              )}
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
                        {videos.map((video: any, videoIndex: number) => {
                          const watched = isVideoWatched(video.id);
                          return (
                            <button
                              key={video.id}
                              onClick={() => setActiveVideo(video)}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all hover:translate-x-1 text-left group ${
                                watched ? 'bg-lime/10 border border-lime/30' : 'bg-muted/40 hover:bg-muted'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                watched ? 'bg-lime/20' : 'bg-primary/10 group-hover:bg-primary/20'
                              }`}>
                                {watched ? (
                                  <CheckCircle className="h-3.5 w-3.5 text-lime" />
                                ) : (
                                  <span className="text-xs font-medium text-primary">{videoIndex + 1}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate transition-colors ${
                                  watched ? 'text-lime' : 'group-hover:text-primary'
                                }`}>{video.title}</p>
                                {video.duration_minutes && (
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" />
                                    {video.duration_minutes} min
                                  </p>
                                )}
                              </div>
                              {watched ? (
                                <Badge className="bg-lime/20 text-lime border-lime/30 text-[10px]">Done</Badge>
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
                              )}
                            </button>
                          );
                        })}
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
                      {quizzes.map((quiz: any) => {
                          const quizResult = getQuizScore(quiz.id);
                          const completed = isQuizCompleted(quiz.id);
                          return (
                            <button
                              key={quiz.id}
                              onClick={() => navigate(`/guest/quiz/${quiz.id}`)}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all hover:translate-x-1 text-left group ${
                                completed 
                                  ? quizResult?.passed 
                                    ? 'bg-lime/10 border border-lime/30' 
                                    : 'bg-coral/10 border border-coral/30'
                                  : 'bg-muted/40 hover:bg-muted'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                completed 
                                  ? quizResult?.passed ? 'bg-lime/20' : 'bg-coral/20'
                                  : 'bg-purple/10 group-hover:bg-purple/20'
                              }`}>
                                {completed ? (
                                  quizResult?.passed ? (
                                    <CheckCircle className="h-3.5 w-3.5 text-lime" />
                                  ) : (
                                    <XCircle className="h-3.5 w-3.5 text-coral" />
                                  )
                                ) : (
                                  <HelpCircle className="h-3.5 w-3.5 text-purple" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate transition-colors ${
                                  completed 
                                    ? quizResult?.passed ? 'text-lime' : 'text-coral'
                                    : 'group-hover:text-purple'
                                }`}>{quiz.title}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {completed 
                                    ? `Score: ${quizResult?.score}% ${quizResult?.passed ? '✓ Passed' : '• Try Again'}`
                                    : `Passing score: ${quiz.passing_score}%`
                                  }
                                </p>
                              </div>
                              <Badge className={`text-[10px] transition-colors ${
                                completed 
                                  ? quizResult?.passed 
                                    ? 'bg-lime/20 text-lime border-lime/30'
                                    : 'bg-coral/20 text-coral border-coral/30'
                                  : 'bg-purple/20 text-purple border-purple/30 group-hover:bg-purple group-hover:text-white'
                              }`}>
                                {completed ? (
                                  quizResult?.passed ? 'Passed' : 'Retry'
                                ) : (
                                  <>
                                    <Play className="h-2.5 w-2.5 mr-0.5" />
                                    Start
                                  </>
                                )}
                              </Badge>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* E-Books / Study Materials Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-turquoise/20 flex items-center justify-center">
                        <FileText className="h-3 w-3 text-turquoise" />
                      </div>
                      <h5 className="font-semibold text-sm">Study Materials</h5>
                      <Badge variant="outline" className="text-[10px] ml-auto">Sample Preview</Badge>
                    </div>
                    
                    <div className="space-y-1.5 pl-8">
                      {/* Sample PDF Preview - available for every chapter */}
                      {(() => {
                        const samplePdf = getSamplePdfForClass(selectedClassNum);
                        return (
                          <button
                            onClick={() => {
                              setActivePdf({
                                title: `${chapter.title} - Sample Book Preview`,
                                pdfUrl: samplePdf.pdfUrl,
                                classNum: samplePdf.classNum,
                              });
                              setPdfLoading(true);
                              setPdfPageNumber(1);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-gradient-to-r from-turquoise/10 to-lime/10 hover:from-turquoise/20 hover:to-lime/20 border border-turquoise/30 transition-all hover:translate-x-1 text-left group"
                          >
                            <div className="w-7 h-7 rounded-full bg-turquoise/20 flex items-center justify-center shrink-0 group-hover:bg-turquoise/30 transition-colors">
                              <BookOpen className="h-3.5 w-3.5 text-turquoise" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate group-hover:text-turquoise transition-colors">
                                📖 Sample Book Preview
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Free soft copy preview • {samplePdf.label} sample (non-downloadable)
                              </p>
                            </div>
                            <Badge className="bg-turquoise/20 text-turquoise border-turquoise/30 text-[10px] group-hover:bg-turquoise group-hover:text-white transition-colors shrink-0">
                              <Eye className="h-2.5 w-2.5 mr-0.5" />
                              View
                            </Badge>
                          </button>
                        );
                      })()}
                    </div>

                    {/* Physical Book Notice */}
                    <div className="mt-3 pl-8">
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gradient-to-r from-sunny/10 to-coral/10 border border-sunny/30">
                        <BookOpen className="h-4 w-4 text-sunny shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-medium text-foreground flex items-center gap-1.5">
                            📚 Theory + Worksheet Books
                            <Badge className="bg-coral/20 text-coral text-[9px]">Hard Copy</Badge>
                          </p>
                          <p className="text-muted-foreground mt-1">
                            Our books are available as <span className="font-semibold text-foreground">physical copies only</span>. 
                            The soft copy previews above are sample chapters for review purposes.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/store")}
                            className="mt-2 h-7 text-[10px] gap-1 border-coral/30 text-coral hover:bg-coral hover:text-white"
                          >
                            <BookOpen className="h-3 w-3" />
                            Buy Physical Books →
                          </Button>
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
      {/* Registration Modal - Simplified, just name and mobile */}
      <Dialog open={showRegistration} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md border-2 border-primary/20 shadow-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto mb-2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl scale-150" />
              <img src={mascot} alt="Kodi" className="w-24 h-24 mx-auto relative z-10 drop-shadow-xl animate-bounce-gentle" />
            </div>
            <DialogTitle className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Start Your Free Trial! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Get <span className="text-primary font-bold">24 hours</span> of unlimited access to all courses
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
                  <SelectTrigger className="h-12 text-base border-2 focus:border-primary">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {["3", "4", "5", "6", "7", "8", "9", "10"].map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleRegistrationSimple}
            disabled={!name.trim() || !mobile.trim()}
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

      {/* Header with Trial Timer */}
      {guestInfo && (
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/15 via-secondary/10 to-turquoise/15 border border-primary/20 shadow-lg mb-3 sm:mb-4">
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl from-sunny/20 to-transparent rounded-full blur-2xl" />
          
          <CardContent className="p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-lg opacity-60" />
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm sm:text-lg truncate">
                    Welcome, {guestInfo.name}! 👋
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Free Trial Active
                  </p>
                </div>
              </div>
              
              {/* Timer */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-inner shrink-0">
                <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-coral animate-pulse" />
                <div className="text-right">
                  <span className="font-bold text-xs sm:text-sm text-primary font-mono">{getTimeRemaining()}</span>
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground">left</p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      )}

      {/* Page Title with Class Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shrink-0">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold font-display">
              My Courses
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
              Class {guestInfo?.selectedClass || "5"} • AI & Computational Thinking
            </p>
          </div>
        </div>
        
        {/* Class Change Control */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {guestInfo?.selectedClass && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChangeClass(true)}
              className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 text-xs h-8"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Class {guestInfo.selectedClass}</span>
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Courses Grid - Enhanced Cards */}
      {coursesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <div className="h-28 sm:h-32 bg-gradient-to-br from-muted to-muted/50" />
              <CardContent className="p-3 sm:p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-muted/50 to-muted/20 border-dashed">
          <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/50" />
          <h3 className="font-bold text-base sm:text-lg mb-2">No Courses for Class {guestInfo?.selectedClass}</h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-4">
            No published courses found for this class yet. Try changing your class from the header.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredCourses.map((course, index) => {
              const classMatch = course.title.match(/class\s*(\d+)/i);
              const classNum = classMatch ? classMatch[1] : "3";
              const gradients: Record<string, string> = {
                "3": "from-coral to-sunny",
                "4": "from-turquoise to-lime",
                "5": "from-primary to-secondary",
                "6": "from-purple to-primary",
                "7": "from-sunny to-coral",
                "8": "from-lime to-turquoise",
                "9": "from-secondary to-purple",
                "10": "from-primary to-turquoise",
              };
              const gradient = gradients[classNum] || gradients["3"];
              const banner = courseBanners[classNum] || bannerClass3;
              
              return (
                <Card
                  key={course.id}
                  className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 group border-2 border-transparent hover:border-primary/30"
                  onClick={() => handleCourseClick(course)}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Course Banner with Actual Image */}
                  <div className="relative h-24 sm:h-28 md:h-32 overflow-hidden">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                    {/* Banner Image */}
                    <img
                      src={banner}
                      alt={course.title}
                      className="w-full h-full object-cover mix-blend-overlay opacity-70 group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Class Badge */}
                    <Badge className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-white/95 text-foreground border-0 shadow-lg backdrop-blur-sm text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5">
                      Class {classNum}
                    </Badge>
                    
                    {/* Free Badge */}
                    <Badge className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-gradient-to-r from-sunny to-coral text-white border-0 shadow-lg text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
                      <Star className="h-2 sm:h-2.5 w-2 sm:w-2.5 mr-0.5 fill-current" />
                      Free
                    </Badge>
                    
                    {/* Course Icon */}
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Play Button on Hover */}
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 flex items-center justify-center shadow-xl">
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 text-primary fill-primary ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <CardContent className="p-2.5 sm:p-3 md:p-4 bg-gradient-to-b from-background to-muted/30">
                    <h3 className="font-bold text-xs sm:text-sm md:text-base line-clamp-2 leading-tight mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground line-clamp-2 mb-2 sm:mb-3 hidden sm:block">
                        {course.description}
                      </p>
                    )}
                    
                    {/* Course Content Indicators */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-coral/10">
                        <Video className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-coral" />
                        <span className="hidden sm:inline">Videos</span>
                      </span>
                      <span className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-purple/10">
                        <HelpCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-purple" />
                        <span className="hidden sm:inline">Quizzes</span>
                      </span>
                      <span className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-turquoise/10">
                        <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-turquoise" />
                        <span className="hidden sm:inline">E-Books</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* Sample E-Books Section */}
      {guestInfo && !coursesLoading && (
        <div className="mt-4 sm:mt-6">
          <SampleEbookViewer />
          
          {/* Physical Books Note */}
          <Card className="mt-3 sm:mt-4 overflow-hidden bg-gradient-to-r from-sunny/10 via-coral/5 to-sunny/10 border-sunny/30">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-sunny to-coral flex items-center justify-center shadow-lg shrink-0">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2 flex-wrap">
                    📚 Physical Books Available!
                    <Badge className="bg-coral/20 text-coral text-[10px]">Hard Copy Only</Badge>
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Our curriculum includes <span className="font-semibold text-foreground">Theory + Worksheet Books</span> designed for hands-on learning. 
                    The e-book samples above are <span className="text-primary font-medium">preview chapters only</span> - complete books are available as physical copies in our store.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/store")}
                    className="mt-2 gap-2 text-xs border-coral/30 text-coral hover:bg-coral hover:text-white"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Visit Book Store
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!coursesLoading && allCourses.filter((c) => c.is_published).length === 0 && (
        <Card className="p-8 text-center bg-gradient-to-br from-muted/50 to-muted/20">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-bold text-lg mb-2">No Courses Available</h3>
          <p className="text-muted-foreground text-sm">
            Check back soon for new content!
          </p>
        </Card>
      )}

      {/* Upgrade CTA */}
      {guestInfo && (
        <Card className="mt-6 overflow-hidden relative bg-gradient-to-r from-primary/15 via-secondary/15 to-purple/15 border-primary/20 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sunny/30 to-transparent rounded-full blur-2xl" />
          <Sparkles className="absolute top-4 right-4 h-5 w-5 text-sunny animate-pulse" />
          
          <CardContent className="p-5 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-xl animate-bounce-gentle">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-base sm:text-lg mb-1">
                  Enjoying the trial? 🚀
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sign up for unlimited access, track progress, earn badges, and compete on leaderboard!
                </p>
              </div>
              <Button
                onClick={() => navigate("/student/signup")}
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500 text-base font-semibold shadow-xl h-12"
              >
                <Sparkles className="h-5 w-5" />
                Sign Up Free
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Class Modal */}
      <ChangeClassModal
        open={showChangeClass}
        onOpenChange={setShowChangeClass}
        currentClass={guestInfo?.selectedClass || "5"}
        onClassChange={handleClassChange}
      />
    </div>
  );
}
