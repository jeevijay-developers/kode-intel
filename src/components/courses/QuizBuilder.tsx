import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Check, Edit, X, Save } from "lucide-react";
import { useQuizQuestions, useQuizOptions } from "@/hooks/useCourses";

interface QuizBuilderProps {
  quizId: string;
}

export function QuizBuilder({ quizId }: QuizBuilderProps) {
  const { questions, createQuestion, deleteQuestion } = useQuizQuestions(quizId);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    question_type: "multiple_choice" as "multiple_choice" | "true_false",
  });

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text.trim()) return;
    await createQuestion.mutateAsync({
      quiz_id: quizId,
      question_text: newQuestion.question_text,
      question_type: newQuestion.question_type,
      order_index: questions.length,
    });
    setNewQuestion({ question_text: "", question_type: "multiple_choice" });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter question text"
          value={newQuestion.question_text}
          onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
          className="flex-1"
        />
        <Select
          value={newQuestion.question_type}
          onValueChange={(value: "multiple_choice" | "true_false") =>
            setNewQuestion({ ...newQuestion, question_type: value })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
            <SelectItem value="true_false">True/False</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAddQuestion}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionItem
            key={question.id}
            question={question}
            index={index}
            onDelete={() => deleteQuestion.mutate(question.id)}
          />
        ))}
      </div>

      {questions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Add questions to this quiz
        </p>
      )}
    </div>
  );
}

interface QuestionItemProps {
  question: {
    id: string;
    question_text: string;
    question_type: "multiple_choice" | "true_false";
    order_index: number;
  };
  index: number;
  onDelete: () => void;
}

function QuestionItem({ question, index, onDelete }: QuestionItemProps) {
  const { options, isLoading, createOption, updateOption, deleteOption } = useQuizOptions(question.id);
  const [newOptionText, setNewOptionText] = useState("");
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editingOptionText, setEditingOptionText] = useState("");

  const didInitTrueFalseRef = useRef(false);

  useEffect(() => {
    // Reset init flag when switching questions or types
    didInitTrueFalseRef.current = false;
  }, [question.id, question.question_type]);

  useEffect(() => {
    // Wait for query to finish loading before checking length
    if (isLoading) return;
    if (question.question_type !== "true_false") return;
    if (options.length > 0) return;
    if (didInitTrueFalseRef.current) return;

    didInitTrueFalseRef.current = true;

    (async () => {
      try {
        await createOption.mutateAsync({
          question_id: question.id,
          option_text: "True",
          is_correct: false,
          order_index: 0,
        });
        await createOption.mutateAsync({
          question_id: question.id,
          option_text: "False",
          is_correct: false,
          order_index: 1,
        });
      } catch {
        // If it failed, allow retry on next render
        didInitTrueFalseRef.current = false;
      }
    })();
  }, [question.id, question.question_type, options.length, isLoading, createOption]);

  const handleAddOption = async () => {
    if (!newOptionText.trim()) return;
    await createOption.mutateAsync({
      question_id: question.id,
      option_text: newOptionText,
      is_correct: false,
      order_index: options.length,
    });
    setNewOptionText("");
  };

  const handleSetCorrect = async (optionId: string) => {
    // First, set all options to incorrect
    for (const opt of options) {
      if (opt.is_correct) {
        await updateOption.mutateAsync({ id: opt.id, is_correct: false });
      }
    }
    // Then set the selected option to correct
    await updateOption.mutateAsync({ id: optionId, is_correct: true });
  };

  const handleStartEdit = (optionId: string, currentText: string) => {
    setEditingOptionId(optionId);
    setEditingOptionText(currentText);
  };

  const handleSaveEdit = async () => {
    if (!editingOptionId || !editingOptionText.trim()) return;
    await updateOption.mutateAsync({
      id: editingOptionId,
      option_text: editingOptionText,
    });
    setEditingOptionId(null);
    setEditingOptionText("");
  };

  const handleCancelEdit = () => {
    setEditingOptionId(null);
    setEditingOptionText("");
  };

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm text-muted-foreground">Question {index + 1}</span>
          <p className="font-medium">{question.question_text}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Options (click to mark correct answer)</Label>
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center gap-2 p-2 rounded transition-colors ${
              option.is_correct
                ? "bg-primary/10 border border-primary"
                : "bg-muted hover:bg-muted/80"
            } ${editingOptionId === option.id ? "" : "cursor-pointer"}`}
            onClick={() => {
              if (editingOptionId !== option.id) {
                handleSetCorrect(option.id);
              }
            }}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                option.is_correct ? "border-primary bg-primary" : "border-muted-foreground"
              }`}
            >
              {option.is_correct && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
            
            {editingOptionId === option.id ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={editingOptionText}
                  onChange={(e) => setEditingOptionText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  className="h-8"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit();
                  }}
                  className="h-8 w-8"
                >
                  <Save className="h-3 w-3 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  className="h-8 w-8"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1">{option.option_text}</span>
                {question.question_type === "multiple_choice" && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(option.id, option.option_text);
                      }}
                      className="h-8 w-8"
                    >
                      <Edit className="h-3 w-3 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteOption.mutate(option.id);
                      }}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {question.question_type === "multiple_choice" && (
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add option"
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
            />
            <Button variant="outline" size="sm" onClick={handleAddOption}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
