import { Video, Target, Award, TrendingUp } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";

interface MobileProgressSectionProps {
  videoProgress: number;
  quizProgress: number;
  videosCompleted: number;
  videosTotal: number;
  quizzesPassed: number;
  quizzesTotal: number;
}

export function MobileProgressSection({
  videoProgress,
  quizProgress,
  videosCompleted,
  videosTotal,
  quizzesPassed,
  quizzesTotal,
}: MobileProgressSectionProps) {
  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          My Progress
        </h2>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Videos Card */}
        <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-turquoise/10 to-lime/5 border border-turquoise/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-turquoise/20 flex items-center justify-center">
              <Video className="h-5 w-5 text-turquoise" />
            </div>
            <CircularProgress 
              value={videoProgress} 
              size={50} 
              strokeWidth={5}
              className="text-turquoise"
            />
          </div>
          <p className="text-sm font-semibold text-foreground">Videos</p>
          <p className="text-xs text-muted-foreground">
            {videosCompleted}/{videosTotal} completed
          </p>
        </div>

        {/* Quizzes Card */}
        <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-coral/10 to-sunny/5 border border-coral/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-coral/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-coral" />
            </div>
            <CircularProgress 
              value={quizProgress} 
              size={50} 
              strokeWidth={5}
              className="text-coral"
            />
          </div>
          <p className="text-sm font-semibold text-foreground">Quizzes</p>
          <p className="text-xs text-muted-foreground">
            {quizzesPassed}/{quizzesTotal} passed
          </p>
        </div>
      </div>
    </div>
  );
}
