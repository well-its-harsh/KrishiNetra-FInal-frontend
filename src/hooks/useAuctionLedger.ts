import { useEffect, useState } from "react";
import { API_BASE } from "@/config/api";

export interface BlockRecord {
  id: number;
  timestamp: string;
  auction_id: number;
  action: string;
  data?: any;              // backend uses this key
  details: string;
        // fallback for older schema
  previous_hash: string;
  hash: string;
}

export const useAuctionLedger = (auctionId: number) => {
  const [blocks, setBlocks] = useState<BlockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auctionId) return;

    setLoading(true);
    setError(null);

   fetch(`${API_BASE}/blockchain/${auctionId}/history`, {  // Added comma here
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load blockchain records");
        return res.json();
      })
      .then((json) => {
        // backend returns { blocks: [...] }
        const arr = Array.isArray(json) ? json : json.blocks;
        setBlocks(arr ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [auctionId]);

  return { blocks, loading, error };
};
