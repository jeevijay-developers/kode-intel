import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  Send,
  ExternalLink,
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";
import mascotKodi from "@/assets/mascot-kodi.png";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "For Schools", href: "/schools" },
  { label: "E-Store", href: "/store" },
  { label: "Compiler", href: "/compiler" },
  { label: "Contact Us", href: "/contact" },
];

const resourceLinks = [
  { label: "About NEP 2020", href: "/about" },
  { label: "Student Login", href: "/student/login" },
  { label: "Admin Login", href: "/auth" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Newsletter Section */}
      <div className="relative border-b border-background/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex items-center gap-4">
              <img 
                src={mascotKodi} 
                alt="Kodi Mascot" 
                className="h-20 w-20 animate-bounce-soft" 
              />
              <div>
                <h3 className="font-display text-2xl font-bold">
                  Stay Updated! 📬
                </h3>
                <p className="text-background/70">
                  Get the latest courses and tips delivered to your inbox.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full lg:max-w-md">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  className="h-12 rounded-full bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:bg-background/20"
                />
                <Button 
                  className="h-12 px-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                >
                  <Send className="h-4 w-4" />
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={brainLogo} alt="KodeIntel" className="h-12" />
              <div>
                <h2 className="font-display text-xl font-bold">
                  Kode<span className="text-primary">Intel</span>
                </h2>
                <p className="text-xs text-background/60">AI & Computational Thinking</p>
              </div>
            </div>
            <p className="text-background/70 mb-6 leading-relaxed">
              India's leading AI & Computational Thinking platform for young learners. 
              NEP 2020 aligned curriculum for Classes 3-10.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-secondary rounded-full" />
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-background/70 hover:text-secondary transition-colors flex items-center gap-2 group"
                  >
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-accent rounded-full" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-background/60">Email</p>
                  <a href="mailto:hello@kodeintel.com" className="text-background hover:text-primary transition-colors">
                    hello@kodeintel.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-background/60">Phone</p>
                  <a href="tel:+919876543210" className="text-background hover:text-secondary transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-background/60">Address</p>
                  <p className="text-background">
                    New Delhi, India
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p className="flex items-center gap-1">
              © 2025 KodeIntel. Made with 
              <Heart className="h-4 w-4 text-coral fill-coral animate-pulse" /> 
              in India 🇮🇳
            </p>
            <p>
              Empowering the next generation of innovators
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
