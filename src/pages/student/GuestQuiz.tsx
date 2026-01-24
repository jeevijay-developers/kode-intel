import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Home,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Confetti } from "@/components/ui/confetti";
import mascot from "@/assets/kodi-mascot-3d.png";
import { useGuestProgress } from "@/hooks/useGuestProgress";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  order_index: number;
  options: Option[];
}

interface Option {
  id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export default function GuestQuiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { markQuizCompleted } = useGuestProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch quiz details
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["guest-quiz", quizId],
    queryFn: async () => {
      if (!quizId) return null;
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .select("*")
        .eq("id", quizId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!quizId,
  });

  // Fetch questions with options
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["guest-quiz-questions", quizId],
    queryFn: async () => {
      if (!quizId) return [];
      const { data: questionsData, error: questionsError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order_index");
      if (questionsError) throw questionsError;

      // Fetch options for all questions
      const questionIds = questionsData.map((q) => q.id);
      const { data: optionsData, error: optionsError } = await supabase
        .from("quiz_options")
        .select("*")
        .in("question_id", questionIds)
        .order("order_index");
      if (optionsError) throw optionsError;

      // Combine questions with their options
      return questionsData.map((q) => ({
        ...q,
        options: optionsData.filter((o) => o.question_id === q.id),
      })) as Question[];
    },
    enabled: !!quizId,
  });

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const score = calculateScore();
    const passingScore = quiz?.passing_score || 60;
    const scorePercentage = Math.round((score / totalQuestions) * 100);
    const passed = scorePercentage >= passingScore;
    
    // Save progress to localStorage
    if (quizId) {
      markQuizCompleted(quizId, scorePercentage, passed);
    }
    
    if (passed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const calculateScore = (): number => {
    let correct = 0;
    questions.forEach((q) => {
      const selectedOptionId = selectedAnswers[q.id];
      const correctOption = q.options.find((o) => o.is_correct);
      if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
        correct++;
      }
    });
    return correct;
  };

  const isLoading = quizLoading || questionsLoading;

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-primary mx-auto mb-4 animate-pulse flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate("/guest/courses")} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
        <Card className="p-8 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-bold text-lg mb-2">Quiz Not Found</h3>
          <p className="text-muted-foreground text-sm">This quiz doesn't exist or has no questions.</p>
        </Card>
      </div>
    );
  }

  // Results View
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= (quiz.passing_score || 60);

    return (
      <div className="p-3 sm:p-4 lg:p-6 animate-fade-in">
        <Confetti isActive={showConfetti} />
        
        <Card className="max-w-2xl mx-auto overflow-hidden">
          {/* Results Header */}
          <div className={`p-6 text-center ${passed ? 'bg-gradient-to-br from-lime/20 to-turquoise/20' : 'bg-gradient-to-br from-coral/20 to-sunny/20'}`}>
            <div className="relative inline-block mb-4">
              <img src={mascot} alt="Kodi" className="w-24 h-24 mx-auto drop-shadow-xl" />
              {passed ? (
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-lime to-turquoise flex items-center justify-center shadow-lg animate-bounce">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-coral to-sunny flex items-center justify-center shadow-lg">
                  <RotateCcw className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold font-display mb-2">
              {passed ? "🎉 Congratulations!" : "Keep Trying! 💪"}
            </h2>
            <p className="text-muted-foreground">
              {passed ? "You passed the quiz!" : "You didn't pass this time, but don't give up!"}
            </p>
          </div>

          <CardContent className="p-6">
            {/* Score Display */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${passed ? 'bg-gradient-to-br from-lime to-turquoise' : 'bg-gradient-to-br from-coral to-sunny'} text-white font-bold text-3xl shadow-xl`}>
                {percentage}%
              </div>
              <p className="mt-3 text-lg font-medium">
                {score} out of {totalQuestions} correct
              </p>
              <Badge className={`mt-2 ${passed ? 'bg-lime/20 text-lime' : 'bg-coral/20 text-coral'}`}>
                Passing Score: {quiz.passing_score}%
              </Badge>
            </div>

            {/* Answer Review */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Answer Review:</h3>
              {questions.map((q, idx) => {
                const selectedOptionId = selectedAnswers[q.id];
                const correctOption = q.options.find((o) => o.is_correct);
                const isCorrect = selectedOptionId === correctOption?.id;
                
                return (
                  <div key={q.id} className={`p-3 rounded-lg border ${isCorrect ? 'bg-lime/5 border-lime/30' : 'bg-coral/5 border-coral/30'}`}>
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-lime shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-coral shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Q{idx + 1}: {q.question_text}</p>
                        {!isCorrect && correctOption && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Correct answer: <span className="text-lime font-medium">{correctOption.option_text}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleRetry}
                className="flex-1 gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/guest/courses")}
                className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                <Home className="h-4 w-4" />
                Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz View
  return (
    <div className="p-3 sm:p-4 lg:p-6 animate-fade-in">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/guest/courses")}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Exit Quiz
      </Button>

      <Card className="max-w-2xl mx-auto overflow-hidden">
        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-purple/10 to-primary/10 p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-primary flex items-center justify-center shadow-lg">
                <HelpCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base truncate">{quiz.title}</h1>
                <p className="text-xs text-muted-foreground">Pass score: {quiz.passing_score}%</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentQuestionIndex + 1}/{totalQuestions}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <CardContent className="p-4 sm:p-6">
          {/* Question */}
          <div className="mb-6">
            <Badge className="mb-3 bg-purple/20 text-purple">Question {currentQuestionIndex + 1}</Badge>
            <h2 className="text-lg sm:text-xl font-semibold leading-relaxed">
              {currentQuestion.question_text}
            </h2>
          </div>

          {/* Options */}
          <RadioGroup
            value={selectedAnswers[currentQuestion.id] || ""}
            onValueChange={(value) => handleSelectAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, idx) => (
              <div key={option.id}>
                <Label
                  htmlFor={option.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAnswers[currentQuestion.id] === option.id
                      ? 'border-purple bg-purple/10 shadow-md'
                      : 'border-border hover:border-purple/50 hover:bg-muted/50'
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="shrink-0" />
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 text-sm sm:text-base">{option.option_text}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length < totalQuestions}
                className="gap-2 bg-gradient-to-r from-purple to-primary"
              >
                <Sparkles className="h-4 w-4" />
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!selectedAnswers[currentQuestion.id]}
                className="gap-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
