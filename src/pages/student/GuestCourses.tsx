import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  GraduationCap,
  Rocket,
  Clock,
  Users,
} from "lucide-react";
import { Confetti } from "@/components/ui/confetti";
import quizMascot from "@/assets/quiz-brain-mascot.png";
import KodeIntelPlayer from "@/components/student/KodeIntelPlayer";
import studentsLearning from "@/assets/students-learning-ai.png";
import { useCourses, useChapters } from "@/hooks/useCourses";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      if (!isMuted) playSound('timeout');
      setShowResult(true);
      setStreak(0);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, showResult, quizComplete, isMuted]);

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

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-2xl mx-auto animate-fade-in">
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="font-bold text-sm">{xpEarned} XP</span>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-xl">
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

// Demo quiz data for all classes
const demoQuizzes: Record<string, QuizData[]> = {
  "class-3": [
    {
      id: "q1",
      title: "Smart Things Around Us",
      chapterId: 1,
      questions: [
        { id: "q1-1", question: "Which of these is a SMART device?", options: ["A wooden chair", "A smart speaker like Alexa", "A regular book", "A pencil"], correct: 1, explanation: "A smart speaker like Alexa can listen, understand, and respond to your voice!" },
        { id: "q1-2", question: "What helps a smart device 'think'?", options: ["Batteries", "Artificial Intelligence (AI)", "Buttons", "Colors"], correct: 1, explanation: "Artificial Intelligence (AI) is like a brain for smart devices!" },
      ],
    },
    {
      id: "q2",
      title: "Thinking Skills",
      chapterId: 2,
      questions: [
        { id: "q2-1", question: "What is the first step in solving any problem?", options: ["Give up", "Understand the problem", "Guess the answer", "Ask someone else"], correct: 1, explanation: "Understanding the problem helps us find the right solution!" },
        { id: "q2-2", question: "Patterns help us to:", options: ["Confuse others", "Predict what comes next", "Make things harder", "Forget things"], correct: 1, explanation: "Patterns help us predict and understand sequences!" },
      ],
    },
  ],
  "class-4": [
    {
      id: "q1",
      title: "Smart Thinking",
      chapterId: 1,
      questions: [
        { id: "q1-1", question: "Logical thinking means:", options: ["Guessing randomly", "Thinking clearly with reasons", "Not thinking at all", "Copying others"], correct: 1, explanation: "Logical thinking uses clear reasoning to solve problems!" },
        { id: "q1-2", question: "Which is an example of cause and effect?", options: ["Rain makes grass wet", "Fish can swim", "The sky is blue", "Numbers are fun"], correct: 0, explanation: "Rain (cause) makes grass wet (effect) - that's cause and effect!" },
      ],
    },
    {
      id: "q2",
      title: "Logical Skills",
      chapterId: 2,
      questions: [
        { id: "q2-1", question: "Breaking a big problem into smaller parts is called:", options: ["Confusion", "Decomposition", "Multiplication", "Running away"], correct: 1, explanation: "Decomposition means breaking big problems into smaller, manageable parts!" },
      ],
    },
  ],
  "class-5": [
    {
      id: "q1",
      title: "Logical Thinking",
      chapterId: 1,
      questions: [
        { id: "q1-1", question: "What is computational thinking?", options: ["Using computers only", "Solving problems step by step like a computer", "Playing games", "Writing stories"], correct: 1, explanation: "Computational thinking is solving problems systematically, like a computer would!" },
      ],
    },
  ],
};

