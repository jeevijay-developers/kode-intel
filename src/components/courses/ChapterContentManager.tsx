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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, FileText, HelpCircle, Plus, Trash2, ExternalLink, Link2, Unlink } from "lucide-react";
import {
  useChapterVideos,
  useChapterEbooks,
  useChapterQuizzes,
  useAllQuizzes,
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
  const { quizzes, deleteQuiz } = useChapterQuizzes(chapterId);
  const { quizzes: allQuizzes, assignToChapter, unassignFromChapter } = useAllQuizzes();

  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [ebookDialogOpen, setEbookDialogOpen] = useState(false);
  const [assignQuizDialogOpen, setAssignQuizDialogOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedQuizToAssign, setSelectedQuizToAssign] = useState("");

  const [newVideo, setNewVideo] = useState({ title: "", youtube_url: "", description: "" });
  const [newEbook, setNewEbook] = useState({ title: "", description: "" });
  const [uploadingEbook, setUploadingEbook] = useState(false);

  // Get available quizzes (not assigned to any chapter)
  const availableQuizzes = allQuizzes.filter((q) => !q.chapter_id);

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

  const handleAssignQuiz = async () => {
    if (!selectedQuizToAssign) return;
    await assignToChapter.mutateAsync({
      quizId: selectedQuizToAssign,
      chapterId: chapterId,
    });
    setSelectedQuizToAssign("");
    setAssignQuizDialogOpen(false);
  };

  const handleUnassignQuiz = async (quizId: string) => {
    await unassignFromChapter.mutateAsync(quizId);
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
          <Dialog open={assignQuizDialogOpen} onOpenChange={setAssignQuizDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Link2 className="mr-2 h-4 w-4" />
                Assign Quiz from Bank
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Quiz to Chapter</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quizSelect">Select a Quiz</Label>
                  <Select
                    value={selectedQuizToAssign}
                    onValueChange={setSelectedQuizToAssign}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a quiz from the bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableQuizzes.length === 0 ? (
                        <p className="py-2 px-3 text-sm text-muted-foreground">
                          No available quizzes
                        </p>
                      ) : (
                        availableQuizzes.map((quiz) => (
                          <SelectItem key={quiz.id} value={quiz.id}>
                            {quiz.title} ({quiz.passing_score}%)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create quizzes in the Quiz Bank first, then assign them here.
                  </p>
                </div>
                <Button 
                  onClick={handleAssignQuiz} 
                  className="w-full" 
                  disabled={!selectedQuizToAssign || assignToChapter.isPending}
                >
                  Assign Quiz
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
                  title="Unassign from chapter"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnassignQuiz(quiz.id);
                  }}
                >
                  <Unlink className="h-4 w-4 text-muted-foreground" />
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
            <p className="text-sm text-muted-foreground text-center py-4">
              No quizzes assigned. Create quizzes in the Quiz Bank and assign them here.
            </p>
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
