import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Rocket, 
  Code, 
  Cpu, 
  ChevronRight,
  ArrowRight,
  Sparkles,
  GraduationCap,
  CheckCircle2
} from "lucide-react";
import { GlassCard } from "./GlassCard";

const courseLevels = [
  { 
    grades: "Class 3-4", 
    title: "Foundation", 
    description: "Logical thinking basics",
    topics: ["What is AI?", "Patterns", "Problem solving"],
    icon: Lightbulb, 
    gradient: "from-sunny via-coral to-pink",
    glowColor: "sunny" as const
  },
  { 
    grades: "Class 5-6", 
    title: "Explorer", 
    description: "Algorithms & patterns",
    topics: ["Flowcharts", "Block coding", "Data"],
    icon: Rocket, 
    gradient: "from-primary via-secondary to-purple",
    glowColor: "primary" as const
  },
  { 
    grades: "Class 7-8", 
    title: "Builder", 
    description: "Python fundamentals",
    topics: ["Python basics", "Functions", "Games"],
    icon: Code, 
    gradient: "from-turquoise via-lime to-sunny",
    glowColor: "turquoise" as const
  },
  { 
    grades: "Class 9-10", 
    title: "Innovator", 
    description: "Advanced AI & ML",
    topics: ["ML concepts", "Neural nets", "Projects"],
    icon: Cpu, 
    gradient: "from-secondary via-pink to-coral",
    glowColor: "coral" as const
  },
];

export function MobileCourseLevels() {
  const navigate = useNavigate();

  return (
    <section className="py-8 px-4 bg-muted/20">
      {/* Section Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 glass-card rounded-full mb-3">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-primary">8 Grade Levels</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2 font-display">
          Progressive <span className="text-gradient-primary">Learning Paths</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Age-appropriate curriculum that grows with your child
        </p>
      </div>

      {/* 2-Column Grid with Glass Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {courseLevels.map((level, index) => (
          <GlassCard
            key={index}
            glowColor={level.glowColor}
            hover3D={false}
            size="sm"
            onClick={() => navigate("/guest")}
            className="relative overflow-hidden !p-4"
          >
            {/* Gradient Accent */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${level.gradient} rounded-t-xl`} />
            
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${level.gradient} flex items-center justify-center mb-2.5 shadow-lg`}>
              <level.icon className="h-5 w-5 text-white" />
            </div>
            
            {/* Content */}
            <Badge variant="outline" className="mb-1.5 text-[9px] font-bold border-primary/30 text-primary bg-primary/5 px-2 py-0.5">
              {level.grades}
            </Badge>
            <h3 className="text-sm font-bold text-foreground font-display mb-0.5">
              {level.title}
            </h3>
            <p className="text-[10px] text-muted-foreground leading-tight mb-2">
              {level.description}
            </p>
            
            {/* Topics Preview */}
            <div className="space-y-0.5">
              {level.topics.slice(0, 2).map((topic, i) => (
                <div key={i} className="flex items-center gap-1 text-[8px] text-muted-foreground">
                  <CheckCircle2 className="h-2.5 w-2.5 text-lime" />
                  {topic}
                </div>
              ))}
            </div>
            
            {/* Arrow */}
            <ChevronRight className="absolute bottom-3 right-2 h-4 w-4 text-muted-foreground/50" />
          </GlassCard>
        ))}
      </div>

      {/* View All Button with Shimmer */}
      <Button
        variant="outline"
        onClick={() => navigate("/guest")}
        className="w-full h-12 gap-2 rounded-xl border-2 font-semibold glass-card hover:bg-primary/5 hover:border-primary/50 transition-all relative overflow-hidden"
      >
        <Sparkles className="h-4 w-4 text-primary" />
        Explore All Courses
        <ArrowRight className="h-4 w-4" />
      </Button>
    </section>
  );
}
