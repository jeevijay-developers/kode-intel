import { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Play,
  Video,
  Star,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  ArrowLeft,
  Eye,
  Loader2,
  CheckCircle,
  XCircle,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  Layers,
} from "lucide-react";

// Course banner imports
import bannerClass3 from "@/assets/course-banner-class3.png";
import bannerPatterns from "@/assets/course-banner-patterns.png";
import bannerComputational from "@/assets/course-banner-computational.png";
import bannerAlgorithms from "@/assets/course-banner-algorithms.png";
import bannerDataStructures from "@/assets/course-banner-data-structures.png";
import bannerAIIntro from "@/assets/course-banner-ai-intro.png";
import bannerML from "@/assets/course-banner-ml.png";
import bannerAIProjects from "@/assets/course-banner-ai-projects.png";

const GuestPdfPreview = lazy(() => import("@/components/student/GuestPdfPreview"));

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

const gradientMap: Record<string, string> = {
  "3": "from-coral to-sunny",
  "4": "from-turquoise to-lime",
  "5": "from-primary to-secondary",
  "6": "from-purple to-primary",
  "7": "from-sunny to-coral",
  "8": "from-lime to-turquoise",
  "9": "from-secondary to-purple",
  "10": "from-primary to-turquoise",
};

// Available sample PDFs
const availableSamplePdfs = [
  { classNum: "4", pdfUrl: "/ebooks/class-4-chapter-1.pdf", label: "Class 4" },
  { classNum: "6", pdfUrl: "/ebooks/class-6-chapter-1.pdf", label: "Class 6" },
  { classNum: "7", pdfUrl: "/ebooks/class-7-chapter-1.pdf", label: "Class 7" },
];

const getSamplePdfForClass = (classNum: string) => {
  const exact = availableSamplePdfs.find(p => p.classNum === classNum);
  if (exact) return exact;
  const num = parseInt(classNum);
  if (num <= 4) return availableSamplePdfs[0];
  if (num <= 6) return availableSamplePdfs[1];
  return availableSamplePdfs[2];
};

interface CourseContentViewProps {
  course: any;
  chapters: any[];
  getChapterVideos: (chapterId: string) => any[];
  getChapterQuizzes: (chapterId: string) => any[];
  getChapterEbooks: (chapterId: string) => any[];
  isVideoWatched: (videoId: string) => boolean;
  isQuizCompleted: (quizId: string) => boolean;
  getQuizScore: (quizId: string) => { score: number; passed: boolean } | null;
  isEbookViewed: (ebookId: string) => boolean;
  onBack: () => void;
  onVideoClick: (video: any) => void;
  onPdfClick: (pdf: { title: string; pdfUrl: string; classNum: string; ebookId?: string }) => void;
}

