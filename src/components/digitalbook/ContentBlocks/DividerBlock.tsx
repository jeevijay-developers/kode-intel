import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DividerContent {
  style?: "line" | "dots" | "icon";
}

interface DividerBlockProps {
  content: DividerContent;
  className?: string;
}

export function DividerBlock({ content, className }: DividerBlockProps) {
  const { style = "line" } = content;

  if (style === "dots") {
    return (
      <div className={cn("py-8 flex justify-center gap-3", className)}>
        <div className="w-2 h-2 rounded-full bg-primary/40" />
        <div className="w-2 h-2 rounded-full bg-primary/60" />
        <div className="w-2 h-2 rounded-full bg-primary/40" />
      </div>
    );
  }

  if (style === "icon") {
    return (
      <div className={cn("py-8 flex justify-center", className)}>
        <div className="flex items-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
          <Sparkles className="w-5 h-5 text-primary/50" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("py-8", className)}>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
