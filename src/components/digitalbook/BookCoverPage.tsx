import { cn } from "@/lib/utils";
import { BookOpen, Clock, Target, Sparkles } from "lucide-react";

interface BookCoverPageProps {
  title: string;
  subtitle?: string;
  coverImageUrl?: string;
  learningObjectives: string[];
  estimatedReadingTime: number;
  chapterNumber?: number;
}

export function BookCoverPage({
  title,
  subtitle,
  coverImageUrl,
  learningObjectives,
  estimatedReadingTime,
  chapterNumber,
}: BookCoverPageProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        {chapterNumber && (
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Chapter {chapterNumber}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Cover Image */}
      {coverImageUrl && (
        <div className="w-full max-w-md mb-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      )}

      {/* Reading Time Badge */}
      <div className="flex items-center gap-2 text-muted-foreground mb-8">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{estimatedReadingTime} min read</span>
      </div>

      {/* Learning Objectives */}
      {learningObjectives.length > 0 && (
        <div className="w-full max-w-lg">
          <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-6 border border-primary/10">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">
                What You'll Learn
              </h3>
            </div>

            <ul className="space-y-3">
              {learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm md:text-base">
                    {objective}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
