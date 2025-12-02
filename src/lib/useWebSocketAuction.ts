import { useEffect } from "react";

export const useWebSocketAuction = (
  auctionId: number,
  onMessage: (data: any) => void
) => {
  useEffect(() => {
    if (!auctionId) return;

    const ws = new WebSocket(
      `${import.meta.env.VITE_API_BASE_URL.replace("http", "ws")}/auctions/ws/${auctionId}`
    );

    ws.onopen = () => console.log("WS connected:", auctionId);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        onMessage(msg);
      } catch (_) {}
    };
    ws.onerror = (e) => console.log("WS error:", e);
    ws.onclose = () => console.log("WS closed:", auctionId);

    return () => ws.close();
  }, [auctionId, onMessage]);
};
