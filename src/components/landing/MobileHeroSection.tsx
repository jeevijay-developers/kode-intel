import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Play, 
  ChevronRight, 
  Sparkles, 
  Star,
  Users,
  BookOpen,
  Trophy,
  Brain,
  Zap,
  CheckCircle2,
  GraduationCap
} from "lucide-react";
import kodiMascot from "@/assets/kodi-mascot-3d.png";

interface MobileHeroSectionProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
}

export function MobileHeroSection({ onGetStarted, onTryDemo }: MobileHeroSectionProps) {
  return (
    <section className="relative py-8 px-4 overflow-hidden min-h-[95vh] flex flex-col justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-0 w-56 h-56 bg-turquoise/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-sunny/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <Badge className="bg-gradient-to-r from-primary/20 to-turquoise/20 text-primary border-primary/30 gap-1.5 px-4 py-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            <span className="text-xs font-bold">NEP 2020 Aligned • Classes 3-10</span>
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-[1.85rem] leading-[1.15] font-bold text-foreground mb-4 font-display">
            India's #1
            <br />
            <span className="text-gradient-primary">AI & Coding</span>
            {" "}Platform
            <br />
            for{" "}
            <span className="relative inline-block">
              <span className="text-gradient-playful">School Kids</span>
              <Sparkles className="absolute -top-1 -right-5 h-4 w-4 text-sunny animate-pulse" />
            </span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed px-2 max-w-xs mx-auto">
            Interactive digital books, visual coding lab, video lectures & gamified worksheets
          </p>
        </div>

        {/* Mascot with Animation */}
        <div className="relative mx-auto w-40 h-40 mb-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-secondary/15 to-turquoise/25 rounded-full blur-2xl animate-pulse" />
          <img 
            src={kodiMascot} 
            alt="KODI - Your AI Learning Buddy" 
            className="relative w-full h-full object-contain animate-float drop-shadow-2xl"
          />
          {/* Floating Elements */}
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-sunny/20 rounded-xl flex items-center justify-center animate-bounce" style={{ animationDelay: "0.5s" }}>
            <Brain className="h-5 w-5 text-sunny" />
          </div>
          <div className="absolute -bottom-1 -left-2 w-9 h-9 bg-turquoise/20 rounded-xl flex items-center justify-center animate-bounce" style={{ animationDelay: "1s" }}>
            <Trophy className="h-4 w-4 text-turquoise" />
          </div>
        </div>

        {/* Quick Features Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6 px-1">
          {[
            { icon: BookOpen, label: "Digital Books", color: "text-primary" },
            { icon: Play, label: "Videos", color: "text-turquoise" },
            { icon: Zap, label: "Code Lab", color: "text-sunny" },
            { icon: GraduationCap, label: "Worksheets", color: "text-coral" },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-xl p-2.5 text-center shadow-sm"
            >
              <feature.icon className={`h-4 w-4 mx-auto mb-1 ${feature.color}`} />
              <p className="text-[8px] text-muted-foreground font-medium leading-tight">{feature.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 px-2">
          <Button
            onClick={onGetStarted}
            className="w-full h-14 gap-2 rounded-2xl text-base font-bold shadow-xl shadow-primary/25 bg-gradient-to-r from-primary via-primary to-secondary hover:opacity-95 transition-all active:scale-[0.98]"
          >
            <Rocket className="h-5 w-5" />
            Start 7-Day Free Trial
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            onClick={onTryDemo}
            className="w-full h-12 gap-2 rounded-xl text-base font-semibold border-2 border-border/60 hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98] transition-all"
          >
            <Play className="h-4 w-4" />
            Try Free Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/90 to-secondary/90 border-2 border-background flex items-center justify-center shadow-sm"
                >
                  <span className="text-[8px] text-white font-bold">{i}</span>
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-[8px] text-foreground font-bold">+1K</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3 w-3 fill-sunny text-sunny" />
              ))}
              <span className="ml-1 text-sm font-bold text-foreground">4.9</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Loved by <span className="text-foreground font-bold">1000+</span> students & parents
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-2 px-2">
          {[
            { value: "50+", label: "Video Lessons" },
            { value: "25+", label: "Partner Schools" },
            { value: "8", label: "Grade Levels" },
          ].map((stat, i) => (
            <div key={i} className="text-center py-2 px-1 rounded-xl bg-muted/50">
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
