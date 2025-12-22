import { useEffect, useState } from "react";
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
import {
  ArrowLeft,
  BookOpen,
  Play,
  FileText,
  HelpCircle,
  CheckCircle,
  GraduationCap,
  LogOut,
  ExternalLink,
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
  const { student, loading, signOut } = useStudentAuth();
  const { data: course, isLoading: courseLoading } = useCourse(id);
  const { chapters } = useChapters(id);

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
      toast({ title: "Course started!" });
    },
  });

  // Auto-start course on first view
  useEffect(() => {
    if (student && id && courseProgress === null && !courseLoading) {
      startCourse.mutate();
    }
  }, [student, id, courseProgress, courseLoading]);

  const handleSignOut = () => {
    signOut();
    navigate("/student/login");
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading...</div>
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
          <h2 className="text-xl font-semibold text-foreground">Course not found</h2>
          <Button onClick={() => navigate("/student")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/student")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground hidden sm:block">
                Student Portal
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6 flex-col md:flex-row">
            <div className="w-full md:w-64 h-40 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BookOpen className="h-16 w-16 text-primary/50" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{chapters.length} Chapters</Badge>
                {courseProgress?.completed_at && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent>
            {chapters.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No content available yet
              </p>
            ) : (
              <Accordion type="multiple" className="space-y-2">
                {chapters
                  .filter((c) => c.is_published)
                  .map((chapter, index) => (
                    <ChapterAccordion
                      key={chapter.id}
                      chapter={chapter}
                      index={index}
                      studentId={student.id}
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
}

function ChapterAccordion({ chapter, index, studentId }: ChapterAccordionProps) {
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
      toast({ title: "Video marked as complete" });
    },
  });

  const extractYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match?.[1] || null;
  };

  const totalContent = videos.length + ebooks.length + quizzes.length;

  return (
    <AccordionItem value={chapter.id} className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Badge variant="outline">{index + 1}</Badge>
          <span className="font-medium">{chapter.title}</span>
          <span className="text-sm text-muted-foreground">({totalContent} items)</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4 space-y-3">
        {/* Videos */}
        {videos.map((video: any) => {
          const isCompleted = videoProgress.some(
            (p: any) => p.video_id === video.id && p.is_completed
          );
          return (
            <div
              key={video.id}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg"
            >
              <div className="w-20 h-12 bg-secondary rounded overflow-hidden flex-shrink-0">
                {extractYouTubeId(video.youtube_url) && (
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(video.youtube_url)}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" />
                  <p className="font-medium truncate">{video.title}</p>
                  {isCompleted && <CheckCircle className="h-4 w-4 text-primary" />}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(video.youtube_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Watch
                </Button>
                {!isCompleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markVideoComplete.mutate(video.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {/* Ebooks */}
        {ebooks.map((ebook: any) => (
          <div
            key={ebook.id}
            className="flex items-center gap-3 p-3 bg-muted rounded-lg"
          >
            <FileText className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{ebook.title}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(ebook.file_url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        ))}

        {/* Quizzes */}
        {quizzes.map((quiz: any) => (
          <div
            key={quiz.id}
            className="flex items-center gap-3 p-3 bg-muted rounded-lg"
          >
            <HelpCircle className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{quiz.title}</p>
              <p className="text-sm text-muted-foreground">
                Passing score: {quiz.passing_score}%
              </p>
            </div>
            <Button variant="default" size="sm">
              Take Quiz
            </Button>
          </div>
        ))}

        {totalContent === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No content in this chapter yet
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
