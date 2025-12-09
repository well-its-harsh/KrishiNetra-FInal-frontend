import { useState } from "react";
import { ShieldCheck, CheckCircle2, Clock, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/seller/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/seller/dialog";
import { Button } from "@/components/ui/seller/button";

export interface LedgerBlock {
  id: number;
  timestamp: string;
  auction_id: number;
  action: string;
  details: string;
  previous_hash: string;
  hash: string;
}

function getFriendlyTitle(action: string): string {
  switch (action) {
    case "AUCTION_CREATED":
      return "Proof of Auction Creation";
    case "BID_PLACED":
      return "Bid Placed";
    case "AUCTION_FINALIZED":
      return "Proof of Finalization  Winner Verified";
    case "DELIVERY_CONFIRMED":
      return "Proof of Delivery Confirmation";
    default:
      return action.replace(/_/g, " ");
  }
}

function getFriendlyDescription(action: string): string {
  switch (action) {
    case "AUCTION_CREATED":
      return "This record proves when and how the auction was first created.";
    case "BID_PLACED":
      return "This record proves that a verified bidder placed a bid on this auction.";
    case "AUCTION_FINALIZED":
      return "This record proves that the auction ended and a winner was confirmed.";
    case "DELIVERY_CONFIRMED":
      return "This record proves that the buyer and seller confirmed delivery of the lot.";
    default:
      return "This record is part of the permanent history of this auction on the blockchain.";
  }
}

export const LedgerTimeline = ({ blocks }: { blocks: LedgerBlock[] }) => {
  const [active, setActive] = useState<LedgerBlock | null>(null);

  if (!blocks?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No blockchain records yet  ledger will appear once on-chain events are
        created for this auction.
      </p>
    );
  }

  return (
    <>
      <div className="relative space-y-6 pl-6">
        {/* Vertical track */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-400/60 via-amber-300/40 to-transparent" />

        {blocks.map((b, index) => {
          let parsedDetails: any = {};
          try {
            parsedDetails = b.details ? JSON.parse(b.details) : {};
          } catch {
            parsedDetails = {};
          }

          const Icon =
            b.action === "AUCTION_FINALIZED"
              ? ShieldCheck
              : b.action === "DELIVERY_CONFIRMED"
              ? CheckCircle2
              : Clock;

          const actorRole =
            parsedDetails.actor_role ||
            parsedDetails.actor_type ||
            parsedDetails.role ||
            "System";

          const actorLabel =
            actorRole === "SELLER"
              ? "Seller"
              : actorRole === "BIDDER"
              ? "Bidder"
              : "System";

          const txHash = parsedDetails.tx_hash || b.hash;
          const shortHash = txHash
            ? `${txHash.slice(0, 10)}		...		${txHash.slice(-6)}`
            : "Unknown";

          const network =
            parsedDetails.network || parsedDetails.chain || "Blockchain Network";
          const blockNumber =
            parsedDetails.block_number || parsedDetails.blockHeight || "-";

          return (
            <div
              key={b.id}
              className="relative flex gap-4 group"
            >
              {/* Node */}
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(34,197,94,0.35)] group-hover:shadow-[0_0_0_6px_rgba(34,197,94,0.55)] transition-shadow" />
                  {index === 0 && (
                    <span className="absolute -top-5 text-[10px] font-semibold text-emerald-700">
                      Newest
                    </span>
                  )}
                </div>
              </div>

              {/* Card */}
              <Card className="flex-1 rounded-2xl border border-[#E6DFD4] bg-white/95 shadow-sm group-hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-5 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4F5E6] text-[#2E7D32]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#1F2D3D]">
                          {getFriendlyTitle(b.action)}
                        </p>
                        <p className="text-[11px] text-[#8C7B67]">
                          {new Date(b.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#FFF8EC] px-2 py-0.5 text-[10px] font-medium text-[#7A5C2E]">
                      {actorLabel}
                    </span>
                  </div>

                  {/* Summary row */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6a5e52]">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 border border-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                      {network}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[#7A5C2E] border border-amber-100">
                      Block #{blockNumber}
                    </span>
                    {txHash && (
                      <button
                        type="button"
                        onClick={() => setActive(b)}
                        className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        View proof
                      </button>
                    )}
                  </div>

                  {/* Short hash */}
                  {txHash && (
                    <p className="text-[11px] text-[#866e5a]">
                      Transaction: <span className="font-mono">{shortHash}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="sm:max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">
                  {getFriendlyTitle(active.action)}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {getFriendlyDescription(active.action)}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3 space-y-3 text-xs text-[#4A3F33]">
                <p>
                  <strong>Timestamp:</strong> {" "}
                  {new Date(active.timestamp).toLocaleString()}
                </p>
                <p className="break-all font-mono text-[11px]">
                  <strong>Transaction Hash:</strong> {" "}
                  {(() => {
                    let parsed: any = {};
                    try {
                      parsed = active.details ? JSON.parse(active.details) : {};
                    } catch {
                      parsed = {};
                    }
                    return parsed.tx_hash || active.hash;
                  })()}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    className="h-7 text-[11px] px-2 flex items-center gap-1"
                    onClick={() => {
                      let parsed: any = {};
                      try {
                        parsed = active.details ? JSON.parse(active.details) : {};
                      } catch {
                        parsed = {};
                      }
                      const fullHash = parsed.tx_hash || active.hash;
                      if (fullHash && navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(fullHash).catch(() => {});
                      }
                    }}
                  >
                    <Copy className="h-3 w-3" />
                    Copy Transaction Hash
                  </Button>
                </div>

                <div className="mt-2 rounded-md bg-[#FFF8EC] p-3 text-[11px] text-[#6a5e52]">
                  <p className="font-semibold mb-1">Raw block data</p>
                  <pre className="whitespace-pre-wrap break-words font-mono text-[10px]">
                    {active.details}
                  </pre>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
