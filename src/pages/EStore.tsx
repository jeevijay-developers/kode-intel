import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  X,
  Brain,
  Lightbulb,
  Target,
  PenTool,
  Sparkles,
  GraduationCap,
  FileText,
  CheckCircle,
  MapPin,
  Phone,
  User,
  Mail,
  Home,
  ChevronRight,
  Zap,
  Award,
  BookMarked,
  Layers,
} from "lucide-react";
import estoreHeroBanner from "@/assets/estore-hero-banner.png";
import mascotKodi from "@/assets/mascot-kodi.png";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface CartItem {
  id: string;
  title: string;
  class: string;
  price: number;
  quantity: number;
}

interface AddressForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const books = [
  { 
    id: "book-3", 
    class: "Class 3", 
    title: "AI Foundations", 
    subtitle: "Worksheet + Theory",
    description: "Introduction to logical thinking and basic AI concepts with hands-on activities", 
    price: 999, 
    originalPrice: 1299,
    chapters: 12,
    worksheets: 24,
    color: "from-emerald-500 to-teal-600"
  },
  { 
    id: "book-4", 
    class: "Class 4", 
    title: "AI Foundations", 
    subtitle: "Worksheet + Theory",
    description: "Building blocks of computational thinking with interactive exercises", 
    price: 999, 
    originalPrice: 1299,
    chapters: 14,
    worksheets: 28,
    color: "from-blue-500 to-cyan-600"
  },
  { 
    id: "book-5", 
    class: "Class 5", 
    title: "AI Explorer", 
    subtitle: "Worksheet + Theory",
    description: "Pattern recognition and algorithm basics with real-world examples", 
    price: 999, 
    originalPrice: 1299,
    chapters: 15,
    worksheets: 30,
    color: "from-violet-500 to-purple-600"
  },
  { 
    id: "book-6", 
    class: "Class 6", 
    title: "AI Explorer", 
    subtitle: "Worksheet + Theory",
    description: "Advanced patterns and logical operators with practice problems", 
    price: 999, 
    originalPrice: 1299,
    chapters: 16,
    worksheets: 32,
    color: "from-pink-500 to-rose-600"
  },
  { 
    id: "book-7", 
    class: "Class 7", 
    title: "AI Builder", 
    subtitle: "Worksheet + Theory",
    description: "Data structures and introductory programming with projects", 
    price: 1099, 
    originalPrice: 1399,
    chapters: 18,
    worksheets: 36,
    color: "from-orange-500 to-amber-600"
  },
  { 
    id: "book-8", 
    class: "Class 8", 
    title: "AI Builder", 
    subtitle: "Worksheet + Theory",
    description: "Machine learning fundamentals with hands-on experiments", 
    price: 1099, 
    originalPrice: 1399,
    chapters: 18,
    worksheets: 36,
    color: "from-red-500 to-orange-600"
  },
  { 
    id: "book-9", 
    class: "Class 9", 
    title: "AI Innovator", 
    subtitle: "Worksheet + Theory",
    description: "Real-world AI applications with case studies and projects", 
    price: 1199, 
    originalPrice: 1499,
    chapters: 20,
    worksheets: 40,
    color: "from-indigo-500 to-blue-600"
  },
  { 
    id: "book-10", 
    class: "Class 10", 
    title: "AI Innovator", 
    subtitle: "Worksheet + Theory",
    description: "Building AI projects with comprehensive theory and practice", 
    price: 1199, 
    originalPrice: 1499,
    chapters: 22,
    worksheets: 44,
    color: "from-cyan-500 to-teal-600"
  },
];

const benefits = [
  {
    icon: BookMarked,
    title: "Comprehensive Theory",
    description: "In-depth explanations of AI concepts aligned with NEP 2020 curriculum"
  },
  {
    icon: PenTool,
    title: "Practice Worksheets",
    description: "Hands-on exercises and activities for every chapter"
  },
  {
    icon: Brain,
    title: "AI & ML Concepts",
    description: "Age-appropriate introduction to Artificial Intelligence and Machine Learning"
  },
  {
    icon: Lightbulb,
    title: "Critical Thinking",
    description: "Problems designed to develop logical reasoning and problem-solving skills"
  },
  {
    icon: Target,
    title: "Learning Objectives",
    description: "Clear goals and outcomes for each chapter"
  },
  {
    icon: Award,
    title: "Chapter Assessments",
    description: "Self-evaluation tests after every chapter"
  },
];

const whatsIncluded = [
  { icon: FileText, text: "Detailed Theory Notes" },
  { icon: PenTool, text: "Practice Worksheets" },
  { icon: CheckCircle, text: "Chapter Summaries" },
  { icon: Target, text: "Learning Objectives" },
  { icon: Lightbulb, text: "Real-world Examples" },
  { icon: Award, text: "Chapter Assessments" },
];

