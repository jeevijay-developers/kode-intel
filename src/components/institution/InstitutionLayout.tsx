import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useInstitutionAuth } from "@/hooks/useInstitutionAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Building2,
  Menu,
  ChevronRight,
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
  { title: "Dashboard", url: "/institution", icon: LayoutDashboard, color: "text-primary" },
  { title: "Students", url: "/institution/students", icon: Users, color: "text-turquoise" },
  { title: "Courses", url: "/institution/courses", icon: BookOpen, color: "text-coral" },
  { title: "Reports", url: "/institution/reports", icon: BarChart3, color: "text-purple" },
  { title: "Payments", url: "/institution/payments", icon: CreditCard, color: "text-sunny" },
];

export default function InstitutionLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { institution, loading, signOut } = useInstitutionAuth();

  useEffect(() => {
    if (!loading && !institution) {
      navigate("/institution/login");
    }
  }, [institution, loading, navigate]);

  const handleLogout = () => {
    signOut();
    navigate("/institution/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!institution) {
    return null;
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={brainLogo} alt="Logo" className="h-10 w-10" />
          <div>
            <span className="text-lg font-bold font-display block">
              Kode<span className="text-primary">Intel</span>
            </span>
            <span className="text-[10px] text-muted-foreground">Institution Portal</span>
          </div>
        </div>
      </div>

      {/* Institution Info */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{institution.institution_name}</p>
            <Badge variant="outline" className="text-[10px]">
              {institution.institution_type}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <button
              key={item.url}
              onClick={() => navigate(item.url)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-white shadow-lg"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "" : item.color}`} />
              <span className="font-medium text-sm flex-1 text-left">{item.title}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border/50 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => navigate("/institution/settings")}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-card">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 border-b border-border/50 bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <div className="flex flex-col h-full">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
            <img src={brainLogo} alt="Logo" className="h-8 w-8" />
            <span className="font-bold font-display">
              Kode<span className="text-primary">Intel</span>
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet context={{ institution }} />
        </main>
      </div>
    </div>
  );
}