import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Code, Trophy, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", url: "/guest", icon: Home, color: "primary" },
  { title: "Courses", url: "/guest/courses", icon: BookOpen, color: "turquoise" },
  { title: "Code Lab", url: "/compiler", icon: Code, color: "coral" },
  { title: "Quiz", url: "/guest/quiz", icon: HelpCircle, color: "purple" },
  { title: "Badges", url: "/guest/achievements", icon: Trophy, color: "sunny" },
];

export function GuestBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Frosted Glass Background */}
      <div className="absolute inset-0 bg-card/90 backdrop-blur-xl border-t border-border/40" />
      
      {/* Safe Area Padding for iOS */}
      <div className="relative flex items-center justify-around h-16 px-1 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url || 
            (item.url === "/guest/courses" && location.pathname.startsWith("/guest/courses")) ||
            (item.url === "/guest/quiz" && location.pathname.startsWith("/guest/quiz"));
          const IconComponent = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-300 min-w-[56px] relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:scale-95"
              )}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
              )}
              
              {/* Icon Container */}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                isActive 
                  ? `bg-${item.color}/15 shadow-sm` 
                  : "hover:bg-muted/50"
              )}>
                <IconComponent
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive && "scale-110"
                  )}
                />
              </div>
              
              {/* Label */}
              <span className={cn(
                "text-[9px] font-semibold tracking-wide transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
