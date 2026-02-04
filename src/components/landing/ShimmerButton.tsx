import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export function ShimmerButton({
  children,
  className = "",
  onClick,
  variant = 'primary',
  size = 'lg'
}: ShimmerButtonProps) {
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] text-primary-foreground hover:shadow-xl hover:shadow-primary/25",
    secondary: "bg-gradient-to-r from-turquoise via-lime to-turquoise bg-[length:200%_100%] text-primary-foreground hover:shadow-xl hover:shadow-turquoise/25",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-10 py-7 text-lg"
  };

  return (
    <Button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-full font-bold transition-all duration-300 hover:scale-105 group",
        variantClasses[variant],
        sizeClasses[size],
        variant !== 'outline' && "animate-shimmer-bg",
        className
      )}
    >
      {/* Shimmer overlay */}
      {variant !== 'outline' && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </Button>
  );
}
