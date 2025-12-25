import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  Play,
  FileText,
  HelpCircle,
  ChevronRight,
  Users,
  Building2,
  Award,
  Brain,
  Sparkles,
  CheckCircle2,
  Star,
  Rocket,
  Lightbulb,
  Code,
  Cpu,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import brainLogo from "@/assets/brain-logo.png";
import heroKidsCoding from "@/assets/hero-section-img.png";
import man1 from "@/assets/testimonial/man1.png";
import woman2 from "@/assets/testimonial/woman2.png";
import man3 from "@/assets/testimonial/man3.png";
import woman4 from "@/assets/testimonial/woman4.png";
import { useStudentAuth } from "@/hooks/useStudentAuth";

export default function Landing() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();

  const steps = [
    {
      step: "01",
      icon: GraduationCap,
      title: "Login with School Credentials",
      description: "Use the username and password provided by your teacher",
    },
    {
      step: "02",
      icon: BookOpen,
      title: "Access Your Courses",
      description: "Find courses assigned to your class level",
    },
    {
      step: "03",
      icon: Play,
      title: "Watch & Learn",
      description: "Enjoy fun video lessons and interactive content",
    },
    {
      step: "04",
      icon: Award,
      title: "Earn Achievements",
      description: "Complete quizzes and collect badges",
    },
  ];

  const features = [
    {
      icon: Play,
      title: "Video Lessons",
      description: "Watch fun video lectures made for young learners",
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: FileText,
      title: "Digital Books",
      description: "Read colorful ebooks and study materials",
      color: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      icon: HelpCircle,
      title: "Fun Quizzes",
      description: "Test your skills with exciting quizzes and games",
      color: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      icon: Award,
      title: "Earn Badges",
      description: "Collect badges as you complete your learning journey",
      color: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
  ];

  const courseLevels = [
    {
      grades: "Classes 3-4",
      title: "Foundation Level",
      description: "Introduction to logical thinking and basic problem solving",
      icon: Lightbulb,
      bgColor: "bg-gradient-to-br from-primary/20 to-primary/5",
    },
    {
      grades: "Classes 5-6",
      title: "Explorer Level",
      description: "Dive deeper into algorithms and pattern recognition",
      icon: Rocket,
      bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-500/5",
    },
    {
      grades: "Classes 7-8",
      title: "Builder Level",
      description: "Create projects using computational thinking concepts",
      icon: Code,
      bgColor: "bg-gradient-to-br from-purple-500/20 to-purple-500/5",
    },
    {
      grades: "Classes 9-10",
      title: "Innovator Level",
      description: "Advanced AI concepts and real-world applications",
      icon: Cpu,
      bgColor: "bg-gradient-to-br from-amber-500/20 to-amber-500/5",
    },
  ];

  const stats = [
    { icon: Users, value: "1000+", label: "Happy Students" },
    { icon: BookOpen, value: "50+", label: "Courses" },
    { icon: Building2, value: "25+", label: "Schools" },
    { icon: Brain, value: "100%", label: "Fun Learning" },
  ];

  const testimonials = [
    {
      name: "Mrs. Sharma",
      grade: "Parent of Class 7 Student",
      text: "My son is so excited about AI now! The videos are engaging and he's learning concepts I never imagined at his age.",
      avatarImg: woman2,
    },
    {
      name: "Mr. Patel",
      grade: "Parent of Class 5 Student",
      text: "My daughter looks forward to the quizzes every day. She's developing critical thinking skills while having fun!",
      avatarImg: man1,
    },
    {
      name: "Mrs. Kumar",
      grade: "Parent of Class 9 Student",
      text: "The computational thinking curriculum has improved my son's problem-solving abilities across all subjects. Highly recommended!",
      avatarImg: woman4,
    },
  ];

  const faqs = [
    {
      question: "How do I get my login credentials?",
      answer:
        "Your school teacher or administrator will provide you with a username and password. If you haven't received them, please contact your school.",
    },
    {
      question: "What classes is this curriculum designed for?",
      answer:
        "Our AI & Computational Thinking curriculum is designed for students from Class 3 to Class 10, with age-appropriate content for each level.",
    },
    {
      question: "Can I access the courses on my mobile phone?",
      answer:
        "Yes! Our platform is mobile-friendly. You can learn from any device - phone, tablet, or computer.",
    },
    {
      question: "What if I forget my password?",
      answer:
        "You can change your password from your profile settings. If you can't login, contact your teacher for a password reset.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 overflow-hidden relative min-h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
          {/* Decorative dots pattern */}
          <svg
            className="absolute top-32 right-20 w-32 h-32 text-primary/10"
            viewBox="0 0 100 100"
          >
            {[...Array(5)].map((_, row) =>
              [...Array(5)].map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={10 + col * 20}
                  cy={10 + row * 20}
                  r="3"
                  fill="currentColor"
                />
              ))
            )}
          </svg>
          <svg
            className="absolute bottom-40 left-20 w-24 h-24 text-blue-500/10"
            viewBox="0 0 100 100"
          >
            {[...Array(4)].map((_, row) =>
              [...Array(4)].map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={12.5 + col * 25}
                  cy={12.5 + row * 25}
                  r="4"
                  fill="currentColor"
                />
              ))
            )}
          </svg>
        </div>

        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                For Classes 3rd - 10th
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Learn <span className="text-primary">AI</span> & Computational
                Thinking 🚀
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Fun and exciting courses designed for young minds. Watch videos,
                read books, take quizzes, and become an AI champion!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => navigate("/student/login")}
                  className="gap-2 rounded-full px-8"
                >
                  Start Learning
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="gap-2 rounded-full px-8"
                >
                  Explore Features
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[man1, woman2, man3, woman4].map((avatar, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background overflow-hidden"
                    >
                      <img
                        src={avatar}
                        alt={`Student avatar ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    1000+ Students Learning
                  </p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:flex justify-center items-center">
              {/* Hero image of kids coding */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-amber-500/20 rounded-3xl blur-3xl scale-105" />
                <img
                  src={heroKidsCoding}
                  alt="Kids learning to code"
                  className="relative z-10 w-full max-w-2xl h-auto rounded-2xl shadow-2xl"
                />
                {/* Floating cards around the illustration */}
                <div className="absolute -top-4 -right-8 bg-card rounded-2xl shadow-lg p-4 border border-border animate-fade-in z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Quiz Completed!</p>
                      <p className="text-xs text-muted-foreground">
                        Score: 95%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-8 bg-card rounded-2xl shadow-lg p-4 border border-border animate-fade-in z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Award className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">New Badge!</p>
                      <p className="text-xs text-muted-foreground">
                        AI Explorer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-[#0284C5]">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-black/60 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 ">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              A Simple and Smart Way to Learn
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in just a few easy steps and begin your AI learning
              journey today!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="relative overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-transparent hover:border-primary/20"
              >
                <CardContent className="pt-6">
                  <span className="absolute top-4 right-4 text-5xl font-bold text-muted/50">
                    {step.step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Course Levels Section */}
      <section id="courses" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4" />
              Course Levels
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Courses for Every Level
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Age-appropriate curriculum designed to grow with your learning
              journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseLevels.map((level, index) => (
              <Card
                key={index}
                className={`${level.bgColor} border-0 hover:shadow-lg transition-all hover:-translate-y-1`}
              >
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-background/80 flex items-center justify-center mb-4 shadow-sm">
                    <level.icon className="h-7 w-7 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {level.grades}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {level.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {level.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Learn 🎁
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All the tools and resources to become an AI and technology
              superstar!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-transparent hover:border-primary/20"
              >
                <CardContent className="pt-6 text-center">
                  <div
                    className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4 mx-auto`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Parents Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                      <img
                        src={testimonial.avatarImg}
                        alt={`${testimonial.name} avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.grade}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {student
                ? "Continue Your Learning Journey! 🚀"
                : "Ready to Begin Your Journey? 🌟"}
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
              {student
                ? "Jump back into your courses and keep building your AI skills!"
                : "Your teacher has given you a username and password. Use them to login and start your adventure!"}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/student/login")}
              className="rounded-full px-8 gap-2"
            >
              <GraduationCap className="h-5 w-5" />
              {student ? "Go to Dashboard" : "Login Now"}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-foreground text-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src={brainLogo} alt="Kode Intel" className="h-10" />
                <span className="text-2xl font-bold text-foreground hidden sm:block">
                  Kode Intel
                </span>
              </div>
              <p className="text-background/70 max-w-sm">
                Empowering young minds with AI and Computational Thinking skills
                for the future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-background/70">
                <li>
                  <a
                    href="#features"
                    className="hover:text-background transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#courses"
                    className="hover:text-background transition-colors"
                  >
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="hover:text-background transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-background/70">
                <li>
                  <a
                    href="#"
                    className="hover:text-background transition-colors"
                  >
                    Contact School
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-background transition-colors"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/70 text-sm">
              © {new Date().getFullYear()} Kode Intel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
