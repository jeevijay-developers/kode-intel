import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, HelpCircle, BookOpen, Flame, Trophy, TrendingUp } from "lucide-react";
import { useGuestProgress } from "@/hooks/useGuestProgress";

interface GuestProgressCardProps {
  className?: string;
}

export function GuestProgressCard({ className }: GuestProgressCardProps) {
  const { getStats } = useGuestProgress();
  const stats = getStats();

  // Calculate an overall "engagement" score (simple formula for demo)
  const totalItems = stats.videosWatched + stats.quizzesCompleted + stats.ebooksViewed;

  const progressItems = [
    {
      icon: Video,
      label: "Videos",
      value: stats.videosWatched,
      color: "text-coral",
      bgColor: "bg-coral/20",
    },
    {
      icon: HelpCircle,
      label: "Quizzes",
      value: stats.quizzesCompleted,
      subValue: stats.quizzesPassed > 0 ? `${stats.quizzesPassed} ✓` : undefined,
      color: "text-purple",
      bgColor: "bg-purple/20",
    },
    {
      icon: BookOpen,
      label: "E-Books",
      value: stats.ebooksViewed,
      color: "text-turquoise",
      bgColor: "bg-turquoise/20",
    },
  ];

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {/* Compact Header with Stats */}
        <div className="flex items-center gap-3">
          {/* Progress Ring */}
          <div className="relative shrink-0">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/20"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#progressGradientCompact)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${Math.min(100, totalItems * 10) * 2.64} 264`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradientCompact" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--lime))" />
                  <stop offset="100%" stopColor="hsl(var(--turquoise))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold">{totalItems}</span>
            </div>
          </div>
          
          {/* Header Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">Your Progress</h3>
              {totalItems > 0 && (
                <Badge className="bg-gradient-to-r from-lime to-turquoise text-white border-0 text-[9px] px-1.5 py-0">
                  <Flame className="h-2.5 w-2.5 mr-0.5" />
                  Active
                </Badge>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {totalItems === 0 
                ? "Start exploring courses!" 
                : `${totalItems} activities completed`}
            </p>
            {stats.quizzesPassed > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Trophy className="h-2.5 w-2.5 text-sunny" />
                <span className="text-[9px] font-medium text-sunny">
                  {stats.quizzesPassed} quiz passed!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Compact Stats Row */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
          {progressItems.map((item) => (
            <div key={item.label} className="flex-1 flex items-center gap-1.5 p-2 rounded-lg bg-muted/30">
              <div className={`w-6 h-6 rounded-md ${item.bgColor} flex items-center justify-center shrink-0`}>
                <item.icon className={`h-3 w-3 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
                <div className="text-[8px] text-muted-foreground truncate">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
