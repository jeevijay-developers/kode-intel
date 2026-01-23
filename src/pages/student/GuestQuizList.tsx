import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HelpCircle,
  Sparkles,
  Play,
  BookOpen,
  Star,
  Trophy,
  Clock,
  ChevronRight,
  Zap,
  Target,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import mascot from "@/assets/kodi-mascot-3d.png";

export default function GuestQuizList() {
  const navigate = useNavigate();

  // Fetch all published quizzes with their course/chapter info
  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["guest-all-quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapter_quizzes")
        .select(`
          *,
          chapters!chapter_quizzes_chapter_id_fkey (
            title,
            courses!chapters_course_id_fkey (
              title
            )
          )
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Get question count for each quiz
  const { data: questionCounts = {} } = useQuery({
    queryKey: ["guest-quiz-question-counts", quizzes.map(q => q.id)],
    queryFn: async () => {
      if (quizzes.length === 0) return {};
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("quiz_id")
        .in("quiz_id", quizzes.map(q => q.id));
      if (error) throw error;
      
      // Count questions per quiz
      const counts: Record<string, number> = {};
      data?.forEach(q => {
        counts[q.quiz_id] = (counts[q.quiz_id] || 0) + 1;
      });
      return counts;
    },
    enabled: quizzes.length > 0,
  });

  // Get class number from course title
  const getClassNum = (courseTitle: string): string => {
    const match = courseTitle?.match(/class\s*(\d+)/i);
    return match ? match[1] : "3";
  };

  // Gradient mappings
  const gradients: Record<string, string> = {
    "3": "from-coral to-sunny",
    "4": "from-turquoise to-lime",
    "5": "from-primary to-secondary",
    "6": "from-purple to-primary",
    "7": "from-sunny to-coral",
    "8": "from-lime to-turquoise",
    "9": "from-secondary to-purple",
    "10": "from-primary to-turquoise",
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 animate-fade-in pb-24 lg:pb-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple/15 via-primary/10 to-secondary/15 border border-purple/20 shadow-lg mb-4 sm:mb-6">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl from-sunny/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple/30 to-transparent rounded-full blur-xl" />
        
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple to-primary rounded-full blur-lg opacity-60" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple to-primary flex items-center justify-center shadow-lg">
                <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl font-display">
                Quiz Arena 🎯
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Test your knowledge & earn points!
              </p>
            </div>
            <img 
              src={mascot} 
              alt="Kodi" 
              className="h-14 w-14 sm:h-16 sm:w-16 drop-shadow-xl hidden sm:block"
            />
          </div>
        </CardContent>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Card className="p-3 sm:p-4 bg-gradient-to-br from-purple/10 to-purple/5 border-purple/20">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple/20 flex items-center justify-center mb-1.5">
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-purple">{quizzes.length}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">Quizzes</span>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-to-br from-sunny/10 to-sunny/5 border-sunny/20">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-sunny/20 flex items-center justify-center mb-1.5">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-sunny" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-sunny">0</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">Completed</span>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-to-br from-lime/10 to-lime/5 border-lime/20">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-lime/20 flex items-center justify-center mb-1.5">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-lime" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-lime">0</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">Points</span>
          </div>
        </Card>
      </div>

      {/* Quiz List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="w-20 h-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple/20 to-primary/20 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-purple/50" />
          </div>
          <h3 className="font-bold text-lg mb-2">No Quizzes Available</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Quizzes will appear here once they're published.
          </p>
          <Button onClick={() => navigate("/guest/courses")} className="gap-2">
            <BookOpen className="h-4 w-4" />
            Explore Courses
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz, index) => {
            const courseTitle = quiz.chapters?.courses?.title || "";
            const chapterTitle = quiz.chapters?.title || "";
            const classNum = getClassNum(courseTitle);
            const gradient = gradients[classNum] || gradients["3"];
            const questionCount = questionCounts[quiz.id] || 0;

            return (
              <Card
                key={quiz.id}
                className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group border-2 border-transparent hover:border-purple/30"
                onClick={() => navigate(`/guest/quiz/${quiz.id}`)}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    {/* Quiz Icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform`}>
                      <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>

                    {/* Quiz Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {chapterTitle && `${chapterTitle} • `}{courseTitle}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 gap-0.5">
                          <Target className="h-2.5 w-2.5" />
                          {questionCount} Qs
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 gap-0.5">
                          <Star className="h-2.5 w-2.5" />
                          {quiz.passing_score}% pass
                        </Badge>
                      </div>
                    </div>

                    {/* Play Button */}
                    <Button
                      size="sm"
                      className="gap-1.5 bg-gradient-to-r from-purple to-primary hover:opacity-90 shrink-0"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span className="hidden sm:inline">Start</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* CTA */}
      {quizzes.length > 0 && (
        <Card className="mt-4 sm:mt-6 overflow-hidden bg-gradient-to-r from-purple/10 via-primary/5 to-secondary/10 border-purple/20">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-primary flex items-center justify-center shadow-lg shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm sm:text-base">Unlock All Features</h4>
                <p className="text-xs text-muted-foreground">Sign up to save progress & compete on leaderboard</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/student/signup")}
                className="shrink-0 gap-1"
              >
                Sign Up
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
