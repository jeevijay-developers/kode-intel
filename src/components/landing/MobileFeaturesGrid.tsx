import { 
  Brain, 
  Puzzle, 
  Gamepad2, 
  Monitor, 
  Target, 
  Clock, 
  Trophy, 
  Shield, 
  Zap, 
  Heart 
} from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered", color: "text-primary", bg: "bg-primary/10" },
  { icon: Puzzle, title: "Problem Solving", color: "text-secondary", bg: "bg-secondary/10" },
  { icon: Gamepad2, title: "Gamified", color: "text-accent", bg: "bg-accent/10" },
  { icon: Monitor, title: "Code Lab", color: "text-turquoise", bg: "bg-turquoise/10" },
  { icon: Target, title: "NEP 2020", color: "text-coral", bg: "bg-coral/10" },
  { icon: Shield, title: "Kid Safe", color: "text-lime", bg: "bg-lime/10" },
];

const whyUs = [
  { icon: Clock, title: "40-Min Sessions", description: "Perfect for young learners" },
  { icon: Trophy, title: "Earn Badges", description: "Gamified achievements" },
  { icon: Heart, title: "Built for Kids", description: "Age-appropriate content" },
  { icon: Zap, title: "Fun Activities", description: "Hands-on projects" },
];

export function MobileFeaturesGrid() {
  return (
    <section className="py-8 px-4 bg-muted/30">
      {/* Quick Features */}
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold text-foreground mb-2 font-display">
          Why <span className="text-gradient-primary">KodeIntel?</span>
        </h2>
      </div>

      {/* 3-Column Icon Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {features.map((feature, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-3 rounded-xl ${feature.bg} border border-border/30`}
          >
            <div className={`w-10 h-10 rounded-xl bg-background flex items-center justify-center mb-2 shadow-sm`}>
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
            </div>
            <span className="text-[10px] font-semibold text-foreground text-center leading-tight">
              {feature.title}
            </span>
          </div>
        ))}
      </div>

      {/* Why Us List */}
      <div className="space-y-3">
        {whyUs.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
