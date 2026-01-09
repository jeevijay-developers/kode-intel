import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Building2,
  Users,
  TrendingUp,
  Shield,
  Award,
  BookOpen,
  Code,
  Play,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  GraduationCap,
  Target,
  Clock,
  HeartHandshake,
  BarChart3,
  UserCheck,
  Headphones,
  FileText,
} from "lucide-react";
import schoolPartnership from "@/assets/school-partnership.png";
import mascotKodi from "@/assets/mascot-kodi.png";

const features = [
  { icon: Users, title: "Bulk Student Onboarding", description: "Easy CSV upload for hundreds of students at once" },
  { icon: BarChart3, title: "Centralized Analytics", description: "Track all students' progress from one dashboard" },
  { icon: Headphones, title: "Dedicated Support", description: "Personal account manager for your school" },
  { icon: GraduationCap, title: "Teacher Training", description: "Free training sessions for your faculty" },
  { icon: FileText, title: "Progress Reports", description: "Automated reports for parents and management" },
  { icon: Award, title: "Certificates", description: "Official certificates for course completion" },
];

const benefits = [
  { icon: Target, title: "NEP 2020 Aligned", description: "Curriculum meets all national education policy requirements" },
  { icon: Clock, title: "Ready-Made Sessions", description: "40-minute structured sessions for easy timetabling" },
  { icon: BookOpen, title: "Complete Curriculum", description: "Videos, quizzes, compiler, and workbooks included" },
  { icon: Shield, title: "Safe Platform", description: "No ads, no distractions, child-safe environment" },
];

const testimonials = [
  { school: "Delhi Public School", location: "New Delhi", quote: "KodeIntel transformed our computer science curriculum. Students are now excited about AI!" },
  { school: "Kendriya Vidyalaya", location: "Mumbai", quote: "The structured approach and teacher support made implementation seamless." },
  { school: "St. Mary's School", location: "Bangalore", quote: "Parent feedback has been overwhelmingly positive. Kids love the gamified learning!" },
];

export default function SchoolPartnership() {
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState([100]);
  
  const basePrice = 2999;
  const discount = studentCount[0] >= 200 ? 0.15 : studentCount[0] >= 100 ? 0.10 : 0;
  const pricePerStudent = Math.round(basePrice * (1 - discount));
  const totalPrice = pricePerStudent * studentCount[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 gradient-mesh relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-6">
                <Building2 className="h-4 w-4 text-primary" />
                <span>School Partnership Program</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display">
                Transform Your School's <span className="text-gradient-primary">Tech Education</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Partner with KodeIntel to bring cutting-edge AI & Computational Thinking education 
                to your students with special bulk pricing and dedicated support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                  className="gap-2 rounded-full px-8"
                >
                  <TrendingUp className="h-5 w-5" />
                  View Pricing
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/contact")}
                  className="gap-2 rounded-full px-8"
                >
                  <Phone className="h-5 w-5" />
                  Contact Us
                </Button>
              </div>
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

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Why Schools <span className="text-gradient-primary">Choose Us</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-playful text-center p-6">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2 font-display">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Everything You <span className="text-gradient-primary">Need</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete toolkit for implementing AI education in your school
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-6 glass rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
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
      <section id="pricing" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Calculate Your <span className="text-gradient-primary">Pricing</span>
            </h2>
            <p className="text-muted-foreground">
              Volume discounts available for 100+ students
            </p>
          </div>

          <Card className="card-playful overflow-hidden">
            <div className="gradient-primary p-8 text-center">
              <h3 className="text-2xl font-bold text-primary-foreground mb-2 font-display">Bulk School Pricing</h3>
              <p className="text-primary-foreground/80">Select the number of students</p>
            </div>
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">Number of Students</span>
                  <span className="text-2xl font-bold text-primary font-display">{studentCount[0]}</span>
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
                  <span>500 students</span>
                </div>
              </div>

              {discount > 0 && (
                <div className="mb-6 p-4 bg-turquoise/10 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-turquoise" />
                  <span className="text-foreground font-medium">
                    {Math.round(discount * 100)}% volume discount applied!
                  </span>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 glass rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Price per Student</p>
                  <p className="text-2xl font-bold text-foreground font-display">₹{pricePerStudent}</p>
                  {discount > 0 && (
                    <p className="text-sm text-muted-foreground line-through">₹{basePrice}</p>
                  )}
                </div>
                <div className="text-center p-4 glass rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-foreground font-display">{studentCount[0]}</p>
                </div>
                <div className="text-center p-4 glass rounded-xl bg-primary/5">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-primary font-display">₹{totalPrice.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">/year</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <h4 className="font-semibold text-foreground">What's Included:</h4>
                {[
                  "Video Lectures for all classes",
                  "Interactive Quizzes & Assessments",
                  "Practice Compiler Access",
                  "Physical Workbooks for each student",
                  "Teacher Dashboard & Training",
                  "Dedicated Account Manager",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-turquoise" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="w-full rounded-full py-6 text-lg gap-2"
                onClick={() => navigate("/contact")}
              >
                <HeartHandshake className="h-5 w-5" />
                Request Partnership
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Trusted by <span className="text-gradient-primary">Schools</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-playful p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <CheckCircle2 key={i} className="h-4 w-4 text-turquoise" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-foreground">{testimonial.school}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto text-center relative z-10">
          <img src={mascotKodi} alt="Kodi" className="w-20 h-20 mx-auto mb-6 animate-bounce-soft" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-display">
            Ready to Transform Your School?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join 25+ schools already using KodeIntel to teach AI & Computational Thinking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="gap-2 rounded-full px-8 bg-background text-foreground hover:bg-background/90"
            >
              <Mail className="h-5 w-5" />
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = "tel:+919876543210"}
              className="gap-2 rounded-full px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Phone className="h-5 w-5" />
              +91 98765 43210
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
