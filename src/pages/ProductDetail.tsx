import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Package, Wheat, Clock, Flame, Droplets, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage } from "@/lib/productImages";
import { useCart } from "@/context/CartContext";
import Navigation from "@/components/Navigation";
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

// Rice variety metadata — keyed by product type for fallback info
const riceInfo: Record<string, { nutrition: { calories: string; protein: string; carbs: string; fiber: string; fat: string }; cookingTips: string[]; origin: string }> = {
  default: {
    nutrition: { calories: "130 kcal", protein: "2.7g", carbs: "28g", fiber: "0.4g", fat: "0.3g" },
    cookingTips: [
      "Rinse rice 2-3 times until water runs clear",
      "Soak for 20-30 minutes before cooking for fluffier grains",
      "Use a 1:2 ratio of rice to water for best results",
      "Let it rest covered for 5 minutes after cooking",
    ],
    origin: "Sourced from fertile farmlands of South India",
  },
  "raw rice": {
    nutrition: { calories: "130 kcal", protein: "2.7g", carbs: "28g", fiber: "0.4g", fat: "0.3g" },
    cookingTips: [
      "Wash thoroughly 2-3 times before cooking",
      "Soak for 30 minutes for perfectly separated grains",
      "Use 1:2.5 rice-to-water ratio",
      "Cook on medium flame, then simmer on low for 10 minutes",
      "Fluff with a fork after resting for 5 minutes",
    ],
    origin: "Premium paddy sourced from traditional South Indian farms",
  },
  "boiled rice": {
    nutrition: { calories: "123 kcal", protein: "2.9g", carbs: "26g", fiber: "0.7g", fat: "0.3g" },
    cookingTips: [
      "Rinse once — boiled rice retains nutrients even without heavy washing",
      "Soak for 15-20 minutes for faster cooking",
      "Use 1:2 rice-to-water ratio",
      "Best for idli, dosa batter, and everyday meals",
      "Pairs wonderfully with sambar and rasam",
    ],
    origin: "Parboiled using traditional steam processing methods",
  },
  "sona masoori": {
    nutrition: { calories: "120 kcal", protein: "2.5g", carbs: "27g", fiber: "0.5g", fat: "0.2g" },
    cookingTips: [
      "Rinse 2-3 times for clean, aromatic grains",
      "Soak for 20 minutes — cooks faster and fluffier",
      "Use 1:2 rice-to-water ratio",
      "Ideal for biryani, pulao, fried rice, and daily meals",
      "Low starch content makes grains naturally separate",
    ],
    origin: "Lightweight aromatic rice from Andhra Pradesh & Telangana",
  },
  "ponni rice": {
    nutrition: { calories: "125 kcal", protein: "2.6g", carbs: "27.5g", fiber: "0.6g", fat: "0.3g" },
    cookingTips: [
      "Wash 2 times and soak for 20 minutes",
      "Use 1:2.5 rice-to-water ratio for soft, fluffy rice",
      "Cook on medium flame, simmer on low for 12 minutes",
      "Popular choice for curd rice and tamarind rice",
    ],
    origin: "Classic Tamil Nadu rice variety, loved for its taste and texture",
  },
};

const getRiceInfo = (type: string) => {
  const key = type.toLowerCase();
  return riceInfo[key] || riceInfo["default"];
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Wheat className="w-10 h-10 text-primary animate-sway" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const info = getRiceInfo(product.type);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Product Hero */}
          <div className="grid md:grid-cols-2 gap-10 mb-12 animate-fade-in">
            {/* Image */}
            <div className="rounded-xl overflow-hidden border border-border shadow-soft bg-card">
              {getProductImage(product.image_url) ? (
                <img
                  src={getProductImage(product.image_url)!}
                  alt={product.name}
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div
                  className="w-full h-[400px] flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(42 78% 42% / 0.1), hsl(95 45% 35% / 0.1))",
                  }}
                >
                  <Package className="w-24 h-24 text-primary animate-bounce-gentle" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Wheat className="w-5 h-5 text-primary" />
                <span
                  className="text-primary font-semibold tracking-wider uppercase text-sm"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  {product.type}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p
                className="text-lg text-muted-foreground leading-relaxed mb-6"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              >
                {product.description || `Premium quality ${product.type} sourced directly from trusted farmers and milled with care at SLN Rice Mill.`}
              </p>
              <p
                className="text-sm text-muted-foreground mb-6 flex items-center gap-2"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              >
                <Leaf className="w-4 h-4 text-secondary" />
                {info.origin}
              </p>

              {/* Price & Cart */}
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">
                  ₹{product.price}
                </span>
                <span className="text-muted-foreground mb-1">/ kg</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-md">
                  <button
                    className="px-4 py-2 text-foreground hover:bg-muted transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-border font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    className="px-4 py-2 text-foreground hover:bg-muted transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="text-muted-foreground" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  kg
                </span>
              </div>

              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                    });
                  }
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add {quantity} kg to Cart — ₹{product.price * quantity}
              </Button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Nutritional Info */}
            <Card className="border border-border shadow-soft animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Flame className="w-6 h-6 text-primary" />
                  Nutritional Info
                </h2>
                <p
                  className="text-sm text-muted-foreground mb-4"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  Per 100g serving (cooked)
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Calories", value: info.nutrition.calories, icon: "🔥" },
                    { label: "Protein", value: info.nutrition.protein, icon: "💪" },
                    { label: "Carbohydrates", value: info.nutrition.carbs, icon: "⚡" },
                    { label: "Dietary Fiber", value: info.nutrition.fiber, icon: "🌾" },
                    { label: "Fat", value: info.nutrition.fat, icon: "🫒" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <span
                        className="text-muted-foreground flex items-center gap-2"
                        style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </span>
                      <span className="font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cooking Tips */}
            <Card className="border border-border shadow-soft animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-secondary" />
                  Cooking Tips
                </h2>
                <div className="space-y-4">
                  {info.cookingTips.map((tip, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-primary font-bold text-sm">{index + 1}</span>
                      </div>
                      <p
                        className="text-muted-foreground leading-relaxed pt-1"
                        style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                      >
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground text-sm">Quick Tip</span>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                  >
                    For the best texture and aroma, always use freshly milled rice within 3-6 months of purchase. Store in a cool, dry place in an airtight container.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
