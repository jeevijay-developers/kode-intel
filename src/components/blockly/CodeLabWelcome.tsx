import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Blocks, 
  MousePointer, 
  Play, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import kodiMascot from "@/assets/kodi-mascot-3d.png";

interface CodeLabWelcomeProps {
  classLevel: number;
  onComplete: () => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: "Welcome to CodeLab! 🎉",
    description: "Hi! I'm KODI, your coding buddy. Let me show you how to create amazing things with blocks!",
    icon: Sparkles,
    highlight: "This is going to be fun!",
    mascotMessage: "Ready to become a coding star?"
  },
  {
    id: 2,
    title: "Step 1: Find Your Blocks",
    description: "See the colorful categories on the left? Each color has different types of blocks. Click one to explore!",
    icon: Blocks,
    highlight: "🔵 Blue = Motion  •  🟣 Purple = Looks  •  🟠 Orange = Control",
    mascotMessage: "Colors make coding easy!"
  },
  {
    id: 3,
    title: "Step 2: Drag & Connect",
    description: "Click and drag blocks to the workspace. They snap together like puzzle pieces!",
    icon: MousePointer,
    highlight: "Start with 'When program starts' - it's like a starting line!",
    mascotMessage: "Drag blocks to the white area!"
  },
  {
    id: 4,
    title: "Step 3: Run Your Code!",
    description: "Click the green Run button to see your creation come to life! Watch the Stage or Console for results.",
    icon: Play,
    highlight: "Try it, change it, try again - that's how coders learn!",
    mascotMessage: "Let's make some magic! ✨"
  }
];

const STORAGE_KEY = 'codelab_welcome_seen';

export function CodeLabWelcome({ classLevel, onComplete }: CodeLabWelcomeProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the welcome
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      setOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = tutorialSteps[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-gradient-to-br from-background to-primary/5">
        {/* Skip button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full z-10"
          onClick={handleSkip}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Mascot section */}
        <div className="relative bg-gradient-to-r from-primary/20 to-secondary/20 p-6 pb-10">
          <div className="flex items-center justify-center">
            <img 
              src={kodiMascot} 
              alt="KODI" 
              className="w-24 h-24 object-contain animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>
          
          {/* Speech bubble */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-card rounded-xl px-4 py-2 shadow-lg border">
            <p className="text-sm font-medium text-center">{step.mascotMessage}</p>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-card border-l border-t rotate-45"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-8">
          <DialogHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <StepIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-xl">{step.title}</DialogTitle>
            <DialogDescription className="text-sm">
              {step.description}
            </DialogDescription>
          </DialogHeader>

          {/* Highlight box */}
          <div className="mt-4 p-3 rounded-lg bg-sunny/10 border border-sunny/20">
            <p className="text-sm text-center font-medium">{step.highlight}</p>
          </div>

          {/* Class badge */}
          <div className="flex justify-center mt-4">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Class {classLevel} CodeLab
            </Badge>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  idx === currentStep 
                    ? "w-6 bg-primary" 
                    : idx < currentStep 
                      ? "bg-primary/50" 
                      : "bg-muted"
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="gap-1 bg-gradient-to-r from-primary to-secondary"
            >
              {isLastStep ? (
                <>
                  Let's Code!
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Skip link */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tutorial (I know this)
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export a reset function for testing
export function resetCodeLabWelcome() {
  localStorage.removeItem(STORAGE_KEY);
}
