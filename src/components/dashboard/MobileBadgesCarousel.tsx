import { Award, ChevronRight } from "lucide-react";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface BadgeItem {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  earned: boolean;
}

interface MobileBadgesCarouselProps {
  badges: BadgeItem[];
  earnedCount: number;
  totalCount: number;
}

export function MobileBadgesCarousel({
  badges,
  earnedCount,
  totalCount,
}: MobileBadgesCarouselProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-sunny" />
          My Badges
        </h2>
        <button
          onClick={() => navigate("/student/achievements")}
          className="flex items-center gap-1 text-sm text-primary font-medium active:opacity-70 transition-opacity"
        >
          <Badge variant="outline" className="text-xs">
            {earnedCount}/{totalCount}
          </Badge>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative -mx-4 px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {badges.slice(0, 8).map((badge) => (
            <div
              key={badge.id}
              className="flex-shrink-0 snap-center"
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <BadgeCard
                  name={badge.name}
                  description={badge.description}
                  icon={badge.icon}
                  color={badge.color}
                  earned={badge.earned}
                  size="md"
                  showName={false}
                />
              </div>
            </div>
          ))}
          
          {/* View All Button */}
          <button
            onClick={() => navigate("/student/achievements")}
            className="flex-shrink-0 w-16 h-16 rounded-2xl bg-muted/50 border border-dashed border-border flex flex-col items-center justify-center gap-1 active:bg-muted transition-colors snap-center"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