// Class selection card component
interface ClassCardProps {
  classNum: number;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

function ClassCard({ classNum, title, description, isSelected, onClick }: ClassCardProps) {
  const gradients = [
    "from-coral/20 to-coral/5",
    "from-turquoise/20 to-turquoise/5",
    "from-sunny/20 to-sunny/5",
    "from-primary/20 to-primary/5",
    "from-lavender/20 to-lavender/5",
    "from-coral/20 to-coral/5",
    "from-turquoise/20 to-turquoise/5",
    "from-primary/20 to-primary/5",
  ];
  
  const iconColors = ["text-coral", "text-turquoise", "text-sunny", "text-primary", "text-lavender", "text-coral", "text-turquoise", "text-primary"];
  const bgColors = ["bg-coral/10", "bg-turquoise/10", "bg-sunny/10", "bg-primary/10", "bg-lavender/10", "bg-coral/10", "bg-turquoise/10", "bg-primary/10"];
  
  const index = classNum - 3;
  
  return (
    <button
      onClick={onClick}
      className={`
        relative p-3 rounded-2xl text-left transition-all duration-300 border-2 w-full
        bg-gradient-to-br ${gradients[index]}
        ${isSelected ? 'border-primary scale-[1.02] shadow-lg' : 'border-transparent hover:border-primary/30 hover:scale-[1.01]'}
        active:scale-[0.98]
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${bgColors[index]} flex items-center justify-center shrink-0`}>
          <span className={`text-lg font-bold ${iconColors[index]}`}>{classNum}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-foreground line-clamp-1">{title}</h3>
          <p className="text-[10px] text-muted-foreground line-clamp-2">{description}</p>
        </div>
        {isSelected && (
          <CheckCircle className="h-5 w-5 text-primary shrink-0" />
        )}
      </div>
    </button>
  );
}

// Chapter card for compact view
interface ChapterCardProps {
  chapter: {
    id: string;
    title: string;
    description: string | null;
    order_index: number;
  };
  isLocked: boolean;
  isCompleted: boolean;
  onViewDetails: () => void;
}

function ChapterCard({ chapter, isLocked, isCompleted, onViewDetails }: ChapterCardProps) {
  return (
    <button
      onClick={onViewDetails}
      disabled={isLocked}
      className={`
        relative p-3 rounded-xl text-left transition-all duration-300 w-full
        ${isLocked 
          ? 'bg-muted/50 opacity-60' 
          : isCompleted 
            ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30' 
            : 'bg-card border border-border/50 hover:border-primary/30 hover:shadow-md'
        }
        active:scale-[0.98]
      `}
    >
      <div className="flex items-start gap-2.5">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold
          ${isLocked ? 'bg-muted text-muted-foreground' : isCompleted ? 'bg-green-500/20 text-green-600' : 'bg-primary/10 text-primary'}
        `}>
          {isLocked ? <Lock className="h-3.5 w-3.5" /> : isCompleted ? <CheckCircle className="h-4 w-4" /> : chapter.order_index}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-xs text-foreground line-clamp-2 mb-0.5">
            {chapter.title}
          </h4>
          {chapter.description && (
            <p className="text-[10px] text-muted-foreground line-clamp-2">
              {chapter.description}
            </p>
          )}
        </div>
        
        {!isLocked && (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
        )}
      </div>
      
      {isLocked && (
        <div className="absolute top-1 right-1">
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-500/50 text-amber-600 bg-amber-500/10">
            <Lock className="h-2 w-2 mr-0.5" />
            Pro
          </Badge>
        </div>
      )}
    </button>
  );
}

export default function GuestCourses() {
  const isMobile = useIsMobile();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeVideoData, setActiveVideoData] = useState<any>(null);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [showChapterDialog, setShowChapterDialog] = useState(false);
  
  const { courses: allCourses = [], isLoading: coursesLoading } = useCourses();
  
  // Filter only Class 3-10 courses
  const courses = allCourses.filter(course => 
    course.is_published && 
    course.title.toLowerCase().includes('class') &&
    /class\s*([3-9]|10)/i.test(course.title)
  ).sort((a, b) => a.order_index - b.order_index);
  
  const selectedCourse = courses.find(c => c.id === selectedClass);
  const { chapters = [] } = useChapters(selectedClass || "");
  
  const publishedChapters = chapters.filter(ch => ch.is_published).sort((a, b) => a.order_index - b.order_index);
  
  // First 2 chapters are unlocked
  const unlockedChapterIds = publishedChapters.slice(0, 2).map(ch => ch.id);
  
  // Fetch videos for the selected chapter
  const { data: chapterVideos = [] } = useQuery({
    queryKey: ["guest-chapter-videos", selectedChapter?.id],
    queryFn: async () => {
      if (!selectedChapter?.id) return [];
      const { data, error } = await supabase
        .from("chapter_videos")
        .select("*")
        .eq("chapter_id", selectedChapter.id)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedChapter?.id,
  });
  
  const extractClassNum = (title: string): number => {
    const match = title.match(/class\s*(\d+)/i);
    return match ? parseInt(match[1]) : 0;
  };
  
  const getQuizForChapter = (chapterIndex: number): QuizData | null => {
    const classNum = selectedCourse ? extractClassNum(selectedCourse.title) : 3;
    const quizKey = `class-${classNum}`;
    const quizzes = demoQuizzes[quizKey] || demoQuizzes["class-3"];
    return quizzes.find(q => q.chapterId === chapterIndex + 1) || null;
  };
  
  const currentQuiz = activeQuiz ? 
    Object.values(demoQuizzes).flat().find(q => q.id === activeQuiz) : 
    null;

  const handleVideoComplete = (chapterId: string) => {
    if (!completedVideos.includes(chapterId)) {
      setCompletedVideos([...completedVideos, chapterId]);
    }
  };

  const handleQuizComplete = (quizId: string) => {
    if (!completedQuizzes.includes(quizId)) {
      setCompletedQuizzes([...completedQuizzes, quizId]);
    }
  };

  const extractYouTubeId = (url: string): string => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match?.[1] || "";
  };

  // Video Player View
  if (activeVideo && activeVideoData) {
    const chapter = publishedChapters.find(c => c.id === selectedChapter?.id);
    const videoId = extractYouTubeId(activeVideoData.youtube_url);
    
    return (
      <div className="p-3 sm:p-4 lg:p-6 pb-20 animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (chapter) handleVideoComplete(chapter.id);
            setActiveVideo(null);
            setActiveVideoData(null);
          }}
          className="gap-1.5 mb-3 text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Course
        </Button>
        <h1 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4">
          {activeVideoData.title}
        </h1>
        {videoId ? (
          <KodeIntelPlayer videoId={videoId} title={activeVideoData.title} />
        ) : (
          <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
            <div className="text-center p-6">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Video not available</p>
            </div>
          </div>
        )}
        {activeVideoData.description && (
          <p className="text-sm text-muted-foreground mt-3">{activeVideoData.description}</p>
        )}
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              if (chapter) handleVideoComplete(chapter.id);
              setActiveVideo(null);
              setActiveVideoData(null);
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
          handleQuizComplete(activeQuiz);
        }}
      />
    );
  }

  // Class Selection View
  if (!selectedClass) {
    return (
      <div className="p-4 pb-24 space-y-5 animate-fade-in">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-turquoise/10 to-sunny/10">
          <div className="p-5 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <Badge className="bg-sunny/20 text-sunny border-0 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                1 Day Free Trial
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">
              Start Your Learning Journey!
            </h1>
            <p className="text-sm text-muted-foreground mb-3">
              Select your class to explore 2 free chapters with videos & quizzes
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Video className="h-3.5 w-3.5 text-turquoise" />
                HD Videos
              </span>
              <span className="flex items-center gap-1">
                <Brain className="h-3.5 w-3.5 text-primary" />
                Fun Quizzes
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-sunny" />
                Earn XP
              </span>
            </div>
          </div>
          <img 
            src={studentsLearning} 
            alt="Students Learning" 
            className="w-full h-24 object-cover object-top opacity-60"
          />
        </div>

        {/* Class Selection */}
        <div>
          <h2 className="font-bold text-base mb-3 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Which class are you in?
          </h2>
          
          <div className="grid grid-cols-2 gap-2.5">
            {courses.map(course => {
              const classNum = extractClassNum(course.title);
              return (
                <ClassCard
                  key={course.id}
                  classNum={classNum}
                  title={course.title.replace(/^Class\s*\d+\s*[–-]\s*/i, '')}
                  description={course.description || "Explore AI and coding concepts"}
                  isSelected={selectedClass === course.id}
                  onClick={() => setSelectedClass(course.id)}
                />
              );
            })}
          </div>
          
          {courses.length === 0 && !coursesLoading && (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-gradient-to-br from-turquoise/10 to-turquoise/5 border-turquoise/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-turquoise/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-turquoise" />
              </div>
            </div>
            <h3 className="font-semibold text-xs mb-0.5">2 Free Chapters</h3>
            <p className="text-[10px] text-muted-foreground">Full access to first 2 chapters</p>
          </Card>
          
          <Card className="p-3 bg-gradient-to-br from-sunny/10 to-sunny/5 border-sunny/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sunny/20 flex items-center justify-center">
                <Star className="h-4 w-4 text-sunny" />
              </div>
            </div>
            <h3 className="font-semibold text-xs mb-0.5">No Sign-up Needed</h3>
            <p className="text-[10px] text-muted-foreground">Start learning instantly</p>
          </Card>
        </div>
      </div>
    );
  }

  // Course Content View
  const totalProgress = Math.round(
    ((completedVideos.length + completedQuizzes.length) /
      (unlockedChapterIds.length * 2)) * 100
  );

  return (
    <div className="p-3 sm:p-4 pb-24 space-y-4 animate-fade-in">
      {/* Course Header */}
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedClass(null)}
          className="gap-1 text-xs h-8 px-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Classes
        </Button>
      </div>

      {/* Course Banner */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="relative bg-gradient-to-br from-primary/20 via-turquoise/10 to-transparent p-4">
          <Badge className="mb-2 bg-turquoise/20 text-turquoise border-0 text-xs">
            <Star className="h-2.5 w-2.5 mr-1 fill-current" />
            {selectedCourse ? extractClassNum(selectedCourse.title) : ''} Class
          </Badge>
          <h1 className="text-lg font-bold mb-1">
            {selectedCourse?.title || "Course"}
          </h1>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {selectedCourse?.description}
          </p>
          <div className="flex items-center gap-2">
            <Progress value={totalProgress} className="flex-1 h-2" />
            <span className="text-xs font-medium">{totalProgress}%</span>
          </div>
          
          <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {publishedChapters.length} Chapters
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-amber-500" />
              {publishedChapters.length - 2} Locked
            </span>
          </div>
        </div>
      </Card>

      {/* Chapters Grid */}
      <div>
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Course Content
        </h2>
        
        <div className="grid grid-cols-2 gap-2.5">
          {publishedChapters.map((chapter, index) => {
            const isLocked = !unlockedChapterIds.includes(chapter.id);
            const isCompleted = completedVideos.includes(chapter.id);
            
            return (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                isLocked={isLocked}
                isCompleted={isCompleted}
                onViewDetails={() => {
                  if (!isLocked) {
                    setSelectedChapter({ ...chapter, index });
                    setShowChapterDialog(true);
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Upgrade CTA */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 via-turquoise/10 to-sunny/10 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-0.5">Unlock All Chapters</h3>
            <p className="text-[10px] text-muted-foreground">
              Sign up for a 7-day free trial to access the complete course
            </p>
          </div>
          <Button size="sm" className="shrink-0 text-xs h-8">
            Try Free
          </Button>
        </div>
      </Card>

      {/* Chapter Details Dialog */}
      <Dialog open={showChapterDialog} onOpenChange={setShowChapterDialog}>
        <DialogContent className="max-w-md mx-auto p-0 gap-0 rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-base font-bold">
              {selectedChapter?.title}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedChapter?.description}
            </p>
          </DialogHeader>
          
          <div className="p-4 pt-2 space-y-2.5">
            {/* Video List from Database */}
            {chapterVideos.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5" />
                  Videos ({chapterVideos.length})
                </h4>
                {chapterVideos.map((video: any, idx: number) => (
                  <Button
                    key={video.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-3 h-auto py-2.5"
                    onClick={() => {
                      setActiveVideo(video.id);
                      setActiveVideoData(video);
                      setShowChapterDialog(false);
                    }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      completedVideos.includes(video.id) ? 'bg-emerald-500/20' : 'bg-primary/20'
                    }`}>
                      {completedVideos.includes(video.id) ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <span className="text-xs font-bold text-primary">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm line-clamp-1">{video.title}</div>
                      {video.duration_minutes && (
                        <div className="text-[10px] text-muted-foreground">{video.duration_minutes} min</div>
                      )}
                    </div>
                    <Play className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Button>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No videos available yet</p>
              </div>
            )}

            {/* Take Quiz */}
            {getQuizForChapter(selectedChapter?.index || 0) && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  const quiz = getQuizForChapter(selectedChapter?.index || 0);
                  if (quiz) {
                    setActiveQuiz(quiz.id);
                    setShowChapterDialog(false);
                  }
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  completedQuizzes.includes(getQuizForChapter(selectedChapter?.index || 0)?.id || '') 
                    ? 'bg-emerald-500/20' 
                    : 'bg-sunny/20'
                }`}>
                  {completedQuizzes.includes(getQuizForChapter(selectedChapter?.index || 0)?.id || '') ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <HelpCircle className="h-4 w-4 text-sunny" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">Take Quiz</div>
                  <div className="text-[10px] text-muted-foreground">Test your knowledge</div>
                </div>
                <Zap className="h-4 w-4 text-amber-500" />
              </Button>
            )}

            {/* E-Book */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-3 h-12 opacity-50"
              disabled
            >
              <div className="w-8 h-8 rounded-lg bg-lavender/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-lavender" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">Read E-Book</div>
                <div className="text-[10px] text-muted-foreground">Coming soon</div>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
