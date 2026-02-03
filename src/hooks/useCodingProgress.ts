import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStudentAuth } from './useStudentAuth';

interface CodingModule {
  id: string;
  chapter_id: string | null;
  title: string;
  description: string | null;
  difficulty_level: string;
  initial_blocks_xml: string | null;
  objective_text: string | null;
  validation_rules: any;
  xp_reward: number;
  order_index: number;
  class_level: number;
}

interface CodingProgress {
  id: string;
  student_id: string;
  module_id: string;
  completed_at: string | null;
  attempts: number;
  best_score: number | null;
  xp_earned: number;
}

interface CodingProject {
  id: string;
  student_id: string;
  title: string;
  blocks_xml: string;
  project_type: 'lesson' | 'free';
  module_id: string | null;
  class_level: number;
  thumbnail_data: string | null;
  created_at: string;
  updated_at: string;
}

export function useCodingProgress() {
  const { student } = useStudentAuth();
  const [modules, setModules] = useState<CodingModule[]>([]);
  const [progress, setProgress] = useState<CodingProgress[]>([]);
  const [projects, setProjects] = useState<CodingProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch coding modules for a class level
  const fetchModulesForClass = useCallback(async (classLevel: number) => {
    try {
      const { data, error } = await supabase
        .from('coding_modules')
        .select('*')
        .eq('class_level', classLevel)
        .eq('is_published', true)
        .order('order_index');

      if (error) throw error;
      setModules(data || []);
    } catch (err) {
      console.error('Error fetching coding modules:', err);
    }
  }, []);

  // Fetch student progress
  const fetchProgress = useCallback(async () => {
    if (!student?.id) return;

    try {
      const { data, error } = await supabase
        .from('coding_progress')
        .select('*')
        .eq('student_id', student.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (err) {
      console.error('Error fetching coding progress:', err);
    }
  }, [student?.id]);

  // Fetch student projects
  const fetchProjects = useCallback(async () => {
    if (!student?.id) return;

    try {
      const { data, error } = await supabase
        .from('coding_projects')
        .select('*')
        .eq('student_id', student.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data as CodingProject[] || []);
    } catch (err) {
      console.error('Error fetching coding projects:', err);
    }
  }, [student?.id]);

  // Save project
  const saveProject = useCallback(async (
    title: string,
    blocksXml: string,
    projectType: 'lesson' | 'free' = 'free',
    classLevel: number,
    moduleId?: string,
    existingProjectId?: string
  ): Promise<string | null> => {
    if (!student?.id) return null;

    try {
      if (existingProjectId) {
        // Update existing project
        const { error } = await supabase
          .from('coding_projects')
          .update({
            title,
            blocks_xml: blocksXml,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProjectId)
          .eq('student_id', student.id);

        if (error) throw error;
        await fetchProjects();
        return existingProjectId;
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('coding_projects')
          .insert({
            student_id: student.id,
            title,
            blocks_xml: blocksXml,
            project_type: projectType,
            class_level: classLevel,
            module_id: moduleId || null,
          })
          .select()
          .single();

        if (error) throw error;
        await fetchProjects();
        return data?.id || null;
      }
    } catch (err) {
      console.error('Error saving project:', err);
      return null;
    }
  }, [student?.id, fetchProjects]);

  // Mark module as completed
  const completeModule = useCallback(async (
    moduleId: string,
    score?: number
  ): Promise<boolean> => {
    if (!student?.id) return false;

    try {
      // Get module to find XP reward
      const module = modules.find(m => m.id === moduleId);
      if (!module) return false;

      // Check if progress exists
      const existing = progress.find(p => p.module_id === moduleId);

      if (existing) {
        // Update existing progress
        const { error } = await supabase
          .from('coding_progress')
          .update({
            attempts: existing.attempts + 1,
            completed_at: new Date().toISOString(),
            best_score: score ? Math.max(existing.best_score || 0, score) : existing.best_score,
            xp_earned: existing.xp_earned > 0 ? existing.xp_earned : module.xp_reward,
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new progress
        const { error } = await supabase
          .from('coding_progress')
          .insert({
            student_id: student.id,
            module_id: moduleId,
            completed_at: new Date().toISOString(),
            attempts: 1,
            best_score: score || null,
            xp_earned: module.xp_reward,
          });

        if (error) throw error;
      }

      await fetchProgress();
      return true;
    } catch (err) {
      console.error('Error completing module:', err);
      return false;
    }
  }, [student?.id, modules, progress, fetchProgress]);

  // Delete project
  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    if (!student?.id) return false;

    try {
      const { error } = await supabase
        .from('coding_projects')
        .delete()
        .eq('id', projectId)
        .eq('student_id', student.id);

      if (error) throw error;
      await fetchProjects();
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      return false;
    }
  }, [student?.id, fetchProjects]);

  // Get completion status for a module
  const getModuleProgress = useCallback((moduleId: string): CodingProgress | undefined => {
    return progress.find(p => p.module_id === moduleId);
  }, [progress]);

  // Initial load
  useEffect(() => {
    if (student?.id) {
      setLoading(true);
      Promise.all([fetchProgress(), fetchProjects()])
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [student?.id, fetchProgress, fetchProjects]);

  return {
    modules,
    progress,
    projects,
    loading,
    fetchModulesForClass,
    saveProject,
    completeModule,
    deleteProject,
    getModuleProgress,
    refetch: () => Promise.all([fetchProgress(), fetchProjects()]),
  };
}
