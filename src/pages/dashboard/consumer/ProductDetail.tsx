import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Award,
  Leaf,
  CalendarDays,
  MapPin,
  Clock3,
  Truck,
  Sprout,
  Warehouse,
  Factory,
  Package,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { Navigation } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/consumer/button";
import { Badge } from "@/components/ui/consumer/badge";
import { Card, CardContent } from "@/components/ui/consumer/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/consumer/tabs";
import { Separator } from "@/components/ui/consumer/separator";
import { ProductCard } from "@/components/consumer/ProductCard";
import pearlMilletImage from "@/assets/product-pearl-millet.jpg";
import ragiFlourImage from "@/assets/product-ragi-flour.jpg";
import foxtailMilletImage from "@/assets/product-foxtail-millet.jpg";
import { useQuery } from "@tanstack/react-query";
import { checkProductAvailability, fetchProductDetail, ProductDetail as ApiProductDetail } from "@/lib/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const numericId = id ? parseInt(id, 10) : NaN;

  const {
    data: apiProduct,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery<ApiProductDetail>({
    queryKey: ["product-detail", numericId],
    queryFn: () => fetchProductDetail(numericId),
    enabled: Number.isFinite(numericId),
  });

  const {
    data: availability,
    isLoading: isAvailabilityLoading,
  } = useQuery<{ available: boolean; message: string}>({
    queryKey: ["product-availability", numericId, quantity],
    queryFn: () => checkProductAvailability(numericId, quantity),
    enabled: Number.isFinite(numericId),
  });

  const product = (() => {
    if (!apiProduct) {
      return {
        id: id || "1",
        title: "Organic Pearl Millet (Bajra)",
        brand: "FarmFresh Co-op",
        price: 89,
        mrp: 120,
        unit: "per kg",
        images: [pearlMilletImage, pearlMilletImage, pearlMilletImage],
        rating: 4.5,
        reviewCount: 0,
        badges: ["FPO-Verified", "Lab-Verified", "FSSAI", "Organic"],
        description:
          "Premium organic pearl millet sourced from regenerative farms. Naturally rich in fiber, protein, and minerals, it is ideal for wholesome rotis, porridge, and artisanal recipes.",
        nutritionalInfo: {
          protein: "11g",
          fiber: "8g",
          iron: "3mg",
          calcium: "42mg",
        },
      };
    }

    const priceNumber = typeof apiProduct.price === "string" ? parseFloat(apiProduct.price) : apiProduct.price;
    const misc = apiProduct.miscellaneous_data || {};

    return {
      id: String(apiProduct.id),
      title: apiProduct.name,
      brand: misc.brand || "Millet producer",
      price: priceNumber,
      mrp: misc.mrp || priceNumber,
      unit: misc.unit || "per kg",
      images: (apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images : [apiProduct.thumbnail].filter(Boolean)) as string[] || [pearlMilletImage],
      rating: misc.rating || 4.5,
      reviewCount: misc.reviewCount || 0,
      badges: (misc.badges as string[]) || ["FPO-Verified"],
      description:
        apiProduct.description ||
        "Premium organic millet sourced from trusted farmer networks. Naturally rich in fiber, protein, and minerals.",
      nutritionalInfo:
        (misc.nutritionalInfo as Record<string, string>) || {
          protein: "11g",
          fiber: "8g",
          iron: "3mg",
          calcium: "42mg",
        },
    };
  })();

  const summaryInfo = [
    { label: "Verified by", value: "FPO Council", icon: ShieldCheck, tone: "bg-[#E4F5E6] text-[#2E7D32]" },
    { label: "Origin", value: "Jodhpur · Rajasthan", icon: MapPin, tone: "bg-[#FFF8EC] text-[#8B6F4E]" },
    { label: "Harvest date", value: "12 Oct 2024", icon: CalendarDays, tone: "bg-[#E1EEF9] text-[#1F4B6B]" },
    { label: "Shelf life", value: "6 months", icon: Clock3, tone: "bg-[#FDEFD7] text-[#B7741D]" },
  ];

  const certificationMeta: Record<
    string,
    {
      color: string;
      icon: React.ReactNode;
    }
  > = {
    "FPO-Verified": { color: "bg-[#E4F5E6] text-[#2E7D32]", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    "Lab-Verified": { color: "bg-[#E1EEF9] text-[#1F4B6B]", icon: <Award className="h-3.5 w-3.5" /> },
    "FSSAI": { color: "bg-[#FDE8D6] text-[#B3580C]", icon: <Package className="h-3.5 w-3.5" /> },
    Organic: { color: "bg-[#F1F7DB] text-[#5A6B09]", icon: <Leaf className="h-3.5 w-3.5" /> },
  };

  const traceSteps = [
    { label: "Farm", date: "02 Oct", location: "Village cluster · Rajasthan", authority: "FPO supervisor", batch: "Batch F-2024-01", icon: Sprout },
    { label: "Collection center", date: "05 Oct", location: "Block collection hub", authority: "SHG coordinator", batch: "Batch C-2024-01", icon: Warehouse },
    { label: "Cleaning & processing", date: "08 Oct", location: "Regional mill", authority: "Lab team", batch: "Batch P-2024-01", icon: Factory },
    { label: "Packaging", date: "10 Oct", location: "Packing unit", authority: "Quality officer", batch: "Batch PK-2024-01", icon: Package },
    { label: "Warehouse", date: "11 Oct", location: "Cold storage hub", authority: "Store manager", batch: "Batch W-2024-01", icon: Warehouse },
    { label: "Dispatch", date: "12 Oct", location: "Line-haul loading", authority: "Logistics partner", batch: "Batch D-2024-01", icon: Truck },
  ];

  const similarProducts = [
    {
      id: "sp-1",
      title: "Pearl Millet Reserve",
      brand: "Village Harvest",
      price: 149,
      unit: "per kg",
      image: pearlMilletImage,
      rating: 4.6,
      reviewCount: 182,
      badges: ["FPO-Verified", "Organic"],
      deliveryEstimate: "2-3 days",
    },
    {
      id: "sp-2",
      title: "Foxtail Millet Prime",
      brand: "Millet Collective",
      price: 152,
      unit: "per kg",
      image: foxtailMilletImage,
      rating: 4.7,
      reviewCount: 201,
      badges: ["Lab-Verified", "FSSAI"],
      deliveryEstimate: "3-4 days",
    },
    {
      id: "sp-3",
      title: "Ragi Flour Artisan",
      brand: "FarmFresh Co-op",
      price: 168,
      unit: "per kg",
      image: ragiFlourImage,
      rating: 4.8,
      reviewCount: 256,
      badges: ["Organic", "FSSAI"],
      deliveryEstimate: "1-2 days",
    },
  ];

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const [visibleTraceSteps, setVisibleTraceSteps] = useState(1);

  useEffect(() => {
    setVisibleTraceSteps(1);
    const timer = setInterval(() => {
      setVisibleTraceSteps((prev) => {
        if (prev >= traceSteps.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 450);
    return () => clearInterval(timer);
  }, []);

  if (isProductLoading) {
    return (
      <div className="min-h-screen bg-[#F7F1E5]">
        <Navigation />
        <main className="container px-4 py-10 md:px-6 lg:px-10">
          <p className="text-sm text-[#7A6A58]">Loading product details...</p>
        </main>
      </div>
    );
  }

  if (isProductError || !apiProduct && !id) {
    return (
      <div className="min-h-screen bg-[#F7F1E5]">
        <Navigation />
        <main className="container px-4 py-10 md:px-6 lg:px-10">
          <p className="text-sm text-[#C6533D]">Unable to load this product. Please try again from the marketplace.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <Navigation />

      <main className="container px-4 py-10 md:px-6 lg:px-10">
        <section className="grid gap-10 rounded-[32px] border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_30px_90px_rgba(95,79,54,0.12)] lg:grid-cols-2">
          <div className="space-y-5">
            <div className="relative aspect-square overflow-hidden rounded-[24px] border border-[#E6DFD4] bg-[#FFF8EC] shadow-[0_30px_70px_rgba(95,79,54,0.18)]">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="h-full w-full object-cover object-center transition duration-500 ease-out"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`btn-ripple aspect-square w-24 min-w-[6rem] overflow-hidden rounded-[12px] border-2 transition-all duration-300 shadow-sm ${
                    selectedImage === index ? "border-[#2E7D32] shadow-[0_15px_35px_rgba(46,125,50,0.3)]" : "border-transparent hover:border-[#D5EAD5]"
                  }`}
                >
                  <img src={image} alt={`View ${index + 1}`} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.4em] text-[#8C7B67]">{product.brand}</p>
              <h1 className="text-[2.25rem] font-semibold leading-tight text-[#1F2D3D]">{product.title}</h1>
              <div className="grid gap-3 rounded-[22px] border border-[#E6DFD4] bg-[#FFF8EC]/80 p-4 md:grid-cols-2">
                {summaryInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${item.tone} shadow-sm`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-[#8C7B67]">{item.label}</p>
                        <p className="text-sm font-semibold text-[#1F2D3D]">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-[#DFA44A] text-[#DFA44A]" : "text-[#D7CBBB]"}`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#1F2D3D]">{product.rating}</span>
              <span className="text-sm text-[#7A6A58]">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <Badge
                  key={badge}
                  className={`btn-ripple gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-[0_8px_18px_rgba(0,0,0,0.08)] ${
                    certificationMeta[badge]?.color || "bg-[#FFF8EC] text-[#8C7B67]"
                  }`}
                >
                  {certificationMeta[badge]?.icon}
                  <span>{badge.replace("-", " ")}</span>
                </Badge>
              ))}
            </div>

            <div className="space-y-3 rounded-[22px] border border-[#E6DFD4] bg-white/90 p-5">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8C7B67]">Current price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-[#1F2D3D]">₹{product.price}</span>
                    <span className="text-lg text-[#B09782] line-through">₹{product.mrp}</span>
                  </div>
                </div>
                <Badge className="rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
                  <ArrowDownRight className="mr-1 h-3.5 w-3.5" />
                  Save {discountPercent}%
                </Badge>
                <Badge className="rounded-full bg-[#FDEFD7] text-[#B7741D]">
                  <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                  Demand ↑
                </Badge>
              </div>
              <p className="text-sm text-[#7A6A58]">{product.unit}</p>
            </div>

            <div className="space-y-4">
              <p className="text-base text-[#5B4D3B]">{product.description}</p>
              <div className="rounded-[26px] border border-[#E6DFD4] bg-[#FFF8EC]/80 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-full border border-[#E6DFD4] bg-white">
                      <Button variant="ghost" size="icon" className="btn-ripple rounded-full" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        -
                      </Button>
                      <span className="w-12 text-center text-lg font-semibold text-[#1F2D3D]">{quantity}</span>
                      <Button variant="ghost" size="icon" className="btn-ripple rounded-full" onClick={() => setQuantity(quantity + 1)}>
                        +
                      </Button>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#8C7B67]">Stock status</p>
                      <p
                        className={`text-base font-semibold ${
                          availability?.available ? "text-[#2E7D32]" : "text-[#C6533D]"
                        }`}
                      >
                        {isAvailabilityLoading
                          ? "Checking availability..."
                          : availability?.available
                          ? "Available"
                          : availability?.message || "Currently unavailable"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-[#E6DFD4] bg-white/90 px-4 py-2 text-sm text-[#7A6A58]">
                      <Truck className="h-4 w-4 text-[#2E7D32]" />
                      Ships in 24 hrs
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[#E6DFD4] bg-white/90 px-4 py-2 text-sm text-[#7A6A58]">
                      <Clock3 className="h-4 w-4 text-[#DFA44A]" />
                      Delivery 2-3 days
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Button className="btn-ripple flex-1 rounded-full bg-[#2E7D32] py-6 text-lg font-semibold text-white shadow-[0_25px_55px_rgba(46,125,50,0.35)] hover:bg-[#256428]">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to cart
                  </Button>
                  <Button
                    variant="outline"
                    className="btn-ripple flex-1 rounded-full border-[#E6DFD4] bg-white text-[#2E7D32] hover:bg-[#E4F5E6]"
                  >
                    Buy now
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="btn-ripple rounded-full border-[#E6DFD4] bg-white text-[#2E7D32] hover:bg-[#E4F5E6]">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="btn-ripple rounded-full border-[#E6DFD4] bg-white text-[#7A6A58] hover:bg-[#FFF8EC]">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <Separator className="my-12 bg-[#E6DFD4]" />

        <section className="space-y-8">
          <Tabs defaultValue="nutrition">
            <TabsList className="inline-flex rounded-full border border-[#E6DFD4] bg-white/80 p-1 shadow-inner shadow-white/60">
              {[
                { value: "nutrition", label: "Nutrition" },
                { value: "trace", label: "Traceability" },
                { value: "recipes", label: "Recipes" },
                { value: "reviews", label: "Reviews" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-6 py-2 text-sm font-semibold text-[#7A6A58] transition-all data-[state=active]:bg-[#FFF8EC] data-[state=active]:text-[#2E7D32] data-[state=active]:shadow-[0_12px_30px_rgba(46,125,50,0.12)]"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="nutrition" className="mt-8">
              <Card className="rounded-[28px] border border-[#E6DFD4] bg-white/95 shadow-[0_25px_70px_rgba(95,79,54,0.1)]">
                <CardContent className="p-8">
                  <h3 className="mb-6 text-2xl font-semibold text-[#1F2D3D]">Nutritional profile (per 100g)</h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                      <div key={key} className="rounded-2xl border border-[#F2E8DB] bg-[#FFF8EC]/80 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-[#B09782]">{key}</p>
                        <p className="text-3xl font-semibold text-[#1F2D3D]">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trace" className="mt-8 space-y-4">
              <Card className="rounded-[28px] border border-[#E6DFD4] bg-white/95 shadow-[0_25px_70px_rgba(95,79,54,0.1)]">
                <CardContent className="space-y-6 p-8">
                  <h3 className="text-2xl font-semibold text-[#1F2D3D]">Seed-to-shelf timeline</h3>
                  <div className="flex flex-wrap items-center gap-6">
                    {traceSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isVisible = index < visibleTraceSteps;
                      return (
                        <div
                          key={step.label}
                          className={`flex max-w-[210px] flex-col items-center text-center transition-all duration-500 ${
                            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                          }`}
                        >
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC] text-[#2E7D32] shadow-sm">
                            <Icon className="h-6 w-6" />
                          </div>
                          <p className="mt-3 text-sm font-semibold text-[#1F2D3D]">{step.label}</p>
                          <span className="mt-1 rounded-full bg-[#E4F5E6] px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                            {step.date}
                          </span>
                          <p className="mt-2 text-xs text-[#7A6A58]">{step.location}</p>
                          <p className="mt-1 text-[11px] text-[#B09782]">
                            {step.authority} · {step.batch}
                          </p>
                          {index < traceSteps.length - 1 && (
                            <span className="hidden h-px w-16 border-t border-dashed border-[#E6DFD4] lg:block" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="btn-ripple rounded-full border-[#E6DFD4] bg-white text-[#2E7D32] hover:bg-[#E4F5E6]">
                  Download traceability report (PDF)
                </Button>
                <Button variant="ghost" className="btn-ripple rounded-full text-[#7A6A58] hover:bg-[#FFF8EC]">
                  Share journey link
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="recipes" className="mt-8">
              <Card className="rounded-[28px] border border-[#E6DFD4] bg-white/95 shadow-[0_25px_70px_rgba(95,79,54,0.1)]">
                <CardContent className="space-y-4 p-8">
                  <h3 className="text-2xl font-semibold text-[#1F2D3D]">Recipe ideas</h3>
                  <p className="text-lg text-[#7A6A58]">Chef-crafted millet recipes are being curated for this product. Stay tuned!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card className="rounded-[28px] border border-[#E6DFD4] bg-white/95 shadow-[0_25px_70px_rgba(95,79,54,0.1)]">
                <CardContent className="space-y-4 p-8">
                  <h3 className="text-2xl font-semibold text-[#1F2D3D]">Customer voices</h3>
                  <p className="text-lg text-[#7A6A58]">Be the first to share feedback and inspire fellow millet buyers.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <Separator className="my-12 bg-[#E6DFD4]" />

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8C7B67]">Curated picks</p>
              <h2 className="text-2xl font-semibold text-[#1F2D3D]">Frequently bought together</h2>
            </div>
            <Button variant="ghost" className="btn-ripple rounded-full text-[#2E7D32] hover:bg-[#E4F5E6]">
              View all
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {similarProducts.map((item) => (
              <div key={item.id} className="min-w-[260px]">
                <ProductCard {...item} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;
