import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Phone, 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  Sparkles,
  GraduationCap,
  Play,
  BookOpen,
  Trophy,
  Brain,
  Rocket,
  Star,
  Zap,
  Target,
  CheckCircle2,
  ArrowRight,
  Clock
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import mascotKodi from "@/assets/mascot-kodi.png";

const features = [
  { icon: Play, title: "Interactive Videos", description: "Fun video lessons that make learning exciting" },
  { icon: BookOpen, title: "Digital Workbooks", description: "Practice with colorful e-books" },
  { icon: Trophy, title: "Win Badges", description: "Earn rewards as you learn" },
  { icon: Brain, title: "AI Learning", description: "Discover how smart machines think" },
];

const stats = [
  { icon: Star, value: "1000+", label: "Happy Students" },
  { icon: Clock, value: "7 Days", label: "Free Trial" },
  { icon: Target, value: "100%", label: "Fun Learning" },
];

export default function StudentLogin() {
  const navigate = useNavigate();
  const { student, loading, signIn, signInWithMobile } = useStudentAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"username" | "mobile">("username");

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

    if (loginMethod === "username" && !username.trim()) {
      toast({ title: "Oops!", description: "Please enter your username", variant: "destructive" });
      return;
    }
    if (loginMethod === "mobile" && !mobileNumber.trim()) {
      toast({ title: "Oops!", description: "Please enter your mobile number", variant: "destructive" });
      return;
    }
    if (!password) {
      toast({ title: "Oops!", description: "Please enter your password", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = loginMethod === "username" 
      ? await signIn(username, password)
      : await signInWithMobile(mobileNumber, password);
    setIsSubmitting(false);

    if (error) {
      toast({ 
        title: "Login Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } else {
      toast({ title: "Welcome back, Champion!" });
      navigate("/student");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
        </div>
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
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-sunny/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        
        {/* Floating Elements */}
        <div className="absolute top-32 right-20 animate-bounce-soft hidden lg:block" style={{ animationDelay: "0.5s" }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunny to-coral flex items-center justify-center shadow-lg">
            <Rocket className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce-soft hidden lg:block" style={{ animationDelay: "1.5s" }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center shadow-lg">
            <Zap className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>

      {/* Left Panel - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-turquoise/5 to-accent/5" />
        
        <div className="relative z-10">
          {/* Logo */}
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

          {/* Hero Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 font-display leading-tight">
                Welcome, <span className="text-gradient-primary">Future Innovator!</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Start your exciting journey into the world of AI and coding. 
                Learn, play, and become a tech superstar!
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="glass rounded-2xl p-4 hover:shadow-lg transition-all hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mascot */}
        <div className="relative z-10 flex items-center gap-4">
          <img src={mascotKodi} alt="Kodi" className="h-24 w-24 animate-bounce-soft" />
          <div className="glass rounded-2xl p-4 max-w-xs">
            <p className="text-foreground font-medium">
              "Hey there! Ready to unlock your superpowers? Let's learn together!"
            </p>
            <p className="text-sm text-primary font-semibold mt-2">- Kodi, Your AI Buddy</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div 
            className="lg:hidden flex items-center justify-center gap-3 mb-8 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={brainLogo} alt="KodeIntel" className="h-12" />
            <h1 className="text-xl font-bold text-foreground font-display">
              Kode<span className="text-primary">Intel</span>
            </h1>
          </div>

          {/* Mobile Mascot */}
          <div className="lg:hidden flex justify-center mb-6">
            <img src={mascotKodi} alt="Kodi" className="h-20 w-20 animate-bounce-soft" />
          </div>

          <Card className="card-playful border-0 shadow-2xl overflow-hidden">
            {/* Card Header with Gradient */}
            <div className="gradient-primary p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-display">Student Login</h2>
              <p className="text-white/80 text-sm">Enter your credentials to start learning</p>
            </div>

            <CardContent className="p-6">
              {/* Login Method Tabs */}
              <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as "username" | "mobile")} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 p-1 glass rounded-xl">
                  <TabsTrigger 
                    value="username" 
                    className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-white gap-2"
                  >
                    <User className="h-4 w-4" />
                    Username
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mobile" 
                    className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-white gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleLogin} className="space-y-5">
                {loginMethod === "username" ? (
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12 rounded-xl border-border/50 focus:border-primary bg-background/50"
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
                  className="w-full h-14 rounded-xl text-lg gap-2 font-semibold btn-glow" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Start Learning
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Trial Badge */}
              <div className="mt-6 p-4 glass rounded-xl text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sunny to-coral flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-foreground">7 Days Free Trial</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Explore all courses free for a week!
                </p>
              </div>

              {/* Signup Link */}
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/student/signup")}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign up for free
                  </button>
                </p>
              </div>

              {/* Security Note */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-turquoise" />
                <span>Safe & Secure for Kids</span>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}