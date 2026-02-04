import { cn } from "@/lib/utils";
import { Lightbulb, Brain, HelpCircle, Sparkles, Info } from "lucide-react";

interface CalloutContent {
  variant: "did_you_know" | "think_about" | "try_this" | "fun_fact" | "info";
  title: string;
  text: string;
  icon?: string;
}

interface CalloutBlockProps {
  content: CalloutContent;
  className?: string;
}

const variantConfig = {
  did_you_know: {
    icon: Lightbulb,
    bgClass: "bg-amber-500/10 border-amber-500/30",
    iconClass: "text-amber-500",
    titleClass: "text-amber-600 dark:text-amber-400",
  },
  think_about: {
    icon: Brain,
    bgClass: "bg-purple-500/10 border-purple-500/30",
    iconClass: "text-purple-500",
    titleClass: "text-purple-600 dark:text-purple-400",
  },
  try_this: {
    icon: Sparkles,
    bgClass: "bg-green-500/10 border-green-500/30",
    iconClass: "text-green-500",
    titleClass: "text-green-600 dark:text-green-400",
  },
  fun_fact: {
    icon: HelpCircle,
    bgClass: "bg-blue-500/10 border-blue-500/30",
    iconClass: "text-blue-500",
    titleClass: "text-blue-600 dark:text-blue-400",
  },
  info: {
    icon: Info,
    bgClass: "bg-primary/10 border-primary/30",
    iconClass: "text-primary",
    titleClass: "text-primary",
  },
};

export function CalloutBlock({ content, className }: CalloutBlockProps) {
  const { variant, title, text } = content;
  const config = variantConfig[variant] || variantConfig.info;
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "my-6 p-4 md:p-6 rounded-xl border-2",
        config.bgClass,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            config.bgClass
          )}
        >
          <IconComponent className={cn("w-5 h-5", config.iconClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold mb-1", config.titleClass)}>
            {title}
          </h4>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
