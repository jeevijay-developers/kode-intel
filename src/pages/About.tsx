import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  Target,
  Heart,
  Lightbulb,
  Award,
  Menu,
  ArrowLeft,
  Linkedin,
  Mail,
  Send,
  Phone,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import kodeIntelLogo from "@/assets/kode-intel-logo.png";
import brainIllustration from "@/assets/brain-illustration.png";

export default function About() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    studentCount: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, studentCount: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Inquiry Submitted! 🎉",
      description: "Thank you for your interest. Our team will contact you within 24-48 hours.",
    });
    
    setFormData({
      schoolName: "",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      studentCount: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
  ];

  const stats = [
    { icon: Users, value: "1,000+", label: "Students Enrolled" },
    { icon: BookOpen, value: "50+", label: "Courses Created" },
    { icon: Building2, value: "25+", label: "Partner Schools" },
    { icon: Award, value: "95%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We believe in teaching the skills of tomorrow, today. Our curriculum evolves with the latest in AI and technology.",
    },
    {
      icon: Heart,
      title: "Student-Centered",
      description: "Every course is designed with young learners in mind, making complex concepts fun and accessible.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest quality in our content, ensuring students receive world-class education.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We build a community of learners, teachers, and schools working together towards a smarter future.",
    },
  ];

  const team = [
    {
      name: "Dr. Priya Sharma",
      role: "Founder & CEO",
      bio: "Former AI researcher at IIT Delhi with 15+ years in education technology.",
      avatar: "👩‍💼",
    },
    {
      name: "Rajesh Kumar",
      role: "Head of Curriculum",
      bio: "Educator and curriculum designer with experience in top CBSE schools.",
      avatar: "👨‍🏫",
    },
    {
      name: "Ananya Gupta",
      role: "Lead Content Creator",
      bio: "Creative technologist passionate about making learning fun for kids.",
      avatar: "👩‍💻",
    },
    {
      name: "Vikram Singh",
      role: "Technology Director",
      bio: "Full-stack developer building scalable ed-tech solutions.",
      avatar: "👨‍💻",
    },
  ];

  const milestones = [
    { year: "2020", event: "Kode Intel founded with a vision to democratize AI education" },
    { year: "2021", event: "Launched first pilot program in 5 schools across Delhi NCR" },
    { year: "2022", event: "Expanded to 15 schools and introduced computational thinking curriculum" },
    { year: "2023", event: "Reached 500+ students and launched online learning platform" },
    { year: "2024", event: "Partnered with 25+ schools and serving 1000+ students nationwide" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={kodeIntelLogo} alt="Kode Intel" className="h-8 md:h-10" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`text-muted-foreground hover:text-foreground transition-colors ${link.href === '/about' ? 'text-foreground font-medium' : ''}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate("/student/login")}
              className="gap-2 rounded-full px-6 hidden sm:flex"
            >
              <GraduationCap className="h-4 w-4" />
              Student Login
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
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate(link.href);
                      }}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors text-left py-2"
                    >
                      {link.label}
                    </button>
                  ))}
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/student/login");
                    }}
                    className="gap-2 rounded-full mt-4"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Student Login
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2 mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Empowering Young Minds with AI Education 🌟
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Kode Intel is on a mission to prepare the next generation for an AI-powered future. 
                We make Artificial Intelligence and Computational Thinking accessible, engaging, 
                and fun for students from Class 3 to Class 10.
              </p>
              <p className="text-muted-foreground">
                Founded by educators and technologists, we believe that every child deserves 
                the opportunity to understand and shape the technology that will define their future.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-amber-500/20 rounded-full blur-3xl scale-110" />
                <img 
                  src={brainIllustration} 
                  alt="AI Brain" 
                  className="relative z-10 w-64 lg:w-80 h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Kode Intel
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a small idea to impacting thousands of students
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`relative flex items-start gap-6 mb-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`hidden md:block flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <Card className="inline-block">
                      <CardContent className="py-4 px-6">
                        <p className="font-semibold text-primary">{milestone.year}</p>
                        <p className="text-sm text-muted-foreground">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full border-4 border-background md:-translate-x-1/2 mt-2" />
                  <div className="flex-1 md:hidden pl-10">
                    <Card>
                      <CardContent className="py-4 px-6">
                        <p className="font-semibold text-primary">{milestone.year}</p>
                        <p className="text-sm text-muted-foreground">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Passionate educators and technologists working to transform education
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-4xl">
                    {member.avatar}
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Partner With Us 🤝</h2>
              <p className="text-muted-foreground mb-8">
                Interested in bringing AI education to your school? Fill out the form below and our 
                team will get in touch to discuss partnership opportunities.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name *</Label>
                    <Input
                      id="schoolName"
                      name="schoolName"
                      placeholder="Enter school name"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      placeholder="Your name"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@school.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentCount">Estimated Number of Students</Label>
                  <Select value={formData.studentCount} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-100">Less than 100</SelectItem>
                      <SelectItem value="100-500">100 - 500</SelectItem>
                      <SelectItem value="500-1000">500 - 1,000</SelectItem>
                      <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                      <SelectItem value="more-than-5000">More than 5,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your school and what you're looking for..."
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full gap-2 rounded-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Inquiry
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:pl-8">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">partnerships@kodeintel.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Phone</p>
                        <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Office</p>
                        <p className="text-sm text-muted-foreground">
                          123 Tech Park, Sector 62<br />
                          Noida, Uttar Pradesh 201309
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Why Partner With Kode Intel?</h3>
                  <ul className="space-y-2 text-sm text-primary-foreground/80">
                    <li className="flex items-start gap-2">
                      <span className="text-lg">✓</span>
                      Comprehensive AI curriculum for Classes 3-10
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lg">✓</span>
                      Trained facilitators and teaching support
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lg">✓</span>
                      Interactive learning platform with progress tracking
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lg">✓</span>
                      Regular assessments and certifications
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lg">✓</span>
                      Flexible implementation options
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Kode Intel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
