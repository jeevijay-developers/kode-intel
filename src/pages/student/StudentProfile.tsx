/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronRight,
  Shield,
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
        title: "Password updated!",
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
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4 lg:space-y-6">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-5 lg:p-6">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
            <User className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-white">{student.student_name}</h1>
            <p className="text-white/70 text-sm lg:text-base">
              Class {student.class}
              {student.section && ` • Section ${student.section}`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-white/20 text-white border-0 text-xs">
                <Trophy className="h-3 w-3 mr-1" />
                Level {points?.current_level || 1}
              </Badge>
              {isTrial && (
                <Badge className="bg-sunny text-foreground text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {getTrialDaysRemaining()}d Trial
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative grid grid-cols-3 gap-2 mt-5">
          <div className="text-center p-3 bg-white/15 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Star className="h-4 w-4 text-sunny fill-sunny" />
              <span className="font-bold text-white">{points?.total_points || 0}</span>
            </div>
            <p className="text-[10px] text-white/70">XP</p>
          </div>
          <div className="text-center p-3 bg-white/15 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Flame className="h-4 w-4 text-coral" />
              <span className="font-bold text-white">{points?.streak_days || 0}</span>
            </div>
            <p className="text-[10px] text-white/70">Streak</p>
          </div>
          <div className="text-center p-3 bg-white/15 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Trophy className="h-4 w-4 text-lime" />
              <span className="font-bold text-white">{points?.current_level || 1}</span>
            </div>
            <p className="text-[10px] text-white/70">Level</p>
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
          Account Info
        </h2>
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-0 divide-y divide-border/50">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="font-medium truncate">{student.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Mobile</p>
                <p className="font-medium">{student.mobile_number}</p>
              </div>
            </div>

            {student.email && (
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium truncate">{student.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Class</p>
                <p className="font-medium">
                  {student.class}
                  {student.section && ` - Section ${student.section}`}
                </p>
              </div>
            </div>

            {school && (
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <School className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">School</p>
                  <p className="font-medium truncate">{school.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {school.city}, {school.state}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Settings Section */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
          Settings
        </h2>
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="flex items-center gap-3 p-4 w-full text-left hover:bg-muted/50 transition-colors active:bg-muted"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your login password</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isUpdating}
                    className="h-12 rounded-xl"
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
                    className="h-12 rounded-xl"
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
                    className="flex-1 h-11 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isUpdating} 
                    className="flex-1 h-11 rounded-xl"
                  >
                    {isUpdating ? (
                      "Saving..."
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Logout Button */}
      <Button
        variant="destructive"
        onClick={handleSignOut}
        className="w-full h-12 text-base rounded-2xl"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  );
}
