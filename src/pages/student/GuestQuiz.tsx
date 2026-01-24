import { useState, useEffect, useRef, useCallback } from "react";
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
  Timer,
  Volume2,
  VolumeX,
  Zap,
  Flame,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Confetti } from "@/components/ui/confetti";
import mascot from "@/assets/kodi-mascot-3d.png";
import { useGuestProgress } from "@/hooks/useGuestProgress";
import { cn } from "@/lib/utils";

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

// Sound effects using Web Audio API
const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return null;
};

const playSound = (type: 'correct' | 'wrong' | 'tick' | 'timeout' | 'select', isMuted: boolean) => {
  if (isMuted) return;
  
  try {
    const audioContext = createAudioContext();
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'correct':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
      case 'wrong':
        oscillator.frequency.setValueAtTime(392, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(311.13, audioContext.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'tick':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
      case 'timeout':
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
      case 'select':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.08);
        break;
    }
  } catch (e) {
    console.log('Audio not supported');
  }
};

const TIMER_DURATION = 20; // seconds per question

export default function GuestQuiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { markQuizCompleted } = useGuestProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shake, setShake] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(TIMER_DURATION);

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

      const questionIds = questionsData.map((q) => q.id);
      const { data: optionsData, error: optionsError } = await supabase
        .from("quiz_options")
        .select("*")
        .in("question_id", questionIds)
        .order("order_index");
      if (optionsError) throw optionsError;

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

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && !showResults && !showFeedback) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          // Play tick sound when under 5 seconds
          if (newTime <= 5 && newTime > 0) {
            playSound('tick', isMuted);
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && !showResults && !showFeedback) {
      // Time's up - auto-submit current answer or mark as wrong
      playSound('timeout', isMuted);
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTimerActive, showResults, showFeedback, isMuted]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(TIMER_DURATION);
    setIsTimerActive(true);
    lastTickRef.current = TIMER_DURATION;
  }, [currentQuestionIndex]);

  const handleTimeUp = useCallback(() => {
    if (!currentQuestion) return;
    
    // If no answer selected, mark as wrong
    if (!selectedAnswers[currentQuestion.id]) {
      setShowFeedback('wrong');
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      
      // Auto-advance after feedback
      setTimeout(() => {
        setShowFeedback(null);
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          handleSubmit();
        }
      }, 1500);
    }
  }, [currentQuestion, selectedAnswers, currentQuestionIndex, totalQuestions]);

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    if (showFeedback) return; // Prevent changes during feedback
    
    playSound('select', isMuted);
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleConfirmAnswer = () => {
    if (!currentQuestion || !selectedAnswers[currentQuestion.id]) return;
    
    setIsTimerActive(false);
    const correctOption = currentQuestion.options.find(o => o.is_correct);
    const isCorrect = selectedAnswers[currentQuestion.id] === correctOption?.id;
    
    if (isCorrect) {
      playSound('correct', isMuted);
      setShowFeedback('correct');
      setStreak(prev => prev + 1);
    } else {
      playSound('wrong', isMuted);
      setShowFeedback('wrong');
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    
    // Auto-advance after feedback
    setTimeout(() => {
      setShowFeedback(null);
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }, 1500);
  };

  const handleSubmit = () => {
    setShowResults(true);
    setIsTimerActive(false);
    const score = calculateScore();
    const passingScore = quiz?.passing_score || 60;
    const scorePercentage = Math.round((score / totalQuestions) * 100);
    const passed = scorePercentage >= passingScore;
    
    if (quizId) {
      markQuizCompleted(quizId, scorePercentage, passed);
    }
    
    if (passed) {
      playSound('correct', isMuted);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setStreak(0);
    setTimeLeft(TIMER_DURATION);
    setIsTimerActive(true);
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

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={handleRetry} className="flex-1 gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={() => navigate("/guest/courses")} className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary">
                <Home className="h-4 w-4" />
                Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz View with Timer & Gamification
  const timerPercentage = (timeLeft / TIMER_DURATION) * 100;
  const isLowTime = timeLeft <= 5;

  return (
    <div className="p-3 sm:p-4 lg:p-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/guest/courses")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Exit
        </Button>
        
        <div className="flex items-center gap-3">
          {/* Streak Badge */}
          {streak > 0 && (
            <Badge className="bg-gradient-to-r from-sunny to-coral text-white border-0 gap-1 animate-pulse">
              <Flame className="h-3 w-3" />
              {streak} streak
            </Badge>
          )}
          
          {/* Mute Button */}
          <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-8 w-8">
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Card className={cn(
        "max-w-2xl mx-auto overflow-hidden transition-all",
        shake && "animate-shake"
      )}>
        {/* Quiz Header with Timer */}
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
            
            {/* Timer Display */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
              isLowTime 
                ? "bg-coral/20 border-2 border-coral animate-pulse" 
                : "bg-muted/50"
            )}>
              <Timer className={cn("h-4 w-4", isLowTime ? "text-coral" : "text-muted-foreground")} />
              <span className={cn(
                "font-mono font-bold text-lg",
                isLowTime ? "text-coral" : "text-foreground"
              )}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          {/* Timer Progress Bar */}
          <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-1000",
                isLowTime ? "bg-coral" : "bg-gradient-to-r from-purple to-primary"
              )}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
          
          {/* Question Progress */}
          <div className="flex items-center justify-between mt-2">
            <Badge variant="secondary" className="text-xs">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </Badge>
            <Progress value={progress} className="w-24 h-1.5" />
          </div>
        </div>

        <CardContent className="p-4 sm:p-6">
          {/* Feedback Overlay */}
          {showFeedback && (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center z-10 bg-background/80 backdrop-blur-sm animate-fade-in",
              showFeedback === 'correct' ? 'text-lime' : 'text-coral'
            )}>
              <div className="text-center">
                {showFeedback === 'correct' ? (
                  <>
                    <CheckCircle className="h-16 w-16 mx-auto mb-2 animate-bounce" />
                    <p className="font-bold text-xl">Correct! 🎉</p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-16 w-16 mx-auto mb-2" />
                    <p className="font-bold text-xl">Incorrect 😔</p>
                  </>
                )}
              </div>
            </div>
          )}

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
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              const showCorrect = showFeedback && option.is_correct;
              const showWrong = showFeedback === 'wrong' && isSelected && !option.is_correct;
              
              return (
                <div key={option.id}>
                  <Label
                    htmlFor={option.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      showCorrect && "border-lime bg-lime/10 shadow-md",
                      showWrong && "border-coral bg-coral/10",
                      !showFeedback && isSelected && "border-purple bg-purple/10 shadow-md",
                      !showFeedback && !isSelected && "border-border hover:border-purple/50 hover:bg-muted/50"
                    )}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="shrink-0" disabled={!!showFeedback} />
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                      showCorrect ? "bg-lime/30 text-lime" : showWrong ? "bg-coral/30 text-coral" : "bg-muted"
                    )}>
                      {showCorrect ? <CheckCircle className="h-4 w-4" /> : showWrong ? <XCircle className="h-4 w-4" /> : String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-sm sm:text-base">{option.option_text}</span>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {/* Confirm Button */}
          <div className="mt-8 pt-4 border-t">
            <Button
              onClick={handleConfirmAnswer}
              disabled={!selectedAnswers[currentQuestion.id] || !!showFeedback}
              className="w-full h-12 gap-2 bg-gradient-to-r from-purple to-primary text-lg font-semibold"
            >
              <Zap className="h-5 w-5" />
              Confirm Answer
            </Button>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  idx === currentQuestionIndex
                    ? "w-6 bg-primary"
                    : selectedAnswers[questions[idx].id]
                      ? "bg-lime"
                      : "bg-muted"
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
