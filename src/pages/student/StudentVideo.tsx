import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, User, CheckCircle } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import KodeIntelPlayer from "@/components/student/KodeIntelPlayer";

export default function StudentVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { student, loading } = useStudentAuth();

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  // Fetch video details
  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      if (!videoId) return null;
      const { data, error } = await supabase
        .from("chapter_videos")
        .select("*, chapters(title, course_id, courses(title))")
        .eq("id", videoId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!videoId,
  });

  // Fetch video progress
  const { data: progress } = useQuery({
    queryKey: ["video-progress-single", student?.id, videoId],
    queryFn: async () => {
      if (!student || !videoId) return null;
      const { data, error } = await supabase
        .from("student_video_progress")
        .select("*")
        .eq("student_id", student.id)
        .eq("video_id", videoId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!student && !!videoId,
  });

  const markComplete = useMutation({
    mutationFn: async () => {
      if (!student || !videoId) return;
      if (progress) {
        await supabase
          .from("student_video_progress")
          .update({ is_completed: true })
          .eq("id", progress.id);
      } else {
        await supabase.from("student_video_progress").insert({
          student_id: student.id,
          video_id: videoId,
          is_completed: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-progress"] });
      queryClient.invalidateQueries({ queryKey: ["video-progress-single"] });
      toast({ title: "Great job! Video completed! 🎉" });
    },
  });

  const extractYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match?.[1] || null;
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading... 🚀</div>
      </div>
    );
  }

  if (videoLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="aspect-video bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-foreground">Video not found</h2>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const youtubeId = extractYouTubeId(video.youtube_url);
  const isCompleted = progress?.is_completed;
  const courseId = video.chapters?.course_id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => courseId ? navigate(`/student/courses/${courseId}`) : navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground hidden sm:block">
                Video Lesson
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/student/profile")}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Video Player */}
        <div className="mb-6">
          {youtubeId ? (
            <KodeIntelPlayer
              videoId={youtubeId}
              title={video.title}
              onComplete={() => {
                if (!isCompleted) {
                  markComplete.mutate();
                }
              }}
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center text-white">
                <p>Video unavailable</p>
              </div>
            </Card>
          )}
        </div>

        {/* Video Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">{video.title}</CardTitle>
                <p className="text-muted-foreground">
                  {video.chapters?.courses?.title} → {video.chapters?.title}
                </p>
              </div>
              {isCompleted ? (
                <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Completed!</span>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => markComplete.mutate()}
                  disabled={markComplete.isPending}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Mark as Complete
                </Button>
              )}
            </div>
          </CardHeader>
          {video.description && (
            <CardContent>
              <p className="text-muted-foreground">{video.description}</p>
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
}
