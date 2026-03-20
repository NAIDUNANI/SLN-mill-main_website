import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Clock, Truck, CheckCircle2, XCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  delivery_address: string | null;
  delivery_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const getStatusIndex = (status: string) => {
  if (status === "cancelled") return -1;
  return statusSteps.findIndex((s) => s.key === status);
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "processing": return "bg-blue-100 text-blue-800 border-blue-300";
    case "delivered": return "bg-green-100 text-green-800 border-green-300";
    case "cancelled": return "bg-red-100 text-red-800 border-red-300";
    default: return "bg-muted text-muted-foreground";
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">You haven't placed any orders yet.</p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const currentStep = getStatusIndex(order.status);
              const isCancelled = order.status === "cancelled";

              return (
                <Card key={order.id} className="overflow-hidden">
                  {/* Order Header */}
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                              {" · "}
                              {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-foreground">₹{Number(order.total_amount).toFixed(2)}</span>
                          <Badge className={`${getStatusBadgeClass(order.status)} capitalize border`}>
                            {order.status}
                          </Badge>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <CardContent className="pt-0 border-t">
                      {/* Status Timeline */}
                      <div className="py-6">
                        {isCancelled ? (
                          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                            <XCircle className="h-6 w-6 text-red-500" />
                            <div>
                              <p className="font-semibold text-red-800">Order Cancelled</p>
                              <p className="text-sm text-red-600">This order has been cancelled.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between relative">
                            {/* Progress line */}
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted mx-10" />
                            <div
                              className="absolute top-5 left-0 h-0.5 bg-primary mx-10 transition-all duration-500"
                              style={{ width: `${currentStep >= 0 ? (currentStep / (statusSteps.length - 1)) * 100 : 0}%` }}
                            />

                            {statusSteps.map((step, index) => {
                              const isCompleted = index <= currentStep;
                              const isCurrent = index === currentStep;
                              const StepIcon = step.icon;

                              return (
                                <div key={step.key} className="flex flex-col items-center relative z-10">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                      isCompleted
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "bg-background border-muted text-muted-foreground"
                                    } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                                  >
                                    <StepIcon className="h-4 w-4" />
                                  </div>
                                  <span className={`text-xs mt-2 font-medium ${isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        <h4 className="font-semibold text-sm text-foreground">Items Ordered</h4>
                        <div className="bg-muted/50 rounded-lg divide-y divide-border">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-center px-4 py-3">
                              <div>
                                <p className="font-medium text-sm">{item.product_name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price_at_purchase}</p>
                              </div>
                              <span className="font-semibold text-sm">₹{(item.quantity * item.price_at_purchase).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        {order.delivery_address && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="font-semibold text-foreground mb-1 flex items-center gap-2">
                              <Truck className="h-4 w-4" /> Delivery Address
                            </p>
                            <p className="text-muted-foreground">{order.delivery_address}</p>
                          </div>
                        )}
                        {order.delivery_phone && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="font-semibold text-foreground mb-1">Phone</p>
                            <p className="text-muted-foreground">{order.delivery_phone}</p>
                          </div>
                        )}
                        {order.notes && (
                          <div className="bg-muted/50 rounded-lg p-4 sm:col-span-2">
                            <p className="font-semibold text-foreground mb-1">Notes</p>
                            <p className="text-muted-foreground">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