export function CourseContentView({
  course,
  chapters,
  getChapterVideos,
  getChapterQuizzes,
  getChapterEbooks,
  isVideoWatched,
  isQuizCompleted,
  getQuizScore,
  isEbookViewed,
  onBack,
  onVideoClick,
  onPdfClick,
}: CourseContentViewProps) {
  const navigate = useNavigate();
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [contentTab, setContentTab] = useState<"videos" | "quizzes" | "books">("videos");
  const [showChapterSelector, setShowChapterSelector] = useState(false);

  const classMatch = course.title.match(/class\s*(\d+)/i);
  const classNum = classMatch ? classMatch[1] : "3";
  const gradient = gradientMap[classNum] || gradientMap["3"];

  const selectedChapter = chapters[selectedChapterIndex];
  const videos = selectedChapter ? getChapterVideos(selectedChapter.id) : [];
  const quizzes = selectedChapter ? getChapterQuizzes(selectedChapter.id) : [];
  const ebooks = selectedChapter ? getChapterEbooks(selectedChapter.id) : [];
  const samplePdf = getSamplePdfForClass(classNum);

  // Count content for badges
  const totalVideos = chapters.reduce((sum, ch) => sum + getChapterVideos(ch.id).length, 0);
  const totalQuizzes = chapters.reduce((sum, ch) => sum + getChapterQuizzes(ch.id).length, 0);

  if (chapters.length === 0) {
    return (
      <div className="p-4 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Card className="p-8 text-center">
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
          <h3 className="font-bold text-lg mb-1">No Chapters Yet</h3>
          <p className="text-muted-foreground text-sm">Course content is being prepared</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-full flex flex-col bg-background">
      {/* Sticky Compact Course Header - Mobile Optimized */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="px-3 py-2.5 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="h-8 w-8 shrink-0 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow shrink-0`}>
            <span className="text-xs font-bold text-primary-foreground">{classNum}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm leading-tight truncate">{course.title}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <Layers className="h-2.5 w-2.5" />
                {chapters.length}
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <Video className="h-2.5 w-2.5" />
                {totalVideos}
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <HelpCircle className="h-2.5 w-2.5" />
                {totalQuizzes}
              </span>
            </div>
          </div>
          
          <Badge className="bg-gradient-to-r from-sunny to-coral text-primary-foreground border-0 text-[9px] px-2 py-0.5 shrink-0">
            <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
            Trial
          </Badge>
        </div>
      </div>

      {/* Chapter Selector - Mobile Dropdown / Desktop Sidebar */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowChapterSelector(!showChapterSelector)}
          className="w-full px-3 py-2.5 flex items-center gap-3 bg-muted/50 border-b active:bg-muted transition-colors"
        >
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
            <span className="text-[10px] font-bold text-primary-foreground">{selectedChapterIndex + 1}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Chapter {selectedChapterIndex + 1}</p>
            <p className="text-sm font-medium truncate">{selectedChapter?.title}</p>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showChapterSelector ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Mobile Chapter List Dropdown */}
        {showChapterSelector && (
          <div className="border-b bg-background max-h-64 overflow-y-auto">
            {chapters.map((chapter, index) => {
              const chapterVideos = getChapterVideos(chapter.id);
              const chapterQuizzes = getChapterQuizzes(chapter.id);
              const isActive = index === selectedChapterIndex;
              
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setSelectedChapterIndex(index);
                    setShowChapterSelector(false);
                  }}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 border-b border-border/30 last:border-0 transition-colors ${
                    isActive ? "bg-primary/5" : "active:bg-muted/50"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    isActive 
                      ? `bg-gradient-to-br ${gradient} text-primary-foreground` 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-sm truncate ${isActive ? "font-semibold text-primary" : ""}`}>
                      {chapter.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      {chapterVideos.length > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Video className="h-2.5 w-2.5" /> {chapterVideos.length}
                        </span>
                      )}
                      {chapterQuizzes.length > 0 && (
                        <span className="flex items-center gap-0.5">
                          <HelpCircle className="h-2.5 w-2.5" /> {chapterQuizzes.length}
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && <CheckCircle className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-72 border-r bg-muted/20">
          <div className="p-3 border-b bg-background/50">
            <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Chapters
            </h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chapters.map((chapter, index) => {
                const chapterVideos = getChapterVideos(chapter.id);
                const chapterQuizzes = getChapterQuizzes(chapter.id);
                const isActive = index === selectedChapterIndex;
                
                return (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapterIndex(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary/10 border-2 border-primary shadow-sm"
                        : "hover:bg-muted border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                        isActive 
                          ? `bg-gradient-to-br ${gradient} text-primary-foreground` 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-tight ${isActive ? "text-primary" : ""}`}>
                          {chapter.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {chapterVideos.length > 0 && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Video className="h-2.5 w-2.5" />
                              {chapterVideos.length}
                            </span>
                          )}
                          {chapterQuizzes.length > 0 && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <HelpCircle className="h-2.5 w-2.5" />
                              {chapterQuizzes.length}
                            </span>
                          )}
                        </div>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {selectedChapter && (
            <>
              {/* Content Tabs - Fixed at top */}
              <div className="shrink-0 bg-background border-b">
                <TabsList className="w-full h-11 justify-start gap-0 bg-transparent p-0 rounded-none">
                  <button
                    onClick={() => setContentTab("videos")}
                    className={`flex-1 h-full flex items-center justify-center gap-1.5 text-sm font-medium transition-all border-b-2 ${
                      contentTab === "videos"
                        ? "border-coral text-coral bg-coral/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Play className="h-4 w-4" />
                    <span className="hidden xs:inline">Videos</span>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-0.5">
                      {videos.length}
                    </Badge>
                  </button>
                  <button
                    onClick={() => setContentTab("quizzes")}
                    className={`flex-1 h-full flex items-center justify-center gap-1.5 text-sm font-medium transition-all border-b-2 ${
                      contentTab === "quizzes"
                        ? "border-purple text-purple bg-purple/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden xs:inline">Quizzes</span>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-0.5">
                      {quizzes.length}
                    </Badge>
                  </button>
                  <button
                    onClick={() => setContentTab("books")}
                    className={`flex-1 h-full flex items-center justify-center gap-1.5 text-sm font-medium transition-all border-b-2 ${
                      contentTab === "books"
                        ? "border-turquoise text-turquoise bg-turquoise/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden xs:inline">Books</span>
                  </button>
                </TabsList>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-3 space-y-2 pb-24">
                  {/* Videos Content */}
                  {contentTab === "videos" && (
                    <>
                      {videos.length === 0 ? (
                        <Card className="p-6 text-center border-dashed">
                          <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">No videos in this chapter yet</p>
                        </Card>
                      ) : (
                        <div className="space-y-2">
                          {videos.map((video: any, idx: number) => {
                            const watched = isVideoWatched(video.id);
                            return (
                              <button
                                key={video.id}
                                onClick={() => onVideoClick(video)}
                                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all active:scale-[0.98] ${
                                  watched
                                    ? "border-lime/50 bg-lime/5"
                                    : "border-border bg-card active:bg-muted/50"
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  watched ? "bg-lime/20" : "bg-coral/10"
                                }`}>
                                  {watched ? (
                                    <CheckCircle className="h-5 w-5 text-lime" />
                                  ) : (
                                    <Play className="h-5 w-5 text-coral" />
                                  )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <p className={`text-sm font-medium truncate ${watched ? "text-lime" : ""}`}>
                                    {video.title}
                                  </p>
                                  {video.duration_minutes && (
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <Clock className="h-3 w-3" />
                                      {video.duration_minutes} min
                                    </p>
                                  )}
                                </div>
                                <ChevronRight className={`h-4 w-4 shrink-0 ${watched ? "text-lime" : "text-muted-foreground"}`} />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {/* Quizzes Content */}
                  {contentTab === "quizzes" && (
                    <>
                      {quizzes.length === 0 ? (
                        <Card className="p-6 text-center border-dashed">
                          <HelpCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">No quizzes in this chapter yet</p>
                        </Card>
                      ) : (
                        <div className="space-y-2">
                          {quizzes.map((quiz: any) => {
                            const completed = isQuizCompleted(quiz.id);
                            const result = getQuizScore(quiz.id);
                            const passed = result?.passed;
                            
                            return (
                              <button
                                key={quiz.id}
                                onClick={() => navigate(`/guest/quiz/${quiz.id}`)}
                                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all active:scale-[0.98] ${
                                  completed
                                    ? passed
                                      ? "border-lime/50 bg-lime/5"
                                      : "border-coral/50 bg-coral/5"
                                    : "border-border bg-card active:bg-muted/50"
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  completed
                                    ? passed
                                      ? "bg-lime/20"
                                      : "bg-coral/20"
                                    : "bg-purple/10"
                                }`}>
                                  {completed ? (
                                    passed ? (
                                      <CheckCircle className="h-5 w-5 text-lime" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-coral" />
                                    )
                                  ) : (
                                    <HelpCircle className="h-5 w-5 text-purple" />
                                  )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <p className={`text-sm font-medium truncate ${
                                    completed ? (passed ? "text-lime" : "text-coral") : ""
                                  }`}>
                                    {quiz.title}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {completed
                                      ? `Score: ${result?.score}%`
                                      : `Pass: ${quiz.passing_score}%`}
                                  </p>
                                </div>
                                <Badge className={`shrink-0 text-[10px] px-2 ${
                                  completed
                                    ? passed
                                      ? "bg-lime/20 text-lime border-lime/30"
                                      : "bg-coral/20 text-coral border-coral/30"
                                    : "bg-purple/10 text-purple border-purple/30"
                                }`}>
                                  {completed ? (passed ? "Passed" : "Retry") : "Start"}
                                </Badge>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {/* Books Content */}
                  {contentTab === "books" && (
                    <div className="space-y-3">
                      {/* Sample Preview */}
                      <button
                        onClick={() => onPdfClick({
                          title: `${selectedChapter.title} - Sample Book Preview`,
                          pdfUrl: samplePdf.pdfUrl,
                          classNum: samplePdf.classNum,
                        })}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-turquoise/40 bg-gradient-to-r from-turquoise/5 to-lime/5 active:from-turquoise/10 active:to-lime/10 transition-all"
                      >
                        <div className="w-11 h-11 rounded-xl bg-turquoise/20 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-turquoise" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-medium">Sample Book Preview</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Free preview • {samplePdf.label}
                          </p>
                        </div>
                        <Badge className="bg-turquoise/20 text-turquoise border-turquoise/30 shrink-0">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Badge>
                      </button>

                      {/* Physical Book Notice */}
                      <Card className="p-3 bg-gradient-to-r from-sunny/10 to-coral/10 border-sunny/30">
                        <div className="flex items-start gap-2.5">
                          <BookOpen className="h-5 w-5 text-sunny shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium flex items-center gap-2 flex-wrap">
                              Theory + Worksheet Books
                              <Badge className="bg-coral/20 text-coral text-[9px] px-1.5">Hard Copy</Badge>
                            </p>
                            <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                              Physical copies available for purchase. Soft copies are samples only.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/store");
                              }}
                              className="mt-2.5 h-8 text-xs gap-1 border-coral/30 text-coral hover:bg-coral hover:text-primary-foreground active:scale-[0.98]"
                            >
                              <BookOpen className="h-3 w-3" />
                              Buy Books
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
