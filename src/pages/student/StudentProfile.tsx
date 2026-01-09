/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  School,
  BookOpen,
  Phone,
  Mail,
  Lock,
  LogOut,
  Check,
  Star,
  Flame,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OutletContext {
  student: any;
  points: any;
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const { student, points } = useOutletContext<OutletContext>();
  const { signOut, updatePassword, getTrialDaysRemaining, isTrialExpired } = useStudentAuth();
  const { toast } = useToast();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const isTrial = student?.subscription_status === "trial" && !isTrialExpired();

  // Fetch school info
  const { data: school } = useQuery({
    queryKey: ["student-school", student?.school_id],
    queryFn: async () => {
      if (!student?.school_id) return null;
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
      toast({
        title: "Password too short",
        description: "Password must be at least 4 characters",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    const { error } = await updatePassword(newPassword);
    setIsUpdating(false);

    if (error) {
      toast({
        title: "Failed to update password",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated! 🎉",
        description: "Your new password is now active",
      });
      setShowPasswordForm(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSignOut = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      signOut();
      navigate("/student/login");
    }
  };

  if (!student) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{student.student_name}</h1>
              <p className="text-muted-foreground">
                Class {student.class}
                {student.section && ` - Section ${student.section}`}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/10">
                  <Trophy className="h-3 w-3 mr-1" />
                  Level {points?.current_level || 1}
                </Badge>
                {isTrial && (
                  <Badge className="bg-sunny text-foreground">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {getTrialDaysRemaining()} Days Trial
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-sunny/10 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 text-sunny fill-sunny" />
                <span className="font-bold text-sunny">{points?.total_points || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">XP Points</p>
            </div>
            <div className="text-center p-3 bg-coral/10 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="h-4 w-4 text-coral" />
                <span className="font-bold text-coral">{points?.streak_days || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="font-bold text-primary">{points?.current_level || 1}</span>
              </div>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
          </div>

          {/* Student Details */}
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="font-medium">{student.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Mobile Number</p>
                <p className="font-medium">{student.mobile_number}</p>
              </div>
            </div>

            {student.email && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Class</p>
                <p className="font-medium">
                  {student.class}
                  {student.section && ` - Section ${student.section}`}
                </p>
              </div>
            </div>

            {school && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <School className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">School</p>
                  <p className="font-medium">{school.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {school.city}, {school.state}
                  </p>
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
                <Button type="submit" disabled={isUpdating} className="flex-1">
                  {isUpdating ? (
                    "Saving..."
                  ) : (
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
        className="w-full h-12 text-lg"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  );
}