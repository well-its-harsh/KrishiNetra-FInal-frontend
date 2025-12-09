import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/seller/card";
import { Button } from "@/components/ui/seller/button";
import { Input } from "@/components/ui/seller/input";
import { Textarea } from "@/components/ui/seller/textarea";
import { Label } from "@/components/ui/seller/label";
import { Checkbox } from "@/components/ui/seller/checkbox";
import {
  createProduct,
  ProductCreatePayload,
  fetchMyAuctions,
  AuctionDetail,
} from "@/lib/api";

const CERTIFICATIONS = ["FPO/SHG", "Organic", "Lab-tested"];
const GRAIN_TYPES = ["Foxtail", "Barnyard", "Finger", "Little", "Sorghum", "Pearl"];

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [grainType, setGrainType] = useState<string>(GRAIN_TYPES[0]);
  const [location, setLocation] = useState("India");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [sellingMode, setSellingMode] = useState<"one_time" | "subscription">("one_time");
  const [subscriptionInterval, setSubscriptionInterval] = useState<
    "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY"
  >("MONTHLY");
  const [hasAuctionSource, setHasAuctionSource] = useState<"yes" | "no">("no");
  const [selectedSourceLots, setSelectedSourceLots] = useState<number[]>([]);

  const {
    data: purchasedLots,
    isLoading: purchasedLotsLoading,
    error: purchasedLotsError,
  } = useQuery<AuctionDetail[]>({
    queryKey: ["my-auctions-for-product-source"],
    queryFn: () => fetchMyAuctions(),
    enabled: hasAuctionSource === "yes",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: ProductCreatePayload = {
        name,
        description: description || null,
        price: Number(price),
        quantity: Number(quantity) || 0,
        miscellaneous_data: {
          grainType,
          location,
          certification: certifications,
          has_auction_source: hasAuctionSource === "yes",
          source_auction_lot_ids:
            hasAuctionSource === "yes" ? selectedSourceLots : [],
          subscription: {
            enabled: sellingMode === "subscription",
            interval: sellingMode === "subscription" ? subscriptionInterval : null,
          },
        },
      };
      return createProduct(payload);
    },
  });

  const toggleCertification = (cert: string) => {
    setCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync();
      navigate("/dashboard/seller");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <section>
            <h1 className="text-3xl font-bold text-[#1F2D3D]">List Product</h1>
            <p className="text-[#7A6A58]">Create a direct product listing visible in the consumer marketplace.</p>
          </section>

          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Product details</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product name</Label>
                    <Input
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Foxtail millet flour 1kg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per unit (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Available quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grainType">Product category</Label>
                    <select
                      id="grainType"
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                      value={grainType}
                      onChange={(e) => setGrainType(e.target.value)}
                    >
                      {GRAIN_TYPES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selling mode & subscription */}
                <div className="space-y-3 rounded-xl border border-[#E6DFD4] bg-[#FFF8EC]/40 p-4">
                  <Label className="text-sm font-medium text-[#4A3F33]">Selling mode</Label>
                  <p className="text-xs text-[#7A6A58]">
                    Choose whether this product is sold as a one-time purchase or on a subscription basis for
                    consumers.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setSellingMode("one_time")}
                      className={`rounded-full border px-3 py-1 transition-colors ${
                        sellingMode === "one_time"
                          ? "border-[#2E7D32] bg-[#E4F5E6] text-[#1F2D3D]"
                          : "border-[#D0C4B4] bg-white text-[#7A6A58]"
                      }`}
                    >
                      One-time purchase
                    </button>
                    <button
                      type="button"
                      onClick={() => setSellingMode("subscription")}
                      className={`rounded-full border px-3 py-1 transition-colors ${
                        sellingMode === "subscription"
                          ? "border-[#2E7D32] bg-[#E4F5E6] text-[#1F2D3D]"
                          : "border-[#D0C4B4] bg-white text-[#7A6A58]"
                      }`}
                    >
                      Subscription
                    </button>
                  </div>
                  {sellingMode === "subscription" && (
                    <div className="space-y-2 text-xs">
                      <Label className="text-[11px] text-[#7A6A58]">Subscription interval</Label>
                      <select
                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={subscriptionInterval}
                        onChange={(e) =>
                          setSubscriptionInterval(e.target.value as typeof subscriptionInterval)
                        }
                      >
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Every 3 months</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                      <p className="text-[11px] text-[#A4886A]">
                        This is a frontend flag only. Consumers will see this product as available on a
                        subscription cadence in the marketplace and checkout.
                      </p>
                    </div>
                  )}
                </div>

                {/* Blockchain source section */}
                <div className="space-y-3 rounded-xl border border-[#E6DFD4] bg-[#FFF8EC]/40 p-4">
                  <Label className="text-sm font-medium text-[#4A3F33]">
                    Blockchain source
                  </Label>
                  <p className="text-xs text-[#7A6A58]">
                    Did you purchase this product as an on-chain auction lot on KrishiNetra? Linking it
                    helps us build an end-to-end traceability graph for buyers.
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setHasAuctionSource("no");
                        setSelectedSourceLots([]);
                      }}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        hasAuctionSource === "no"
                          ? "border-[#2E7D32] bg-[#E4F5E6] text-[#1F2D3D]"
                          : "border-[#D0C4B4] bg-white text-[#7A6A58]"
                      }`}
                    >
                      No, list as standalone product
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasAuctionSource("yes")}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        hasAuctionSource === "yes"
                          ? "border-[#2E7D32] bg-[#E4F5E6] text-[#1F2D3D]"
                          : "border-[#D0C4B4] bg-white text-[#7A6A58]"
                      }`}
                    >
                      Yes, link to my auction lots
                    </button>
                  </div>

                  {hasAuctionSource === "yes" && (
                    <div className="mt-3 space-y-2 text-xs">
                      {purchasedLotsLoading && (
                        <p className="text-[#7A6A58]">Loading your eligible auction lots…</p>
                      )}
                      {purchasedLotsError && (
                        <p className="text-red-600">Failed to load auction lots. You can still list this product.</p>
                      )}
                      {!purchasedLotsLoading && purchasedLots && purchasedLots.length === 0 && (
                        <p className="text-[#7A6A58]">
                          We couldn&apos;t find any closed auctions you&apos;ve won yet. You can still create this
                          product without linking a lot.
                        </p>
                      )}

                      {purchasedLots && purchasedLots.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[#4A3F33] font-medium">
                            Select one or more lots that this product comes from:
                          </p>
                          <div className="space-y-1 max-h-52 overflow-y-auto rounded-lg border border-[#E6DFD4] bg-white/80 p-2">
                            {purchasedLots.map((lot) => {
                              const checked = selectedSourceLots.includes(lot.id);
                              return (
                                <label
                                  key={lot.id}
                                  className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1 text-[11px] hover:bg-[#FFF8EC]"
                                >
                                  <input
                                    type="checkbox"
                                    className="mt-0.5 h-3 w-3"
                                    checked={checked}
                                    onChange={() => {
                                      setSelectedSourceLots((prev) =>
                                        prev.includes(lot.id)
                                          ? prev.filter((id) => id !== lot.id)
                                          : [...prev, lot.id],
                                      );
                                    }}
                                  />
                                  <span>
                                    <span className="font-semibold text-[#1F2D3D]">Lot #{lot.id}</span>
                                    {" · "}
                                    <span className="text-[#7A6A58]">{lot.name}</span>
                                    <br />
                                    <span className="text-[#8C7B67]">
                                      Qty: {lot.quantity} · Final price: {String(lot.final_price ?? lot.base_price)}
                                    </span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description, processing details, taste notes, etc."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Farm / warehouse location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Tumakuru, Karnataka"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <div className="space-y-2 rounded-xl border border-[#E6DFD4] bg-[#FFF8EC]/60 p-3">
                      {CERTIFICATIONS.map((cert) => (
                        <label key={cert} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={certifications.includes(cert)}
                            onCheckedChange={() => toggleCertification(cert)}
                          />
                          <span>{cert}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => navigate("/dashboard/seller")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-full bg-[#2E7D32] text-white" disabled={mutation.isPending}>
                    {mutation.isPending ? "Listing..." : "List product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateProductPage;
