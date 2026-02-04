import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface MatchColumnQuestionProps {
  questionData: {
    instruction: string;
    left_column: string[];
    right_column: string[];
    correct_matches: number[]; // Index of right item for each left item
  };
  onAnswer: (matches: number[], isCorrect: boolean) => void;
  disabled?: boolean;
}

export function MatchColumnQuestion({ questionData, onAnswer, disabled }: MatchColumnQuestionProps) {
  const { instruction, left_column, right_column, correct_matches } = questionData;
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<(number | null)[]>(
    Array(left_column.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);

  const usedRightIndices = matches.filter((m) => m !== null) as number[];
  const allMatched = matches.every((m) => m !== null);
  const isCorrect = matches.every((m, i) => m === correct_matches[i]);

  const handleLeftClick = (index: number) => {
    if (disabled || showResult) return;
    setSelectedLeft(selectedLeft === index ? null : index);
  };

  const handleRightClick = (index: number) => {
    if (disabled || showResult || selectedLeft === null) return;
    if (usedRightIndices.includes(index)) return;

    const newMatches = [...matches];
    newMatches[selectedLeft] = index;
    setMatches(newMatches);
    setSelectedLeft(null);
  };

  const handleCheck = () => {
    setShowResult(true);
    onAnswer(matches as number[], isCorrect);
  };

  const handleReset = () => {
    setMatches(Array(left_column.length).fill(null));
    setSelectedLeft(null);
    setShowResult(false);
  };

  const clearMatch = (leftIndex: number) => {
    if (disabled || showResult) return;
    const newMatches = [...matches];
    newMatches[leftIndex] = null;
    setMatches(newMatches);
  };

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <p className="text-lg text-foreground font-medium">{instruction}</p>

      {/* Match Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Column A
          </h4>
          {left_column.map((item, index) => {
            const matchedRight = matches[index];
            const isThisCorrect = matchedRight === correct_matches[index];

            return (
              <div key={index} className="flex items-center gap-2">
                <button
                  onClick={() =>
                    matchedRight !== null ? clearMatch(index) : handleLeftClick(index)
                  }
                  disabled={disabled || showResult}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-lg border-2 text-left transition-all",
                    selectedLeft === index
                      ? "bg-primary/10 border-primary"
                      : matchedRight !== null
                      ? showResult
                        ? isThisCorrect
                          ? "bg-green-500/10 border-green-500"
                          : "bg-red-500/10 border-red-500"
                        : "bg-muted border-muted-foreground/30"
                      : "bg-background border-border hover:border-primary/50"
                  )}
                >
                  <span className="font-medium text-primary mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {item}
                </button>

                {matchedRight !== null && (
                  <>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        showResult
                          ? isThisCorrect
                            ? "bg-green-500/20 text-green-600"
                            : "bg-red-500/20 text-red-600"
                          : "bg-primary/20 text-primary"
                      )}
                    >
                      {matchedRight + 1}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Column B
          </h4>
          {right_column.map((item, index) => {
            const isUsed = usedRightIndices.includes(index);

            return (
              <button
                key={index}
                onClick={() => handleRightClick(index)}
                disabled={disabled || showResult || selectedLeft === null || isUsed}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border-2 text-left transition-all",
                  isUsed
                    ? "bg-muted border-muted-foreground/30 opacity-50"
                    : selectedLeft !== null
                    ? "bg-background border-primary/50 hover:border-primary cursor-pointer"
                    : "bg-background border-border"
                )}
              >
                <span className="font-medium text-primary mr-2">{index + 1}.</span>
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {showResult && (
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg",
            isCorrect
              ? "bg-green-500/10 border border-green-500/30"
              : "bg-red-500/10 border border-red-500/30"
          )}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
          <p
            className={cn(
              "font-semibold",
              isCorrect ? "text-green-600" : "text-red-600"
            )}
          >
            {isCorrect
              ? "Perfect match! 🎉"
              : `You got ${matches.filter((m, i) => m === correct_matches[i]).length} out of ${left_column.length} correct`}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <Button onClick={handleCheck} disabled={disabled || !allMatched}>
            Check Matches
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
