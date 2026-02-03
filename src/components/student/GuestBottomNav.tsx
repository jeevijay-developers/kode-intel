import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Code, Trophy, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", url: "/guest", icon: Home, bgActive: "bg-primary/15" },
  { title: "Courses", url: "/guest/courses", icon: BookOpen, bgActive: "bg-turquoise/15" },
  { title: "Code Lab", url: "/codelab", icon: Code, bgActive: "bg-coral/15" },
  { title: "Quiz", url: "/guest/quiz", icon: HelpCircle, bgActive: "bg-purple/15" },
  { title: "Badges", url: "/guest/achievements", icon: Trophy, bgActive: "bg-sunny/15" },
];

export function GuestBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if on any quiz page (including quiz with ID)
  const isQuizActive = location.pathname === "/guest/quiz" || location.pathname.startsWith("/guest/quiz/");
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-lg" />
      
      {/* Navigation Items */}
      <div className="relative flex items-center justify-around h-16 px-1 pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map((item) => {
          const isActive = 
            location.pathname === item.url || 
            (item.url === "/guest/courses" && location.pathname.startsWith("/guest/courses")) ||
            (item.url === "/guest/quiz" && isQuizActive) ||
            (item.url === "/guest/achievements" && location.pathname.startsWith("/guest/achievements"));
          const IconComponent = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:scale-95"
              )}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
              )}
              
              {/* Icon Container */}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                isActive 
                  ? item.bgActive 
                  : "bg-transparent"
              )}>
                <IconComponent
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                />
              </div>
              
              {/* Label */}
              <span className={cn(
                "text-[9px] font-semibold tracking-wide",
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
