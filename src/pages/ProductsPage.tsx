import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Wheat, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage } from "@/lib/productImages";
import Navigation from "@/components/Navigation";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string | null;
  status: string;
  image_url: string | null;
}

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "in_stock")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const types = ["all", ...Array.from(new Set(products.map((p) => p.type)))];
  const filtered = filter === "all" ? products : products.filter((p) => p.type === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Cart />
      <WhatsAppButton />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-10">
            <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-2 mb-3">
              <Wheat className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                Our Harvest
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              All Rice Varieties
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Handpicked from the finest paddy fields — rice for every kitchen and every occasion
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  filter === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Products */}
          {loading ? (
            <div className="text-center py-12">
              <Wheat className="w-10 h-10 text-primary animate-sway mx-auto mb-3" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-card rounded-lg overflow-hidden shadow-soft hover-lift animate-fade-in border border-border"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {getProductImage(product.image_url) ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={getProductImage(product.image_url)!}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-48 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10"
                    >
                      <Package className="w-20 h-20 text-primary" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                      {product.description || product.type}
                    </p>
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xl font-bold text-primary">₹{product.price}</span>
                      <span className="text-xs text-muted-foreground">per kg</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="sm"
                        onClick={() =>
                          addToCart({ id: product.id, name: product.name, price: product.price })
                        }
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button asChild variant="outline" size="sm" className="hover:border-primary hover:text-primary">
                        <Link to={`/product/${product.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
