/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Play,
  FileText,
  HelpCircle,
  CheckCircle,
  Brain,
  User,
  Video,
  Rocket,
  Search,
  Inbox,
  Star,
  Zap,
  Lightbulb,
  Target,
  Flame,
  Palette,
  Gamepad2,
  Trophy,
  Rainbow,
  Lock,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useCourse, useChapters } from "@/hooks/useCourses";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function StudentCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { student, loading, isTrialExpired } = useStudentAuth();
  const { data: course, isLoading: courseLoading } = useCourse(id);
  const { chapters } = useChapters(id);

  const isTrial = student?.subscription_status === "trial" && !isTrialExpired();
  const isActive = student?.subscription_status === "active" || student?.is_active;
  const hasFullAccess = isActive && !isTrial;

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  // Start course progress if not started
  const { data: courseProgress } = useQuery({
    queryKey: ["course-progress", student?.id, id],
    queryFn: async () => {
      if (!student || !id) return null;
      const { data, error } = await supabase
        .from("student_course_progress")
        .select("*")
        .eq("student_id", student.id)
        .eq("course_id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!student && !!id,
  });

  const startCourse = useMutation({
    mutationFn: async () => {
      if (!student || !id) return;
      const { error } = await supabase.from("student_course_progress").insert({
        student_id: student.id,
        course_id: id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-progress"] });
      toast({ title: "Course started! 🎉" });
    },
  });

  // Auto-start course on first view
  useEffect(() => {
    if (student && id && courseProgress === null && !courseLoading) {
      startCourse.mutate();
    }
  }, [student, id, courseProgress, courseLoading]);

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl flex items-center gap-2">
          Loading... <Rocket className="h-5 w-5" />
        </div>
      </div>
    );
  }

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            Course not found
          </h2>
          <Button onClick={() => navigate("/student")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const publishedChapters = chapters.filter((c) => c.is_published);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/student")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground hidden sm:block">
                My Course
              </span>
            </div>
          </div>
          {isTrial && (
            <Badge className="bg-sunny text-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              Free Trial
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/student/profile")}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Course Header */}
        <Card className="mb-6 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-48 h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="h-16 w-16 text-primary/50" />
              )}
            </div>
            <div className="p-6 flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {course.title}
              </h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-base py-1 px-3 flex items-center gap-1.5"
                >
                  <BookOpen className="h-4 w-4" /> {publishedChapters.length} Chapters
                </Badge>
                {isTrial && (
                  <Badge className="bg-sunny/20 text-sunny border-sunny/30 text-base py-1 px-3">
                    <Lock className="h-4 w-4 mr-1" /> Chapter 1 Free
                  </Badge>
                )}
                {courseProgress?.completed_at && (
                  <Badge className="bg-primary/20 text-primary text-base py-1 px-3 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" /> Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Trial Banner */}
        {isTrial && (
          <Card className="mb-6 bg-gradient-to-r from-sunny/10 to-coral/10 border-sunny/30">
            <CardContent className="py-4 px-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-sunny" />
                  <div>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Trial Mode: Chapter 1 Unlocked
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Subscribe to unlock all chapters, quizzes, and ebooks
                    </p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-sunny to-coral text-foreground">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chapters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5" /> Course Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {publishedChapters.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">
                  No content available yet. Check back soon!
                </p>
              </div>
            ) : (
              <Accordion type="multiple" className="space-y-3">
                {publishedChapters.map((chapter, index) => (
                  <ChapterAccordion
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    studentId={student.id}
                    isLocked={isTrial && index > 0}
                    hasFullAccess={hasFullAccess}
                  />
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

interface ChapterAccordionProps {
  chapter: any;
  index: number;
  studentId: string;
  isLocked: boolean;
  hasFullAccess: boolean;
}

function ChapterAccordion({
  chapter,
  index,
  studentId,
  isLocked,
  hasFullAccess,
}: ChapterAccordionProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chapter content
  const { data: videos = [] } = useQuery({
    queryKey: ["chapter-videos", chapter.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapter_videos")
        .select("*")
        .eq("chapter_id", chapter.id)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: ebooks = [] } = useQuery({
    queryKey: ["chapter-ebooks", chapter.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapter_ebooks")
        .select("*")
        .eq("chapter_id", chapter.id)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: quizzes = [] } = useQuery({
    queryKey: ["chapter-quizzes", chapter.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .select("*")
        .eq("chapter_id", chapter.id)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  // Fetch video progress
  const { data: videoProgress = [] } = useQuery({
    queryKey: ["video-progress", studentId, chapter.id],
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
    enabled: videos.length > 0,
  });

  const markVideoComplete = useMutation({
    mutationFn: async (videoId: string) => {
      const existing = videoProgress.find((p: any) => p.video_id === videoId);
      if (existing) {
        await supabase
          .from("student_video_progress")
          .update({ is_completed: true })
          .eq("id", existing.id);
      } else {
        await supabase.from("student_video_progress").insert({
          student_id: studentId,
          video_id: videoId,
          is_completed: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-progress"] });
      toast({ title: "Great job! Video completed!" });
    },
  });

  const extractYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match?.[1] || null;
  };

  const totalContent = videos.length + ebooks.length + quizzes.length;
  const completedVideos = videoProgress.filter((p: any) => p.is_completed).length;
  const allVideosCompleted = videos.length > 0 && completedVideos === videos.length;

  // Chapter icon based on index
  const chapterIcons = [
    Star, Rocket, Lightbulb, Target, Flame, Zap, Palette, Gamepad2, Trophy, Rainbow,
  ];
  const ChapterIcon = chapterIcons[index % chapterIcons.length];

  const handleLockedAction = () => {
    toast({
      title: "Content Locked",
      description: "Subscribe to unlock this chapter!",
      variant: "destructive",
    });
  };

  return (
    <AccordionItem
      value={chapter.id}
      className={`border-2 rounded-xl px-4 overflow-hidden ${
        isLocked ? "opacity-75 bg-muted/20" : ""
      }`}
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3 text-left">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              isLocked
                ? "bg-muted"
                : allVideosCompleted
                ? "bg-primary/20"
                : "bg-primary/10"
            }`}
          >
            {isLocked ? (
              <Lock className="h-6 w-6 text-muted-foreground" />
            ) : allVideosCompleted ? (
              <CheckCircle className="h-6 w-6 text-primary" />
            ) : (
              <ChapterIcon className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">Chapter {index + 1}</span>
              {isLocked && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" /> Locked
                </Badge>
              )}
              {!isLocked && totalContent > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {totalContent} items
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground">{chapter.title}</span>
            {chapter.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {chapter.description}
              </p>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        {isLocked ? (
          <div className="text-center py-8 bg-muted/30 rounded-xl">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium mb-2">
              This chapter is locked
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to unlock all content
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              Upgrade Now
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Videos ({videos.length})
              </TabsTrigger>
              <TabsTrigger value="ebooks" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Ebooks ({ebooks.length})
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Quizzes ({quizzes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-3 mt-0">
              {videos.length === 0 ? (
                <div className="text-center py-8 rounded-xl">
                  <Video className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No videos in this chapter</p>
                </div>
              ) : (
                videos.map((video: any) => {
                  const isCompleted = videoProgress.some(
                    (p: any) => p.video_id === video.id && p.is_completed
                  );
                  const youtubeId = extractYouTubeId(video.youtube_url);

                  return (
                    <div
                      key={video.id}
                      className="flex items-center gap-4 border border-border p-4 rounded-xl hover:border-primary/30 transition-colors"
                    >
                      <div className="w-24 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0 relative">
                        {youtubeId && (
                          <img
                            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{video.title}</p>
                          {isCompleted && (
                            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {video.duration_minutes
                            ? `${video.duration_minutes} min`
                            : "Video"}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="lg"
                          onClick={() => navigate(`/student/video/${video.id}`)}
                          className="h-12 px-6"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Watch
                        </Button>
                        {!isCompleted && (
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => markVideoComplete.mutate(video.id)}
                            className="h-12"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="ebooks" className="space-y-3 mt-0">
              {ebooks.length === 0 ? (
                <div className="text-center py-8 border border-border rounded-xl">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No ebooks in this chapter</p>
                </div>
              ) : (
                ebooks.map((ebook: any) => (
                  <div
                    key={ebook.id}
                    className="flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{ebook.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {ebook.description || "PDF Ebook"}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate(`/student/ebook/${ebook.id}`)}
                      className="h-12 px-6"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Read
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-3 mt-0">
              {quizzes.length === 0 ? (
                <div className="text-center py-8 border border-border rounded-xl">
                  <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No quizzes in this chapter</p>
                </div>
              ) : (
                quizzes.map((quiz: any) => (
                  <div
                    key={quiz.id}
                    className="flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-sunny/20 flex items-center justify-center shrink-0">
                      <HelpCircle className="h-7 w-7 text-sunny" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{quiz.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {quiz.passing_score}% to pass
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="h-12 px-6 bg-gradient-to-r from-sunny to-coral text-foreground"
                      onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Take Quiz
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
