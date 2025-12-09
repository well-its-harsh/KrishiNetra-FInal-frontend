import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/navigation/Navigation";
import { createBulkProduct, BulkProductCreatePayload } from "@/lib/api";
import { toast } from "sonner";

const CreateBulkProductPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<BulkProductCreatePayload>({
    name: "",
    description: "",
    category: "",
    min_order_quantity: 0,
    supply_capacity: 0,
    unit: "kg",
    base_price_per_unit: 0,
    image_url: "",
  });

  const mutation = useMutation({
    mutationFn: (payload: BulkProductCreatePayload) => createBulkProduct(payload),
    onSuccess: () => {
      toast.success("Bulk product listing created");
      navigate("/dashboard/seller", { replace: true });
    },
    onError: async (error: any) => {
      const message = error?.message || "Failed to create bulk product";
      toast.error(message);
    },
  });

  const handleChange = (field: keyof BulkProductCreatePayload, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "min_order_quantity" ||
        field === "supply_capacity" ||
        field === "base_price_per_unit"
          ? Number(value) || 0
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-8 md:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="rounded-3xl border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_24px_60px_rgba(95,79,54,0.12)] mb-6">
          <h1 className="text-2xl font-semibold text-[#1F2D3D] mb-2">Create bulk product offer</h1>
          <p className="text-sm text-[#7A6A58]">
            Define minimum order quantity, supply capacity and base price for your institutional buyers.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-[#E6DFD4] bg-white/95 p-6 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#7A6A58]">Product name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-md border border-[#E6DFD4] px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#7A6A58]">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-md border border-[#E6DFD4] px-3 py-2 text-sm"
                placeholder="e.g. Pearl millet, Ragi"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#7A6A58]">Description</label>
            <textarea
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full rounded-md border border-[#E6DFD4] px-3 py-2 text-sm min-h-[80px]"
              placeholder="Describe quality, certifications, origin, packaging, etc."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#7A6A58]">Minimum order quantity</label>
              <input
                type="number"
                min={0}
                value={form.min_order_quantity}
                onChange={(e) => handleChange("min_order_quantity", e.target.value)}
                className="w-full rounded-md border border-[#E6DFD4] px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#7A6A58]">Supply capacity</label>
              <input
                type="number"
                min={0}
                value={form.supply_capacity}
                onChange={(e) => handleChange("supply_capacity", e.target.value)}
                className="w-full rounded-md border border-[#E6DFD4] px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#7A6A58]">Unit</label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                className="w-full rounded-md border border-[#E6DFD4] px-3 py-2 text-sm"
                placeholder="e.g. kg, ton"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#7A6A58]">Base price per unit (₹)</label>
              <input
                type="number"
                min={0}
                value={form.base_price_per_unit}
                onChange={(e) => handleChange("base_price_per_unit", e.target.value)}
                className="w-full rounded-md border border-[#E6DFD4] px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#7A6A58]">Image URL (optional)</label>
              <input
                type="text"
                value={form.image_url || ""}
                onChange={(e) => handleChange("image_url", e.target.value)}
                className="w-full rounded-md border border-[#E6DFD4] px-3 py-2 text-sm"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard/seller")}
              className="rounded-full border border-[#E6DFD4] bg-white px-4 py-2 text-xs font-semibold text-[#7A6A58] hover:bg-[#FFF8EC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-full bg-[#2E7D32] px-5 py-2 text-xs font-semibold text-white hover:bg-[#256428] disabled:opacity-60"
            >
              {mutation.isPending ? "Saving..." : "Create bulk listing"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateBulkProductPage;
