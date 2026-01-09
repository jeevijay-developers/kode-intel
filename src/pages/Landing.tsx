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
  MousePointerClick,
  Video,
  MessageSquare,
  Headphones,
} from "lucide-react";

// New AI-generated images
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
      gradient: "from-primary to-secondary",
      image: aiNetworkAbstract,
    },
    {
      icon: Puzzle,
      title: "Computational Thinking",
      description: "Develop problem-solving skills with step-by-step logical thinking exercises",
      gradient: "from-secondary to-pink",
      image: null,
    },
    {
      icon: Gamepad2,
      title: "Learn by Playing",
      description: "Gamified learning experience with badges, levels, and exciting challenges",
      gradient: "from-accent to-sunny",
      image: gamificationRewards,
    },
    {
      icon: Monitor,
      title: "Interactive Compiler",
      description: "Practice coding with our kid-friendly block and text-based compiler",
      gradient: "from-turquoise to-lime",
      image: null,
    },
  ];

  const whyKodeIntel = [
    { icon: Target, title: "NEP 2020 Aligned", description: "Curriculum designed as per National Education Policy guidelines", color: "text-primary" },
    { icon: Clock, title: "40-Min Sessions", description: "Perfect session duration for maximum engagement", color: "text-secondary" },
    { icon: Trophy, title: "Gamified Learning", description: "Earn badges, unlock levels, and compete with friends", color: "text-accent" },
    { icon: Shield, title: "Safe & Secure", description: "Child-safe platform with no ads and protected content", color: "text-turquoise" },
    { icon: Zap, title: "Fun Activities", description: "Hands-on projects and creative coding challenges", color: "text-coral" },
    { icon: Heart, title: "Built for Kids", description: "Age-appropriate content designed by education experts", color: "text-pink" },
  ];

  const courseLevels = [
    { grades: "Classes 3-4", title: "Foundation", description: "Introduction to logical thinking", icon: Lightbulb, gradient: "from-sunny via-coral to-pink", emoji: "🌟" },
    { grades: "Classes 5-6", title: "Explorer", description: "Algorithms & pattern recognition", icon: Rocket, gradient: "from-primary via-secondary to-purple", emoji: "🚀" },
    { grades: "Classes 7-8", title: "Builder", description: "Create projects & applications", icon: Code, gradient: "from-turquoise via-lime to-sunny", emoji: "⚡" },
    { grades: "Classes 9-10", title: "Innovator", description: "Advanced AI & real-world apps", icon: Cpu, gradient: "from-secondary via-pink to-coral", emoji: "🧠" },
  ];

  const stats = [
    { value: 1000, suffix: "+", label: "Happy Students", icon: Users },
    { value: 50, suffix: "+", label: "Video Lessons", icon: Video },
    { value: 25, suffix: "+", label: "Partner Schools", icon: Building2 },
    { value: 100, suffix: "%", label: "Fun Guaranteed", icon: Heart },
  ];

  const testimonials = [
    { name: "Mrs. Sharma", role: "Parent of Class 7 Student", text: "My son is so excited about AI now! The videos are engaging and he's learning concepts I never imagined at his age.", avatar: woman2, rating: 5 },
    { name: "Mr. Patel", role: "Parent of Class 5 Student", text: "My daughter looks forward to the quizzes every day. She's developing critical thinking skills while having fun!", avatar: man1, rating: 5 },
    { name: "Mrs. Kumar", role: "Parent of Class 9 Student", text: "The computational thinking curriculum has improved my son's problem-solving abilities across all subjects.", avatar: woman4, rating: 5 },
    { name: "Principal Verma", role: "Delhi Public School", text: "KodeIntel has transformed how we teach technology. The structured curriculum makes implementation seamless.", avatar: man3, rating: 5 },
  ];

  const faqs = [
    { question: "What is KodeIntel?", answer: "KodeIntel is an AI & Computational Thinking platform designed for students from Class 3 to Class 10, aligned with NEP 2020. It offers video lectures, quizzes, a practice compiler, and physical workbooks." },
    { question: "How are the sessions structured?", answer: "Each academic year has 10 working months with 4 sessions per month. Each session is approximately 40 minutes, perfect for young learners' attention spans." },
    { question: "What's the difference between Full Pack and Book Only?", answer: "Full Pack (₹3,499/year) includes video lectures, compiler access, quizzes, projects, analytics, and a physical book. Book Only (₹999) includes just the physical workbook." },
    { question: "Is the compiler suitable for beginners?", answer: "Yes! Lower classes (3-6) use block-based coding similar to Scratch, while higher classes (7-10) progress to text-based Python and Java." },
    { question: "How do schools partner with KodeIntel?", answer: "Schools get special bulk pricing at ₹2,999 per student, dedicated support, centralized analytics, and easy onboarding for all students." },
  ];

  const howItWorks = [
    { step: 1, title: "Sign Up", description: "Create your account in seconds", icon: Users, color: "from-primary to-secondary" },
    { step: 2, title: "Choose Class", description: "Select your grade level", icon: GraduationCap, color: "from-secondary to-pink" },
    { step: 3, title: "Watch & Learn", description: "Enjoy interactive video lessons", icon: Play, color: "from-turquoise to-lime" },
    { step: 4, title: "Practice", description: "Code in our fun compiler", icon: Code, color: "from-accent to-coral" },
    { step: 5, title: "Get Certified", description: "Earn badges and certificates", icon: Award, color: "from-purple to-primary" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-30"
          style={{
            background: `radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)`,
            left: `${mousePosition.x * 0.3}%`,
            top: `${mousePosition.y * 0.2}%`,
            transition: 'left 0.5s ease-out, top 0.5s ease-out'
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-25"
          style={{
            background: `radial-gradient(circle, hsl(var(--secondary) / 0.4) 0%, transparent 70%)`,
            right: `${(100 - mousePosition.x) * 0.2}%`,
            bottom: `${(100 - mousePosition.y) * 0.2}%`,
            transition: 'right 0.8s ease-out, bottom 0.8s ease-out'
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-turquoise/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Hero Section - Enhanced */}
      <section className="relative min-h-screen flex items-center py-12 px-4">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold mb-8 shadow-lg border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                <span className="text-foreground">NEP 2020 Aligned</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary font-bold">Classes 3rd - 10th</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1] font-display">
                Building{" "}
                <span className="relative">
                  <span className="text-gradient-primary">Thinking</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8C50 3 100 3 150 8C200 13 250 3 298 8" stroke="hsl(var(--accent))" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
                <br />
                <span className="text-foreground">Minds for the</span>{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-playful">AI Age</span>
                  <Sparkles className="absolute -top-4 -right-8 h-8 w-8 text-accent animate-pulse" />
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
                India's most exciting AI & Computational Thinking curriculum for young learners. 
                <span className="text-foreground font-semibold"> Watch videos, solve puzzles, write code,</span> and become a future innovator!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  onClick={() => navigate("/student/login")}
                  className="gap-3 rounded-full px-10 py-7 text-lg font-bold shadow-2xl hover:shadow-primary/25 transition-all hover:scale-105 btn-glow group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Rocket className="h-6 w-6 group-hover:animate-bounce" />
                    Start Learning Free
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/student/guest")}
                  className="gap-3 rounded-full px-10 py-7 text-lg font-semibold border-2 border-border hover:border-primary/50 hover:bg-primary/5 group"
                >
                  <Play className="h-5 w-5 group-hover:text-primary transition-colors" />
                  Try Demo
                </Button>
              </div>

              {/* Social Proof - Enhanced */}
              <div className="flex items-center gap-6 flex-wrap p-4 glass rounded-2xl">
                <div className="flex -space-x-4">
                  {[man1, woman2, man3, woman4].map((avatar, i) => (
                    <div 
                      key={i} 
                      className="w-14 h-14 rounded-full border-4 border-background overflow-hidden shadow-lg hover:scale-125 hover:z-20 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm border-4 border-background shadow-lg">
                    +1K
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent drop-shadow-sm" />
                    ))}
                    <span className="ml-2 font-bold text-foreground text-lg">4.9</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Trusted by 1000+ students & parents</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image Enhanced */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              {/* Multi-layer Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 rounded-[2rem] blur-[60px] scale-110 animate-pulse" />
              <div className="absolute inset-4 bg-gradient-to-tr from-turquoise/20 to-pink/20 rounded-[2rem] blur-[40px] animate-pulse" style={{ animationDelay: "0.5s" }} />
              
              {/* Main Image Container */}
              <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-border/30 hover:border-primary/30 transition-all duration-500 group">
                <img 
                  src={heroAiLearning} 
                  alt="Kids learning AI with holographic displays" 
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>
              
              {/* Floating Achievement Cards */}
              <FloatingElement delay={0} className="absolute -top-6 -right-6 z-20">
                <div className="glass rounded-2xl shadow-2xl p-4 border border-turquoise/30">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Quiz Completed!</p>
                      <p className="text-sm text-turquoise font-semibold">Score: 95% 🎉</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>
              
              <FloatingElement delay={1.2} className="absolute -bottom-6 -left-6 z-20">
                <div className="glass rounded-2xl shadow-2xl p-4 border border-accent/30">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sunny to-coral flex items-center justify-center shadow-lg">
                      <Award className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">New Badge!</p>
                      <p className="text-sm text-accent font-semibold">AI Explorer 🏆</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement delay={0.6} className="absolute top-1/3 -right-10 z-20 hidden xl:block">
                <div className="glass rounded-2xl shadow-xl p-3 border border-primary/30">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Level 5</p>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-gradient-to-r from-primary to-secondary" />
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              {/* Mascot */}
              <FloatingElement delay={0.3} className="absolute -bottom-2 right-8 z-30 hidden lg:block">
                <img 
                  src={kodiMascot3d} 
                  alt="Kodi Mascot" 
                  className="w-28 h-28 object-contain drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer" 
                />
              </FloatingElement>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">Scroll to explore</span>
          <div className="w-8 h-14 border-2 border-muted-foreground/40 rounded-full flex justify-center pt-3">
            <div className="w-2 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {stats.map((stat, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="text-center group">
                  <div className="w-20 h-20 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl border border-primary-foreground/10">
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

      {/* Benefits Section - Enhanced with Images */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold mb-6 shadow-md">
                <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                <span className="text-foreground">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display leading-tight">
                Supercharge Your Child's{" "}
                <span className="text-gradient-primary">Future</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform combines cutting-edge technology with child-friendly learning methods to make education exciting
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <RevealOnScroll key={index} delay={index * 150}>
                <Card className="card-playful overflow-hidden group h-full border-2 hover:border-primary/30">
                  <CardContent className="p-0">
                    <div className="grid sm:grid-cols-2 h-full">
                      <div className="p-8 flex flex-col justify-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                          <benefit.icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3 font-display">{benefit.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                      </div>
                      <div className={`h-48 sm:h-auto bg-gradient-to-br ${benefit.gradient} relative overflow-hidden`}>
                        {benefit.image ? (
                          <img 
                            src={benefit.image} 
                            alt={benefit.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <benefit.icon className="h-24 w-24 text-primary-foreground/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>

          {/* Feature Icons Banner */}
          <RevealOnScroll delay={400}>
            <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={featureIconsSet} 
                alt="Educational Features" 
                className="w-full h-48 md:h-64 object-cover"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <section className="py-24 px-4 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-20" />
        <div className="container mx-auto relative z-10">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold mb-6">
                <Layers className="h-5 w-5 text-secondary" />
                <span>Simple Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display">
                Start Learning in <span className="text-gradient-primary">5 Easy Steps</span>
              </h2>
            </div>
          </RevealOnScroll>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4">
            {howItWorks.map((step, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="flex items-center">
                  <div className="flex flex-col items-center text-center group">
                    <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300`}>
                      <step.icon className="h-12 w-12 text-primary-foreground" />
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg shadow-lg border-4 border-background">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1 font-display">{step.title}</h3>
                    <p className="text-sm text-muted-foreground max-w-[140px]">{step.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block mx-4">
                      <ArrowRight className="h-10 w-10 text-primary/50 animate-pulse" />
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Course Levels Preview - Enhanced */}
      <section id="courses" className="py-24 px-4 relative">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold mb-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span>Grade-Wise Curriculum</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display">
                Choose Your <span className="text-gradient-primary">Level</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Progressive curriculum designed for each grade level with age-appropriate content
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseLevels.map((level, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <Card 
                  className="card-playful overflow-hidden cursor-pointer group border-2 hover:border-primary/30"
                  onClick={() => navigate("/courses")}
                >
                  <div className={`h-40 bg-gradient-to-br ${level.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <span className="text-6xl group-hover:scale-125 transition-transform duration-500">{level.emoji}</span>
                    <level.icon className="absolute bottom-2 right-2 h-20 w-20 text-primary-foreground/20 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">{level.grades}</p>
                    <h3 className="text-2xl font-bold text-foreground mb-2 font-display">{level.title}</h3>
                    <p className="text-muted-foreground">{level.description}</p>
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
                className="gap-3 rounded-full px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl group"
              >
                View All Courses
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Why KodeIntel Section - Enhanced */}
      <section className="py-24 px-4 gradient-mesh relative">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll>
              <div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold mb-6">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Our Approach</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display leading-tight">
                  Why Parents & Schools{" "}
                  <span className="text-gradient-primary">Trust Us</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-10">
                  We've designed every aspect of our platform with children's learning needs in mind, 
                  following the latest educational research and NEP 2020 guidelines.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {whyKodeIntel.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-5 glass rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1 group border border-transparent hover:border-primary/20">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
                <img 
                  src={aiNetworkAbstract} 
                  alt="AI Brain Network" 
                  className="relative z-10 w-full rounded-3xl shadow-2xl border-4 border-border/20 hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Compiler Preview Section - Enhanced */}
      <section className="py-24 px-4 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/10 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll className="order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-background/20 group">
                <img 
                  src={hybridCompiler} 
                  alt="Hybrid Compiler Preview" 
                  className="w-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={200} className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-background/10 rounded-full text-sm font-semibold mb-6">
                <Code className="h-5 w-5" />
                <span>Hybrid Compiler</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display leading-tight">
                Code Your Way to{" "}
                <span className="text-primary">Success</span>
              </h2>
              <p className="text-xl text-background/80 mb-10 leading-relaxed">
                Our hybrid compiler adapts to your skill level. Start with colorful blocks like Scratch, 
                then graduate to real Python and Java code as you grow!
              </p>
              
              <div className="space-y-5 mb-10">
                {[
                  { icon: Blocks, text: "Block-based coding for beginners (Classes 3-6)", color: "from-turquoise to-lime" },
                  { icon: Code, text: "Text-based Python & Java (Classes 7-10)", color: "from-primary to-secondary" },
                  { icon: Play, text: "Instant code execution with visual output", color: "from-accent to-coral" },
                  { icon: Trophy, text: "Gamified achievements and rewards", color: "from-sunny to-pink" },
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
                onClick={() => navigate("/compiler")}
                className="gap-3 rounded-full px-10 py-7 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl hover:shadow-2xl group"
              >
                <MousePointerClick className="h-6 w-6" />
                Try Compiler
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Pricing Section - Enhanced */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold mb-6">
                <BookMarked className="h-5 w-5 text-primary" />
                <span>Pricing Plans</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display">
                Choose Your <span className="text-gradient-primary">Plan</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Flexible options to suit every learning journey
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product, index) => (
              <RevealOnScroll key={index} delay={index * 150}>
                <Card className={`card-playful overflow-hidden relative h-full border-2 ${product.popular ? 'border-primary shadow-2xl shadow-primary/10' : ''}`}>
                  {product.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
                  )}
                  {product.popular && (
                    <div className="absolute top-6 right-6">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-bold rounded-full flex items-center gap-2 shadow-lg">
                        <Star className="h-4 w-4 fill-current" />
                        POPULAR
                      </span>
                    </div>
                  )}
                  <CardContent className="p-10">
                    <h3 className="text-3xl font-bold text-foreground mb-3 font-display">{product.name}</h3>
                    <p className="text-muted-foreground mb-6">{product.description}</p>
                    <div className="mb-8">
                      <span className="text-5xl font-bold text-foreground font-display">{product.price}</span>
                      <span className="text-xl text-muted-foreground">{product.period}</span>
                    </div>
                    
                    <ul className="space-y-4 mb-10">
                      {product.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
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
                      onClick={() => navigate("/store")}
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
              <Button variant="link" onClick={() => navigate("/schools")} className="gap-2 text-primary text-lg font-semibold">
                <Building2 className="h-5 w-5" />
                View School Partnership Options
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Schools Preview Section - Enhanced */}
      <section className="py-24 px-4 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-20" />
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll>
              <div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold mb-6">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>For Schools</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display leading-tight">
                  Transform Your School's{" "}
                  <span className="text-gradient-primary">Tech Education</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  Partner with KodeIntel to bring cutting-edge AI & Computational Thinking education 
                  to your students with special bulk pricing and dedicated support.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    { icon: Users, text: "Bulk student onboarding" },
                    { icon: TrendingUp, text: "Centralized analytics dashboard" },
                    { icon: Headphones, text: "Dedicated account manager" },
                    { icon: Award, text: "Teacher training included" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-turquoise/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-turquoise" />
                      </div>
                      <span className="text-foreground font-medium text-lg">{item.text}</span>
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
                  onClick={() => navigate("/schools")}
                  className="gap-3 rounded-full px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl group"
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
                  className="relative z-10 w-full rounded-3xl shadow-2xl border-4 border-border/20 hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold mb-6">
                <Heart className="h-5 w-5 text-coral animate-pulse" />
                <span>Testimonials</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display">
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
                        <Star key={i} className="h-5 w-5 fill-accent text-accent" />
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

      {/* FAQ Section - Enhanced */}
      <section className="py-24 px-4 bg-muted/30 relative">
        <div className="container mx-auto max-w-4xl">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold mb-6">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>FAQ</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display">
                Got <span className="text-gradient-primary">Questions?</span>
              </h2>
              <p className="text-xl text-muted-foreground">We've got answers to the most common questions</p>
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

      {/* CTA Section - Enhanced */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-muted/30 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <RevealOnScroll>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-foreground/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-8 text-primary-foreground">
                <Rocket className="h-5 w-5 animate-bounce" />
                <span>Ready to Start?</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 font-display leading-tight">
                Start Your Child's AI Journey Today!
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                Join thousands of students who are building the skills for tomorrow. 
                The first week is completely free!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/student/login")}
                  className="gap-3 rounded-full px-12 py-8 text-xl font-bold bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-2xl hover:shadow-primary-foreground/20 group"
                >
                  <Rocket className="h-6 w-6 group-hover:animate-bounce" />
                  Get Started Free
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/schools")}
                  className="gap-3 rounded-full px-12 py-8 text-xl font-bold border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 group"
                >
                  <Building2 className="h-6 w-6" />
                  School Partnership
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
