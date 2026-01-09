import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Building2,
  Users,
  TrendingUp,
  Shield,
  Award,
  BookOpen,
  Code,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  GraduationCap,
  Target,
  Clock,
  HeartHandshake,
  BarChart3,
  Headphones,
  FileText,
  Zap,
  Star,
  Trophy,
  Lightbulb,
  Rocket,
  Globe,
  BadgeCheck,
  CircleCheck,
  XCircle,
  Cpu,
  Play,
  Monitor,
  Layers,
  PieChart,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import schoolPartnership from "@/assets/school-partnership.png";
import compilerPreview from "@/assets/compiler-preview.png";
import aiBrain from "@/assets/ai-brain-network.png";

const whyKodeIntel = [
  { 
    title: "NEP 2020 Aligned Curriculum", 
    description: "Fully compliant with National Education Policy guidelines for computational thinking and AI education",
    icon: BadgeCheck 
  },
  { 
    title: "Complete Learning Ecosystem", 
    description: "Videos, quizzes, compiler, workbooks - everything under one platform",
    icon: Layers 
  },
  { 
    title: "Structured 40-Min Sessions", 
    description: "Ready-made lesson plans that fit perfectly into your school timetable",
    icon: Clock 
  },
  { 
    title: "Zero Infrastructure Needed", 
    description: "Works on any device with internet. No special labs or software required",
    icon: Globe 
  },
  { 
    title: "Real-Time Progress Tracking", 
    description: "See every student's progress, quiz scores, and coding activity live",
    icon: PieChart 
  },
  { 
    title: "Dedicated School Support", 
    description: "Personal account manager and teacher training included",
    icon: Headphones 
  },
];

const comparison = [
  { feature: "Curriculum aligned with NEP 2020", kodeintel: true, others: false },
  { feature: "Physical workbooks included", kodeintel: true, others: false },
  { feature: "Built-in code compiler", kodeintel: true, others: false },
  { feature: "Teacher training & support", kodeintel: true, others: "Paid Extra" },
  { feature: "Bulk student onboarding", kodeintel: true, others: "Limited" },
  { feature: "Progress analytics dashboard", kodeintel: true, others: "Basic" },
  { feature: "Offline workbook practice", kodeintel: true, others: false },
  { feature: "Certification included", kodeintel: true, others: "Paid Extra" },
  { feature: "40-minute structured lessons", kodeintel: true, others: false },
  { feature: "Dedicated account manager", kodeintel: true, others: false },
];

const features = [
  { icon: Users, title: "Bulk Student Onboarding", description: "Upload CSV with hundreds of students in seconds" },
  { icon: BarChart3, title: "Centralized Dashboard", description: "Track every student's progress from one place" },
  { icon: Headphones, title: "Dedicated Support", description: "Personal account manager for your school" },
  { icon: GraduationCap, title: "Teacher Training", description: "Free comprehensive training for faculty" },
  { icon: FileText, title: "Auto Reports", description: "Automated progress reports for parents" },
  { icon: Award, title: "Certificates", description: "Official certificates for completion" },
];

const stats = [
  { value: "25+", label: "Partner Schools", icon: Building2 },
  { value: "5000+", label: "Students Learning", icon: Users },
  { value: "98%", label: "Satisfaction Rate", icon: Star },
  { value: "4.9/5", label: "School Rating", icon: Trophy },
];

const testimonials = [
  { 
    school: "Delhi Public School", 
    location: "New Delhi", 
    principal: "Dr. Anjali Sharma",
    role: "Principal",
    quote: "KodeIntel transformed our computer science curriculum. The structured approach and NEP alignment made implementation effortless. Students are now genuinely excited about AI!",
    rating: 5
  },
  { 
    school: "Kendriya Vidyalaya", 
    location: "Mumbai", 
    principal: "Mr. Rajesh Kumar",
    role: "Vice Principal",
    quote: "The teacher support and training exceeded our expectations. Our faculty felt confident from day one. The analytics dashboard helps us track every student's progress.",
    rating: 5
  },
  { 
    school: "St. Mary's Convent", 
    location: "Bangalore", 
    principal: "Sr. Maria Joseph",
    role: "Director",
    quote: "Parents love seeing their children learn real AI concepts. The workbooks and structured lessons make it easy for teachers. Best investment in our tech education.",
    rating: 5
  },
];

