import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent } from "@/components/ui/consumer/card";
import { BulkProduct, fetchMyBulkProducts } from "@/lib/api";

const MyBulkProductsPage = () => {
  const { data, isLoading, isError } = useQuery<BulkProduct[]>({
    queryKey: ["bulk-products", "mine"],
    queryFn: () => fetchMyBulkProducts(),
  });

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <Navigation />
      <main className="container px-4 py-8 md:px-6 lg:px-10 space-y-6">
        <div className="rounded-3xl border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_24px_60px_rgba(95,79,54,0.12)]">
          <h1 className="text-2xl font-semibold text-[#1F2D3D] mb-2">My bulk listings</h1>
          <p className="text-sm text-[#7A6A58]">
            These bulk offers are visible to institutional buyers in the Institution Dashboard.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#1F2D3D]">Bulk product catalog</h2>
          {isLoading && <p className="text-xs text-[#7A6A58]">Loading bulk products...</p>}
          {isError && !isLoading && (
            <p className="text-xs text-red-500">Failed to load bulk products. Please try again.</p>
          )}
          {!isLoading && !isError && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data && data.length > 0 ? (
                data.map((bp) => (
                  <Card key={bp.id} className="rounded-2xl border border-[#E6DFD4] bg-white/95">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-sm font-semibold text-[#1F2D3D]">{bp.name}</p>
                      {bp.description && (
                        <p className="text-xs text-[#7A6A58] line-clamp-2">{bp.description}</p>
                      )}
                      <p className="text-xs text-[#7A6A58] mt-1">Category: {bp.category}</p>
                      <p className="text-xs text-[#7A6A58] mt-1">
                        MOQ: {bp.min_order_quantity} {bp.unit} · Capacity: {bp.supply_capacity} {bp.unit}
                      </p>
                      <p className="text-sm font-semibold text-[#2E7D32] mt-1">
                        ₹{bp.base_price_per_unit} / {bp.unit}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-xs text-[#7A6A58]">You have not created any bulk listings yet.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyBulkProductsPage;
