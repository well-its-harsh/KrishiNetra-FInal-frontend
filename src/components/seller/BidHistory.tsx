interface BidRecord {
  amount: number;
  timestamp: string;
}

export const BidHistory = ({
  auctionId,
  bidEvents,
}: {
  auctionId: number;
  bidEvents: BidRecord[];
}) => {
  if (!bidEvents || bidEvents.length === 0) {
    return <p className="text-sm text-gray-500">No bids placed yet.</p>;
  }

  // bidEvents are already pushed with latest first from WebSocket
  const bids = bidEvents;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[#1F2D3D] mb-1">Recent Bids</h3>
      {bids.map((b, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium">Bid placed</span>
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