const processSteps = [
  { step: 1, title: "Schedule Demo", description: "Book a 30-min personalized demo for your school", icon: MessageSquare },
  { step: 2, title: "Choose Plan", description: "Select the number of students and classes", icon: FileText },
  { step: 3, title: "Teacher Training", description: "We train your teachers on the platform", icon: GraduationCap },
  { step: 4, title: "Go Live", description: "Start classes with full support", icon: Rocket },
];

export default function SchoolPartnership() {
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState([100]);
  
  const basePrice = 2999;
  const discount = studentCount[0] >= 300 ? 0.20 : studentCount[0] >= 200 ? 0.15 : studentCount[0] >= 100 ? 0.10 : 0;
  const pricePerStudent = Math.round(basePrice * (1 - discount));
  const totalPrice = pricePerStudent * studentCount[0];
  const savings = (basePrice - pricePerStudent) * studentCount[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-6 border border-primary/20">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-foreground">School Partnership Program</span>
                <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">NEP 2020</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display leading-tight">
                Make Your School <span className="text-gradient-primary">Future-Ready</span> with AI Education
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Join 25+ progressive schools already teaching AI & Computational Thinking with KodeIntel. 
                Complete curriculum, teacher training, and dedicated support included.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-3 glass rounded-xl">
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xl font-bold text-foreground font-display">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                  className="gap-2 rounded-full px-8 h-14 text-base"
                >
                  <TrendingUp className="h-5 w-5" />
                  Get School Pricing
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/contact")}
                  className="gap-2 rounded-full px-8 h-14 text-base"
                >
                  <Phone className="h-5 w-5" />
                  Schedule Demo
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-turquoise/20 rounded-3xl blur-2xl" />
              <div className="relative glass rounded-3xl p-4 shadow-2xl">
                <img 
                  src={schoolPartnership} 
                  alt="School Partnership" 
                  className="w-full rounded-2xl"
                />
                <div className="absolute -bottom-4 -right-4 glass rounded-xl p-4 shadow-xl animate-bounce-soft">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">Trusted by 25+</p>
                      <p className="text-xs text-muted-foreground">Leading Schools</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why KodeIntel Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm mb-4">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-foreground">Why Schools Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Everything a <span className="text-gradient-primary">School Owner</span> Needs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We've designed KodeIntel specifically for schools. Every feature addresses a real challenge principals and educators face.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyKodeIntel.map((item, index) => (
              <Card 
                key={index} 
                className="card-playful p-6 group hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-display">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-foreground">Comparison</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Why <span className="text-gradient-primary">KodeIntel</span> vs Others?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              See why forward-thinking schools choose KodeIntel over traditional coding platforms
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="card-playful overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-3 border-b border-border">
                <div className="p-6 font-bold text-foreground">Features</div>
                <div className="p-6 text-center gradient-primary">
                  <div className="flex flex-col items-center gap-2">
                    <Cpu className="h-6 w-6 text-primary-foreground" />
                    <span className="font-bold text-primary-foreground">KodeIntel</span>
                  </div>
                </div>
                <div className="p-6 text-center bg-muted/50">
                  <span className="font-bold text-muted-foreground">Other Platforms</span>
                </div>
              </div>
              
              {/* Rows */}
              {comparison.map((row, index) => (
                <div key={index} className="grid grid-cols-3 border-b border-border/50 last:border-0">
                  <div className="p-4 text-foreground flex items-center">{row.feature}</div>
                  <div className="p-4 flex items-center justify-center bg-primary/5">
                    {row.kodeintel === true ? (
                      <CircleCheck className="h-6 w-6 text-turquoise" />
                    ) : (
                      <span className="text-foreground">{row.kodeintel}</span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    {row.others === true ? (
                      <CircleCheck className="h-6 w-6 text-turquoise" />
                    ) : row.others === false ? (
                      <XCircle className="h-6 w-6 text-destructive/50" />
                    ) : (
                      <span className="text-muted-foreground text-sm">{row.others}</span>
                    )}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-turquoise/20 rounded-3xl blur-xl" />
                <div className="relative glass rounded-2xl p-4 shadow-2xl">
                  <img src={compilerPreview} alt="Platform Preview" className="w-full rounded-xl" />
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm mb-6">
                <Monitor className="h-4 w-4 text-primary" />
                <span className="text-foreground">Student Learning Platform</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">
                Interactive Learning <span className="text-gradient-primary">Experience</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Students get access to a beautiful, engaging platform with video lessons, 
                interactive quizzes, and a real code compiler - all designed for young learners.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Play, text: "HD Video Lessons by Expert Teachers" },
                  { icon: Code, text: "Built-in Python, C++, Java Compiler" },
                  { icon: Target, text: "Gamified Quizzes with Instant Feedback" },
                  { icon: BookOpen, text: "Physical Workbook for Offline Practice" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 glass rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm mb-4">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="text-foreground">Getting Started</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Go Live in <span className="text-gradient-primary">4 Easy Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
                )}
                <Card className="card-playful p-6 text-center relative z-10 h-full">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-2 font-display">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Complete <span className="text-gradient-primary">School Toolkit</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run AI education smoothly in your school
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-6 glass rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1 font-display">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-foreground">School Bulk Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Calculate Your <span className="text-gradient-primary">Investment</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Volume discounts up to 20% for larger schools
            </p>
          </div>

          <Card className="card-playful overflow-hidden shadow-2xl">
            <div className="gradient-primary p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 pattern-dots opacity-10" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-foreground/20 rounded-full text-sm text-primary-foreground mb-4">
                  <Star className="h-4 w-4" />
                  <span>Best Value for Schools</span>
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground mb-2 font-display">Full Year Access</h3>
                <p className="text-primary-foreground/80">Complete AI & Computational Thinking Curriculum</p>
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-medium text-foreground">Select Number of Students</span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-primary font-display">{studentCount[0]}</span>
                    <span className="text-muted-foreground">students</span>
                  </div>
                </div>
                <Slider
                  value={studentCount}
                  onValueChange={setStudentCount}
                  min={50}
                  max={500}
                  step={10}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>50 students</span>
                  <span>250 students</span>
                  <span>500 students</span>
                </div>
              </div>

              {discount > 0 && (
                <div className="mb-6 p-4 bg-turquoise/10 border border-turquoise/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-turquoise/20 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-turquoise" />
                    </div>
                    <div>
                      <span className="text-foreground font-semibold">
                        {Math.round(discount * 100)}% Volume Discount Applied!
                      </span>
                      <p className="text-sm text-muted-foreground">You save ₹{savings.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-turquoise">-{Math.round(discount * 100)}%</span>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 glass rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Per Student</p>
                  <p className="text-3xl font-bold text-foreground font-display">₹{pricePerStudent}</p>
                  {discount > 0 && (
                    <p className="text-sm text-muted-foreground line-through">₹{basePrice}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">/year</p>
                </div>
                <div className="text-center p-6 glass rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Total Students</p>
                  <p className="text-3xl font-bold text-foreground font-display">{studentCount[0]}</p>
                  <p className="text-xs text-muted-foreground mt-1">enrolled</p>
                </div>
                <div className="text-center p-6 gradient-primary rounded-xl">
                  <p className="text-sm text-primary-foreground/80 mb-2">Total Investment</p>
                  <p className="text-3xl font-bold text-primary-foreground font-display">₹{totalPrice.toLocaleString()}</p>
                  <p className="text-xs text-primary-foreground/80 mt-1">/year</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    For Students
                  </h4>
                  <div className="space-y-3">
                    {[
                      "HD Video Lectures",
                      "Interactive Quizzes",
                      "Code Compiler Access",
                      "Physical Workbook",
                      "Completion Certificate",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-turquoise shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    For School
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Admin Dashboard",
                      "Progress Analytics",
                      "Teacher Training",
                      "Bulk Onboarding",
                      "Dedicated Support",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-turquoise shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 rounded-full h-14 text-lg gap-2"
                  onClick={() => navigate("/contact")}
                >
                  <HeartHandshake className="h-5 w-5" />
                  Request Partnership
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1 rounded-full h-14 text-lg gap-2"
                  onClick={() => window.location.href = "tel:+919876543210"}
                >
                  <Phone className="h-5 w-5" />
                  Call: +91 98765 43210
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm mb-4">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-foreground">School Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Hear from <span className="text-gradient-primary">School Leaders</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="card-playful p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.principal}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.school}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8 animate-bounce-soft">
              <Rocket className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 font-display">
              Ready to Transform Your School's Tech Education?
            </h2>
            <p className="text-primary-foreground/80 mb-10 text-lg max-w-xl mx-auto">
              Join 25+ progressive schools already preparing students for the AI-powered future. Schedule a free demo today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/contact")}
                className="gap-2 rounded-full px-10 h-14 text-lg bg-background text-foreground hover:bg-background/90"
              >
                <Mail className="h-5 w-5" />
                Schedule Free Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "tel:+919876543210"}
                className="gap-2 rounded-full px-10 h-14 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Phone className="h-5 w-5" />
                +91 98765 43210
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
