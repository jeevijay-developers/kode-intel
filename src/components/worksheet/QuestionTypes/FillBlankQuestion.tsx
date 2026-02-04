import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface FillBlankQuestionProps {
  questionData: {
    question: string;
    blanks: string[];
    hint?: string;
  };
  onAnswer: (answer: string[], isCorrect: boolean) => void;
  disabled?: boolean;
}

export function FillBlankQuestion({ questionData, onAnswer, disabled }: FillBlankQuestionProps) {
  const { question, blanks, hint } = questionData;
  const [answers, setAnswers] = useState<string[]>(Array(blanks.length).fill(""));
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Parse question to find blank positions
  const parts = question.split("_____");

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleCheck = () => {
    const correct = answers.every(
      (answer, index) =>
        answer.trim().toLowerCase() === blanks[index].toLowerCase()
    );
    setIsCorrect(correct);
    setShowResult(true);
    onAnswer(answers, correct);
  };

  const handleReset = () => {
    setAnswers(Array(blanks.length).fill(""));
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="space-y-6">
      {/* Question with blanks */}
      <div className="text-lg md:text-xl text-foreground leading-relaxed">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < blanks.length && (
              <Input
                type="text"
                value={answers[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                disabled={disabled || showResult}
                className={cn(
                  "inline-block w-32 mx-1 text-center font-medium",
                  showResult && (
                    answers[index].trim().toLowerCase() === blanks[index].toLowerCase()
                      ? "border-green-500 bg-green-500/10"
                      : "border-red-500 bg-red-500/10"
                  )
                )}
                placeholder="..."
              />
            )}
          </span>
        ))}
      </div>

      {/* Hint */}
      {hint && !showResult && (
        <p className="text-sm text-muted-foreground italic">💡 Hint: {hint}</p>
      )}

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
          <div>
            <p
              className={cn(
                "font-semibold",
                isCorrect ? "text-green-600" : "text-red-600"
              )}
            >
              {isCorrect ? "Excellent! 🎉" : "Not quite right"}
            </p>
            {!isCorrect && (
              <p className="text-sm text-muted-foreground">
                Correct answer{blanks.length > 1 ? "s" : ""}: {blanks.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <Button
            onClick={handleCheck}
            disabled={disabled || answers.some((a) => !a.trim())}
          >
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
