import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent } from "@/components/ui/consumer/card";
import {
  approveContract,
  fetchMyContracts,
  rejectContract,
  fetchContractShippingLabel,
  type Contract,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const SellerContractsPage = () => {
  const [shippingLabelUrlById, setShippingLabelUrlById] = useState<Record<number, string>>({});
  const [loadingLabelForId, setLoadingLabelForId] = useState<number | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contracts, isLoading, isError } = useQuery<Contract[]>({
    queryKey: ["contracts", "seller", "received"],
    queryFn: () => fetchMyContracts("received"),
    enabled: !!user,
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => approveContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts", "seller", "received"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (payload: { id: number; reason: string }) => {
      return rejectContract(payload.id, payload.reason || "Not suitable");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts", "seller"] });
    },
  });

  const sellerContracts = contracts || [];

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <Navigation />
      <main className="container px-4 py-8 md:px-6 lg:px-10 space-y-6">
        <div className="rounded-3xl border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_24px_60px_rgba(95,79,54,0.12)]">
          <h1 className="text-2xl font-semibold text-[#1F2D3D] mb-2">Institutional Contracts</h1>
          <p className="text-sm text-[#7A6A58]">
            Review and approve institutional purchase contracts. When you approve, the buyer's wallet funds
            are held in escrow until delivery is confirmed.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#1F2D3D]">Contracts where you are the seller</h2>
          {isLoading && <p className="text-xs text-[#7A6A58]">Loading contracts...</p>}
          {isError && !isLoading && (
            <p className="text-xs text-red-500">Failed to load contracts. Please try again.</p>
          )}
          {!isLoading && !isError && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sellerContracts.length > 0 ? (
                sellerContracts.map((c) => {
                  const totalValue = Number(c.total_quantity) * Number(c.price_per_unit);
                  const isPending = c.status === "PENDING_SELLER_APPROVAL";
                  const isActive = c.status === "ACTIVE";
                  const labelUrl = shippingLabelUrlById[c.id];
                  return (
                    <Card key={c.id} className="rounded-2xl border border-[#E6DFD4] bg-white/95">
                      <CardContent className="p-4 space-y-2 text-xs text-[#5B4D3B]">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[#1F2D3D]">Contract #{c.id}</p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                              c.status === "ACTIVE"
                                ? "bg-[#E4F5E6] text-[#2E7D32]"
                                : c.status === "COMPLETED"
                                ? "bg-[#E0F2FE] text-[#1D4ED8]"
                                : c.status === "PENDING_SELLER_APPROVAL"
                                ? "bg-[#FFF8EC] text-[#B7741D]"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {c.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p>
                          Qty: <span className="font-semibold">{c.total_quantity}</span> @ ₹
                          {Number(c.price_per_unit).toLocaleString()} / unit
                        </p>
                        <p>
                          Total value: <span className="font-semibold">₹{totalValue.toLocaleString()}</span>
                        </p>
                        <p>Buyer ID: {c.buyer_id}</p>
                        <p className="text-[11px] text-[#7A6A58]">
                          Escrow is funded from the buyer wallet once you approve, and released on delivery
                          confirmation.
                        </p>
                        {isPending && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => approveMutation.mutate(c.id)}
                              disabled={approveMutation.isPending}
                              className="inline-flex items-center rounded-full bg-[#2E7D32] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#256428] disabled:opacity-60"
                            >
                              {approveMutation.isPending ? "Approving..." : "Approve"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const reason = window.prompt("Reason for rejection?", "Price or terms not acceptable");
                                if (reason !== null) {
                                  rejectMutation.mutate({ id: c.id, reason });
                                }
                              }}
                              disabled={rejectMutation.isPending}
                              className="inline-flex items-center rounded-full border border-[#E6DFD4] px-3 py-1 text-[11px] font-semibold text-[#B91C1C] hover:bg-red-50 disabled:opacity-60"
                            >
                              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                            </button>
                          </div>
                        )}
                        {isActive && (
                          <div className="mt-3 space-y-2 border-t border-dashed border-[#E6DFD4] pt-2">
                            <p className="text-[11px] text-[#7A6A58]">
                              Generate the shipping label QR to share with logistics / buyer. Buyer will confirm
                              delivery by scanning this code, releasing escrow like in the test flow.
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    setLoadingLabelForId(c.id);
                                    const url = await fetchContractShippingLabel(c.id);
                                    setShippingLabelUrlById((prev) => ({ ...prev, [c.id]: url }));
                                  } catch (err) {
                                    console.error(err);
                                    alert("Failed to fetch shipping label");
                                  } finally {
                                    setLoadingLabelForId((current) => (current === c.id ? null : current));
                                  }
                                }}
                                disabled={loadingLabelForId === c.id}
                                className="inline-flex items-center rounded-full border border-[#E6DFD4] bg-[#FFF8EC] px-3 py-1 text-[11px] font-semibold text-[#2E7D32] hover:bg-[#E4F5E6] disabled:opacity-60"
                             >
                                {loadingLabelForId === c.id ? "Generating label..." : labelUrl ? "Refresh label" : "Generate shipping label"}
                              </button>
                              {labelUrl && (
                                <div className="flex items-center gap-2">
                                  <img
                                    src={labelUrl}
                                    alt={`Contract ${c.id} shipping QR`}
                                    className="h-16 w-16 rounded-md border border-[#E6DFD4] bg-white object-contain"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => window.open(labelUrl, "_blank")}
                                    className="text-[11px] font-semibold text-[#1D4ED8] underline"
                                  >
                                    Open full QR
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-xs text-[#7A6A58]">No contracts where you are the seller yet.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SellerContractsPage;
