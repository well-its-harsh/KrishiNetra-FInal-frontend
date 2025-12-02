import { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "@/config/api";

import { Navigation } from "@/components/navigation/Navigation";
import { Badge } from "@/components/ui/seller/badge";
import { Separator } from "@/components/ui/seller/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/seller/tabs";
import { Card, CardContent } from "@/components/ui/seller/card";
import { AuctionCard } from "@/components/seller/AuctionComponents";
import { BidInterface } from "@/components/seller/BidInterface";
import { BidHistory } from "@/components/seller/BidHistory";
import { AUCTION_LOTS } from "@/components/seller/auctionData";
import { useAuctionLedger } from "@/hooks/useAuctionLedger";
import { LedgerTimeline } from "@/components/auction/LedgerTimeline";

import pearlMilletImage from "@/assets/product-pearl-millet.jpg";

interface AuctionWithBids {
  id: number;
  name: string;
  quantity: number | string;
  current_highest_bid: number | string | null;
  final_price: number | string | null;
  base_price: number | string;
  start_time: string;
  end_time: string;
  winner_id: number | null;
  seller_id: number;
  images?: string[];
  thumbnail?: string;
  miscellaneous_data?: any;
}

const fetchAuctionById = async (id: number): Promise<AuctionWithBids> => {
  const res = await fetch(`${API_BASE}/auctions/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Auction not found");
  return res.json();
};

const AuctionDetailPage = () => {
  const { id } = useParams();
  const auctionId = Number(id);
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const {
    data: auction,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auction", auctionId],
    enabled: !isNaN(auctionId),
    queryFn: () => fetchAuctionById(auctionId),
  });

  // 🔥 WebSocket — live invalidation of queries (no cookie hacks)
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!auctionId) return;

    let reconnectTimeout: number | null = null;

    const connect = () => {
      const wsUrl = `${API_BASE.replace(/^http/, "ws")}/auctions/ws/${auctionId}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "update" || msg.type === "initial_status") {
            queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
            queryClient.invalidateQueries({ queryKey: ["bids", auctionId] });
          }
        } catch {
          // ignore bad messages
        }
      };

      ws.onclose = () => {
        // simple retry
        reconnectTimeout = window.setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        // let onclose handle reconnect
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) window.clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, [auctionId, queryClient]);

  // 🔥 Blockchain Ledger
  const {
    blocks: ledger,
    loading: ledgerLoading,
    error: ledgerError,
  } = useAuctionLedger(auctionId);

  // 🔥 Compute lot + numeric currentBid
  const lot = useMemo(() => {
    if (!auction) return null;

    const now = new Date();
    const start = new Date(auction.start_time);
    const end = new Date(auction.end_time);

    const rawBid =
      auction.current_highest_bid ?? auction.final_price ?? auction.base_price;

    let currentBid = 0;
    if (typeof rawBid === "string") currentBid = parseFloat(rawBid);
    else if (typeof rawBid === "number") currentBid = rawBid || 0;

    let status: "UPCOMING" | "LIVE" | "CLOSED" = "CLOSED";
    if (now < start) status = "UPCOMING";
    else if (now >= start && now <= end && !auction.winner_id) status = "LIVE";

    return {
      id: auction.id,
      name: auction.name,
      quantity: `${auction.quantity} kg`,
      currentBid,
      status,
      grainType: auction.miscellaneous_data?.grainType ?? "Millet",
      location: auction.miscellaneous_data?.location ?? "India",
      certification: auction.miscellaneous_data?.certification ?? [],
      end_time: auction.end_time,
    };
  }, [auction]);

  // 🔥 Live countdown timer
  useEffect(() => {
    if (!lot) return;

    const end = new Date(lot.end_time);

    const update = () => {
      const now = new Date();
      const diff = Math.floor((end.getTime() - now.getTime()) / 1000);
      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    };

    update();
    const idInterval = window.setInterval(update, 1000);
    return () => window.clearInterval(idInterval);
  }, [lot?.end_time]);

  const images =
    auction?.images?.length && auction.images.length > 0
      ? auction.images.map((i) => `${API_BASE}${i}`)
      : [pearlMilletImage];

  // =======================
  // ⏳ Load & Error fallback
  // =======================
  if (isLoading || !lot) {
    return (
      <div className="min-h-screen bg-[#F7F1E5]">
        <Navigation />
        <main className="container px-4 py-10">
          <p className="text-sm">Loading auction details…</p>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F7F1E5]">
        <Navigation />
        <main className="container px-4 py-10">
          <p className="text-sm text-red-600">Failed to load auction. Try again later.</p>
        </main>
      </div>
    );
  }

  // =======================
  // 🎯 MAIN UI
  // =======================
  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <Navigation />
      <main className="container px-4 py-10">
        {/* IMAGE + BID SECTION */}
        <section className="grid gap-10 lg:grid-cols-2 bg-white rounded-3xl p-6 shadow-xl border">
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-2xl border shadow">
              <img src={images[selectedImage]} alt="" className="w-full object-cover" />
              <Badge className="absolute top-3 left-3 bg-[#2E7D32] text-white">
                {lot.status}
              </Badge>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square w-20 rounded-xl overflow-hidden border ${
                    selectedImage === i ? "border-[#2E7D32] shadow" : "border-transparent"
                  }`}
                >
                  <img src={img} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* BID COLUMN */}
          <div className="space-y-7">
            <h1 className="text-3xl font-semibold">{lot.name}</h1>

            <div className="rounded-2xl border p-6 bg-white space-y-4">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-[#6a5e52] uppercase">Current Highest Bid</p>
                  <span className="text-4xl font-bold text-[#2E7D32]">
                    ₹{lot.currentBid.toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">for {lot.quantity}</p>
                </div>
                <div className="bg-[#FFF8EC] px-4 py-2 rounded-full border text-[#B7741D] font-medium flex items-center">
                  ⏳ {timeLeft || "Calculating…"}
                </div>
              </div>

              {lot.status === "LIVE" && (
                <>
                  <Separator />
                  <BidInterface
                    auctionId={auction.id}
                    currentBid={lot.currentBid}
                    minIncrement={500}
                  />
                  <Separator />
                  <BidHistory auctionId={auction.id} />
                </>
              )}

              {lot.status !== "LIVE" && (
                <p className="text-sm text-gray-600 mt-4">
                  Auction is <strong>{lot.status}</strong>, bidding is closed.
                </p>
              )}
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* TABS */}
        <Tabs defaultValue="overview">
          <TabsList className="rounded-full p-1 border bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trace">Traceability</TabsTrigger>
            <TabsTrigger value="docs">Documents</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
          </TabsList>

          {/* Ledger Tab */}
          <TabsContent value="ledger" className="mt-10">
            <Card className="rounded-3xl shadow-xl border bg-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-5">Blockchain Ledger</h2>
                {ledgerLoading && <p>Loading ledger records…</p>}
                {ledgerError && <p className="text-red-600">{ledgerError}</p>}
                {!ledgerLoading && <LedgerTimeline blocks={ledger || []} />}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs (overview / trace / docs / reviews) – keep your existing content here */}
        </Tabs>

        <Separator className="my-12" />

        {/* Other Auctions */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Other Live Auctions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {AUCTION_LOTS.slice(0, 4).map((item) => (
              <AuctionCard key={item.id} lot={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AuctionDetailPage;
