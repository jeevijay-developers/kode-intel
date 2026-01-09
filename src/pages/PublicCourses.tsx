import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  Play,
  Clock,
  Users,
  Star,
  ChevronRight,
  Lightbulb,
  Rocket,
  Code,
  Cpu,
  Layers,
  CheckCircle2,
  Sparkles,
  Brain,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Import course banners
import courseBannerAiIntro from "@/assets/course-banner-ai-intro.png";
import courseBannerComputational from "@/assets/course-banner-computational.png";
import courseBannerPatterns from "@/assets/course-banner-patterns.png";
import courseBannerAlgorithms from "@/assets/course-banner-algorithms.png";
import courseBannerDataStructures from "@/assets/course-banner-data-structures.png";
import courseBannerMl from "@/assets/course-banner-ml.png";
import courseBannerAiWorld from "@/assets/course-banner-ai-world.png";
import courseBannerAiProjects from "@/assets/course-banner-ai-projects.png";

const courseBanners: Record<string, string> = {
  "Class 3": courseBannerAiIntro,
  "Class 4": courseBannerComputational,
  "Class 5": courseBannerPatterns,
  "Class 6": courseBannerAlgorithms,
  "Class 7": courseBannerDataStructures,
  "Class 8": courseBannerMl,
  "Class 9": courseBannerAiWorld,
  "Class 10": courseBannerAiProjects,
};

const levelIcons: Record<string, typeof Lightbulb> = {
  "3": Lightbulb,
  "4": Lightbulb,
  "5": Rocket,
  "6": Rocket,
  "7": Code,
  "8": Code,
  "9": Cpu,
  "10": Cpu,
};

const levelGradients: Record<string, string> = {
  "3": "from-sunny/20 to-coral/10",
  "4": "from-coral/20 to-pink/10",
  "5": "from-primary/20 to-turquoise/10",
  "6": "from-turquoise/20 to-lime/10",
  "7": "from-secondary/20 to-pink/10",
  "8": "from-pink/20 to-primary/10",
  "9": "from-turquoise/20 to-primary/10",
  "10": "from-primary/20 to-secondary/10",
};

const levelFilters = [
  { label: "All Classes", value: "all", icon: Layers },
  { label: "Class 3-4", value: "3-4", icon: Lightbulb, description: "Foundation" },
  { label: "Class 5-6", value: "5-6", icon: Rocket, description: "Explorer" },
  { label: "Class 7-8", value: "7-8", icon: Code, description: "Builder" },
  { label: "Class 9-10", value: "9-10", icon: Cpu, description: "Innovator" },
];

export default function PublicCourses() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Fetch courses from database
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["public-courses"],
    queryFn: async () => {
      const { data: coursesData, error } = await supabase
        .from("courses")
        .select(`
          *,
          chapters:chapters(id, title, description)
        `)
        .eq("is_published", true)
        .like("title", "Class%")
        .order("order_index");

      if (error) throw error;
      return coursesData;
    },
  });

  const getClassNumber = (title: string): string => {
    const match = title.match(/Class (\d+)/);
    return match ? match[1] : "";
  };

  const getBanner = (title: string): string => {
    const classMatch = title.match(/Class \d+/);
    if (classMatch) {
      return courseBanners[classMatch[0]] || courseBannerAiIntro;
    }
    return courseBannerAiIntro;
  };

  const filteredCourses = selectedLevel === "all"
    ? courses
    : courses.filter((course) => {
        const classNum = getClassNumber(course.title);
        if (selectedLevel === "3-4") return ["3", "4"].includes(classNum);
        if (selectedLevel === "5-6") return ["5", "6"].includes(classNum);
        if (selectedLevel === "7-8") return ["7", "8"].includes(classNum);
        if (selectedLevel === "9-10") return ["9", "10"].includes(classNum);
        return true;
      });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-foreground">NEP 2020 Aligned Curriculum</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display leading-tight">
              Explore Our <span className="text-gradient-primary">AI Curriculum</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              From Class 3 to Class 10, discover our comprehensive AI & Computational Thinking courses 
              designed to build future innovators.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {[
                { value: "8", label: "Courses" },
                { value: "48", label: "Chapters" },
                { value: "240+", label: "Topics" },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 glass rounded-2xl min-w-[100px] animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <p className="text-3xl md:text-4xl font-bold text-foreground font-display">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-y border-border/50 sticky top-20 bg-background/80 backdrop-blur-xl z-40">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            {levelFilters.map((filter, index) => (
              <Button
                key={filter.value}
                variant={selectedLevel === filter.value ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedLevel(filter.value)}
                className={`rounded-full gap-2 transition-all duration-300 animate-fade-in ${
                  selectedLevel === filter.value 
                    ? "shadow-lg shadow-primary/20 scale-105" 
                    : "hover:bg-primary/5 hover:border-primary/30"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <filter.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-5 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try selecting a different class level</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredCourses.map((course, index) => {
                const classNum = getClassNumber(course.title);
                const LevelIcon = levelIcons[classNum] || Lightbulb;
                const gradient = levelGradients[classNum] || "from-primary/20 to-primary/5";
                const banner = getBanner(course.title);
                const chapters = course.chapters || [];

                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group animate-fade-in border-0 shadow-lg"
                    onClick={() => navigate(`/course/${course.id}`)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Banner Image */}
                    <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
                      <img 
                        src={banner} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Level Badge */}
                      <Badge className="absolute top-4 left-4 bg-white/90 text-foreground shadow-lg gap-1">
                        <LevelIcon className="h-3 w-3" />
                        Class {classNum}
                      </Badge>

                      {/* Chapter Count */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="bg-white/90 rounded-full px-3 py-1 flex items-center gap-1 text-sm font-medium text-foreground">
                          <BookOpen className="h-3 w-3" />
                          {chapters.length} Chapters
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      {/* Title */}
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                        {course.description}
                      </p>

                      {/* Chapter Preview */}
                      {chapters.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {chapters.slice(0, 3).map((chapter: { id: string; title: string }) => (
                            <div key={chapter.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-primary" />
                              <span className="line-clamp-1">{chapter.title}</span>
                            </div>
                          ))}
                          {chapters.length > 3 && (
                            <p className="text-xs text-primary font-medium">
                              +{chapters.length - 3} more chapters
                            </p>
                          )}
                        </div>
                      )}

                      {/* Stats Row */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold">4.9</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            Videos
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            E-books
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className="w-full mt-4 rounded-full gap-2 group-hover:shadow-lg transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course/${course.id}`);
                        }}
                      >
                        View Course
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
              Ready to Start Your AI Journey?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Login to access all your assigned courses, watch videos, take quizzes, and earn badges!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/student/login")}
                className="gap-2 rounded-full px-8 shadow-lg hover:shadow-xl"
              >
                <GraduationCap className="h-5 w-5" />
                Student Login
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/schools")}
                className="gap-2 rounded-full px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Users className="h-5 w-5" />
                For Schools
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}