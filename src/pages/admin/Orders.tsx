import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Eye, Search, Package } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  delivery_address: string | null;
  delivery_phone: string | null;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const statusOptions = ["pending", "processing", "delivered", "cancelled"];

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
  const { isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/");
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchOrders();
  }, [isAdmin]);

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
      setOrders(orders.filter(o => o.id !== orderId));
      setSelectedOrder(null);
      toast.success("Order deleted");
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.delivery_phone?.includes(searchTerm) || o.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="icon">
            <Link to="/admin/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
            <p className="text-muted-foreground">
              {orders.length} total · {orders.filter(o => o.status === "pending").length} pending · {orders.filter(o => o.status === "processing").length} processing
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by ID, phone, address..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">#{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell>{order.order_items?.length || 0}</TableCell>
                        <TableCell className="font-semibold">₹{Number(order.total_amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeClass(order.status)} capitalize border`}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}>
                            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {selectedOrder?.id === order.id && (
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Order #{selectedOrder.id.slice(0, 8)}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <Badge className={`${getStatusBadgeClass(selectedOrder.status)} capitalize border`}>{selectedOrder.status}</Badge>
                                    <span className="text-sm text-muted-foreground">{new Date(selectedOrder.created_at).toLocaleString("en-IN")}</span>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Items</h4>
                                    <div className="bg-muted/50 rounded-lg divide-y divide-border">
                                      {selectedOrder.order_items?.map((item) => (
                                        <div key={item.id} className="flex justify-between px-4 py-3">
                                          <div>
                                            <p className="font-medium text-sm">{item.product_name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price_at_purchase}</p>
                                          </div>
                                          <span className="font-semibold text-sm">₹{(item.quantity * item.price_at_purchase).toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex justify-between font-bold border-t pt-3">
                                    <span>Total</span>
                                    <span>₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
                                  </div>

                                  {selectedOrder.delivery_address && (
                                    <div className="text-sm">
                                      <span className="font-semibold">Address: </span>
                                      <span className="text-muted-foreground">{selectedOrder.delivery_address}</span>
                                    </div>
                                  )}
                                  {selectedOrder.delivery_phone && (
                                    <div className="text-sm">
                                      <span className="font-semibold">Phone: </span>
                                      <span className="text-muted-foreground">{selectedOrder.delivery_phone}</span>
                                    </div>
                                  )}
                                  {selectedOrder.notes && (
                                    <div className="text-sm">
                                      <span className="font-semibold">Notes: </span>
                                      <span className="text-muted-foreground">{selectedOrder.notes}</span>
                                    </div>
                                  )}

                                  <div className="flex gap-2 pt-2">
                                    <Select value={selectedOrder.status} onValueChange={(v) => updateOrderStatus(selectedOrder.id, v)}>
                                      <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        {statusOptions.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                                      </SelectContent>
                                    </Select>
                                    <Button variant="destructive" size="sm" onClick={() => deleteOrder(selectedOrder.id)}>
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Orders;
