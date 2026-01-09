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
  UserCircle
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import mascotKodi from "@/assets/mascot-kodi.png";

type LoginMode = "individual" | "school";

export default function StudentLogin() {
  const navigate = useNavigate();
  const { student, loading, signIn, signInWithMobile } = useStudentAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode | null>(null);

  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
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
        // Check if user is not registered - redirect to signup with pre-filled data
        if (error.code === "NOT_REGISTERED") {
          toast({ 
            title: "Not Registered", 
            description: "Let's create your account first!",
          });
          // Navigate to signup with pre-filled data
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
        <header className="relative z-10 p-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group w-fit" 
            onClick={() => navigate("/")}
          >
            <img src={brainLogo} alt="KodeIntel" className="h-12 group-hover:scale-105 transition-transform" />
            <h1 className="text-xl font-bold text-foreground font-display">
              Kode<span className="text-primary">Intel</span>
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-4xl">
            {/* Welcome Message */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <img src={mascotKodi} alt="Kodi" className="h-28 w-28 animate-bounce-soft" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-display">
                Welcome, <span className="text-gradient-primary">Future Innovator!</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Choose how you'd like to sign in and start your learning adventure
              </p>
            </div>

            {/* Login Mode Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Individual Student Card */}
              <button
                onClick={() => setLoginMode("individual")}
                className="group relative glass rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div className="absolute inset-0 gradient-primary rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <UserCircle className="h-9 w-9 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 font-display">Individual Student</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    I signed up on my own to explore and learn AI & coding
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    <span>Continue with Mobile</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-xs bg-turquoise/20 text-turquoise px-3 py-1 rounded-full font-medium">
                    Sign up available
                  </span>
                </div>
              </button>

              {/* School Student Card */}
              <button
                onClick={() => setLoginMode("school")}
                className="group relative glass rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-coral/30 focus:outline-none focus:ring-2 focus:ring-coral/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-coral to-sunny rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-sunny flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <School className="h-9 w-9 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 font-display">School Student</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    My school provided me access through KodeIntel program
                  </p>
                  <div className="flex items-center gap-2 text-coral font-medium text-sm">
                    <span>Continue with Username</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-xs bg-coral/20 text-coral px-3 py-1 rounded-full font-medium">
                    School access
                  </span>
                </div>
              </button>
            </div>

            {/* Features */}
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {[
                { icon: Play, label: "Video Lessons" },
                { icon: BookOpen, label: "E-Books" },
                { icon: Trophy, label: "Badges & XP" },
                { icon: Brain, label: "AI Learning" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 p-6 text-center">
          <p className="text-sm text-muted-foreground">
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
          onClick={() => setLoginMode(null)}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back
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
