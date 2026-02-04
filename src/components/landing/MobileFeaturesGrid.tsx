import { 
  Brain, 
  Gamepad2, 
  Target, 
  Trophy, 
  Shield, 
  Zap,
  Video,
  BookOpen,
  CheckCircle2,
  FileQuestion,
  Blocks,
  GlobeLock,
  BarChart3
} from "lucide-react";
import { GlassCard } from "./GlassCard";

const features = [
  { icon: BookOpen, title: "Digital Books", color: "text-primary", glowColor: "primary" as const, desc: "Interactive textbooks" },
  { icon: Blocks, title: "Code Lab", color: "text-turquoise", glowColor: "turquoise" as const, desc: "Visual programming" },
  { icon: Video, title: "HD Videos", color: "text-coral", glowColor: "coral" as const, desc: "Expert lessons" },
  { icon: FileQuestion, title: "Worksheets", color: "text-sunny", glowColor: "sunny" as const, desc: "Auto-graded" },
  { icon: Trophy, title: "Gamified", color: "text-secondary", glowColor: "secondary" as const, desc: "Badges & XP" },
  { icon: Shield, title: "Kid Safe", color: "text-lime", glowColor: "lime" as const, desc: "No ads, protected" },
];

const problemsSolved = [
  { 
    icon: Target, 
    problem: "Outdated curriculum",
    solution: "NEP 2020 Aligned AI & CT", 
    gradient: "from-primary to-secondary"
  },
  { 
    icon: GlobeLock, 
    problem: "No structure",
    solution: "Progressive learning paths", 
    gradient: "from-turquoise to-lime"
  },
  { 
    icon: Gamepad2, 
    problem: "Boring content",
    solution: "Gamified fun learning", 
    gradient: "from-sunny to-coral"
  },
  { 
    icon: BarChart3, 
    problem: "No visibility",
    solution: "Real-time progress tracking", 
    gradient: "from-pink to-secondary"
  },
];

export function MobileFeaturesGrid() {
  return (
    <section className="py-8 px-4">
      {/* Complete Ecosystem */}
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold text-foreground mb-1 font-display">
          4 Powerful <span className="text-gradient-primary">Modules</span>
        </h2>
        <p className="text-sm text-muted-foreground">Complete learning ecosystem</p>
      </div>

      {/* 3-Column Glass Icon Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-8">
        {features.map((feature, i) => (
          <GlassCard
            key={i}
            glowColor={feature.glowColor}
            hover3D={false}
            size="sm"
            className="flex flex-col items-center text-center !p-3"
          >
            <div className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center mb-1.5 shadow-sm border border-border/30">
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
            </div>
            <span className="text-[10px] font-bold text-foreground leading-tight">
              {feature.title}
            </span>
            <span className="text-[8px] text-muted-foreground">
              {feature.desc}
            </span>
          </GlassCard>
        ))}
      </div>

      {/* Problems We Solve */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-foreground mb-3 font-display flex items-center gap-2">
          <Zap className="h-4 w-4 text-sunny" />
          Problems We Solve
        </h3>
      </div>

      {/* Solutions List with Glass Cards */}
      <div className="space-y-2.5">
        {problemsSolved.map((item, i) => (
          <GlassCard
            key={i}
            glowColor={i % 2 === 0 ? 'primary' : 'turquoise'}
            hover3D={false}
            size="sm"
            className="!p-3.5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground line-through">{item.problem}</p>
                <h4 className="font-bold text-sm text-foreground">{item.solution}</h4>
              </div>
              <CheckCircle2 className="h-4 w-4 text-lime flex-shrink-0" />
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
