import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, HelpCircle, Edit, Trash2, BookOpen } from "lucide-react";
import { useAllQuizzes, useCourses } from "@/hooks/useCourses";
import { QuizBuilder } from "@/components/courses/QuizBuilder";

export default function QuizManagement() {
  const { courses } = useCourses();
  const { quizzes, isLoading, createQuiz, updateQuiz, deleteQuiz } = useAllQuizzes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{
    id: string;
    title: string;
    description: string;
    passing_score: number;
    course_id: string | null;
  } | null>(null);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    passing_score: 60,
    course_id: "",
  });

  const handleCreate = async () => {
    if (!newQuiz.title.trim()) return;
    await createQuiz.mutateAsync({
      title: newQuiz.title,
      description: newQuiz.description,
      passing_score: newQuiz.passing_score,
      course_id: newQuiz.course_id || null,
    });
    setNewQuiz({ title: "", description: "", passing_score: 60, course_id: "" });
    setIsDialogOpen(false);
  };

  const handleUpdate = async () => {
    if (!editingQuiz) return;
    await updateQuiz.mutateAsync({
      id: editingQuiz.id,
      title: editingQuiz.title,
      description: editingQuiz.description,
      passing_score: editingQuiz.passing_score,
      course_id: editingQuiz.course_id,
    });
    setEditingQuiz(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteQuiz.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const getCourseTitle = (courseId: string | null) => {
    if (!courseId) return "Unassigned";
    const course = courses.find((c) => c.id === courseId);
    return course?.title || "Unknown Course";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quiz Management</h1>
            <p className="text-muted-foreground">Create and manage quizzes, then assign them to chapters</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="Enter quiz title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                    placeholder="Enter quiz description"
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
                <div>
                  <Label htmlFor="course">Associated Course (Optional)</Label>
                  <Select
                    value={newQuiz.course_id || "none"}
                    onValueChange={(value) => setNewQuiz({ ...newQuiz, course_id: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Course</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreate} className="w-full" disabled={createQuiz.isPending}>
                  Create Quiz
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-20 bg-muted rounded-t-lg" />
                <CardContent className="space-y-2 p-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No quizzes yet</h3>
              <p className="text-muted-foreground mb-4">Create your first quiz to get started</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {quizzes.map((quiz) => (
              <AccordionItem key={quiz.id} value={quiz.id} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <div className="text-left flex-1">
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Passing score: {quiz.passing_score}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mr-4">
                      {quiz.course_id ? (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {getCourseTitle(quiz.course_id)}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Unassigned</Badge>
                      )}
                      {quiz.chapter_id && (
                        <Badge variant="default">Assigned to Chapter</Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {quiz.description && (
                      <p className="text-sm text-muted-foreground">{quiz.description}</p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingQuiz({
                            id: quiz.id,
                            title: quiz.title,
                            description: quiz.description || "",
                            passing_score: quiz.passing_score,
                            course_id: quiz.course_id,
                          })
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(quiz.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Quiz
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Questions</h4>
                      <QuizBuilder quizId={quiz.id} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Edit Quiz Dialog */}
      <Dialog open={!!editingQuiz} onOpenChange={() => setEditingQuiz(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Quiz</DialogTitle>
          </DialogHeader>
          {editingQuiz && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTitle">Quiz Title</Label>
                <Input
                  id="editTitle"
                  value={editingQuiz.title}
                  onChange={(e) =>
                    setEditingQuiz({ ...editingQuiz, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editingQuiz.description}
                  onChange={(e) =>
                    setEditingQuiz({ ...editingQuiz, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editPassingScore">Passing Score (%)</Label>
                <Input
                  id="editPassingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={editingQuiz.passing_score}
                  onChange={(e) =>
                    setEditingQuiz({
                      ...editingQuiz,
                      passing_score: parseInt(e.target.value) || 60,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editCourse">Associated Course</Label>
                <Select
                  value={editingQuiz.course_id || "none"}
                  onValueChange={(value) =>
                    setEditingQuiz({ ...editingQuiz, course_id: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Course</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdate} className="w-full" disabled={updateQuiz.isPending}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quiz? This will also delete all questions and
              options associated with it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
