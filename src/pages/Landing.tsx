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
  Layers,
  CirclePlay,
  FileQuestion,
  Blocks,
  MousePointerClick,
  Video,
  MessageSquare,
  Headphones,
  Laptop,
  Palette,
  BarChart3,
  Gift,
  GlobeLock,
  Fingerprint,
  Workflow,
} from "lucide-react";

// AI-generated images
import heroAiLearning from "@/assets/hero-ai-learning.png";
import kodiMascot3d from "@/assets/kodi-mascot-3d.png";
import schoolTechPartnership from "@/assets/school-tech-partnership.png";
import aiNetworkAbstract from "@/assets/ai-network-abstract.png";
import hybridCompiler from "@/assets/hybrid-compiler.png";
import gamificationRewards from "@/assets/gamification-rewards.png";
import featureIconsSet from "@/assets/feature-icons-set.png";

// Testimonial avatars
import man1 from "@/assets/testimonial/man1.png";
import woman2 from "@/assets/testimonial/woman2.png";
import man3 from "@/assets/testimonial/man3.png";
import woman4 from "@/assets/testimonial/woman4.png";

import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mobile-optimized components
import { MobileHeroSection } from "@/components/landing/MobileHeroSection";
import { MobileCourseLevels } from "@/components/landing/MobileCourseLevels";
import { MobileFeaturesGrid } from "@/components/landing/MobileFeaturesGrid";
import { MobileTestimonials } from "@/components/landing/MobileTestimonials";
import { MobilePricing } from "@/components/landing/MobilePricing";
import { MobileCTASection } from "@/components/landing/MobileCTASection";

// New glassmorphism components
import { ParticleBackground } from "@/components/landing/ParticleBackground";
import { GlassCard } from "@/components/landing/GlassCard";
import { FloatingGradientOrbs } from "@/components/landing/FloatingGradientOrbs";
import { InteractiveMockup } from "@/components/landing/InteractiveMockup";
import { ShimmerButton } from "@/components/landing/ShimmerButton";
import { TimelineSection } from "@/components/landing/TimelineSection";

// Animated counter with intersection observer
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
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

