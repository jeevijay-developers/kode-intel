import { Video, Target, TrendingUp, Sparkles } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";

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
  const overallProgress = videosTotal + quizzesTotal > 0 
    ? Math.round(((videosCompleted + quizzesPassed) / (videosTotal + quizzesTotal)) * 100)
    : 0;

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-turquoise to-lime flex items-center justify-center shadow-md">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base font-display">My Progress</h2>
            <p className="text-[10px] text-muted-foreground">Keep up the great work!</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-bold text-primary">{overallProgress}%</span>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Videos Card */}
        <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-turquoise/15 to-lime/10 border border-turquoise/25 group">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-turquoise/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-turquoise to-lime flex items-center justify-center shadow-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <CircularProgress 
                value={videoProgress} 
                size={52} 
                strokeWidth={5}
                className="text-turquoise"
              />
            </div>
            <p className="text-sm font-bold text-foreground">Videos</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {videosCompleted} of {videosTotal}
              </p>
              <span className="text-xs font-bold text-turquoise">{videoProgress}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 h-1.5 rounded-full bg-turquoise/20 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-turquoise to-lime transition-all duration-500"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quizzes Card */}
        <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-coral/15 to-sunny/10 border border-coral/25 group">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-coral/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-coral to-sunny flex items-center justify-center shadow-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <CircularProgress 
                value={quizProgress} 
                size={52} 
                strokeWidth={5}
                className="text-coral"
              />
            </div>
            <p className="text-sm font-bold text-foreground">Quizzes</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {quizzesPassed} of {quizzesTotal}
              </p>
              <span className="text-xs font-bold text-coral">{quizProgress}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 h-1.5 rounded-full bg-coral/20 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-coral to-sunny transition-all duration-500"
                style={{ width: `${quizProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
