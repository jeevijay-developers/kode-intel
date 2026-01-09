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

  const signIn = async (username: string, password: string, studentType: string = "school_provided") => {
    // Query for school-provided students by username
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("username", username)
      .eq("temp_password", password)
      .eq("is_active", true)
      .eq("student_type", studentType)
      .maybeSingle();

    if (error) {
      return { error: { message: error.message } };
    }

    if (!data) {
      return { error: { message: "Invalid username or password. Please check your credentials." } };
    }

    // Store student session
    localStorage.setItem("student_session", JSON.stringify(data));
    setStudent(data as Student);
    return { error: null };
  };

  const signInWithMobile = async (mobileNumber: string, password: string, studentType: string = "individual") => {
    // Query for individual students by mobile number
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("mobile_number", mobileNumber)
      .eq("temp_password", password)
      .eq("is_active", true)
      .eq("student_type", studentType)
      .maybeSingle();

    if (error) {
      return { error: { message: error.message } };
    }

    if (!data) {
      return { error: { message: "Invalid mobile number or password. Please check your credentials." } };
    }

    // Store student session
    localStorage.setItem("student_session", JSON.stringify(data));
    setStudent(data as Student);
    return { error: null };
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
    updatePassword,
    signOut,
    getTrialDaysRemaining,
    isTrialExpired,
  };
}
