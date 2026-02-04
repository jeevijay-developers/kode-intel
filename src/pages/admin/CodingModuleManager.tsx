import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Code, 
  ArrowLeft,
  Star,
  Lightbulb,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CodingModuleEditor from "@/components/admin/CodingModuleEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodingModule {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string;
  objective_text: string | null;
  initial_blocks_xml: string | null;
  validation_rules: { hints?: string[] } | null;
  xp_reward: number;
  order_index: number;
  is_published: boolean;
  chapter_id: string | null;
  class_level: number;
}

interface Chapter {
  id: string;
  title: string;
  course_id: string;
  courses: {
    title: string;
  } | null;
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function CodingModuleManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CodingModule | null>(null);
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);

  // Fetch chapters with course info
  const { data: chapters = [] } = useQuery({
    queryKey: ["admin-chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("id, title, course_id, courses(title)")
        .order("order_index");
      
      if (error) throw error;
      return data as Chapter[];
    },
  });

  // Fetch coding modules
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["admin-coding-modules", selectedChapter],
    queryFn: async () => {
      let query = supabase
        .from("coding_modules")
        .select("*")
        .order("order_index");
      
      if (selectedChapter !== "all") {
        query = query.eq("chapter_id", selectedChapter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CodingModule[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const { error } = await supabase
        .from("coding_modules")
        .delete()
        .eq("id", moduleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coding-modules"] });
      toast.success("Coding module deleted successfully");
      setDeleteModuleId(null);
    },
    onError: (error) => {
      toast.error("Failed to delete module: " + error.message);
    },
  });

  const handleCreateNew = () => {
    setEditingModule(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (module: CodingModule) => {
    setEditingModule(module);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingModule(null);
    queryClient.invalidateQueries({ queryKey: ["admin-coding-modules"] });
  };

  const getChapterName = (chapterId: string | null) => {
    if (!chapterId) return "Unassigned";
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter ? chapter.title : "Unknown";
  };

  const getCourseName = (chapterId: string | null) => {
    if (!chapterId) return "";
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter?.courses?.title || "";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Code className="h-6 w-6 text-primary" />
                Coding Modules
              </h1>
              <p className="text-muted-foreground">
                Create and manage block-based coding lessons
              </p>
            </div>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            New Module
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by Chapter:</span>
              </div>
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="All Chapters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chapters</SelectItem>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.courses?.title} - {chapter.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="ml-auto">
                {modules.length} module{modules.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-muted/50" />
                <CardContent className="h-32 bg-muted/30" />
              </Card>
            ))}
          </div>
        ) : modules.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Code className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No coding modules yet
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first block-based coding lesson to get started.
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Module
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <Card 
                key={module.id} 
                className="group hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {module.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {getCourseName(module.chapter_id)}
                      </p>
                      <p className="text-xs text-primary">
                        {getChapterName(module.chapter_id)}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(module)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleteModuleId(module.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {module.description || "No description"}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className={difficultyColors[module.difficulty_level] || ""}
                    >
                      {module.difficulty_level}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3" />
                      {module.xp_reward} XP
                    </Badge>
                    {!module.is_published && (
                      <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                        Draft
                      </Badge>
                    )}
                  </div>

                  {module.objective_text && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground flex items-start gap-1">
                        <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{module.objective_text}</span>
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Class Level: {module.class_level} | Order: {module.order_index}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Editor Dialog */}
      {isEditorOpen && (
        <CodingModuleEditor
          module={editingModule}
          chapters={chapters}
          onClose={handleEditorClose}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteModuleId} onOpenChange={() => setDeleteModuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coding Module?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              coding module and any associated student progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteModuleId && deleteMutation.mutate(deleteModuleId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
