import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatItemProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  gradient: string;
  onClick?: () => void;
}

function StatItem({ icon, value, label, gradient, onClick }: StatItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 active:scale-95 overflow-hidden group",
        gradient
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-active:opacity-100 bg-white/20 transition-opacity duration-150" />
      
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 group-active:scale-110 transition-transform">
        {icon}
      </div>
      
      {/* Value */}
      <span className="text-xl font-bold text-white drop-shadow-md">{value}</span>
      
      {/* Label */}
      <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">
        {label}
      </span>
    </button>
  );
}

interface MobileStatsGridProps {
  stats: {
    icon: ReactNode;
    value: string | number;
    label: string;
    gradient: string;
    onClick?: () => void;
  }[];
}

export function MobileStatsGrid({ stats }: MobileStatsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
}
