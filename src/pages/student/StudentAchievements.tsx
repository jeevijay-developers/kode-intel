import { useOutletContext } from "react-router-dom";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { Trophy, Star, Sparkles } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";

interface OutletContext {
  student: any;
  points: any;
}

export default function StudentAchievements() {
  const { student, points } = useOutletContext<OutletContext>();
  const { badges, achievements, earnedBadgesCount, totalBadges } = useGamification(student?.id);

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sunny to-coral flex items-center justify-center shadow-lg transform rotate-3">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display flex items-center gap-2">
            Your Achievements
            <Sparkles className="h-5 w-5 text-sunny animate-pulse" />
          </h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <Star className="h-4 w-4 fill-sunny text-sunny" />
            {points.total_points} Total XP • {earnedBadgesCount} Badges Earned
          </p>
        </div>
      </div>

      {badges.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge: any) => (
            <BadgeCard
              key={badge.id}
              name={badge.name}
              description={badge.description}
              icon={badge.icon}
              color={badge.color}
              earned={badge.earned}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-foreground mb-2">No Badges Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Keep learning and completing lessons to earn your first badge!
          </p>
        </div>
      )}
    </div>
  );
}
