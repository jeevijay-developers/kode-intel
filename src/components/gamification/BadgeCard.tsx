import { cn } from "@/lib/utils";
import {
  Play,
  Trophy,
  Book,
  Code,
  Star,
  Zap,
  Brain,
  Rocket,
  Flame,
  Crown,
  HelpCircle,
  BookOpen,
  CheckCircle,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  play: Play,
  trophy: Trophy,
  book: Book,
  code: Code,
  star: Star,
  zap: Zap,
  brain: Brain,
  rocket: Rocket,
  flame: Flame,
  crown: Crown,
  "help-circle": HelpCircle,
  "book-open": BookOpen,
  "check-circle": CheckCircle,
};

const colorMap: Record<string, string> = {
  primary: "from-primary to-secondary",
  sunny: "from-sunny to-coral",
  turquoise: "from-turquoise to-lime",
  purple: "from-purple to-pink",
  coral: "from-coral to-pink",
};

interface BadgeCardProps {
  name: string;
  description?: string;
  icon: string;
  color: string;
  earned?: boolean;
  earnedAt?: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function BadgeCard({
  name,
  description,
  icon,
  color,
  earned = false,
  earnedAt,
  size = "md",
  showName = true,
}: BadgeCardProps) {
  const Icon = iconMap[icon] || Star;
  const gradient = colorMap[color] || colorMap.primary;

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div
        className={cn(
          "relative rounded-2xl flex items-center justify-center transition-all duration-300",
          sizeClasses[size],
          earned
            ? `bg-gradient-to-br ${gradient} shadow-lg hover:scale-110 hover:shadow-xl`
            : "bg-muted/50 border-2 border-dashed border-muted-foreground/20"
        )}
      >
        <Icon
          className={cn(
            iconSizes[size],
            earned ? "text-white" : "text-muted-foreground/40"
          )}
        />
        {earned && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-lime flex items-center justify-center">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
        )}
        {!earned && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-2xl">
            <span className="text-lg">🔒</span>
          </div>
        )}
      </div>
      {showName && (
        <div className="text-center">
          <p
            className={cn(
              "text-xs font-medium",
              earned ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {name}
          </p>
          {description && earned && (
            <p className="text-[10px] text-muted-foreground max-w-20 truncate">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
