import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, User, CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  order_index: number;
  options: QuizOption[];
}

interface QuizOption {
  id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export default function StudentQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { student, loading } = useStudentAuth();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; total: number } | null>(null);

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  // Fetch quiz details with questions and options
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz-full", quizId],
    queryFn: async () => {
      if (!quizId) return null;
      const { data: quizData, error: quizError } = await supabase
        .from("chapter_quizzes")
        .select("*, chapters(title, course_id, courses(title))")
        .eq("id", quizId)
        .single();
      if (quizError) throw quizError;

      // Fetch questions
      const { data: questions, error: questionsError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order_index");
      if (questionsError) throw questionsError;

      // Fetch options for all questions
      const questionIds = questions.map(q => q.id);
      const { data: options, error: optionsError } = await supabase
        .from("quiz_options")
        .select("*")
        .in("question_id", questionIds)
        .order("order_index");
      if (optionsError) throw optionsError;

      // Combine questions with their options
      const questionsWithOptions: QuizQuestion[] = questions.map(q => ({
        ...q,
        options: options.filter(o => o.question_id === q.id),
      }));

      return { ...quizData, questions: questionsWithOptions };
    },
    enabled: !!quizId,
  });

  // Fetch previous attempts
  const { data: previousAttempts = [] } = useQuery({
    queryKey: ["quiz-attempts", student?.id, quizId],
    queryFn: async () => {
      if (!student || !quizId) return [];
      const { data, error } = await supabase
        .from("student_quiz_attempts")
        .select("*")
        .eq("student_id", student.id)
        .eq("quiz_id", quizId)
        .order("attempted_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!student && !!quizId,
  });

  const submitQuiz = useMutation({
    mutationFn: async () => {
      if (!student || !quizId || !quiz) return null;

      // Calculate score
      let correctAnswers = 0;
      const answers: { question_id: string; selected_option_id: string; is_correct: boolean }[] = [];

      quiz.questions.forEach((question: QuizQuestion) => {
        const selectedOptionId = selectedAnswers[question.id];
        const selectedOption = question.options.find(o => o.id === selectedOptionId);
        const isCorrect = selectedOption?.is_correct || false;
        if (isCorrect) correctAnswers++;
        answers.push({
          question_id: question.id,
          selected_option_id: selectedOptionId,
          is_correct: isCorrect,
        });
      });

      const totalQuestions = quiz.questions.length;
      const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = scorePercentage >= quiz.passing_score;

      // Create attempt
      const { data: attempt, error: attemptError } = await supabase
        .from("student_quiz_attempts")
        .insert({
          student_id: student.id,
          quiz_id: quizId,
          score: scorePercentage,
          passed,
        })
        .select()
        .single();

      if (attemptError) throw attemptError;

      // Save answers
      const answersToInsert = answers.map(a => ({
        attempt_id: attempt.id,
        question_id: a.question_id,
        selected_option_id: a.selected_option_id,
        is_correct: a.is_correct,
      }));

      const { error: answersError } = await supabase
        .from("student_quiz_answers")
        .insert(answersToInsert);

      if (answersError) throw answersError;

      return { score: scorePercentage, passed, total: totalQuestions };
    },
    onSuccess: (result) => {
      if (result) {
        setQuizResult(result);
        setQuizSubmitted(true);
        queryClient.invalidateQueries({ queryKey: ["quiz-attempts"] });
        if (result.passed) {
          toast({ title: "Congratulations! You passed! 🎉" });
        } else {
          toast({ title: "Keep trying! You can do it! 💪", variant: "destructive" });
        }
      }
    },
    onError: (error: Error) => {
      toast({ title: "Error submitting quiz", description: error.message, variant: "destructive" });
    },
  });

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!quiz) return;
    const unanswered = quiz.questions.filter((q: QuizQuestion) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      toast({ 
        title: "Please answer all questions", 
        description: `You have ${unanswered.length} unanswered question(s)`,
        variant: "destructive" 
      });
      return;
    }
    submitQuiz.mutate();
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setCurrentQuestionIndex(0);
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading... 🚀</div>
      </div>
    );
  }

  if (quizLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-foreground">
            {!quiz ? "Quiz not found" : "No questions in this quiz"}
          </h2>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const courseId = quiz.chapters?.course_id;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;
  const hasPassed = previousAttempts.some(a => a.passed);

  // Result Screen
  if (quizSubmitted && quizResult) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => courseId ? navigate(`/student/courses/${courseId}`) : navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">Quiz Result</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className={cn(
                "w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center",
                quizResult.passed ? "bg-primary/10" : "bg-destructive/10"
              )}>
                {quizResult.passed ? (
                  <Trophy className="h-12 w-12 text-primary" />
                ) : (
                  <XCircle className="h-12 w-12 text-destructive" />
                )}
              </div>
              <CardTitle className="text-3xl">
                {quizResult.passed ? "Congratulations! 🎉" : "Keep Trying! 💪"}
              </CardTitle>
              <CardDescription className="text-lg">
                {quizResult.passed 
                  ? "You passed the quiz!" 
                  : `You need ${quiz.passing_score}% to pass`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-foreground">
                {quizResult.score}%
              </div>
              <div className="flex justify-center gap-4">
                <Badge variant="outline" className="text-lg py-2 px-4">
                  📊 Score: {quizResult.score}%
                </Badge>
                <Badge variant="outline" className="text-lg py-2 px-4">
                  🎯 Required: {quiz.passing_score}%
                </Badge>
              </div>
              <Progress value={quizResult.score} className="h-4" />
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" size="lg" onClick={() => courseId ? navigate(`/student/courses/${courseId}`) : navigate(-1)}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Course
              </Button>
              {!quizResult.passed && (
                <Button size="lg" onClick={handleRetry}>
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Try Again
                </Button>
              )}
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

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
                {quiz.title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {answeredCount}/{quiz.questions.length} answered
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => navigate("/student/profile")}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Previous Pass Status */}
        {hasPassed && (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="py-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span className="font-medium">You've already passed this quiz!</span>
              <Badge variant="secondary">Best: {Math.max(...previousAttempts.map(a => a.score))}%</Badge>
            </CardContent>
          </Card>
        )}

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Question {currentQuestionIndex + 1}</Badge>
              <Badge variant="secondary">
                {currentQuestion.question_type === "true_false" ? "True/False" : "Multiple Choice"}
              </Badge>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                const optionLabels = ["A", "B", "C", "D", "E", "F"];
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      {optionLabels[idx]}
                    </div>
                    <span className="text-lg">{option.option_text}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation Dots */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {quiz.questions.map((q: QuizQuestion, idx: number) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                idx === currentQuestionIndex 
                  ? "bg-primary text-primary-foreground" 
                  : selectedAnswers[q.id] 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted hover:bg-muted/80"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button 
              size="lg"
              onClick={handleSubmit}
              disabled={submitQuiz.isPending}
              className="min-w-32"
            >
              {submitQuiz.isPending ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button 
              size="lg"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
