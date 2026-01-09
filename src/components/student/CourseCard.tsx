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
      className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isLocked
          ? "opacity-75 bg-muted/30"
          : "bg-gradient-to-br from-card to-card/80"
      } ${isSuggested ? "ring-2 ring-sunny/50 shadow-sunny/20" : ""}`}
    >
      {/* Thumbnail */}
      <div className="relative h-36 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary/30" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {isSuggested && (
            <Badge className="bg-sunny text-foreground shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Recommended
            </Badge>
          )}
          {isEnrolled && !isLocked && (
            <Badge className="bg-primary shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              Enrolled
            </Badge>
          )}
        </div>

        {isLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-medium">
                Unlock with Subscription
              </p>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[40px]">
          {course.description || "Start your learning journey!"}
        </p>

        {/* Progress or Chapters */}
        {isEnrolled && !isLocked ? (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <BookOpen className="h-4 w-4" />
            <span>{chaptersCount} Chapters</span>
          </div>
        )}

        {/* Action Button */}
        {isLocked ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/public-courses")}
          >
            View Details
          </Button>
        ) : isEnrolled ? (
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={() => navigate(`/student/course/${course.id}`)}
          >
            <Play className="h-4 w-4 mr-2" />
            Continue Learning
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full border-primary/30 hover:bg-primary/10"
            onClick={onEnroll}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Start Course
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
