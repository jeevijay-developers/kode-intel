import { useState } from "react";
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
} from "lucide-react";
import KodeIntelPlayer from "@/components/student/KodeIntelPlayer";
import courseBannerClass3 from "@/assets/course-banner-class3.png";

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

  // Quiz View
  if (activeQuiz && currentQuiz) {
    const isSubmitted = quizSubmitted[activeQuiz];
    const score = getQuizScore(activeQuiz);

    return (
      <div className="p-2 sm:p-4 lg:p-6 max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveQuiz(null)}
          className="gap-1.5 mb-3 text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Course
        </Button>

        <Card>
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              {currentQuiz.title} Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6 pt-0">
            {currentQuiz.questions.map((q, qIndex) => (
              <div key={q.id} className="space-y-2 sm:space-y-3">
                <p className="font-medium text-xs sm:text-sm lg:text-base">
                  {qIndex + 1}. {q.question}
                </p>
                <div className="grid gap-1.5 sm:gap-2">
                  {q.options.map((option, oIndex) => {
                    const isSelected = quizAnswers[q.id] === oIndex;
                    const isCorrect = q.correct === oIndex;
                    const showResult = isSubmitted;

                    return (
                      <button
                        key={oIndex}
                        onClick={() => {
                          if (!isSubmitted) {
                            setQuizAnswers({ ...quizAnswers, [q.id]: oIndex });
                          }
                        }}
                        className={`p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl text-left transition-all border-2 ${
                          showResult
                            ? isCorrect
                              ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300"
                              : isSelected
                              ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300"
                              : "bg-muted/50 border-transparent"
                            : isSelected
                            ? "bg-primary/20 border-primary"
                            : "bg-muted/50 border-transparent hover:bg-muted"
                        }`}
                        disabled={isSubmitted}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full bg-background flex items-center justify-center text-[10px] sm:text-xs lg:text-sm font-bold shrink-0">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span className="text-[11px] sm:text-xs lg:text-sm">{option}</span>
                          {showResult && isCorrect && (
                            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ml-auto text-green-500 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {isSubmitted && (
                  <div className="p-2 sm:p-3 lg:p-4 bg-primary/10 rounded-lg sm:rounded-xl mt-2">
                    <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {!isSubmitted ? (
              <Button
                size="sm"
                className="w-full text-xs sm:text-sm"
                onClick={() => handleQuizSubmit(activeQuiz)}
                disabled={
                  Object.keys(quizAnswers).filter((k) =>
                    currentQuiz.questions.some((q) => q.id === k)
                  ).length < currentQuiz.questions.length
                }
              >
                Submit Quiz
              </Button>
            ) : (
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="py-4 sm:py-6 text-center px-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Trophy className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1">
                    {score >= 70 ? "Great Job! 🎉" : "Keep Learning! 💪"}
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1">
                    {score}%
                  </p>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mb-3">
                    {currentQuiz.questions.filter((q) => quizAnswers[q.id] === q.correct).length}/
                    {currentQuiz.questions.length} correct!
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setActiveQuiz(null)}
                    className="gap-1.5 text-xs sm:text-sm"
                  >
                    <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Back to Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Course View
  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
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
