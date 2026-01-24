import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { normalizeClassValue } from "@/lib/classLevel";

const classes = [
  { value: "3", label: "Class 3", age: "Ages 8-9", color: "from-coral to-sunny" },
  { value: "4", label: "Class 4", age: "Ages 9-10", color: "from-turquoise to-lime" },
  { value: "5", label: "Class 5", age: "Ages 10-11", color: "from-primary to-secondary" },
  { value: "6", label: "Class 6", age: "Ages 11-12", color: "from-purple to-primary" },
  { value: "7", label: "Class 7", age: "Ages 12-13", color: "from-sunny to-coral" },
  { value: "8", label: "Class 8", age: "Ages 13-14", color: "from-lime to-turquoise" },
  { value: "9", label: "Class 9", age: "Ages 14-15", color: "from-secondary to-purple" },
  { value: "10", label: "Class 10", age: "Ages 15-16", color: "from-primary to-turquoise" },
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

  const handleConfirm = () => {
    onClassChange(selectedClass);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-2 border-primary/20 shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold font-display">
            Change Class Level
          </DialogTitle>
          <DialogDescription className="text-center">
            Select a different class to explore its curriculum
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 py-4">
          {classes.map((cls) => {
            const isSelected = selectedClass === cls.value;
            const isCurrent = normalizedCurrentClass === cls.value;
            return (
              <button
                key={cls.value}
                onClick={() => setSelectedClass(cls.value)}
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cls.color} flex items-center justify-center mb-2`}>
                  <span className="text-primary-foreground text-xs font-bold">{cls.value}</span>
                </div>
                <p className="font-semibold text-sm">{cls.label}</p>
                <p className="text-[10px] text-muted-foreground">{cls.age}</p>
                
                {isSelected && (
                  <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
                )}
                {isCurrent && !isSelected && (
                  <Badge className="absolute top-2 right-2 text-[8px] px-1.5 py-0 bg-muted text-muted-foreground">
                    Current
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedClass === normalizedCurrentClass}
            className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary"
          >
            <Sparkles className="h-4 w-4" />
            Apply Changes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}