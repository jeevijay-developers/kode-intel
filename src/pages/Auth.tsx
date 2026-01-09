import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff,
  Sparkles,
  GraduationCap,
  BookOpen,
  Code,
  Brain,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { z } from "zod";
import kodeIntelLogo from "@/assets/kode-intel-logo.png";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const features = [
  { icon: GraduationCap, text: "Manage Schools & Students" },
  { icon: BookOpen, text: "Create & Organize Courses" },
  { icon: Code, text: "Configure Compiler Settings" },
  { icon: Brain, text: "Track Learning Progress" },
];

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");

  useEffect(() => {
    if (user && !loading) {
      navigate("/admin");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Validation Error", description: err.errors[0].message, variant: "destructive" });
        return;
      }
    }

    setIsSubmitting(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast({ title: "Login Failed", description: "Invalid email or password", variant: "destructive" });
      } else {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Welcome back!" });
      navigate("/admin");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPassword);
      if (!signupFullName.trim()) {
        throw new Error("Please enter your full name");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Validation Error", description: err.errors[0].message, variant: "destructive" });
      } else if (err instanceof Error) {
        toast({ title: "Validation Error", description: err.message, variant: "destructive" });
      }
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(signupEmail, signupPassword, signupFullName);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({ title: "Signup Failed", description: "This email is already registered", variant: "destructive" });
      } else {
        toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Account created!", description: "You can now sign in" });
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-coral/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 pattern-grid opacity-30" />
      </div>

      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 relative gradient-mesh p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-turquoise/5" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <img src={kodeIntelLogo} alt="KodeIntel" className="h-12 w-12 rounded-xl" />
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">KODE INTEL</h1>
              <p className="text-sm text-muted-foreground">Admin Portal</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4 font-display">
                Welcome to the <span className="text-gradient-primary">Control Center</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
                Manage your entire KodeIntel platform from one powerful dashboard. Schools, students, courses - all at your fingertips.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 glass rounded-2xl animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Enterprise Security</p>
              <p className="text-sm text-muted-foreground">Your data is protected</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["SSL", "2FA", "Encrypted"].map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src={kodeIntelLogo} alt="KodeIntel" className="h-10 w-10 rounded-xl" />
            <h1 className="text-xl font-bold text-foreground font-display">KODE INTEL</h1>
          </div>

          <Card className="card-playful border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
                  <div className="relative p-4 gradient-primary rounded-2xl">
                    <Lock className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl font-display">Admin Portal</CardTitle>
              <CardDescription>Sign in to manage your platform</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 glass rounded-xl">
                  <TabsTrigger value="login" className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="animate-fade-in">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-foreground font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="admin@school.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-11 h-12 rounded-xl border-border/50 focus:border-primary bg-background/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-foreground font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-11 pr-11 h-12 rounded-xl border-border/50 focus:border-primary bg-background/50"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl text-base gap-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="animate-fade-in">
                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-foreground font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signupFullName}
                          onChange={(e) => setSignupFullName(e.target.value)}
                          className="pl-11 h-12 rounded-xl border-border/50 focus:border-primary bg-background/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-foreground font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="admin@school.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-11 h-12 rounded-xl border-border/50 focus:border-primary bg-background/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-foreground font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-11 pr-11 h-12 rounded-xl border-border/50 focus:border-primary bg-background/50"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl text-base gap-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-turquoise" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Need help? Contact{" "}
            <a href="mailto:support@kodeintel.com" className="text-primary hover:underline">
              support@kodeintel.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
