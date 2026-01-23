import { BookOpen, Play, CheckCircle, Star, ChevronRight, Sparkles, Clock } from "lucide-react";
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
        "relative flex items-center gap-4 p-4 rounded-2xl bg-card border w-full text-left transition-all duration-300 active:scale-[0.98] group overflow-hidden",
        isCompleted 
          ? "border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5" 
          : "border-border/50 hover:border-primary/30"
      )}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/10 shadow-md group-hover:shadow-lg transition-shadow">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/20">
            <BookOpen className="h-8 w-8 text-primary/60" />
          </div>
        )}
        
        {/* Status overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 flex items-center justify-center backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
        
        {/* Progress indicator for started courses */}
        {isStarted && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted/80">
            <div className="h-full w-1/3 bg-gradient-to-r from-turquoise to-lime rounded-r-full" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {isCompleted ? (
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 text-[10px] px-2 flex-shrink-0 shadow-sm">
              <CheckCircle className="h-2.5 w-2.5 mr-1" />
              Done
            </Badge>
          ) : isStarted ? (
            <Badge className="bg-gradient-to-r from-turquoise to-lime text-white border-0 text-[10px] px-2 flex-shrink-0 shadow-sm">
              <Play className="h-2.5 w-2.5 mr-1 fill-current" />
              Active
            </Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-sunny to-coral text-white border-0 text-[10px] px-2 flex-shrink-0 shadow-sm">
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              New
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2rem]">
          {description || "Start learning this exciting course and unlock your potential!"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-sunny fill-sunny" />
              <span className="font-semibold">4.8</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>6 chapters</span>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-colors",
            isCompleted 
              ? "bg-primary/10 text-primary" 
              : isStarted 
              ? "bg-turquoise/10 text-turquoise"
              : "bg-sunny/10 text-sunny"
          )}>
            {isCompleted ? "Review" : isStarted ? "Continue" : "Start"}
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </button>
  );
}
