import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  GraduationCap, 
  Menu, 
  X, 
  BookOpen, 
  Building2, 
  ShoppingBag, 
  Phone,
  Code,
  ChevronRight
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import mascotKodi from "@/assets/mascot-kodi.png";
import { useStudentAuth } from "@/hooks/useStudentAuth";

const navLinks = [
  { href: "/", label: "Home", icon: null },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/schools", label: "For Schools", icon: Building2 },
  { href: "/store", label: "E-Store", icon: ShoppingBag },
  { href: "/compiler", label: "Compiler", icon: Code },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { student } = useStudentAuth();

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (path && path !== "/") {
        navigate(path);
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <img 
              src={brainLogo} 
              alt="KodeIntel" 
              className="h-12 md:h-14 transition-transform group-hover:scale-110" 
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center animate-bounce-soft">
              <span className="text-xs">✨</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-xl md:text-2xl font-bold text-foreground leading-tight">
              Kode<span className="text-primary">Intel</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium -mt-1">
              Building Thinking Minds
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                ${isActive(link.href) 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }
              `}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate(student ? "/student" : "/student/login")}
            className="gap-2 rounded-full px-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 hidden sm:flex"
            size="lg"
          >
            <GraduationCap className="h-5 w-5" />
            {student ? "Dashboard" : "Login"}
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <img src={mascotKodi} alt="Kodi" className="h-12 w-12" />
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground">
                        Hey there! 👋
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Ready to explore?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex-1 p-6 space-y-2">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className={`
                        w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all
                        ${isActive(link.href)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted text-foreground"
                        }
                      `}
                    >
                      {link.icon && <link.icon className="h-5 w-5" />}
                      <span className="font-semibold">{link.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="p-6 border-t border-border">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(student ? "/student" : "/student/login");
                    }}
                    className="w-full gap-2 rounded-full h-14 text-lg"
                    size="lg"
                  >
                    <GraduationCap className="h-5 w-5" />
                    {student ? "Go to Dashboard" : "Login / Sign Up"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
