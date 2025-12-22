import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Video, FileText, HelpCircle, Plus, Trash2, ExternalLink } from "lucide-react";
import {
  useChapterVideos,
  useChapterEbooks,
  useChapterQuizzes,
} from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuizBuilder } from "./QuizBuilder";

interface ChapterContentManagerProps {
  chapterId: string;
  onDelete: () => void;
}

export function ChapterContentManager({ chapterId, onDelete }: ChapterContentManagerProps) {
  const { toast } = useToast();
  const { videos, createVideo, deleteVideo } = useChapterVideos(chapterId);
  const { ebooks, createEbook, deleteEbook } = useChapterEbooks(chapterId);
  const { quizzes, createQuiz, deleteQuiz } = useChapterQuizzes(chapterId);

  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [ebookDialogOpen, setEbookDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const [newVideo, setNewVideo] = useState({ title: "", youtube_url: "", description: "" });
  const [newEbook, setNewEbook] = useState({ title: "", description: "" });
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "", passing_score: 60 });
  const [uploadingEbook, setUploadingEbook] = useState(false);

  const handleAddVideo = async () => {
    if (!newVideo.title.trim() || !newVideo.youtube_url.trim()) return;
    await createVideo.mutateAsync({
      chapter_id: chapterId,
      title: newVideo.title,
      youtube_url: newVideo.youtube_url,
      description: newVideo.description,
      order_index: videos.length,
    });
    setNewVideo({ title: "", youtube_url: "", description: "" });
    setVideoDialogOpen(false);
  };

  const handleEbookUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newEbook.title.trim()) return;

    setUploadingEbook(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${chapterId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("course-ebooks")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("course-ebooks")
        .getPublicUrl(filePath);

      await createEbook.mutateAsync({
        chapter_id: chapterId,
        title: newEbook.title,
        description: newEbook.description,
        file_url: urlData.publicUrl,
        order_index: ebooks.length,
      });

      setNewEbook({ title: "", description: "" });
      setEbookDialogOpen(false);
      toast({ title: "Ebook uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Error uploading ebook", description: error.message, variant: "destructive" });
    } finally {
      setUploadingEbook(false);
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuiz.title.trim()) return;
    await createQuiz.mutateAsync({
      chapter_id: chapterId,
      title: newQuiz.title,
      description: newQuiz.description,
      passing_score: newQuiz.passing_score,
      order_index: quizzes.length,
    });
    setNewQuiz({ title: "", description: "", passing_score: 60 });
    setQuizDialogOpen(false);
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match?.[1] || null;
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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

        <TabsContent value="videos" className="space-y-3 mt-4">
          <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add YouTube Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="videoTitle">Title</Label>
                  <Input
                    id="videoTitle"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="Video title"
                  />
                </div>
                <div>
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <Input
                    id="youtubeUrl"
                    value={newVideo.youtube_url}
                    onChange={(e) => setNewVideo({ ...newVideo, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <Label htmlFor="videoDesc">Description (optional)</Label>
                  <Textarea
                    id="videoDesc"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    placeholder="Video description"
                  />
                </div>
                <Button onClick={handleAddVideo} className="w-full">
                  Add Video
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg"
            >
              <div className="w-24 h-16 bg-secondary rounded overflow-hidden flex-shrink-0">
                {extractYouTubeId(video.youtube_url) && (
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(video.youtube_url)}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{video.title}</p>
                <p className="text-sm text-muted-foreground truncate">{video.description}</p>
              </div>
              <a
                href={video.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <Button variant="ghost" size="icon" onClick={() => deleteVideo.mutate(video.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {videos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No videos added yet</p>
          )}
        </TabsContent>

        <TabsContent value="ebooks" className="space-y-3 mt-4">
          <Dialog open={ebookDialogOpen} onOpenChange={setEbookDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Ebook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Ebook (PDF)</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ebookTitle">Title</Label>
                  <Input
                    id="ebookTitle"
                    value={newEbook.title}
                    onChange={(e) => setNewEbook({ ...newEbook, title: e.target.value })}
                    placeholder="Ebook title"
                  />
                </div>
                <div>
                  <Label htmlFor="ebookDesc">Description (optional)</Label>
                  <Textarea
                    id="ebookDesc"
                    value={newEbook.description}
                    onChange={(e) => setNewEbook({ ...newEbook, description: e.target.value })}
                    placeholder="Ebook description"
                  />
                </div>
                <div>
                  <Label htmlFor="ebookFile">Upload PDF</Label>
                  <Input
                    id="ebookFile"
                    type="file"
                    accept=".pdf"
                    onChange={handleEbookUpload}
                    disabled={uploadingEbook || !newEbook.title.trim()}
                  />
                </div>
                {uploadingEbook && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>
            </DialogContent>
          </Dialog>

          {ebooks.map((ebook) => (
            <div
              key={ebook.id}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg"
            >
              <FileText className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{ebook.title}</p>
                <p className="text-sm text-muted-foreground truncate">{ebook.description}</p>
              </div>
              <a
                href={ebook.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <Button variant="ghost" size="icon" onClick={() => deleteEbook.mutate(ebook.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {ebooks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No ebooks added yet</p>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-3 mt-4">
          <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Quiz
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quizTitle">Title</Label>
                  <Input
                    id="quizTitle"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="Quiz title"
                  />
                </div>
                <div>
                  <Label htmlFor="quizDesc">Description (optional)</Label>
                  <Textarea
                    id="quizDesc"
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                    placeholder="Quiz description"
                  />
                </div>
                <div>
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={newQuiz.passing_score}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, passing_score: parseInt(e.target.value) || 60 })
                    }
                  />
                </div>
                <Button onClick={handleAddQuiz} className="w-full">
                  Create Quiz
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {quizzes.map((quiz) => (
            <div key={quiz.id}>
              <div
                className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer"
                onClick={() => setSelectedQuizId(selectedQuizId === quiz.id ? null : quiz.id)}
              >
                <HelpCircle className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{quiz.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Passing score: {quiz.passing_score}%
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuiz.mutate(quiz.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              {selectedQuizId === quiz.id && (
                <div className="mt-2 p-4 border rounded-lg">
                  <QuizBuilder quizId={quiz.id} />
                </div>
              )}
            </div>
          ))}
          {quizzes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No quizzes added yet</p>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Chapter
        </Button>
      </div>
    </div>
  );
}
