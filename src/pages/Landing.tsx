import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  Play,
  FileText,
  HelpCircle,
  ChevronRight,
  Users,
  Building2,
  Award,
  Brain,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Play,
      title: "Video Lessons",
      description: "Watch fun video lectures made for young learners",
    },
    {
      icon: FileText,
      title: "Digital Books",
      description: "Read colorful ebooks and study materials",
    },
    {
      icon: HelpCircle,
      title: "Fun Quizzes",
      description: "Test your skills with exciting quizzes and games",
    },
    {
      icon: Award,
      title: "Earn Badges",
      description: "Collect badges as you complete your learning journey",
    },
  ];

  const stats = [
    { icon: Users, value: "1000+", label: "Happy Students" },
    { icon: BookOpen, value: "50+", label: "Courses" },
    { icon: Building2, value: "25+", label: "Schools" },
    { icon: Brain, value: "100%", label: "Fun Learning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AI & CT Learning</span>
          </div>
          <Button 
            size="lg" 
            onClick={() => navigate("/student/login")}
            className="gap-2"
          >
            <GraduationCap className="h-5 w-5" />
            Student Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Classes 3rd - 10th
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Learn AI & Computational Thinking
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Fun and exciting courses designed for young minds. Watch videos, read books, 
            take quizzes, and become an AI champion! 🚀
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/student/login")} 
            className="gap-2 text-lg px-8 py-6"
          >
            Start Learning
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">
            What You'll Get 🎁
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Everything you need to become an AI and technology superstar!
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow hover:scale-105 duration-200">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Begin? 🌟</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Your teacher has given you a username and password. Use them to login and start your adventure!
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/student/login")}
            className="text-lg px-8 py-6 gap-2"
          >
            <GraduationCap className="h-5 w-5" />
            Login Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">AI & CT Learning</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AI & Computational Thinking Curriculum. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
