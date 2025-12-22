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
  Sparkles,
  CheckCircle2,
  Star,
  Rocket,
  Lightbulb,
  Code,
  Cpu,
  Monitor,
  Smartphone,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Landing() {
  const navigate = useNavigate();

  const steps = [
    {
      step: "01",
      icon: GraduationCap,
      title: "Login with School Credentials",
      description: "Use the username and password provided by your teacher",
    },
    {
      step: "02",
      icon: BookOpen,
      title: "Access Your Courses",
      description: "Find courses assigned to your class level",
    },
    {
      step: "03",
      icon: Play,
      title: "Watch & Learn",
      description: "Enjoy fun video lessons and interactive content",
    },
    {
      step: "04",
      icon: Award,
      title: "Earn Achievements",
      description: "Complete quizzes and collect badges",
    },
  ];

  const features = [
    {
      icon: Play,
      title: "Video Lessons",
      description: "Watch fun video lectures made for young learners",
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: FileText,
      title: "Digital Books",
      description: "Read colorful ebooks and study materials",
      color: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      icon: HelpCircle,
      title: "Fun Quizzes",
      description: "Test your skills with exciting quizzes and games",
      color: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      icon: Award,
      title: "Earn Badges",
      description: "Collect badges as you complete your learning journey",
      color: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
  ];

  const courseLevels = [
    {
      grades: "Classes 3-4",
      title: "Foundation Level",
      description: "Introduction to logical thinking and basic problem solving",
      icon: Lightbulb,
      bgColor: "bg-gradient-to-br from-primary/20 to-primary/5",
    },
    {
      grades: "Classes 5-6",
      title: "Explorer Level",
      description: "Dive deeper into algorithms and pattern recognition",
      icon: Rocket,
      bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-500/5",
    },
    {
      grades: "Classes 7-8",
      title: "Builder Level",
      description: "Create projects using computational thinking concepts",
      icon: Code,
      bgColor: "bg-gradient-to-br from-purple-500/20 to-purple-500/5",
    },
    {
      grades: "Classes 9-10",
      title: "Innovator Level",
      description: "Advanced AI concepts and real-world applications",
      icon: Cpu,
      bgColor: "bg-gradient-to-br from-amber-500/20 to-amber-500/5",
    },
  ];

  const stats = [
    { icon: Users, value: "1000+", label: "Happy Students" },
    { icon: BookOpen, value: "50+", label: "Courses" },
    { icon: Building2, value: "25+", label: "Schools" },
    { icon: Brain, value: "100%", label: "Fun Learning" },
  ];

  const testimonials = [
    {
      name: "Aryan S.",
      grade: "Class 7",
      text: "The videos are so fun! I learned how AI works in just one week.",
      avatar: "A",
    },
    {
      name: "Priya M.",
      grade: "Class 5",
      text: "I love the quizzes! They make learning feel like playing games.",
      avatar: "P",
    },
    {
      name: "Rahul K.",
      grade: "Class 9",
      text: "The computational thinking concepts helped me in other subjects too!",
      avatar: "R",
    },
  ];

  const faqs = [
    {
      question: "How do I get my login credentials?",
      answer: "Your school teacher or administrator will provide you with a username and password. If you haven't received them, please contact your school.",
    },
    {
      question: "What classes is this curriculum designed for?",
      answer: "Our AI & Computational Thinking curriculum is designed for students from Class 3 to Class 10, with age-appropriate content for each level.",
    },
    {
      question: "Can I access the courses on my mobile phone?",
      answer: "Yes! Our platform is mobile-friendly. You can learn from any device - phone, tablet, or computer.",
    },
    {
      question: "What if I forget my password?",
      answer: "You can change your password from your profile settings. If you can't login, contact your teacher for a password reset.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LearnAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#courses" className="text-muted-foreground hover:text-foreground transition-colors">Courses</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <Button 
            onClick={() => navigate("/student/login")}
            className="gap-2 rounded-full px-6"
          >
            <GraduationCap className="h-4 w-4" />
            Student Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                For Classes 3rd - 10th
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Learn <span className="text-primary">AI</span> & Computational Thinking 🚀
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Fun and exciting courses designed for young minds. Watch videos, read books, 
                take quizzes, and become an AI champion!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/student/login")} 
                  className="gap-2 rounded-full px-8"
                >
                  Start Learning
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="gap-2 rounded-full px-8"
                >
                  Explore Features
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['🧒', '👧', '👦', '👩'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-lg">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">1000+ Students Learning</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-6 h-48 flex items-center justify-center">
                    <Brain className="h-20 w-20 text-primary" />
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-3xl p-6 h-32 flex items-center justify-center">
                    <Code className="h-12 w-12 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-3xl p-6 h-32 flex items-center justify-center">
                    <Lightbulb className="h-12 w-12 text-purple-500" />
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-3xl p-6 h-48 flex items-center justify-center">
                    <Rocket className="h-20 w-20 text-amber-500" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-lg p-4 border border-border animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Quiz Completed!</p>
                    <p className="text-xs text-muted-foreground">Score: 95%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              A Simple and Smart Way to Learn
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in just a few easy steps and begin your AI learning journey today!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                <CardContent className="pt-6">
                  <span className="absolute top-4 right-4 text-5xl font-bold text-muted/50">{step.step}</span>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Course Levels Section */}
      <section id="courses" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4" />
              Course Levels
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Courses for Every Level
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Age-appropriate curriculum designed to grow with your learning journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseLevels.map((level, index) => (
              <Card key={index} className={`${level.bgColor} border-0 hover:shadow-lg transition-all hover:-translate-y-1`}>
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-background/80 flex items-center justify-center mb-4 shadow-sm">
                    <level.icon className="h-7 w-7 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{level.grades}</span>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{level.title}</h3>
                  <p className="text-muted-foreground text-sm">{level.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learn Anywhere Banner */}
      <section className="py-20 px-4 bg-foreground text-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 rounded-full text-background/80 text-sm font-medium mb-6">
                <Smartphone className="h-4 w-4" />
                Mobile Friendly
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Learn Anytime, Anywhere 📱
              </h2>
              <p className="text-background/70 mb-8 max-w-lg">
                Access your courses from any device. Our platform is designed to work perfectly on phones, tablets, and computers.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Mobile Responsive</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Offline Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Progress Sync</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-background/10 rounded-[3rem] border-4 border-background/20 p-4">
                  <div className="w-full h-full bg-background rounded-[2.5rem] flex items-center justify-center">
                    <div className="text-center p-6">
                      <Monitor className="h-16 w-16 text-primary mx-auto mb-4" />
                      <p className="text-foreground font-medium">Learn on any device!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Learn 🎁
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All the tools and resources to become an AI and technology superstar!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                <CardContent className="pt-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-4 mx-auto`}>
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Students Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.grade}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-xl border px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Journey? 🌟</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
              Your teacher has given you a username and password. Use them to login and start your adventure!
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/student/login")}
              className="rounded-full px-8 gap-2"
            >
              <GraduationCap className="h-5 w-5" />
              Login Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-foreground text-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">LearnAI</span>
              </div>
              <p className="text-background/70 max-w-sm">
                Empowering young minds with AI and Computational Thinking skills for the future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
                <li><a href="#courses" className="hover:text-background transition-colors">Courses</a></li>
                <li><a href="#faq" className="hover:text-background transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Contact School</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/70 text-sm">
              © {new Date().getFullYear()} AI & Computational Thinking Curriculum. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
