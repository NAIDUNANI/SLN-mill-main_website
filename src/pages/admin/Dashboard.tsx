import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, MessageSquare, TrendingUp, ShoppingBag, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalQueries: 0,
    pendingQueries: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const [
        { count: usersCount },
        { count: productsCount },
        { count: queriesCount },
        { count: pendingCount },
        { count: ordersCount },
        { count: pendingOrdersCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('queries').select('*', { count: 'exact', head: true }),
        supabase.from('queries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      setStats({
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        totalQueries: queriesCount || 0,
        pendingQueries: pendingCount || 0,
        totalOrders: ordersCount || 0,
        pendingOrders: pendingOrdersCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const downloadExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportOrders = async () => {
    setExporting("orders");
    try {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const formatted = (data || []).map(o => ({
        "Order ID": o.id,
        "Status": o.status,
        "Total Amount": o.total_amount,
        "Delivery Address": o.delivery_address || "",
        "Delivery Phone": o.delivery_phone || "",
        "Notes": o.notes || "",
        "Created At": new Date(o.created_at).toLocaleString(),
      }));
      downloadExcel(formatted, "Orders");
      toast.success("Orders exported successfully");
    } catch { toast.error("Failed to export orders"); }
    finally { setExporting(null); }
  };

  const exportUsers = async () => {
    setExporting("users");
    try {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const formatted = (data || []).map(u => ({
        "User ID": u.id,
        "Full Name": u.full_name || "",
        "Phone": u.phone || "",
        "Address": u.address || "",
        "Joined At": new Date(u.created_at).toLocaleString(),
      }));
      downloadExcel(formatted, "Users");
      toast.success("Users exported successfully");
    } catch { toast.error("Failed to export users"); }
    finally { setExporting(null); }
  };

  const exportQueries = async () => {
    setExporting("queries");
    try {
      const { data, error } = await supabase.from("queries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const formatted = (data || []).map(q => ({
        "Name": q.name,
        "Email": q.email,
        "Phone": q.phone,
        "Message": q.message,
        "Status": q.status,
        "Created At": new Date(q.created_at).toLocaleString(),
      }));
      downloadExcel(formatted, "Queries");
      toast.success("Queries exported successfully");
    } catch { toast.error("Failed to export queries"); }
    finally { setExporting(null); }
  };

  const exportProducts = async () => {
    setExporting("products");
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const formatted = (data || []).map(p => ({
        "Product Name": p.name,
        "Type": p.type,
        "Price (₹)": p.price,
        "Status": p.status,
        "Description": p.description || "",
        "Created At": new Date(p.created_at).toLocaleString(),
      }));
      downloadExcel(formatted, "Products");
      toast.success("Products exported successfully");
    } catch { toast.error("Failed to export products"); }
    finally { setExporting(null); }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/">Back to Site</Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queries</CardTitle>
              <MessageSquare className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQueries}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingQueries} pending</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingOrders} pending</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Queries</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingQueries}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Export Data Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Export Data (Excel)
            </CardTitle>
            <CardDescription>Download data as Excel spreadsheets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button onClick={exportOrders} disabled={exporting === "orders"} variant="outline" className="h-16">
                <div className="flex flex-col items-center gap-1">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="text-sm">{exporting === "orders" ? "Exporting..." : "Export Orders"}</span>
                </div>
              </Button>
              <Button onClick={exportUsers} disabled={exporting === "users"} variant="outline" className="h-16">
                <div className="flex flex-col items-center gap-1">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">{exporting === "users" ? "Exporting..." : "Export Users"}</span>
                </div>
              </Button>
              <Button onClick={exportQueries} disabled={exporting === "queries"} variant="outline" className="h-16">
                <div className="flex flex-col items-center gap-1">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm">{exporting === "queries" ? "Exporting..." : "Export Queries"}</span>
                </div>
              </Button>
              <Button onClick={exportProducts} disabled={exporting === "products"} variant="outline" className="h-16">
                <div className="flex flex-col items-center gap-1">
                  <Package className="h-5 w-5" />
                  <span className="text-sm">{exporting === "products" ? "Exporting..." : "Export Products"}</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your rice mill operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button asChild className="w-full h-24 text-lg" variant="outline">
                <Link to="/admin/users">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8" />
                    <span>Manage Users</span>
                  </div>
                </Link>
              </Button>

              <Button asChild className="w-full h-24 text-lg" variant="outline">
                <Link to="/admin/products">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8" />
                    <span>Manage Products</span>
                  </div>
                </Link>
              </Button>

              <Button asChild className="w-full h-24 text-lg" variant="outline">
                <Link to="/admin/orders">
                  <div className="flex flex-col items-center gap-2">
                    <ShoppingBag className="h-8 w-8" />
                    <span>Manage Orders</span>
                  </div>
                </Link>
              </Button>

              <Button asChild className="w-full h-24 text-lg" variant="outline">
                <Link to="/admin/queries">
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="h-8 w-8" />
                    <span>View Queries</span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
