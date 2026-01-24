import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInstitutionAuth } from "@/hooks/useInstitutionAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  BarChart3,
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";

export default function InstitutionLogin() {
  const navigate = useNavigate();
  const { institution, loading, signIn } = useInstitutionAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && institution) {
      navigate("/institution");
    }
  }, [institution, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    if (!password) {
      toast({ title: "Please enter your password", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/institution");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary p-12 text-white flex-col justify-between">
        <div>
          <div
            className="flex items-center gap-3 cursor-pointer mb-12"
            onClick={() => navigate("/")}
          >
            <img src={brainLogo} alt="KodeIntel" className="h-12" />
            <h1 className="text-2xl font-bold font-display">
              Kode<span className="opacity-80">Intel</span>
            </h1>
          </div>

          <h2 className="text-4xl font-bold font-display mb-6">
            Institution Portal
          </h2>
          <p className="text-xl opacity-90 mb-12">
            Manage your students, courses, and track learning progress all in one place.
          </p>

          {/* Features */}
          <div className="space-y-6">
            {[
              { icon: Users, title: "Student Management", desc: "Add, manage, and track all your students" },
              { icon: BookOpen, title: "Course Access", desc: "Assign courses and manage curriculum" },
              { icon: BarChart3, title: "Analytics & Reports", desc: "Track progress and generate reports" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm opacity-80">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm opacity-60">
          © 2024 KodeIntel. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div
            className="lg:hidden flex items-center gap-3 cursor-pointer mb-8 justify-center"
            onClick={() => navigate("/")}
          >
            <img src={brainLogo} alt="KodeIntel" className="h-12" />
            <h1 className="text-2xl font-bold font-display">
              Kode<span className="text-primary">Intel</span>
            </h1>
          </div>

          <Card className="border-0 shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center rounded-t-xl">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold font-display">Institution Login</h2>
              <p className="text-sm opacity-80 mt-1">Access your institution dashboard</p>
            </div>

            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="institution@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
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
                      className="h-12 rounded-xl pr-12"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-secondary text-lg font-semibold"
                >
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

              <div className="mt-6 pt-6 border-t text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?
                </p>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigate("/institution/signup")}
                >
                  <Sparkles className="h-4 w-4" />
                  Register Your Institution
                </Button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/student/login")}
                  className="text-sm text-primary hover:underline"
                >
                  ← Back to Student Login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}