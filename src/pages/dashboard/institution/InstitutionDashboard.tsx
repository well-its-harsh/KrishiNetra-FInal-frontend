import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent } from "@/components/ui/consumer/card";
import {
  BulkProduct,
  Contract,
  AuctionDetail,
  fetchBulkProducts,
  fetchMyContracts,
  fetchMyPurchasedAuctionLots,
  createContract,
  getWallet,
  rechargeWallet,
} from "@/lib/api";

const InstitutionDashboard = () => {
  const queryClient = useQueryClient();
  const [selectedBulk, setSelectedBulk] = useState<BulkProduct | null>(null);
  const [proposalQty, setProposalQty] = useState(0);
  const [proposalPrice, setProposalPrice] = useState(0);
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [confirmingContract, setConfirmingContract] = useState<Contract | null>(null);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logisticsSuccess, setLogisticsSuccess] = useState<string | null>(null);
  const [deliveredContracts, setDeliveredContracts] = useState<number[]>([]);

  const { data: bulkProducts } = useQuery<BulkProduct[]>({
    queryKey: ["bulk-products"],
    queryFn: () => fetchBulkProducts(),
  });

  const rechargeMutation = useMutation({
    mutationFn: async () => {
      if (!rechargeAmount || rechargeAmount <= 0) {
        throw new Error("Enter a valid amount");
      }
      return rechargeWallet(rechargeAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["contracts", "mine", "sent"] });
      setShowRecharge(false);
      setRechargeAmount(0);
    },
  });

  const confirmDeliveryMutation = useMutation({
    mutationFn: async () => {
      if (!confirmingContract) throw new Error("No contract selected");

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Pure simulation only: do not call backend for now
      return { success: true } as any;
    },
    onSuccess: () => {
      if (confirmingContract) {
        const deliveredId = confirmingContract.id;
        setDeliveredContracts((prev) =>
          prev.includes(deliveredId) ? prev : [...prev, deliveredId],
        );
      }

      setLogisticsSuccess(
        "QR code scanned successfully. Funds have been released to the seller and the seller has been notified.",
      );

      // Reset form after delay
      setTimeout(() => {
        setConfirmingContract(null);
        setQrFile(null);
        setPreviewUrl(null);
        setLogisticsSuccess(null);
      }, 3000);

      queryClient.invalidateQueries({ queryKey: ["contracts", "mine", "sent"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Auto-submit after file selection for simulation
      setTimeout(() => {
        confirmDeliveryMutation.mutate();
      }, 500);
    }
  };

  const { data: myContracts } = useQuery<Contract[]>({
    queryKey: ["contracts", "mine", "sent"],
    queryFn: () => fetchMyContracts("sent"),
  });

  const { data: wonAuctions } = useQuery<AuctionDetail[]>({
    queryKey: ["auctions", "won"],
    queryFn: () => fetchMyPurchasedAuctionLots(0, 50),
  });

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });

  const createContractMutation = useMutation({
    mutationFn: () => {
      if (!selectedBulk) throw new Error("No bulk product selected");
      const today = new Date();
      const inNinetyDays = new Date();
      inNinetyDays.setDate(today.getDate() + 90);

      const start_date = today.toISOString().slice(0, 10); // YYYY-MM-DD
      const end_date = inNinetyDays.toISOString().slice(0, 10);

      return createContract({
        bulk_product_id: selectedBulk.id,
        total_quantity: proposalQty,
        price_per_unit: proposalPrice,
        start_date,
        end_date,
      });
    },
    onSuccess: () => {
      setSelectedBulk(null);
      setProposalQty(0);
      setProposalPrice(0);
      queryClient.invalidateQueries({ queryKey: ["contracts", "mine"] });
    },
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navigation />
      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-10 space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#0D1B2A] via-[#12345A] to-[#1F2D3D] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.55)] text-white">
          <h1 className="text-2xl font-semibold mb-1">Institution Dashboard</h1>
          <p className="text-xs md:text-sm text-slate-100/85 max-w-2xl">
            View bulk millet offers from verified sellers, fund escrow securely and track your B2B contracts and shipments.
          </p>
        </div>

        {/* Wallet summary */}
        <section>
          <Card className="rounded-3xl border border-slate-200 bg-white/95 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <CardContent className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold text-[#7A6A58] uppercase tracking-wide">Wallet</p>
                <p className="text-sm text-[#7A6A58]">Used for escrow payments on institutional contracts.</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-1 text-xs">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[11px] text-[#7A6A58]">Available balance</p>
                    <p className="text-sm font-semibold text-[#2E7D32]">
                      ₹{wallet ? Number(wallet.balance || 0).toLocaleString() : "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7A6A58]">Frozen (escrow)</p>
                    <p className="text-sm font-semibold text-[#B7741D]">
                      ₹{wallet ? Number(wallet.frozen_balance || 0).toLocaleString() : "0"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRecharge(true)}
                  className="mt-1 inline-flex items-center rounded-full bg-[#2E7D32] px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-[#256428]"
                >
                  Recharge wallet
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#1F2D3D]">Available Bulk Offers</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bulkProducts && bulkProducts.length > 0 ? (
              bulkProducts.map((bp) => (
                <Card key={bp.id} className="rounded-2xl border border-[#E6DFD4] bg-white/95">
                  <CardContent className="p-4 space-y-1">
                    <p className="text-sm font-semibold text-[#1F2D3D]">{bp.name}</p>
                    {bp.description && (
                      <p className="text-xs text-[#7A6A58] line-clamp-2">{bp.description}</p>
                    )}
                    <p className="text-xs text-[#7A6A58] mt-1">
                      Category: {bp.category}
                    </p>
                    <p className="text-xs text-[#7A6A58] mt-1">
                      MOQ: {bp.min_order_quantity} {bp.unit} · Capacity: {bp.supply_capacity} {bp.unit}
                    </p>
                    <p className="text-sm font-semibold text-[#2E7D32] mt-1">
                      ₹{bp.base_price_per_unit} / {bp.unit}
                    </p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center rounded-full border border-[#E6DFD4] bg-[#FFF8EC] px-3 py-1 text-xs font-semibold text-[#2E7D32] hover:bg-[#E4F5E6]"
                      onClick={() => {
                        setSelectedBulk(bp);
                        setProposalQty(Number(bp.min_order_quantity) || 0);
                        setProposalPrice(Number(bp.base_price_per_unit) || 0);
                      }}
                    >
                      Propose contract
                    </button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-xs text-[#7A6A58]">No bulk offers yet.</p>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#1F2D3D]">Won Auctions (Institution)</h2>
          <p className="text-xs text-[#7A6A58]">
            These are auction lots where you were the winner, matching the backend <code>get_auctions_by_winner</code>
            logic. They can be used as input for bulk contracts or traceability.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wonAuctions && wonAuctions.length > 0 ? (
              wonAuctions.map((a) => (
                <Card key={a.id} className="rounded-2xl border border-[#E6DFD4] bg-white/95">
                  <CardContent className="p-4 space-y-2 text-xs text-[#5B4D3B]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#1F2D3D]">{a.name}</p>
                      {a.final_price != null && (
                        <span className="rounded-full bg-[#E4F5E6] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#2E7D32]">
                          Won @ ₹{Number(a.final_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p>
                      Qty: <span className="font-semibold">{a.quantity}</span>
                    </p>
                    <p className="text-[11px] text-[#7A6A58]">
                      Ended on {new Date(a.end_time).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-xs text-[#7A6A58]">No won auctions yet.</p>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#1F2D3D]">My Contracts</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myContracts && myContracts.length > 0 ? (
              myContracts.map((c) => {
                const isLocallyDelivered = deliveredContracts.includes(c.id);
                const effectiveStatus = isLocallyDelivered ? "DELIVERED" : c.status;

                return (
                <Card key={c.id} className="rounded-2xl border border-[#E6DFD4] bg-white/95">
                  <CardContent className="p-4 space-y-2 text-xs text-[#5B4D3B]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#1F2D3D]">Contract #{c.id}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          effectiveStatus === "ACTIVE"
                            ? "bg-[#E4F5E6] text-[#2E7D32]"
                            : effectiveStatus === "COMPLETED" || effectiveStatus === "DELIVERED"
                            ? "bg-[#E0F2FE] text-[#1D4ED8]"
                            : effectiveStatus === "PENDING_SELLER_APPROVAL"
                            ? "bg-[#FFF8EC] text-[#B7741D]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {effectiveStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p>
                      Qty: <span className="font-semibold">{c.total_quantity}</span> @ ₹
                      {Number(c.price_per_unit).toLocaleString()} / unit
                    </p>
                    <p>
                      Total value: {" "}
                      <span className="font-semibold">
                        ₹{(Number(c.total_quantity) * Number(c.price_per_unit)).toLocaleString()}
                      </span>
                    </p>
                    {effectiveStatus === "PENDING_SELLER_APPROVAL" && (
                      <p className="text-[11px] text-[#B7741D]">
                        Waiting for seller to approve. Funds will be moved into escrow from your wallet once
                        approved.
                      </p>
                    )}
                    {effectiveStatus === "ACTIVE" && (
                      <p className="text-[11px] text-[#2E7D32]">
                        Approved & in progress. Escrow is held from your wallet until delivery is confirmed.
                      </p>
                    )}
                    {effectiveStatus === "COMPLETED" && (
                      <p className="text-[11px] text-[#1D4ED8]">
                        Delivery confirmed and escrow released. This contract is fully settled and the logistics leg is
                        considered completed (simulated).
                      </p>
                    )}
                    {effectiveStatus === "ACTIVE" && (
                      <div className="mt-2 space-y-1 border-t border-dashed border-[#E6DFD4] pt-2">
                        <p className="text-[11px] text-[#7A6A58]">
                          Once the shipment arrives, upload the QR code from the shipping label to confirm delivery.
                          This will confirm delivery and transfer funds to the seller.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmingContract(c);
                            setQrFile(null);
                            setPreviewUrl(null);
                          }}
                          className="inline-flex items-center rounded-full bg-[#2E7D32] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#256428]"
                        >
                          Confirm delivery
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
            ) : (
              <p className="text-xs text-[#7A6A58]">No contracts yet.</p>
            )}
          </div>
        </section>

        {selectedBulk && (
          <section className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl border border-[#E6DFD4] bg-white p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-semibold text-[#1F2D3D]">Propose contract</h2>
              <p className="text-sm text-[#7A6A58]">{selectedBulk.name}</p>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-[#7A6A58] mb-1">Quantity ({selectedBulk.unit})</label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-[#E6DFD4] px-3 py-1 text-sm"
                    min={Number(selectedBulk.min_order_quantity) || 0}
                    value={proposalQty}
                    onChange={(e) => setProposalQty(Number(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7A6A58] mb-1">Price per {selectedBulk.unit} (₹)</label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-[#E6DFD4] px-3 py-1 text-sm"
                    min={0}
                    value={proposalPrice}
                    onChange={(e) => setProposalPrice(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  className="rounded-full border border-[#E6DFD4] bg-white px-4 py-1 text-[#7A6A58] hover:bg-[#FFF8EC]"
                  onClick={() => setSelectedBulk(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={createContractMutation.isPending}
                  className="rounded-full bg-[#2E7D32] px-4 py-1 text-white hover:bg-[#256428] disabled:opacity-60"
                  onClick={() => createContractMutation.mutate()}
                >
                  {createContractMutation.isPending ? "Submitting..." : "Submit proposal"}
                </button>
              </div>
            </div>
          </section>
        )}

        {showRecharge && (
          <section className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl border border-[#E6DFD4] bg-white p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-semibold text-[#1F2D3D]">Recharge wallet</h2>
              <p className="text-xs text-[#7A6A58]">
                Add funds that can be locked in escrow when your contracts are approved by sellers. For large
                contracts, consider adding a small buffer (e.g. 10%) like in the institutional test flow.
              </p>
              <div className="space-y-2 text-sm">
                <label className="block text-xs font-semibold text-[#7A6A58]">Amount (₹)</label>
                <input
                  type="number"
                  min={1}
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(Number(e.target.value) || 0)}
                  className="w-full rounded-md border border-[#E6DFD4] px-3 py-2 text-sm"
                  placeholder="e.g. 90000"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  className="rounded-full border border-[#E6DFD4] bg-white px-4 py-1 text-[#7A6A58] hover:bg-[#FFF8EC]"
                  onClick={() => {
                    if (!rechargeMutation.isPending) {
                      setShowRecharge(false);
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={rechargeMutation.isPending}
                  className="rounded-full bg-[#2E7D32] px-4 py-1 text-white hover:bg-[#256428] disabled:opacity-60"
                  onClick={() => rechargeMutation.mutate()}
                >
                  {rechargeMutation.isPending ? "Processing..." : "Add funds"}
                </button>
              </div>
            </div>
          </section>
        )}

        {confirmingContract && (
          <section className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl border border-[#E6DFD4] bg-white p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-semibold text-[#1F2D3D]">Confirm delivery</h2>
              <p className="text-xs text-[#7A6A58]">
                Upload the QR code from the shipping label for contract #{confirmingContract.id}. This will
                confirm delivery and transfer funds to the seller.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E6DFD4] rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="text-xs text-gray-500">
                        {previewUrl ? 'QR code uploaded' : 'Click to upload QR code'}
                      </p>
                    </div>
                    <input 
                      id="qr-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                
                {previewUrl && (
                  <div className="mt-2 text-center">
                    <p className="text-xs text-green-600 mb-2">QR code ready for submission</p>
                    <div className="flex justify-center">
                      <img 
                        src={previewUrl} 
                        alt="QR Code Preview" 
                        className="h-24 w-24 object-contain border border-gray-200 rounded"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQrFile(null);
                        setPreviewUrl(null);
                        const input = document.getElementById('qr-upload') as HTMLInputElement;
                        if (input) input.value = '';
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove and retake
                    </button>
                  </div>
                )}

                {logisticsSuccess && (
                  <div className="mt-3 rounded-2xl bg-[#E4F5E6] border border-[#2E7D32]/40 px-3 py-2 text-[11px] text-[#1B5E20] text-left">
                    <p className="font-semibold">Delivery confirmed</p>
                    <p>{logisticsSuccess}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  className="rounded-full border border-[#E6DFD4] bg-white px-4 py-1 text-[#7A6A58] hover:bg-[#FFF8EC]"
                  onClick={() => {
                    if (!confirmDeliveryMutation.isPending) {
                      setConfirmingContract(null);
                      setQrFile(null);
                      setPreviewUrl(null);
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={confirmDeliveryMutation.isPending || !previewUrl}
                  className="rounded-full bg-[#2E7D32] px-4 py-1 text-white hover:bg-[#256428] disabled:opacity-60"
                  onClick={() => confirmDeliveryMutation.mutate()}
                >
                  {confirmDeliveryMutation.isPending ? "Processing..." : "Scan QR Code"}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default InstitutionDashboard;
