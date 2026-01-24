import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Code,
  Timer,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const tutorialSteps = [
  {
    icon: GraduationCap,
    title: "Choose Your Class",
    description: "Tap 'Change Class' button to switch between Class 3-10 and explore different curricula",
    color: "from-primary to-secondary",
    highlight: "change-class",
  },
  {
    icon: BookOpen,
    title: "Explore Courses",
    description: "Each class has videos, quizzes & e-books. Tap any chapter to start learning!",
    color: "from-turquoise to-lime",
    highlight: "courses",
  },
  {
    icon: Trophy,
    title: "Check Leaderboard",
    description: "See how other students are performing and get motivated to learn more",
    color: "from-sunny to-coral",
    highlight: "leaderboard",
  },
  {
    icon: Code,
    title: "Practice Coding",
    description: "Use our Code Lab to write and run code in Python, Java, C++ and JavaScript",
    color: "from-lime to-turquoise",
    highlight: "codelab",
  },
  {
    icon: Timer,
    title: "24-Hour Free Trial",
    description: "Your trial expires in 24 hours. Sign up to unlock unlimited access!",
    color: "from-coral to-sunny",
    highlight: "timer",
  },
];

interface GuestTutorialProps {
  onComplete: () => void;
}

export function GuestTutorial({ onComplete }: GuestTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      localStorage.setItem("guestTutorialSeen", "true");
      onComplete();
    }, 300);
  };

  const step = tutorialSteps[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={handleSkip}
      />

      {/* Tutorial Card */}
      <div
        className={`relative w-full max-w-sm bg-card border border-primary/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-muted/80 hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          />
        </div>

        {/* Step content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div
            className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg transition-all duration-500`}
          >
            <StepIcon className="h-8 w-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold font-display mb-2 text-foreground">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {step.description}
          </p>

          {/* Step indicators */}
          <div className="flex justify-center gap-1.5 mb-6">
            {tutorialSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? "w-6 bg-primary"
                    : idx < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1 text-muted-foreground hover:text-foreground"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className={`flex-1 gap-2 bg-gradient-to-r ${step.color}`}
            >
              {isLastStep ? (
                <>
                  Get Started
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
        </div>

        {/* Step counter */}
        <div className="px-6 pb-4 text-center">
          <span className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {tutorialSteps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
