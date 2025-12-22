import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, User, Phone } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentLogin() {
  const navigate = useNavigate();
  const { student, loading, signIn, signInWithMobile } = useStudentAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && student) {
      navigate("/student");
    }
  }, [student, loading, navigate]);

  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({ title: "Please enter username and password", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(username, password);
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/student");
    }
  };

  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim() || !password.trim()) {
      toast({ title: "Please enter mobile number and password", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signInWithMobile(mobileNumber, password);
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/student");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading... 🚀</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-6 text-lg"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>

        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome Back! 👋</CardTitle>
            <CardDescription className="text-base">
              Enter your login details to start learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="username" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="username" className="gap-2">
                  <User className="h-4 w-4" />
                  Username
                </TabsTrigger>
                <TabsTrigger value="mobile" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Mobile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="username">
                <form onSubmit={handleUsernameLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-base">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isSubmitting}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-username" className="text-base">Password</Label>
                    <Input
                      id="password-username"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="h-12 text-base"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in... 🔄" : "Let's Go! 🚀"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="mobile">
                <form onSubmit={handleMobileLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-base">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      disabled={isSubmitting}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-mobile" className="text-base">Password</Label>
                    <Input
                      id="password-mobile"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="h-12 text-base"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in... 🔄" : "Let's Go! 🚀"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                🔑 Ask your teacher for your username and password if you don't have them!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
