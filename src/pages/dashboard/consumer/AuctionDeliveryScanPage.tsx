import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/consumer/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/consumer/card";
import { Input } from "@/components/ui/consumer/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/config/api";

// Simple API call without touching backend code: POST /auctions/{auction_id}/confirm-delivery
async function confirmAuctionDelivery(auctionId: number, tokenData: any) {
  const res = await fetch(`${API_BASE_URL}/auctions/${auctionId}/confirm-delivery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(tokenData),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to confirm delivery");
  }
  return res.json() as Promise<{ success: boolean; message: string }>;
}

const AuctionDeliveryScanPage = () => {
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [manualJson, setManualJson] = useState("");
  const [processing, setProcessing] = useState(false);
  const [qrLibError, setQrLibError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);

  // Initialize html5-qrcode if available
  useEffect(() => {
    let cancelled = false;

    const setupScanner = async () => {
      try {
        // Dynamic import so app still works if library is missing
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;

        const elementId = "auction-qr-reader";
        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText: string) => {
            // On successful scan
            setScanError(null);
            try {
              const parsed = JSON.parse(decodedText);
              const auctionId = Number(parsed.auction_id);
              if (!auctionId || Number.isNaN(auctionId)) {
                throw new Error("Invalid auction_id in QR payload");
              }
              setProcessing(true);
              const res = await confirmAuctionDelivery(auctionId, parsed);
              setScanResult(res.message || "Delivery confirmed successfully.");
            } catch (err: any) {
              setScanError(err.message || "Failed to process QR payload");
            } finally {
              setProcessing(false);
            }
          },
          (errorMessage: string) => {
            // Ignore per-frame errors; only show fatal in catch below
            void errorMessage;
          }
        );
      } catch (err: any) {
        console.error("QR scanner init error", err);
        setQrLibError(
          "Camera scanner not available. You can still paste the QR JSON payload manually below."
        );
      }
    };

    setupScanner();

    return () => {
      cancelled = true;
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
          scannerRef.current.clear().catch(() => {});
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleManualSubmit = async () => {
    setScanError(null);
    setScanResult(null);
    setProcessing(true);
    try {
      const parsed = JSON.parse(manualJson);
      const auctionId = Number(parsed.auction_id);
      if (!auctionId || Number.isNaN(auctionId)) {
        throw new Error("Invalid auction_id in JSON payload");
      }
      const res = await confirmAuctionDelivery(auctionId, parsed);
      setScanResult(res.message || "Delivery confirmed successfully.");
    } catch (err: any) {
      setScanError(err.message || "Invalid JSON payload");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-6 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold text-[#1F2D3D]">
            Scan Delivery QR
          </h1>
          <p className="text-sm text-muted-foreground">
            As the winning buyer, scan the seller&apos;s shipping QR code to confirm
            delivery and release funds. This uses the existing
            <code className="ml-1">/auctions/&#123;auction_id&#125;/confirm-delivery</code>
            endpoint.
          </p>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Camera Scanner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {qrLibError && (
                <p className="text-xs text-red-600">{qrLibError}</p>
              )}
              <div
                id="auction-qr-reader"
                className="w-full max-w-sm aspect-square bg-black/5 rounded-lg border flex items-center justify-center text-xs text-muted-foreground"
              >
                {/* html5-qrcode will mount video & canvas here */}
                {!qrLibError && <span>Initializing camera…</span>}
              </div>
              {processing && (
                <p className="text-xs text-[#7A6A58]">Processing scan…</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manual JSON Payload (Fallback)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                If camera access is not available, you can paste the decoded QR JSON
                payload here (e.g. <code>{'{'}"auction_id": 1, "seller_id": 2, ...{'}'}</code>) and
                submit.
              </p>
              <Textarea
                rows={4}
                value={manualJson}
                onChange={(e) => setManualJson(e.target.value)}
                placeholder='{"auction_id": 1, "seller_id": 2, "winner_id": 3, "type": "DELIVERY_HANDSHAKE", "secret": "..."}'
                className="text-xs"
              />
              <div className="flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  className="rounded-full"
                  disabled={processing || !manualJson.trim()}
                  onClick={handleManualSubmit}
                >
                  {processing ? "Submitting…" : "Submit JSON"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {(scanError || scanResult) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Result</CardTitle>
              </CardHeader>
              <CardContent>
                {scanError && (
                  <p className="text-sm text-red-600 whitespace-pre-wrap">
                    {scanError}
                  </p>
                )}
                {scanResult && (
                  <p className="text-sm text-emerald-700 whitespace-pre-wrap">
                    {scanResult}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuctionDeliveryScanPage;
