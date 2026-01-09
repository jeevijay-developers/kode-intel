import { Progress } from "@/components/ui/progress";
import { Star, Zap } from "lucide-react";

const levelThresholds = [
  { level: 1, points: 0, name: "Beginner" },
  { level: 2, points: 100, name: "Explorer" },
  { level: 3, points: 250, name: "Learner" },
  { level: 4, points: 500, name: "Achiever" },
  { level: 5, points: 1000, name: "Champion" },
  { level: 6, points: 2000, name: "Master" },
  { level: 7, points: 3500, name: "Expert" },
  { level: 8, points: 5000, name: "Genius" },
  { level: 9, points: 7500, name: "Legend" },
  { level: 10, points: 10000, name: "Ultimate" },
];

interface LevelProgressProps {
  totalPoints: number;
  currentLevel: number;
  streakDays: number;
}

export function LevelProgress({
  totalPoints,
  currentLevel,
  streakDays,
}: LevelProgressProps) {
  const currentLevelData = levelThresholds.find((l) => l.level === currentLevel) || levelThresholds[0];
  const nextLevelData = levelThresholds.find((l) => l.level === currentLevel + 1);
  
  const pointsInCurrentLevel = totalPoints - currentLevelData.points;
  const pointsToNextLevel = nextLevelData 
    ? nextLevelData.points - currentLevelData.points 
    : 0;
  const progressPercent = nextLevelData 
    ? (pointsInCurrentLevel / pointsToNextLevel) * 100 
    : 100;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">{currentLevel}</span>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{currentLevelData.name}</p>
            <p className="text-sm text-muted-foreground">Level {currentLevel}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sunny">
            <Star className="h-5 w-5 fill-current" />
            <span className="text-xl font-bold">{totalPoints}</span>
          </div>
          <p className="text-xs text-muted-foreground">Total XP</p>
        </div>
      </div>

      {nextLevelData && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {currentLevel + 1}</span>
            <span className="font-medium text-foreground">
              {pointsInCurrentLevel}/{pointsToNextLevel} XP
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            {pointsToNextLevel - pointsInCurrentLevel} XP to become a {nextLevelData.name}!
          </p>
        </div>
      )}

      {streakDays > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral to-sunny flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-foreground">{streakDays} Day Streak!</span>
          <span className="text-2xl">🔥</span>
        </div>
      )}
    </div>
  );
}
