import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Phone, 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  Sparkles,
  Play,
  BookOpen,
  Trophy,
  Brain,
  Star,
  CheckCircle2,
  ArrowRight,
  School,
  UserCircle,
  Building2,
  Mail,
  Users,
  ArrowLeft,
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import mascotKodi from "@/assets/mascot-kodi.png";

type LoginMode = "individual" | "school" | "institution" | null;

export default function StudentLogin() {
  const navigate = useNavigate();
  const { student, loading, signIn, signInWithMobile } = useStudentAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>(null);

  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && student) {
      navigate("/student");
    }
  }, [student, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMode === "school") {
      if (!username.trim()) {
        toast({ title: "Please enter your username", variant: "destructive" });
        return;
      }
    } else if (loginMode === "institution") {
      if (!email.trim()) {
        toast({ title: "Please enter your email", variant: "destructive" });
        return;
      }
    } else {
      if (!mobileNumber.trim()) {
        toast({ title: "Please enter your mobile number", variant: "destructive" });
        return;
      }
    }
    
    if (!password) {
      toast({ title: "Please enter your password", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    if (loginMode === "institution") {
      // Institution login - redirect to institution dashboard
      // For now, we'll store in localStorage and redirect
      localStorage.setItem("institutionLogin", JSON.stringify({ email, attemptedAt: new Date() }));
      navigate("/institution/login");
      setIsSubmitting(false);
      return;
    }
    
    if (loginMode === "school") {
      const { error } = await signIn(username, password);
      setIsSubmitting(false);
      
      if (error) {
        toast({ 
          title: "Login Failed", 
          description: error.message, 
          variant: "destructive" 
        });
      } else {
        toast({ title: "Welcome back, Champion! 🎉" });
        navigate("/student");
      }
    } else {
      const { error } = await signInWithMobile(mobileNumber, password);
      setIsSubmitting(false);
      
      if (error) {
        if (error.code === "NOT_REGISTERED") {
          toast({ 
            title: "Not Registered", 
            description: "Let's create your account first!",
          });
          navigate("/student/signup", { 
            state: { 
              prefill: { 
                mobile_number: mobileNumber, 
                password: password 
              } 
            } 
          });
        } else {
          toast({ 
            title: "Login Failed", 
            description: error.message, 
            variant: "destructive" 
          });
        }
      } else {
        toast({ title: "Welcome back, Champion! 🎉" });
        navigate("/student");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
        </div>
      </div>
    );
  }

  // Mode Selection Screen
  if (!loginMode) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-coral/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
        </div>

        {/* Header */}
        <header className="relative z-10 p-4 sm:p-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group w-fit" 
            onClick={() => navigate("/")}
          >
            <img src={brainLogo} alt="KodeIntel" className="h-10 sm:h-12 group-hover:scale-105 transition-transform" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground font-display">
              Kode<span className="text-primary">Intel</span>
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
          <div className="w-full max-w-5xl">
            {/* Welcome Message */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="flex justify-center mb-4 sm:mb-6">
                <img src={mascotKodi} alt="Kodi" className="h-20 w-20 sm:h-28 sm:w-28 animate-bounce-soft" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 font-display">
                Welcome to <span className="text-gradient-primary">KodeIntel!</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-md mx-auto">
                Choose how you'd like to sign in
              </p>
            </div>

            {/* Login Mode Cards - 3 Columns */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* Individual Student Card */}
              <button
                onClick={() => setLoginMode("individual")}
                className="group relative glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div className="absolute inset-0 gradient-primary rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <UserCircle className="h-6 w-6 sm:h-9 sm:w-9 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2 font-display">Individual Student</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    I signed up on my own to explore AI & coding
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium text-xs sm:text-sm">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Login with Mobile</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="text-[10px] sm:text-xs bg-turquoise/20 text-turquoise px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                    7-day trial
                  </span>
                </div>
              </button>

              {/* School Student Card */}
              <button
                onClick={() => setLoginMode("school")}
                className="group relative glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-coral/30 focus:outline-none focus:ring-2 focus:ring-coral/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-coral to-sunny rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-coral to-sunny flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <School className="h-6 w-6 sm:h-9 sm:w-9 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2 font-display">School Student</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    My school provided me access through KodeIntel
                  </p>
                  <div className="flex items-center gap-2 text-coral font-medium text-xs sm:text-sm">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Login with Username</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="text-[10px] sm:text-xs bg-coral/20 text-coral px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                    School access
                  </span>
                </div>
              </button>

              {/* Institution Login Card */}
              <button
                onClick={() => navigate("/institution/login")}
                className="group relative glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-purple/30 focus:outline-none focus:ring-2 focus:ring-purple/50 sm:col-span-2 lg:col-span-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple to-primary rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple to-primary flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Building2 className="h-6 w-6 sm:h-9 sm:w-9 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2 font-display">Institution Portal</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    For schools, corporates & coaching centers
                  </p>
                  <div className="flex items-center gap-2 text-purple font-medium text-xs sm:text-sm">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Manage Students</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="text-[10px] sm:text-xs bg-purple/20 text-purple px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                    Admin access
                  </span>
                </div>
              </button>
            </div>

            {/* Guest Preview Option */}
            <div className="mt-6 sm:mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 text-muted-foreground">
                    or try for free
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/guest")}
                className="mt-4 sm:mt-6 group relative w-full max-w-md mx-auto glass rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-dashed border-turquoise/40 hover:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/50"
              >
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-bold text-foreground font-display">Try as Guest</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      24-hour free trial • No signup needed
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                { icon: Play, label: "Video Lessons" },
                { icon: BookOpen, label: "E-Books" },
                { icon: Trophy, label: "Badges & XP" },
                { icon: Brain, label: "AI Learning" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Need help? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
          </p>
        </footer>
      </div>
    );
  }

  // Login Form Screen
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group" 
          onClick={() => navigate("/")}
        >
          <img src={brainLogo} alt="KodeIntel" className="h-8 sm:h-10 group-hover:scale-105 transition-transform" />
          <h1 className="text-base sm:text-lg font-bold text-foreground font-display hidden sm:block">
            Kode<span className="text-primary">Intel</span>
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLoginMode(null)}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mascot */}
          <div className="flex justify-center mb-6">
            <img src={mascotKodi} alt="Kodi" className="h-20 w-20 animate-bounce-soft" />
          </div>

          <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl">
            {/* Card Header */}
            <div className={`p-6 text-center ${loginMode === "school" ? "bg-gradient-to-r from-coral to-sunny" : "gradient-primary"}`}>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                {loginMode === "school" ? (
                  <School className="h-7 w-7 text-white" />
                ) : (
                  <UserCircle className="h-7 w-7 text-white" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-white font-display">
                {loginMode === "school" ? "School Login" : "Student Login"}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {loginMode === "school" 
                  ? "Enter credentials provided by your school"
                  : "Sign in or we'll help you sign up"
                }
              </p>
            </div>

            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-5">
                {loginMode === "school" ? (
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-coral" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12 rounded-xl border-border/50 focus:border-coral bg-background/50"
                      disabled={isSubmitting}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-foreground font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="h-12 rounded-xl border-border/50 focus:border-primary bg-background/50"
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-border/50 focus:border-primary bg-background/50 pr-12"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full h-14 rounded-xl text-lg gap-2 font-semibold ${loginMode === "school" ? "bg-gradient-to-r from-coral to-sunny hover:opacity-90" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      {loginMode === "individual" ? "Continue" : "Start Learning"}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Individual students info */}
              {loginMode === "individual" && (
                <div className="mt-6 p-4 glass rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">New here?</span> Just enter your mobile & password above. We'll help you sign up if you're not registered!
                  </p>
                </div>
              )}

              {/* School students info */}
              {loginMode === "school" && (
                <div className="mt-6 p-4 glass rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Note:</span> School accounts are created by your school admin. Contact your teacher if you don't have access.
                  </p>
                </div>
              )}

              {/* Security Note */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-turquoise" />
                <span>Safe & Secure for Kids</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
