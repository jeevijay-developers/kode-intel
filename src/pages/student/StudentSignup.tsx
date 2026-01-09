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
import {
  Loader2,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Mail,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Trophy,
  Star,
  Zap,
  Play,
  Brain,
  Rocket
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import mascotKodi from "@/assets/mascot-kodi.png";

const classes = ["3", "4", "5", "6", "7", "8", "9", "10"];

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
    password: "",
    confirmPassword: "",
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
      section: null,
      school_id: null, // Individual students have no school
      username,
      temp_password: formData.password,
      is_active: false, // Requires admin activation
      activation_status: "pending",
      is_trial_active: true,
      subscription_status: "trial",
      trial_start_date: trialStartDate.toISOString(),
      trial_end_date: trialEndDate.toISOString(),
      student_type: "individual",
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="max-w-md w-full border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="gradient-primary p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white font-display">You're Almost There! 🎉</h2>
          </div>
          <CardContent className="p-6 text-center space-y-4">
            <img src={mascotKodi} alt="Kodi" className="h-24 w-24 mx-auto animate-bounce-soft" />
            <div className="space-y-2">
              <p className="text-foreground font-medium text-lg">
                Account Created Successfully!
              </p>
              <p className="text-muted-foreground">
                Your account is pending activation. Once approved, you'll get 7 days of free access to explore all courses!
              </p>
            </div>
            <div className="p-4 glass rounded-xl">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-bold">7 Days Free Trial</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Unlock full access after activation!
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-coral/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigate("/")}
        >
          <img src={brainLogo} alt="KodeIntel" className="h-10 group-hover:scale-105 transition-transform" />
          <h1 className="text-lg font-bold text-foreground font-display hidden sm:block">
            Kode<span className="text-primary">Intel</span>
          </h1>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/student/login")}
          className="text-muted-foreground hover:text-foreground"
        >
          Already have account? Login
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative z-10 overflow-y-auto">
        {/* Left Panel - Benefits (Desktop) */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-display">
              Join the <span className="text-gradient-primary">Learning Adventure!</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create your free account and start exploring the exciting world of AI and coding.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Clock, title: "7 Days Free Trial", desc: "Full access to all courses" },
                { icon: Trophy, title: "Earn Badges & XP", desc: "Gamified learning experience" },
                { icon: Play, title: "Video Lessons", desc: "Interactive video content" },
                { icon: Brain, title: "AI & Coding", desc: "NEP 2020 aligned curriculum" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 glass rounded-2xl">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mascot */}
            <div className="flex items-center gap-4">
              <img src={mascotKodi} alt="Kodi" className="h-20 w-20 animate-bounce-soft" />
              <div className="glass rounded-2xl p-4">
                <p className="text-foreground font-medium">
                  "Welcome aboard! Let's unlock your coding superpowers!"
                </p>
                <p className="text-sm text-primary font-semibold mt-1">- Kodi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile Mascot */}
            <div className="lg:hidden flex justify-center mb-4">
              <img src={mascotKodi} alt="Kodi" className="h-16 w-16 animate-bounce-soft" />
            </div>

            <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="gradient-primary p-5 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white font-display">Create Your Account</h2>
                <p className="text-white/80 text-sm">Get 7 days free access</p>
              </div>

              <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-foreground font-medium flex items-center gap-2 text-sm">
                      <User className="h-3.5 w-3.5 text-primary" />
                      Full Name
                    </Label>
                    <Input
                      placeholder="Enter your full name"
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      className="h-11 rounded-xl"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-foreground font-medium flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      Mobile Number
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-foreground font-medium flex items-center gap-2 text-sm">
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                        Class
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

                    <div className="space-y-1.5">
                      <Label className="text-foreground font-medium flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        Email <span className="text-muted-foreground">(Optional)</span>
                      </Label>
                      <Input
                        type="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-11 rounded-xl"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-foreground font-medium flex items-center gap-2 text-sm">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 6 chars)"
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
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-foreground font-medium flex items-center gap-2 text-sm">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      Confirm Password
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
                    className="w-full h-12 rounded-xl text-base gap-2 font-semibold mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Create Account
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Info */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-turquoise" />
                  <span>Activation by admin after signup</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
