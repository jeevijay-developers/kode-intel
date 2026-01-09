import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Code, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", url: "/guest", icon: Home },
  { title: "Courses", url: "/guest/courses", icon: BookOpen },
  { title: "Code Lab", url: "/compiler", icon: Code },
  { title: "Badges", url: "/guest/achievements", icon: Trophy },
];

export function GuestBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          const IconComponent = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <IconComponent
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "text-primary"
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
