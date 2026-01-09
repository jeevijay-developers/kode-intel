import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Home,
  ShoppingBag,
  Copy,
  Check,
  CircleDot,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  title: string;
  class: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  orderId: string;
  items: OrderItem[];
  address: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  totalAmount: number;
  deliveryCharge: number;
  orderDate: string;
  expectedDelivery: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
}

const trackingSteps = [
  { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { id: 'delivered', label: 'Delivered', icon: Home },
];

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Get order details from URL params or localStorage
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    } else {
      // Demo order for preview
      setOrderDetails({
        orderId: `KI${Date.now().toString().slice(-8)}`,
        items: [
          { id: 'book-5', title: 'AI Explorer - Class 5', class: 'Class 5', price: 999, quantity: 1 },
          { id: 'book-6', title: 'AI Explorer - Class 6', class: 'Class 6', price: 999, quantity: 1 },
        ],
        address: {
          fullName: 'Demo User',
          phone: '9876543210',
          email: 'demo@example.com',
          address: '123 Demo Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        paymentMethod: 'cod',
        totalAmount: 2097,
        deliveryCharge: 99,
        orderDate: new Date().toISOString(),
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
      });
    }
  }, []);

  const copyOrderId = () => {
    if (orderDetails) {
      navigator.clipboard.writeText(orderDetails.orderId);
      setCopied(true);
      toast({ title: "Order ID copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCurrentStepIndex = () => {
    if (!orderDetails) return 0;
    return trackingSteps.findIndex(step => step.id === orderDetails.status);
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center animate-bounce-subtle">
            <CheckCircle className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-display">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your learning journey begins soon!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order ID Card */}
            <Card className="p-6 border-2 border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono">{orderDetails.orderId}</span>
                    <button 
                      onClick={copyOrderId}
                      className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <Badge className="py-2 px-4 text-sm capitalize">
                  {orderDetails.status.replace('_', ' ')}
                </Badge>
              </div>
            </Card>

            {/* Order Tracking */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Order Tracking
              </h2>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted" />
                <div 
                  className="absolute left-6 top-0 w-0.5 bg-primary transition-all duration-500"
                  style={{ height: `${(currentStep / (trackingSteps.length - 1)) * 100}%` }}
                />

                <div className="space-y-6">
                  {trackingSteps.map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    
                    return (
                      <div key={step.id} className="flex items-center gap-4 relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                          isCompleted 
                            ? 'gradient-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}>
                          <step.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-primary animate-pulse">In progress...</p>
                          )}
                        </div>
                        {isCompleted && index < currentStep && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-muted/50 flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                  <p className="font-semibold">
                    {new Date(orderDetails.expectedDelivery).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Order Items
              </h2>
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                    <div className="w-16 h-20 rounded-lg gradient-primary flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Address
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">{orderDetails.address.fullName}</p>
                <p className="text-muted-foreground">{orderDetails.address.address}</p>
                <p className="text-muted-foreground">
                  {orderDetails.address.city}, {orderDetails.address.state} - {orderDetails.address.pincode}
                </p>
                <div className="pt-3 space-y-2 border-t border-border mt-3">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {orderDetails.address.phone}
                  </p>
                  {orderDetails.address.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {orderDetails.address.email}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Payment Summary */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Payment Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{orderDetails.totalAmount - orderDetails.deliveryCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={orderDetails.deliveryCharge === 0 ? 'text-primary' : ''}>
                    {orderDetails.deliveryCharge === 0 ? 'FREE' : `₹${orderDetails.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{orderDetails.totalAmount}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">
                    {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* What's Next */}
            <Card className="p-6 border-2 border-primary/20 bg-primary/5">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                What's Next?
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CircleDot className="h-4 w-4 text-primary mt-0.5" />
                  <span>You'll receive order updates via SMS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-4 w-4 text-primary mt-0.5" />
                  <span>Our delivery partner will contact you before delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-4 w-4 text-primary mt-0.5" />
                  <span>Start exploring our online content while you wait!</span>
                </li>
              </ul>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full gap-2" onClick={() => navigate("/student")}>
                Start Learning Online
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/store")}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
