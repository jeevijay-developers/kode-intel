import { Star, Flame, Zap, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import kodiMascot from "@/assets/kodi-mascot-3d.png";

interface MobileWelcomeCardProps {
  studentName: string;
  studentClass: string;
  section?: string | null;
  level: number;
  xp: number;
  streak: number;
  onProfileClick?: () => void;
}

export function MobileWelcomeCard({
  studentName,
  studentClass,
  section,
  level,
  xp,
  streak,
  onProfileClick,
}: MobileWelcomeCardProps) {
  const firstName = studentName.split(" ")[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-4">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex items-start justify-between">
        {/* Left: User info */}
        <div className="flex-1">
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 text-white/80 text-xs mb-1 active:opacity-70 transition-opacity"
          >
            <span>Welcome back</span>
            <ChevronRight className="h-3 w-3" />
          </button>
          
          <h1 className="text-2xl font-bold text-white mb-1 font-display">
            {firstName}! 👋
          </h1>
          
          <p className="text-white/70 text-sm mb-3">
            Class {studentClass}
            {section && ` • Section ${section}`}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sunny/90 text-foreground">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-bold">{xp}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white">
              <Flame className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">{streak}d</span>
            </div>
            <Badge className="bg-white/20 text-white border-0 text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Lvl {level}
            </Badge>
          </div>
        </div>

        {/* Right: Mascot */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={kodiMascot}
            alt="KODI Mascot"
            className="w-full h-full object-contain drop-shadow-2xl"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
    </div>
  );
}
