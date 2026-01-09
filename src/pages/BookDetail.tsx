import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  ShoppingCart,
  ArrowLeft,
  Star,
  Check,
  FileText,
  PenTool,
  Lightbulb,
  Brain,
  Target,
  Award,
  ChevronRight,
  Package,
  Truck,
  Shield,
  Sparkles,
  Play,
  Map,
  HelpCircle,
  Zap,
  Eye,
  BookMarked,
  GraduationCap,
  ListChecks,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getBookById, booksData, Chapter, SubTopic } from "@/lib/bookData";

export default function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  const book = getBookById(bookId || "") || booksData[0];

  const addToCart = () => {
    // Navigate to store with book in cart
    navigate(`/store?addToCart=${book.id}`);
  };

  const features = [
    { icon: FileText, text: "Detailed Theory Notes" },
    { icon: PenTool, text: `${book.worksheets} Practice Worksheets` },
    { icon: Target, text: "Learning Objectives" },
    { icon: Lightbulb, text: "Real-world Examples" },
    { icon: Brain, text: "Mind Maps" },
    { icon: Award, text: "Chapter Assessments" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate("/store")} className="hover:text-primary transition-colors">
            Book Store
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{book.title} - {book.class}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Book Preview */}
          <div className="relative">
            <div className={`aspect-[3/4] rounded-3xl bg-gradient-to-br ${book.color} p-8 flex flex-col items-center justify-center relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
              
              <div className="relative z-10 text-center text-white">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <BookOpen className="h-16 w-16" />
                </div>
                <Badge className="mb-4 bg-white/20 text-white border-0">{book.class}</Badge>
                <h2 className="text-3xl font-bold mb-2 font-display">{book.title}</h2>
                <p className="text-white/80">{book.subtitle}</p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: "Chapters", value: book.chapters.length || "12+" },
                { label: "Pages", value: book.totalPages },
                { label: "Worksheets", value: book.worksheets },
              ].map((stat, index) => (
                <Card key={index} className="text-center p-4">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Book Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                NEP 2020 Aligned
              </Badge>
              <Badge variant="outline">{book.edition}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-display">
              {book.title} - {book.class}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">{book.subtitle}</p>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {book.longDescription}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <Card className="p-6 mb-6 border-2 border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">₹{book.price}</span>
                    <span className="text-lg text-muted-foreground line-through">₹{book.originalPrice}</span>
                    <Badge className="bg-coral text-coral-foreground">
                      {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Inclusive of all taxes</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (234 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1 gap-2" onClick={addToCart}>
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => navigate("/store")}>
                  Buy Now
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
                {[
                  { icon: Truck, text: "Free Delivery" },
                  { icon: Shield, text: "7 Day Returns" },
                  { icon: Package, text: "COD Available" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Book Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "ISBN", value: book.isbn },
                { label: "Publisher", value: book.publisher },
                { label: "Language", value: book.language },
                { label: "Edition", value: book.edition },
              ].map((item, index) => (
                <div key={index}>
                  <p className="text-muted-foreground">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="container mx-auto px-4 py-12">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8 overflow-x-auto">
            {[
              { value: "overview", label: "Overview", icon: BookOpen },
              { value: "chapters", label: "Table of Contents", icon: ListChecks },
              { value: "mindmaps", label: "Mind Maps", icon: Map },
              { value: "funfacts", label: "Fun Facts", icon: Sparkles },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Learning Approach */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Learning Approach
                </h3>
                <div className="space-y-4">
                  {[
                    { title: "Theory First", desc: "Clear explanations with visual aids and examples" },
                    { title: "Practice Worksheets", desc: "Hands-on exercises after every concept" },
                    { title: "Real-World Connect", desc: "Applications in everyday life" },
                    { title: "Self Assessment", desc: "Chapter-end tests to track progress" },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Book Features */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-primary" />
                  What's Special
                </h3>
                <div className="flex flex-wrap gap-2">
                  {book.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="py-2 px-3">
                      <Check className="h-3 w-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Perfect For
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Students of {book.class} who want to build a strong foundation in AI and computational thinking. 
                    Ideal for both classroom learning and self-study.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chapters" className="mt-0">
            {book.chapters.length > 0 ? (
              <div className="space-y-4">
                {book.chapters.map((chapter) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed chapter contents will be available soon. The book covers all NEP 2020 aligned topics for {book.class}.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="mindmaps" className="mt-0">
            {book.chapters.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {book.chapters.map((chapter) => (
                  <MindMapCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Mind Maps Coming Soon</h3>
                <p className="text-muted-foreground">
                  Visual mind maps for each chapter will help you understand concepts at a glance.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="funfacts" className="mt-0">
            {book.chapters.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {book.chapters.flatMap(chapter => 
                  chapter.subTopics.flatMap(st => 
                    st.funFacts.map((fact, index) => (
                      <Card key={fact.id} className="p-4 hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-2 text-xs capitalize">
                              {fact.category}
                            </Badge>
                            <p className="text-sm">{fact.fact}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )
                )}
                {book.chapters.flatMap(chapter => 
                  chapter.subTopics.flatMap(st => 
                    st.didYouKnow.map((dyk) => (
                      <Card key={dyk.id} className="p-4 bg-coral/5 border-coral/20 hover:border-coral/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="h-5 w-5 text-coral" />
                          </div>
                          <div>
                            <Badge className="mb-2 text-xs bg-coral/20 text-coral border-0">
                              Did You Know?
                            </Badge>
                            <p className="text-sm">{dyk.content}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )
                )}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Fun Facts Coming Soon</h3>
                <p className="text-muted-foreground">
                  Discover amazing facts about AI, technology, and nature!
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}

// Chapter Card Component
function ChapterCard({ chapter }: { chapter: Chapter }) {
  return (
    <Card className="overflow-hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={chapter.id} className="border-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary-foreground">{chapter.number}</span>
              </div>
              <div>
                <h3 className="font-bold">{chapter.title}</h3>
                <p className="text-sm text-muted-foreground">{chapter.description}</p>
              </div>
              <Badge variant="outline" className="ml-auto mr-4">
                {chapter.pageCount} pages
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {/* Learning Objectives */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-primary" />
                Learning Objectives
              </h4>
              <ul className="space-y-2">
                {chapter.learningObjectives.map((obj, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sub Topics */}
            <div className="space-y-4">
              {chapter.subTopics.map((subTopic) => (
                <SubTopicCard key={subTopic.id} subTopic={subTopic} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

// SubTopic Card Component
function SubTopicCard({ subTopic }: { subTopic: SubTopic }) {
  return (
    <Card className="p-4 bg-muted/30">
      <h5 className="font-semibold mb-2">{subTopic.title}</h5>
      <p className="text-sm text-muted-foreground mb-4">{subTopic.description}</p>
      
      {/* Exercises */}
      <div className="flex flex-wrap gap-2">
        {subTopic.exercises.map((exercise) => (
          <Badge 
            key={exercise.id} 
            variant="outline"
            className={`text-xs ${
              exercise.difficulty === 'easy' ? 'border-green-500/50 text-green-600' :
              exercise.difficulty === 'medium' ? 'border-yellow-500/50 text-yellow-600' :
              'border-red-500/50 text-red-600'
            }`}
          >
            <PenTool className="h-3 w-3 mr-1" />
            {exercise.title}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

// Mind Map Card Component
function MindMapCard({ chapter }: { chapter: Chapter }) {
  return (
    <Card className="p-6">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">{chapter.number}</span>
        </div>
        {chapter.mindMap.title}
      </h3>
      <div className="space-y-3">
        {chapter.mindMap.children?.map((child) => (
          <div key={child.id} className="pl-4 border-l-2 border-primary/30">
            <p className="font-medium text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              {child.title}
            </p>
            {child.children && (
              <div className="pl-4 mt-2 space-y-1">
                {child.children.map((subChild) => (
                  <p key={subChild.id} className="text-xs text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    {subChild.title}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
