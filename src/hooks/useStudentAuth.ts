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
  school_id: string;
  is_active: boolean;
}

export function useStudentAuth() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

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

  const signIn = async (username: string, password: string) => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("username", username)
      .eq("temp_password", password)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      return { error: { message: error.message } };
    }

    if (!data) {
      return { error: { message: "Invalid username or password" } };
    }

    // Store student session
    localStorage.setItem("student_session", JSON.stringify(data));
    setStudent(data);
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
    signOut,
  };
}
