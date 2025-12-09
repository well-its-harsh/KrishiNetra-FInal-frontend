import { Navigation } from "@/components/navigation/Navigation";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, PackageSearch } from "lucide-react";

const ProductListingModePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-8 md:px-6 lg:px-8 space-y-6">
        <div className="rounded-3xl border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_24px_60px_rgba(95,79,54,0.12)]">
          <h1 className="text-2xl font-semibold text-[#1F2D3D] mb-2">Choose listing type</h1>
          <p className="text-sm text-[#7A6A58]">
            Decide whether you want to list a retail product for consumers or a bulk offer for institutional buyers.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/products/create")}
            className="flex flex-col items-start gap-3 rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC]/90 p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(95,79,54,0.18)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#1F2D3D]">Retail listing (per piece)</p>
              <p className="text-xs text-[#7A6A58] mt-1">
                Ideal for listing products to the consumer marketplace with per-unit pricing.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/bulk-products/create")}
            className="flex flex-col items-start gap-3 rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC]/90 p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(95,79,54,0.18)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
              <PackageSearch className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#1F2D3D]">Bulk B2B listing</p>
              <p className="text-xs text-[#7A6A58] mt-1">
                Create a bulk product offer for institutions and businesses with MOQ and supply capacity.
              </p>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
};

export default ProductListingModePage;
