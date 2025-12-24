import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useState } from "react";
import kodeIntelLogo from "@/assets/kode-intel-logo.png";

export default function PublicCourses() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
  ];

  const courses = [
    {
      id: "1",
      slug: "introduction-to-ai-for-kids",
      title: "Introduction to AI for Kids",
      description:
        "Learn the basics of Artificial Intelligence through fun activities and games. Understand what AI is and how it's used in everyday life.",
      level: "Classes 3-4",
      levelIcon: Lightbulb,
      duration: "8 weeks",
      lessons: 24,
      students: 450,
      rating: 4.8,
      thumbnail: "🤖",
      color: "from-primary/20 to-primary/5",
    },
    {
      id: "2",
      slug: "computational-thinking-basics",
      title: "Computational Thinking Basics",
      description:
        "Develop problem-solving skills through computational thinking. Learn to break down complex problems into simple steps.",
      level: "Classes 3-4",
      levelIcon: Lightbulb,
      duration: "6 weeks",
      lessons: 18,
      students: 380,
      rating: 4.9,
      thumbnail: "🧠",
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      id: "3",
      slug: "pattern-recognition-logic",
      title: "Pattern Recognition & Logic",
      description:
        "Master pattern recognition and logical reasoning. Build a strong foundation for advanced programming concepts.",
      level: "Classes 5-6",
      levelIcon: Rocket,
      duration: "10 weeks",
      lessons: 30,
      students: 320,
      rating: 4.7,
      thumbnail: "🔍",
      color: "from-purple-500/20 to-purple-500/5",
    },
    {
      id: "4",
      slug: "introduction-to-algorithms",
      title: "Introduction to Algorithms",
      description:
        "Discover how algorithms work and create your own step-by-step solutions. Learn sorting, searching, and more!",
      level: "Classes 5-6",
      levelIcon: Rocket,
      duration: "8 weeks",
      lessons: 24,
      students: 290,
      rating: 4.8,
      thumbnail: "📊",
      color: "from-amber-500/20 to-amber-500/5",
    },
    {
      id: "5",
      slug: "data-structures-for-young-coders",
      title: "Data Structures for Young Coders",
      description:
        "Learn about arrays, lists, and trees through interactive examples. Build projects that use real data structures.",
      level: "Classes 7-8",
      levelIcon: Code,
      duration: "12 weeks",
      lessons: 36,
      students: 210,
      rating: 4.6,
      thumbnail: "🗂️",
      color: "from-primary/20 to-primary/5",
    },
    {
      id: "6",
      slug: "machine-learning-fundamentals",
      title: "Machine Learning Fundamentals",
      description:
        "Understand how machines learn from data. Create simple ML models and see AI in action!",
      level: "Classes 7-8",
      levelIcon: Code,
      duration: "10 weeks",
      lessons: 30,
      students: 180,
      rating: 4.9,
      thumbnail: "⚙️",
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      id: "7",
      slug: "ai-in-the-real-world",
      title: "AI in the Real World",
      description:
        "Explore how AI is used in healthcare, transportation, entertainment, and more. Analyze real case studies.",
      level: "Classes 9-10",
      levelIcon: Cpu,
      duration: "12 weeks",
      lessons: 36,
      students: 150,
      rating: 4.8,
      thumbnail: "🌍",
      color: "from-purple-500/20 to-purple-500/5",
    },
    {
      id: "8",
      slug: "building-ai-projects",
      title: "Building AI Projects",
      description:
        "Apply everything you've learned to build real AI projects. Create chatbots, image classifiers, and more!",
      level: "Classes 9-10",
      levelIcon: Cpu,
      duration: "14 weeks",
      lessons: 42,
      students: 120,
      rating: 4.9,
      thumbnail: "🚀",
      color: "from-amber-500/20 to-amber-500/5",
    },
  ];

  const levelFilters = [
    { label: "All Levels", value: "all" },
    { label: "Classes 3-4", value: "3-4" },
    { label: "Classes 5-6", value: "5-6" },
    { label: "Classes 7-8", value: "7-8" },
    { label: "Classes 9-10", value: "9-10" },
  ];

  const [selectedLevel, setSelectedLevel] = useState("all");

  const filteredCourses =
    selectedLevel === "all"
      ? courses
      : courses.filter((course) => course.level.includes(selectedLevel));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={kodeIntelLogo} alt="Kode Intel" className="h-8 md:h-10" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`text-muted-foreground hover:text-foreground transition-colors ${
                  link.href === "/courses" ? "text-foreground font-medium" : ""
                }`}
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
              Login
            </Button>

            {/* Mobile Menu */}
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
                    Login
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2 mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Our Courses 📚
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our comprehensive curriculum designed to teach AI and
              Computational Thinking to students from Class 3 to Class 10. Each
              course is packed with videos, ebooks, and fun quizzes!
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2">
            {levelFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedLevel === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(filter.value)}
                className="rounded-full"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                onClick={() => navigate(`/course/${course.slug}`)}
              >
                <div
                  className={`h-32 bg-gradient-to-br ${course.color} flex items-center justify-center text-6xl`}
                >
                  {course.thumbnail}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <course.levelIcon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">
                        {course.rating}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.students} students
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Start Learning? 🎉
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Log in with your school credentials to access all your assigned
            courses and start your AI learning journey!
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/student/login")}
            className="gap-2 rounded-full px-8"
          >
            <GraduationCap className="h-5 w-5" />
            Login
            <ChevronRight className="h-5 w-5" />
          </Button>
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
