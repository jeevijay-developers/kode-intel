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
  Zap
} from "lucide-react";
import kodiMascot from "@/assets/kodi-mascot-3d.png";

interface MobileHeroSectionProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
}

export function MobileHeroSection({ onGetStarted, onTryDemo }: MobileHeroSectionProps) {
  return (
    <section className="relative py-6 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-0 w-56 h-56 bg-turquoise/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-coral/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-5">
          <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 gap-1.5 px-4 py-2 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-bold">NEP 2020 Aligned • Classes 3-10</span>
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-[2rem] leading-[1.15] font-bold text-foreground mb-4 font-display">
            Where Young Minds
            <br />
            <span className="text-gradient-primary">Master AI</span>
            {" "}& Learn
            <br />
            <span className="relative inline-block">
              <span className="text-gradient-playful">To Code</span>
              <Zap className="absolute -top-1 -right-5 h-5 w-5 text-sunny animate-pulse" />
            </span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed px-4 max-w-xs mx-auto">
            Fun video lessons, interactive quizzes & hands-on coding for the next generation of innovators
          </p>
        </div>

        {/* Mascot with Animation */}
        <div className="relative mx-auto w-44 h-44 mb-5">
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
            <Star className="h-4 w-4 text-turquoise fill-turquoise" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6 px-2">
          {[
            { icon: Users, value: "1K+", label: "Students", color: "primary" },
            { icon: BookOpen, value: "50+", label: "Videos", color: "turquoise" },
            { icon: Trophy, value: "25+", label: "Schools", color: "coral" },
            { icon: Star, value: "4.9", label: "Rating", color: "sunny" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-xl p-2.5 text-center shadow-sm"
            >
              <stat.icon className={`h-4 w-4 mx-auto mb-1 text-${stat.color}`} />
              <p className="text-sm font-bold text-foreground">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground font-medium">{stat.label}</p>
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
            Explore Demo Courses
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/90 to-secondary/90 border-2 border-background flex items-center justify-center shadow-sm"
                >
                  <span className="text-[9px] text-white font-bold">{i}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3 w-3 fill-sunny text-sunny" />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Trusted by <span className="text-foreground font-bold">1000+</span> parents & students
          </p>
        </div>
      </div>
    </section>
  );
}
