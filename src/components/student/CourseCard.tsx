import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  Lock,
  Sparkles,
  CheckCircle,
  Star,
} from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
  };
  isEnrolled: boolean;
  isLocked: boolean;
  isSuggested?: boolean;
  progress?: number;
  chaptersCount?: number;
  onEnroll?: () => void;
}

export function CourseCard({
  course,
  isEnrolled,
  isLocked,
  isSuggested,
  progress = 0,
  chaptersCount = 0,
  onEnroll,
}: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isLocked
          ? "opacity-75 bg-muted/30"
          : "bg-gradient-to-br from-card to-card/80"
      } ${isSuggested ? "ring-2 ring-sunny/50 shadow-sunny/20" : ""}`}
    >
      {/* Thumbnail */}
      <div className="relative h-24 sm:h-40 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
            </div>
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex gap-1 sm:gap-2">
          {isSuggested && (
            <Badge className="bg-sunny text-foreground shadow-lg text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 fill-current" />
              <span className="hidden sm:inline">Recommended</span>
              <span className="sm:hidden">Top</span>
            </Badge>
          )}
          {isEnrolled && !isLocked && (
            <Badge className="bg-primary shadow-lg text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 sm:mr-1" />
              <span className="hidden sm:inline">Enrolled</span>
            </Badge>
          )}
        </div>

        {isLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Lock className="h-6 w-6 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-sm text-muted-foreground font-medium">
                Locked
              </p>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-2 sm:p-4">
        <h3 className="font-bold text-foreground text-sm sm:text-base mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3 min-h-[16px] sm:min-h-[40px]">
          {course.description || "Start learning!"}
        </p>

        {/* Progress or Chapters */}
        {isEnrolled && !isLocked ? (
          <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{chaptersCount} Ch.</span>
          </div>
        )}

        {/* Action Button */}
        {isLocked ? (
          <Button
            variant="outline"
            className="w-full h-7 sm:h-9 text-xs sm:text-sm"
            onClick={() => navigate("/public-courses")}
          >
            View
          </Button>
        ) : isEnrolled ? (
          <Button
            className="w-full h-7 sm:h-9 text-xs sm:text-sm bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={() => navigate(`/student/course/${course.id}`)}
          >
            <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Continue
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full h-7 sm:h-9 text-xs sm:text-sm border-primary/30 hover:bg-primary/10"
            onClick={onEnroll}
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Start
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
