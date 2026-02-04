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
  CheckCircle2,
  FileQuestion,
  Blocks,
  Workflow,
  GlobeLock,
  BarChart3
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "Digital Books", color: "text-primary", bg: "bg-primary/10", desc: "Interactive textbooks" },
  { icon: Blocks, title: "Code Lab", color: "text-turquoise", bg: "bg-turquoise/10", desc: "Visual programming" },
  { icon: Video, title: "HD Videos", color: "text-coral", bg: "bg-coral/10", desc: "Expert lessons" },
  { icon: FileQuestion, title: "Worksheets", color: "text-sunny", bg: "bg-sunny/10", desc: "Auto-graded" },
  { icon: Trophy, title: "Gamified", color: "text-secondary", bg: "bg-secondary/10", desc: "Badges & XP" },
  { icon: Shield, title: "Kid Safe", color: "text-lime", bg: "bg-lime/10", desc: "No ads, protected" },
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

      {/* 3-Column Icon Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-8">
        {features.map((feature, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-3 rounded-xl ${feature.bg} border border-border/30 shadow-sm`}
          >
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center mb-1.5 shadow-sm">
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
            </div>
            <span className="text-[10px] font-bold text-foreground text-center leading-tight">
              {feature.title}
            </span>
            <span className="text-[8px] text-muted-foreground text-center">
              {feature.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Problems We Solve */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-foreground mb-3 font-display flex items-center gap-2">
          <Zap className="h-4 w-4 text-sunny" />
          Problems We Solve
        </h3>
      </div>

      {/* Solutions List */}
      <div className="space-y-2.5">
        {problemsSolved.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3.5 bg-card rounded-xl border border-border/50 shadow-sm"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <item.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground line-through">{item.problem}</p>
              <h4 className="font-bold text-sm text-foreground">{item.solution}</h4>
            </div>
            <CheckCircle2 className="h-4 w-4 text-lime flex-shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
