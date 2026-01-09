import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  BookOpen,
  Check,
  Minus,
  Plus,
  Truck,
  Shield,
  CreditCard,
  ArrowRight,
  Star,
  Package,
  Tag,
  IndianRupee,
} from "lucide-react";
import booksStack from "@/assets/books-stack.png";
import mascotKodi from "@/assets/mascot-kodi.png";

interface CartItem {
  id: string;
  title: string;
  class: string;
  price: number;
  quantity: number;
}

const books = [
  { id: "book-3", class: "Class 3", title: "AI Foundations - Class 3", description: "Introduction to logical thinking and basic AI concepts", price: 999, originalPrice: 1299 },
  { id: "book-4", class: "Class 4", title: "AI Foundations - Class 4", description: "Building blocks of computational thinking", price: 999, originalPrice: 1299 },
  { id: "book-5", class: "Class 5", title: "AI Explorer - Class 5", description: "Pattern recognition and algorithm basics", price: 999, originalPrice: 1299 },
  { id: "book-6", class: "Class 6", title: "AI Explorer - Class 6", description: "Advanced patterns and logical operators", price: 999, originalPrice: 1299 },
  { id: "book-7", class: "Class 7", title: "AI Builder - Class 7", description: "Data structures and introductory programming", price: 1099, originalPrice: 1399 },
  { id: "book-8", class: "Class 8", title: "AI Builder - Class 8", description: "Machine learning fundamentals", price: 1099, originalPrice: 1399 },
  { id: "book-9", class: "Class 9", title: "AI Innovator - Class 9", description: "Real-world AI applications", price: 1199, originalPrice: 1499 },
  { id: "book-10", class: "Class 10", title: "AI Innovator - Class 10", description: "Building AI projects", price: 1199, originalPrice: 1499 },
];

export default function EStore() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (book: typeof books[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item => 
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: book.id, title: book.title, class: book.class, price: book.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 gradient-mesh relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-6">
                <Package className="h-4 w-4 text-primary" />
                <span>Physical Workbooks</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display">
                Premium <span className="text-gradient-primary">AI Workbooks</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Get our comprehensive workbooks with theory, worksheets, and practice exercises. 
                Perfect for offline learning and classroom use.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: Truck, text: "Free Delivery" },
                  { icon: Shield, text: "Quality Guaranteed" },
                  { icon: CreditCard, text: "COD Available" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
              <img 
                src={booksStack} 
                alt="Books Stack" 
                className="relative z-10 w-full max-w-md mx-auto animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setShowCart(!showCart)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full gradient-primary shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ShoppingCart className="h-6 w-6 text-primary-foreground" />
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-coral text-coral-foreground text-xs font-bold flex items-center justify-center">
            {totalItems}
          </span>
        </button>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-md bg-background shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold font-display flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Your Cart ({totalItems})
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                <Minus className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <img src={mascotKodi} alt="Kodi" className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">₹{item.price * item.quantity}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-muted/80"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-muted/80"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice}</span>
                </div>
                <Button className="w-full rounded-full py-6 text-lg gap-2">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Books Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Choose Your <span className="text-gradient-primary">Workbook</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each workbook contains comprehensive theory, practice worksheets, and chapter summaries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <Card 
                key={book.id}
                className="card-playful overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="h-32 gradient-primary relative flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-primary-foreground/80 group-hover:scale-110 transition-transform" />
                  <Badge className="absolute top-3 right-3 bg-coral text-coral-foreground">
                    <Tag className="h-3 w-3 mr-1" />
                    {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-primary mb-1">{book.class}</p>
                  <h3 className="font-bold text-foreground mb-2 font-display">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{book.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-foreground font-display flex items-center">
                      <IndianRupee className="h-5 w-5" />{book.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">₹{book.originalPrice}</span>
                  </div>

                  <Button 
                    className="w-full rounded-full gap-2"
                    onClick={() => addToCart(book)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Free Delivery", description: "Free shipping across India on all orders" },
              { icon: Shield, title: "Quality Print", description: "Premium paper and vibrant full-color printing" },
              { icon: CreditCard, title: "Easy Payment", description: "COD, UPI, Cards, and Net Banking accepted" },
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 glass rounded-3xl">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-display">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-display">
            Want the Complete Learning Experience?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Get our Full Pack with video lectures, compiler access, quizzes, and physical workbook included!
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/student/login")}
            className="gap-2 rounded-full px-8 bg-background text-foreground hover:bg-background/90"
          >
            Get Full Pack - ₹3,499/year
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
