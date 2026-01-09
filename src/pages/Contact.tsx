import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  Building2,
  User,
  ArrowRight,
} from "lucide-react";
import mascotKodi from "@/assets/mascot-kodi.png";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@kodeintel.com", href: "mailto:hello@kodeintel.com" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "Address", value: "New Delhi, India", href: "#" },
  { icon: Clock, label: "Response Time", value: "Within 24 hours", href: "#" },
];

const faqs = [
  { q: "How can I get a demo?", a: "Fill out the contact form and select 'Request Demo' as inquiry type." },
  { q: "Do you offer custom pricing?", a: "Yes, for schools with 200+ students we offer custom enterprise pricing." },
  { q: "Is there a free trial?", a: "Yes, we offer a 7-day free trial for individual students." },
];

export default function Contact() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", phone: "", type: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="container mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-6 border border-primary/20 animate-fade-in">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display animate-fade-in leading-tight" style={{ animationDelay: "100ms" }}>
            We'd Love to <span className="text-gradient-primary">Hear From You</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "200ms" }}>
            Have questions about our courses, school partnerships, or anything else? 
            Our team is ready to help!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <Card className="overflow-hidden border-0 shadow-xl animate-fade-in">
              <div className="gradient-primary p-6">
                <h2 className="text-2xl font-bold text-primary-foreground font-display flex items-center gap-3">
                  <Send className="h-6 w-6" />
                  Send us a Message
                </h2>
              </div>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        Inquiry Type
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual Student</SelectItem>
                          <SelectItem value="parent">Parent Inquiry</SelectItem>
                          <SelectItem value="school">School Partnership</SelectItem>
                          <SelectItem value="demo">Request Demo</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="rounded-xl min-h-[120px]"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full rounded-full py-6 text-lg gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Mascot Card */}
              <Card className="card-playful overflow-hidden">
                <CardContent className="p-8 flex items-center gap-6">
                  <img src={mascotKodi} alt="Kodi" className="w-24 h-24 animate-bounce-soft" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-display">
                      Hi, I'm Kodi!
                    </h3>
                    <p className="text-muted-foreground">
                      I'm here to help you with any questions. Our team typically responds within 24 hours!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Cards */}
              <div className="grid grid-cols-2 gap-4">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.href}
                    className="p-6 glass rounded-2xl hover:shadow-md transition-shadow group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                    <p className="font-semibold text-foreground">{info.value}</p>
                  </a>
                ))}
              </div>

              {/* Quick FAQ */}
              <Card className="card-playful">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 font-display">Quick Answers</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-turquoise shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{faq.q}</p>
                          <p className="text-sm text-muted-foreground">{faq.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp CTA */}
              <Button
                size="lg"
                className="w-full rounded-full py-6 text-lg gap-2 bg-[#25D366] hover:bg-[#25D366]/90"
                onClick={() => window.open("https://wa.me/919876543210", "_blank")}
              >
                <MessageSquare className="h-5 w-5" />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2 font-display">Visit Our Office</h3>
            <p className="text-muted-foreground mb-4">New Delhi, India</p>
            <p className="text-sm text-muted-foreground">
              By appointment only. Please contact us to schedule a visit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
