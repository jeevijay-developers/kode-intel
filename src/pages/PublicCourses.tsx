import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Brain,
  Users,
  Lightbulb,
  Rocket,
  Code,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MiniCourseCard } from "@/components/courses/MiniCourseCard";
import { Skeleton } from "@/components/ui/skeleton";

// Import course banners
import courseBannerAiIntro from "@/assets/course-banner-ai-intro.png";
import courseBannerComputational from "@/assets/course-banner-computational.png";
import courseBannerPatterns from "@/assets/course-banner-patterns.png";
import courseBannerAlgorithms from "@/assets/course-banner-algorithms.png";
import courseBannerDataStructures from "@/assets/course-banner-data-structures.png";
import courseBannerMl from "@/assets/course-banner-ml.png";
import courseBannerAiWorld from "@/assets/course-banner-ai-world.png";
import courseBannerAiProjects from "@/assets/course-banner-ai-projects.png";
import studentsLearningAi from "@/assets/students-learning-ai.png";

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

const levelFilters = [
  { label: "All", value: "all", icon: Layers },
  { label: "3-4", value: "3-4", icon: Lightbulb },
  { label: "5-6", value: "5-6", icon: Rocket },
  { label: "7-8", value: "7-8", icon: Code },
  { label: "9-10", value: "9-10", icon: Cpu },
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

  const getClassLevel = (title: string): string => {
    const match = title.match(/Class \d+/);
    return match ? match[0] : "";
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
      {/* Hero Section - Mobile Optimized */}
      <section className="relative py-8 md:py-16 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-64 md:w-96 h-64 md:h-96 bg-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            {/* Badge */}
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1.5 mb-4 md:mb-6">
              <Sparkles className="h-3 w-3" />
              <span className="text-xs font-semibold">NEP 2020 Aligned</span>
            </Badge>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-6 font-display leading-tight">
              Explore Our <span className="text-gradient-primary">AI Curriculum</span>
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              From Class 3 to Class 10, discover comprehensive AI & Computational Thinking courses.
            </p>

            {/* Mobile Image */}
            <div className="md:hidden mb-6 rounded-2xl overflow-hidden shadow-xl border border-border/50">
              <img 
                src={studentsLearningAi} 
                alt="Students Learning" 
                className="w-full h-36 object-cover"
              />
            </div>

            {/* Stats - Compact for Mobile */}
            <div className="flex justify-center gap-4 md:gap-12">
              {[
                { value: "8", label: "Courses" },
                { value: "48", label: "Chapters" },
                { value: "240+", label: "Topics" },
              ].map((stat, index) => (
                <div key={index} className="text-center p-3 md:p-4 glass rounded-xl md:rounded-2xl min-w-[70px] md:min-w-[100px]">
                  <p className="text-xl md:text-3xl font-bold text-foreground font-display">{stat.value}</p>
                  <p className="text-[10px] md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters - Pill Style */}
      <section className="py-3 md:py-6 px-4 border-y border-border/50 sticky top-14 md:top-20 bg-background/95 backdrop-blur-xl z-40">
        <div className="container mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-start md:justify-center">
            {levelFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedLevel === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(filter.value)}
                className={`rounded-full gap-1.5 whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  selectedLevel === filter.value 
                    ? "shadow-lg shadow-primary/20" 
                    : "hover:bg-primary/5 hover:border-primary/30"
                }`}
              >
                <filter.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">
                  {filter.value === "all" ? "All Classes" : `Class ${filter.label}`}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid - 2 Columns on Mobile */}
      <section className="py-6 md:py-16 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-2 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 md:mb-6">
                <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">No courses found</h3>
              <p className="text-sm text-muted-foreground">Try selecting a different class level</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredCourses.map((course, index) => {
                const chapters = course.chapters || [];
                const classLevel = getClassLevel(course.title);
                const banner = getBanner(course.title);

                return (
                  <MiniCourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    thumbnail={banner}
                    chaptersCount={chapters.length}
                    classLevel={classLevel}
                    onAction={() => navigate(`/course/${course.id}`)}
                    actionLabel="View Course"
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-20 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-md md:max-w-2xl mx-auto">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 md:mb-6 backdrop-blur-sm">
              <Brain className="h-7 w-7 md:h-10 md:w-10 text-white" />
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 font-display">
              Ready to Start Your AI Journey?
            </h2>
            <p className="text-white/80 mb-6 md:mb-8 text-sm md:text-lg">
              Login to access courses, watch videos, take quizzes, and earn badges!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/student/login")}
                className="gap-2 rounded-full px-6 md:px-8 shadow-lg hover:shadow-xl h-11 md:h-12"
              >
                <GraduationCap className="h-5 w-5" />
                Student Login
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/schools")}
                className="gap-2 rounded-full px-6 md:px-8 bg-white/10 border-white/30 text-white hover:bg-white/20 h-11 md:h-12"
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
