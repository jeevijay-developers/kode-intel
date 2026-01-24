import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Play,
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
  Lock,
  ChevronRight,
  Star,
  Rocket,
  Lightbulb,
  Target,
  Flame,
  Zap,
  Palette,
  Gamepad2,
  Trophy,
  Rainbow,
  ArrowLeft,
  Clock,
  Eye,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CourseContentViewerProps {
  chapters: any[];
  studentId: string;
  isLocked?: (index: number) => boolean;
  onVideoClick?: (video: any, chapterId: string) => void;
  onQuizClick?: (quiz: any, chapterId: string) => void;
  onEbookClick?: (ebook: any, chapterId: string) => void;
}

const chapterIcons = [
  Star, Rocket, Lightbulb, Target, Flame, Zap, Palette, Gamepad2, Trophy, Rainbow,
];

export function CourseContentViewer({
  chapters,
  studentId,
  isLocked = () => false,
  onVideoClick,
  onQuizClick,
  onEbookClick,
}: CourseContentViewerProps) {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(
    chapters.length > 0 ? chapters[0]?.id : null
  );
  const [activeTab, setActiveTab] = useState<"videos" | "quizzes" | "books">("videos");
  const { toast } = useToast();
  const navigate = useNavigate();

  const selectedChapterData = chapters.find(c => c.id === selectedChapter);
  const selectedChapterIndex = chapters.findIndex(c => c.id === selectedChapter);
  const ChapterIcon = chapterIcons[selectedChapterIndex % chapterIcons.length];

  // Fetch content for selected chapter
  const { data: videos = [] } = useQuery({
    queryKey: ["chapter-videos", selectedChapter],
    queryFn: async () => {
      if (!selectedChapter) return [];
      const { data, error } = await supabase
        .from("chapter_videos")
        .select("*")
        .eq("chapter_id", selectedChapter)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedChapter,
  });

  const { data: quizzes = [] } = useQuery({
    queryKey: ["chapter-quizzes", selectedChapter],
    queryFn: async () => {
      if (!selectedChapter) return [];
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .select("*")
        .eq("chapter_id", selectedChapter)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedChapter,
  });

  const { data: ebooks = [] } = useQuery({
    queryKey: ["chapter-ebooks", selectedChapter],
    queryFn: async () => {
      if (!selectedChapter) return [];
      const { data, error } = await supabase
        .from("chapter_ebooks")
        .select("*")
        .eq("chapter_id", selectedChapter)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedChapter,
  });

  // Video progress
  const { data: videoProgress = [] } = useQuery({
    queryKey: ["video-progress", studentId, selectedChapter],
    queryFn: async () => {
      const videoIds = videos.map((v: any) => v.id);
      if (videoIds.length === 0) return [];
      const { data, error } = await supabase
        .from("student_video_progress")
        .select("*")
        .eq("student_id", studentId)
        .in("video_id", videoIds);
      if (error) throw error;
      return data;
    },
    enabled: videos.length > 0 && !!studentId,
  });

  const isVideoCompleted = (videoId: string) => {
    return videoProgress.some((p: any) => p.video_id === videoId && p.is_completed);
  };

  const handleLockedClick = () => {
    toast({
      title: "Content Locked",
      description: "Subscribe to unlock this chapter!",
      variant: "destructive",
    });
  };

  const chapterIsLocked = isLocked(selectedChapterIndex);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Chapter Selector - Left Panel */}
      <Card className="lg:w-72 shrink-0">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Select Chapter</span>
          </div>
          <ScrollArea className="h-[300px] lg:h-[400px]">
            <div className="space-y-1.5 pr-2">
              {chapters.map((chapter, index) => {
                const Icon = chapterIcons[index % chapterIcons.length];
                const locked = isLocked(index);
                const isSelected = selectedChapter === chapter.id;
                
                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      if (locked) {
                        handleLockedClick();
                      } else {
                        setSelectedChapter(chapter.id);
                      }
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 group ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : locked
                        ? "bg-muted/50 opacity-60"
                        : "hover:bg-muted/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-primary-foreground/20" : locked ? "bg-muted" : "bg-primary/10"
                      }`}>
                        {locked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Icon className={`h-4 w-4 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? "" : "text-muted-foreground"}`}>
                            Ch. {index + 1}
                          </span>
                          {locked && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                              Locked
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm font-medium truncate ${isSelected ? "" : "text-foreground"}`}>
                          {chapter.title}
                        </p>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected ? "text-primary-foreground" : "text-muted-foreground group-hover:translate-x-1"
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Content Panel - Right */}
      <Card className="flex-1 overflow-hidden">
        {selectedChapterData ? (
          <>
            {/* Chapter Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <ChapterIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Chapter {selectedChapterIndex + 1}
                    </Badge>
                    {chapterIsLocked && (
                      <Badge className="bg-coral/20 text-coral border-coral/30 text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mt-1 truncate">{selectedChapterData.title}</h3>
                  {selectedChapterData.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{selectedChapterData.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            {chapterIsLocked ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Lock className="h-10 w-10 text-muted-foreground" />
                </div>
                <h4 className="font-bold text-lg mb-2">Content Locked</h4>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  Subscribe to unlock all chapters and get full access to videos, quizzes, and e-books.
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Upgrade Now
                </Button>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 m-4 mb-0 max-w-md">
                  <TabsTrigger value="videos" className="gap-1.5">
                    <Video className="h-4 w-4" />
                    Videos
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                      {videos.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="quizzes" className="gap-1.5">
                    <HelpCircle className="h-4 w-4" />
                    Quizzes
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                      {quizzes.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="books" className="gap-1.5">
                    <FileText className="h-4 w-4" />
                    E-Books
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                      {ebooks.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <CardContent className="flex-1 overflow-auto p-4">
                  <TabsContent value="videos" className="mt-0 space-y-3">
                    {videos.length === 0 ? (
                      <div className="text-center py-12">
                        <Video className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No videos in this chapter yet</p>
                      </div>
                    ) : (
                      videos.map((video: any, idx: number) => (
                        <button
                          key={video.id}
                          onClick={() => onVideoClick?.(video, selectedChapter!)}
                          className="w-full p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <Play className="h-5 w-5 text-coral" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium group-hover:text-primary transition-colors">
                                {video.title}
                              </p>
                              {video.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">{video.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-1.5">
                                {video.duration_minutes && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {video.duration_minutes} min
                                  </span>
                                )}
                                {isVideoCompleted(video.id) && (
                                  <Badge className="bg-primary/20 text-primary text-[10px]">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </button>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="quizzes" className="mt-0 space-y-3">
                    {quizzes.length === 0 ? (
                      <div className="text-center py-12">
                        <HelpCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No quizzes in this chapter yet</p>
                      </div>
                    ) : (
                      quizzes.map((quiz: any) => (
                        <button
                          key={quiz.id}
                          onClick={() => onQuizClick?.(quiz, selectedChapter!)}
                          className="w-full p-4 rounded-xl border border-border hover:border-purple/50 hover:bg-purple/5 transition-all group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <HelpCircle className="h-5 w-5 text-purple" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium group-hover:text-purple transition-colors">
                                {quiz.title}
                              </p>
                              {quiz.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">{quiz.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs text-muted-foreground">
                                  Pass: {quiz.passing_score}%
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-purple group-hover:translate-x-1 transition-all" />
                          </div>
                        </button>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="books" className="mt-0 space-y-3">
                    {ebooks.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No e-books in this chapter yet</p>
                      </div>
                    ) : (
                      ebooks.map((ebook: any) => (
                        <button
                          key={ebook.id}
                          onClick={() => onEbookClick?.(ebook, selectedChapter!)}
                          className="w-full p-4 rounded-xl border border-border hover:border-turquoise/50 hover:bg-turquoise/5 transition-all group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-turquoise/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <BookOpen className="h-5 w-5 text-turquoise" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium group-hover:text-turquoise transition-colors">
                                {ebook.title}
                              </p>
                              {ebook.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">{ebook.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant="outline" className="text-[10px]">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Preview
                                </Badge>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-turquoise group-hover:translate-x-1 transition-all" />
                          </div>
                        </button>
                      ))
                    )}
                    
                    {ebooks.length > 0 && (
                      <div className="p-3 rounded-xl bg-sunny/10 border border-sunny/20 text-center">
                        <p className="text-xs text-muted-foreground">
                          📚 E-books are sample previews. Complete books available as physical copies.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Select a chapter to view content</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
