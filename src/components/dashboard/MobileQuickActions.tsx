import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface QuickActionItem {
  icon: ReactNode;
  label: string;
  description: string;
  gradient: string;
  onClick: () => void;
}

interface MobileQuickActionsProps {
  actions: QuickActionItem[];
}

export function MobileQuickActions({ actions }: MobileQuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={cn(
            "relative p-4 rounded-2xl transition-all duration-300 active:scale-95 overflow-hidden group text-left",
            action.gradient
          )}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 opacity-0 group-active:opacity-100 bg-white/20 transition-opacity duration-150" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-active:scale-110 transition-transform shadow-lg">
            {action.icon}
          </div>
          
          {/* Text */}
          <h3 className="font-bold text-white text-sm mb-0.5 drop-shadow-md">
            {action.label}
          </h3>
          <p className="text-[10px] text-white/80 font-medium">
            {action.description}
          </p>
        </button>
      ))}
    </div>
  );
}
