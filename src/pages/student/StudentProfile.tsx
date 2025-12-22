import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  ArrowLeft,
  User,
  School,
  BookOpen,
  Phone,
  Mail,
  Lock,
  LogOut,
  Check,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { student, loading, signOut, updatePassword } = useStudentAuth();
  const { toast } = useToast();
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  // Fetch school info
  const { data: school } = useQuery({
    queryKey: ["student-school", student?.school_id],
    queryFn: async () => {
      if (!student) return null;
      const { data, error } = await supabase
        .from("schools")
        .select("name, city, state")
        .eq("id", student.school_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!student?.school_id,
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 4) {
      toast({ title: "Password too short", description: "Password must be at least 4 characters", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are the same", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    const { error } = await updatePassword(newPassword);
    setIsUpdating(false);

    if (error) {
      toast({ title: "Failed to update password", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated! 🎉", description: "Your new password is now active" });
      setShowPasswordForm(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate("/student/login");
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading... 🚀</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/student")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">My Profile</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="text-center pb-2">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">{student.student_name}</CardTitle>
            <CardDescription className="text-base">
              Class {student.class}{student.section && ` - Section ${student.section}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Student Details */}
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{student.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-medium">{student.mobile_number}</p>
                </div>
              </div>

              {student.email && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">
                    {student.class}{student.section && ` - Section ${student.section}`}
                  </p>
                </div>
              </div>

              {school && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <School className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">School</p>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-sm text-muted-foreground">{school.city}, {school.state}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              You can change your password here anytime
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showPasswordForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordForm(true)}
                className="w-full h-12"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change My Password
              </Button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isUpdating}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Enter password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isUpdating}
                    className="h-12"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    {isUpdating ? "Saving..." : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          onClick={handleSignOut}
          className="w-full mt-6 h-12 text-lg"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </main>
    </div>
  );
}
