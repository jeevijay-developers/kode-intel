import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  BookOpen,
  Code,
  Sparkles,
  ChevronRight,
  Rocket,
  Timer,
  Trophy,
  Zap,
  Star,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChangeClassModal } from "@/components/guest/ChangeClassModal";

interface GuestInfo {
  name: string;
  mobile: string;
  selectedClass: string;
  registeredAt: Date;
}

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/guest", 
    icon: Home, 
    iconBg: "bg-primary/10",
    iconBgHover: "group-hover/item:bg-primary/20",
    iconColor: "text-primary"
  },
  { 
    title: "All Courses", 
    url: "/guest/courses", 
    icon: BookOpen, 
    iconBg: "bg-turquoise/10",
    iconBgHover: "group-hover/item:bg-turquoise/20",
    iconColor: "text-turquoise"
  },
  { 
    title: "Leaderboard", 
    url: "/guest/leaderboard", 
    icon: Trophy, 
    iconBg: "bg-sunny/10",
    iconBgHover: "group-hover/item:bg-sunny/20",
    iconColor: "text-sunny"
  },
  { 
    title: "Code Lab", 
    url: "/compiler", 
    icon: Code, 
    iconBg: "bg-lime/10",
    iconBgHover: "group-hover/item:bg-lime/20",
    iconColor: "text-lime"
  },
];

export function GuestSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [showChangeClass, setShowChangeClass] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const stored = localStorage.getItem("guestInfo");
      if (stored) {
        const parsed = JSON.parse(stored);
        setGuestInfo(parsed);
        const registeredAt = new Date(parsed.registeredAt);
        const now = new Date();
        const endTime = new Date(registeredAt.getTime() + 24 * 60 * 60 * 1000);
        const diff = endTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeRemaining({ hours: 0, minutes: 0 });
        } else {
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

  const handleClassChange = (newClass: string) => {
    if (guestInfo) {
      const updatedInfo = { ...guestInfo, selectedClass: newClass };
      localStorage.setItem("guestInfo", JSON.stringify(updatedInfo));
      setGuestInfo(updatedInfo);
      window.location.reload();
    }
    setShowChangeClass(false);
  };

  const isExpired = timeRemaining.hours === 0 && timeRemaining.minutes === 0;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-60"} transition-all duration-300 border-r-0 shadow-xl`}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-to-b from-card via-card to-muted/50 border-r border-border/50">
        {/* Logo Section */}
        <div className="p-3 sm:p-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative transition-transform duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-secondary/50 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-lg">
                <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center">
                  <img src={brainLogo} alt="Logo" className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
              </div>
              <Sparkles className="h-3 w-3 text-sunny absolute -top-1 -right-1 animate-pulse drop-shadow-lg" />
            </div>
            {!collapsed && (
              <div>
                <span className="text-lg font-bold font-display block leading-tight">
                  Kode<span className="text-primary">Intel</span>
                </span>
                <span className="text-[10px] text-muted-foreground">AI Learning Platform</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Class Badge & Change Button */}
        {!collapsed && guestInfo?.selectedClass && (
          <div className="px-3 pb-2">
            <Button
              variant="outline"
              onClick={() => setShowChangeClass(true)}
              className="w-full justify-between border-primary/30 hover:bg-primary/10 h-10"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="font-semibold">Class {guestInfo.selectedClass}</span>
              </div>
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>
        )}

        {/* Collapsed Class Badge */}
        {collapsed && guestInfo?.selectedClass && (
          <div className="px-2 pb-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowChangeClass(true)}
              className="w-full aspect-square border-primary/30 hover:bg-primary/10"
            >
              <span className="text-xs font-bold text-primary">{guestInfo.selectedClass}</span>
            </Button>
          </div>
        )}

        {/* Trial Timer Card */}
        {!collapsed && (
          <div className="px-3 pb-3">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 via-secondary/10 to-turquoise/15 p-3 border border-primary/20 shadow-inner">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-sunny/30 to-transparent rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-coral to-sunny flex items-center justify-center shadow-md">
                    <Timer className={`h-4 w-4 text-white ${!isExpired ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Free Trial</p>
                  </div>
                </div>
                
                {!isExpired ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-primary">{timeRemaining.hours}h</span>
                    <span className="text-lg font-bold font-mono text-primary/70">{timeRemaining.minutes}m</span>
                    <span className="text-xs text-muted-foreground ml-1">left</span>
                  </div>
                ) : (
                  <Badge className="bg-coral/20 text-coral border-coral/30">Expired</Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Timer */}
        {collapsed && (
          <div className="px-2 pb-2">
            <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col items-center justify-center border border-primary/20">
              <Timer className="h-4 w-4 text-coral mb-0.5 animate-pulse" />
              <span className="text-[10px] font-bold text-primary">{timeRemaining.hours}h</span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1 py-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5 px-2">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.url;
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`group/item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                            : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                        }`}
                        activeClassName="bg-gradient-to-r from-primary to-secondary text-white"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isActive 
                            ? 'bg-white/20' 
                            : `${item.iconBg} ${item.iconBgHover}`
                        }`}>
                          <IconComponent
                            className={`h-4 w-4 transition-transform duration-300 ${
                              isActive ? "text-white scale-110" : `${item.iconColor} group-hover/item:scale-110`
                            }`}
                          />
                        </div>
                        {!collapsed && (
                          <>
                            <span className="font-medium flex-1 text-sm">{item.title}</span>
                            <ChevronRight
                              className={`h-4 w-4 transition-all duration-300 ${
                                isActive
                                  ? "opacity-100 translate-x-0"
                                  : "opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0"
                              }`}
                            />
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Up CTA */}
        {!collapsed && (
          <div className="p-3 mt-auto">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-3 border border-primary/20">
              <Star className="absolute top-2 right-2 h-4 w-4 text-sunny animate-pulse" />
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">Unlock Full Access</span>
              </div>
              <Button
                onClick={() => navigate("/student/signup")}
                className="w-full gap-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500 text-sm h-10 font-semibold shadow-lg"
              >
                <Rocket className="h-4 w-4" />
                Sign Up Free
              </Button>
            </div>
          </div>
        )}

        {/* Collapsed Sign Up */}
        {collapsed && (
          <div className="p-2 mt-auto">
            <Button
              onClick={() => navigate("/student/signup")}
              size="icon"
              className="w-full aspect-square bg-gradient-to-br from-primary to-secondary hover:opacity-90 shadow-lg"
            >
              <Rocket className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Trigger at bottom */}
        <div className="p-2 border-t border-border/30">
          <SidebarTrigger className="w-full justify-center hover:bg-muted/50 transition-colors" />
        </div>
      </SidebarContent>

      {/* Change Class Modal */}
      <ChangeClassModal
        open={showChangeClass}
        onOpenChange={setShowChangeClass}
        currentClass={guestInfo?.selectedClass || "5"}
        onClassChange={handleClassChange}
      />
    </Sidebar>
  );
}
