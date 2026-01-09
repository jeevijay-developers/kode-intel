import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Play,
  HelpCircle,
  Brain,
  Video,
  Star,
  Sparkles,
  Lock,
  CheckCircle,
  Trophy,
  ArrowLeft,
  ChevronRight,
  Timer,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import { Confetti } from "@/components/ui/confetti";
import quizMascot from "@/assets/quiz-brain-mascot.png";
import KodeIntelPlayer from "@/components/student/KodeIntelPlayer";
import courseBannerClass3 from "@/assets/course-banner-class3.png";

// Sound generator
const playSound = (type: 'correct' | 'wrong' | 'tick' | 'timeout') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
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
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    case 'tick':
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
      break;
    case 'timeout':
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      break;
  }
};

// Gamified Quiz View Component
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizData {
  id: string;
  title: string;
  chapterId: number;
  questions: QuizQuestion[];
}

interface GamifiedQuizViewProps {
  quiz: QuizData;
  onBack: () => void;
  onComplete: (score: number) => void;
}

function GamifiedQuizView({ quiz, onBack, onComplete }: GamifiedQuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (!showResult && !quizComplete && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 4 && prev > 1 && !isMuted) {
            playSound('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      // Time's up
      if (!isMuted) playSound('timeout');
      setShowResult(true);
      setStreak(0);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, showResult, quizComplete, isMuted]);

  // Reset timer for new question
  useEffect(() => {
    if (!showResult && !quizComplete) {
      setTimeLeft(20);
    }
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    
    const isCorrect = optionIndex === currentQuestion.correct;
    
    if (isCorrect) {
      if (!isMuted) playSound('correct');
      setScore(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonusXp = Math.min(newStreak * 5, 25);
      const timeBonus = Math.floor(timeLeft / 2);
      setXpEarned(prev => prev + 10 + bonusXp + timeBonus);
    } else {
      if (!isMuted) playSound('wrong');
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      if (score >= Math.ceil(totalQuestions * 0.7)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      onComplete(Math.round((score / totalQuestions) * 100));
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setXpEarned(0);
    setQuizComplete(false);
    setTimeLeft(20);
  };

  const getTimerColor = () => {
    if (timeLeft > 10) return "bg-green-500";
    if (timeLeft > 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Quiz Complete View
  if (quizComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPassed = percentage >= 70;
    
    return (
      <div className="p-3 sm:p-4 lg:p-6 max-w-2xl mx-auto animate-fade-in">
        <Confetti isActive={showConfetti} />
        
        <Card className="overflow-hidden border-0 shadow-2xl">
          <div className={`p-6 sm:p-8 text-center ${isPassed ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20' : 'bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20'}`}>
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
              <img 
                src={quizMascot} 
                alt="Quiz Mascot" 
                className="w-full h-full object-contain animate-bounce"
              />
              <div className={`absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${isPassed ? 'bg-green-500' : 'bg-orange-500'} flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg`}>
                {isPassed ? '🎉' : '💪'}
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {isPassed ? 'Fantastic Job!' : 'Keep Learning!'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isPassed ? 'You aced this quiz!' : 'Practice makes perfect!'}
            </p>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="bg-background/80 backdrop-blur rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{percentage}%</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              <div className="bg-background/80 backdrop-blur rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-amber-500">{score}/{totalQuestions}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div className="bg-background/80 backdrop-blur rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-500">+{xpEarned}</div>
                <div className="text-xs text-muted-foreground">XP Earned</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRestart} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={onBack} className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                <ArrowLeft className="h-4 w-4" />
                Back to Course
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mute Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          {/* Score */}
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="font-bold text-sm">{xpEarned} XP</span>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-xl">
        {/* Progress & Timer Bar */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </Badge>
              {streak > 1 && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs animate-pulse">
                  🔥 {streak} Streak!
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Timer className={`h-4 w-4 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
              <span className={`font-mono font-bold text-sm ${timeLeft <= 5 ? 'text-red-500' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          {/* Combined Progress Bar */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-primary/30 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            <div 
              className={`absolute right-0 top-0 h-full ${getTimerColor()} transition-all duration-1000`}
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            />
          </div>
        </div>

        {/* Mascot & Question */}
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative">
              <img 
                src={quizMascot} 
                alt="Quiz Mascot" 
                className="w-full h-full object-contain"
              />
              {showResult && selectedAnswer === currentQuestion.correct && (
                <div className="absolute -top-1 -right-1 text-lg">✨</div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold leading-tight">
                {currentQuestion.question}
              </h3>
            </div>
          </div>

          {/* Options */}
          <div className="grid gap-2 sm:gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`
                    relative p-3 sm:p-4 rounded-xl text-left transition-all duration-300 border-2
                    ${showCorrect 
                      ? 'bg-green-500/20 border-green-500 scale-[1.02]' 
                      : showWrong 
                        ? 'bg-red-500/20 border-red-500 shake-animation' 
                        : isSelected && !showResult
                          ? 'bg-primary/20 border-primary scale-[1.02]'
                          : 'bg-muted/50 border-transparent hover:bg-muted hover:border-muted-foreground/20'
                    }
                    ${!showResult && 'hover:scale-[1.01] active:scale-[0.99]'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shrink-0 transition-colors
                      ${showCorrect 
                        ? 'bg-green-500 text-white' 
                        : showWrong 
                          ? 'bg-red-500 text-white' 
                          : isSelected 
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background'
                      }
                    `}>
                      {showCorrect ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm sm:text-base flex-1">{option}</span>
                    {showCorrect && <Sparkles className="h-5 w-5 text-green-500 animate-pulse" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {showResult && (
            <div className="mt-4 sm:mt-6 space-y-4 animate-fade-in">
              <div className={`p-3 sm:p-4 rounded-xl ${selectedAnswer === currentQuestion.correct ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
                <p className="text-xs sm:text-sm">
                  <span className="font-semibold">💡 Explanation:</span> {currentQuestion.explanation}
                </p>
              </div>
              
              <Button 
                onClick={handleNextQuestion}
                className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                size="lg"
              >
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4" />
                    See Results
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Guest quiz data based on Class 3 curriculum
const guestQuizzes = [
  {
    id: "q1",
    title: "Smart Things Around Us",
    chapterId: 1,
    questions: [
      {
        id: "q1-1",
        question: "Which of these is a SMART device?",
        options: ["A wooden chair", "A smart speaker like Alexa", "A regular book", "A pencil"],
        correct: 1,
        explanation: "A smart speaker like Alexa can listen, understand, and respond to your voice - that's what makes it smart!",
      },
      {
        id: "q1-2",
        question: "What helps a smart device 'think'?",
        options: ["Batteries", "Artificial Intelligence (AI)", "Buttons", "Colors"],
        correct: 1,
        explanation: "Artificial Intelligence (AI) is like a brain for smart devices that helps them think and make decisions!",
      },
      {
        id: "q1-3",
        question: "Which animal has inspired smart robots?",
        options: ["All of these", "Dogs", "Fish", "Birds"],
        correct: 0,
        explanation: "Scientists have made robots inspired by many animals - dogs, fish, birds, and more!",
      },
    ],
  },
  {
    id: "q2",
    title: "How Machines Help Us",
    chapterId: 2,
    questions: [
      {
        id: "q2-1",
        question: "How does a washing machine help us?",
        options: ["It cooks food", "It washes clothes automatically", "It plays music", "It draws pictures"],
        correct: 1,
        explanation: "A washing machine is a helpful machine that washes our clothes without us doing the hard work!",
      },
      {
        id: "q2-2",
        question: "What makes a machine 'smart'?",
        options: ["It's very big", "It can learn and make decisions", "It has many buttons", "It's very colorful"],
        correct: 1,
        explanation: "Smart machines can learn from what they see and hear, and make decisions on their own!",
      },
      {
        id: "q2-3",
        question: "Which is an example of a helpful robot?",
        options: ["A rock", "A robot vacuum cleaner", "A tree", "A cloud"],
        correct: 1,
        explanation: "Robot vacuum cleaners are helpful robots that clean our floors automatically!",
      },
    ],
  },
  {
    id: "q3",
    title: "Smart vs Normal Machines",
    chapterId: 3,
    questions: [
      {
        id: "q3-1",
        question: "What is the difference between a normal fan and a smart fan?",
        options: ["Smart fan has more blades", "Smart fan can understand voice commands", "Normal fan is smaller", "No difference"],
        correct: 1,
        explanation: "A smart fan can understand when you say 'turn on' or 'turn off' - that's smart technology!",
      },
      {
        id: "q3-2",
        question: "Can a smart TV learn what shows you like?",
        options: ["Yes, it can recommend shows", "No, it cannot learn", "Only if you teach it manually", "TVs don't watch shows"],
        correct: 0,
        explanation: "Smart TVs use AI to learn your preferences and suggest shows you might enjoy!",
      },
    ],
  },
];

// Class 3 chapter videos
const guestChapters = [
  {
    id: 1,
    title: "Smart Things Around Us",
    description: "Discover the amazing smart devices in our world",
    videoUrl: "https://youtu.be/-pbhZQZJ52E",
    videoTitle: "Smart Things Around Us",
    quizId: "q1",
  },
  {
    id: 2,
    title: "How Machines Help Us",
    description: "Learn how machines make our life easier",
    videoUrl: "https://youtu.be/6M1X7VLChqA",
    videoTitle: "How Machines Help Us",
    quizId: "q2",
  },
  {
    id: 3,
    title: "Smart Machines vs Normal Machines",
    description: "Understand what makes machines 'smart'",
    videoUrl: "https://youtu.be/nkN_m5p2WNE",
    videoTitle: "Smart Machines vs Normal Machines",
    quizId: "q3",
  },
  {
    id: 4,
    title: "AI as a Friendly Helper",
    description: "Meet AI - your friendly digital helper",
    videoUrl: "https://youtu.be/cpK7c_DX1jk",
    videoTitle: "AI as a Friendly Helper",
    isLocked: true,
  },
  {
    id: 5,
    title: "Smart Things in Daily Life",
    description: "Smart devices we use every day",
    videoUrl: "https://youtu.be/cpK7c_DX1jk",
    videoTitle: "Smart Things in Daily Life",
    isLocked: true,
  },
  {
    id: 6,
    title: "Being Safe with Smart Things",
    description: "Stay safe while using smart devices",
    videoUrl: "https://youtu.be/J6saS7Gf-Xs",
    videoTitle: "Being Safe with Smart Things",
    isLocked: true,
  },
];

export default function GuestCourses() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [completedVideos, setCompletedVideos] = useState<number[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);

  const currentQuiz = guestQuizzes.find((q) => q.id === activeQuiz);

  const handleVideoComplete = (chapterId: number) => {
    if (!completedVideos.includes(chapterId)) {
      setCompletedVideos([...completedVideos, chapterId]);
    }
  };

  const handleQuizSubmit = (quizId: string) => {
    setQuizSubmitted({ ...quizSubmitted, [quizId]: true });
    if (!completedQuizzes.includes(quizId)) {
      setCompletedQuizzes([...completedQuizzes, quizId]);
    }
  };

  const getQuizScore = (quizId: string) => {
    const quiz = guestQuizzes.find((q) => q.id === quizId);
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) correct++;
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const totalProgress = Math.round(
    ((completedVideos.length + completedQuizzes.length) /
      (guestChapters.filter((c) => !c.isLocked).length * 2)) *
      100
  );

  const extractYouTubeId = (url: string): string => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match?.[1] || "";
  };

  // Video Player View
  if (activeVideo) {
    const chapter = guestChapters.find((c) => c.videoUrl === activeVideo);
    const videoId = extractYouTubeId(activeVideo);
    return (
      <div className="p-2 sm:p-4 lg:p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (chapter) handleVideoComplete(chapter.id);
            setActiveVideo(null);
          }}
          className="gap-1.5 mb-3 text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Course
        </Button>
        <h1 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4">
          {chapter?.videoTitle}
        </h1>
        <KodeIntelPlayer
          videoId={videoId}
          title={chapter?.videoTitle || "Video Lesson"}
          onComplete={() => {
            if (chapter) handleVideoComplete(chapter.id);
          }}
        />
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              if (chapter) handleVideoComplete(chapter.id);
              setActiveVideo(null);
            }}
            className="gap-1.5 text-xs sm:text-sm"
          >
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Complete & Continue
          </Button>
        </div>
      </div>
    );
  }

  // Gamified Quiz View
  if (activeQuiz && currentQuiz) {
    return (
      <GamifiedQuizView
        quiz={currentQuiz}
        onBack={() => setActiveQuiz(null)}
        onComplete={(score) => {
          handleQuizSubmit(activeQuiz);
        }}
      />
    );
  }

  // Main Course View
  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-in">
      {/* Course Banner */}
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={courseBannerClass3}
            alt="Class 3 - Thinking & Smart Machines"
            className="w-full h-28 sm:h-40 lg:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-3 sm:p-4 lg:p-6 text-white w-full">
              <Badge className="mb-1.5 sm:mb-2 bg-turquoise/80 text-white text-xs">
                <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 fill-current" />
                Class 3
              </Badge>
              <h1 className="text-base sm:text-lg lg:text-2xl font-bold mb-1">
                Thinking & Smart Machines
              </h1>
              <p className="text-white/80 text-xs sm:text-sm line-clamp-1 mb-2">
                Learn about AI, smart devices, and how machines think!
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                <Progress value={totalProgress} className="flex-1 h-1.5 sm:h-2" />
                <span className="text-white/80 text-xs sm:text-sm font-medium">
                  {totalProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Course Content */}
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Course Content
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 lg:p-6 pt-0">
          <Accordion type="single" collapsible className="space-y-1.5 sm:space-y-2">
            {guestChapters.map((chapter) => {
              const isCompleted = completedVideos.includes(chapter.id);
              const quizCompleted = chapter.quizId
                ? completedQuizzes.includes(chapter.quizId)
                : false;

              return (
                <AccordionItem
                  key={chapter.id}
                  value={`chapter-${chapter.id}`}
                  className={`border rounded-lg sm:rounded-xl overflow-hidden ${
                    chapter.isLocked
                      ? "opacity-60 bg-muted/30"
                      : isCompleted && quizCompleted
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-border"
                  }`}
                >
                  <AccordionTrigger className="px-3 sm:px-4 py-2 sm:py-3 hover:no-underline">
                    <div className="flex items-center gap-2 sm:gap-3 text-left flex-1">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                          chapter.isLocked
                            ? "bg-muted"
                            : isCompleted && quizCompleted
                            ? "bg-green-500/20"
                            : "bg-primary/20"
                        }`}
                      >
                        {chapter.isLocked ? (
                          <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        ) : isCompleted && quizCompleted ? (
                          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-500" />
                        ) : (
                          <span className="text-xs sm:text-sm font-bold text-primary">
                            {chapter.id}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-xs sm:text-sm lg:text-base truncate">
                          {chapter.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {chapter.description}
                        </p>
                      </div>
                      {chapter.isLocked && (
                        <Badge
                          variant="outline"
                          className="shrink-0 text-[10px] sm:text-xs px-1.5 py-0.5"
                        >
                          <Lock className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5" />
                          Pro
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
                      {/* Video Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
                        onClick={() => !chapter.isLocked && setActiveVideo(chapter.videoUrl)}
                        disabled={chapter.isLocked}
                      >
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 ${
                            isCompleted ? "bg-green-500/20" : "bg-primary/20"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
                          ) : (
                            <Video className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                          )}
                        </div>
                        <span className="flex-1 text-left truncate">{chapter.videoTitle}</span>
                        {!chapter.isLocked && (
                          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                        )}
                      </Button>

                      {/* Quiz Button */}
                      {chapter.quizId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start gap-2 h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
                          onClick={() => !chapter.isLocked && setActiveQuiz(chapter.quizId!)}
                          disabled={chapter.isLocked}
                        >
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 ${
                              quizCompleted ? "bg-green-500/20" : "bg-sunny/20"
                            }`}
                          >
                            {quizCompleted ? (
                              <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
                            ) : (
                              <HelpCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-sunny" />
                            )}
                          </div>
                          <span className="flex-1 text-left truncate">Quiz: {chapter.title}</span>
                          {!chapter.isLocked && (
                            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                          )}
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
