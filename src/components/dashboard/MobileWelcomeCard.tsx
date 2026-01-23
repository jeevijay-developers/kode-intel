import { Star, Flame, Zap, ChevronRight, Sparkles } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-secondary p-4 shadow-xl">
      {/* Animated background decorations */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/30 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-sunny/20 rounded-full blur-xl animate-pulse" />

      <div className="relative flex items-start justify-between gap-2">
        {/* Left: User info */}
        <div className="flex-1 min-w-0">
          <button
            onClick={onProfileClick}
            className="flex items-center gap-1.5 text-white/80 text-xs mb-1.5 active:opacity-70 transition-opacity group"
          >
            <span className="font-medium">Welcome back</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <h1 className="text-2xl font-bold text-white mb-1 font-display drop-shadow-md">
            {firstName}! 👋
          </h1>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-white/15 text-white border-0 text-xs backdrop-blur-sm shadow-inner">
              Class {studentClass}
              {section && ` • ${section}`}
            </Badge>
            <Badge className="bg-gradient-to-r from-sunny to-coral text-white border-0 text-xs shadow-md">
              <Sparkles className="h-3 w-3 mr-1" />
              Lvl {level}
            </Badge>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sunny text-foreground shadow-lg">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-bold">{xp} XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/10">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-bold">{streak} Day{streak !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Right: Mascot with glow */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-sunny/40 to-coral/40 rounded-full blur-xl scale-90" />
          <img
            src={kodiMascot}
            alt="KODI Mascot"
            className="w-full h-full object-contain drop-shadow-2xl relative z-10 animate-bounce-gentle"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
    </div>
  );
}
