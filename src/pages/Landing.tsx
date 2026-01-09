import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  TrendingUp,
  BadgeCheck,
  Layers,
  CirclePlay,
  FileQuestion,
  Blocks,
} from "lucide-react";
import heroStudentCoding from "@/assets/hero-student-coding.png";
import mascotKodi from "@/assets/mascot-kodi.png";
import schoolPartnership from "@/assets/school-partnership.png";
import compilerPreview from "@/assets/compiler-preview.png";
import aiBrainNetwork from "@/assets/ai-brain-network.png";
import man1 from "@/assets/testimonial/man1.png";
import woman2 from "@/assets/testimonial/woman2.png";
import man3 from "@/assets/testimonial/man3.png";
import woman4 from "@/assets/testimonial/woman4.png";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useState, useEffect, useRef } from "react";

// Animated counter component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);
  
  return <div ref={ref}><span>{count}{suffix}</span></div>;
};

// Floating animation component
const FloatingElement = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <div 
    className={`animate-float ${className}`}
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
        { icon: CirclePlay, text: "Video Lectures (LMS)" },
        { icon: Code, text: "Practice Compiler" },
        { icon: FileQuestion, text: "Interactive Quizzes" },
        { icon: Blocks, text: "Practice Projects" },
        { icon: TrendingUp, text: "Analytics & Progress" },
        { icon: BookMarked, text: "Physical Workbook" },
      ],
      buttonText: "Get Full Pack",
      gradient: "gradient-primary",
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
      gradient: "bg-secondary",
    },
  ];

  const benefits = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Learn artificial intelligence concepts through fun, interactive lessons designed for young minds",
      gradient: "from-primary to-primary/70",
    },
    {
      icon: Puzzle,
      title: "Computational Thinking",
      description: "Develop problem-solving skills with step-by-step logical thinking exercises",
      gradient: "from-secondary to-secondary/70",
    },
    {
      icon: Gamepad2,
      title: "Learn by Playing",
      description: "Gamified learning experience with badges, levels, and exciting challenges",
      gradient: "from-accent to-sunny",
    },
    {
      icon: Monitor,
      title: "Interactive Compiler",
      description: "Practice coding with our kid-friendly block and text-based compiler",
      gradient: "from-turquoise to-lime",
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
    { grades: "Classes 3-4", title: "Foundation", description: "Introduction to logical thinking", icon: Lightbulb, gradient: "from-sunny to-coral" },
    { grades: "Classes 5-6", title: "Explorer", description: "Algorithms & pattern recognition", icon: Rocket, gradient: "from-primary to-secondary" },
    { grades: "Classes 7-8", title: "Builder", description: "Create projects & applications", icon: Code, gradient: "from-secondary to-pink" },
    { grades: "Classes 9-10", title: "Innovator", description: "Advanced AI & real-world apps", icon: Cpu, gradient: "from-turquoise to-lime" },
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

  const howItWorks = [
    { step: 1, title: "Sign Up", description: "Create your account in seconds", icon: Users },
    { step: 2, title: "Choose Class", description: "Select your grade level", icon: GraduationCap },
    { step: 3, title: "Watch & Learn", description: "Enjoy interactive video lessons", icon: Play },
    { step: 4, title: "Practice", description: "Code in our fun compiler", icon: Code },
    { step: 5, title: "Get Certified", description: "Earn badges and certificates", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 right-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-turquoise/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-12 px-4">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-6">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span className="text-foreground">NEP 2020 Aligned</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Classes 3rd - 10th</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight font-display">
                Building{" "}
                <span className="text-gradient-primary">
                  Thinking Minds
                </span>
                <br />
                for the <span className="text-primary">AI Age</span>
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
                  className="gap-2 rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 btn-glow"
                >
                  <Rocket className="h-5 w-5" />
                  Start Learning Free
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/courses")}
                  className="gap-2 rounded-full px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5"
                >
                  <BookOpen className="h-5 w-5" />
                  Explore Courses
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex -space-x-3">
                  {[man1, woman2, man3, woman4].map((avatar, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-3 border-background overflow-hidden shadow-md hover:scale-110 transition-transform hover:z-10">
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm border-3 border-background shadow-md">
                    +1K
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                    <span className="ml-2 font-bold text-foreground">4.9</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Loved by 1000+ students & parents</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 rounded-3xl blur-3xl scale-110" />
              
              {/* Main Image */}
              <img src={heroStudentCoding} alt="Kids learning AI" className="relative z-10 w-full rounded-3xl shadow-2xl" />
              
              {/* Floating Cards */}
              <FloatingElement delay={0} className="absolute -top-4 -right-4 z-20">
                <div className="glass rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Quiz Completed!</p>
                      <p className="text-sm text-muted-foreground">Score: 95%</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>
              
              <FloatingElement delay={1} className="absolute -bottom-4 -left-4 z-20">
                <div className="glass rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunny to-coral flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">New Badge!</p>
                      <p className="text-sm text-muted-foreground">AI Explorer Unlocked</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement delay={0.5} className="absolute top-1/2 -right-8 z-20 hidden xl:block">
                <div className="glass rounded-2xl shadow-xl p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-pink flex items-center justify-center">
                      <Code className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Level 5</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-8 h-12 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-2 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform backdrop-blur-sm">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2 font-display">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Supercharge Your Child's <span className="text-gradient-primary">Future</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with child-friendly learning methods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="card-playful overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <benefit.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 font-display">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-30" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-4">
              <Layers className="h-4 w-4 text-secondary" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Start Learning in <span className="text-gradient-primary">5 Easy Steps</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {howItWorks.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform relative">
                    <step.icon className="h-10 w-10 text-primary-foreground" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow-md">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-1 font-display">{step.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-[120px]">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="h-8 w-8 text-primary mx-4 hidden md:block animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Levels Preview */}
      <section id="courses" className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-4">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Grade-Wise Curriculum</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Choose Your <span className="text-gradient-primary">Level</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Progressive curriculum designed for each grade level with age-appropriate content
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseLevels.map((level, index) => (
              <Card 
                key={index} 
                className="card-playful overflow-hidden cursor-pointer group"
                onClick={() => navigate("/courses")}
              >
                <div className={`h-32 bg-gradient-to-br ${level.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <level.icon className="h-16 w-16 text-primary-foreground/90 group-hover:scale-125 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                </div>
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-semibold text-primary mb-1">{level.grades}</p>
                  <h3 className="text-xl font-bold text-foreground mb-2 font-display">{level.title}</h3>
                  <p className="text-muted-foreground text-sm">{level.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              onClick={() => navigate("/courses")}
              className="gap-2 rounded-full px-8"
            >
              View All Courses
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why KodeIntel Section */}
      <section className="py-20 px-4 gradient-mesh relative">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-4">
                <Target className="h-4 w-4 text-primary" />
                <span>Our Approach</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-display">
                Why Parents & Schools <span className="text-gradient-primary">Trust Us</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We've designed every aspect of our platform with children's learning needs in mind, 
                following the latest educational research and NEP 2020 guidelines.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {whyKodeIntel.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 glass rounded-2xl hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
              <img 
                src={aiBrainNetwork} 
                alt="AI Brain Network" 
                className="relative z-10 w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Compiler Preview Section */}
      <section className="py-20 px-4 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src={compilerPreview} 
                alt="Compiler Preview" 
                className="w-full rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 rounded-full text-sm font-semibold mb-4">
                <Code className="h-4 w-4" />
                <span>Hybrid Compiler</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-display">
                Code Your Way to <span className="text-primary">Success</span>
              </h2>
              <p className="text-lg text-background/80 mb-8">
                Our hybrid compiler adapts to your skill level. Start with colorful blocks like Scratch, 
                then graduate to real Python and Java code as you grow!
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: Blocks, text: "Block-based coding for beginners (Classes 3-6)" },
                  { icon: Code, text: "Text-based Python & Java (Classes 7-10)" },
                  { icon: Play, text: "Instant code execution with visual output" },
                  { icon: Trophy, text: "Gamified achievements and rewards" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-background/90">{item.text}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => navigate("/compiler")}
                className="gap-2 rounded-full px-8 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Code className="h-5 w-5" />
                Try Compiler
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-4">
              <BookMarked className="h-4 w-4 text-primary" />
              <span>Pricing Plans</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Choose Your <span className="text-gradient-primary">Plan</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible options to suit every learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product, index) => (
              <Card 
                key={index} 
                className={`card-playful overflow-hidden relative ${product.popular ? 'border-primary border-2' : ''}`}
              >
                {product.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      POPULAR
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2 font-display">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground font-display">{product.price}</span>
                    <span className="text-muted-foreground">{product.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <feature.icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full rounded-full py-6 text-lg font-semibold ${product.popular ? '' : 'variant-outline'}`}
                    variant={product.popular ? "default" : "outline"}
                    onClick={() => navigate("/store")}
                  >
                    {product.buttonText}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">Looking for school bulk pricing?</p>
            <Button variant="link" onClick={() => navigate("/schools")} className="gap-2 text-primary">
              <Building2 className="h-4 w-4" />
              View School Partnership Options
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Schools Preview Section */}
      <section className="py-20 px-4 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-30" />
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-4">
                <Building2 className="h-4 w-4 text-primary" />
                <span>For Schools</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-display">
                Transform Your School's <span className="text-gradient-primary">Tech Education</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Partner with KodeIntel to bring cutting-edge AI & Computational Thinking education 
                to your students with special bulk pricing and dedicated support.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Users, text: "Bulk student onboarding" },
                  { icon: TrendingUp, text: "Centralized analytics dashboard" },
                  { icon: Shield, text: "Dedicated account manager" },
                  { icon: Award, text: "Teacher training included" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-turquoise" />
                    <span className="text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="glass rounded-2xl p-6 mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-foreground font-display">₹2,999</span>
                  <span className="text-muted-foreground">per student/year</span>
                </div>
                <p className="text-sm text-muted-foreground">Bulk pricing for 50+ students</p>
              </div>

              <Button
                size="lg"
                onClick={() => navigate("/schools")}
                className="gap-2 rounded-full px-8"
              >
                <Building2 className="h-5 w-5" />
                Partner With Us
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-turquoise/20 rounded-3xl blur-2xl" />
              <img 
                src={schoolPartnership} 
                alt="School Partnership" 
                className="relative z-10 w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-4">
              <Heart className="h-4 w-4 text-coral" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              What Parents & Schools <span className="text-gradient-primary">Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-playful">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30 relative">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-4">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Frequently Asked <span className="text-gradient-primary">Questions</span>
            </h2>
          </div>

          <div className="flex items-start gap-6 mb-8">
            <img src={mascotKodi} alt="Kodi" className="w-20 h-20 animate-float hidden md:block" />
            <Accordion type="single" collapsible className="flex-1">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="glass rounded-2xl mb-3 px-6 border-none">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 font-display">
            Ready to Start Your AI Journey?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning AI and Computational Thinking with KodeIntel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/student/login")}
              className="gap-2 rounded-full px-8 py-6 text-lg font-semibold bg-background text-foreground hover:bg-background/90"
            >
              <Rocket className="h-5 w-5" />
              Get Started Free
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/contact")}
              className="gap-2 rounded-full px-8 py-6 text-lg font-semibold border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
