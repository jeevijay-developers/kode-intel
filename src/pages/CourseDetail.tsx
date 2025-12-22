import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen,
  GraduationCap,
  Play,
  FileText,
  Clock,
  Users,
  Star,
  ChevronRight,
  Menu,
  Lightbulb,
  Rocket,
  Code,
  Cpu,
  ArrowLeft,
  CheckCircle2,
  Video,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import kodeIntelLogo from "@/assets/kode-intel-logo.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const coursesData: Record<string, {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  level: string;
  levelIcon: typeof Lightbulb;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  thumbnail: string;
  color: string;
  objectives: string[];
  chapters: { title: string; videos: number; quizzes: number; ebooks: number }[];
}> = {
  "introduction-to-ai-for-kids": {
    id: "1",
    slug: "introduction-to-ai-for-kids",
    title: "Introduction to AI for Kids",
    description: "Learn the basics of Artificial Intelligence through fun activities and games.",
    fullDescription: "This beginner-friendly course introduces young learners to the exciting world of Artificial Intelligence. Through interactive activities, games, and hands-on projects, students will discover what AI is, how it works, and how it impacts their daily lives. From smart assistants to recommendation systems, we explore AI in a way that's engaging and easy to understand.",
    level: "Classes 3-4",
    levelIcon: Lightbulb,
    duration: "8 weeks",
    lessons: 24,
    students: 450,
    rating: 4.8,
    thumbnail: "🤖",
    color: "from-primary/20 to-primary/5",
    objectives: [
      "Understand what Artificial Intelligence is",
      "Identify AI in everyday devices and applications",
      "Learn basic concepts of how machines learn",
      "Complete fun AI-related projects and activities",
      "Develop logical thinking skills",
    ],
    chapters: [
      { title: "What is AI?", videos: 3, quizzes: 1, ebooks: 1 },
      { title: "AI All Around Us", videos: 4, quizzes: 2, ebooks: 1 },
      { title: "How Machines Learn", videos: 3, quizzes: 1, ebooks: 1 },
      { title: "Smart Assistants", videos: 4, quizzes: 2, ebooks: 1 },
      { title: "AI and Games", videos: 3, quizzes: 1, ebooks: 1 },
      { title: "Building Simple AI", videos: 4, quizzes: 2, ebooks: 2 },
    ],
  },
  "computational-thinking-basics": {
    id: "2",
    slug: "computational-thinking-basics",
    title: "Computational Thinking Basics",
    description: "Develop problem-solving skills through computational thinking.",
    fullDescription: "Computational thinking is a fundamental skill that helps students solve complex problems by breaking them down into manageable parts. This course teaches the four pillars of computational thinking: decomposition, pattern recognition, abstraction, and algorithm design through engaging activities and real-world examples.",
    level: "Classes 3-4",
    levelIcon: Lightbulb,
    duration: "6 weeks",
    lessons: 18,
    students: 380,
    rating: 4.9,
    thumbnail: "🧠",
    color: "from-blue-500/20 to-blue-500/5",
    objectives: [
      "Master the four pillars of computational thinking",
      "Break down complex problems into smaller parts",
      "Recognize patterns in data and processes",
      "Create step-by-step solutions to problems",
      "Apply computational thinking to everyday situations",
    ],
    chapters: [
      { title: "Introduction to Problem Solving", videos: 3, quizzes: 1, ebooks: 1 },
      { title: "Decomposition", videos: 3, quizzes: 1, ebooks: 1 },
      { title: "Pattern Recognition", videos: 3, quizzes: 2, ebooks: 1 },
      { title: "Abstraction", videos: 3, quizzes: 1, ebooks: 1 },
      { title: "Algorithm Design", videos: 4, quizzes: 2, ebooks: 1 },
    ],
  },
  "pattern-recognition-logic": {
    id: "3",
    slug: "pattern-recognition-logic",
    title: "Pattern Recognition & Logic",
    description: "Master pattern recognition and logical reasoning.",
    fullDescription: "This intermediate course dives deeper into pattern recognition and logical reasoning, essential skills for programming and AI. Students will work with sequences, puzzles, and logical operators to build a strong foundation for advanced concepts.",
    level: "Classes 5-6",
    levelIcon: Rocket,
    duration: "10 weeks",
    lessons: 30,
    students: 320,
    rating: 4.7,
    thumbnail: "🔍",
    color: "from-purple-500/20 to-purple-500/5",
    objectives: [
      "Identify complex patterns in sequences and data",
      "Use logical operators (AND, OR, NOT)",
      "Solve challenging puzzles and brain teasers",
      "Apply logic to programming concepts",
      "Build pattern-based projects",
    ],
    chapters: [
      { title: "Number Patterns", videos: 4, quizzes: 2, ebooks: 1 },
      { title: "Shape Patterns", videos: 3, quizzes: 1, ebooks: 1 },
      { title: "Logical Operators", videos: 5, quizzes: 2, ebooks: 2 },
      { title: "Conditional Logic", videos: 4, quizzes: 2, ebooks: 1 },
      { title: "Complex Patterns", videos: 4, quizzes: 2, ebooks: 1 },
      { title: "Pattern Projects", videos: 5, quizzes: 1, ebooks: 2 },
    ],
  },
  "introduction-to-algorithms": {
    id: "4",
    slug: "introduction-to-algorithms",
    title: "Introduction to Algorithms",
    description: "Discover how algorithms work and create your own solutions.",
    fullDescription: "Algorithms are the heart of computer science. This course introduces students to algorithmic thinking through sorting, searching, and optimization problems. Students will learn to design, analyze, and implement their own algorithms.",
    level: "Classes 5-6",
    levelIcon: Rocket,
    duration: "8 weeks",
    lessons: 24,
    students: 290,
    rating: 4.8,
    thumbnail: "📊",
    color: "from-amber-500/20 to-amber-500/5",
    objectives: [
      "Understand what algorithms are and why they matter",
      "Learn popular sorting algorithms",
      "Master searching techniques",
      "Analyze algorithm efficiency",
      "Create algorithms for real problems",
    ],
    chapters: [
      { title: "What are Algorithms?", videos: 3, quizzes: 1, ebooks: 1 },
      { title: "Sorting Basics", videos: 4, quizzes: 2, ebooks: 1 },
      { title: "Advanced Sorting", videos: 4, quizzes: 2, ebooks: 1 },
      { title: "Searching Algorithms", videos: 4, quizzes: 2, ebooks: 1 },
      { title: "Algorithm Efficiency", videos: 4, quizzes: 1, ebooks: 2 },
    ],
  },
  "data-structures-for-young-coders": {
    id: "5",
    slug: "data-structures-for-young-coders",
    title: "Data Structures for Young Coders",
    description: "Learn about arrays, lists, and trees through interactive examples.",
    fullDescription: "Data structures are fundamental to programming. This course introduces students to essential data structures like arrays, linked lists, stacks, queues, and trees through visual examples and hands-on coding projects.",
    level: "Classes 7-8",
    levelIcon: Code,
    duration: "12 weeks",
    lessons: 36,
    students: 210,
    rating: 4.6,
    thumbnail: "🗂️",
    color: "from-primary/20 to-primary/5",
    objectives: [
      "Understand why data structures matter",
      "Work with arrays and lists",
      "Implement stacks and queues",
      "Explore tree structures",
      "Choose the right data structure for problems",
    ],
    chapters: [
      { title: "Introduction to Data Structures", videos: 4, quizzes: 1, ebooks: 1 },
      { title: "Arrays", videos: 5, quizzes: 2, ebooks: 2 },
      { title: "Linked Lists", videos: 5, quizzes: 2, ebooks: 1 },
      { title: "Stacks & Queues", videos: 6, quizzes: 2, ebooks: 2 },
      { title: "Trees", videos: 6, quizzes: 2, ebooks: 2 },
      { title: "Data Structure Projects", videos: 6, quizzes: 1, ebooks: 2 },
    ],
  },
  "machine-learning-fundamentals": {
    id: "6",
    slug: "machine-learning-fundamentals",
    title: "Machine Learning Fundamentals",
    description: "Understand how machines learn from data.",
    fullDescription: "This course introduces students to the fascinating world of machine learning. Learn how AI systems learn from data, understand different types of ML, and create simple models using beginner-friendly tools.",
    level: "Classes 7-8",
    levelIcon: Code,
    duration: "10 weeks",
    lessons: 30,
    students: 180,
    rating: 4.9,
    thumbnail: "⚙️",
    color: "from-blue-500/20 to-blue-500/5",
    objectives: [
      "Understand what machine learning is",
      "Learn about supervised and unsupervised learning",
      "Work with training data and models",
      "Create simple ML predictions",
      "Evaluate model accuracy",
    ],
    chapters: [
      { title: "What is Machine Learning?", videos: 4, quizzes: 1, ebooks: 1 },
      { title: "Types of ML", videos: 5, quizzes: 2, ebooks: 2 },
      { title: "Training Data", videos: 5, quizzes: 2, ebooks: 1 },
      { title: "Building Models", videos: 6, quizzes: 2, ebooks: 2 },
      { title: "Model Evaluation", videos: 5, quizzes: 2, ebooks: 2 },
    ],
  },
  "ai-in-the-real-world": {
    id: "7",
    slug: "ai-in-the-real-world",
    title: "AI in the Real World",
    description: "Explore how AI is used in healthcare, transportation, and more.",
    fullDescription: "This advanced course explores real-world AI applications across industries. Students will analyze case studies from healthcare, transportation, entertainment, and more, understanding both the benefits and challenges of AI deployment.",
    level: "Classes 9-10",
    levelIcon: Cpu,
    duration: "12 weeks",
    lessons: 36,
    students: 150,
    rating: 4.8,
    thumbnail: "🌍",
    color: "from-purple-500/20 to-purple-500/5",
    objectives: [
      "Explore AI applications in various industries",
      "Analyze real-world case studies",
      "Understand AI ethics and challenges",
      "Evaluate AI impact on society",
      "Propose AI solutions for problems",
    ],
    chapters: [
      { title: "AI in Healthcare", videos: 6, quizzes: 2, ebooks: 2 },
      { title: "AI in Transportation", videos: 5, quizzes: 2, ebooks: 1 },
      { title: "AI in Entertainment", videos: 5, quizzes: 1, ebooks: 2 },
      { title: "AI Ethics", videos: 6, quizzes: 2, ebooks: 2 },
      { title: "Future of AI", videos: 6, quizzes: 2, ebooks: 2 },
      { title: "AI Solutions Project", videos: 5, quizzes: 1, ebooks: 2 },
    ],
  },
  "building-ai-projects": {
    id: "8",
    slug: "building-ai-projects",
    title: "Building AI Projects",
    description: "Apply everything you've learned to build real AI projects.",
    fullDescription: "The capstone course where students apply all their knowledge to build real AI projects. From chatbots to image classifiers, students will work on hands-on projects that demonstrate practical AI skills.",
    level: "Classes 9-10",
    levelIcon: Cpu,
    duration: "14 weeks",
    lessons: 42,
    students: 120,
    rating: 4.9,
    thumbnail: "🚀",
    color: "from-amber-500/20 to-amber-500/5",
    objectives: [
      "Plan and design AI projects",
      "Build chatbots and virtual assistants",
      "Create image classification models",
      "Develop recommendation systems",
      "Present and document projects",
    ],
    chapters: [
      { title: "Project Planning", videos: 5, quizzes: 1, ebooks: 2 },
      { title: "Chatbot Development", videos: 7, quizzes: 2, ebooks: 2 },
      { title: "Image Classification", videos: 8, quizzes: 2, ebooks: 2 },
      { title: "Recommendation Systems", videos: 7, quizzes: 2, ebooks: 2 },
      { title: "Project Refinement", videos: 6, quizzes: 1, ebooks: 2 },
      { title: "Project Presentation", videos: 5, quizzes: 1, ebooks: 2 },
    ],
  },
};

