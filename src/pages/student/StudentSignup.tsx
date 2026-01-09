import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  GraduationCap,
  Mail,
  School,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Trophy,
  Star,
  Zap,
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import mascotKodi from "@/assets/mascot-kodi.png";

const classes = ["3", "4", "5", "6", "7", "8", "9", "10"];
const sections = ["A", "B", "C", "D", "E"];

export default function StudentSignup() {
  const navigate = useNavigate();
  const { student, loading } = useStudentAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [formData, setFormData] = useState({
    student_name: "",
    email: "",
    mobile_number: "",
    class: "",
    section: "",
    school_id: "",
    password: "",
    confirmPassword: "",
  });

  // Fetch schools
  const { data: schools = [] } = useQuery({
    queryKey: ["schools-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("id, name, school_code")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!loading && student) {
      navigate("/student");
    }
  }, [student, loading, navigate]);

  const generateUsername = (name: string, mobile: string) => {
    const cleanName = name.toLowerCase().replace(/\s+/g, "").slice(0, 6);
    const mobileLast4 = mobile.slice(-4);
    return `${cleanName}${mobileLast4}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.student_name.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }
    if (!formData.mobile_number.trim() || formData.mobile_number.length < 10) {
      toast({ title: "Please enter a valid mobile number", variant: "destructive" });
      return;
    }
    if (!formData.class) {
      toast({ title: "Please select your class", variant: "destructive" });
      return;
    }
    if (!formData.school_id) {
      toast({ title: "Please select your school", variant: "destructive" });
      return;
    }
    if (formData.password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const username = generateUsername(formData.student_name, formData.mobile_number);
    
    // Set trial dates
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    const { error } = await supabase.from("students").insert({
      student_name: formData.student_name,
      email: formData.email || null,
      mobile_number: formData.mobile_number,
      class: formData.class,
      section: formData.section || null,
      school_id: formData.school_id,
      username,
      temp_password: formData.password,
      is_active: false, // Requires admin activation
      activation_status: "pending",
      is_trial_active: true,
      subscription_status: "trial",
      trial_start_date: trialStartDate.toISOString(),
      trial_end_date: trialEndDate.toISOString(),
    });

    setIsSubmitting(false);

    if (error) {
      if (error.message.includes("duplicate")) {
        toast({
          title: "Account already exists",
          description: "A student with this mobile number already exists",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      setSignupSuccess(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full card-playful overflow-hidden">
          <div className="gradient-primary p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Signup Successful! 🎉</h2>
          </div>
          <CardContent className="p-6 text-center space-y-4">
            <img src={mascotKodi} alt="Kodi" className="h-24 w-24 mx-auto animate-bounce-gentle" />
            <div className="space-y-2">
              <p className="text-foreground font-medium">
                Your account has been created!
              </p>
              <p className="text-muted-foreground text-sm">
                Please wait for your school admin to activate your account. 
                You'll receive a notification once activated.
              </p>
            </div>
            <div className="p-4 glass rounded-xl">
              <div className="flex items-center justify-center gap-2 text-sunny mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-bold">7 Days Free Trial</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Once activated, enjoy full access for 7 days!
              </p>
            </div>
            <Button
              onClick={() => navigate("/student/login")}
              className="w-full h-12 rounded-xl gap-2"
            >
              Go to Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-coral/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-turquoise/5 to-accent/5" />
        
        <div className="relative z-10">
          <div 
            className="flex items-center gap-3 mb-12 cursor-pointer group" 
            onClick={() => navigate("/")}
          >
            <img src={brainLogo} alt="KodeIntel" className="h-14 group-hover:scale-110 transition-transform" />
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">
                Kode<span className="text-primary">Intel</span>
              </h1>
              <p className="text-sm text-muted-foreground">Building Thinking Minds</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 font-display leading-tight">
                Join the <span className="text-gradient-primary">Learning Revolution!</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Start your exciting journey into AI and coding. Create your account and unlock amazing learning adventures!
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Trophy, title: "Earn Badges", desc: "Collect achievements" },
                { icon: Star, title: "Level Up", desc: "Gain XP points" },
                { icon: Clock, title: "7 Day Trial", desc: "Full access free" },
                { icon: Zap, title: "Daily Streaks", desc: "Build consistency" },
              ].map((item, index) => (
                <div key={index} className="glass rounded-2xl p-4 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3">
                    <item.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <img src={mascotKodi} alt="Kodi" className="h-24 w-24 animate-bounce-soft" />
          <div className="glass rounded-2xl p-4 max-w-xs">
            <p className="text-foreground font-medium">
              "Join thousands of students learning to code! Your adventure starts here!"
            </p>
            <p className="text-sm text-primary font-semibold mt-2">- Kodi, Your AI Buddy</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6 cursor-pointer" onClick={() => navigate("/")}>
            <img src={brainLogo} alt="KodeIntel" className="h-10" />
            <h1 className="text-xl font-bold text-foreground font-display">
              Kode<span className="text-primary">Intel</span>
            </h1>
          </div>

          <Card className="card-playful border-0 shadow-2xl overflow-hidden">
            <div className="gradient-primary p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-display">Create Account</h2>
              <p className="text-white/80 text-sm">Start your learning journey today</p>
            </div>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Full Name *
                  </Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    className="h-11 rounded-xl"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Mobile Number *
                  </Label>
                  <Input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    className="h-11 rounded-xl"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email (Optional)
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11 rounded-xl"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Class *
                    </Label>
                    <Select
                      value={formData.class}
                      onValueChange={(value) => setFormData({ ...formData, class: value })}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c} value={c}>Class {c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Section</Label>
                    <Select
                      value={formData.section}
                      onValueChange={(value) => setFormData({ ...formData, section: value })}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((s) => (
                          <SelectItem key={s} value={s}>Section {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <School className="h-4 w-4 text-primary" />
                    School *
                  </Label>
                  <Select
                    value={formData.school_id}
                    onValueChange={(value) => setFormData({ ...formData, school_id: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-11 rounded-xl pr-12"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Confirm Password *
                  </Label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="h-11 rounded-xl"
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-lg gap-2 font-semibold btn-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Create Account
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/student/login")}
                    className="text-primary font-semibold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-turquoise" />
                <span>Safe & Secure for Kids</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
