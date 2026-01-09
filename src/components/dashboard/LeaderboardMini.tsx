import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardMiniProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
  currentUserPoints?: number;
  className?: string;
  title?: string;
}

const rankIcons = [
  { icon: Crown, color: "text-sunny fill-sunny", bg: "bg-sunny/20" },
  { icon: Medal, color: "text-muted-foreground", bg: "bg-muted/20" },
  { icon: Award, color: "text-coral", bg: "bg-coral/20" },
];

export function LeaderboardMini({
  entries,
  currentUserRank,
  currentUserPoints,
  className,
  title = "Top Learners",
}: LeaderboardMiniProps) {
  const topThree = entries.slice(0, 3);
  const maxPoints = topThree[0]?.points || 1;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-sunny" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="space-y-2">
          {topThree.map((entry, index) => {
            const RankIcon = rankIcons[index]?.icon || Award;
            const rankStyle = rankIcons[index];
            const barWidth = (entry.points / maxPoints) * 100;

            return (
              <div
                key={entry.id}
                className={cn(
                  "relative flex items-center gap-2 p-2 rounded-lg transition-all",
                  entry.isCurrentUser 
                    ? "bg-primary/10 border border-primary/30" 
                    : "bg-muted/30 hover:bg-muted/50"
                )}
              >
                {/* Rank */}
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", rankStyle?.bg)}>
                  <RankIcon className={cn("h-4 w-4", rankStyle?.color)} />
                </div>

                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                  {entry.avatar || entry.name.charAt(0).toUpperCase()}
                </div>

                {/* Name and progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-xs font-medium truncate",
                      entry.isCurrentUser && "text-primary"
                    )}>
                      {entry.name}
                      {entry.isCurrentUser && " (You)"}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 h-4 bg-sunny/10 border-sunny/30 shrink-0 ml-1">
                      <Star className="h-2.5 w-2.5 mr-0.5 text-sunny fill-sunny" />
                      {entry.points.toLocaleString()}
                    </Badge>
                  </div>
                  {/* XP Bar */}
                  <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        index === 0 ? "bg-sunny" : index === 1 ? "bg-muted-foreground" : "bg-coral"
                      )}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current user position if not in top 3 */}
        {currentUserRank && currentUserRank > 3 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary text-xs">#{currentUserRank}</Badge>
                <span className="text-xs font-medium">Your Position</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-lime" />
                {currentUserPoints?.toLocaleString()} XP
              </div>
            </div>
          </div>
        )}

        {entries.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>Start learning to join the leaderboard!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
