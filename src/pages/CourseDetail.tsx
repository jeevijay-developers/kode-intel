import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  GraduationCap,
  Play,
  Clock,
  Users,
  Star,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Video,
  FileText,
  HelpCircle,
  Lightbulb,
  Rocket,
  Code,
  Cpu,
  Brain,
  Target,
  Award,
  Sparkles,
  Layers,
} from "lucide-react";
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

const levelLabels: Record<string, string> = {
  "3": "Foundation",
  "4": "Foundation",
  "5": "Explorer",
  "6": "Explorer",
  "7": "Builder",
  "8": "Builder",
  "9": "Innovator",
  "10": "Innovator",
};

export default function CourseDetail() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // Fetch course with chapters
  const { data: course, isLoading } = useQuery({
    queryKey: ["course-detail", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          chapters:chapters(id, title, description, order_index)
        `)
        .eq("id", slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const getClassNumber = (title: string): string => {
    const match = title?.match(/Class (\d+)/);
    return match ? match[1] : "";
  };

  const getBanner = (title: string): string => {
    const classMatch = title?.match(/Class \d+/);
    if (classMatch) {
      return courseBanners[classMatch[0]] || courseBannerAiIntro;
    }
    return courseBannerAiIntro;
  };

  const parseSubtopics = (description: string): string[] => {
    if (!description) return [];
    return description.split(" • ").filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-xl text-foreground">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/courses")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const classNum = getClassNumber(course.title);
  const LevelIcon = levelIcons[classNum] || Lightbulb;
  const levelLabel = levelLabels[classNum] || "Foundation";
  const banner = getBanner(course.title);
  const chapters = course.chapters?.sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index) || [];

  const objectives = [
    "Understand core concepts through engaging video lessons",
    "Practice with interactive exercises and quizzes",
    "Build real projects to apply your learning",
    "Earn badges and certificates upon completion",
    "Develop critical thinking and problem-solving skills",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Banner */}
      <section className="relative">
        {/* Banner Image */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img 
            src={banner} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/courses")}
              className="mb-6 text-foreground hover:bg-white/10 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>

            <div className="max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-white/90 text-foreground shadow-lg gap-1 px-3 py-1">
                  <LevelIcon className="h-3 w-3" />
                  Class {classNum}
                </Badge>
                <Badge className="bg-primary text-primary-foreground shadow-lg gap-1 px-3 py-1">
                  <Sparkles className="h-3 w-3" />
                  {levelLabel} Level
                </Badge>
                <Badge variant="outline" className="bg-white/90 text-foreground gap-1 px-3 py-1">
                  <Layers className="h-3 w-3" />
                  {chapters.length} Chapters
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">Video Lessons</p>
                    <p className="text-sm text-muted-foreground">Interactive content</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold">E-Books</p>
                    <p className="text-sm text-muted-foreground">Digital workbooks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-turquoise/10 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-turquoise" />
                  </div>
                  <div>
                    <p className="font-bold">Quizzes</p>
                    <p className="text-sm text-muted-foreground">Test your knowledge</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">4.9</span>
                  <span className="text-muted-foreground">(500+ students)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Curriculum */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <Card className="card-playful">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3 font-display">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary-foreground" />
                  </div>
                  What You'll Learn
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-foreground">{objective}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card className="card-playful">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3 font-display">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Course Curriculum
                  <Badge variant="secondary" className="ml-auto">
                    {chapters.length} Chapters
                  </Badge>
                </h2>

                <Accordion type="single" collapsible className="space-y-3">
                  {chapters.map((chapter: { id: string; title: string; description: string; order_index: number }, index: number) => {
                    const subtopics = parseSubtopics(chapter.description);
                    
                    return (
                      <AccordionItem 
                        key={chapter.id} 
                        value={chapter.id}
                        className="border border-border rounded-xl overflow-hidden bg-card"
                      >
                        <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                              <span className="font-bold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {chapter.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {subtopics.length} topics
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-4">
                          <div className="pl-14 space-y-3">
                            {subtopics.map((topic, topicIndex) => (
                              <div 
                                key={topicIndex}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-foreground text-sm">{topic}</span>
                              </div>
                            ))}
                            
                            {/* Content Indicators */}
                            <div className="flex items-center gap-4 pt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                Videos
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                E-book
                              </span>
                              <span className="flex items-center gap-1">
                                <HelpCircle className="h-3 w-3" />
                                Quiz
                              </span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="card-playful overflow-hidden">
                {/* Preview Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={banner} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-sunny text-foreground shadow-lg">
                      <Clock className="h-3 w-3 mr-1" />
                      7 Days Free Trial
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Price */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground line-through">₹4,999</p>
                    <p className="text-3xl font-bold text-foreground">
                      ₹3,499<span className="text-sm font-normal text-muted-foreground">/year</span>
                    </p>
                    <p className="text-sm text-primary font-medium">Save 30% with early enrollment</p>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg gap-2 rounded-xl btn-glow"
                    onClick={() => navigate("/student/login")}
                  >
                    <GraduationCap className="h-5 w-5" />
                    Start Learning
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Full access to all {chapters.length} chapters</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Interactive video lessons</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Practice quizzes & assessments</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Digital e-books & resources</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Completion certificate</span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        NEP 2020
                      </span>
                      <span className="flex items-center gap-1">
                        <Brain className="h-4 w-4" />
                        AI Curriculum
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* School CTA */}
              <Card className="mt-4 glass">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Are you a school administrator?
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/schools")}
                    className="gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Partner with Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}