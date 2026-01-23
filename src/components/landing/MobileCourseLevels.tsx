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
  GraduationCap
} from "lucide-react";

const courseLevels = [
  { 
    grades: "Class 3-4", 
    title: "Foundation", 
    description: "Logical thinking basics",
    emoji: "🌟", 
    icon: Lightbulb, 
    gradient: "from-sunny via-coral to-pink",
    bg: "bg-gradient-to-br from-sunny/15 to-coral/10"
  },
  { 
    grades: "Class 5-6", 
    title: "Explorer", 
    description: "Algorithms & patterns",
    emoji: "🚀", 
    icon: Rocket, 
    gradient: "from-primary via-secondary to-purple",
    bg: "bg-gradient-to-br from-primary/15 to-secondary/10"
  },
  { 
    grades: "Class 7-8", 
    title: "Builder", 
    description: "Real-world projects",
    emoji: "⚡", 
    icon: Code, 
    gradient: "from-turquoise via-lime to-sunny",
    bg: "bg-gradient-to-br from-turquoise/15 to-lime/10"
  },
  { 
    grades: "Class 9-10", 
    title: "Innovator", 
    description: "Advanced AI & ML",
    emoji: "🧠", 
    icon: Cpu, 
    gradient: "from-secondary via-pink to-coral",
    bg: "bg-gradient-to-br from-secondary/15 to-pink/10"
  },
];

export function MobileCourseLevels() {
  const navigate = useNavigate();

  return (
    <section className="py-8 px-4 bg-muted/20">
      {/* Section Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-3">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-primary">Structured Curriculum</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2 font-display">
          Progressive Learning <span className="text-gradient-primary">Paths</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Age-appropriate content for every grade
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {courseLevels.map((level, index) => (
          <button
            key={index}
            onClick={() => navigate("/guest/courses")}
            className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 active:scale-[0.97] border border-border/40 ${level.bg} group shadow-sm`}
          >
            {/* Gradient Accent */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${level.gradient} rounded-t-2xl`} />
            
            {/* Icon */}
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${level.gradient} flex items-center justify-center mb-3 shadow-lg group-active:scale-90 transition-transform`}>
              <span className="text-xl">{level.emoji}</span>
            </div>
            
            {/* Content */}
            <Badge variant="outline" className="mb-1.5 text-[9px] font-bold border-primary/30 text-primary bg-primary/5 px-2 py-0.5">
              {level.grades}
            </Badge>
            <h3 className="text-sm font-bold text-foreground font-display mb-0.5">
              {level.title}
            </h3>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {level.description}
            </p>
            
            {/* Arrow */}
            <ChevronRight className="absolute bottom-4 right-3 h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>

      {/* View All Button */}
      <Button
        variant="outline"
        onClick={() => navigate("/guest/courses")}
        className="w-full h-12 gap-2 rounded-xl border-2 font-semibold hover:bg-primary/5 hover:border-primary/50 transition-all"
      >
        <Sparkles className="h-4 w-4 text-primary" />
        Explore All Courses
        <ArrowRight className="h-4 w-4" />
      </Button>
    </section>
  );
}