// Scroll reveal component
const RevealOnScroll = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mobile-first rendering
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeroSection 
          onGetStarted={() => navigate("/student/login")} 
          onTryDemo={() => navigate("/guest")} 
        />
        <MobileCourseLevels />
        <MobileFeaturesGrid />
        <MobileTestimonials />
        <MobilePricing />
        <MobileCTASection />
      </div>
    );
  }

  // What we offer - Learning modules
  const learningModules = [
    {
      icon: BookOpen,
      title: "Interactive Digital Books",
      description: "Rich multimedia textbooks with animations, videos, and interactive elements that make learning engaging",
      color: "from-primary to-secondary",
      features: ["Touch-friendly navigation", "Content protection", "Progress tracking"],
    },
    {
      icon: Blocks,
      title: "Block-Based Coding Lab",
      description: "Scratch-like visual programming for Classes 3-6, then transition to Python & Java for higher grades",
      color: "from-turquoise to-lime",
      features: ["Visual block coding", "Real code output", "Instant execution"],
    },
    {
      icon: FileQuestion,
      title: "Adaptive Worksheets",
      description: "Auto-graded exercises including fill-blanks, matching, true/false, and short-answer questions",
      color: "from-sunny to-coral",
      features: ["Instant feedback", "XP rewards", "Progress saving"],
    },
    {
      icon: Video,
      title: "HD Video Lectures",
      description: "Professionally produced lessons by expert educators, designed to maximize engagement and retention",
      color: "from-pink to-secondary",
      features: ["Chaptered videos", "Watch progress", "Offline access"],
    },
  ];

  // Problems we solve
  const problemsSolved = [
    { icon: Target, problem: "Outdated CS curriculum", solution: "NEP 2020-aligned AI & Computational Thinking", color: "text-primary" },
    { icon: GlobeLock, problem: "No structured learning path", solution: "Grade-wise progressive curriculum (3-10)", color: "text-turquoise" },
    { icon: Gamepad2, problem: "Boring, text-heavy content", solution: "Gamified learning with badges & XP", color: "text-sunny" },
    { icon: Fingerprint, problem: "Content piracy concerns", solution: "Protected digital books, no downloads", color: "text-coral" },
    { icon: BarChart3, problem: "No visibility into progress", solution: "Real-time analytics for parents/schools", color: "text-lime" },
    { icon: Workflow, problem: "Theory-only education", solution: "Hands-on coding practice with projects", color: "text-secondary" },
  ];

  const products = [
    {
      name: "Complete Learning Pack",
      price: "₹3,499",
      originalPrice: "₹4,999",
      period: "/year",
      popular: true,
      description: "Everything your child needs to master AI & Coding",
      features: [
        { icon: CirclePlay, text: "50+ HD Video Lectures" },
        { icon: BookOpen, text: "Interactive Digital Textbook" },
        { icon: Code, text: "Unlimited Code Lab Access" },
        { icon: FileQuestion, text: "Adaptive Worksheets & Quizzes" },
        { icon: Blocks, text: "10+ Hands-on Projects" },
        { icon: TrendingUp, text: "Progress Analytics Dashboard" },
        { icon: BookMarked, text: "Physical Workbook (Delivered)" },
        { icon: Trophy, text: "Certificates & Badges" },
      ],
      buttonText: "Start 7-Day Free Trial",
      gradient: "gradient-primary",
    },
    {
      name: "Workbook Only",
      price: "₹999",
      originalPrice: null,
      period: "",
      popular: false,
      description: "Physical theory book + worksheets for offline learning",
      features: [
        { icon: BookMarked, text: "Comprehensive Theory Book" },
        { icon: FileText, text: "Practice Worksheets" },
        { icon: CheckCircle2, text: "Chapter Summaries" },
        { icon: Award, text: "Activity Pages" },
      ],
      buttonText: "Buy Workbook",
      gradient: "bg-secondary",
    },
  ];

  const courseLevels = [
    { grades: "Classes 3-4", title: "Foundation", description: "Logical thinking & problem solving", icon: Lightbulb, gradient: "from-sunny via-coral to-pink", topics: ["What is AI?", "Thinking like a computer", "Patterns & sequences"] },
    { grades: "Classes 5-6", title: "Explorer", description: "Algorithms & computational thinking", icon: Rocket, gradient: "from-primary via-secondary to-purple", topics: ["Flowcharts", "Block coding", "Data & decisions"] },
    { grades: "Classes 7-8", title: "Builder", description: "Real coding with Python basics", icon: Code, gradient: "from-turquoise via-lime to-sunny", topics: ["Python fundamentals", "Functions", "Simple games"] },
    { grades: "Classes 9-10", title: "Innovator", description: "Advanced AI & machine learning", icon: Cpu, gradient: "from-secondary via-pink to-coral", topics: ["ML concepts", "Neural networks", "AI projects"] },
  ];

  const stats = [
    { value: 1000, suffix: "+", label: "Happy Students", icon: Users },
    { value: 50, suffix: "+", label: "Video Lessons", icon: Video },
    { value: 25, suffix: "+", label: "Partner Schools", icon: Building2 },
    { value: 8, suffix: "", label: "Grade Levels", icon: GraduationCap },
  ];

  const testimonials = [
    { name: "Mrs. Anita Sharma", role: "Parent, Class 7 Student", text: "My son's problem-solving skills have improved dramatically. The interactive lessons keep him engaged for hours!", avatar: woman2, rating: 5 },
    { name: "Mr. Rajesh Patel", role: "Parent, Class 5 Student", text: "Finally, a platform that teaches AI concepts at a level my daughter can understand. The gamification is brilliant!", avatar: man1, rating: 5 },
    { name: "Mrs. Priya Kumar", role: "Parent, Class 9 Student", text: "The transition from block coding to Python was seamless. My son is now writing real programs!", avatar: woman4, rating: 5 },
    { name: "Principal Verma", role: "Delhi Public School", text: "KodeIntel has transformed how we teach computer science. Students are more engaged than ever before.", avatar: man3, rating: 5 },
  ];

  const faqs = [
    { question: "What exactly is KodeIntel?", answer: "KodeIntel is India's first comprehensive AI & Computational Thinking platform for school students (Classes 3-10). We combine interactive digital textbooks, a visual coding lab, HD video lectures, and gamified worksheets to make learning fun and effective." },
    { question: "How is the curriculum structured?", answer: "Each grade has 10 months of content with 4 sessions per month. Each session is 40 minutes—perfect for young learners. The curriculum follows NEP 2020 guidelines and progressively builds from logical thinking to actual programming." },
    { question: "What's included in the Complete Learning Pack?", answer: "You get access to all digital content (videos, interactive textbook, code lab, quizzes, projects, analytics) PLUS a physical workbook delivered to your doorstep. All for ₹3,499/year with a 7-day free trial." },
    { question: "Is the coding suitable for complete beginners?", answer: "Absolutely! Classes 3-6 use block-based coding (like Scratch) which requires no typing. Higher classes transition to Python and Java with step-by-step guidance. Every student succeeds regardless of background." },
    { question: "How does school partnership work?", answer: "Schools get bulk pricing at ₹2,999/student/year, a centralized analytics dashboard, teacher training, and dedicated support. We handle everything from onboarding to progress reports." },
    { question: "Can parents track their child's progress?", answer: "Yes! Our analytics dashboard shows completed lessons, quiz scores, time spent, streak days, badges earned, and areas that need improvement. You'll always know how your child is progressing." },
  ];

  const howItWorks = [
    { step: 1, title: "Sign Up Free", description: "Create account in 30 seconds", icon: Users, color: "from-primary to-secondary" },
    { step: 2, title: "Select Grade", description: "Choose your class level", icon: GraduationCap, color: "from-secondary to-pink" },
    { step: 3, title: "Learn & Code", description: "Watch videos, practice coding", icon: Code, color: "from-turquoise to-lime" },
    { step: 4, title: "Complete Quizzes", description: "Test knowledge, earn XP", icon: Trophy, color: "from-accent to-coral" },
    { step: 5, title: "Get Certified", description: "Unlock badges & certificates", icon: Award, color: "from-purple to-primary" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Particle Background - Fixed */}
      <ParticleBackground particleCount={50} className="fixed z-0" />
      
      {/* Floating Gradient Orbs - Fixed */}
      <FloatingGradientOrbs className="fixed z-0" enableParallax={true} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center py-16 px-4">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              {/* Badge with glow */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-sm font-bold mb-8 shadow-lg border border-primary/20 animate-badge-float">
                <div className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
                <span className="text-foreground">NEP 2020 Aligned</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary font-bold">Classes 3 to 10</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1] font-display">
                India's #1{" "}
                <span className="relative">
                  <span className="text-gradient-primary">AI & Coding</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8C50 3 100 3 150 8C200 13 250 3 298 8" stroke="hsl(var(--turquoise))" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
                <br />
                <span className="text-foreground">Platform for</span>{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-playful">School Kids</span>
                  <Sparkles className="absolute -top-4 -right-8 h-8 w-8 text-sunny animate-pulse" />
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
                <span className="text-foreground font-semibold">Interactive digital books, visual coding lab, video lectures & gamified worksheets</span> — 
                everything your child needs to become future-ready.
              </p>

              {/* CTA Buttons with Shimmer */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <ShimmerButton
                  onClick={() => navigate("/student/login")}
                  variant="primary"
                  size="lg"
                >
                  <Rocket className="h-6 w-6" />
                  Start 7-Day Free Trial
                  <ChevronRight className="h-5 w-5" />
                </ShimmerButton>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/guest")}
                  className="gap-3 rounded-full px-10 py-7 text-lg font-semibold border-2 border-border hover:border-primary/50 hover:bg-primary/5 group glass-card"
                >
                  <Play className="h-5 w-5 group-hover:text-primary transition-colors" />
                  Try Demo Free
                </Button>
              </div>

              {/* Trust Indicators with glass effect */}
              <div className="flex items-center gap-6 flex-wrap p-5 glass-card rounded-2xl">
                <div className="flex -space-x-3">
                  {[man1, woman2, man3, woman4].map((avatar, i) => (
                    <div 
                      key={i} 
                      className="w-12 h-12 rounded-full border-3 border-background overflow-hidden shadow-lg hover:scale-110 hover:z-20 transition-all cursor-pointer"
                    >
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm border-3 border-background shadow-lg">
                    +1K
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-sunny text-sunny" />
                    ))}
                    <span className="ml-2 font-bold text-foreground text-lg">4.9</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Loved by 1000+ students & parents</p>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Dashboard Mockup */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <InteractiveMockup className="w-full max-w-lg mx-auto" />
              
              {/* Mascot */}
              <FloatingElement delay={0.3} className="absolute -bottom-4 -left-4 z-30 hidden lg:block">
                <img 
                  src={kodiMascot3d} 
                  alt="KODI Mascot" 
                  className="w-28 h-28 object-contain drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer" 
                />
              </FloatingElement>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">Scroll to explore</span>
          <div className="w-8 h-14 border-2 border-muted-foreground/40 rounded-full flex justify-center pt-3 glass-card">
            <div className="w-2 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="text-center group">
                  <div className="w-20 h-20 rounded-3xl bg-primary-foreground/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-xl border border-primary-foreground/10">
                    <stat.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-primary-foreground mb-2 font-display">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-primary-foreground/90 font-semibold text-lg">{stat.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-bold mb-6 shadow-md">
                <Layers className="h-5 w-5 text-turquoise" />
                <span className="text-foreground">Complete Learning Ecosystem</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display leading-tight">
                4 Powerful Learning{" "}
                <span className="text-gradient-primary">Modules</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A complete learning experience combining digital books, hands-on coding, video lessons, and adaptive practice
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-6">
            {learningModules.map((module, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <GlassCard 
                  glowColor={index === 0 ? 'primary' : index === 1 ? 'turquoise' : index === 2 ? 'sunny' : 'coral'}
                  hover3D={true}
                  size="lg"
                  className="h-full"
                >
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-6 shadow-xl transition-transform group-hover:scale-110`}>
                    <module.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 font-display">{module.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{module.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {module.features.map((feature, i) => (
                      <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted/80 text-muted-foreground backdrop-blur-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Problems We Solve Section */}
      <section className="py-24 px-4 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-sm font-bold mb-6">
                <Target className="h-5 w-5 text-coral" />
                <span>Problems We Solve</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
                Traditional CS Education is <span className="text-gradient-primary">Broken</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We've reimagined how children learn technology skills
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problemsSolved.map((item, index) => (
              <RevealOnScroll key={index} delay={index * 80}>
                <GlassCard 
                  glowColor={index % 3 === 0 ? 'primary' : index % 3 === 1 ? 'turquoise' : 'coral'}
                  hover3D={true}
                  size="md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground line-through mb-1">{item.problem}</p>
                      <p className="font-bold text-foreground">{item.solution}</p>
                    </div>
                  </div>
                </GlassCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-sm font-bold mb-6">
                <Workflow className="h-5 w-5 text-secondary" />
                <span>Simple Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
                Start Learning in <span className="text-gradient-primary">5 Easy Steps</span>
              </h2>
            </div>
          </RevealOnScroll>

          <TimelineSection />
        </div>
      </section>

      {/* Course Levels Section */}
      <section id="courses" className="py-24 px-4 bg-muted/30 relative">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-bold mb-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span>Grade-Wise Curriculum</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
                Progressive Learning <span className="text-gradient-primary">Paths</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Age-appropriate curriculum that grows with your child
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseLevels.map((level, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <Card 
                  className="card-playful overflow-hidden cursor-pointer group border-2 hover:border-primary/30 h-full"
                  onClick={() => navigate("/courses")}
                >
                  <div className={`h-32 bg-gradient-to-br ${level.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <level.icon className="h-16 w-16 text-primary-foreground/80 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardContent className="p-6">
                    <p className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">{level.grades}</p>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-display">{level.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{level.description}</p>
                    <div className="space-y-1.5">
                      {level.topics.map((topic, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-lime" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={400}>
            <div className="text-center mt-12">
              <Button
                size="lg"
                onClick={() => navigate("/courses")}
                className="gap-3 rounded-full px-10 py-7 text-lg font-bold shadow-xl hover:shadow-2xl group"
              >
                Explore All Courses
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Compiler Preview Section */}
      <section className="py-24 px-4 bg-foreground text-background relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll className="order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-background/20 group">
                <img 
                  src={hybridCompiler} 
                  alt="Hybrid Compiler Preview" 
                  className="w-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={200} className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-background/10 rounded-full text-sm font-bold mb-6">
                <Code className="h-5 w-5" />
                <span>Hybrid Code Lab</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display leading-tight">
                From Blocks to{" "}
                <span className="text-primary">Real Code</span>
              </h2>
              <p className="text-xl text-background/80 mb-10 leading-relaxed">
                Start with colorful drag-and-drop blocks like Scratch, then graduate to real Python and Java as skills grow. 
                Watch code execute instantly with visual output!
              </p>
              
              <div className="space-y-5 mb-10">
                {[
                  { icon: Blocks, text: "Visual block coding for Classes 3-6", color: "from-turquoise to-lime" },
                  { icon: Code, text: "Python & Java for Classes 7-10", color: "from-primary to-secondary" },
                  { icon: Play, text: "Instant execution with visual output", color: "from-sunny to-coral" },
                  { icon: Trophy, text: "Earn XP & badges for every project", color: "from-pink to-secondary" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-background/90 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => navigate("/student/guest")}
                className="gap-3 rounded-full px-10 py-7 text-lg font-bold bg-turquoise text-turquoise-foreground hover:bg-turquoise/90 shadow-xl hover:shadow-2xl group"
              >
                <MousePointerClick className="h-6 w-6" />
                Try Code Lab Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-bold mb-6">
                <Gift className="h-5 w-5 text-sunny" />
                <span>Launch Pricing</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
                Simple, Transparent <span className="text-gradient-primary">Pricing</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start with a 7-day free trial. No credit card required.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product, index) => (
              <RevealOnScroll key={index} delay={index * 150}>
                <Card className={`card-playful overflow-hidden relative h-full border-2 ${product.popular ? 'border-primary shadow-2xl shadow-primary/10' : ''}`}>
                  {product.popular && (
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-turquoise" />
                  )}
                  {product.popular && (
                    <div className="absolute top-6 right-6">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-bold rounded-full flex items-center gap-2 shadow-lg">
                        <Star className="h-4 w-4 fill-current" />
                        BEST VALUE
                      </span>
                    </div>
                  )}
                  <CardContent className="p-10">
                    <h3 className="text-2xl font-bold text-foreground mb-2 font-display">{product.name}</h3>
                    <p className="text-muted-foreground mb-6">{product.description}</p>
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-foreground font-display">{product.price}</span>
                        <span className="text-xl text-muted-foreground">{product.period}</span>
                      </div>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="line-through">{product.originalPrice}</span>
                          <span className="text-lime font-bold ml-2">Save 30%</span>
                        </p>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-10">
                      {product.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <feature.icon className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-foreground font-medium">{feature.text}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full rounded-full py-7 text-lg font-bold ${product.popular ? 'shadow-xl hover:shadow-2xl' : ''}`}
                      variant={product.popular ? "default" : "outline"}
                      size="lg"
                      onClick={() => navigate(product.popular ? "/student/signup" : "/store")}
                    >
                      {product.buttonText}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={300}>
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4 text-lg">Looking for school bulk pricing?</p>
              <Button variant="link" onClick={() => navigate("/school-partnership")} className="gap-2 text-primary text-lg font-bold">
                <Building2 className="h-5 w-5" />
                View School Partnership Options
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Schools Section */}
      <section className="py-24 px-4 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll>
              <div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-bold mb-6">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>For Schools</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display leading-tight">
                  Partner With Us to{" "}
                  <span className="text-gradient-primary">Transform Education</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  Bring cutting-edge AI & Computational Thinking education to your students 
                  with special bulk pricing and dedicated support.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    "Bulk student onboarding & management",
                    "Centralized progress analytics",
                    "Teacher training & resources",
                    "Dedicated account manager",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-turquoise/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-turquoise" />
                      </div>
                      <span className="text-foreground font-medium text-lg">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="glass rounded-3xl p-8 mb-10 border border-primary/20">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-foreground font-display">₹2,999</span>
                    <span className="text-muted-foreground text-lg">per student/year</span>
                  </div>
                  <p className="text-muted-foreground">Bulk pricing for 50+ students</p>
                </div>

                <Button
                  size="lg"
                  onClick={() => navigate("/school-partnership")}
                  className="gap-3 rounded-full px-10 py-7 text-lg font-bold shadow-xl hover:shadow-2xl group"
                >
                  <Building2 className="h-6 w-6" />
                  Partner With Us
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-turquoise/30 rounded-3xl blur-3xl" />
                <img 
                  src={schoolTechPartnership} 
                  alt="School Partnership" 
                  className="relative z-10 w-full rounded-3xl shadow-2xl border-4 border-border/20"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-bold mb-6">
                <Heart className="h-5 w-5 text-coral animate-pulse" />
                <span>Testimonials</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
                What Parents & Schools <span className="text-gradient-primary">Say</span>
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <Card className="card-playful h-full border-2 hover:border-primary/30 group">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-sunny text-sunny" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 flex-grow italic leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-14 h-14 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
                      />
                      <div>
                        <p className="font-bold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-muted/30 relative">
        <div className="container mx-auto max-w-4xl">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-bold mb-6">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>FAQ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
                Got <span className="text-gradient-primary">Questions?</span>
              </h2>
              <p className="text-xl text-muted-foreground">We've got answers</p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="glass rounded-2xl px-8 py-2 border-2 border-transparent hover:border-primary/20 transition-colors data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-lg font-bold text-foreground hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4 text-lg">Still have questions?</p>
              <Button variant="outline" onClick={() => navigate("/contact")} className="gap-2 rounded-full px-8">
                <MessageSquare className="h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        
        <div className="container mx-auto relative z-10">
          <RevealOnScroll>
            <div className="text-center max-w-4xl mx-auto">
              <FloatingElement className="inline-block mb-6">
                <img src={kodiMascot3d} alt="KODI Mascot" className="w-24 h-24 object-contain mx-auto" />
              </FloatingElement>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 font-display leading-tight">
                Ready to Shape Your Child's{" "}
                <span className="relative">
                  Future?
                  <Sparkles className="absolute -top-4 -right-8 h-8 w-8 text-sunny animate-pulse" />
                </span>
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                Join thousands of students mastering AI & Coding. Start your 7-day free trial today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/student/login")}
                  className="gap-3 rounded-full px-10 py-7 text-lg font-bold bg-background text-foreground hover:bg-background/90 shadow-2xl group"
                >
                  <Rocket className="h-6 w-6" />
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/student/guest")}
                  className="gap-3 rounded-full px-10 py-7 text-lg font-bold border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 group"
                >
                  <Play className="h-5 w-5" />
                  Explore Demo
                </Button>
              </div>

              <p className="mt-8 text-primary-foreground/70 text-sm">
                No credit card required • Cancel anytime • Full access for 7 days
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
