import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from "lucide-react";

interface TrueFalseQuestionProps {
  questionData: {
    statement: string;
    correct_answer: boolean;
    explanation?: string;
  };
  onAnswer: (answer: boolean, isCorrect: boolean) => void;
  disabled?: boolean;
}

export function TrueFalseQuestion({ questionData, onAnswer, disabled }: TrueFalseQuestionProps) {
  const { statement, correct_answer, explanation } = questionData;
  const [selected, setSelected] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selected === correct_answer;

  const handleSelect = (value: boolean) => {
    if (disabled || showResult) return;
    setSelected(value);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setShowResult(true);
    onAnswer(selected, selected === correct_answer);
  };

  const handleReset = () => {
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      {/* Statement */}
      <p className="text-lg md:text-xl text-foreground leading-relaxed">
        {statement}
      </p>

      {/* True/False Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleSelect(true)}
          disabled={disabled || showResult}
          className={cn(
            "flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all",
            selected === true
              ? showResult
                ? isCorrect
                  ? "bg-green-500/10 border-green-500"
                  : "bg-red-500/10 border-red-500"
                : "bg-primary/10 border-primary"
              : "bg-background border-border hover:border-primary/50",
            showResult && correct_answer === true && "bg-green-500/10 border-green-500"
          )}
        >
          <ThumbsUp
            className={cn(
              "w-6 h-6",
              selected === true ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span className="font-semibold text-lg">True</span>
        </button>

        <button
          onClick={() => handleSelect(false)}
          disabled={disabled || showResult}
          className={cn(
            "flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all",
            selected === false
              ? showResult
                ? isCorrect
                  ? "bg-green-500/10 border-green-500"
                  : "bg-red-500/10 border-red-500"
                : "bg-primary/10 border-primary"
              : "bg-background border-border hover:border-primary/50",
            showResult && correct_answer === false && "bg-green-500/10 border-green-500"
          )}
        >
          <ThumbsDown
            className={cn(
              "w-6 h-6",
              selected === false ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span className="font-semibold text-lg">False</span>
        </button>
      </div>

      {/* Result */}
      {showResult && (
        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg",
            isCorrect
              ? "bg-green-500/10 border border-green-500/30"
              : "bg-red-500/10 border border-red-500/30"
          )}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          )}
          <div>
            <p
              className={cn(
                "font-semibold",
                isCorrect ? "text-green-600" : "text-red-600"
              )}
            >
              {isCorrect ? "Correct! 🎉" : "Not quite right"}
            </p>
            {explanation && (
              <p className="text-sm text-muted-foreground mt-1">{explanation}</p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <Button onClick={handleCheck} disabled={disabled || selected === null}>
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleReset} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
