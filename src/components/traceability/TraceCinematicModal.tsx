import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { X, CheckCircle2, Share2 } from "lucide-react";
import { fetchTraceability, type TraceabilityResponse, type TraceTreeNode } from "@/lib/api";

interface TraceCinematicModalProps {
  productId: number;
  open: boolean;
  onClose: () => void;
}

export const TraceCinematicModal = ({ productId, open, onClose }: TraceCinematicModalProps) => {
  const { data, isLoading, isError } = useQuery<TraceabilityResponse>({
    queryKey: ["traceability", productId],
    queryFn: () => fetchTraceability(productId),
    enabled: open && Number.isFinite(productId),
  });

  // Build safe node timeline from tree (depth-first)
  const nodes = useMemo(() => {
    if (!data || !Array.isArray(data.tree)) return [];

    const flattened: TraceTreeNode[] = [];
    const visit = (node: TraceTreeNode | null | undefined) => {
      if (!node || typeof node !== "object") return;
      flattened.push(node);
      const children = node.ingredients || [];
      children.forEach((child) => visit(child));
    };

    data.tree.forEach((root) => visit(root));
    return flattened;
  }, [data]);

  // Fallback title logic for each node
  const getNodeTitle = (node: TraceTreeNode | any) =>
    (node?.name as string | undefined) ||
    (node?.metadata && (node.metadata as any).label) ||
    (node?.origin && (node.origin as any).label) ||
    (node?.type as string | undefined) ||
    "Unnamed Step";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative h-[90vh] w-full max-w-4xl overflow-hidden rounded-[32px] border border-[#3c2f2f] bg-gradient-to-b from-[#141516] via-[#1F2D3D] to-[#2b211a] text-white shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-slate-100 hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex h-full flex-col">
              {/* Header */}
              <div className="px-6 pt-6 sm:px-10 sm:pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/80">
                  Traceability
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">
                  Let's trace where your food came from.
                </h2>
                <p className="mt-1 text-xs text-slate-200/80 max-w-md">
                  A verified chain of farmers, processors & blockchain proofs.
                </p>
              </div>

              {/* Body */}
              <div className="mt-4 flex-1 overflow-hidden px-4 pb-6 sm:px-8">
                <div className="grid h-full gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)]">

                  {/* Final product card */}
                  <motion.div
                    className="relative flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                  >
                    {isLoading && (
                      <div className="animate-pulse space-y-4">
                        <div className="h-44 w-full rounded-2xl bg-white/10" />
                        <div className="h-4 w-3/4 rounded bg-white/10" />
                        <div className="h-3 w-1/2 rounded bg-white/10" />
                      </div>
                    )}

                    {!isLoading && isError && (
                      <p className="text-sm text-rose-200">
                        Unable to load trace story. Try again.
                      </p>
                    )}

                    {!isLoading && !isError && data && (
                      <>
                        <div className="relative mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                          <div className="flex h-44 items-center justify-center text-xs text-slate-200/80">
                            {String(data.product_name || "Product traceability")}
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-emerald-100">
                          Final Product
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          {String(data.product_name || "Product traceability")}
                        </p>

                        {/* SAFE text fallback → always returns string */}
                        <p className="mt-1 text-xs text-slate-200/80">
                          {String(data.seller_name || "Sold by a verified seller on KrishiNetra")}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-emerald-100/90">
                          <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 border border-emerald-300/30">
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                            Verified supply chain
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>

                  {/* Timeline */}
                  <motion.div
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-4 sm:p-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="pointer-events-none absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-300 via-amber-300 to-transparent opacity-70" />

                    <div className="relative h-full overflow-y-auto pr-2">
                      {isLoading && (
                        <p className="mt-4 text-xs text-slate-200/80">Loading timeline…</p>
                      )}

                      {!isLoading && !isError && nodes.length > 0 && (
                        <div className="mt-2 space-y-4">
                          {nodes.map((node: any, index: number) => {
                            const isFirst = index === 0;
                            const isLast = index === nodes.length - 1;
                            const shortHash = node?.blockchain_hash ? String(node.blockchain_hash) : null;
                            return (
                              <motion.div
                                key={`${index}-${node?.id ?? Math.random()}`}
                                className="relative flex gap-4"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.12 }}
                              >
                                <div className="flex flex-col items-center pt-1">
                                  <div
                                    className={`h-3 w-3 rounded-full border border-white/70 ${
                                      isFirst
                                        ? "bg-emerald-300 shadow-[0_0_0_6px_rgba(52,211,153,0.35)]"
                                        : isLast
                                        ? "bg-amber-300 shadow-[0_0_0_6px_rgba(252,211,77,0.35)]"
                                        : "bg-white/80 shadow-[0_0_0_4px_rgba(248,250,252,0.28)]"
                                    }`}
                                  />
                                </div>

                                <div className="flex-1 rounded-2xl bg-white/5 p-3 sm:p-4 shadow-[0_14px_40px_rgba(0,0,0,0.35)] border border-white/10">
                                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/80">
                                    {isFirst ? "Final product" : node?.type ?? "Step"}
                                  </p>

                                  <p className="mt-1 text-sm font-semibold">
                                    {String(getNodeTitle(node))}
                                  </p>

                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-100/80">
                                    {node?.farmer_name && (
                                      <span className="rounded-full bg-black/30 px-2 py-0.5">
                                        Farmer: {node.farmer_name}
                                      </span>
                                    )}
                                    {(node?.village || node?.city || node?.state) && (
                                      <span className="rounded-full bg-black/25 px-2 py-0.5">
                                        {[node.village, node.city, node.state].filter(Boolean).join(", ")}
                                      </span>
                                    )}
                                    {node?.quantity && (
                                      <span className="rounded-full bg-black/25 px-2 py-0.5">
                                        Lot size: {node.quantity}
                                      </span>
                                    )}
                                  </div>

                                  {shortHash && (
                                    <p className="mt-2 text-[10px] font-mono text-emerald-100/90">
                                      Hash: {shortHash}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}

                      {!isLoading && !isError && nodes.length === 0 && (
                        <p className="mt-4 text-xs text-slate-200/80">
                          Traceability is not declared yet for this product.
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 bg-black/20 px-6 py-4 sm:px-10 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-200/80">
                  Secured on blockchain • Verified farmer → processor supply chain
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full bg-emerald-500 text-white px-3 py-1.5 text-[11px] font-semibold hover:bg-emerald-400"
                    onClick={onClose}
                  >
                    View farmer profile
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full bg-white/10 text-white px-3 py-1.5 text-[11px] font-semibold hover:bg-white/15"
                    onClick={onClose}
                  >
                    Buy again
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full bg-black/40 text-slate-100 px-3 py-1.5 text-[11px] font-semibold hover:bg-black/60"
                  >
                    <Share2 className="mr-1.5 h-3 w-3" />
                    Share trace story
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
