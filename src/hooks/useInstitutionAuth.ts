import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Institution {
  id: string;
  institution_name: string;
  institution_type: string;
  contact_person: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  is_active: boolean;
  expected_student_count: number;
  logo_url?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

interface AuthError {
  message: string;
  code?: string;
}

// Hash password using edge function
async function hashPassword(password: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('hash-password', {
      body: { action: 'hash', password }
    });
    if (error) throw error;
    return data.hash;
  } catch (err) {
    console.error('Hash password error:', err);
    return null;
  }
}

// Verify password using edge function
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('hash-password', {
      body: { action: 'verify', password, storedHash }
    });
    if (error) throw error;
    return data.valid === true;
  } catch (err) {
    console.error('Verify password error:', err);
    return false;
  }
}

export function useInstitutionAuth() {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("institutionSession");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInstitution(parsed);
      } catch {
        localStorage.removeItem("institutionSession");
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      // First get the institution by email
      const { data, error } = await supabase
        .from("institution_accounts")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { error: { message: "Invalid email or password", code: "INVALID_CREDENTIALS" } };
      }

      // Verify password using edge function
      const isValidPassword = await verifyPassword(password, data.password_hash);
      
      if (!isValidPassword) {
        return { error: { message: "Invalid email or password", code: "INVALID_CREDENTIALS" } };
      }

      // Remove password_hash from stored data
      const institutionData: Institution = {
        id: data.id,
        institution_name: data.institution_name,
        institution_type: data.institution_type,
        contact_person: data.contact_person,
        email: data.email,
        phone: data.phone,
        city: data.city,
        state: data.state,
        is_active: data.is_active,
        expected_student_count: data.expected_student_count || 0,
        logo_url: data.logo_url,
        address: data.address,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      localStorage.setItem("institutionSession", JSON.stringify(institutionData));
      setInstitution(institutionData);
      return { error: null };
    } catch (err) {
      return { error: { message: err instanceof Error ? err.message : "Login failed" } };
    }
  };

  const signUp = async (data: {
    institution_name: string;
    institution_type: string;
    contact_person: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    password: string;
    expected_student_count?: number;
    address?: string;
  }): Promise<{ error: AuthError | null }> => {
    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from("institution_accounts")
        .select("id")
        .eq("email", data.email.toLowerCase().trim())
        .maybeSingle();

      if (existing) {
        return { error: { message: "An institution with this email already exists", code: "EMAIL_EXISTS" } };
      }

      // Hash password using edge function
      const hashedPassword = await hashPassword(data.password);
      if (!hashedPassword) {
        return { error: { message: "Failed to secure password. Please try again.", code: "HASH_ERROR" } };
      }

      // Create institution account
      const { data: newInstitution, error } = await supabase
        .from("institution_accounts")
        .insert({
          institution_name: data.institution_name.trim(),
          institution_type: data.institution_type as "school" | "corporate" | "coaching" | "other",
          contact_person: data.contact_person.trim(),
          email: data.email.toLowerCase().trim(),
          phone: data.phone.trim(),
          city: data.city.trim(),
          state: data.state.trim(),
          password_hash: hashedPassword,
          expected_student_count: data.expected_student_count || 0,
          address: data.address?.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      const institutionData: Institution = {
        id: newInstitution.id,
        institution_name: newInstitution.institution_name,
        institution_type: newInstitution.institution_type,
        contact_person: newInstitution.contact_person,
        email: newInstitution.email,
        phone: newInstitution.phone,
        city: newInstitution.city,
        state: newInstitution.state,
        is_active: newInstitution.is_active,
        expected_student_count: newInstitution.expected_student_count || 0,
        logo_url: newInstitution.logo_url,
        address: newInstitution.address,
        created_at: newInstitution.created_at,
        updated_at: newInstitution.updated_at,
      };

      localStorage.setItem("institutionSession", JSON.stringify(institutionData));
      setInstitution(institutionData);
      return { error: null };
    } catch (err) {
      return { error: { message: err instanceof Error ? err.message : "Registration failed" } };
    }
  };

  const signOut = () => {
    localStorage.removeItem("institutionSession");
    setInstitution(null);
  };

  const updateProfile = async (updates: Partial<Omit<Institution, 'institution_type'> & { institution_type?: "school" | "corporate" | "coaching" | "other" }>): Promise<{ error: AuthError | null }> => {
    if (!institution) return { error: { message: "Not logged in" } };

    try {
      const { error } = await supabase
        .from("institution_accounts")
        .update(updates)
        .eq("id", institution.id);

      if (error) throw error;

      const updated = { ...institution, ...updates } as Institution;
      localStorage.setItem("institutionSession", JSON.stringify(updated));
      setInstitution(updated);
      return { error: null };
    } catch (err) {
      return { error: { message: err instanceof Error ? err.message : "Update failed" } };
    }
  };

  return {
    institution,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
