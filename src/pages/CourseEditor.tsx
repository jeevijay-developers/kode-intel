import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  ArrowLeft,
  Plus,
  Video,
  FileText,
  HelpCircle,
  Trash2,
  Save,
  Globe,
  Building2,
  X,
} from "lucide-react";
import {
  useCourse,
  useChapters,
  useChapterVideos,
  useChapterEbooks,
  useChapterQuizzes,
  useCourseSchoolAssignments,
  useCourses,
} from "@/hooks/useCourses";
import { useSchools } from "@/hooks/useSchools";
import { ChapterContentManager } from "@/components/courses/ChapterContentManager";

export default function CourseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading: courseLoading } = useCourse(id);
  const { chapters, createChapter, deleteChapter } = useChapters(id);
  const { updateCourse } = useCourses();
  const { assignments, assignSchool, removeSchool } = useCourseSchoolAssignments(id);
  const schoolsQuery = useSchools();
  const schools = schoolsQuery.data || [];

  const [editedCourse, setEditedCourse] = useState<{
    title: string;
    description: string;
    thumbnail_url: string;
    is_global: boolean;
  } | null>(null);

  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  // Initialize edited course when course loads
  if (course && !editedCourse) {
    setEditedCourse({
      title: course.title,
      description: course.description || "",
      thumbnail_url: course.thumbnail_url || "",
      is_global: course.is_global,
    });
  }

  const handleSave = async () => {
    if (!id || !editedCourse) return;
    await updateCourse.mutateAsync({ id, ...editedCourse });
  };

  const handleAddChapter = async () => {
    if (!id || !newChapterTitle.trim()) return;
    await createChapter.mutateAsync({
      course_id: id,
      title: newChapterTitle,
      order_index: chapters.length,
    });
    setNewChapterTitle("");
    setIsChapterDialogOpen(false);
  };

  const handleAssignSchool = async () => {
    if (!id || !selectedSchoolId) return;
    await assignSchool.mutateAsync({ courseId: id, schoolId: selectedSchoolId });
    setSelectedSchoolId("");
  };

  const assignedSchoolIds = assignments.map((a: any) => a.school_id);
  const availableSchools = schools.filter((s) => !assignedSchoolIds.includes(s.id));

  if (courseLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground">Course not found</h2>
          <Button onClick={() => navigate("/admin/courses")} className="mt-4">
            Back to Courses
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/courses")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
            <p className="text-muted-foreground">Edit course details and content</p>
          </div>
          <Button onClick={handleSave} disabled={updateCourse.isPending}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Course Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedCourse?.title || ""}
                  onChange={(e) =>
                    setEditedCourse((prev) => prev && { ...prev, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedCourse?.description || ""}
                  onChange={(e) =>
                    setEditedCourse((prev) => prev && { ...prev, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={editedCourse?.thumbnail_url || ""}
                  onChange={(e) =>
                    setEditedCourse((prev) => prev && { ...prev, thumbnail_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="global"
                  checked={editedCourse?.is_global || false}
                  onCheckedChange={(checked) =>
                    setEditedCourse((prev) => prev && { ...prev, is_global: checked })
                  }
                />
                <Label htmlFor="global" className="flex items-center gap-2">
                  {editedCourse?.is_global ? (
                    <>
                      <Globe className="h-4 w-4" />
                      Available to all schools
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4" />
                      Specific schools only
                    </>
                  )}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* School Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                School Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editedCourse?.is_global ? (
                <p className="text-sm text-muted-foreground">
                  This course is available to all schools.
                </p>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select school" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSchools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAssignSchool} disabled={!selectedSchoolId}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {assignments.map((assignment: any) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                      >
                        <span className="text-sm">{assignment.schools?.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSchool.mutate(assignment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {assignments.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No schools assigned yet
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chapters Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Chapters</CardTitle>
            <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Chapter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Chapter</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chapterTitle">Chapter Title</Label>
                    <Input
                      id="chapterTitle"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      placeholder="Enter chapter title"
                    />
                  </div>
                  <Button onClick={handleAddChapter} className="w-full">
                    Add Chapter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {chapters.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No chapters yet</p>
                <Button variant="outline" onClick={() => setIsChapterDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first chapter
                </Button>
              </div>
            ) : (
              <Accordion type="multiple" className="space-y-2">
                {chapters.map((chapter, index) => (
                  <AccordionItem
                    key={chapter.id}
                    value={chapter.id}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{chapter.title}</span>
                        {chapter.is_published && (
                          <Badge variant="default" className="ml-2">
                            Published
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ChapterContentManager
                        chapterId={chapter.id}
                        onDelete={() => deleteChapter.mutate(chapter.id)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
