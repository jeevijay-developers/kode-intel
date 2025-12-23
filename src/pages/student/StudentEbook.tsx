import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, User, ExternalLink, Download } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function StudentEbook() {
  const { ebookId } = useParams();
  const navigate = useNavigate();
  const { student, loading } = useStudentAuth();

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  // Fetch ebook details
  const { data: ebook, isLoading: ebookLoading } = useQuery({
    queryKey: ["ebook", ebookId],
    queryFn: async () => {
      if (!ebookId) return null;
      const { data, error } = await supabase
        .from("chapter_ebooks")
        .select("*, chapters(title, course_id, courses(title))")
        .eq("id", ebookId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!ebookId,
  });

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading... 🚀</div>
      </div>
    );
  }

  if (ebookLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-[80vh] bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-foreground">Ebook not found</h2>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const courseId = ebook.chapters?.course_id;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => courseId ? navigate(`/student/courses/${courseId}`) : navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Brain className="h-6 w-6 text-primary shrink-0" />
              <div className="hidden sm:block truncate">
                <span className="font-semibold text-foreground">{ebook.title}</span>
                <span className="text-muted-foreground mx-2">•</span>
                <span className="text-muted-foreground text-sm">{ebook.chapters?.title}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(ebook.file_url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/student/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 bg-muted">
        <iframe
          src={`${ebook.file_url}#toolbar=1&navpanes=0&scrollbar=1`}
          title={ebook.title}
          className="w-full h-[calc(100vh-4rem)]"
          style={{ border: "none" }}
        />
      </main>
    </div>
  );
}
