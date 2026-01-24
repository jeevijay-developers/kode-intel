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

  const classMatch = course.title.match(/class\s*(\d+)/i);
  const classNum = classMatch ? classMatch[1] : "3";
  const banner = courseBanners[classNum] || bannerClass3;
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
    <div className="animate-fade-in h-full flex flex-col">
      {/* Compact Course Header */}
      <div className="p-3 sm:p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0`}>
            <span className="text-sm font-bold text-primary-foreground">{classNum}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-sm sm:text-base truncate">{course.title}</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {chapters.length} Chapters
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                <Video className="h-2.5 w-2.5 mr-0.5" />
                {totalVideos}
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                <HelpCircle className="h-2.5 w-2.5 mr-0.5" />
                {totalQuizzes}
              </Badge>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-sunny to-coral text-primary-foreground border-0 text-[10px] shrink-0">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Trial
          </Badge>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chapter Selector - Horizontal scroll on mobile, sidebar on desktop */}
        <div className="lg:w-64 lg:border-r border-b lg:border-b-0 bg-muted/30 shrink-0">
          {/* Mobile: Horizontal scroll */}
          <div className="lg:hidden p-2">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-2">
                {chapters.map((chapter, index) => {
                  const chapterVideos = getChapterVideos(chapter.id);
                  const chapterQuizzes = getChapterQuizzes(chapter.id);
                  const isActive = index === selectedChapterIndex;
                  
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapterIndex(index)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl border-2 transition-all ${
                        isActive
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border/50 bg-background hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-medium truncate max-w-[100px] ${isActive ? "text-primary" : ""}`}>
                            {chapter.title.length > 15 ? chapter.title.slice(0, 15) + "..." : chapter.title}
                          </p>
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                            {chapterVideos.length > 0 && <span>{chapterVideos.length}V</span>}
                            {chapterQuizzes.length > 0 && <span>{chapterQuizzes.length}Q</span>}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Desktop: Vertical list */}
          <div className="hidden lg:block">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm text-muted-foreground">Chapters</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-220px)]">
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
                          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {selectedChapter && (
            <>
              {/* Chapter Title */}
              <div className="p-3 sm:p-4 border-b bg-background">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                    <span className="text-sm font-bold text-primary-foreground">{selectedChapterIndex + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Chapter {selectedChapterIndex + 1}</p>
                    <h2 className="font-bold text-base sm:text-lg">{selectedChapter.title}</h2>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <Tabs value={contentTab} onValueChange={(v) => setContentTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
                <div className="border-b px-3 sm:px-4">
                  <TabsList className="h-12 w-full justify-start gap-1 bg-transparent p-0">
                    <TabsTrigger
                      value="videos"
                      className="flex-1 sm:flex-none data-[state=active]:bg-coral/10 data-[state=active]:text-coral data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-coral gap-1.5"
                    >
                      <Play className="h-4 w-4" />
                      <span className="hidden sm:inline">Videos</span>
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                        {videos.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="quizzes"
                      className="flex-1 sm:flex-none data-[state=active]:bg-purple/10 data-[state=active]:text-purple data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-purple gap-1.5"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Quizzes</span>
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                        {quizzes.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="books"
                      className="flex-1 sm:flex-none data-[state=active]:bg-turquoise/10 data-[state=active]:text-turquoise data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-turquoise gap-1.5"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Books</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-3 sm:p-4">
                      {/* Videos Tab */}
                      <TabsContent value="videos" className="mt-0 space-y-2">
                        {videos.length === 0 ? (
                          <Card className="p-6 text-center border-dashed">
                            <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">No videos in this chapter yet</p>
                          </Card>
                        ) : (
                          <div className="grid gap-2">
                            {videos.map((video: any, idx: number) => {
                              const watched = isVideoWatched(video.id);
                              return (
                                <button
                                  key={video.id}
                                  onClick={() => onVideoClick(video)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all hover:shadow-md text-left group ${
                                    watched
                                      ? "border-lime/40 bg-lime/5"
                                      : "border-border/50 bg-card hover:border-coral/40"
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    watched ? "bg-lime/20" : "bg-coral/10 group-hover:bg-coral/20"
                                  }`}>
                                    {watched ? (
                                      <CheckCircle className="h-5 w-5 text-lime" />
                                    ) : (
                                      <Play className="h-5 w-5 text-coral" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium truncate ${watched ? "text-lime" : "group-hover:text-coral"}`}>
                                      {video.title}
                                    </p>
                                    {video.duration_minutes && (
                                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <Clock className="h-3 w-3" />
                                        {video.duration_minutes} min
                                      </p>
                                    )}
                                  </div>
                                  <Badge className={`shrink-0 ${watched ? "bg-lime/20 text-lime" : "bg-coral/10 text-coral"}`}>
                                    {watched ? "Watched" : "Watch"}
                                  </Badge>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </TabsContent>

                      {/* Quizzes Tab */}
                      <TabsContent value="quizzes" className="mt-0 space-y-2">
                        {quizzes.length === 0 ? (
                          <Card className="p-6 text-center border-dashed">
                            <HelpCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">No quizzes in this chapter yet</p>
                          </Card>
                        ) : (
                          <div className="grid gap-2">
                            {quizzes.map((quiz: any) => {
                              const completed = isQuizCompleted(quiz.id);
                              const result = getQuizScore(quiz.id);
                              return (
                                <button
                                  key={quiz.id}
                                  onClick={() => navigate(`/guest/quiz/${quiz.id}`)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all hover:shadow-md text-left group ${
                                    completed
                                      ? result?.passed
                                        ? "border-lime/40 bg-lime/5"
                                        : "border-coral/40 bg-coral/5"
                                      : "border-border/50 bg-card hover:border-purple/40"
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    completed
                                      ? result?.passed
                                        ? "bg-lime/20"
                                        : "bg-coral/20"
                                      : "bg-purple/10 group-hover:bg-purple/20"
                                  }`}>
                                    {completed ? (
                                      result?.passed ? (
                                        <CheckCircle className="h-5 w-5 text-lime" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-coral" />
                                      )
                                    ) : (
                                      <HelpCircle className="h-5 w-5 text-purple" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium truncate ${
                                      completed
                                        ? result?.passed
                                          ? "text-lime"
                                          : "text-coral"
                                        : "group-hover:text-purple"
                                    }`}>
                                      {quiz.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {completed
                                        ? `Score: ${result?.score}% ${result?.passed ? "✓ Passed" : "• Try Again"}`
                                        : `Passing score: ${quiz.passing_score}%`
                                      }
                                    </p>
                                  </div>
                                  <Badge className={`shrink-0 ${
                                    completed
                                      ? result?.passed
                                        ? "bg-lime/20 text-lime"
                                        : "bg-coral/20 text-coral"
                                      : "bg-purple/10 text-purple"
                                  }`}>
                                    {completed ? (result?.passed ? "Passed" : "Retry") : "Start"}
                                  </Badge>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </TabsContent>

                      {/* Books Tab */}
                      <TabsContent value="books" className="mt-0 space-y-3">
                        {/* Sample Preview */}
                        <button
                          onClick={() => onPdfClick({
                            title: `${selectedChapter.title} - Sample Book Preview`,
                            pdfUrl: samplePdf.pdfUrl,
                            classNum: samplePdf.classNum,
                          })}
                          className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-turquoise/30 bg-gradient-to-r from-turquoise/5 to-lime/5 hover:from-turquoise/10 hover:to-lime/10 transition-all hover:shadow-md text-left group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-turquoise/20 flex items-center justify-center shrink-0 group-hover:bg-turquoise/30 transition-colors">
                            <BookOpen className="h-6 w-6 text-turquoise" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium group-hover:text-turquoise transition-colors">
                              Sample Book Preview
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Free soft copy preview • {samplePdf.label} sample (non-downloadable)
                            </p>
                          </div>
                          <Badge className="bg-turquoise/20 text-turquoise border-turquoise/30 group-hover:bg-turquoise group-hover:text-primary-foreground transition-colors shrink-0">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Badge>
                        </button>

                        {/* Physical Book Notice */}
                        <Card className="p-4 bg-gradient-to-r from-sunny/10 to-coral/10 border-sunny/30">
                          <div className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-sunny shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium flex items-center gap-2">
                                Theory + Worksheet Books
                                <Badge className="bg-coral/20 text-coral text-[10px]">Hard Copy</Badge>
                              </p>
                              <p className="text-muted-foreground text-xs mt-1">
                                Our books are available as physical copies only. The soft copy previews are sample chapters.
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate("/store");
                                }}
                                className="mt-2 h-8 text-xs gap-1 border-coral/30 text-coral hover:bg-coral hover:text-primary-foreground"
                              >
                                <BookOpen className="h-3 w-3" />
                                Buy Physical Books
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>
                    </div>
                  </ScrollArea>
                </div>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
