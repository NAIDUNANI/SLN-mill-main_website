import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Eye, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Query {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

const Queries = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchQueries();
    }
  }, [isAdmin]);

  const fetchQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQueries(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load queries",
        variant: "destructive",
      });
    }
  };

  const filteredQueries = queries.filter(
    (query) =>
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkResolved = async (queryId: string) => {
    try {
      const { error } = await supabase
        .from('queries')
        .update({ status: 'resolved' })
        .eq('id', queryId);

      if (error) throw error;

      toast({
        title: "Query Updated",
        description: "Query has been marked as resolved.",
      });
      
      fetchQueries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update query",
        variant: "destructive",
      });
    }
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
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="icon">
            <Link to="/admin/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Query Management</h1>
            <p className="text-muted-foreground">View and respond to customer inquiries</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Queries</CardTitle>
            <CardDescription>
              Total queries: {queries.length} | Pending: {queries.filter((q) => q.status === "pending").length}
            </CardDescription>
            <div className="flex items-center gap-2 mt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No queries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQueries.map((query) => (
                      <TableRow key={query.id}>
                        <TableCell className="font-medium">{query.name}</TableCell>
                        <TableCell>{query.email}</TableCell>
                        <TableCell>{query.phone}</TableCell>
                        <TableCell>{new Date(query.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={query.status === "pending" ? "secondary" : "default"}>
                            {query.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedQuery(query)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              {selectedQuery && (
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Query Details</DialogTitle>
                                    <DialogDescription>
                                      Submitted on {new Date(selectedQuery.created_at).toLocaleString()}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-1">Name</h4>
                                      <p className="text-muted-foreground">{selectedQuery.name}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-1">Email</h4>
                                      <p className="text-muted-foreground">{selectedQuery.email}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-1">Phone</h4>
                                      <p className="text-muted-foreground">{selectedQuery.phone}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-1">Message</h4>
                                      <p className="text-muted-foreground">{selectedQuery.message}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button asChild className="flex-1">
                                        <a href={`mailto:${selectedQuery.email}`}>Send Email</a>
                                      </Button>
                                      <Button asChild variant="outline" className="flex-1">
                                        <a href={`tel:${selectedQuery.phone}`}>Call</a>
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              )}
                            </Dialog>
                            {query.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMarkResolved(query.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
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

export default Queries;
