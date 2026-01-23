import { BookOpen, Play, CheckCircle, Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MobileCourseCardProps {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  isCompleted?: boolean;
  isStarted?: boolean;
  onClick: () => void;
}

export function MobileCourseCard({
  title,
  description,
  thumbnail,
  isCompleted,
  isStarted,
  onClick,
}: MobileCourseCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50 w-full text-left transition-all duration-300 active:scale-[0.98] active:bg-muted/50",
        isCompleted && "border-primary/30 bg-primary/5"
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/10">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary/50" />
          </div>
        )}
        
        {/* Status overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-primary/80 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm text-foreground line-clamp-1">
            {title}
          </h3>
          {isCompleted ? (
            <Badge className="bg-primary/20 text-primary border-0 text-[10px] flex-shrink-0">
              Done
            </Badge>
          ) : isStarted ? (
            <Badge className="bg-turquoise/20 text-turquoise border-0 text-[10px] flex-shrink-0">
              Active
            </Badge>
          ) : (
            <Badge className="bg-sunny/20 text-sunny border-0 text-[10px] flex-shrink-0">
              New
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
          {description || "Start learning this exciting course!"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 text-sunny fill-sunny" />
            <span className="font-medium">4.8</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary font-medium">
            {isCompleted ? "Review" : isStarted ? "Continue" : "Start"}
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </button>
  );
}
