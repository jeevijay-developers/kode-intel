import { useNavigate } from "react-router-dom";
import { Trophy, ChevronRight, Sparkles, Lock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon: string;
  progress: number;
  target_value: number;
  points_reward: number;
  completed: boolean;
}

interface MobileAchievementsPreviewProps {
  achievements: Achievement[];
  completedCount: number;
  totalCount: number;
}

const iconMap: Record<string, string> = {
  "zap": "⚡",
  "star": "⭐",
  "trophy": "🏆",
  "medal": "🎖️",
  "crown": "👑",
  "fire": "🔥",
  "rocket": "🚀",
  "brain": "🧠",
  "book": "📚",
  "code": "💻",
  "target": "🎯",
  "award": "🏅",
};

export function MobileAchievementsPreview({
  achievements,
  completedCount,
  totalCount,
}: MobileAchievementsPreviewProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral to-sunny flex items-center justify-center shadow-md">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-bold text-base font-display">Achievements</h2>
        </div>
        <button
          onClick={() => navigate("/student/achievements")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-border/50 active:scale-95 transition-transform"
        >
          <Badge variant="secondary" className="bg-coral/10 text-coral border-0 text-xs px-2">
            {completedCount}/{totalCount}
          </Badge>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Achievement List */}
      <div className="space-y-2">
        {achievements.slice(0, 3).map((achievement) => {
          const progressPercent = Math.min(
            Math.round((achievement.progress / achievement.target_value) * 100),
            100
          );
          const iconEmoji = iconMap[achievement.icon.toLowerCase()] || "🏆";

          return (
            <button
              key={achievement.id}
              onClick={() => navigate("/student/achievements")}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98]",
                achievement.completed
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
                  : "bg-card border border-border/50 hover:border-primary/30"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 relative",
                  achievement.completed
                    ? "bg-gradient-to-br from-primary to-secondary shadow-md"
                    : "bg-muted"
                )}
              >
                <span className={cn(achievement.completed ? "grayscale-0" : "grayscale opacity-60")}>
                  {iconEmoji}
                </span>
                {achievement.completed && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">{achievement.name}</span>
                  {achievement.completed && (
                    <Sparkles className="h-3 w-3 text-sunny flex-shrink-0" />
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        achievement.completed
                          ? "bg-gradient-to-r from-primary to-secondary"
                          : "bg-primary/50"
                      )}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium w-8">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* Reward */}
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] px-2 py-0.5",
                    achievement.completed
                      ? "bg-sunny/20 text-sunny border-0"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  +{achievement.points_reward} XP
                </Badge>
              </div>
            </button>
          );
        })}
      </div>

      {/* View All Button */}
      {achievements.length > 3 && (
        <button
          onClick={() => navigate("/student/achievements")}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted/50 border border-border/30 active:scale-[0.98] transition-transform text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          View All Achievements
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
