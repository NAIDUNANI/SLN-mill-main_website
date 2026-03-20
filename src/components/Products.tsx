import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, ShoppingCart, Wheat, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage } from "@/lib/productImages";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string | null;
  status: string;
  image_url: string | null;
}

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'in_stock')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-muted/30 relative grain-texture">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Wheat className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold tracking-wider uppercase text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Our Harvest
            </span>
            <Wheat className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Premium Rice Varieties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Handpicked from the finest paddy fields — rice for every kitchen and every occasion
          </p>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Wheat className="w-10 h-10 text-primary animate-sway mx-auto mb-3" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="bg-card rounded-lg overflow-hidden shadow-soft hover-lift animate-fade-in border border-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {getProductImage(product.image_url) ? (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={getProductImage(product.image_url)!} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(42 78% 42% / 0.1), hsl(95 45% 35% / 0.1))' }}>
                    <Package className="w-20 h-20 text-primary animate-bounce-gentle" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                    {product.description || product.type}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                      <span className="text-sm text-muted-foreground">per kg</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price
                        })}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button asChild variant="outline" className="hover:border-primary hover:text-primary">
                        <Link to={`/product/${product.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-card rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between animate-scale-in hover-glow border border-border">
          <div className="mb-6 md:mb-0">
            <h3 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-primary animate-bounce-gentle" />
              Farm-Fresh Delivery
            </h3>
            <p className="text-lg text-muted-foreground" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              From our mill to your doorstep — fast, reliable delivery for all order sizes
            </p>
          </div>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Request a Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
