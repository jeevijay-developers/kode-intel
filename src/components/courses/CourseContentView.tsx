import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Play,
  Video,
  Star,
  ChevronRight,
  Clock,
  HelpCircle,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
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
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
  const [contentTab, setContentTab] = useState<"videos" | "quizzes" | "books">("videos");

  const classMatch = course.title.match(/class\s*(\d+)/i);
  const classNum = classMatch ? classMatch[1] : "3";
  const gradient = gradientMap[classNum] || gradientMap["3"];

  const selectedChapter = selectedChapterIndex !== null ? chapters[selectedChapterIndex] : null;
  const videos = selectedChapter ? getChapterVideos(selectedChapter.id) : [];
  const quizzes = selectedChapter ? getChapterQuizzes(selectedChapter.id) : [];
  const ebooks = selectedChapter ? getChapterEbooks(selectedChapter.id) : [];

  // Fetch digital books for selected chapter
  const { data: digitalBooks = [] } = useQuery({
    queryKey: ["chapter-digital-books", selectedChapter?.id],
    queryFn: async () => {
      if (!selectedChapter?.id) return [];
      const { data, error } = await supabase
        .from("digital_books")
        .select("id, title, subtitle, estimated_reading_time, cover_image_url")
        .eq("chapter_id", selectedChapter.id)
        .eq("is_published", true);
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedChapter?.id,
  });

  const totalVideos = chapters.reduce((sum, ch) => sum + getChapterVideos(ch.id).length, 0);
  const totalQuizzes = chapters.reduce((sum, ch) => sum + getChapterQuizzes(ch.id).length, 0);

  const handleChapterSelect = (index: number) => {
    if (selectedChapterIndex === index) {
      setSelectedChapterIndex(null); // Collapse if clicking same chapter
    } else {
      setSelectedChapterIndex(index);
      setContentTab("videos"); // Reset to videos tab
    }
  };

  const handleBackToChapters = () => {
    setSelectedChapterIndex(null);
  };

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
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background border-b shadow-sm">
        <div className="px-3 py-2.5 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={selectedChapterIndex !== null ? handleBackToChapters : onBack}
            className="h-8 w-8 shrink-0 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow shrink-0`}>
            <span className="text-xs font-bold text-primary-foreground">{classNum}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm leading-tight truncate">
              {selectedChapterIndex !== null ? selectedChapter?.title : course.title}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              {selectedChapterIndex !== null ? (
                <span className="text-[10px] text-muted-foreground">
                  Chapter {selectedChapterIndex + 1} of {chapters.length}
                </span>
              ) : (
                <>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Layers className="h-2.5 w-2.5" />
                    {chapters.length} Chapters
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
                </>
              )}
            </div>
          </div>
          
          <Badge className="bg-gradient-to-r from-sunny to-coral text-primary-foreground border-0 text-[9px] px-2 py-0.5 shrink-0">
            <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
            Trial
          </Badge>
        </div>

        {/* Content Type Tabs - Only show when chapter is selected */}
        {selectedChapterIndex !== null && (
          <div className="flex border-t bg-muted/30">
            <button
              onClick={() => setContentTab("videos")}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium transition-all border-b-2 ${
                contentTab === "videos"
                  ? "border-coral text-coral bg-coral/10"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              <Play className="h-3.5 w-3.5" />
              Videos
              <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-background">
                {videos.length}
              </Badge>
            </button>
            <button
              onClick={() => setContentTab("quizzes")}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium transition-all border-b-2 ${
                contentTab === "quizzes"
                  ? "border-purple text-purple bg-purple/10"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Quizzes
              <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-background">
                {quizzes.length}
              </Badge>
            </button>
            <button
              onClick={() => setContentTab("books")}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium transition-all border-b-2 ${
                contentTab === "books"
                  ? "border-turquoise text-turquoise bg-turquoise/10"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Books
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* MOBILE: Chapter List View (when no chapter selected) */}
        {selectedChapterIndex === null ? (
          <div className="p-3 space-y-2 pb-24 lg:hidden">
            <p className="text-xs text-muted-foreground font-medium px-1 mb-3">
              Select a chapter to view content
            </p>
            {chapters.map((chapter, index) => {
              const chapterVideos = getChapterVideos(chapter.id);
              const chapterQuizzes = getChapterQuizzes(chapter.id);
              const watchedCount = chapterVideos.filter(v => isVideoWatched(v.id)).length;
              const completedQuizzes = chapterQuizzes.filter(q => isQuizCompleted(q.id)).length;
              
              return (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(index)}
                  className="w-full p-3 rounded-xl border bg-card hover:bg-muted/50 active:scale-[0.99] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md shrink-0`}>
                      <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{chapter.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {chapterVideos.length > 0 && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Video className="h-3 w-3 text-coral" />
                            {watchedCount}/{chapterVideos.length}
                          </span>
                        )}
                        {chapterQuizzes.length > 0 && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <HelpCircle className="h-3 w-3 text-purple" />
                            {completedQuizzes}/{chapterQuizzes.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* MOBILE: Chapter Content View */
          <div className="p-3 space-y-2 pb-24 lg:hidden">
            {/* Videos Tab Content */}
            {contentTab === "videos" && (
              <>
                {videos.length === 0 ? (
                  <Card className="p-8 text-center border-dashed">
                    <Video className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No videos in this chapter</p>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {videos.map((video: any) => {
                      const watched = isVideoWatched(video.id);
                      return (
                        <button
                          key={video.id}
                          onClick={() => onVideoClick(video)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.98] ${
                            watched
                              ? "border-lime/50 bg-lime/5"
                              : "border-border bg-card"
                          }`}
                        >
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            watched ? "bg-lime/20" : "bg-coral/10"
                          }`}>
                            {watched ? (
                              <CheckCircle className="h-5 w-5 text-lime" />
                            ) : (
                              <Play className="h-5 w-5 text-coral fill-coral/20" />
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className={`text-sm font-medium ${watched ? "text-lime" : ""}`}>
                              {video.title}
                            </p>
                            {video.duration_minutes && (
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="h-3 w-3" />
                                {video.duration_minutes} min
                              </p>
                            )}
                          </div>
                          <Badge className={`shrink-0 text-[10px] ${
                            watched 
                              ? "bg-lime/20 text-lime border-lime/30" 
                              : "bg-coral/10 text-coral border-coral/30"
                          }`}>
                            {watched ? "Done" : "Watch"}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Quizzes Tab Content */}
            {contentTab === "quizzes" && (
              <>
                {quizzes.length === 0 ? (
                  <Card className="p-8 text-center border-dashed">
                    <HelpCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No quizzes in this chapter</p>
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
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.98] ${
                            completed
                              ? passed
                                ? "border-lime/50 bg-lime/5"
                                : "border-coral/50 bg-coral/5"
                              : "border-border bg-card"
                          }`}
                        >
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            completed
                              ? passed ? "bg-lime/20" : "bg-coral/20"
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
                            <p className={`text-sm font-medium ${
                              completed ? (passed ? "text-lime" : "text-coral") : ""
                            }`}>
                              {quiz.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {completed
                                ? `Score: ${result?.score}% ${passed ? "✓" : ""}`
                                : `Pass: ${quiz.passing_score}%`}
                            </p>
                          </div>
                          <Badge className={`shrink-0 text-[10px] ${
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

            {/* Books Tab Content */}
            {contentTab === "books" && (
              <div className="space-y-3">
                {digitalBooks.length > 0 ? (
                  digitalBooks.map((book: any) => (
                    <button
                      key={book.id}
                      onClick={() => navigate(`/guest/book/${book.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-turquoise/40 bg-gradient-to-r from-turquoise/5 to-lime/5 active:from-turquoise/10 active:to-lime/10 transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-turquoise/20 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-turquoise" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium truncate">{book.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Interactive Digital Book • {book.estimated_reading_time || 10} min read
                        </p>
                      </div>
                      <Badge className="bg-turquoise/20 text-turquoise border-turquoise/30 shrink-0">
                        <Eye className="h-3 w-3 mr-1" />
                        Read
                      </Badge>
                    </button>
                  ))
                ) : (
                  <Card className="p-6 text-center border-dashed">
                    <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No digital books in this chapter yet</p>
                  </Card>
                )}

                <Card className="p-3 bg-gradient-to-r from-sunny/10 to-coral/10 border-sunny/30">
                  <div className="flex items-start gap-2.5">
                    <BookOpen className="h-5 w-5 text-sunny shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2 flex-wrap">
                        Physical Books
                        <Badge className="bg-coral/20 text-coral text-[9px] px-1.5">Hard Copy</Badge>
                      </p>
                      <p className="text-muted-foreground text-[11px] mt-1">
                        Theory + Worksheets available for purchase
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
                        Buy Books
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* DESKTOP: Split Layout */}
        <div className="hidden lg:flex flex-1 min-h-0">
          {/* Desktop Sidebar */}
          <div className="w-72 border-r bg-muted/20 flex flex-col">
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

          {/* Desktop Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {selectedChapterIndex !== null && selectedChapter ? (
              <>
                {/* Desktop Tabs */}
                <div className="shrink-0 bg-background border-b px-4">
                  <div className="flex gap-1 py-2">
                    <button
                      onClick={() => setContentTab("videos")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        contentTab === "videos"
                          ? "bg-coral/10 text-coral"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Play className="h-4 w-4 inline mr-1.5" />
                      Videos ({videos.length})
                    </button>
                    <button
                      onClick={() => setContentTab("quizzes")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        contentTab === "quizzes"
                          ? "bg-purple/10 text-purple"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <HelpCircle className="h-4 w-4 inline mr-1.5" />
                      Quizzes ({quizzes.length})
                    </button>
                    <button
                      onClick={() => setContentTab("books")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        contentTab === "books"
                          ? "bg-turquoise/10 text-turquoise"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <BookOpen className="h-4 w-4 inline mr-1.5" />
                      Books
                    </button>
                  </div>
                </div>

                {/* Desktop Content */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    {contentTab === "videos" && videos.map((video: any) => {
                      const watched = isVideoWatched(video.id);
                      return (
                        <button
                          key={video.id}
                          onClick={() => onVideoClick(video)}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                            watched ? "border-lime/50 bg-lime/5" : "border-border bg-card hover:border-coral/40"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            watched ? "bg-lime/20" : "bg-coral/10"
                          }`}>
                            {watched ? <CheckCircle className="h-6 w-6 text-lime" /> : <Play className="h-6 w-6 text-coral" />}
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`font-medium ${watched ? "text-lime" : ""}`}>{video.title}</p>
                            {video.duration_minutes && (
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {video.duration_minutes} min
                              </p>
                            )}
                          </div>
                          <Badge className={watched ? "bg-lime/20 text-lime" : "bg-coral/10 text-coral"}>
                            {watched ? "Watched" : "Watch"}
                          </Badge>
                        </button>
                      );
                    })}

                    {contentTab === "quizzes" && quizzes.map((quiz: any) => {
                      const completed = isQuizCompleted(quiz.id);
                      const result = getQuizScore(quiz.id);
                      const passed = result?.passed;
                      return (
                        <button
                          key={quiz.id}
                          onClick={() => navigate(`/guest/quiz/${quiz.id}`)}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                            completed
                              ? passed ? "border-lime/50 bg-lime/5" : "border-coral/50 bg-coral/5"
                              : "border-border bg-card hover:border-purple/40"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            completed ? (passed ? "bg-lime/20" : "bg-coral/20") : "bg-purple/10"
                          }`}>
                            {completed ? (passed ? <CheckCircle className="h-6 w-6 text-lime" /> : <XCircle className="h-6 w-6 text-coral" />) : <HelpCircle className="h-6 w-6 text-purple" />}
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`font-medium ${completed ? (passed ? "text-lime" : "text-coral") : ""}`}>{quiz.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {completed ? `Score: ${result?.score}%` : `Passing: ${quiz.passing_score}%`}
                            </p>
                          </div>
                          <Badge className={completed ? (passed ? "bg-lime/20 text-lime" : "bg-coral/20 text-coral") : "bg-purple/10 text-purple"}>
                            {completed ? (passed ? "Passed" : "Retry") : "Start"}
                          </Badge>
                        </button>
                      );
                    })}

                    {contentTab === "books" && (
                      <>
                        {digitalBooks.length > 0 ? (
                          digitalBooks.map((book: any) => (
                            <button
                              key={book.id}
                              onClick={() => navigate(`/guest/book/${book.id}`)}
                              className="w-full flex items-center gap-3 p-4 rounded-xl border border-turquoise/40 bg-gradient-to-r from-turquoise/5 to-lime/5 hover:from-turquoise/10 hover:to-lime/10 transition-all"
                            >
                              <div className="w-12 h-12 rounded-xl bg-turquoise/20 flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-turquoise" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-medium">{book.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Interactive Digital Book • {book.estimated_reading_time || 10} min read
                                </p>
                              </div>
                              <Badge className="bg-turquoise/20 text-turquoise border-turquoise/30">
                                <Eye className="h-3 w-3 mr-1" /> Read
                              </Badge>
                            </button>
                          ))
                        ) : (
                          <Card className="p-8 text-center border-dashed">
                            <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                            <p className="text-muted-foreground">No digital books in this chapter yet</p>
                          </Card>
                        )}
                        <Card className="p-4 bg-gradient-to-r from-sunny/10 to-coral/10 border-sunny/30">
                          <div className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-sunny shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                Physical Books <Badge className="bg-coral/20 text-coral text-[10px]">Hard Copy</Badge>
                              </p>
                              <p className="text-muted-foreground text-sm mt-1">Theory + Worksheets available for purchase</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); navigate("/store"); }}
                                className="mt-3 gap-1 border-coral/30 text-coral hover:bg-coral hover:text-primary-foreground"
                              >
                                <BookOpen className="h-3 w-3" /> Buy Books
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </>
                    )}

                    {contentTab === "videos" && videos.length === 0 && (
                      <Card className="p-8 text-center border-dashed">
                        <Video className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No videos in this chapter</p>
                      </Card>
                    )}
                    {contentTab === "quizzes" && quizzes.length === 0 && (
                      <Card className="p-8 text-center border-dashed">
                        <HelpCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No quizzes in this chapter</p>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Select a chapter to view content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
