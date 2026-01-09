import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "./AnimatedCounter";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  trend?: number;
  color?: "primary" | "secondary" | "coral" | "turquoise" | "sunny" | "purple" | "pink" | "lime";
  className?: string;
  description?: string;
  size?: "sm" | "default" | "lg";
}

const colorConfig = {
  primary: {
    bg: "from-primary/10 to-primary/5",
    border: "border-primary/20",
    iconBg: "from-primary to-secondary",
    text: "text-primary",
    glow: "group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
  },
  secondary: {
    bg: "from-secondary/10 to-secondary/5",
    border: "border-secondary/20",
    iconBg: "from-secondary to-purple",
    text: "text-secondary",
    glow: "group-hover:shadow-[0_0_20px_hsl(var(--secondary)/0.3)]",
  },
  coral: {
    bg: "from-coral/10 to-coral/5",
    border: "border-coral/20",
    iconBg: "from-coral to-pink",
    text: "text-coral",
    glow: "group-hover:shadow-[0_0_20px_hsl(var(--coral)/0.3)]",
  },
  turquoise: {
    bg: "from-turquoise/10 to-turquoise/5",
    border: "border-turquoise/20",
    iconBg: "from-turquoise to-lime",
    text: "text-turquoise",
    glow: "group-hover:shadow-[0_0_20px_hsl(var(--turquoise)/0.3)]",
  },
  sunny: {
    bg: "from-sunny/10 to-sunny/5",
    border: "border-sunny/20",
    iconBg: "from-sunny to-coral",
    text: "text-sunny",
    glow: "group-hover:shadow-[0_0_20px_hsl(var(--sunny)/0.3)]",
  },
  purple: {
    bg: "from-purple/10 to-purple/5",
    border: "border-purple/20",
    iconBg: "from-purple to-pink",
    text: "text-purple",
    glow: "group-hover:shadow-[0_0_20px_hsl(var(--purple)/0.3)]",
  },
  pink: {
    bg: "from-pink/10 to-pink/5",
    border: "border-pink/20",
    iconBg: "from-pink to-coral",
    text: "text-pink",
    glow: "group-hover:shadow-[0_0_20px_hsl(var(--pink)/0.3)]",
  },
  lime: {
    bg: "from-lime/10 to-lime/5",
    border: "border-lime/20",
    iconBg: "from-lime to-turquoise",
    text: "text-lime",
    glow: "group-hover:shadow-[0_0_20px_hsl(var(--lime)/0.3)]",
  },
};

const sizeConfig = {
  sm: {
    card: "p-2.5",
    icon: "w-8 h-8",
    iconSize: "h-4 w-4",
    value: "text-lg",
    title: "text-[10px]",
  },
  default: {
    card: "p-3 sm:p-4",
    icon: "w-10 h-10 sm:w-12 sm:h-12",
    iconSize: "h-5 w-5 sm:h-6 sm:w-6",
    value: "text-xl sm:text-2xl",
    title: "text-xs sm:text-sm",
  },
  lg: {
    card: "p-4 sm:p-6",
    icon: "w-14 h-14 sm:w-16 sm:h-16",
    iconSize: "h-7 w-7 sm:h-8 sm:w-8",
    value: "text-2xl sm:text-3xl",
    title: "text-sm",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  suffix = "",
  prefix = "",
  trend,
  color = "primary",
  className,
  description,
  size = "default",
}: StatCardProps) {
  const colors = colorConfig[color];
  const sizes = sizeConfig[size];

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1",
        `bg-gradient-to-br ${colors.bg} ${colors.border}`,
        colors.glow,
        className
      )}
    >
      {/* Decorative gradient orb */}
      <div className={cn(
        "absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 blur-xl",
        `bg-gradient-to-br ${colors.iconBg}`
      )} />
      
      <CardContent className={cn("relative", sizes.card)}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={cn(
            "rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br",
            sizes.icon,
            colors.iconBg
          )}>
            <Icon className={cn("text-primary-foreground", sizes.iconSize)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("text-muted-foreground font-medium truncate", sizes.title)}>
              {title}
            </p>
            <div className="flex items-baseline gap-1.5">
              <AnimatedCounter
                value={value}
                prefix={prefix}
                suffix={suffix}
                className={cn("font-bold text-foreground", sizes.value)}
              />
              {trend !== undefined && (
                <span className={cn(
                  "flex items-center text-xs font-medium",
                  trend >= 0 ? "text-lime" : "text-destructive"
                )}>
                  {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
