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
  Heart,
  Video,
  BookOpen,
  Code,
  CheckCircle2
} from "lucide-react";

const features = [
  { icon: Video, title: "HD Videos", color: "text-coral", bg: "bg-coral/10" },
  { icon: Brain, title: "AI Learning", color: "text-primary", bg: "bg-primary/10" },
  { icon: Code, title: "Code Lab", color: "text-turquoise", bg: "bg-turquoise/10" },
  { icon: Gamepad2, title: "Gamified", color: "text-sunny", bg: "bg-sunny/10" },
  { icon: BookOpen, title: "Workbooks", color: "text-secondary", bg: "bg-secondary/10" },
  { icon: Shield, title: "Kid Safe", color: "text-lime", bg: "bg-lime/10" },
];

const whyUs = [
  { 
    icon: Target, 
    title: "NEP 2020 Aligned", 
    description: "Curriculum designed per national guidelines",
    gradient: "from-primary to-secondary"
  },
  { 
    icon: Clock, 
    title: "40-Min Sessions", 
    description: "Perfect for young learners' attention span",
    gradient: "from-turquoise to-lime"
  },
  { 
    icon: Trophy, 
    title: "Earn Badges & XP", 
    description: "Motivating rewards and achievements",
    gradient: "from-sunny to-coral"
  },
  { 
    icon: Heart, 
    title: "Built for Kids", 
    description: "Age-appropriate, fun & engaging content",
    gradient: "from-pink to-secondary"
  },
];

export function MobileFeaturesGrid() {
  return (
    <section className="py-8 px-4">
      {/* Quick Features */}
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold text-foreground mb-1 font-display">
          Everything Your Child <span className="text-gradient-primary">Needs</span>
        </h2>
        <p className="text-sm text-muted-foreground">Complete learning ecosystem</p>
      </div>

      {/* 3-Column Icon Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-8">
        {features.map((feature, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-3.5 rounded-xl ${feature.bg} border border-border/30 shadow-sm`}
          >
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center mb-2 shadow-sm">
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
            </div>
            <span className="text-[10px] font-bold text-foreground text-center leading-tight">
              {feature.title}
            </span>
          </div>
        ))}
      </div>

      {/* Why KodeIntel Section */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-foreground mb-3 font-display flex items-center gap-2">
          <Zap className="h-4 w-4 text-sunny" />
          Why Parents Love Us
        </h3>
      </div>

      {/* Why Us List */}
      <div className="space-y-2.5">
        {whyUs.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3.5 bg-card rounded-xl border border-border/50 shadow-sm"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <item.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-snug">{item.description}</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-lime flex-shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
