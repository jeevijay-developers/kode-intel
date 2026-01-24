import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  CheckCircle,
  Loader2,
  BookOpen,
  Video,
  Brain,
} from "lucide-react";
import { normalizeClassValue } from "@/lib/classLevel";

const classes = [
  { value: "3", label: "3", age: "8-9 yrs" },
  { value: "4", label: "4", age: "9-10 yrs" },
  { value: "5", label: "5", age: "10-11 yrs" },
  { value: "6", label: "6", age: "11-12 yrs" },
  { value: "7", label: "7", age: "12-13 yrs" },
  { value: "8", label: "8", age: "13-14 yrs" },
  { value: "9", label: "9", age: "14-15 yrs" },
  { value: "10", label: "10", age: "15-16 yrs" },
];

const loadingInsights = [
  { icon: BookOpen, text: "Loading new curriculum..." },
  { icon: Video, text: "Preparing video lessons..." },
  { icon: Brain, text: "Setting up quizzes..." },
];

interface ChangeClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentClass: string;
  onClassChange: (newClass: string) => void;
}

export function ChangeClassModal({
  open,
  onOpenChange,
  currentClass,
  onClassChange,
}: ChangeClassModalProps) {
  const normalizedCurrentClass = normalizeClassValue(currentClass) || "5";
  const [selectedClass, setSelectedClass] = useState(normalizedCurrentClass);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const handleConfirm = () => {
    setIsLoading(true);
    setLoadingStep(0);
    
    // Simulate loading steps with insights
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingInsights.length - 1) {
          clearInterval(interval);
          // Trigger the actual class change
          setTimeout(() => {
            onClassChange(selectedClass);
            setIsLoading(false);
            onOpenChange(false);
          }, 400);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
  };

  const handleClose = (value: boolean) => {
    if (!isLoading) {
      onOpenChange(value);
    }
  };

  // Loading State View
  if (isLoading) {
    const CurrentIcon = loadingInsights[loadingStep].icon;
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xs p-6 border-primary/20">
          <div className="flex flex-col items-center justify-center py-6 space-y-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse rounded-full" />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-bold text-foreground">
                Switching to Class {selectedClass}
              </p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <CurrentIcon className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm">{loadingInsights[loadingStep].text}</span>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5">
              {loadingInsights.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx <= loadingStep
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm p-4 border-primary/20">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Change Class
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Select your class level
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Compact class grid - 4 columns */}
        <div className="grid grid-cols-4 gap-1.5 py-3">
          {classes.map((cls) => {
            const isSelected = selectedClass === cls.value;
            const isCurrent = normalizedCurrentClass === cls.value;
            return (
              <button
                key={cls.value}
                onClick={() => setSelectedClass(cls.value)}
                className={`relative p-2 rounded-lg border transition-all duration-200 text-center ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md"
                    : isCurrent
                    ? "border-primary/30 bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <p className={`text-lg font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {cls.label}
                </p>
                <p className="text-[9px] text-muted-foreground leading-tight">{cls.age}</p>
                
                {isSelected && (
                  <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-primary bg-background rounded-full" />
                )}
                {isCurrent && !isSelected && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-secondary rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Current selection info */}
        {selectedClass !== normalizedCurrentClass && (
          <div className="text-center py-1.5 px-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground">
              Class <span className="font-semibold text-foreground">{normalizedCurrentClass}</span>
              {" → "}
              <span className="font-semibold text-primary">Class {selectedClass}</span>
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-9"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={selectedClass === normalizedCurrentClass}
            className="flex-1 h-9 bg-gradient-to-r from-primary to-secondary"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
