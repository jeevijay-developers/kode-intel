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
  X,
  GraduationCap,
  Star,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import kodiMascot from "@/assets/kodi-mascot-3d.png";
import { getClassTheme, getMascotAnimation } from "@/lib/blockly/classThemes";

interface CodeLabWelcomeProps {
  classLevel: number;
  onComplete: () => void;
}

const getTutorialSteps = (classLevel: number) => {
  const theme = getClassTheme(classLevel);
  
  return [
    {
      id: 1,
      title: `${theme.welcomeTitle} 🎉`,
      description: `Hi! I'm KODI, your coding buddy. Welcome to the ${theme.name}!`,
      icon: Rocket,
      highlight: theme.tagline,
      mascotMessage: theme.mascotMessage
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
};

const STORAGE_KEY = 'codelab_welcome_seen';

export function CodeLabWelcome({ classLevel, onComplete }: CodeLabWelcomeProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const theme = getClassTheme(classLevel);
  const tutorialSteps = getTutorialSteps(classLevel);
  const mascotAnimation = getMascotAnimation(theme.mascotMood);

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
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-gradient-to-br from-background to-primary/5">
        {/* Skip button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full z-10"
          onClick={handleSkip}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Mascot section with class theme */}
        <div className={cn(
          "relative p-6 pb-12 bg-gradient-to-r",
          theme.gradient
        )}>
          {/* Theme badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 gap-1 text-[10px] bg-background/80 backdrop-blur"
          >
            <GraduationCap className="h-3 w-3" />
            Class {classLevel} • {theme.name}
          </Badge>

          <div className="flex items-center justify-center pt-4">
            <div className="relative">
              <img 
                src={kodiMascot} 
                alt="KODI" 
                className={cn(
                  "w-28 h-28 object-contain drop-shadow-lg",
                  mascotAnimation
                )}
                style={{ animationDuration: '2s' }}
              />
              {/* Sparkle effects */}
              <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-sunny animate-pulse" />
              <Star className="absolute -bottom-1 -left-2 h-4 w-4 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          {/* Speech bubble */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-card rounded-xl px-4 py-2.5 shadow-lg border max-w-[80%]">
            <p className="text-sm font-medium text-center">{step.mascotMessage}</p>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-card border-l border-t rotate-45"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-10">
          <DialogHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className={cn(
                "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center",
                theme.gradient
              )}>
                <StepIcon className="h-7 w-7 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-xl">{step.title}</DialogTitle>
            <DialogDescription className="text-sm">
              {step.description}
            </DialogDescription>
          </DialogHeader>

          {/* Highlight box with theme */}
          <div className={cn(
            "mt-4 p-3 rounded-xl border",
            currentStep === 0 
              ? `bg-gradient-to-r ${theme.gradient} border-primary/20`
              : "bg-sunny/10 border-sunny/20"
          )}>
            <p className="text-sm text-center font-medium">{step.highlight}</p>
          </div>

          {/* Class features on first step */}
          {currentStep === 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {theme.features.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] gap-1">
                  <Sparkles className="h-2.5 w-2.5 text-primary" />
                  {feature}
                </Badge>
              ))}
            </div>
          )}

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {tutorialSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  idx === currentStep 
                    ? "w-8 bg-primary" 
                    : idx < currentStep 
                      ? "w-2 bg-primary/50 hover:bg-primary/70" 
                      : "w-2 bg-muted hover:bg-muted-foreground/30"
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
              className={cn(
                "gap-1.5 bg-gradient-to-r",
                theme.gradient.replace(/\/20/g, '').replace(/\/10/g, '')
              )}
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))`
              }}
            >
              {isLastStep ? (
                <>
                  <Rocket className="h-4 w-4" />
                  Let's Code!
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
              Skip tutorial (I already know this)
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
