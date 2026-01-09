import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Star, Clock, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyChallengeProps {
  title: string;
  description: string;
  reward: number;
  progress?: number;
  maxProgress?: number;
  type?: "video" | "quiz" | "code" | "streak";
  onClick?: () => void;
  className?: string;
  isCompleted?: boolean;
}

const typeConfig = {
  video: { icon: "📺", label: "Watch" },
  quiz: { icon: "❓", label: "Quiz" },
  code: { icon: "💻", label: "Code" },
  streak: { icon: "🔥", label: "Streak" },
};

export function DailyChallenge({
  title,
  description,
  reward,
  progress = 0,
  maxProgress = 1,
  type = "video",
  onClick,
  className,
  isCompleted = false,
}: DailyChallengeProps) {
  const config = typeConfig[type];
  const progressPercent = Math.min(100, (progress / maxProgress) * 100);

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer group",
        isCompleted 
          ? "bg-gradient-to-br from-lime/20 to-turquoise/10 border-lime/30" 
          : "bg-gradient-to-br from-sunny/10 via-coral/5 to-pink/10 border-sunny/20 hover:border-sunny/40",
        className
      )}
      onClick={onClick}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sunny/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
      
      <CardContent className="p-3 sm:p-4 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sunny/20 to-coral/20 flex items-center justify-center text-lg shrink-0">
              {isCompleted ? "✅" : config.icon}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-sunny/10 border-sunny/30 text-sunny">
                  <Zap className="h-2.5 w-2.5 mr-0.5" />
                  Daily
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                  {config.label}
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-foreground truncate">{title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
            </div>
          </div>

          {/* Reward Badge */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <Badge className="bg-gradient-to-r from-sunny to-coral text-foreground text-xs px-2">
              <Star className="h-3 w-3 mr-0.5 fill-current" />
              +{reward} XP
            </Badge>
            {!isCompleted && (
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!isCompleted && maxProgress > 1 && (
          <div className="mt-2.5 flex items-center gap-2">
            <Progress value={progressPercent} className="h-1.5 flex-1" />
            <span className="text-[10px] text-muted-foreground font-medium">
              {progress}/{maxProgress}
            </span>
          </div>
        )}

        {/* Completed state */}
        {isCompleted && (
          <div className="mt-2 flex items-center gap-1 text-lime">
            <Target className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Challenge Complete!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
