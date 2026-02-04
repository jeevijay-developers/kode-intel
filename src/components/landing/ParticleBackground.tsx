import { useMemo } from "react";

interface ParticleBackgroundProps {
  particleCount?: number;
  className?: string;
}

export function ParticleBackground({ 
  particleCount = 50, 
  className = "" 
}: ParticleBackgroundProps) {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
      color: ['primary', 'secondary', 'turquoise', 'sunny', 'coral', 'lime'][Math.floor(Math.random() * 6)]
    }));
  }, [particleCount]);

  const colorMap: Record<string, string> = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    turquoise: 'hsl(var(--turquoise))',
    sunny: 'hsl(var(--sunny))',
    coral: 'hsl(var(--coral))',
    lime: 'hsl(var(--lime))'
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-particle-float will-change-transform"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: colorMap[particle.color],
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 ${particle.size * 2}px ${colorMap[particle.color]}`
          }}
        />
      ))}
    </div>
  );
}
