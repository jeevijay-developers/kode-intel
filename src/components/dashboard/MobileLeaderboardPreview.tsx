import { useNavigate } from "react-router-dom";
import { Trophy, Crown, Medal, ChevronRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface MobileLeaderboardPreviewProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-4 w-4 text-sunny fill-sunny" />;
    case 2:
      return <Medal className="h-4 w-4 text-[#C0C0C0]" />;
    case 3:
      return <Medal className="h-4 w-4 text-[#CD7F32]" />;
    default:
      return null;
  }
};

const getRankGradient = (rank: number) => {
  switch (rank) {
    case 1:
      return "from-sunny/20 to-sunny/5 border-sunny/30";
    case 2:
      return "from-[#C0C0C0]/20 to-[#C0C0C0]/5 border-[#C0C0C0]/30";
    case 3:
      return "from-[#CD7F32]/20 to-[#CD7F32]/5 border-[#CD7F32]/30";
    default:
      return "from-muted/50 to-muted/20 border-border/30";
  }
};

export function MobileLeaderboardPreview({
  entries,
  currentUserRank,
}: MobileLeaderboardPreviewProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-primary flex items-center justify-center shadow-md">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base font-display">Leaderboard</h2>
            <p className="text-[10px] text-muted-foreground">Top performers this week</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/student/leaderboard")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-border/50 active:scale-95 transition-transform"
        >
          {currentUserRank && (
            <Badge variant="secondary" className="bg-purple/10 text-purple border-0 text-xs px-2">
              #{currentUserRank}
            </Badge>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {entries.slice(0, 5).map((entry) => (
          <div
            key={entry.rank}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border transition-all",
              entry.isCurrentUser
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 shadow-md"
                : `bg-gradient-to-r ${getRankGradient(entry.rank)}`
            )}
          >
            {/* Rank */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                entry.rank <= 3
                  ? "bg-gradient-to-br from-white to-muted shadow-inner"
                  : "bg-muted"
              )}
            >
              {getRankIcon(entry.rank) || entry.rank}
            </div>

            {/* Avatar */}
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                entry.isCurrentUser
                  ? "bg-gradient-to-br from-primary to-secondary text-white"
                  : "bg-gradient-to-br from-muted to-muted/50 text-foreground"
              )}
            >
              {entry.avatar || entry.name.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-semibold text-sm truncate",
                    entry.isCurrentUser && "text-primary"
                  )}
                >
                  {entry.name}
                </span>
                {entry.isCurrentUser && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] px-1.5 border-0">
                    You
                  </Badge>
                )}
              </div>
              {entry.rank <= 3 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="text-[10px] text-muted-foreground">Top performer</span>
                </div>
              )}
            </div>

            {/* XP */}
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="font-bold text-sm text-sunny">{entry.xp.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground">XP</span>
            </div>
          </div>
        ))}
      </div>

      {/* View Full Leaderboard */}
      <button
        onClick={() => navigate("/student/leaderboard")}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple/10 to-primary/10 border border-purple/20 active:scale-[0.98] transition-transform text-sm font-medium text-purple hover:text-primary"
      >
        View Full Leaderboard
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
