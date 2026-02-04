import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FillBlankQuestion } from "./QuestionTypes/FillBlankQuestion";
import { TrueFalseQuestion } from "./QuestionTypes/TrueFalseQuestion";
import { MatchColumnQuestion } from "./QuestionTypes/MatchColumnQuestion";
import { ShortAnswerQuestion } from "./QuestionTypes/ShortAnswerQuestion";

interface WorksheetPlayerProps {
  chapterId?: string;
}

export function WorksheetPlayer({ chapterId: propChapterId }: WorksheetPlayerProps) {
  const { chapterId: paramChapterId } = useParams();
  const chapterId = propChapterId || paramChapterId;
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});

  // Fetch worksheet questions
  const { data: questions, isLoading } = useQuery({
    queryKey: ["worksheet-questions", chapterId],
    queryFn: async () => {
      if (!chapterId) return [];

      const { data, error } = await supabase
        .from("worksheet_questions")
        .select("*")
        .eq("chapter_id", chapterId)
        .eq("is_published", true)
        .order("order_index");

      if (error) throw error;
      return data || [];
    },
    enabled: !!chapterId,
  });

  // Fetch chapter info
  const { data: chapter } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: async () => {
      if (!chapterId) return null;

      const { data, error } = await supabase
        .from("chapters")
        .select("*, courses(id, title)")
        .eq("id", chapterId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!chapterId,
  });

  // Fetch existing progress
  const { data: existingProgress } = useQuery({
    queryKey: ["worksheet-progress", chapterId, student?.id],
    queryFn: async () => {
      if (!chapterId || !student?.id) return [];

      const { data, error } = await supabase
        .from("worksheet_progress")
        .select("*")
        .eq("chapter_id", chapterId)
        .eq("student_id", student.id);

      if (error && error.code !== "PGRST116") throw error;
      return data || [];
    },
    enabled: !!chapterId && !!student?.id,
  });

  // Populate answered questions from existing progress
  useEffect(() => {
    if (existingProgress && existingProgress.length > 0) {
      const answered: Record<string, boolean> = {};
      existingProgress.forEach((p) => {
        answered[p.question_id] = p.is_correct;
      });
      setAnsweredQuestions(answered);
    }
  }, [existingProgress]);

  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async ({
      questionId,
      answerData,
      isCorrect,
    }: {
      questionId: string;
      answerData: unknown;
      isCorrect: boolean;
    }) => {
      if (!chapterId || !student?.id) return;

      // Check if progress exists
      const { data: existing } = await supabase
        .from("worksheet_progress")
        .select("id")
        .eq("student_id", student.id)
        .eq("question_id", questionId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("worksheet_progress")
          .update({
            answer_data: answerData as any,
            is_correct: isCorrect,
            attempted_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("worksheet_progress").insert({
          student_id: student.id,
          chapter_id: chapterId,
          question_id: questionId,
          answer_data: answerData,
          is_correct: isCorrect,
        } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worksheet-progress", chapterId] });
    },
  });

  const handleAnswer = (questionId: string, answerData: unknown, isCorrect: boolean) => {
    setAnsweredQuestions((prev) => ({ ...prev, [questionId]: isCorrect }));

    if (student?.id) {
      saveProgressMutation.mutate({ questionId, answerData, isCorrect });
    }
  };

  const currentQuestion = questions?.[currentIndex];
  const totalQuestions = questions?.length || 0;
  const correctCount = Object.values(answeredQuestions).filter(Boolean).length;
  const progressPercent = totalQuestions > 0 ? (Object.keys(answeredQuestions).length / totalQuestions) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
          <p className="text-muted-foreground">Loading worksheet...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No questions yet</h2>
        <p className="text-muted-foreground mb-4 text-center">
          This worksheet is being prepared. Check back soon!
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  // All questions answered
  if (Object.keys(answeredQuestions).length === totalQuestions) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 h-14 flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="ml-3 font-semibold">Worksheet Complete!</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Great Job! 🎉</h1>
            <p className="text-muted-foreground mb-6">
              You completed the worksheet with {correctCount} out of {totalQuestions} correct answers.
            </p>

            <div className="bg-muted rounded-2xl p-6 mb-6">
              <div className="text-4xl font-bold text-primary mb-1">
                {Math.round((correctCount / totalQuestions) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setAnsweredQuestions({});
                  setCurrentIndex(0);
                }}
              >
                Try Again
              </Button>
              <Button onClick={() => navigate(`/student/chapter/${chapterId}`)}>
                Back to Chapter
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <p className="font-semibold text-foreground text-sm">Worksheet</p>
              <p className="text-xs text-muted-foreground">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">
              {correctCount}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <Progress value={progressPercent} className="h-2" />
        </div>
      </header>

      {/* Question Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Question Number Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Q{currentIndex + 1}
            </span>
            <span className="text-sm text-muted-foreground capitalize">
              {currentQuestion?.question_type.replace("_", " ")}
            </span>
            {answeredQuestions[currentQuestion?.id || ""] !== undefined && (
              <CheckCircle2
                className={cn(
                  "w-4 h-4 ml-auto",
                  answeredQuestions[currentQuestion?.id || ""]
                    ? "text-green-500"
                    : "text-red-500"
                )}
              />
            )}
          </div>

          {/* Render Question Type */}
          {currentQuestion && (
            <div className="bg-card rounded-xl border border-border p-6">
              {currentQuestion.question_type === "fill_blank" && (
                <FillBlankQuestion
                  questionData={currentQuestion.question_data as any}
                  onAnswer={(answer, correct) =>
                    handleAnswer(currentQuestion.id, answer, correct)
                  }
                  disabled={answeredQuestions[currentQuestion.id] !== undefined}
                />
              )}
              {currentQuestion.question_type === "true_false" && (
                <TrueFalseQuestion
                  questionData={currentQuestion.question_data as any}
                  onAnswer={(answer, correct) =>
                    handleAnswer(currentQuestion.id, answer, correct)
                  }
                  disabled={answeredQuestions[currentQuestion.id] !== undefined}
                />
              )}
              {currentQuestion.question_type === "match_column" && (
                <MatchColumnQuestion
                  questionData={currentQuestion.question_data as any}
                  onAnswer={(matches, correct) =>
                    handleAnswer(currentQuestion.id, matches, correct)
                  }
                  disabled={answeredQuestions[currentQuestion.id] !== undefined}
                />
              )}
              {currentQuestion.question_type === "short_answer" && (
                <ShortAnswerQuestion
                  questionData={currentQuestion.question_data as any}
                  onAnswer={(answer, hasKeywords) =>
                    handleAnswer(currentQuestion.id, answer, hasKeywords)
                  }
                  disabled={answeredQuestions[currentQuestion.id] !== undefined}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {/* Question Dots */}
          <div className="flex gap-1.5 overflow-x-auto max-w-[200px]">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all flex-shrink-0",
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : answeredQuestions[q.id] !== undefined
                    ? answeredQuestions[q.id]
                      ? "bg-green-500"
                      : "bg-red-400"
                    : "bg-muted"
                )}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={() => setCurrentIndex(Math.min(totalQuestions - 1, currentIndex + 1))}
            disabled={currentIndex === totalQuestions - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
