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
    // Check localStorage for existing student session
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
      return { error: { message: error.message } };
    }

    if (!data) {
      return { error: { message: "Invalid username or password. Please check your credentials or contact your school admin." } };
    }

    localStorage.setItem("student_session", JSON.stringify(data));
    setStudent(data as Student);
    return { error: null };
  };

  // Login for individual students (mobile + password)
  // Individual students can login if they have active trial OR are fully activated
  const signInWithMobile = async (mobileNumber: string, password: string) => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("mobile_number", mobileNumber)
      .eq("temp_password", password)
      .eq("student_type", "individual")
      .maybeSingle();

    if (error) {
      return { error: { message: error.message } };
    }

    if (!data) {
      return { error: { message: "Invalid mobile number or password. Please check your credentials." } };
    }

    // Check if individual student can access (either activated OR has active trial)
    const hasActiveTrial = data.is_trial_active && data.trial_end_date && new Date(data.trial_end_date) > new Date();
    const isActivated = data.is_active;

    if (!hasActiveTrial && !isActivated) {
      return { error: { message: "Your trial has expired. Please contact support to continue learning." } };
    }

    localStorage.setItem("student_session", JSON.stringify(data));
    setStudent(data as Student);
    return { error: null };
  };

  // Auto-login after signup (for individual students)
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
