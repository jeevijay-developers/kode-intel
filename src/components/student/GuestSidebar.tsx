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
  Clock,
  ChevronRight,
  Rocket,
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const menuItems = [
  { title: "Dashboard", url: "/guest", icon: Home },
  { title: "All Courses", url: "/guest/courses", icon: BookOpen },
  { title: "Code Lab", url: "/compiler", icon: Code },
];

export function GuestSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const stored = localStorage.getItem("guestInfo");
      if (stored) {
        const parsed = JSON.parse(stored);
        const registeredAt = new Date(parsed.registeredAt);
        const now = new Date();
        const hoursDiff = 24 - (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff <= 0) {
          setTimeRemaining("Expired");
        } else {
          setTimeRemaining(`${Math.floor(hoursDiff)}h ${Math.floor((hoursDiff % 1) * 60)}m`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-56"} transition-all duration-300 border-r border-border/50`}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-to-b from-card to-muted/30">
        {/* Logo Section */}
        <div className="p-3 border-b border-border/30">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative transition-transform duration-300 group-hover:scale-110">
              <img src={brainLogo} alt="Logo" className="h-8 w-8" />
              <Sparkles className="h-2.5 w-2.5 text-sunny absolute -top-1 -right-1 animate-pulse" />
            </div>
            {!collapsed && (
              <span className="text-base font-bold font-display">
                Kode<span className="text-primary">Intel</span>
              </span>
            )}
          </div>
        </div>

        {/* Trial Timer */}
        {!collapsed && timeRemaining && (
          <div className="p-3 border-b border-border/30">
            <div className="bg-gradient-to-br from-primary/10 to-turquoise/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Trial Time</span>
              </div>
              <p className="text-lg font-bold text-primary">{timeRemaining}</p>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1 py-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
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
                        className={`group/item flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        activeClassName="bg-primary text-primary-foreground"
                      >
                        <IconComponent
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isActive ? "scale-110" : "group-hover/item:scale-110"
                          }`}
                        />
                        {!collapsed && (
                          <>
                            <span className="font-medium flex-1 text-sm">{item.title}</span>
                            <ChevronRight
                              className={`h-3.5 w-3.5 transition-all duration-300 ${
                                isActive
                                  ? "opacity-100"
                                  : "opacity-0 group-hover/item:opacity-100"
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
          <div className="p-3 border-t border-border/30">
            <Button
              onClick={() => navigate("/student/signup")}
              className="w-full gap-2 bg-gradient-to-r from-primary to-secondary text-sm h-10"
            >
              <Rocket className="h-4 w-4" />
              Sign Up Free
            </Button>
          </div>
        )}

        {/* Trigger at bottom */}
        <div className="p-2 border-t border-border/30">
          <SidebarTrigger className="w-full justify-center" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
