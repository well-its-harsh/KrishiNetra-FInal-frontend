import { Navigation } from "@/components/navigation/Navigation";
import { HeroCarousel } from "../../../components/consumer/HeroCarousel";
import { ProductCard } from "../../../components/consumer/ProductCard";
import { FilterPanel } from "../../../components/consumer/FilterPanel";
import { Button } from "@/components/ui/consumer/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/consumer/sheet";
import { Filter, Grid3x3, List, Sparkles, ChefHat, Star, HeartPulse, Users } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/consumer/input";
import { Slider } from "../../../components/ui/consumer/slider";
import { Badge } from "@/components/ui/consumer/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, ProductListItem } from "@/lib/api";
import pearlMilletImage from "@/assets/product-pearl-millet.jpg";

console.log("Marketplace component is rendering");

const mapProductToCardProps = (product: ProductListItem) => {
  const priceNumber = typeof product.price === "string" ? parseFloat(product.price) : product.price;

  return {
    id: String(product.id),
    title: product.name,
    brand: "Millet producer",
    price: priceNumber,
    unit: "per kg",
    image: product.thumbnail || pearlMilletImage,
    rating: 4.5,
    reviewCount: 0,
    badges: [],
    deliveryEstimate: "2-3 days",
  };
};

const Marketplace = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, loading } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { search: searchTerm.trim() || undefined }],
    queryFn: () =>
      fetchProducts(
        searchTerm.trim()
          ? {
              search: searchTerm.trim(),
            }
          : undefined,
      ),
  });

  const products = data?.products ?? [];
      // Redirect if not authenticated or wrong role
  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== 'consumer') {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'fpo' || user?.role === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    }
    // Default fallback
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-6 md:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <HeroCarousel />
        </div>

        {/* Awareness & Product Grid Section */}
        <div className="flex flex-col gap-6">
          {/* Awareness header strip */}
          <section className="space-y-4">
            <div className="flex flex-col gap-4 rounded-[24px] border border-[#E6DFD4] bg-white/90 p-4 shadow-[0_18px_45px_rgba(95,79,54,0.12)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8C7B67]">Explore millet journeys</p>
                  <h2 className="text-xl font-semibold text-[#1F2D3D]">Learn, cook, and trade with confidence</h2>
                </div>
                <div className="w-full max-w-md">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search millets, recipes, health goals, or sellers..."
                      className="rounded-full border-[#E6DFD4] bg-[#FFF8EC] pl-4 pr-4 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {["Diabetes friendly", "Kids tiffin", "High protein", "Quick recipes"].map((chip) => (
                      <button
                        key={chip}
                        className="btn-ripple rounded-full border border-[#E6DFD4] bg-white px-3 py-1 text-[11px] text-[#7A6A58] hover:bg-[#FFF8EC]"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {[
                  {
                    label: "AI millet guide",
                    description: "Ask any millet or health question in simple language.",
                    icon: Sparkles,
                  },
                  {
                    label: "Recipe hub",
                    description: "Trending millet recipes for home kitchens.",
                    icon: ChefHat,
                  },
                  {
                    label: "Highly rated picks",
                    description: "Curated by rating, freshness, and repeat orders.",
                    icon: Star,
                  },
                  {
                    label: "Doctor recommended",
                    description: "Millet mixes aligned to wellness goals.",
                    icon: HeartPulse,
                  },
                  {
                    label: "SHG & FPO stories",
                    description: "Farmer and SHG success journeys from the field.",
                    icon: Users,
                  },
                ].map((block) => {
                  const Icon = block.icon;
                  return (
                    <div
                      key={block.label}
                      className="min-w-[220px] max-w-[240px] rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC]/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(95,79,54,0.18)]"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-semibold text-[#1F2D3D]">{block.label}</p>
                      </div>
                      <p className="text-xs text-[#7A6A58]">{block.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden w-64 lg:block">
              <div className="sticky top-20">
                <FilterPanel />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-5">
              {/* Toolbar: categories + quick sort */}
              <div className="flex flex-col gap-4 rounded-[20px] border border-[#E6DFD4] bg-white/90 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {["All", "Grains", "Flours", "Ready-to-cook", "Snacks"].map((cat, index) => (
                      <button
                        key={cat}
                        className={`btn-ripple rounded-full border px-3 py-1 ${
                          index === 0
                            ? "border-[#2E7D32] bg-[#2E7D32]/10 text-[#2E7D32]"
                            : "border-[#E6DFD4] bg-[#FFF8EC] text-[#7A6A58] hover:bg-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                    <span className="ml-2 text-[11px] text-[#B09782]">({products.length} items)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[#7A6A58]">Sort by:</span>
                    {["Recommended", "Price · Low to high", "Best rated", "Bestseller"].map((sort, index) => (
                      <button
                        key={sort}
                        className={`btn-ripple rounded-full border px-3 py-1 ${
                          index === 0
                            ? "border-[#2E7D32] bg-[#2E7D32]/10 text-[#2E7D32]"
                            : "border-[#E6DFD4] bg-white text-[#7A6A58] hover:bg-[#FFF8EC]"
                        }`}
                      >
                        {sort}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact filter strip */}
                <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-[#E6DFD4] pt-3 text-xs text-[#7A6A58]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C7B67]">
                    Quick filters
                  </span>
                  <Badge className="rounded-full bg-[#FFF8EC] text-[#7A6A58]">Brand · FarmFresh</Badge>
                  <Badge className="rounded-full bg-[#E4F5E6] text-[#2E7D32]">FPO verified</Badge>
                  <Badge className="rounded-full bg-[#F1F7DB] text-[#5A6B09]">Organic only</Badge>
                  <Badge className="rounded-full bg-[#FDEFD7] text-[#B7741D]">Doctor recommended</Badge>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[11px] text-[#B09782]">Price</span>
                    <Slider defaultValue={[50, 200]} min={0} max={300} step={10} className="w-32" />
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading && (
                  <div className="col-span-full text-sm text-muted-foreground">Loading products...</div>
                )}
                {isError && !isLoading && (
                  <div className="col-span-full text-sm text-red-500">Unable to load products. Please try again.</div>
                )}
                {!isLoading && !isError &&
                  products.map((product) => (
                    <ProductCard key={product.id} {...mapProductToCardProps(product)} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
