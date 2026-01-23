import { Flame, Zap, Star, Gift, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MobileDailyStreakProps {
  currentStreak: number;
  totalXP: number;
  level: number;
}

export function MobileDailyStreak({ currentStreak, totalXP, level }: MobileDailyStreakProps) {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1; // Adjust for Monday start
  
  // Calculate which days are completed based on streak
  const completedDays = Array.from({ length: 7 }, (_, i) => {
    if (i <= adjustedToday) {
      const daysFromStart = adjustedToday - i;
      return daysFromStart < currentStreak;
    }
    return false;
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-coral/20 via-sunny/15 to-coral/10 border border-coral/20 p-4">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sunny/30 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral to-sunny flex items-center justify-center shadow-lg">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Daily Streak</h3>
              <p className="text-[10px] text-muted-foreground">Keep learning every day!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-coral">{currentStreak}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Days</div>
          </div>
        </div>

        {/* Week Progress */}
        <div className="flex items-center justify-between gap-1 mb-4">
          {weekDays.map((day, index) => {
            const isCompleted = completedDays[index];
            const isToday = index === adjustedToday;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    isCompleted
                      ? "bg-gradient-to-br from-coral to-sunny shadow-md"
                      : isToday
                      ? "bg-coral/20 border-2 border-coral border-dashed"
                      : "bg-muted/50 border border-border/30"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <span className={cn(
                      "text-[10px] font-bold",
                      isToday ? "text-coral" : "text-muted-foreground"
                    )}>
                      {day}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/60 backdrop-blur-sm border border-border/30">
            <Zap className="h-4 w-4 text-sunny" />
            <div>
              <div className="text-sm font-bold">{totalXP}</div>
              <div className="text-[9px] text-muted-foreground">Total XP</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/60 backdrop-blur-sm border border-border/30">
            <Star className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-bold">Lvl {level}</div>
              <div className="text-[9px] text-muted-foreground">Current</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/60 backdrop-blur-sm border border-border/30">
            <Gift className="h-4 w-4 text-purple" />
            <div>
              <div className="text-sm font-bold">+50</div>
              <div className="text-[9px] text-muted-foreground">Bonus</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
