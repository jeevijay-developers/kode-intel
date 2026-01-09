import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Confetti, StarBurst } from "@/components/ui/confetti";

interface CelebrationContextType {
  triggerConfetti: () => void;
  triggerStarBurst: () => void;
  triggerBadgeUnlock: () => void;
}

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStarBurst, setShowStarBurst] = useState(false);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const triggerStarBurst = useCallback(() => {
    setShowStarBurst(true);
  }, []);

  const triggerBadgeUnlock = useCallback(() => {
    // Trigger confetti for badge unlocks
    setShowConfetti(true);
  }, []);

  return (
    <CelebrationContext.Provider
      value={{ triggerConfetti, triggerStarBurst, triggerBadgeUnlock }}
    >
      {children}
      <Confetti
        isActive={showConfetti}
        duration={4000}
        pieceCount={80}
        onComplete={() => setShowConfetti(false)}
      />
      <StarBurst
        isActive={showStarBurst}
        onComplete={() => setShowStarBurst(false)}
      />
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error("useCelebration must be used within a CelebrationProvider");
  }
  return context;
}