export default function CourseDetail() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
  ];

  const course = slug ? coursesData[slug] : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/courses")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const LevelIcon = course.levelIcon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={kodeIntelLogo} alt="Kode Intel" className="h-8 md:h-10" />
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.href}
                onClick={() => navigate(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate("/student/login")}
              className="gap-2 rounded-full px-6 hidden sm:flex"
            >
              <GraduationCap className="h-4 w-4" />
              Student Login
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate(link.href);
                      }}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors text-left py-2"
                    >
                      {link.label}
                    </button>
                  ))}
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/student/login");
                    }}
                    className="gap-2 rounded-full mt-4"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Student Login
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`pt-24 pb-12 px-4 bg-gradient-to-br ${course.color}`}>
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/courses")}
            className="gap-2 mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LevelIcon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">{course.level}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {course.fullDescription}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  {course.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.students} students
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {course.rating} rating
                </span>
              </div>
              <Button 
                size="lg"
                onClick={() => navigate("/student/login")}
                className="gap-2 rounded-full px-8"
              >
                <GraduationCap className="h-5 w-5" />
                Login to Enroll
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-background/80 backdrop-blur-sm flex items-center justify-center text-8xl md:text-9xl shadow-xl">
                {course.thumbnail}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    What You'll Learn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{objective}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Chapters */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Course Chapters
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {course.chapters.map((chapter, index) => (
                      <AccordionItem key={index} value={`chapter-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                              {index + 1}
                            </span>
                            <span>{chapter.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Video className="h-4 w-4" />
                              {chapter.videos} videos
                            </span>
                            <span className="flex items-center gap-1">
                              <HelpCircle className="h-4 w-4" />
                              {chapter.quizzes} quizzes
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {chapter.ebooks} ebooks
                            </span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">{course.thumbnail}</div>
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.level}</p>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium">{course.lessons}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Chapters</span>
                      <span className="font-medium">{course.chapters.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <Button 
                    className="w-full gap-2 rounded-full"
                    onClick={() => navigate("/student/login")}
                  >
                    <GraduationCap className="h-4 w-4" />
                    Login to Enroll
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Log in with your school credentials to access this course
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Kode Intel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
