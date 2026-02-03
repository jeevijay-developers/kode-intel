import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Trophy,
  HelpCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonPanelProps {
  title: string;
  description?: string;
  objective: string;
  hints?: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  isCompleted?: boolean;
  attempts?: number;
  onComplete?: () => void;
  className?: string;
}

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    color: "bg-lime/20 text-lime border-lime/30",
    icon: Star,
  },
  intermediate: {
    label: "Intermediate",
    color: "bg-sunny/20 text-sunny border-sunny/30",
    icon: Zap,
  },
  advanced: {
    label: "Advanced",
    color: "bg-coral/20 text-coral border-coral/30",
    icon: Trophy,
  },
};

export function LessonPanel({
  title,
  description,
  objective,
  hints = [],
  difficulty,
  xpReward,
  isCompleted = false,
  attempts = 0,
  onComplete,
  className,
}: LessonPanelProps) {
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const diffConfig = difficultyConfig[difficulty];
  const DifficultyIcon = diffConfig.icon;

  const revealNextHint = () => {
    if (currentHint < hints.length) {
      setCurrentHint((prev) => prev + 1);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header with completion status */}
      <div className={cn(
        "p-4 border-b transition-colors",
        isCompleted ? "bg-lime/10 border-lime/20" : "bg-gradient-to-r from-primary/5 to-secondary/5"
      )}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge className={diffConfig.color}>
                <DifficultyIcon className="h-3 w-3 mr-1" />
                {diffConfig.label}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3 text-sunny" />
                {xpReward} XP
              </Badge>
              {isCompleted && (
                <Badge className="bg-lime/20 text-lime border-lime/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-lg leading-tight">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
        {attempts > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Attempts: {attempts}
          </p>
        )}
      </div>

      {/* Objective Section */}
      <div className="p-4 bg-primary/5 border-b">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
              Your Mission
            </p>
            <p className="text-sm font-medium">{objective}</p>
          </div>
        </div>
      </div>

      {/* Hints Section */}
      {hints.length > 0 && (
        <div className="p-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sunny/20 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-sunny" />
              </div>
              <span className="font-medium text-sm">Need a hint?</span>
              <Badge variant="secondary" className="text-[10px]">
                {currentHint}/{hints.length}
              </Badge>
            </div>
            {showHints ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showHints && (
            <div className="mt-3 space-y-2 animate-in slide-in-from-top-2">
              {/* Progress bar for hints */}
              <div className="flex items-center gap-2 mb-3">
                <Progress value={(currentHint / hints.length) * 100} className="h-1.5 flex-1" />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {currentHint} of {hints.length} hints used
                </span>
              </div>

              {/* Revealed hints */}
              {hints.slice(0, currentHint).map((hint, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-sunny/10 border border-sunny/20 animate-in fade-in"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sunny/30 flex items-center justify-center text-[10px] font-bold text-sunny shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm">{hint}</p>
                  </div>
                </div>
              ))}

              {/* Reveal next hint button */}
              {currentHint < hints.length && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={revealNextHint}
                  className="w-full mt-2 border-sunny/30 text-sunny hover:bg-sunny/10"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Reveal Hint {currentHint + 1}
                </Button>
              )}

              {/* All hints used message */}
              {currentHint >= hints.length && (
                <p className="text-xs text-center text-muted-foreground py-2">
                  ✨ You've seen all hints! Now try to complete the challenge.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Complete Button */}
      {onComplete && !isCompleted && (
        <div className="p-4 border-t bg-muted/30">
          <Button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Complete
          </Button>
        </div>
      )}

      {/* Already completed message */}
      {isCompleted && (
        <div className="p-4 border-t bg-lime/5">
          <div className="flex items-center justify-center gap-2 text-lime">
            <Trophy className="h-5 w-5" />
            <span className="font-medium">Great job! You earned {xpReward} XP!</span>
          </div>
        </div>
      )}
    </Card>
  );
}
