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
  Trophy
} from "lucide-react";
import kodiMascot from "@/assets/kodi-mascot-3d.png";
import heroAiLearning from "@/assets/hero-ai-learning.png";

interface MobileHeroSectionProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
}

export function MobileHeroSection({ onGetStarted, onTryDemo }: MobileHeroSectionProps) {
  return (
    <section className="relative py-8 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-0 w-48 h-48 bg-turquoise/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-secondary/5 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1.5">
            <Sparkles className="h-3 w-3" />
            <span className="text-xs font-semibold">NEP 2020 Aligned</span>
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-3 font-display leading-tight">
            Building{" "}
            <span className="text-gradient-primary">Thinking</span>
            <br />
            Minds for the{" "}
            <span className="relative inline-block">
              <span className="text-gradient-playful">AI Age</span>
              <Sparkles className="absolute -top-1 -right-4 h-4 w-4 text-accent animate-pulse" />
            </span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed px-2">
            India's most exciting AI & Computational Thinking platform for Classes 3-10
          </p>
        </div>

        {/* Mascot with Animation */}
        <div className="relative mx-auto w-48 h-48 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 rounded-full blur-2xl animate-pulse" />
          <img 
            src={kodiMascot} 
            alt="KODI Mascot" 
            className="relative w-full h-full object-contain animate-float"
          />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { icon: Users, value: "1K+", label: "Students" },
            { icon: BookOpen, value: "50+", label: "Videos" },
            { icon: Trophy, value: "25+", label: "Schools" },
            { icon: Star, value: "4.9", label: "Rating" },
          ].map((stat, i) => (
            <div key={i} className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-2 text-center">
              <stat.icon className="h-4 w-4 mx-auto mb-0.5 text-primary" />
              <p className="text-sm font-bold text-foreground">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onGetStarted}
            className="w-full h-12 gap-2 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
          >
            <Rocket className="h-5 w-5" />
            Start Learning Free
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            onClick={onTryDemo}
            className="w-full h-11 gap-2 rounded-xl text-base font-semibold border-2"
          >
            <Play className="h-4 w-4" />
            Try Demo Course
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 border-2 border-background flex items-center justify-center"
              >
                <span className="text-[10px] text-white font-bold">{i}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-3 w-3 fill-sunny text-sunny" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">1000+ Happy Learners</span>
        </div>
      </div>
    </section>
  );
}
