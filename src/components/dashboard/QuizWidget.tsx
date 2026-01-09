import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Sparkles,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Zap,
  RefreshCcw,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import quizBrainMascot from "@/assets/quiz-brain-mascot.png";
import { Confetti } from "@/components/ui/confetti";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizWidgetProps {
  className?: string;
  onComplete?: (score: number) => void;
}

// AI-generated quiz questions based on Class 3 curriculum
const quizPool: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which of these is a SMART device?",
    options: ["Wooden chair", "Smart Speaker", "Regular book", "Pencil"],
    correct: 1,
    explanation: "A smart speaker like Alexa can listen and respond - that's AI!",
  },
  {
    id: "q2",
    question: "What helps a smart device 'think'?",
    options: ["Batteries", "AI (Artificial Intelligence)", "Buttons", "Colors"],
    correct: 1,
    explanation: "AI is like a brain for smart devices!",
  },
  {
    id: "q3",
    question: "Which animal inspired swimming robots?",
    options: ["Dogs", "Fish", "Birds", "Cats"],
    correct: 1,
    explanation: "Scientists made robots that swim like fish!",
  },
  {
    id: "q4",
    question: "How does a robot vacuum help us?",
    options: ["Cooks food", "Cleans floors", "Plays music", "Tells jokes"],
    correct: 1,
    explanation: "Robot vacuums clean floors automatically!",
  },
  {
    id: "q5",
    question: "What makes a smart TV 'smart'?",
    options: ["Big screen", "More buttons", "Connects to internet", "Loud speakers"],
    correct: 2,
    explanation: "Smart TVs connect to the internet for apps and streaming!",
  },
  {
    id: "q6",
    question: "Can AI help doctors?",
    options: ["Yes, with diagnosis", "No, never", "Only in movies", "Maybe someday"],
    correct: 0,
    explanation: "AI helps doctors find diseases and suggest treatments!",
  },
  {
    id: "q7",
    question: "What does a smart watch do?",
    options: ["Only tells time", "Tracks health & shows messages", "Nothing special", "Plays games only"],
    correct: 1,
    explanation: "Smart watches track steps, heart rate, and show notifications!",
  },
  {
    id: "q8",
    question: "Which is an example of AI in our home?",
    options: ["A regular lamp", "Voice assistant like Alexa", "A wooden table", "A normal clock"],
    correct: 1,
    explanation: "Voice assistants use AI to understand and help you!",
  },
];

export function QuizWidget({ className, onComplete }: QuizWidgetProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get a random question on mount and when refreshed
  const getRandomQuestion = () => {
    setIsLoading(true);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quizPool.length);
      setCurrentQuestion(quizPool[randomIndex]);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    getRandomQuestion();
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    const correct = selectedAnswer === currentQuestion.correct;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      setStreak((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      onComplete?.(100);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    getRandomQuestion();
  };

  if (!currentQuestion) {
    return (
      <Card className={cn("overflow-hidden animate-pulse", className)}>
        <CardContent className="p-4 sm:p-6">
          <div className="h-48 bg-muted rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {showConfetti && <Confetti isActive={showConfetti} />}
      
      <Card
        className={cn(
          "overflow-hidden relative group transition-all duration-500",
          isAnswered
            ? isCorrect
              ? "bg-gradient-to-br from-lime/10 via-turquoise/5 to-lime/10 border-lime/30"
              : "bg-gradient-to-br from-coral/10 via-pink/5 to-coral/10 border-coral/30"
            : "bg-gradient-to-br from-primary/5 via-secondary/5 to-purple/10 border-primary/20 hover:border-primary/40",
          className
        )}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Streak indicator */}
        {streak > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-gradient-to-r from-sunny to-coral text-foreground text-xs px-2 py-1 animate-bounce-gentle">
              <Zap className="h-3 w-3 mr-1" />
              {streak} Streak! 🔥
            </Badge>
          </div>
        )}

        <CardContent className="p-3 sm:p-4 lg:p-5 relative">
          {/* Header with mascot */}
          <div className="flex items-start gap-3 mb-3 sm:mb-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 p-1 shadow-lg">
                <img
                  src={quizBrainMascot}
                  alt="Quiz Mascot"
                  className={cn(
                    "w-full h-full object-cover rounded-xl transition-transform duration-500",
                    isLoading && "animate-pulse",
                    isAnswered && isCorrect && "animate-bounce-gentle"
                  )}
                />
              </div>
              {isAnswered && (
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg",
                  isCorrect ? "bg-lime" : "bg-coral"
                )}>
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-foreground" />
                  ) : (
                    <XCircle className="h-4 w-4 text-foreground" />
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 border-primary/30">
                  <Brain className="h-2.5 w-2.5 mr-0.5" />
                  Quick Quiz
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-sunny/10 border-sunny/30 text-sunny">
                  <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                  +25 XP
                </Badge>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-foreground line-clamp-2 leading-tight">
                {currentQuestion.question}
              </h4>
            </div>
          </div>

          {/* Options */}
          <div className="grid gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = currentQuestion.correct === index;
              const showResult = isAnswered;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered || isLoading}
                  className={cn(
                    "w-full p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl text-left transition-all duration-300 border-2",
                    showResult
                      ? isCorrectOption
                        ? "bg-lime/20 border-lime text-foreground shadow-lg"
                        : isSelected
                        ? "bg-coral/20 border-coral text-foreground"
                        : "bg-muted/30 border-transparent opacity-60"
                      : isSelected
                      ? "bg-primary/20 border-primary shadow-md scale-[1.02]"
                      : "bg-muted/50 border-transparent hover:bg-muted hover:border-muted-foreground/20 hover:scale-[1.01]",
                    isLoading && "pointer-events-none opacity-50"
                  )}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className={cn(
                      "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                      showResult && isCorrectOption
                        ? "bg-lime text-foreground"
                        : showResult && isSelected
                        ? "bg-coral text-foreground"
                        : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-background"
                    )}>
                      {showResult && isCorrectOption ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : showResult && isSelected && !isCorrectOption ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span className="text-xs sm:text-sm font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation when answered */}
          {isAnswered && (
            <div className={cn(
              "p-2.5 sm:p-3 rounded-lg sm:rounded-xl mb-3 flex items-start gap-2 animate-fade-in",
              isCorrect ? "bg-lime/20" : "bg-coral/20"
            )}>
              <Lightbulb className={cn(
                "h-4 w-4 mt-0.5 shrink-0",
                isCorrect ? "text-lime" : "text-coral"
              )} />
              <div>
                <p className="text-xs sm:text-sm font-medium mb-0.5">
                  {isCorrect ? "Awesome! 🎉" : "Not quite! 💪"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {!isAnswered ? (
              <Button
                size="sm"
                className="flex-1 text-xs sm:text-sm gap-1.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                onClick={handleSubmit}
                disabled={selectedAnswer === null || isLoading}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Check Answer
              </Button>
            ) : (
              <Button
                size="sm"
                className="flex-1 text-xs sm:text-sm gap-1.5 bg-gradient-to-r from-turquoise to-lime hover:opacity-90"
                onClick={handleNextQuestion}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                Next Question
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs sm:text-sm"
              onClick={handleNextQuestion}
              disabled={isLoading}
            >
              <RefreshCcw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              <span className="hidden sm:inline">New</span>
            </Button>
          </div>

          {/* Score indicator for completed */}
          {isAnswered && isCorrect && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-lime/30 to-turquoise/30 flex items-center justify-center animate-pulse">
                <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-sunny" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
