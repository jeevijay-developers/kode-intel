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
  Zap,
  Target,
  Shield,
  Clock,
  Trophy,
  Heart,
  ArrowRight,
  BookMarked,
  Monitor,
  Puzzle,
  Gamepad2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import brainLogo from "@/assets/brain-logo.png";
import heroKidsLearning from "@/assets/hero-kids-learning.png";
import robotMascot from "@/assets/robot-mascot.png";
import kidsCoding from "@/assets/kids-coding.png";
import nep2020 from "@/assets/nep-2020.png";
import schoolBuilding from "@/assets/school-building.png";
import man1 from "@/assets/testimonial/man1.png";
import woman2 from "@/assets/testimonial/woman2.png";
import man3 from "@/assets/testimonial/man3.png";
import woman4 from "@/assets/testimonial/woman4.png";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useState, useEffect } from "react";

// Animated counter component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count}{suffix}</span>;
};

// Floating animation component
const FloatingElement = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <div 
    className={`animate-[bounce_3s_ease-in-out_infinite] ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </div>
);

export default function Landing() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const products = [
    {
      name: "Full Pack",
      price: "₹3,499",
      period: "/year",
      popular: true,
      description: "Complete learning experience with everything included",
      features: [
        { icon: Play, text: "Video Lectures (LMS)" },
        { icon: Code, text: "Practice Compiler" },
        { icon: HelpCircle, text: "Interactive Quizzes" },
        { icon: Puzzle, text: "Practice Projects" },
        { icon: Target, text: "Analytics & Progress" },
        { icon: BookMarked, text: "Physical Workbook" },
      ],
      buttonText: "Get Full Pack",
      gradient: "from-primary via-primary/90 to-primary/80",
    },
    {
      name: "Book Only",
      price: "₹999",
      period: "",
      popular: false,
      description: "Physical workbook for offline learning",
      features: [
        { icon: BookMarked, text: "Theory + Worksheets" },
        { icon: FileText, text: "Practice Exercises" },
        { icon: CheckCircle2, text: "Chapter Summaries" },
      ],
      buttonText: "Buy Book",
      gradient: "from-secondary via-secondary/90 to-secondary/80",
    },
  ];

  const benefits = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Learn artificial intelligence concepts through fun, interactive lessons designed for young minds",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Puzzle,
      title: "Computational Thinking",
      description: "Develop problem-solving skills with step-by-step logical thinking exercises",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: Gamepad2,
      title: "Learn by Playing",
      description: "Gamified learning experience with badges, levels, and exciting challenges",
      color: "bg-amber-500/10 text-amber-500",
    },
    {
      icon: Monitor,
      title: "Interactive Compiler",
      description: "Practice coding with our kid-friendly block and text-based compiler",
      color: "bg-emerald-500/10 text-emerald-500",
    },
  ];

  const whyKodeIntel = [
    { icon: Target, title: "NEP 2020 Aligned", description: "Curriculum designed as per National Education Policy guidelines" },
    { icon: Clock, title: "40-Min Sessions", description: "Perfect session duration for maximum engagement and retention" },
    { icon: Trophy, title: "Gamified Learning", description: "Earn badges, unlock levels, and compete with friends" },
    { icon: Shield, title: "Safe & Secure", description: "Child-safe platform with no ads and protected content" },
    { icon: Zap, title: "Fun Activities", description: "Hands-on projects and creative coding challenges" },
    { icon: Heart, title: "Built for Kids", description: "Age-appropriate content designed by education experts" },
  ];

  const courseLevels = [
    { grades: "Classes 3-4", title: "Foundation", description: "Introduction to logical thinking", icon: Lightbulb, color: "from-amber-400 to-orange-500", emoji: "🌟" },
    { grades: "Classes 5-6", title: "Explorer", description: "Algorithms & pattern recognition", icon: Rocket, color: "from-primary to-blue-600", emoji: "🚀" },
    { grades: "Classes 7-8", title: "Builder", description: "Create projects & applications", icon: Code, color: "from-purple-500 to-pink-500", emoji: "🔧" },
    { grades: "Classes 9-10", title: "Innovator", description: "Advanced AI & real-world apps", icon: Cpu, color: "from-emerald-500 to-teal-500", emoji: "💡" },
  ];

  const stats = [
    { value: 1000, suffix: "+", label: "Happy Students", icon: Users },
    { value: 50, suffix: "+", label: "Courses", icon: BookOpen },
    { value: 25, suffix: "+", label: "Partner Schools", icon: Building2 },
    { value: 100, suffix: "%", label: "Fun Guaranteed", icon: Heart },
  ];

  const testimonials = [
    { name: "Mrs. Sharma", role: "Parent of Class 7 Student", text: "My son is so excited about AI now! The videos are engaging and he's learning concepts I never imagined at his age.", avatar: woman2 },
    { name: "Mr. Patel", role: "Parent of Class 5 Student", text: "My daughter looks forward to the quizzes every day. She's developing critical thinking skills while having fun!", avatar: man1 },
    { name: "Mrs. Kumar", role: "Parent of Class 9 Student", text: "The computational thinking curriculum has improved my son's problem-solving abilities across all subjects.", avatar: woman4 },
    { name: "Principal Verma", role: "Delhi Public School", text: "KodeIntel has transformed how we teach technology. The structured curriculum makes implementation seamless.", avatar: man3 },
  ];

  const faqs = [
    { question: "What is KodeIntel?", answer: "KodeIntel is an AI & Computational Thinking platform designed for students from Class 3 to Class 10, aligned with NEP 2020. It offers video lectures, quizzes, a practice compiler, and physical workbooks." },
    { question: "How are the sessions structured?", answer: "Each academic year has 10 working months with 4 sessions per month. Each session is approximately 40 minutes, perfect for young learners' attention spans." },
    { question: "What's the difference between Full Pack and Book Only?", answer: "Full Pack (₹3,499/year) includes video lectures, compiler access, quizzes, projects, analytics, and a physical book. Book Only (₹999) includes just the physical workbook." },
    { question: "Is the compiler suitable for beginners?", answer: "Yes! Lower classes (3-6) use block-based coding similar to Scratch, while higher classes (7-10) progress to text-based Python and Java." },
    { question: "How do schools partner with KodeIntel?", answer: "Schools get special bulk pricing at ₹2,999 per student, dedicated support, centralized analytics, and easy onboarding for all students." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-4">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full text-primary text-sm font-semibold mb-6 animate-pulse">
                <Sparkles className="h-4 w-4" />
                NEP 2020 Aligned • Classes 3rd - 10th
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Building{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary">
                    Thinking Minds
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 2 150 2 198 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
                  </svg>
                </span>
                <br />
                for the <span className="text-primary">AI Age</span> 🚀
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                India's most exciting AI & Computational Thinking curriculum for young learners. 
                Watch videos, solve puzzles, write code, and become a future innovator!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  size="lg"
                  onClick={() => navigate("/student/login")}
                  className="gap-2 rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-primary/90"
                >
                  Start Learning Free
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
                  className="gap-2 rounded-full px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5"
                >
                  Explore Courses
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex -space-x-3">
                  {[man1, woman2, man3, woman4].map((avatar, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-3 border-background overflow-hidden shadow-md hover:scale-110 transition-transform">
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm border-3 border-background">
                    +1K
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-2 font-bold text-foreground">4.9</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Loved by 1000+ students & parents</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className={`relative hidden lg:block transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-500/20 to-amber-500/30 rounded-3xl blur-3xl scale-110" />
              
              {/* Main Image */}
              <img src={heroKidsLearning} alt="Kids learning AI" className="relative z-10 w-full rounded-3xl shadow-2xl" />
              
              {/* Floating Cards */}
              <FloatingElement delay={0} className="absolute -top-4 -right-4 z-20">
                <div className="bg-card rounded-2xl shadow-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Quiz Completed!</p>
                      <p className="text-sm text-muted-foreground">Score: 95% 🎉</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>
              
              <FloatingElement delay={1} className="absolute -bottom-4 -left-4 z-20">
                <div className="bg-card rounded-2xl shadow-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">New Badge! 🏆</p>
                      <p className="text-sm text-muted-foreground">AI Explorer Unlocked</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement delay={0.5} className="absolute top-1/2 -right-8 z-20">
                <div className="bg-card rounded-2xl shadow-xl p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <Code className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Coding Level 5</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-2 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary via-primary/95 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2di00aC00djRoNHptMC02aC00di00aDR2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-primary-foreground/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Why Choose KodeIntel?
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Learning Made <span className="text-primary">Fun & Effective</span> ✨
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our unique approach combines AI education with gamification to create an unforgettable learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 overflow-hidden">
                <CardContent className="pt-8 pb-6 text-center relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                  <div className={`w-16 h-16 rounded-2xl ${benefit.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                    <benefit.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Robot Mascot + Why KodeIntel Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Robot Mascot */}
            <div className="relative flex justify-center">
              <FloatingElement className="relative">
                <img src={robotMascot} alt="KodeIntel Robot Mascot" className="w-64 md:w-80 drop-shadow-2xl" />
              </FloatingElement>
              
              {/* Floating icons around mascot */}
              <div className="absolute top-0 left-1/4 animate-bounce" style={{ animationDelay: "0.2s" }}>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <div className="absolute bottom-1/4 right-0 animate-bounce" style={{ animationDelay: "0.5s" }}>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Code className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: "0.8s" }}>
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>

            {/* Why KodeIntel */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
                <Brain className="h-4 w-4" />
                Meet Your AI Buddy!
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Kids <span className="text-primary">Love</span> KodeIntel 💙
              </h2>
              
              <div className="grid gap-4">
                {whyKodeIntel.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-card hover:bg-primary/5 transition-colors border border-border hover:border-primary/20">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Levels Section */}
      <section id="courses" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <GraduationCap className="h-4 w-4" />
              Course Levels
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Courses for <span className="text-primary">Every Class</span> 📚
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Age-appropriate curriculum that grows with your child's learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseLevels.map((level, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0">
                <div className={`h-2 bg-gradient-to-r ${level.color}`} />
                <CardContent className="pt-8 pb-6">
                  <div className="text-4xl mb-4">{level.emoji}</div>
                  <span className="text-sm font-semibold text-muted-foreground">{level.grades}</span>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{level.title}</h3>
                  <p className="text-muted-foreground mb-6">{level.description}</p>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Curriculum
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NEP 2020 Alignment Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
                <Shield className="h-4 w-4" />
                NEP 2020 Aligned
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Aligned with India's <span className="text-primary">National Education Policy</span> 🇮🇳
              </h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Our curriculum is carefully designed following NEP 2020 guidelines, emphasizing computational thinking, 
                coding, and AI literacy from an early age. We prepare students for the digital future while building 
                strong foundational skills.
              </p>
              
              <div className="space-y-4">
                {[
                  "Multidisciplinary learning approach",
                  "Experiential and activity-based learning",
                  "Focus on critical thinking & problem solving",
                  "Technology integration in education",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-amber-500/20 rounded-3xl blur-2xl" />
              <img src={nep2020} alt="NEP 2020 Aligned" className="relative z-10 w-full rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Choose Your Plan
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Simple, <span className="text-primary">Transparent</span> Pricing 💰
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              One year of unlimited learning with everything included
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
            {products.map((product, index) => (
              <Card key={index} className={`flex-1 relative overflow-hidden ${product.popular ? 'border-2 border-primary shadow-2xl scale-105' : 'border-2 border-border'}`}>
                {product.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-foreground">{product.price}</span>
                    <span className="text-muted-foreground">{product.period}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    {product.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <feature.icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button className={`w-full py-6 text-lg font-semibold ${product.popular ? 'bg-gradient-to-r from-primary to-primary/90' : ''}`} variant={product.popular ? 'default' : 'outline'}>
                    {product.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section id="schools" className="py-20 px-4 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl blur-2xl" />
                <img src={schoolBuilding} alt="Partner Schools" className="relative z-10 w-full rounded-2xl shadow-xl" />
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
                <Building2 className="h-4 w-4" />
                For Schools
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Partner with <span className="text-primary">KodeIntel</span> 🏫
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Join 25+ schools across India who have transformed their technology education with KodeIntel. 
                Get special bulk pricing and dedicated support for your institution.
              </p>
              
              <div className="bg-card rounded-2xl p-6 border border-border mb-8">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-primary">₹2,999</span>
                  <span className="text-muted-foreground">per student/year</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Special bulk pricing for schools</p>
                <div className="grid grid-cols-2 gap-3">
                  {["Bulk Onboarding", "Central Analytics", "Dedicated Support", "Custom Reports"].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold">
                Partner With Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <Heart className="h-4 w-4" />
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              What Parents & Schools <span className="text-primary">Say</span> 💬
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Compiler Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
                <Code className="h-4 w-4" />
                Practice Ground
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Code Like a <span className="text-primary">Pro</span> 💻
              </h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Our kid-friendly compiler makes coding fun! Start with drag-and-drop blocks for younger learners, 
                then progress to text-based Python and Java for advanced students.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: Puzzle, text: "Block-based coding for Classes 3-6" },
                  { icon: Code, text: "Python & Java for Classes 7-10" },
                  { icon: Gamepad2, text: "Fun characters and animations" },
                  { icon: Trophy, text: "Earn rewards as you code" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <Button size="lg" onClick={() => navigate("/student/compiler")} className="rounded-full px-8 py-6 text-lg font-semibold">
                Try Compiler
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-primary/20 rounded-3xl blur-2xl" />
              <img src={kidsCoding} alt="Kids Coding" className="relative z-10 w-full rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              <HelpCircle className="h-4 w-4" />
              FAQs
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked <span className="text-primary">Questions</span> ❓
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-xl px-6 data-[state=open]:bg-primary/5">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary via-primary/95 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2di00aC00djRoNHptMC02aC00di00aDR2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="container mx-auto text-center relative z-10">
          <FloatingElement>
            <img src={robotMascot} alt="Robot Mascot" className="w-24 h-24 mx-auto mb-6" />
          </FloatingElement>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Start Your AI Journey? 🚀
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of young learners who are building the skills for tomorrow, today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/student/login")} className="rounded-full px-8 py-6 text-lg font-semibold">
              Start Learning Free
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-secondary text-secondary-foreground">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src={brainLogo} alt="KodeIntel" className="h-10" />
                <span className="text-xl font-bold">KodeIntel</span>
              </div>
              <p className="text-secondary-foreground/80 mb-6">
                Building Thinking Minds for the AI Age. India's most engaging AI & Computational Thinking platform for Classes 3-10.
              </p>
              <div className="flex gap-4">
                {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                    <span className="sr-only">{social}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {["Home", "Courses", "For Schools", "About Us", "Contact"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                {["Blog", "FAQs", "Privacy Policy", "Terms of Service", "Refund Policy"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-secondary-foreground/80">hello@kodeintel.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-secondary-foreground/80">+91 98765 43210</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-secondary-foreground/80">Gurugram, Haryana, India</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-foreground/20 pt-8 text-center">
            <p className="text-secondary-foreground/60">
              © 2025 KodeIntel. All rights reserved. Made with ❤️ in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
