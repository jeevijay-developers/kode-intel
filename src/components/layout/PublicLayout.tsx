import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, Menu } from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import { useStudentAuth } from "@/hooks/useStudentAuth";

export default function PublicLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { student } = useStudentAuth();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/#features", label: "Features" },
    { href: "/compiler", label: "Compiler" },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={brainLogo} alt="Kode Intel" className="h-10 md:h-12" />
            <span className="font-bold text-lg md:text-xl text-foreground">
              Kode Intel
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(student ? "/student" : "/student/login")}
              className="gap-2 rounded-full px-6 hidden sm:flex"
            >
              <GraduationCap className="h-4 w-4" />
              {student ? "Dashboard" : "Login"}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors text-left py-2"
                    >
                      {link.label}
                    </button>
                  ))}
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(student ? "/student" : "/student/login");
                    }}
                    className="gap-2 rounded-full mt-4"
                  >
                    <GraduationCap className="h-4 w-4" />
                    {student ? "Dashboard" : "Login"}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}
