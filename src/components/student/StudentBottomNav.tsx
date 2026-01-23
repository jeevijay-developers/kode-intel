import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Code, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", url: "/student", icon: Home },
  { title: "Courses", url: "/student/my-courses", icon: BookOpen },
  { title: "Code", url: "/compiler", icon: Code },
  { title: "Ranks", url: "/student/leaderboard", icon: Trophy },
  { title: "Profile", url: "/student/profile", icon: User },
];

export function StudentBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 pb-safe lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          const IconComponent = item.icon;

          return (
            <button
              key={item.url}
              onClick={() => navigate(item.url)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-xl transition-all duration-300 active:scale-95",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "relative p-2 rounded-xl transition-all duration-300",
                  isActive && "bg-primary/15 shadow-lg shadow-primary/20"
                )}
              >
                <IconComponent
                  className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    isActive && "scale-110"
                  )}
                />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-all",
                  isActive && "font-bold text-primary"
                )}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
