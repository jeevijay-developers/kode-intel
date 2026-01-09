import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  Trophy,
  User,
  Star,
  Flame,
  Sparkles,
  GraduationCap,
  Rocket,
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";

interface StudentSidebarProps {
  studentName: string;
  currentLevel: number;
  totalPoints: number;
  streakDays: number;
}

const menuItems = [
  { title: "Dashboard", url: "/student", icon: Home, emoji: "🏠" },
  { title: "My Courses", url: "/student/my-courses", icon: BookOpen, emoji: "📚" },
  { title: "Code Lab", url: "/compiler", icon: Code, emoji: "💻" },
  { title: "Achievements", url: "/student/achievements", icon: Trophy, emoji: "🏆" },
  { title: "Profile", url: "/student/profile", icon: User, emoji: "👤" },
];

export function StudentSidebar({
  studentName,
  currentLevel,
  totalPoints,
  streakDays,
}: StudentSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 border-r border-border/50`}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-to-b from-card via-card to-primary/5">
        {/* Logo Section */}
        <div className="p-4 border-b border-border/50">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <img src={brainLogo} alt="Logo" className="h-10 w-10" />
              <Sparkles className="h-3 w-3 text-sunny absolute -top-1 -right-1 animate-pulse" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold font-display">
                Kode<span className="text-primary">Intel</span>
              </span>
            )}
          </div>
        </div>

        {/* Student Stats Card */}
        {!collapsed && (
          <div className="p-4 border-b border-border/50">
            <div className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground truncate max-w-[120px]">
                    {studentName.split(" ")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">Level {currentLevel}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-sunny/20 rounded-xl p-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-sunny fill-sunny" />
                    <span className="text-sm font-bold text-sunny">{totalPoints}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">XP</p>
                </div>
                <div className="bg-coral/20 rounded-xl p-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="h-4 w-4 text-coral" />
                    <span className="text-sm font-bold text-coral">{streakDays}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Streak</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs text-muted-foreground px-4 py-2">
            {!collapsed ? "Menu" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-primary/20 text-primary shadow-sm"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                        activeClassName="bg-primary/20 text-primary"
                      >
                        <span className="text-lg">{item.emoji}</span>
                        {!collapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                        {isActive && !collapsed && (
                          <Rocket className="h-4 w-4 ml-auto text-primary animate-bounce" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Trigger at bottom */}
        <div className="p-4 border-t border-border/50">
          <SidebarTrigger className="w-full justify-center" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
