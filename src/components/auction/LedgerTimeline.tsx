import { ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/seller/card";

export interface LedgerBlock {
  id: number;
  timestamp: string;
  auction_id: number;
  action: string;
  details: string;
  previous_hash: string;
  hash: string;
}

export const LedgerTimeline = ({ blocks }: { blocks: LedgerBlock[] }) => {
  if (!blocks?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No blockchain records yet — auction not finalized.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {blocks.map((b) => {
        const parsedDetails = JSON.parse(b.details);

        const Icon =
          b.action === "AUCTION_FINALIZED"
            ? ShieldCheck
            : b.action === "DELIVERY_CONFIRMED"
            ? CheckCircle2
            : Clock;

        return (
          <Card
            key={b.id}
            className="rounded-2xl border border-[#E6DFD4] bg-white/90 shadow-md"
          >
            <CardContent className="space-y-3 p-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F5E6] text-[#2E7D32]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-[#1F2D3D]">{b.action}</p>
                  <span className="text-xs text-[#8C7B67]">
                    {new Date(b.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* JSON Details */}
              <div className="rounded-xl bg-[#FFF8EC] p-4 text-sm text-[#4A3F33]">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(parsedDetails, null, 2)}
                </pre>
              </div>

              {/* Hashes */}
              <div className="space-y-1 text-[11px] text-[#866e5a]">
                <p>
                  <strong>HASH:</strong> {b.hash}
                </p>
                <p>
                  <strong>PREVIOUS HASH:</strong> {b.previous_hash}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
