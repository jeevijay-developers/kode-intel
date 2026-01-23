import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Rocket, 
  Code, 
  Cpu, 
  ChevronRight,
  ArrowRight
} from "lucide-react";

const courseLevels = [
  { 
    grades: "Class 3-4", 
    title: "Foundation", 
    emoji: "🌟", 
    icon: Lightbulb, 
    gradient: "from-sunny via-coral to-pink",
    bg: "bg-sunny/10"
  },
  { 
    grades: "Class 5-6", 
    title: "Explorer", 
    emoji: "🚀", 
    icon: Rocket, 
    gradient: "from-primary via-secondary to-purple",
    bg: "bg-primary/10"
  },
  { 
    grades: "Class 7-8", 
    title: "Builder", 
    emoji: "⚡", 
    icon: Code, 
    gradient: "from-turquoise via-lime to-sunny",
    bg: "bg-turquoise/10"
  },
  { 
    grades: "Class 9-10", 
    title: "Innovator", 
    emoji: "🧠", 
    icon: Cpu, 
    gradient: "from-secondary via-pink to-coral",
    bg: "bg-secondary/10"
  },
];

export function MobileCourseLevels() {
  const navigate = useNavigate();

  return (
    <section className="py-8 px-4">
      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2 font-display">
          Choose Your <span className="text-gradient-primary">Level</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Progressive curriculum for each grade
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {courseLevels.map((level, index) => (
          <button
            key={index}
            onClick={() => navigate("/courses")}
            className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 active:scale-[0.97] border border-border/50 ${level.bg} group`}
          >
            {/* Gradient Accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${level.gradient}`} />
            
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${level.gradient} flex items-center justify-center mb-3 shadow-lg group-active:scale-90 transition-transform`}>
              <span className="text-lg">{level.emoji}</span>
            </div>
            
            {/* Content */}
            <p className="text-[10px] font-bold text-primary uppercase tracking-wide mb-0.5">
              {level.grades}
            </p>
            <h3 className="text-base font-bold text-foreground font-display">
              {level.title}
            </h3>
            
            {/* Arrow */}
            <ChevronRight className="absolute bottom-4 right-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>

      {/* View All Button */}
      <Button
        variant="outline"
        onClick={() => navigate("/courses")}
        className="w-full h-11 gap-2 rounded-xl border-2"
      >
        View All Courses
        <ArrowRight className="h-4 w-4" />
      </Button>
    </section>
  );
}
