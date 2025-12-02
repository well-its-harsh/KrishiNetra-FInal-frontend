import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/config/api";

interface BidRecord {
  amount: number;
  user_id?: number;
  user_name?: string;
  timestamp: string;
}

export const BidHistory = ({ auctionId }: { auctionId: number }) => {
  const { data, isLoading, isError } = useQuery<BidRecord[]>({
    queryKey: ["bids", auctionId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/auctions/${auctionId}/bids`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch bids");
      return res.json();
    },
    refetchInterval: 2000, // poll in case WS fails
  });

  if (isLoading) return <p className="text-sm text-gray-500">Loading bids…</p>;
  if (isError) return <p className="text-sm text-red-600">Failed to load bids.</p>;
  if (!data || data.length === 0)
    return <p className="text-sm text-gray-500">No bids placed yet.</p>;

  // assuming backend returns oldest → newest, reverse to show latest on top
  const bids = [...data].reverse();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[#1F2D3D] mb-1">Recent Bids</h3>
      {bids.map((b, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {b.user_name || `Bidder #${b.user_id ?? "?"}`}
            </span>
            <span className="text-[11px] text-gray-500">
              {new Date(b.timestamp).toLocaleString()}
            </span>
          </div>
          <span className="text-sm font-semibold text-[#2E7D32]">
            ₹{b.amount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};
