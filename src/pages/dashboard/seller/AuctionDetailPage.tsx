import { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
import { useAuth } from "@/contexts/AuthContext";
import { simulateAuctionPayment, createShipmentForAuctionOrder, createLogisticsJob } from "@/lib/api";

import pearlMilletImage from "@/assets/product-pearl-millet.jpg";

const RAZORPAY_KEY_SECRET_DEV = "tXlUGsInbzuWWm532L4Vkd92";

async function generateRazorpaySignatureDev(paymentId: string, orderId: string): Promise<string> {
  if (!(window as any).crypto || !(window as any).crypto.subtle) {
    throw new Error("Web Crypto API not available for signature generation");
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(RAZORPAY_KEY_SECRET_DEV);
  const messageData = encoder.encode(`${orderId}|${paymentId}`);

  const cryptoKey = await (window as any).crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await (window as any).crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const signatureBytes = new Uint8Array(signatureBuffer);
  return Array.from(signatureBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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
  payment_status?: string | null;
  auction_order_id?: number | null;
}

interface SellerQrAndLogisticsProps {
  auctionId: number;
  auctionOrderId: number | null;
  lotQuantity: string;
  auctionLocation?: string;
  qrUrl: string | null;
  qrLoading: boolean;
  qrError: string | null;
  onGenerateQr: () => void;
  onQrUrlChange: (url: string | null) => void;
}

const SellerQrAndLogisticsSection = ({
  auctionId,
  auctionOrderId,
  lotQuantity,
  auctionLocation,
  qrUrl,
  qrLoading,
  qrError,
  onGenerateQr,
  onQrUrlChange,
}: SellerQrAndLogisticsProps) => {
  const [originAddress, setOriginAddress] = useState(auctionLocation ?? "");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [distanceKm, setDistanceKm] = useState<string>("");
  const [calculatedFee, setCalculatedFee] = useState<number | null>(null);
  const [logisticsBusy, setLogisticsBusy] = useState(false);
  const [logisticsError, setLogisticsError] = useState<string | null>(null);
  const [logisticsSuccess, setLogisticsSuccess] = useState<string | null>(null);

  const parseQuantity = () => {
    const numeric = parseFloat(String(lotQuantity).replace(/[^0-9.]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
  };

  const computeFee = () => {
    const qty = parseQuantity();
    const dist = parseFloat(distanceKm || "0");
    if (!dist || dist <= 0) return null;
    // Simple demo pricing: base + per-km + per-kg
    const base = 500; // base platform fee
    const perKm = 10;
    const perKg = 2;
    return Math.round(base + perKm * dist + perKg * qty);
  };

  const handlePreviewFee = () => {
    const fee = computeFee();
    setCalculatedFee(fee);
  };

  const handleSendToLogistics = async () => {
    if (!auctionOrderId) {
      setLogisticsError("Auction order id not available for logistics.");
      return;
    }
    setLogisticsError(null);
    setLogisticsSuccess(null);

    const fee = computeFee();
    if (!fee) {
      setLogisticsError("Please enter an approximate distance so we can calculate the logistics fee.");
      return;
    }
    if (!originAddress.trim() || !destinationAddress.trim()) {
      setLogisticsError("Origin and destination addresses are required.");
      return;
    }

    try {
      setLogisticsBusy(true);
      const shipment = await createShipmentForAuctionOrder(
        auctionOrderId,
        originAddress.trim(),
        destinationAddress.trim(),
      );

      const job = await createLogisticsJob(shipment.id, fee);
      setLogisticsSuccess(
        `Logistics job created with tracking ${shipment.tracking_number} and fee ₹${job.delivery_fee}. A transporter can now accept or reject this job.`,
      );
    } catch (err: any) {
      setLogisticsError(err.message || "Failed to send to logistics");
    } finally {
      setLogisticsBusy(false);
    }
  };

  return (
    <div className="mt-6 space-y-4 border-t pt-4">
      <h3 className="text-sm font-semibold text-[#1F2D3D]">Delivery Handshake & Logistics</h3>
      <p className="text-xs text-[#6a5e52]">
        First generate the shipping QR and share it with the winning buyer. Then, optionally send this lot to
        platform logistics with an auto-calculated fee based on lot size and distance.
      </p>

      <div className="flex items-start gap-4 flex-wrap">
        <div className="space-y-2">
          <button
            type="button"
            onClick={onGenerateQr}
            disabled={qrLoading}
            className="inline-flex items-center rounded-full bg-[#2E7D32] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#256428] disabled:opacity-60"
          >
            {qrLoading ? "Generating QR…" : "Generate Shipping QR"}
          </button>
          {qrError && <p className="text-xs text-red-600 max-w-xs">{qrError}</p>}
        </div>
        {qrUrl && (
          <div className="border rounded-xl p-2 bg-white shadow-sm flex flex-col items-center gap-2">
            <img src={qrUrl} alt="Delivery QR Code" className="h-32 w-32 object-contain" />
            <a
              href={qrUrl}
              download={`auction-${auctionId}-delivery-qr.png`}
              className="text-xs text-[#2E7D32] underline"
            >
              Download QR
            </a>
          </div>
        )}
      </div>

      <div className="mt-3 rounded-2xl border bg-[#FFF8EC] p-3 space-y-2 text-xs text-[#5B4D3B]">
        <p className="font-semibold">Send this lot to platform logistics</p>
        <p>
          Enter approximate pickup and drop addresses and distance. Our platform will suggest a logistics fee
          which transporters can accept or reject.
        </p>
        <div className="grid gap-2 md:grid-cols-2 mt-1">
          <div className="space-y-1">
            <label className="text-[11px] text-gray-700">Origin (pickup) address</label>
            <textarea
              className="w-full rounded-md border px-2 py-1 text-xs"
              rows={2}
              placeholder="Farmer warehouse / FPO collection center"
              value={originAddress}
              onChange={(e) => setOriginAddress(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-gray-700">Destination (buyer) address</label>
            <textarea
              className="w-full rounded-md border px-2 py-1 text-xs"
              rows={2}
              placeholder="Buyer delivery address shared after payment"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-gray-700">Approx. distance (km)</label>
            <input
              type="number"
              min={1}
              className="w-28 rounded-md border px-2 py-1 text-xs"
              placeholder="e.g. 250"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handlePreviewFee}
            className="inline-flex items-center rounded-full border border-[#B7741D] px-4 py-1.5 text-[11px] font-semibold text-[#B7741D] hover:bg-[#FFEFD5]"
          >
            Preview logistics fee
          </button>
          {calculatedFee && (
            <span className="text-xs font-semibold text-[#B7741D]">
              Suggested fee: ₹{calculatedFee.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSendToLogistics}
            disabled={logisticsBusy}
            className="inline-flex items-center rounded-full bg-[#2E7D32] px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-[#256428] disabled:opacity-60"
          >
            {logisticsBusy ? "Sending to logistics…" : "Send to logistics"}
          </button>
          {logisticsError && <span className="text-[11px] text-red-600 max-w-xs">{logisticsError}</span>}
          {logisticsSuccess && (
            <span className="text-[11px] text-[#1B5E20] max-w-xs">{logisticsSuccess}</span>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [bidEvents, setBidEvents] = useState<{ amount: number; timestamp: string }[]>([]);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const ledgerRef = useRef<HTMLDivElement | null>(null);

  const [showPaymentWindow, setShowPaymentWindow] = useState(false);
  const [paymentStage, setPaymentStage] = useState<"details" | "processing" | "success">("details");
  const [fakeMethod, setFakeMethod] = useState<"UPI" | "CARD">("UPI");
  const [fakeUpiId, setFakeUpiId] = useState("");
  const [fakeCardNumber, setFakeCardNumber] = useState("");
  const [fakeCardName, setFakeCardName] = useState("");
  const [fakeExpiry, setFakeExpiry] = useState("");
  const [fakeCvv, setFakeCvv] = useState("");
  const [shippingAddressNote, setShippingAddressNote] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [logisticsSent, setLogisticsSent] = useState(false);
  const [logisticsDetails, setLogisticsDetails] = useState<{
    trackingNumber: string;
    fee: number;
    source: string;
    destination: string;
  } | null>(null);
  const [paymentSummaryVisible, setPaymentSummaryVisible] = useState(false);
  const [showDevAdvanced, setShowDevAdvanced] = useState(false);
  const [devPaymentBusy, setDevPaymentBusy] = useState(false);
  const [devPaymentError, setDevPaymentError] = useState<string | null>(null);
  const [showDevDeliveryModal, setShowDevDeliveryModal] = useState(false);
  const [devQrPreview, setDevQrPreview] = useState<string | null>(null);
  const [devDeliveryStatus, setDevDeliveryStatus] = useState<"idle" | "processing" | "success">("idle");
  const [devDeliveryMessage, setDevDeliveryMessage] = useState<string | null>(null);
  const [buyerQrFile, setBuyerQrFile] = useState<File | null>(null);
  const [buyerQrPreview, setBuyerQrPreview] = useState<string | null>(null);
  const [buyerDeliveryStatus, setBuyerDeliveryStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [buyerDeliveryMessage, setBuyerDeliveryMessage] = useState<string | null>(null);

  const handleBuyerQrChange = (e: any) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setBuyerQrFile(file);
    const url = URL.createObjectURL(file);
    setBuyerQrPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    // Simulate QR processing and successful delivery confirmation
    setBuyerDeliveryStatus("processing");
    setBuyerDeliveryMessage("Scanning QR code and verifying delivery on ledger…");

    setTimeout(() => {
      setBuyerDeliveryStatus("success");
      setBuyerDeliveryMessage(
        "Delivery confirmed. Escrow funds are being released to the seller and the event is recorded on the blockchain (simulated).",
      );
    }, 1500);
  };

  const {
    data: auction,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auction", auctionId],
    enabled: !isNaN(auctionId),
    queryFn: () => fetchAuctionById(auctionId),
  });

  const handleGenerateQr = async () => {
    if (!auctionId) return;
    setQrLoading(true);
    setQrError(null);

    try {
      const res = await fetch(`${API_BASE}/auctions/${auctionId}/shipping-label`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to generate shipping label");
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setQrUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
    } catch (err: any) {
      setQrError(err.message || "Unable to generate QR code");
    } finally {
      setQrLoading(false);
    }
  };

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

          if (msg.type === "bid_update" && msg.data?.current_highest_bid) {
            const amountRaw = msg.data.current_highest_bid;
            const tsRaw = msg.data.last_bid_timestamp;
            const amount = typeof amountRaw === "string" ? parseFloat(amountRaw) : Number(amountRaw) || 0;
            const timestamp = typeof tsRaw === "string" && tsRaw ? tsRaw : new Date().toISOString();

            if (!Number.isNaN(amount) && amount > 0) {
              setBidEvents((prev) => {
                const last = prev[0];
                if (last && last.amount === amount && last.timestamp === timestamp) {
                  // Same event already recorded – avoid duplicate row
                  return prev;
                }
                return [{ amount, timestamp }, ...prev].slice(0, 50);
              });
            }
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

  const isSellerOfAuction = useMemo(() => {
    if (!auction || !user) return false;
    return user.id === auction.seller_id;
  }, [auction, user]);

  const isWinnerBuyer = useMemo(() => {
    if (!auction || !user) return false;
    return auction.winner_id === user.id && !isSellerOfAuction;
  }, [auction, user, isSellerOfAuction]);

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

  const paymentMutation = useMutation({
    mutationFn: async () => {
      if (!auction?.auction_order_id) {
        throw new Error("Auction order id not available");
      }
      return simulateAuctionPayment(auction.auction_order_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
      setPaymentStage("success");
      setPaymentSummaryVisible(true);
      setActiveTab("ledger");
      // Scroll to ledger section after a short delay so layout has updated
      setTimeout(() => {
        ledgerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    },
  });

  const finalizeAuctionMutation = useMutation({
    mutationFn: async () => {
      if (!auction) throw new Error("Auction not loaded");
      const res = await fetch(`${API_BASE}/auctions/${auction.id}/finalize`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to finalize auction");
      }
      // We intentionally do NOT manually refetch here.
      // The backend should broadcast on the auction WebSocket,
      // which will invalidate queries and refresh the UI.
      // Simulate sending to logistics
      const handleSendToLogistics = () => {
        // Generate fake logistics details
        const fakeLogistics = {
          trackingNumber: `TRK-${Date.now().toString().slice(-8)}`,
          fee: Math.floor(Math.random() * 500) + 500, // Random fee between 500-1000
          source: auction?.miscellaneous_data?.location || "Seller's Location",
          destination: shippingAddressNote || "Buyer's Location",
        };

        setLogisticsDetails(fakeLogistics);
        setLogisticsSent(true);

        // In a real app, you would call your logistics API here
        // await createLogisticsJob(auctionId, fakeLogistics);
      };

      // Simulate payment confirmation (in a real app, this would be from your payment processor)
      const handleConfirmPayment = async () => {
        if (!auction || !auction.auction_order_id) {
          setDevPaymentError("Auction order id not available");
          return;
        }

        setDevPaymentError(null);
        try {
          setDevPaymentBusy(true);
          const mockPaymentId = `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`;
          const mockOrderId = `order_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`;
          const signature = await generateRazorpaySignatureDev(mockPaymentId, mockOrderId);

          const res = await fetch(`${API_BASE}/payment/auction-success`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              auction_order_id: auction.auction_order_id,
              razorpay_payment_id: mockPaymentId,
              razorpay_order_id: mockOrderId,
              razorpay_signature: signature,
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to confirm payment via signature");
          }

          await queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
          setPaymentSummaryVisible(true);
          setActiveTab("ledger");
          setTimeout(() => {
            ledgerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        } catch (err: any) {
          setDevPaymentError(err.message || "Unable to confirm payment via signature");
        } finally {
          setDevPaymentBusy(false);
        }
      };

      return res.json().catch(() => undefined);
    },
  });

  const handleDevConfirmPayment = async () => {
    if (!auction || !auction.auction_order_id) {
      setDevPaymentError("Auction order id not available");
      return;
    }

    setDevPaymentError(null);
    try {
      setDevPaymentBusy(true);
      const mockPaymentId = `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`;
      const mockOrderId = `order_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`;
      const signature = await generateRazorpaySignatureDev(mockPaymentId, mockOrderId);

      const res = await fetch(`${API_BASE}/payment/auction-success`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          auction_order_id: auction.auction_order_id,
          razorpay_payment_id: mockPaymentId,
          razorpay_order_id: mockOrderId,
          razorpay_signature: signature,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to confirm payment via signature");
      }

      await queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
      setPaymentSummaryVisible(true);
      setActiveTab("ledger");
      setTimeout(() => {
        ledgerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err: any) {
      setDevPaymentError(err.message || "Unable to confirm payment via signature");
    } finally {
      setDevPaymentBusy(false);
    }
  };

  const handleDevConfirmDelivery = async () => {
    // Dev tool now runs entirely on the frontend: after QR upload, always show
    // a successful delivery confirmation message.
    setDevDeliveryStatus("processing");
    setDevDeliveryMessage("Scanning uploaded QR and confirming delivery (simulated)…");

    setTimeout(() => {
      setDevDeliveryStatus("success");
      setDevDeliveryMessage(
        "Delivery confirmed (dev). Funds are considered released to the seller and a notification would be sent (simulated).",
      );
    }, 1200);
  };

  const handleDevQrUploadChange = (e: any) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const url = URL.createObjectURL(file);
    setDevQrPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    // Kick off simulated confirmation
    handleDevConfirmDelivery();
  };

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
                  <BidHistory auctionId={auction.id} bidEvents={bidEvents} />
                </>
              )}

              {lot.status !== "LIVE" && (
                <p className="text-sm text-gray-600 mt-4">
                  Auction is <strong>{lot.status}</strong>, bidding is closed.
                </p>
              )}

              {/* Seller-only: manually finalize auction (POST /auctions/{id}/finalize) */}
              {isSellerOfAuction && lot.status !== "LIVE" && (
                <div className="mt-4 border-t pt-3 space-y-2 text-xs">
                  <p className="font-semibold text-[#1F2D3D]">Finalize Auction</p>
                  <p className="text-gray-600">
                    Once you are sure bidding has ended, finalize the auction to lock in the winning bid
                    and trigger downstream flows (payment, logistics, ledger).
                  </p>
                  <button
                    type="button"
                    onClick={() => finalizeAuctionMutation.mutate()}
                    disabled={finalizeAuctionMutation.isPending}
                    className="inline-flex items-center rounded-full bg-[#111827] px-4 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
                  >
                    {finalizeAuctionMutation.isPending ? "Finalizing…" : "Finalize auction now"}
                  </button>
                  {finalizeAuctionMutation.isError && (
                    <p className="text-[11px] text-red-600">
                      {(finalizeAuctionMutation.error as Error)?.message || "Failed to finalize auction"}
                    </p>
                  )}
                </div>
              )}

              {/* Buyer Payment (DEV simulate) */}
              {lot.status === "CLOSED" && isWinnerBuyer && (
                <div className="mt-4 border-t pt-4 space-y-2">
                  <p className="text-sm font-semibold text-[#1F2D3D]">
                    Payment Status
                  </p>
                  <p className="text-xs text-gray-600">
                    {auction?.payment_status === "PAID"
                      ? "Payment completed. You can proceed to pickup and scan the seller's QR to confirm delivery."
                      : "Payment pending. Complete the secure payment window to mark this auction order as paid."}
                  </p>

                  {auction?.payment_status !== "PAID" && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentWindow(true);
                        setPaymentStage("details");
                      }}
                      disabled={paymentMutation.isPending}
                      className="inline-flex items-center rounded-full bg-[#2E7D32] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#256428] disabled:opacity-60"
                    >
                      {paymentMutation.isPending ? "Processing…" : "Proceed to Pay"}
                    </button>
                  )}

                  <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 text-[11px] text-gray-700 space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowDevAdvanced((prev) => !prev)}
                      className="text-[11px] font-semibold text-[#1D4ED8] underline"
                    >
                      {showDevAdvanced ? "Hide dev advanced tools" : "Show dev advanced tools"}
                    </button>
                    {showDevAdvanced && (
                      <div className="space-y-2">
                        <p>
                          These tools mirror the Python escrow test: one path calls
                          <span className="font-semibold"> /payment/auction-success</span> with a generated
                          Razorpay-style signature, and another lets you paste a delivery token JSON for
                          <span className="font-semibold"> /auctions/{"{"}id{"}"}/confirm-delivery</span>.
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleDevConfirmPayment}
                            disabled={devPaymentBusy}
                            className="inline-flex items-center rounded-full bg-[#111827] px-3 py-1 text-[11px] font-semibold text-white hover:bg-black disabled:opacity-60"
                          >
                            {devPaymentBusy
                              ? "Confirming via signature…"
                              : "Dev: Confirm payment via /payment/auction-success"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowDevDeliveryModal(true);
                              setDevDeliveryStatus("idle");
                              setDevDeliveryMessage(null);
                              setDevQrPreview(null);
                            }}
                            className="inline-flex items-center rounded-full border border-gray-400 px-3 py-1 text-[11px] font-semibold text-gray-800 hover:bg-white"
                          >
                            Dev: Upload QR & confirm delivery (simulated)
                          </button>
                        </div>
                        {devPaymentError && <p className="text-[11px] text-red-600">{devPaymentError}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Seller QR for delivery handshake + logistics send */}
              {lot.status === "CLOSED" && isSellerOfAuction && auction?.winner_id && auction?.payment_status === "PAID" && (
                <SellerQrAndLogisticsSection
                  auctionId={auction.id}
                  auctionOrderId={auction.auction_order_id ?? null}
                  lotQuantity={lot.quantity}
                  auctionLocation={auction.miscellaneous_data?.location}
                  qrUrl={qrUrl}
                  qrLoading={qrLoading}
                  qrError={qrError}
                  onGenerateQr={handleGenerateQr}
                  onQrUrlChange={setQrUrl}
                />
              )}
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="rounded-full p-1 border bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trace">Traceability</TabsTrigger>
            <TabsTrigger value="docs">Documents</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
          </TabsList>

          {/* Ledger Tab */}
          <TabsContent value="ledger" className="mt-10" ref={ledgerRef}>
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

        {showDevDeliveryModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 text-xs text-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Dev Tool</p>
                  <p className="text-sm font-semibold">Upload QR & confirm delivery (simulated)</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowDevDeliveryModal(false);
                    if (devQrPreview) URL.revokeObjectURL(devQrPreview);
                    setDevQrPreview(null);
                    setDevDeliveryStatus("idle");
                    setDevDeliveryMessage(null);
                  }}
                  className="text-[11px] text-gray-500 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
              <p className="text-[11px] text-gray-600">
                This dev flow skips token JSON and directly simulates a successful delivery confirmation once you
                upload a QR image. In production, the buyer-facing QR scan would call the real /confirm-delivery
                endpoint.
              </p>
              <label className="mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E5E7EB] rounded-lg cursor-pointer bg-[#F9FAFB] hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                  <span className="mb-1 text-xs font-semibold text-gray-700">
                    {devQrPreview ? "QR uploaded (dev)" : "Click to upload QR image"}
                  </span>
                  <span className="text-[11px] text-gray-500">Image input only · simulated scan</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDevQrUploadChange}
                />
              </label>
              {devQrPreview && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={devQrPreview}
                    alt="Dev QR preview"
                    className="h-16 w-16 rounded border object-contain bg-white"
                  />
                  <button
                    type="button"
                    className="text-[11px] text-red-600 hover:text-red-800"
                    onClick={() => {
                      if (devQrPreview) URL.revokeObjectURL(devQrPreview);
                      setDevQrPreview(null);
                      setDevDeliveryStatus("idle");
                      setDevDeliveryMessage(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
              {devDeliveryMessage && (
                <p
                  className={`mt-2 text-[11px] ${
                    devDeliveryStatus === "success" ? "text-[#1B5E20]" : "text-[#B7741D]"
                  }`}
                >
                  {devDeliveryMessage}
                </p>
              )}
            </div>
          </div>
        )}
        {showPaymentWindow && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-xs text-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#1F2D3D]">Simulated payment window</p>
                <button
                  type="button"
                  className="text-[11px] text-gray-500 hover:text-gray-800"
                  onClick={() => {
                    setShowPaymentWindow(false);
                    setPaymentStage("details");
                  }}
                >
                  Close
                </button>
              </div>

              {paymentStage === "details" && (
                <div className="space-y-3">
                  <p className="text-[11px] text-gray-600">
                    This mimics a Razorpay-style checkout but calls the backend dev endpoint
                    <span className="font-mono"> /payment/dev/simulate-payment</span> when you click Pay.
                  </p>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setFakeMethod("UPI")}
                      className={`flex-1 rounded-full border px-3 py-1 font-semibold ${
                        fakeMethod === "UPI"
                          ? "border-[#2E7D32] text-[#2E7D32] bg-[#E4F5E6]"
                          : "border-gray-300 text-gray-700 bg-white"
                      }`}
                    >
                      UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setFakeMethod("CARD")}
                      className={`flex-1 rounded-full border px-3 py-1 font-semibold ${
                        fakeMethod === "CARD"
                          ? "border-[#2E7D32] text-[#2E7D32] bg-[#E4F5E6]"
                          : "border-gray-300 text-gray-700 bg-white"
                      }`}
                    >
                      Card
                    </button>
                  </div>

                  {fakeMethod === "UPI" ? (
                    <div className="space-y-1">
                      <label className="text-[11px] text-gray-700">UPI ID</label>
                      <input
                        type="text"
                        className="w-full rounded-md border px-3 py-1 text-xs"
                        placeholder="name@upi"
                        value={fakeUpiId}
                        onChange={(e) => setFakeUpiId(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[11px] text-gray-700">Card number</label>
                        <input
                          type="text"
                          className="w-full rounded-md border px-3 py-1 text-xs"
                          placeholder="4111 1111 1111 1111"
                          value={fakeCardNumber}
                          onChange={(e) => setFakeCardNumber(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <label className="text-[11px] text-gray-700">Name on card</label>
                          <input
                            type="text"
                            className="w-full rounded-md border px-3 py-1 text-xs"
                            value={fakeCardName}
                            onChange={(e) => setFakeCardName(e.target.value)}
                          />
                        </div>
                        <div className="w-20 space-y-1">
                          <label className="text-[11px] text-gray-700">Expiry</label>
                          <input
                            type="text"
                            className="w-full rounded-md border px-2 py-1 text-xs"
                            placeholder="12/28"
                            value={fakeExpiry}
                            onChange={(e) => setFakeExpiry(e.target.value)}
                          />
                        </div>
                        <div className="w-16 space-y-1">
                          <label className="text-[11px] text-gray-700">CVV</label>
                          <input
                            type="password"
                            className="w-full rounded-md border px-2 py-1 text-xs"
                            value={fakeCvv}
                            onChange={(e) => setFakeCvv(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentStage("processing");
                      paymentMutation.mutate();
                    }}
                    disabled={paymentMutation.isPending}
                    className="mt-2 inline-flex items-center justify-center rounded-full bg-[#2E7D32] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#256428] disabled:opacity-60 w-full"
                  >
                    {paymentMutation.isPending ? "Processing payment…" : "Pay & simulate success"}
                  </button>
                </div>
              )}

              {paymentStage === "processing" && (
                <p className="text-[11px] text-gray-700">
                  Verifying payment with dev endpoint and updating auction order status…
                </p>
              )}

              {paymentStage === "success" && (
                <div className="space-y-2 text-[11px] text-[#1B5E20]">
                  <p className="font-semibold">Payment simulated successfully.</p>
                  <p>
                    The backend dev endpoint has marked this auction order as PAID and recorded the event on the
                    ledger. You can now close this window and proceed to delivery QR.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPaymentWindow(false)}
                    className="mt-1 inline-flex items-center justify-center rounded-full bg-[#2E7D32] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#256428] w-full"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuctionDetailPage;
