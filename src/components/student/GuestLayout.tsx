import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GuestSidebar } from "./GuestSidebar";
import { GuestBottomNav } from "./GuestBottomNav";
import { Button } from "@/components/ui/button";
import { Menu, UserPlus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import brainLogo from "@/assets/brain-logo.png";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function GuestLayout() {
  const navigate = useNavigate();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <GuestSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="h-12 sm:h-14 border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-2 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <SidebarTrigger className="hidden">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
                <img src={brainLogo} alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="font-bold font-display text-sm sm:text-base">
                  Kode<span className="text-primary">Intel</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-turquoise/20 text-turquoise border-turquoise/30 text-xs px-2 py-0.5">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                Guest
              </Badge>
              <Button
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-primary to-secondary text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                onClick={() => navigate("/student/signup")}
              >
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            </div>
          </header>

          {/* Main Content - add bottom padding on mobile for bottom nav */}
          <main className="flex-1 overflow-auto pb-16 lg:pb-0">
            <Outlet />
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <GuestBottomNav />
      </div>
    </SidebarProvider>
  );
}
