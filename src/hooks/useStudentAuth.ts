import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  student_name: string;
  username: string;
  email: string | null;
  mobile_number: string;
  class: string;
  section: string | null;
  school_id: string | null;
  is_active: boolean;
  trial_start_date: string | null;
  trial_end_date: string | null;
  is_trial_active: boolean;
  subscription_status: string;
  student_type: string;
  activation_status: string;
}

interface AuthError {
  message: string;
  code?: string;
}

export function useStudentAuth() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const getTrialDaysRemaining = () => {
    if (!student?.trial_end_date) return 0;
    const endDate = new Date(student.trial_end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const isTrialExpired = () => {
    if (!student?.trial_end_date) return false;
    return new Date(student.trial_end_date) < new Date();
  };

  useEffect(() => {
    const storedStudent = localStorage.getItem("student_session");
    if (storedStudent) {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch {
        localStorage.removeItem("student_session");
      }
    }
    setLoading(false);
  }, []);

  // Login for school-provided students (username + password)
  const signIn = async (username: string, password: string) => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("username", username)
      .eq("temp_password", password)
      .eq("student_type", "school_provided")
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      return { error: { message: error.message } as AuthError };
    }

    if (!data) {
      return { error: { message: "Invalid username or password. Please check your credentials or contact your school admin." } as AuthError };
    }

    localStorage.setItem("student_session", JSON.stringify(data));
    setStudent(data as Student);
    return { error: null };
  };

  // Login for individual students (mobile + password)
  const signInWithMobile = async (mobileNumber: string, password: string) => {
    // First check if user exists with this mobile number
    const { data: existingUser, error: checkError } = await supabase
      .from("students")
      .select("*")
      .eq("mobile_number", mobileNumber)
      .eq("student_type", "individual")
      .maybeSingle();

    if (checkError) {
      return { error: { message: checkError.message } as AuthError };
    }

    // User doesn't exist - return special code to redirect to signup
    if (!existingUser) {
      return { 
        error: { 
          message: "You're not registered yet. Let's complete your signup!", 
          code: "NOT_REGISTERED" 
        } as AuthError 
      };
    }

    // User exists but password doesn't match
    if (existingUser.temp_password !== password) {
      return { error: { message: "Incorrect password. Please try again." } as AuthError };
    }

    // Check if individual student can access (either activated OR has active trial)
    const hasActiveTrial = existingUser.is_trial_active && existingUser.trial_end_date && new Date(existingUser.trial_end_date) > new Date();
    const isActivated = existingUser.is_active;

    if (!hasActiveTrial && !isActivated) {
      return { error: { message: "Your trial has expired. Please contact support to continue learning." } as AuthError };
    }

    localStorage.setItem("student_session", JSON.stringify(existingUser));
    setStudent(existingUser as Student);
    return { error: null };
  };

  // Auto-login after signup
  const autoLogin = (studentData: Student) => {
    localStorage.setItem("student_session", JSON.stringify(studentData));
    setStudent(studentData);
  };

  const updatePassword = async (newPassword: string) => {
    if (!student) {
      return { error: { message: "Not logged in" } };
    }

    const { error } = await supabase
      .from("students")
      .update({ temp_password: newPassword })
      .eq("id", student.id);

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  };

  const signOut = () => {
    localStorage.removeItem("student_session");
    setStudent(null);
  };

  return {
    student,
    loading,
    signIn,
    signInWithMobile,
    autoLogin,
    updatePassword,
    signOut,
    getTrialDaysRemaining,
    isTrialExpired,
  };
}
