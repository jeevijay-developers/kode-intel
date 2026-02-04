import { useEffect, useRef, useState } from "react";
import { GlassCard } from "./GlassCard";
import { Users, GraduationCap, Code, Trophy, Award } from "lucide-react";

const steps = [
  { 
    step: 1, 
    title: "Sign Up Free", 
    description: "Create account in 30 seconds", 
    icon: Users, 
    glowColor: "primary" as const
  },
  { 
    step: 2, 
    title: "Select Grade", 
    description: "Choose your class level", 
    icon: GraduationCap, 
    glowColor: "secondary" as const
  },
  { 
    step: 3, 
    title: "Learn & Code", 
    description: "Watch videos, practice coding", 
    icon: Code, 
    glowColor: "turquoise" as const
  },
  { 
    step: 4, 
    title: "Complete Quizzes", 
    description: "Test knowledge, earn XP", 
    icon: Trophy, 
    glowColor: "sunny" as const
  },
  { 
    step: 5, 
    title: "Get Certified", 
    description: "Unlock badges & certificates", 
    icon: Award, 
    glowColor: "coral" as const
  }
];

export function TimelineSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const glowColorMap: Record<string, string> = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    turquoise: 'hsl(var(--turquoise))',
    sunny: 'hsl(var(--sunny))',
    coral: 'hsl(var(--coral))'
  };

  return (
    <div ref={sectionRef} className="relative">
      {/* Desktop Timeline */}
      <div className="hidden lg:flex items-start justify-between relative">
        {/* Animated Connection Line */}
        <div className="absolute top-12 left-[10%] right-[10%] h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary via-turquoise to-coral rounded-full transition-all duration-1000"
            style={{ 
              width: isVisible ? `${((activeStep + 1) / steps.length) * 100}%` : '0%'
            }}
          />
        </div>

        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center text-center relative z-10 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {/* Step Icon */}
            <div className="relative mb-4">
              <div 
                className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                  index <= activeStep 
                    ? 'bg-gradient-to-br from-primary to-secondary scale-110' 
                    : 'bg-muted'
                }`}
                style={{
                  boxShadow: index <= activeStep 
                    ? `0 0 30px ${glowColorMap[step.glowColor]}40`
                    : 'none'
                }}
              >
                <step.icon className={`h-10 w-10 transition-colors duration-300 ${
                  index <= activeStep ? 'text-primary-foreground' : 'text-muted-foreground'
                }`} />
              </div>
              
              {/* Step Number Badge */}
              <div 
                className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 border-background transition-all duration-500 ${
                  index <= activeStep 
                    ? 'bg-sunny text-sunny-foreground scale-110' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.step}
              </div>
            </div>

            <h3 className={`font-bold text-lg mb-1 font-display transition-colors duration-300 ${
              index <= activeStep ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[120px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden space-y-4">
        {steps.map((step, index) => (
          <GlassCard
            key={index}
            glowColor={step.glowColor}
            hover3D={false}
            size="sm"
            className={`transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${step.glowColor} to-${step.glowColor === 'primary' ? 'secondary' : step.glowColor} flex items-center justify-center shadow-lg relative`}
                style={{
                  background: `linear-gradient(135deg, ${glowColorMap[step.glowColor]}, ${glowColorMap[step.glowColor === 'primary' ? 'secondary' : step.glowColor]})`
                }}
              >
                <step.icon className="h-6 w-6 text-primary-foreground" />
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-sunny text-sunny-foreground flex items-center justify-center font-bold text-xs border-2 border-background">
                  {step.step}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground font-display">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
