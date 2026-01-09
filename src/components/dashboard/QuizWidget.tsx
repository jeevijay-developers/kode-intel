import { useState, useEffect, useRef, useCallback } from "react";
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
  Clock,
  Volume2,
  VolumeX,
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
  category: string;
}

interface QuizWidgetProps {
  className?: string;
  onComplete?: (score: number) => void;
  timerDuration?: number; // in seconds
}

// Comprehensive Class 3 AI & Smart Machines Curriculum Quiz Pool
const quizPool: QuizQuestion[] = [
  // Chapter 1: Smart Things Around Us
  {
    id: "c1-q1",
    question: "Which of these is a SMART device?",
    options: ["Wooden chair", "Smart Speaker", "Regular book", "Pencil"],
    correct: 1,
    explanation: "A smart speaker like Alexa can listen and respond - that's AI!",
    category: "Smart Things",
  },
  {
    id: "c1-q2",
    question: "What helps a smart device 'think'?",
    options: ["Batteries", "AI (Artificial Intelligence)", "Buttons", "Colors"],
    correct: 1,
    explanation: "AI is like a brain for smart devices!",
    category: "Smart Things",
  },
  {
    id: "c1-q3",
    question: "Which is NOT a smart device?",
    options: ["Smart TV", "Wooden spoon", "Smartwatch", "Smart fridge"],
    correct: 1,
    explanation: "A wooden spoon has no technology - it's a regular tool!",
    category: "Smart Things",
  },
  {
    id: "c1-q4",
    question: "What can a smart doorbell do?",
    options: ["Only ring", "Show who's at the door", "Cook food", "Clean house"],
    correct: 1,
    explanation: "Smart doorbells have cameras to show who's visiting!",
    category: "Smart Things",
  },
  
  // Chapter 2: How Machines Help Us
  {
    id: "c2-q1",
    question: "How does a robot vacuum help us?",
    options: ["Cooks food", "Cleans floors", "Plays music", "Tells jokes"],
    correct: 1,
    explanation: "Robot vacuums clean floors automatically!",
    category: "Helpful Machines",
  },
  {
    id: "c2-q2",
    question: "Which animal inspired swimming robots?",
    options: ["Dogs", "Fish", "Birds", "Cats"],
    correct: 1,
    explanation: "Scientists made robots that swim like fish!",
    category: "Helpful Machines",
  },
  {
    id: "c2-q3",
    question: "What does a washing machine do?",
    options: ["Makes food", "Washes clothes", "Plays games", "Waters plants"],
    correct: 1,
    explanation: "Washing machines clean our clothes automatically!",
    category: "Helpful Machines",
  },
  {
    id: "c2-q4",
    question: "How do robots help in factories?",
    options: ["They sleep", "Build products faster", "Eat lunch", "Take breaks"],
    correct: 1,
    explanation: "Factory robots can build things quickly and precisely!",
    category: "Helpful Machines",
  },
  
  // Chapter 3: Smart vs Normal Machines
  {
    id: "c3-q1",
    question: "What makes a smart TV 'smart'?",
    options: ["Big screen", "More buttons", "Connects to internet", "Loud speakers"],
    correct: 2,
    explanation: "Smart TVs connect to the internet for apps and streaming!",
    category: "Smart vs Normal",
  },
  {
    id: "c3-q2",
    question: "What's different about a smart fan?",
    options: ["More blades", "Understands voice commands", "Spins faster", "Uses no power"],
    correct: 1,
    explanation: "Smart fans can understand when you say 'turn on' or 'turn off'!",
    category: "Smart vs Normal",
  },
  {
    id: "c3-q3",
    question: "Can a regular clock connect to WiFi?",
    options: ["Yes, always", "No, only smart clocks can", "Maybe sometimes", "Clocks don't need WiFi"],
    correct: 1,
    explanation: "Regular clocks don't connect to the internet - that's what makes smart clocks special!",
    category: "Smart vs Normal",
  },
  {
    id: "c3-q4",
    question: "What can a smart thermostat learn?",
    options: ["Nothing", "Your temperature preferences", "How to cook", "How to sing"],
    correct: 1,
    explanation: "Smart thermostats learn when you like it warm or cool!",
    category: "Smart vs Normal",
  },
  
  // Chapter 4: AI as a Friendly Helper
  {
    id: "c4-q1",
    question: "Can AI help doctors?",
    options: ["Yes, with diagnosis", "No, never", "Only in movies", "Maybe someday"],
    correct: 0,
    explanation: "AI helps doctors find diseases and suggest treatments!",
    category: "AI Helper",
  },
  {
    id: "c4-q2",
    question: "What does a smart watch do?",
    options: ["Only tells time", "Tracks health & messages", "Nothing special", "Plays games only"],
    correct: 1,
    explanation: "Smart watches track steps, heart rate, and show notifications!",
    category: "AI Helper",
  },
  {
    id: "c4-q3",
    question: "How does GPS help us?",
    options: ["Makes food", "Shows directions", "Plays music", "Cleans rooms"],
    correct: 1,
    explanation: "GPS uses AI to find the best route to any location!",
    category: "AI Helper",
  },
  {
    id: "c4-q4",
    question: "What can AI assistants like Alexa do?",
    options: ["Only play music", "Answer questions & control devices", "Nothing useful", "Only set alarms"],
    correct: 1,
    explanation: "AI assistants can answer questions, play music, control lights, and much more!",
    category: "AI Helper",
  },
  
  // Chapter 5: Smart Things in Daily Life
  {
    id: "c5-q1",
    question: "Which is an example of AI in our home?",
    options: ["Regular lamp", "Voice assistant like Alexa", "Wooden table", "Normal clock"],
    correct: 1,
    explanation: "Voice assistants use AI to understand and help you!",
    category: "Daily Life AI",
  },
  {
    id: "c5-q2",
    question: "What does a smart refrigerator tell you?",
    options: ["Weather only", "When food is running low", "Time only", "Nothing at all"],
    correct: 1,
    explanation: "Smart fridges can track food and remind you what to buy!",
    category: "Daily Life AI",
  },
  {
    id: "c5-q3",
    question: "How do smart lights work?",
    options: ["With matches", "Through apps or voice", "They don't work", "Only with switches"],
    correct: 1,
    explanation: "Smart lights can be controlled with your phone or voice!",
    category: "Daily Life AI",
  },
  {
    id: "c5-q4",
    question: "What makes a phone 'smartphone'?",
    options: ["Bigger size", "Apps and internet", "Louder ringtone", "More colors"],
    correct: 1,
    explanation: "Smartphones have apps, internet, cameras, and AI features!",
    category: "Daily Life AI",
  },
  
  // Chapter 6: Being Safe with Smart Things
  {
    id: "c6-q1",
    question: "Should you share your password with friends?",
    options: ["Yes, always", "No, keep it secret", "Only with best friends", "It doesn't matter"],
    correct: 1,
    explanation: "Passwords should be kept secret to protect your information!",
    category: "Safety",
  },
  {
    id: "c6-q2",
    question: "What should you do before clicking a link?",
    options: ["Click quickly", "Ask a parent or teacher", "Share it first", "Ignore it always"],
    correct: 1,
    explanation: "Always check with an adult before clicking unknown links!",
    category: "Safety",
  },
  {
    id: "c6-q3",
    question: "Is it safe to talk to strangers online?",
    options: ["Yes, always fun", "No, tell an adult first", "Only at night", "Only on weekends"],
    correct: 1,
    explanation: "Never talk to strangers online without telling a trusted adult!",
    category: "Safety",
  },
  {
    id: "c6-q4",
    question: "How long should you use screens each day?",
    options: ["All day", "Limited time with breaks", "Only at night", "Never use screens"],
    correct: 1,
    explanation: "Take regular breaks and limit screen time for healthy eyes and mind!",
    category: "Safety",
  },
  
  // Bonus Questions: Fun AI Facts
  {
    id: "bonus-q1",
    question: "What year was the first robot made?",
    options: ["2020", "1954", "1800", "2010"],
    correct: 1,
    explanation: "The first industrial robot, Unimate, was made in 1954!",
    category: "Fun Facts",
  },
  {
    id: "bonus-q2",
    question: "Can AI create art and music?",
    options: ["No, never", "Yes, AI can be creative!", "Only humans can", "Maybe in the future"],
    correct: 1,
    explanation: "AI can now paint pictures, write music, and even create stories!",
    category: "Fun Facts",
  },
  {
    id: "bonus-q3",
    question: "What is a chatbot?",
    options: ["A dancing robot", "AI that chats with you", "A type of phone", "A video game"],
    correct: 1,
    explanation: "Chatbots are AI programs that can have conversations with people!",
    category: "Fun Facts",
  },
  {
    id: "bonus-q4",
    question: "Can AI recognize faces?",
    options: ["No, only humans can", "Yes, like in phone unlock", "Never", "Only in movies"],
    correct: 1,
    explanation: "AI can recognize faces - that's how your phone unlocks with Face ID!",
    category: "Fun Facts",
  },
];

