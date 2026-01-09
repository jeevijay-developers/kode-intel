import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Play,
  HelpCircle,
  BookOpen,
  CheckCircle,
  Code,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  play: Play,
  "help-circle": HelpCircle,
  "book-open": BookOpen,
  "check-circle": CheckCircle,
  code: Code,
};

interface AchievementCardProps {
  name: string;
  description?: string;
  icon: string;
  progress: number;
  targetValue: number;
  pointsReward: number;
  completed: boolean;
}

export function AchievementCard({
  name,
  description,
  icon,
  progress,
  targetValue,
  pointsReward,
  completed,
}: AchievementCardProps) {
  const Icon = iconMap[icon] || CheckCircle;
  const progressPercent = Math.min((progress / targetValue) * 100, 100);

  return (
    <div
      className={cn(
        "p-4 rounded-2xl border-2 transition-all duration-300",
        completed
          ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30"
          : "bg-card border-border hover:border-primary/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            completed
              ? "bg-gradient-to-br from-primary to-secondary"
              : "bg-muted"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              completed ? "text-white" : "text-muted-foreground"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={cn(
                "font-semibold text-sm truncate",
                completed ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {name}
            </h4>
            <span
              className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-full shrink-0",
                completed
                  ? "bg-sunny/20 text-sunny"
                  : "bg-muted text-muted-foreground"
              )}
            >
              +{pointsReward} XP
            </span>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {progress}/{targetValue}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </div>
      {completed && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-primary font-medium">
          <CheckCircle className="h-4 w-4" />
          Achievement Unlocked!
        </div>
      )}
    </div>
  );
}
