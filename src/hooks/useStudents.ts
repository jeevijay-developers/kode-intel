import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Student = Tables<"students"> & {
  schools?: {
    name: string;
    school_code: string;
  };
};

export type StudentInsert = TablesInsert<"students">;
export type StudentUpdate = TablesUpdate<"students">;

export interface StudentFilters {
  schoolId?: string;
  class?: string;
  isActive?: boolean;
  search?: string;
}

export function useStudents(filters?: StudentFilters) {
  return useQuery({
    queryKey: ["students", filters],
    queryFn: async () => {
      let query = supabase
        .from("students")
        .select("*, schools(name, school_code)")
        .order("created_at", { ascending: false });

      if (filters?.schoolId) {
        query = query.eq("school_id", filters.schoolId);
      }
      if (filters?.class) {
        query = query.eq("class", filters.class);
      }
      if (filters?.isActive !== undefined) {
        query = query.eq("is_active", filters.isActive);
      }
      if (filters?.search) {
        query = query.or(`student_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Student[];
    },
  });
}

export function useBulkCreateStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (students: StudentInsert[]) => {
      const { data, error } = await supabase
        .from("students")
        .insert(students)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: `${data.length} students created successfully` });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create students", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...student }: StudentUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("students")
        .update(student)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update student", description: error.message, variant: "destructive" });
    },
  });
}

export function useBulkUpdateStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, update }: { ids: string[]; update: StudentUpdate }) => {
      const { error } = await supabase
        .from("students")
        .update(update)
        .in("id", ids);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Students updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update students", description: error.message, variant: "destructive" });
    },
  });
}