// Sound effect URLs (using Web Audio API for better performance)
const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return null;
};

const playSound = (type: 'correct' | 'wrong' | 'tick' | 'timeout', isMuted: boolean) => {
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
        // Happy ascending tone
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
      case 'wrong':
        // Sad descending tone
        oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
        oscillator.frequency.setValueAtTime(311.13, audioContext.currentTime + 0.15); // Eb4
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'tick':
        // Quick tick sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
      case 'timeout':
        // Urgent beep
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
    }
  } catch (e) {
    // Audio not supported, fail silently
    console.log('Audio not supported');
  }
};

export function QuizWidget({ className, onComplete, timerDuration = 15 }: QuizWidgetProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(timerDuration);

  // Get a random question that hasn't been used recently
  const getRandomQuestion = useCallback(() => {
    setIsLoading(true);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTimeLeft(timerDuration);
    setIsTimerActive(true);
    lastTickRef.current = timerDuration;
    
    setTimeout(() => {
      // Filter out recently used questions
      let availableQuestions = quizPool.filter(q => !usedQuestions.includes(q.id));
      
      // If all questions used, reset
      if (availableQuestions.length === 0) {
        availableQuestions = quizPool;
        setUsedQuestions([]);
      }
      
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const newQuestion = availableQuestions[randomIndex];
      
      setCurrentQuestion(newQuestion);
      setUsedQuestions(prev => [...prev.slice(-10), newQuestion.id]); // Keep last 10
      setIsLoading(false);
    }, 300);
  }, [timerDuration, usedQuestions]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && !isAnswered) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          // Play tick sound every 5 seconds or when under 5 seconds
          if (newTime <= 5 || (lastTickRef.current - newTime) >= 5) {
            playSound('tick', isMuted);
            lastTickRef.current = newTime;
          }
          return newTime;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else if (timeLeft === 0 && !isAnswered && currentQuestion) {
      // Time's up!
      playSound('timeout', isMuted);
      setIsAnswered(true);
      setIsCorrect(false);
      setStreak(0);
      setIsTimerActive(false);
    }
  }, [isTimerActive, timeLeft, isAnswered, currentQuestion, isMuted]);

  useEffect(() => {
    getRandomQuestion();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (isAnswered || isLoading) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    setIsTimerActive(false);
    const correct = selectedAnswer === currentQuestion.correct;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      playSound('correct', isMuted);
      setStreak((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      onComplete?.(100);
    } else {
      playSound('wrong', isMuted);
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    getRandomQuestion();
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const timerProgress = (timeLeft / timerDuration) * 100;
  const isLowTime = timeLeft <= 5;

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
            : isLowTime && !isAnswered
            ? "bg-gradient-to-br from-coral/10 via-pink/5 to-coral/5 border-coral/30 animate-pulse"
            : "bg-gradient-to-br from-primary/5 via-secondary/5 to-purple/10 border-primary/20 hover:border-primary/40",
          className
        )}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Top bar: Timer + Streak + Sound */}
        <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
          {/* Timer */}
          {!isAnswered && (
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold transition-all",
              isLowTime 
                ? "bg-coral/20 text-coral animate-pulse" 
                : "bg-muted/80 text-muted-foreground"
            )}>
              <Clock className={cn("h-3 w-3", isLowTime && "animate-bounce")} />
              <span>{timeLeft}s</span>
            </div>
          )}
          
          {/* Right side badges */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Streak indicator */}
            {streak > 0 && (
              <Badge className="bg-gradient-to-r from-sunny to-coral text-foreground text-[10px] px-1.5 py-0.5 animate-bounce-gentle">
                <Zap className="h-2.5 w-2.5 mr-0.5" />
                {streak}🔥
              </Badge>
            )}
            
            {/* Mute button */}
            <button
              onClick={toggleMute}
              className="w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
            >
              {isMuted ? (
                <VolumeX className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Volume2 className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Timer progress bar */}
        {!isAnswered && (
          <div className="absolute top-0 left-0 right-0 h-1">
            <div 
              className={cn(
                "h-full transition-all duration-1000 ease-linear",
                isLowTime ? "bg-coral" : "bg-primary"
              )}
              style={{ width: `${timerProgress}%` }}
            />
          </div>
        )}

        <CardContent className="p-3 sm:p-4 lg:p-5 pt-10 relative">
          {/* Header with mascot */}
          <div className="flex items-start gap-3 mb-3 sm:mb-4">
            <div className="relative shrink-0">
              <div className={cn(
                "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden p-1 shadow-lg transition-all duration-300",
                isLowTime && !isAnswered
                  ? "bg-gradient-to-br from-coral/30 to-pink/30 animate-pulse"
                  : "bg-gradient-to-br from-primary/20 to-secondary/20"
              )}>
                <img
                  src={quizBrainMascot}
                  alt="Quiz Mascot"
                  className={cn(
                    "w-full h-full object-cover rounded-xl transition-transform duration-500",
                    isLoading && "animate-pulse",
                    isAnswered && isCorrect && "animate-bounce-gentle",
                    isLowTime && !isAnswered && "animate-wiggle"
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
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 border-primary/30">
                  <Brain className="h-2.5 w-2.5 mr-0.5" />
                  Quick Quiz
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-sunny/10 border-sunny/30 text-sunny">
                  <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                  +25 XP
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-turquoise/10 border-turquoise/30 text-turquoise">
                  {currentQuestion.category}
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
                  {timeLeft === 0 && !isCorrect 
                    ? "Time's up! ⏰" 
                    : isCorrect 
                    ? "Awesome! 🎉" 
                    : "Not quite! 💪"}
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
                className={cn(
                  "flex-1 text-xs sm:text-sm gap-1.5 transition-all",
                  isLowTime
                    ? "bg-gradient-to-r from-coral to-pink hover:opacity-90 animate-pulse"
                    : "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                )}
                onClick={handleSubmit}
                disabled={selectedAnswer === null || isLoading}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isLowTime ? "Quick! Submit!" : "Check Answer"}
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
