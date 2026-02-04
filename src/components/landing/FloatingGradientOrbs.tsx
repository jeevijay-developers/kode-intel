import { useEffect, useState } from "react";

interface FloatingGradientOrbsProps {
  className?: string;
  enableParallax?: boolean;
}

export function FloatingGradientOrbs({ 
  className = "",
  enableParallax = true
}: FloatingGradientOrbsProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!enableParallax) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableParallax]);

  const orbs = [
    {
      size: 600,
      color: 'primary',
      baseX: 20,
      baseY: 20,
      parallaxStrength: 0.15,
      animationDuration: 25,
      blurAmount: 80
    },
    {
      size: 500,
      color: 'secondary',
      baseX: 70,
      baseY: 30,
      parallaxStrength: 0.1,
      animationDuration: 30,
      blurAmount: 100
    },
    {
      size: 450,
      color: 'turquoise',
      baseX: 50,
      baseY: 70,
      parallaxStrength: 0.2,
      animationDuration: 22,
      blurAmount: 90
    },
    {
      size: 350,
      color: 'sunny',
      baseX: 85,
      baseY: 75,
      parallaxStrength: 0.12,
      animationDuration: 28,
      blurAmount: 70
    }
  ];

  const colorMap: Record<string, string> = {
    primary: 'hsl(var(--primary) / 0.25)',
    secondary: 'hsl(var(--secondary) / 0.2)',
    turquoise: 'hsl(var(--turquoise) / 0.2)',
    sunny: 'hsl(var(--sunny) / 0.15)',
    coral: 'hsl(var(--coral) / 0.2)'
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb, index) => {
        const offsetX = enableParallax ? (mousePosition.x - 50) * orb.parallaxStrength : 0;
        const offsetY = enableParallax ? (mousePosition.y - 50) * orb.parallaxStrength : 0;
        
        return (
          <div
            key={index}
            className="absolute rounded-full animate-orb-float will-change-transform"
            style={{
              width: orb.size,
              height: orb.size,
              left: `calc(${orb.baseX}% + ${offsetX}px)`,
              top: `calc(${orb.baseY}% + ${offsetY}px)`,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${colorMap[orb.color]} 0%, transparent 70%)`,
              filter: `blur(${orb.blurAmount}px)`,
              animationDuration: `${orb.animationDuration}s`,
              animationDelay: `${index * 2}s`,
              transition: 'left 0.8s ease-out, top 0.8s ease-out'
            }}
          />
        );
      })}
    </div>
  );
}
