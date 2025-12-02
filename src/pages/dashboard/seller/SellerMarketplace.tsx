import { Navigation } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/seller/button";
import { Input } from "@/components/ui/seller/input";
import { Badge } from "@/components/ui/seller/badge";
import { Slider } from "@/components/ui/seller/slider";
import { Plus, RefreshCw } from "lucide-react";
import { AuctionCard, AuctionFilterPanel, SellerTools } from "@/components/seller/AuctionComponents";
import { AuctionLot } from "@/components/seller/auctionData";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuctions, fetchMyAuctions, AuctionDetail, AuctionWithBids } from "@/lib/api";

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
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="container px-4 py-6 md:px-6 lg:px-8">
                {/* Main Content Layout */}
                <div className="flex flex-col gap-6">

                    {/* Header & Tools Section (Replacing Hero & Awareness Strip) */}
                    <section className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold text-[#1F2D3D]">Auction Marketplace</h1>
                            <p className="text-[#7A6A58]">Bid or create lots — connecting farmers, startups & bulk buyers</p>
                        </div>

                        {/* Seller Tools Row */}
                        <SellerTools />
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
                                        {["All Lots", "Live", "Upcoming", "Closed", "My Bids"].map((cat, index) => {
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
                                                    className={`btn-ripple rounded-full border px-3 py-1 ${isActive
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
