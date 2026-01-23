import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "./StudentSidebar";
import { StudentBottomNav } from "./StudentBottomNav";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useGamification } from "@/hooks/useGamification";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Code } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import brainLogo from "@/assets/brain-logo.png";

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student, loading, signOut } = useStudentAuth();
  const { points } = useGamification(student?.id);

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  const handleSignOut = () => {
    signOut();
    navigate("/student/login");
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 animate-bounce" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <StudentSidebar
            studentName={student.student_name}
            currentLevel={points.current_level}
            totalPoints={points.total_points}
            streakDays={points.streak_days}
          />
        </div>
        
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="h-14 border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {/* Desktop sidebar trigger */}
              <SidebarTrigger className="hidden lg:flex">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              
              {/* Mobile logo */}
              <div 
                className="flex items-center gap-2 lg:hidden cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img src={brainLogo} alt="Logo" className="h-8 w-8" />
                <span className="font-bold font-display">
                  Kode<span className="text-primary">Intel</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/compiler")}
                className="h-9 w-9"
              >
                <Code className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto pb-20 lg:pb-0">
            <Outlet context={{ student, points }} />
          </main>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <StudentBottomNav />
      </div>
    </SidebarProvider>
  );
}
