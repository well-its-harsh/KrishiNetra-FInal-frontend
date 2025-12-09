import { Navigation } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/seller/button";
import { Input } from "@/components/ui/seller/input";
import { Badge } from "@/components/ui/seller/badge";
import { Slider } from "@/components/ui/seller/slider";
import { Plus, RefreshCw, Menu, ShoppingBag, BarChart3, LogOut, LayoutDashboard, List } from "lucide-react";
import { AuctionCard, AuctionFilterPanel, SellerTools } from "@/components/seller/AuctionComponents";
import { useNavigate } from "react-router-dom";
import { AuctionLot } from "@/components/seller/auctionData";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuctions, fetchMyAuctions, AuctionDetail, AuctionWithBids } from "@/lib/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

type AuctionTab = "all" | "live" | "upcoming" | "closed" | "my";

const mapAuctionToLot = (auction: AuctionDetail | AuctionWithBids): AuctionLot => {
  const quantityText = `${auction.quantity} kg`;

  let currentBid: number = 0;
  const anyWithBids = auction as AuctionWithBids;
  if (anyWithBids.current_highest_bid != null) {
    currentBid = typeof anyWithBids.current_highest_bid === "string"
      ? parseFloat(anyWithBids.current_highest_bid)
      : anyWithBids.current_highest_bid;
  } else if (auction.final_price != null) {
    currentBid = typeof auction.final_price === "string" ? parseFloat(auction.final_price) : auction.final_price as number;
  } else {
    currentBid = typeof auction.base_price === "string" ? parseFloat(auction.base_price) : auction.base_price as number;
  }

  const now = new Date();
  const end = new Date(auction.end_time);
  const start = new Date(auction.start_time);

  let status: AuctionLot["status"] = "CLOSED";
  if (now < start) status = "UPCOMING";
  else if (now >= start && now <= end && !("winner_id" in auction && auction.winner_id)) status = "LIVE";

  let timeLeft = "Ended";
  if (status === "LIVE") {
    const diffSeconds = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
    const h = String(Math.floor(diffSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(diffSeconds % 60).padStart(2, "0");
    timeLeft = `${h}:${m}:${s}`;
  }

  const misc = auction.miscellaneous_data || {};

  return {
    id: String(auction.id),
    name: auction.name,
    quantity: quantityText,
    currentBid,
    timeLeft,
    status,
    grainType: misc.grainType || "Millet",
    location: misc.location || "India",
    certification: (misc.certification as string[]) || [],
    thumbnail: (auction as any).thumbnail || ((auction as any).images && (auction as any).images[0]) || null,
  };
};

const SellerMarketplace = () => {
  const [activeTab, setActiveTab] = useState<AuctionTab>("all");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: allAuctions, isLoading, isError } = useQuery<
    (AuctionDetail | AuctionWithBids)[]
  >({
    queryKey: ["auctions", activeTab],
    queryFn: async () => {
      if (activeTab === "my") {
        return await fetchMyAuctions();
      }
      if (activeTab === "live") return await fetchAuctions("active");
      if (activeTab === "upcoming") return await fetchAuctions("upcoming");
      if (activeTab === "closed") return await fetchAuctions("completed");
      return await fetchAuctions("all");
    },
  });

  const sortedLots: AuctionLot[] = useMemo(() => {
    const raw = allAuctions ?? [];
    const mapped = raw.map(mapAuctionToLot);
    const statusOrder: Record<string, number> = { LIVE: 0, UPCOMING: 1, CLOSED: 2 };
    return mapped.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [allAuctions]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navigation />

      <main className="container mx-auto px-4 py-6 md:px-6 lg:px-8 space-y-6">
        {/* Sidebar trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="fixed left-4 top-20 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E6DFD4] bg-white shadow-sm hover:bg-[#FFF8EC]"
            >
              <Menu className="h-5 w-5 text-[#5B4D3B]" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-r border-[#E6DFD4] bg-[#FFF8EC] px-0">
            <SheetHeader className="px-5 pt-5 pb-3">
              <SheetTitle className="text-left text-lg font-semibold text-[#1F2D3D]">
                Seller navigation
              </SheetTitle>
            </SheetHeader>
            <div className="mt-2 flex flex-col gap-1 px-3 text-sm text-[#5B4D3B]">
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white"
                onClick={() => navigate("/dashboard/consumer")}
              >
                <ShoppingBag className="h-4 w-4 text-[#2E7D32]" />
                <span>Consumer marketplace</span>
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white"
                onClick={() => navigate("/dashboard/seller")}
              >
                <LayoutDashboard className="h-4 w-4 text-[#2E7D32]" />
                <span>Seller marketplace</span>
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white"
                onClick={() => navigate("/auction/create")}
              >
                <Plus className="h-4 w-4 text-[#2E7D32]" />
                <span>Create lot</span>
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white"
                onClick={() => navigate("/auction/my-lots")}
              >
                <List className="h-4 w-4 text-[#2E7D32]" />
                <span>View lots</span>
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white"
                onClick={() => navigate("/auction/insights")}
              >
                <BarChart3 className="h-4 w-4 text-[#2E7D32]" />
                <span>Auction analytics</span>
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white"
                onClick={() => navigate("/products/listing-mode")}
              >
                <Plus className="h-4 w-4 text-[#2E7D32]" />
                <span>List product</span>
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white"
                onClick={() => navigate("/products/my-products")}
              >
                <List className="h-4 w-4 text-[#2E7D32]" />
                <span>View products</span>
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white"
                onClick={() => navigate("/bulk-products/my-listings")}
              >
                <List className="h-4 w-4 text-[#2E7D32]" />
                <span>My bulk listings</span>
              </button>
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white"
                onClick={() => navigate("/dashboard/seller/contracts")}
              >
                <List className="h-4 w-4 text-[#2E7D32]" />
                <span>Institution contracts</span>
              </button>
              <div className="mt-2 border-t border-dashed border-[#E6DFD4] pt-2" />
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 text-[#C6533D] hover:bg-white"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content Layout */}
        <div className="flex flex-col gap-6">
          {/* Header & Tools Section (Replacing Hero & Awareness Strip) */}
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#0D1B2A] via-[#12345A] to-[#1F2D3D] px-5 py-6 text-white shadow-[0_22px_50px_rgba(15,23,42,0.45)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-200/90">Seller console</p>
                  <h1 className="text-2xl md:text-3xl font-semibold">Auction Marketplace</h1>
                  <p className="text-xs md:text-sm text-slate-100/80 max-w-xl">
                    List millet lots, track live bidding and manage institutional demand in one trusted place.
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 md:mt-0">
                  <Button className="rounded-full bg-[#4CAF50] px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-[#3D8B41]">
                    <Plus className="mr-2 h-4 w-4" />
                    Create auction lot
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-amber-300 bg-amber-50/10 px-4 py-2 text-xs md:text-sm font-semibold text-amber-200 hover:bg-amber-50/20"
                    onClick={() => navigate("/dashboard/seller/contracts")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View contracts
                  </Button>
                </div>
              </div>
            </div>

            {/* Seller Tools Row */}
            <SellerTools />

            {/* Product Tools Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="flex items-center gap-4 rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC]/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(95,79,54,0.18)] cursor-pointer"
                onClick={() => navigate("/products/listing-mode")}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
                  <Plus className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1F2D3D]">List Product</p>
                  <p className="text-xs text-[#7A6A58]">Create a direct product listing</p>
                </div>
              </div>

              <div
                className="flex items-center gap-4 rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC]/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(95,79,54,0.18)] cursor-pointer"
                onClick={() => navigate("/products/my-products")}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
                  <List className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1F2D3D]">My Products</p>
                  <p className="text-xs text-[#7A6A58]">View and manage listed products</p>
                </div>
              </div>

              <div
                className="flex items-center gap-4 rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC]/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(95,79,54,0.18)] cursor-pointer"
                onClick={() => navigate("/products/insights")}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
                  <BarChart3 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1F2D3D]">Product Insights</p>
                  <p className="text-xs text-[#7A6A58]">Track product performance</p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden w-64 lg:block">
              <div className="sticky top-20">
                <AuctionFilterPanel />
              </div>
            </aside>

            {/* Main Grid Content */}
            <div className="flex-1 space-y-5">
              {/* Toolbar: categories + quick sort (Adapted for Auction) */}
              <div className="flex flex-col gap-4 rounded-[20px] border border-[#E6DFD4] bg-white/90 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {["All Lots", "Live", "Upcoming", "Closed", "My Bids"].map((cat) => {
                      const tab: AuctionTab =
                        cat === "All Lots" ? "all" :
                        cat === "Live" ? "live" :
                        cat === "Upcoming" ? "upcoming" :
                        cat === "Closed" ? "closed" : "my";
                      const isActive = activeTab === tab;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveTab(tab)}
                          className={`btn-ripple rounded-full border px-3 py-1 ${
                            isActive
                              ? "border-[#2E7D32] bg-[#2E7D32]/10 text-[#2E7D32]"
                              : "border-[#E6DFD4] bg-[#FFF8EC] text-[#7A6A58] hover:bg-white"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                    <span className="ml-2 text-[11px] text-[#B09782]">({sortedLots.length} lots)</span>
                  </div>

                  {/* Auto-refresh indicator */}
                  <div className="flex items-center gap-2 text-xs text-[#7A6A58]">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Auto-refresh every 30s</span>
                  </div>
                </div>

                {/* Compact filter strip */}
                <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-[#E6DFD4] pt-3 text-xs text-[#7A6A58]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C7B67]">
                    Quick filters
                  </span>
                  <Badge className="rounded-full bg-[#E4F5E6] text-[#2E7D32]">FPO verified</Badge>
                  <Badge className="rounded-full bg-[#F1F7DB] text-[#5A6B09]">Organic</Badge>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[11px] text-[#B09782]">Min Bid</span>
                    <Slider defaultValue={[1000]} min={0} max={10000} step={500} className="w-32" />
                  </div>
                </div>
              </div>

              {/* Auction Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading && (
                  <div className="col-span-full text-sm text-muted-foreground">Loading auctions...</div>
                )}
                {isError && !isLoading && (
                  <div className="col-span-full text-sm text-red-500">Unable to load auctions. Please try again.</div>
                )}
                {!isLoading && !isError && sortedLots.map((lot) => (
                  <AuctionCard key={lot.id} lot={lot} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          className="h-14 rounded-full bg-[#2E7D32] text-white shadow-lg hover:bg-[#256428] px-6 gap-2"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">Create Lot</span>
        </Button>
      </div>
    </div>
  );
};

export default SellerMarketplace;
