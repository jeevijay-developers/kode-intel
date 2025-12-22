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
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Play,
      title: "Video Lessons",
      description: "Watch high-quality video lectures from expert instructors",
    },
    {
      icon: FileText,
      title: "Study Materials",
      description: "Access comprehensive ebooks and study resources",
    },
    {
      icon: HelpCircle,
      title: "Interactive Quizzes",
      description: "Test your knowledge with engaging quizzes and assessments",
    },
    {
      icon: Award,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress tracking",
    },
  ];

  const stats = [
    { icon: Users, value: "1000+", label: "Active Students" },
    { icon: BookOpen, value: "50+", label: "Courses" },
    { icon: Building2, value: "25+", label: "Schools" },
    { icon: GraduationCap, value: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">EduLearn LMS</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/student/login")}>
              Student Login
            </Button>
            <Button onClick={() => navigate("/auth")}>Admin Login</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Learn Without Limits
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access high-quality courses with video lessons, comprehensive study materials, and
            interactive quizzes. Start your learning journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/student/login")} className="gap-2">
              Get Started
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Admin Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
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
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Our platform provides all the tools and resources you need for effective learning
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of students who are already advancing their education with our platform.
          </p>
          <Button size="lg" onClick={() => navigate("/student/login")}>
            Login to Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">EduLearn LMS</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} EduLearn LMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
