import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: "primary" | "secondary" | "coral" | "turquoise" | "sunny" | "purple" | "pink" | "lime";
  showValue?: boolean;
  icon?: React.ReactNode;
  animate?: boolean;
}

const colorMap = {
  primary: "stroke-primary",
  secondary: "stroke-secondary",
  coral: "stroke-coral",
  turquoise: "stroke-turquoise",
  sunny: "stroke-sunny",
  purple: "stroke-purple",
  pink: "stroke-pink",
  lime: "stroke-lime",
};

const bgColorMap = {
  primary: "stroke-primary/20",
  secondary: "stroke-secondary/20",
  coral: "stroke-coral/20",
  turquoise: "stroke-turquoise/20",
  sunny: "stroke-sunny/20",
  purple: "stroke-purple/20",
  pink: "stroke-pink/20",
  lime: "stroke-lime/20",
};

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  className,
  color = "primary",
  showValue = true,
  icon,
  animate = true,
}: ProgressRingProps) {
  const [progress, setProgress] = useState(0);
  const ref = useRef<SVGSVGElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (!animate) {
      setProgress(Math.min(100, Math.max(0, value)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 1000;
          const startTime = performance.now();
          const targetValue = Math.min(100, Math.max(0, value));

          const animateProgress = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progressPercent = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progressPercent, 3);
            setProgress(targetValue * easeOut);

            if (progressPercent < 1) {
              requestAnimationFrame(animateProgress);
            }
          };

          requestAnimationFrame(animateProgress);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, animate]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        ref={ref}
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("fill-none", bgColorMap[color])}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("fill-none transition-all duration-300", colorMap[color])}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {icon ? (
          icon
        ) : showValue ? (
          <span className="text-sm font-bold text-foreground">{Math.round(progress)}%</span>
        ) : null}
      </div>
    </div>
  );
}
