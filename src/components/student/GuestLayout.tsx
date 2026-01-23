import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GuestSidebar } from "./GuestSidebar";
import { GuestBottomNav } from "./GuestBottomNav";
import { Button } from "@/components/ui/button";
import { Menu, UserPlus, Timer } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import brainLogo from "@/assets/brain-logo.png";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { GuestErrorBoundary } from "@/components/student/GuestErrorBoundary";

export default function GuestLayout() {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const stored = localStorage.getItem("guestInfo");
      if (stored) {
        const parsed = JSON.parse(stored);
        const registeredAt = new Date(parsed.registeredAt);
        const now = new Date();
        const endTime = new Date(registeredAt.getTime() + 24 * 60 * 60 * 1000);
        const diff = endTime.getTime() - now.getTime();
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining({ hours, minutes });
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <GuestSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="h-14 sm:h-16 border-b border-border/40 bg-card/90 backdrop-blur-xl sticky top-0 z-50">
            <div className="h-full flex items-center justify-between px-3 sm:px-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <SidebarTrigger className="hidden">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </SidebarTrigger>
                <div 
                  className="flex items-center gap-1.5 sm:gap-2 lg:hidden cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <img src={brainLogo} alt="Logo" className="h-7 w-7 sm:h-8 sm:w-8" />
                  <span className="font-bold font-display text-sm sm:text-base">
                    Kode<span className="text-primary">Intel</span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Timer Badge */}
                <Badge 
                  variant="outline" 
                  className="bg-sunny/10 text-sunny border-sunny/30 text-[10px] sm:text-xs px-2 py-1 gap-1"
                >
                  <Timer className="h-3 w-3" />
                  <span className="font-mono font-bold">
                    {String(timeRemaining.hours).padStart(2, '0')}:{String(timeRemaining.minutes).padStart(2, '0')}
                  </span>
                </Badge>
                
                {/* Free Trial Badge - Hidden on small mobile */}
                <Badge className="hidden sm:flex bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 text-xs px-2.5 py-1 gap-1">
                  <Sparkles className="h-3 w-3" />
                  Free Trial
                </Badge>
                
                {/* Sign Up Button */}
                <Button
                  size="sm"
                  className="gap-1.5 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 rounded-xl shadow-md shadow-primary/20"
                  onClick={() => navigate("/student/signup")}
                >
                  <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Sign Up</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content - add bottom padding on mobile for bottom nav */}
          <main className="flex-1 overflow-auto pb-20 lg:pb-0">
            <GuestErrorBoundary>
              <Outlet />
            </GuestErrorBoundary>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <GuestBottomNav />
      </div>
    </SidebarProvider>
  );
}
