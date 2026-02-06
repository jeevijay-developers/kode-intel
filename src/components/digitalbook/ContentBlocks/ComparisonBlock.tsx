import { cn } from "@/lib/utils";
import { ArrowLeftRight, Check, X } from "lucide-react";

interface ComparisonItem {
  label: string;
  points: string[];
}

interface ComparisonContent {
  heading?: string;
  leftTitle: string;
  rightTitle: string;
  leftItems: string[];
  rightItems: string[];
  leftPositive?: boolean;
  rightPositive?: boolean;
  conclusion?: string;
}

interface ComparisonBlockProps {
  content: ComparisonContent;
  className?: string;
}

export function ComparisonBlock({ content, className }: ComparisonBlockProps) {
  const { 
    heading, 
    leftTitle, 
    rightTitle, 
    leftItems, 
    rightItems,
    leftPositive = true,
    rightPositive = true,
    conclusion 
  } = content;

  return (
    <div className={cn("py-4", className)}>
      {heading && (
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4 text-center">
          {heading}
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column */}
        <div className={cn(
          "p-4 rounded-xl border",
          leftPositive 
            ? "bg-lime/5 border-lime/20" 
            : "bg-coral/5 border-coral/20"
        )}>
          <h4 className={cn(
            "font-semibold text-center mb-3 pb-2 border-b",
            leftPositive ? "text-lime border-lime/20" : "text-coral border-coral/20"
          )}>
            {leftTitle}
          </h4>
          <ul className="space-y-2">
            {leftItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                {leftPositive ? (
                  <Check className="h-4 w-4 text-lime shrink-0 mt-0.5" />
                ) : (
                  <X className="h-4 w-4 text-coral shrink-0 mt-0.5" />
                )}
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column */}
        <div className={cn(
          "p-4 rounded-xl border",
          rightPositive 
            ? "bg-lime/5 border-lime/20" 
            : "bg-coral/5 border-coral/20"
        )}>
          <h4 className={cn(
            "font-semibold text-center mb-3 pb-2 border-b",
            rightPositive ? "text-lime border-lime/20" : "text-coral border-coral/20"
          )}>
            {rightTitle}
          </h4>
          <ul className="space-y-2">
            {rightItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                {rightPositive ? (
                  <Check className="h-4 w-4 text-lime shrink-0 mt-0.5" />
                ) : (
                  <X className="h-4 w-4 text-coral shrink-0 mt-0.5" />
                )}
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Comparison icon */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="w-10 h-10 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
        </div>
      </div>

      {conclusion && (
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-sm font-medium text-foreground">{conclusion}</p>
        </div>
      )}
    </div>
  );
}
