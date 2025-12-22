import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type School = Tables<"schools">;
export type SchoolInsert = Omit<TablesInsert<"schools">, "school_code"> & { school_code?: string };
export type SchoolUpdate = TablesUpdate<"schools">;

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: ["schools", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (school: SchoolInsert) => {
      const { data, error } = await supabase
        .from("schools")
        .insert({ ...school, school_code: school.school_code || "" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast({ title: "School created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create school", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...school }: SchoolUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("schools")
        .update(school)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast({ title: "School updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update school", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("schools")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast({ title: "School deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete school", description: error.message, variant: "destructive" });
    },
  });
}
