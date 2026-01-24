import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  const engagementScore = Math.min(100, totalItems * 10); // 10 points per activity, max 100

  const progressItems = [
    {
      icon: Video,
      label: "Videos Watched",
      value: stats.videosWatched,
      color: "text-coral",
      bgColor: "bg-coral/20",
      progressColor: "bg-coral",
    },
    {
      icon: HelpCircle,
      label: "Quizzes Completed",
      value: stats.quizzesCompleted,
      subValue: stats.quizzesPassed > 0 ? `${stats.quizzesPassed} passed` : undefined,
      color: "text-purple",
      bgColor: "bg-purple/20",
      progressColor: "bg-purple",
    },
    {
      icon: BookOpen,
      label: "E-Books Viewed",
      value: stats.ebooksViewed,
      color: "text-turquoise",
      bgColor: "bg-turquoise/20",
      progressColor: "bg-turquoise",
    },
  ];

  return (
    <Card className={className}>
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime to-turquoise flex items-center justify-center shadow-md">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Your Progress</h3>
              <p className="text-[10px] text-muted-foreground">Trial activity tracker</p>
            </div>
          </div>
          {totalItems > 0 && (
            <Badge className="bg-gradient-to-r from-lime to-turquoise text-white border-0 text-[10px]">
              <Flame className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>

        {/* Engagement Score Ring */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
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
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${engagementScore * 2.64} 264`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--lime))" />
                  <stop offset="100%" stopColor="hsl(var(--turquoise))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold">{totalItems}</span>
              <span className="text-[8px] text-muted-foreground">Activities</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs font-medium">
              {totalItems === 0 
                ? "Start exploring!" 
                : totalItems < 5 
                  ? "Great start! 🚀" 
                  : totalItems < 10 
                    ? "You're on fire! 🔥" 
                    : "Learning champion! 🏆"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {totalItems === 0 
                ? "Watch videos, take quizzes, and read e-books" 
                : `You've completed ${totalItems} learning activities`}
            </p>
            {stats.quizzesPassed > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <Trophy className="h-3 w-3 text-sunny" />
                <span className="text-[10px] font-medium text-sunny">
                  {stats.quizzesPassed} quiz{stats.quizzesPassed > 1 ? 'zes' : ''} passed!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Items */}
        <div className="space-y-3">
          {progressItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium truncate">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                    {item.subValue && (
                      <span className="text-[9px] text-muted-foreground">({item.subValue})</span>
                    )}
                  </div>
                </div>
                <Progress 
                  value={Math.min(100, item.value * 20)} 
                  className="h-1.5"
                  style={{ 
                    ['--progress-background' as any]: `hsl(var(--${item.color.replace('text-', '')}))` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