export default function EStore() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment'>('cart');
  const [address, setAddress] = useState<AddressForm>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const addToCart = (book: typeof books[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item => 
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: book.id, title: `${book.title} - ${book.class}`, class: book.class, price: book.price, quantity: 1 }];
    });
    setShowCart(true);
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
  const deliveryCharge = totalPrice >= 1500 ? 0 : 99;
  const finalTotal = totalPrice + deliveryCharge;

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const isAddressValid = () => {
    return address.fullName && address.phone && address.address && address.city && address.state && address.pincode;
  };

  const handlePlaceOrder = () => {
    alert('Order placed successfully! You will receive a confirmation shortly.');
    setCart([]);
    setShowCart(false);
    setCheckoutStep('cart');
    setAddress({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
  };

  const closeCart = () => {
    setShowCart(false);
    setCheckoutStep('cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with AI Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={estoreHeroBanner} 
            alt="AI Learning Workbooks" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        </div>
        
        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>NEP 2020 Aligned Curriculum</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display animate-slide-up">
              AI Learning <span className="text-gradient-primary">Workbooks</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Comprehensive workbooks with <strong>Theory + Worksheets</strong> for AI & Computational Thinking. 
              Designed for students from Class 3 to 10.
            </p>

            <div className="flex flex-wrap gap-3 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {whatsIncluded.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 glass rounded-full text-sm">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" className="rounded-full gap-2 px-8" onClick={() => document.getElementById('books-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <ShoppingCart className="h-5 w-5" />
                Shop Now
              </Button>
              <div className="flex items-center gap-6">
                {[
                  { icon: Truck, text: "Free Delivery" },
                  { icon: CreditCard, text: "COD Available" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              What's Inside <span className="text-gradient-primary">Each Book</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our workbooks combine comprehensive theory with practical worksheets to ensure complete learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="p-6 border-2 border-transparent hover:border-primary/20 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-display">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      {totalItems > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full gradient-primary shadow-xl flex items-center justify-center hover:scale-110 transition-transform animate-bounce-subtle"
        >
          <ShoppingCart className="h-6 w-6 text-primary-foreground" />
          <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-coral text-coral-foreground text-sm font-bold flex items-center justify-center">
            {totalItems}
          </span>
        </button>
      )}

      {/* Cart/Checkout Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={closeCart} />
          <div className="relative w-full max-w-lg bg-background shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                {checkoutStep !== 'cart' && (
                  <Button variant="ghost" size="icon" onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'address' : 'cart')}>
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </Button>
                )}
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                  {checkoutStep === 'cart' && <><ShoppingCart className="h-5 w-5 text-primary" />Your Cart ({totalItems})</>}
                  {checkoutStep === 'address' && <><MapPin className="h-5 w-5 text-primary" />Delivery Address</>}
                  {checkoutStep === 'payment' && <><CreditCard className="h-5 w-5 text-primary" />Payment</>}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                {['Cart', 'Address', 'Payment'].map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      index === 0 ? 'gradient-primary text-primary-foreground' :
                      (checkoutStep === 'address' && index <= 1) || (checkoutStep === 'payment') ? 'gradient-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm font-medium ${
                      (checkoutStep === 'cart' && index === 0) ||
                      (checkoutStep === 'address' && index <= 1) ||
                      (checkoutStep === 'payment') ? 'text-foreground' : 'text-muted-foreground'
                    }`}>{step}</span>
                    {index < 2 && <div className="w-8 h-0.5 bg-muted mx-2" />}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {/* Cart Items */}
              {checkoutStep === 'cart' && (
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">Your cart is empty</p>
                      <p className="text-sm text-muted-foreground mt-1">Add some workbooks to get started</p>
                    </div>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id} className="p-4 border-2 border-border hover:border-primary/20 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{item.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">Worksheet + Theory</p>
                              <p className="text-lg font-bold text-primary mt-2">₹{item.price}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.id)}>
                                <X className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <div className="flex items-center gap-2 bg-muted rounded-full p-1">
                                <button 
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-7 h-7 rounded-full bg-background flex items-center justify-center hover:bg-primary/10 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-7 h-7 rounded-full bg-background flex items-center justify-center hover:bg-primary/10 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}

                      {/* Order Summary */}
                      <Card className="p-4 bg-muted/50 mt-6">
                        <h3 className="font-bold text-foreground mb-3">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                            <span className="font-medium">₹{totalPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Delivery</span>
                            <span className="font-medium">{deliveryCharge === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryCharge}`}</span>
                          </div>
                          {deliveryCharge > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">Add ₹{1500 - totalPrice} more for free delivery</p>
                          )}
                          <div className="border-t border-border pt-2 mt-2">
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total</span>
                              <span className="text-primary">₹{finalTotal}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </>
                  )}
                </div>
              )}

              {/* Address Form */}
              {checkoutStep === 'address' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Full Name *
                      </Label>
                      <Input 
                        id="fullName"
                        placeholder="Enter your full name"
                        value={address.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone *
                      </Label>
                      <Input 
                        id="phone"
                        placeholder="10-digit mobile"
                        value={address.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email
                      </Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="Optional"
                        value={address.email}
                        onChange={(e) => handleAddressChange('email', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        Address *
                      </Label>
                      <Textarea 
                        id="address"
                        placeholder="House no., Building, Street, Area"
                        value={address.address}
                        onChange={(e) => handleAddressChange('address', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="mb-2 block">City *</Label>
                      <Input 
                        id="city"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="mb-2 block">State *</Label>
                      <Input 
                        id="state"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="pincode" className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Pincode *
                      </Label>
                      <Input 
                        id="pincode"
                        placeholder="6-digit pincode"
                        value={address.pincode}
                        onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Options */}
              {checkoutStep === 'payment' && (
                <div className="space-y-4">
                  <Card 
                    className={`p-4 cursor-pointer border-2 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/20'}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'gradient-primary' : 'bg-muted'}`}>
                        <Package className={`h-5 w-5 ${paymentMethod === 'cod' ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </div>
                      {paymentMethod === 'cod' && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                  </Card>

                  <Card 
                    className={`p-4 cursor-pointer border-2 transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/20'}`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'online' ? 'gradient-primary' : 'bg-muted'}`}>
                        <CreditCard className={`h-5 w-5 ${paymentMethod === 'online' ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">Pay Online</p>
                        <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking</p>
                      </div>
                      {paymentMethod === 'online' && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                  </Card>

                  {/* Delivery Address Summary */}
                  <Card className="p-4 bg-muted/50 mt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Delivery Address
                        </h3>
                        <p className="text-sm text-foreground">{address.fullName}</p>
                        <p className="text-sm text-muted-foreground">{address.address}</p>
                        <p className="text-sm text-muted-foreground">{address.city}, {address.state} - {address.pincode}</p>
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setCheckoutStep('address')}>
                        Edit
                      </Button>
                    </div>
                  </Card>

                  {/* Final Summary */}
                  <Card className="p-4 border-2 border-primary/20">
                    <h3 className="font-bold text-foreground mb-3">Order Total</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Items ({totalItems})</span>
                        <span className="font-medium">₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium text-green-600">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total</span>
                          <span className="text-primary">₹{finalTotal}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-border bg-muted/30">
                {checkoutStep === 'cart' && (
                  <Button className="w-full rounded-full py-6 text-lg gap-2" onClick={() => setCheckoutStep('address')}>
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                )}
                {checkoutStep === 'address' && (
                  <Button 
                    className="w-full rounded-full py-6 text-lg gap-2" 
                    onClick={() => setCheckoutStep('payment')}
                    disabled={!isAddressValid()}
                  >
                    Continue to Payment
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                )}
                {checkoutStep === 'payment' && (
                  <Button className="w-full rounded-full py-6 text-lg gap-2" onClick={handlePlaceOrder}>
                    <Check className="h-5 w-5" />
                    Place Order - ₹{finalTotal}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Books Grid */}
      <section id="books-section" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Layers className="h-3 w-3 mr-1" />
              Class 3 to Class 10
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Choose Your <span className="text-gradient-primary">Workbook</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each workbook contains comprehensive theory + practice worksheets aligned with NEP 2020
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <Card 
                key={book.id}
                className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`h-36 bg-gradient-to-br ${book.color} relative flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 right-2 w-16 h-16 rounded-full border-4 border-white/30" />
                    <div className="absolute bottom-2 left-2 w-12 h-12 rounded-lg border-4 border-white/20" />
                  </div>
                  <div className="text-center relative z-10">
                    <BookOpen className="h-10 w-10 text-white/90 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <p className="text-white font-bold text-lg">{book.class}</p>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-coral text-coral-foreground shadow-lg">
                    <Tag className="h-3 w-3 mr-1" />
                    {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {book.chapters} Chapters
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <PenTool className="h-3 w-3 mr-1" />
                      {book.worksheets} Worksheets
                    </Badge>
                  </div>
                  <h3 className="font-bold text-foreground font-display text-lg">{book.title}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{book.subtitle}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{book.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-foreground font-display flex items-center">
                      <IndianRupee className="h-5 w-5" />{book.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">₹{book.originalPrice}</span>
                  </div>

                  <Button 
                    className="w-full rounded-full gap-2 group-hover:shadow-md transition-shadow"
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-display">
              Why Choose Our <span className="text-gradient-primary">Workbooks?</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Delivery", description: "Free shipping on orders above ₹1500" },
              { icon: Shield, title: "Quality Print", description: "Premium paper & full-color printing" },
              { icon: CreditCard, title: "Easy Payment", description: "COD, UPI, Cards accepted" },
              { icon: GraduationCap, title: "NEP Aligned", description: "Follows latest curriculum guidelines" },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 glass rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-display">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto text-center relative z-10">
          <Zap className="h-12 w-12 text-primary-foreground mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-display">
            Want the Complete Learning Experience?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Get our Full Pack with video lectures, online compiler, quizzes, and physical workbook included!
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

      <Footer />
    </div>
  );
}
