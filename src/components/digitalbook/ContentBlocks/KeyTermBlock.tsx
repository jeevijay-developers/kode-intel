import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface KeyTermContent {
  term: string;
  definition: string;
  example?: string;
  pronunciation?: string;
}

interface KeyTermBlockProps {
  content: KeyTermContent;
  className?: string;
}

export function KeyTermBlock({ content, className }: KeyTermBlockProps) {
  const { term, definition, example, pronunciation } = content;

  return (
    <div
      className={cn(
        "py-4 px-5 rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
          <BookOpen className="h-5 w-5 text-secondary-foreground" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Term */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="text-lg font-bold text-foreground">
              {term}
            </h4>
            {pronunciation && (
              <span className="text-sm text-muted-foreground italic">
                ({pronunciation})
              </span>
            )}
          </div>

          {/* Definition */}
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {definition}
          </p>

          {/* Example */}
          {example && (
            <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                Example
              </p>
              <p className="text-sm text-foreground italic">"{example}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
