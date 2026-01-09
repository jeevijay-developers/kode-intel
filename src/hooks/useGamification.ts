import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  points_required: number;
  badge_type: string;
}

interface StudentBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badges: Badge;
}

interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  achievement_type: string;
  target_value: number;
  points_reward: number;
}

interface StudentAchievement {
  id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  achievements: Achievement;
}

interface StudentPoints {
  total_points: number;
  current_level: number;
  streak_days: number;
  last_activity_date: string | null;
}

export function useGamification(studentId: string | undefined) {
  // Fetch all badges
  const { data: allBadges = [] } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .order("points_required", { ascending: true });
      if (error) throw error;
      return data as Badge[];
    },
  });

  // Fetch student's earned badges
  const { data: studentBadges = [] } = useQuery({
    queryKey: ["student-badges", studentId],
    queryFn: async () => {
      if (!studentId) return [];
      const { data, error } = await supabase
        .from("student_badges")
        .select("*, badges(*)")
        .eq("student_id", studentId);
      if (error) throw error;
      return data as StudentBadge[];
    },
    enabled: !!studentId,
  });

  // Fetch all achievements
  const { data: allAchievements = [] } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("target_value", { ascending: true });
      if (error) throw error;
      return data as Achievement[];
    },
  });

  // Fetch student's achievement progress
  const { data: studentAchievements = [] } = useQuery({
    queryKey: ["student-achievements", studentId],
    queryFn: async () => {
      if (!studentId) return [];
      const { data, error } = await supabase
        .from("student_achievements")
        .select("*, achievements(*)")
        .eq("student_id", studentId);
      if (error) throw error;
      return data as StudentAchievement[];
    },
    enabled: !!studentId,
  });

  // Fetch student points
  const { data: studentPoints } = useQuery({
    queryKey: ["student-points", studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const { data, error } = await supabase
        .from("student_points")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle();
      if (error) throw error;
      return data as StudentPoints | null;
    },
    enabled: !!studentId,
  });

  // Combine badges with earned status
  const badgesWithStatus = allBadges.map((badge) => {
    const earned = studentBadges.find((sb) => sb.badge_id === badge.id);
    return {
      ...badge,
      earned: !!earned,
      earnedAt: earned?.earned_at,
    };
  });

  // Combine achievements with progress
  const achievementsWithProgress = allAchievements.map((achievement) => {
    const progress = studentAchievements.find(
      (sa) => sa.achievement_id === achievement.id
    );
    return {
      ...achievement,
      progress: progress?.progress || 0,
      completed: progress?.completed || false,
      completedAt: progress?.completed_at,
    };
  });

  const earnedBadgesCount = studentBadges.length;
  const completedAchievementsCount = studentAchievements.filter(
    (sa) => sa.completed
  ).length;

  return {
    badges: badgesWithStatus,
    achievements: achievementsWithProgress,
    points: studentPoints || {
      total_points: 0,
      current_level: 1,
      streak_days: 0,
      last_activity_date: null,
    },
    earnedBadgesCount,
    completedAchievementsCount,
    totalBadges: allBadges.length,
    totalAchievements: allAchievements.length,
  };
}
