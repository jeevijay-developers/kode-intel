import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepByStepContent {
  heading?: string;
  steps: Step[];
  summary?: string;
}

interface StepByStepBlockProps {
  content: StepByStepContent;
  className?: string;
}

export function StepByStepBlock({ content, className }: StepByStepBlockProps) {
  const { heading, steps, summary } = content;

  return (
    <div className={cn("py-4", className)}>
      {heading && (
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">
          {heading}
        </h3>
      )}

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10"
          >
            {/* Step number circle */}
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {step.number}
                </span>
              </div>
            </div>

            {/* Step content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground mb-1">
                {step.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {summary && (
        <div className="mt-4 p-4 rounded-xl bg-lime/10 border border-lime/20 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-lime shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-foreground">{summary}</p>
        </div>
      )}
    </div>
  );
}
