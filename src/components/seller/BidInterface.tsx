import { useEffect, useState } from "react";
import { Button } from "@/components/ui/seller/button";
import { API_BASE } from "@/config/api";
import { useQueryClient } from "@tanstack/react-query";

interface BidInterfaceProps {
  auctionId: number;
  currentBid: number;
  minIncrement: number;
}

export const BidInterface = ({
  auctionId,
  currentBid,
  minIncrement,
}: BidInterfaceProps) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState(currentBid + minIncrement);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Whenever currentBid changes (because someone else bid), bump minimum
  useEffect(() => {
    setAmount(currentBid + minIncrement);
  }, [currentBid, minIncrement]);

  const placeBid = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auctions/${auctionId}/bid`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) {
        let msg = "Bid rejected";
        try {
          const data = await res.json();
          msg = data.detail || msg;
        } catch {
          // ignore parse error
        }
        setError(msg);
        return;
      }

      // Refresh auction + bids
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
      queryClient.invalidateQueries({ queryKey: ["bids", auctionId] });
    } catch (e) {
      setError("Bid failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const minAllowed = currentBid + minIncrement;

  const handleChange = (value: string) => {
    const num = Number(value);
    if (Number.isNaN(num)) return;
    setAmount(Math.max(minAllowed, num));
  };

  const increase = (step: number) => {
    setAmount((prev) => Math.max(minAllowed, prev + step));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Minimum next bid:{" "}
        <strong>₹{minAllowed.toLocaleString()}</strong>
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <input
          type="number"
          className="border rounded-lg p-3 text-lg font-semibold w-full"
          value={amount}
          min={minAllowed}
          onChange={(e) => handleChange(e.target.value)}
        />

        <Button
          onClick={placeBid}
          disabled={loading || amount < minAllowed}
          className="bg-[#2E7D32] text-white px-6 py-3 rounded-xl"
        >
          {loading ? "Placing..." : "Place Bid"}
        </Button>
      </div>

      {/* Quick Increment Buttons */}
      <div className="flex gap-2 flex-wrap">
        {[500, 1000, 2500, 5000].map((step) => (
          <Button
            key={step}
            type="button"
            variant="outline"
            className="rounded-full text-sm"
            onClick={() => increase(step)}
          >
            +₹{step}
          </Button>
        ))}
      </div>
    </div>
  );
};
