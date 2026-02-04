import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Code, Lightbulb, Save, X, Plus, Trash2 } from "lucide-react";

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

interface CodingModuleEditorProps {
  module: CodingModule | null;
  chapters: Chapter[];
  onClose: () => void;
}

export default function CodingModuleEditor({
  module,
  chapters,
  onClose,
}: CodingModuleEditorProps) {
  const isEditing = !!module;
  
  const [formData, setFormData] = useState({
    title: module?.title || "",
    description: module?.description || "",
    difficulty_level: module?.difficulty_level || "beginner",
    objective_text: module?.objective_text || "",
    initial_blocks_xml: module?.initial_blocks_xml || '<xml><block type="when_start" x="50" y="50"></block></xml>',
    xp_reward: module?.xp_reward || 10,
    order_index: module?.order_index || 1,
    is_published: module?.is_published ?? true,
    chapter_id: module?.chapter_id || "",
    class_level: module?.class_level || 3,
  });

  const [hints, setHints] = useState<string[]>(
    (module?.validation_rules as { hints?: string[] })?.hints || [""]
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      const validationRules = {
        hints: hints.filter(h => h.trim() !== ""),
      };

      const moduleData = {
        title: formData.title,
        description: formData.description || null,
        difficulty_level: formData.difficulty_level,
        objective_text: formData.objective_text || null,
        initial_blocks_xml: formData.initial_blocks_xml || null,
        validation_rules: validationRules,
        xp_reward: formData.xp_reward,
        order_index: formData.order_index,
        is_published: formData.is_published,
        chapter_id: formData.chapter_id || null,
        class_level: formData.class_level,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("coding_modules")
          .update(moduleData)
          .eq("id", module.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("coding_modules")
          .insert(moduleData);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? "Module updated successfully" : "Module created successfully");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to save module: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    saveMutation.mutate();
  };

  const addHint = () => {
    setHints([...hints, ""]);
  };

  const removeHint = (index: number) => {
    setHints(hints.filter((_, i) => i !== index));
  };

  const updateHint = (index: number, value: string) => {
    const newHints = [...hints];
    newHints[index] = value;
    setHints(newHints);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            {isEditing ? "Edit Coding Module" : "Create Coding Module"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="hints">Hints & XP</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Say Hello!"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What will students learn in this module?"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="chapter">Chapter</Label>
                  <Select
                    value={formData.chapter_id}
                    onValueChange={(value) => setFormData({ ...formData, chapter_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.courses?.title} - {chapter.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class_level">Class Level</Label>
                  <Select
                    value={formData.class_level.toString()}
                    onValueChange={(value) => setFormData({ ...formData, class_level: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Class {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="order">Order Index</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="objective">
                  <span className="flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" />
                    Mission Objective
                  </span>
                </Label>
                <Textarea
                  id="objective"
                  value={formData.objective_text}
                  onChange={(e) => setFormData({ ...formData, objective_text: e.target.value })}
                  placeholder="e.g., Make the star say 'Hello, World!' when the program starts."
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This is shown to students as their mission goal.
                </p>
              </div>

              <div>
                <Label htmlFor="blocks">Initial Blocks (XML)</Label>
                <Textarea
                  id="blocks"
                  value={formData.initial_blocks_xml}
                  onChange={(e) => setFormData({ ...formData, initial_blocks_xml: e.target.value })}
                  placeholder="<xml>...</xml>"
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Blockly XML for starter blocks. Students will see these when they start the lesson.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="hints" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="xp">XP Reward</Label>
                <Input
                  id="xp"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.xp_reward}
                  onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Points earned when completing this module (typically 10-30).
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Progressive Hints</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHint}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Hint
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Hints are revealed one at a time when students click the hint button.
                </p>

                <div className="space-y-2">
                  {hints.map((hint, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex items-center justify-center w-6 h-10 text-xs text-muted-foreground">
                        {index + 1}.
                      </div>
                      <Input
                        value={hint}
                        onChange={(e) => updateHint(index, e.target.value)}
                        placeholder={`Hint ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHint(index)}
                        disabled={hints.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              <Save className="h-4 w-4 mr-1" />
              {saveMutation.isPending ? "Saving..." : isEditing ? "Update Module" : "Create Module"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
