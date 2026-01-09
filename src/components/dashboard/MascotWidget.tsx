import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import mascotKodi from "@/assets/mascot-kodi.png";

interface MascotWidgetProps {
  className?: string;
  messages?: string[];
  name?: string;
}

const defaultMessages = [
  "Ready to learn something amazing? 🚀",
  "You're doing great! Keep going! 💪",
  "Every expert was once a beginner! 🌟",
  "Curiosity is your superpower! 🔮",
  "Let's make today awesome! ✨",
  "Learning is an adventure! 🎯",
  "You've got this! 🎉",
  "Small steps lead to big achievements! 🏆",
];

export function MascotWidget({
  className,
  messages = defaultMessages,
  name = "Explorer",
}: MascotWidgetProps) {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Mascot Image */}
      <div className="relative shrink-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-1 animate-bounce-gentle">
          <img
            src={mascotKodi}
            alt="Kodi the mascot"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        {/* Status indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-lime rounded-full border-2 border-card animate-pulse" />
      </div>

      {/* Speech Bubble */}
      <div className="relative flex-1 min-w-0">
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl rounded-bl-md px-3 py-2 border border-border/50 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium">Hi, {name}!</p>
          <p className="text-sm font-semibold text-foreground truncate animate-fade-in" key={currentMessage}>
            {messages[currentMessage]}
          </p>
        </div>
        {/* Bubble pointer */}
        <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-card/80 border-b-[6px] border-b-transparent" />
      </div>
    </div>
  );
}
