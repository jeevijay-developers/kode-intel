import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Info } from "lucide-react";

interface ShortAnswerQuestionProps {
  questionData: {
    question: string;
    keywords: string[]; // Keywords to look for in the answer
    sample_answer?: string;
    hint?: string;
  };
  onAnswer: (answer: string, hasKeywords: boolean) => void;
  disabled?: boolean;
}

export function ShortAnswerQuestion({ questionData, onAnswer, disabled }: ShortAnswerQuestionProps) {
  const { question, keywords, sample_answer, hint } = questionData;
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Check if answer contains keywords
  const foundKeywords = keywords.filter((keyword) =>
    answer.toLowerCase().includes(keyword.toLowerCase())
  );
  const hasEnoughKeywords = foundKeywords.length >= Math.ceil(keywords.length / 2);

  const handleCheck = () => {
    setShowResult(true);
    onAnswer(answer, hasEnoughKeywords);
  };

  const handleReset = () => {
    setAnswer("");
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <p className="text-lg md:text-xl text-foreground leading-relaxed">
        {question}
      </p>

      {/* Answer Input */}
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={disabled || showResult}
        placeholder="Type your answer here..."
        className="min-h-[120px] text-base"
        rows={4}
      />

      {/* Hint */}
      {hint && !showResult && (
        <p className="text-sm text-muted-foreground italic">💡 Hint: {hint}</p>
      )}

      {/* Result */}
      {showResult && (
        <div className="space-y-4">
          {/* Keyword Analysis */}
          <div
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg",
              hasEnoughKeywords
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-amber-500/10 border border-amber-500/30"
            )}
          >
            {hasEnoughKeywords ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
              <Info className="w-6 h-6 text-amber-500 flex-shrink-0" />
            )}
            <div>
              <p
                className={cn(
                  "font-semibold",
                  hasEnoughKeywords ? "text-green-600" : "text-amber-600"
                )}
              >
                {hasEnoughKeywords
                  ? "Great answer! 🎉"
                  : "Good effort! Here are some key points:"}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      foundKeywords.includes(keyword)
                        ? "bg-green-500/20 text-green-600"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Answer */}
          {sample_answer && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium text-foreground mb-2">
                Sample Answer:
              </p>
              <p className="text-sm text-muted-foreground">{sample_answer}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <Button
            onClick={handleCheck}
            disabled={disabled || answer.trim().length < 10}
          >
            Submit Answer
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
