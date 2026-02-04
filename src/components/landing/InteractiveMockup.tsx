import { useEffect, useState, useRef } from "react";
import { 
  Trophy, 
  Zap, 
  Star, 
  BookOpen, 
  Code, 
  CheckCircle2,
  Flame,
  Medal,
  Sparkles
} from "lucide-react";

interface InteractiveMockupProps {
  className?: string;
}

export function InteractiveMockup({ className = "" }: InteractiveMockupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [xpCount, setXpCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 67) {
          clearInterval(progressInterval);
          return 67;
        }
        return prev + 1;
      });
    }, 30);

    // Animate XP
    const xpInterval = setInterval(() => {
      setXpCount(prev => {
        if (prev >= 1250) {
          clearInterval(xpInterval);
          return 1250;
        }
        return prev + 25;
      });
    }, 20);

    return () => {
      clearInterval(progressInterval);
      clearInterval(xpInterval);
    };
  }, [isVisible]);

  const careerMatches = [
    { title: "AI Developer", match: 92, icon: Code, color: "from-primary to-secondary" },
    { title: "Data Scientist", match: 88, icon: Zap, color: "from-turquoise to-lime" },
    { title: "Game Designer", match: 85, icon: Sparkles, color: "from-sunny to-coral" }
  ];

  return (
    <div 
      ref={ref}
      className={`relative perspective-1000 ${className}`}
    >
      {/* 3D Wrapper */}
      <div 
        className="relative transform-gpu transition-transform duration-700"
        style={{
          transform: isVisible 
            ? 'rotateY(-5deg) rotateX(5deg)' 
            : 'rotateY(-15deg) rotateX(10deg) translateZ(-50px)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Main Dashboard Card */}
        <div className="relative bg-card/90 backdrop-blur-2xl rounded-3xl border-2 border-border/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-turquoise/10 p-5 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <h3 className="text-xl font-bold text-foreground font-display">Aryan 👋</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-sunny/20 rounded-full">
                <Flame className="h-4 w-4 text-sunny" />
                <span className="text-sm font-bold text-sunny">7 day streak!</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            {/* Progress Ring */}
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * progressValue) / 100}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--turquoise))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{progressValue}%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Course Progress</p>
                <p className="font-bold text-foreground">AI Foundations - Class 6</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">8/12 Chapters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* XP & Badges Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-3 text-center border border-primary/20">
                <Zap className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold text-foreground">{xpCount}</p>
                <p className="text-[10px] text-muted-foreground">Total XP</p>
              </div>
              <div className="bg-gradient-to-br from-sunny/10 to-coral/10 rounded-xl p-3 text-center border border-sunny/20">
                <Medal className="h-5 w-5 mx-auto mb-1 text-sunny" />
                <p className="text-lg font-bold text-foreground">12</p>
                <p className="text-[10px] text-muted-foreground">Badges</p>
              </div>
              <div className="bg-gradient-to-br from-turquoise/10 to-lime/10 rounded-xl p-3 text-center border border-turquoise/20">
                <Trophy className="h-5 w-5 mx-auto mb-1 text-turquoise" />
                <p className="text-lg font-bold text-foreground">#24</p>
                <p className="text-[10px] text-muted-foreground">Rank</p>
              </div>
            </div>

            {/* Career Matches */}
            <div>
              <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-sunny" />
                Career Matches
              </p>
              <div className="space-y-2">
                {careerMatches.map((career, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border/30 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: `${300 + index * 150}ms` }}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${career.color} flex items-center justify-center shadow-md`}>
                      <career.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{career.title}</p>
                      <div className="w-full h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${career.color} rounded-full transition-all duration-1000`}
                          style={{ 
                            width: isVisible ? `${career.match}%` : '0%',
                            transitionDelay: `${500 + index * 150}ms`
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">{career.match}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Notification */}
        <div 
          className={`absolute -top-4 -right-4 z-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 border-2 border-lime/30 animate-float">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime to-turquoise flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Quiz Passed!</p>
                <p className="text-xs text-lime font-semibold">+50 XP Earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Badge */}
        <div 
          className={`absolute -bottom-3 -left-4 z-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 border-2 border-sunny/30 animate-badge-float">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sunny to-coral flex items-center justify-center shadow-lg">
                <Medal className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">New Badge!</p>
                <p className="text-xs text-sunny font-semibold">Code Master</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
