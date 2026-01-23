import { useState } from "react";
import { BookOpen, Play, Star, ChevronRight, Clock, Video, FileText, Sparkles, X, CheckCircle, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MiniCourseCardProps {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  chaptersCount?: number;
  isEnrolled?: boolean;
  isLocked?: boolean;
  progress?: number;
  classLevel?: string;
  onAction: () => void;
  actionLabel?: string;
}

export function MiniCourseCard({
  id,
  title,
  description,
  thumbnail,
  chaptersCount = 0,
  isEnrolled = false,
  isLocked = false,
  progress = 0,
  classLevel,
  onAction,
  actionLabel = "View Course",
}: MiniCourseCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getClassColor = (level?: string) => {
    if (!level) return "from-primary/20 to-secondary/10";
    const num = parseInt(level.replace(/\D/g, ''));
    if (num <= 4) return "from-sunny/30 to-coral/20";
    if (num <= 6) return "from-turquoise/30 to-lime/20";
    if (num <= 8) return "from-primary/30 to-secondary/20";
    return "from-secondary/30 to-pink/20";
  };

  return (
    <>
      {/* Compact Card */}
      <button
        onClick={() => !isLocked && setIsOpen(true)}
        className={cn(
          "relative flex flex-col w-full overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-300 active:scale-[0.97] shadow-sm hover:shadow-md group",
          isLocked && "opacity-60",
          isEnrolled && "border-primary/30"
        )}
      >
        {/* Thumbnail - Compact */}
        <div className={cn(
          "relative aspect-[4/3] w-full overflow-hidden",
          `bg-gradient-to-br ${getClassColor(classLevel)}`
        )}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary/40" />
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-1.5 right-1.5">
            {isEnrolled && !isLocked && (
              <Badge className="bg-primary text-[9px] px-1.5 py-0.5 shadow-lg">
                <Sparkles className="h-2.5 w-2.5" />
              </Badge>
            )}
            {isLocked && (
              <div className="w-6 h-6 rounded-full bg-background/90 flex items-center justify-center">
                <Lock className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Class Badge */}
          {classLevel && (
            <Badge className="absolute bottom-1.5 left-1.5 bg-white/90 text-foreground text-[9px] px-1.5 py-0.5 shadow-lg">
              {classLevel}
            </Badge>
          )}
          
          {/* Chapter Count */}
          {chaptersCount > 0 && (
            <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <BookOpen className="h-2.5 w-2.5" />
              {chaptersCount}
            </div>
          )}
        </div>

        {/* Content - Very Compact */}
        <div className="p-2">
          <h3 className="font-semibold text-xs text-foreground line-clamp-2 text-left leading-tight min-h-[2rem]">
            {title}
          </h3>
          
          {/* Progress bar for enrolled courses */}
          {isEnrolled && !isLocked && progress > 0 && (
            <div className="mt-1.5">
              <Progress value={progress} className="h-1" />
            </div>
          )}
          
          {/* Rating */}
          {!isEnrolled && (
            <div className="flex items-center gap-0.5 mt-1">
              <Star className="h-2.5 w-2.5 text-sunny fill-sunny" />
              <span className="text-[10px] text-muted-foreground font-medium">4.9</span>
            </div>
          )}
        </div>
      </button>

      {/* Detail Pop-up Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md mx-4 rounded-2xl p-0 overflow-hidden max-h-[85vh] overflow-y-auto">
          {/* Header Image */}
          <div className={cn(
            "relative h-40 w-full overflow-hidden",
            `bg-gradient-to-br ${getClassColor(classLevel)}`
          )}>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-primary/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {classLevel && (
                <Badge className="bg-white/95 text-foreground shadow-lg text-xs">
                  {classLevel}
                </Badge>
              )}
              {isEnrolled && (
                <Badge className="bg-primary text-primary-foreground shadow-lg text-xs gap-1">
                  <Sparkles className="h-3 w-3" />
                  Enrolled
                </Badge>
              )}
            </div>
          </div>

          <div className="p-5 -mt-6 relative">
            {/* Title & Rating */}
            <DialogHeader className="text-left mb-4">
              <div className="flex items-center justify-between mb-2">
                <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-sunny fill-sunny" />
                  <span className="font-semibold">4.9</span>
                </div>
              </div>
              <DialogDescription className="text-muted-foreground">
                {description || "Learn exciting concepts in this comprehensive course designed for young minds."}
              </DialogDescription>
            </DialogHeader>

            {/* Course Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold">{chaptersCount}</p>
                <p className="text-[10px] text-muted-foreground">Chapters</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Video className="h-5 w-5 mx-auto mb-1 text-turquoise" />
                <p className="text-lg font-bold">{chaptersCount * 4}+</p>
                <p className="text-[10px] text-muted-foreground">Videos</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-accent" />
                <p className="text-lg font-bold">{chaptersCount * 2}h</p>
                <p className="text-[10px] text-muted-foreground">Duration</p>
              </div>
            </div>

            {/* Progress for enrolled users */}
            {isEnrolled && (
              <div className="mb-5 p-3 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="font-semibold text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* What You'll Learn */}
            <div className="mb-5">
              <h4 className="font-semibold text-sm mb-3">What You'll Learn</h4>
              <div className="space-y-2">
                {["Problem-solving & logical thinking", "AI concepts made easy", "Fun coding activities", "Real-world applications"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => {
                setIsOpen(false);
                onAction();
              }}
              className="w-full gap-2 rounded-xl h-12 text-base font-semibold shadow-lg"
            >
              {isEnrolled ? (
                <>
                  <Play className="h-5 w-5" />
                  Continue Learning
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  {actionLabel}
                </>
              )}
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
