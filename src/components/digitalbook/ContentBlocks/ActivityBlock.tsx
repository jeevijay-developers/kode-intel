import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw, Gamepad2 } from "lucide-react";

interface ActivityContent {
  type: "quick_check" | "think_pair_share" | "hands_on";
  question: string;
  options?: string[];
  correct_index?: number;
  hint?: string;
}

interface ActivityBlockProps {
  content: ActivityContent;
  className?: string;
}

export function ActivityBlock({ content, className }: ActivityBlockProps) {
  const { type, question, options, correct_index, hint } = content;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selectedIndex === correct_index;

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedIndex(index);
  };

  const handleCheck = () => {
    if (selectedIndex !== null) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setShowResult(false);
  };

  if (type === "think_pair_share" || type === "hands_on") {
    return (
      <div
        className={cn(
          "my-6 p-4 md:p-6 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-wide">
            {type === "think_pair_share" ? "Think & Share" : "Hands-On Activity"}
          </span>
        </div>
        <p className="text-foreground font-medium text-lg mb-2">{question}</p>
        {hint && (
          <p className="text-muted-foreground text-sm italic">💡 Tip: {hint}</p>
        )}
      </div>
    );
  }

  // Quick Check (MCQ mini-activity)
  return (
    <div
      className={cn(
        "my-6 p-4 md:p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-primary/5 border border-blue-500/20",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-medium text-blue-500 uppercase tracking-wide">
          Quick Check
        </span>
      </div>

      <p className="text-foreground font-medium mb-4">{question}</p>

      {options && (
        <div className="space-y-2 mb-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border transition-all",
                selectedIndex === index
                  ? showResult
                    ? isCorrect
                      ? "bg-green-500/10 border-green-500 text-green-600"
                      : "bg-red-500/10 border-red-500 text-red-600"
                    : "bg-primary/10 border-primary"
                  : "bg-background border-border hover:border-primary/50",
                showResult && index === correct_index && "bg-green-500/10 border-green-500"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
                {showResult && index === correct_index && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                )}
                {showResult && selectedIndex === index && !isCorrect && (
                  <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {!showResult ? (
          <Button
            onClick={handleCheck}
            disabled={selectedIndex === null}
            size="sm"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleReset} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>

      {showResult && (
        <p
          className={cn(
            "mt-3 text-sm font-medium",
            isCorrect ? "text-green-600" : "text-red-600"
          )}
        >
          {isCorrect
            ? "🎉 Great job! That's correct!"
            : "Not quite. Try again!"}
        </p>
      )}
    </div>
  );
}
