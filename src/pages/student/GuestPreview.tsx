import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
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
  Rocket,
  UserPlus,
  Home,
  X,
  ChevronRight,
} from "lucide-react";
import KodeIntelPlayer from "@/components/student/KodeIntelPlayer";
import brainLogo from "@/assets/brain-logo.png";
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

// Class 3 chapter videos (using the real YouTube links)
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

export default function GuestPreview() {
  const navigate = useNavigate();
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
    (guestChapters.filter(c => !c.isLocked).length * 2)) * 100
  );

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match?.[1] || "";
  };

  // Video Player Modal
  if (activeVideo) {
    const chapter = guestChapters.find((c) => c.videoUrl === activeVideo);
    const videoId = extractYouTubeId(activeVideo);
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (chapter) handleVideoComplete(chapter.id);
                setActiveVideo(null);
              }}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Button>
            <Badge className="bg-turquoise/20 text-turquoise border-turquoise/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Guest Preview
            </Badge>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">{chapter?.videoTitle}</h1>
          <KodeIntelPlayer
            videoId={videoId}
            title={chapter?.videoTitle || "Video Lesson"}
            onComplete={() => {
              if (chapter) handleVideoComplete(chapter.id);
            }}
          />
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                if (chapter) handleVideoComplete(chapter.id);
                setActiveVideo(null);
              }}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Mark Complete & Continue
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Quiz Modal
  if (activeQuiz && currentQuiz) {
    const isSubmitted = quizSubmitted[activeQuiz];
    const score = getQuizScore(activeQuiz);

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveQuiz(null)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Button>
            <Badge className="bg-sunny/20 text-sunny border-sunny/30">
              <HelpCircle className="h-3 w-3 mr-1" />
              Quiz Time!
            </Badge>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6 max-w-3xl">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                {currentQuiz.title} Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentQuiz.questions.map((q, qIndex) => (
                <div key={q.id} className="space-y-3">
                  <p className="font-medium text-lg">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="grid gap-2">
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
                          className={`p-4 rounded-xl text-left transition-all border-2 ${
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
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-bold">
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <span>{option}</span>
                            {showResult && isCorrect && (
                              <CheckCircle className="h-5 w-5 ml-auto text-green-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {isSubmitted && (
                    <div className="p-4 bg-primary/10 rounded-xl mt-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {!isSubmitted ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => handleQuizSubmit(activeQuiz)}
                  disabled={Object.keys(quizAnswers).filter((k) =>
                    currentQuiz.questions.some((q) => q.id === k)
                  ).length < currentQuiz.questions.length}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardContent className="py-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {score >= 70 ? "Great Job! 🎉" : "Keep Learning! 💪"}
                    </h3>
                    <p className="text-4xl font-bold text-primary mb-2">{score}%</p>
                    <p className="text-muted-foreground mb-4">
                      You got {currentQuiz.questions.filter((q) => quizAnswers[q.id] === q.correct).length} out of {currentQuiz.questions.length} correct!
                    </p>
                    <Button onClick={() => setActiveQuiz(null)} className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Course
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Main Guest Preview Page
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <Home className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img src={brainLogo} alt="KodeIntel" className="h-8" />
              <span className="font-bold text-foreground font-display hidden sm:block">
                Kode<span className="text-primary">Intel</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-turquoise/20 text-turquoise border-turquoise/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Hello, Guest!
            </Badge>
            <Button
              size="sm"
              className="gap-2 bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate("/student/login")}
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Up Free</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Course Banner */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative">
            <img
              src={courseBannerClass3}
              alt="Class 3 - Thinking & Smart Machines"
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <Badge className="mb-2 bg-turquoise/80 text-white">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Free Preview
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 font-display">
                  Class 3 – Thinking & Smart Machines
                </h1>
                <p className="text-white/80">
                  Explore the amazing world of AI and smart technology!
                </p>
              </div>
            </div>
          </div>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm py-1">
                  <BookOpen className="h-4 w-4 mr-1" />
                  6 Chapters
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  <Video className="h-4 w-4 mr-1" />
                  6 Videos
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  3 Free Quizzes
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <Progress value={totalProgress} className="w-24" />
                <span className="text-sm font-bold">{totalProgress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Banner */}
        <Card className="mb-6 bg-gradient-to-r from-sunny/20 to-coral/20 border-sunny/30">
          <CardContent className="py-4 px-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sunny/20 flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-sunny" />
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    Love what you see? Get full access!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sign up to unlock all chapters, quizzes, and earn badges!
                  </p>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-sunny to-coral text-foreground gap-2"
                onClick={() => navigate("/student/signup")}
              >
                <UserPlus className="h-4 w-4" />
                Sign Up Free
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chapters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              Course Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-3">
              {guestChapters.map((chapter, index) => (
                <AccordionItem
                  key={chapter.id}
                  value={`chapter-${chapter.id}`}
                  className={`border-2 rounded-xl px-4 overflow-hidden ${
                    chapter.isLocked ? "opacity-60 bg-muted/20" : ""
                  }`}
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                          chapter.isLocked
                            ? "bg-muted"
                            : completedVideos.includes(chapter.id)
                            ? "bg-primary/20"
                            : "bg-primary/10"
                        }`}
                      >
                        {chapter.isLocked ? (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        ) : completedVideos.includes(chapter.id) ? (
                          <CheckCircle className="h-6 w-6 text-primary" />
                        ) : (
                          <Star className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            Chapter {index + 1}
                          </span>
                          {chapter.isLocked && (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Sign up to unlock
                            </Badge>
                          )}
                          {!chapter.isLocked && (
                            <Badge className="text-xs bg-turquoise/20 text-turquoise border-turquoise/30">
                              Free
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground">
                          {chapter.title}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {chapter.isLocked ? (
                      <div className="text-center py-8 bg-muted/30 rounded-xl">
                        <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium mb-2">
                          This chapter is locked
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create a free account to unlock all content
                        </p>
                        <Button
                          className="bg-gradient-to-r from-primary to-secondary gap-2"
                          onClick={() => navigate("/student/signup")}
                        >
                          <UserPlus className="h-4 w-4" />
                          Sign Up Free
                        </Button>
                      </div>
                    ) : (
                      <Tabs defaultValue="video" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="video" className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Video
                          </TabsTrigger>
                          <TabsTrigger value="quiz" className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Quiz
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="video" className="mt-0">
                          <button
                            onClick={() => setActiveVideo(chapter.videoUrl)}
                            className="w-full p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all text-left flex items-center gap-4"
                          >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                              <Play className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{chapter.videoTitle}</p>
                              <p className="text-sm text-muted-foreground">
                                {chapter.description}
                              </p>
                            </div>
                            {completedVideos.includes(chapter.id) && (
                              <CheckCircle className="h-6 w-6 text-primary" />
                            )}
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </button>
                        </TabsContent>

                        <TabsContent value="quiz" className="mt-0">
                          {chapter.quizId ? (
                            <button
                              onClick={() => setActiveQuiz(chapter.quizId!)}
                              className="w-full p-4 rounded-xl bg-gradient-to-r from-sunny/10 to-coral/10 hover:from-sunny/20 hover:to-coral/20 transition-all text-left flex items-center gap-4"
                            >
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sunny to-coral flex items-center justify-center shrink-0">
                                <Brain className="h-7 w-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {chapter.title} Quiz
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Test your knowledge!
                                </p>
                              </div>
                              {completedQuizzes.includes(chapter.quizId) && (
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-primary/20 text-primary">
                                    {getQuizScore(chapter.quizId)}%
                                  </Badge>
                                  <CheckCircle className="h-6 w-6 text-primary" />
                                </div>
                              )}
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </button>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <HelpCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                              <p>Quiz coming soon!</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <Card className="mt-6 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
          <CardContent className="py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 font-display">
              Ready to Start Your AI Journey?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create a free account to unlock all courses, earn badges, compete on leaderboards, and track your progress!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-secondary"
                onClick={() => navigate("/student/signup")}
              >
                <UserPlus className="h-5 w-5" />
                Create Free Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/student/login")}
              >
                Already have an account?
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
