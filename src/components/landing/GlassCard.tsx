import { useState, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'secondary' | 'turquoise' | 'coral' | 'sunny' | 'lime';
  hover3D?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  glowColor = "primary",
  hover3D = true,
  size = "md",
  onClick
}: GlassCardProps) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const glowColorMap: Record<string, string> = {
    primary: 'hsl(var(--primary) / 0.3)',
    secondary: 'hsl(var(--secondary) / 0.3)',
    turquoise: 'hsl(var(--turquoise) / 0.3)',
    coral: 'hsl(var(--coral) / 0.3)',
    sunny: 'hsl(var(--sunny) / 0.3)',
    lime: 'hsl(var(--lime) / 0.3)'
  };

  const borderColorMap: Record<string, string> = {
    primary: 'hsl(var(--primary) / 0.25)',
    secondary: 'hsl(var(--secondary) / 0.25)',
    turquoise: 'hsl(var(--turquoise) / 0.25)',
    coral: 'hsl(var(--coral) / 0.25)',
    sunny: 'hsl(var(--sunny) / 0.25)',
    lime: 'hsl(var(--lime) / 0.25)'
  };

  const sizeClasses = {
    sm: 'p-4 rounded-xl',
    md: 'p-6 rounded-2xl',
    lg: 'p-8 rounded-3xl'
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative bg-card/60 backdrop-blur-xl border transition-all duration-300",
        sizeClasses[size],
        onClick && "cursor-pointer",
        className
      )}
      style={{
        transform: hover3D 
          ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${isHovered ? 1.02 : 1})`
          : undefined,
        transformStyle: 'preserve-3d',
        borderColor: isHovered ? borderColorMap[glowColor] : 'hsl(var(--border) / 0.3)',
        boxShadow: isHovered 
          ? `0 20px 40px -15px ${glowColorMap[glowColor]}, 0 0 30px ${glowColorMap[glowColor]}`
          : '0 8px 32px -8px hsl(var(--foreground) / 0.08)'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Inner glow effect */}
      <div 
        className="absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 0.1 : 0,
          background: `radial-gradient(ellipse at center, ${glowColorMap[glowColor]} 0%, transparent 70%)`
        }}
      />
      
      {/* Content with 3D depth */}
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
}
