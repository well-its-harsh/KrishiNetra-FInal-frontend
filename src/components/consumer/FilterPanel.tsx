import { useMemo, useState } from "react";
import { Button } from "@/components/ui/consumer/button";
import { Checkbox } from "@/components/ui/consumer/checkbox";
import { Label } from "@/components/ui/consumer/label";
import { Slider } from "@/components/ui/consumer/slider";
import { Badge } from "@/components/ui/consumer/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  onClose?: () => void;
}

export const FilterPanel = ({ onClose }: FilterPanelProps) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);

  const certificationOptions = useMemo(
    () => [
      { label: "FPO Verified", value: "fpo", colorClasses: "bg-[#E4F5E6] text-[#2E7D32]" },
      { label: "Organic", value: "organic", colorClasses: "bg-[#F1F7DB] text-[#5A6B09]" },
      { label: "Lab Verified", value: "lab", colorClasses: "bg-[#E1EEF9] text-[#1F4B6B]" },
      { label: "FSSAI Certified", value: "fssai", colorClasses: "bg-[#FDE8D6] text-[#B3580C]" },
    ],
    [],
  );

  const toggleCertification = (value: string) => {
    setSelectedCertifications((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const clearFilters = () => {
    setSelectedCertifications([]);
    setPriceRange([0, 1000]);
  };

  return (
    <div className="h-full overflow-y-auto rounded-[20px] border border-[#E6E0D6] bg-[#F9F4EA] p-6 shadow-[0_24px_60px_rgba(99,81,48,0.08)]">
      <div className="space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7A6A58]">Marketplace</p>
            <h3 className="text-2xl font-semibold text-[#1F2D3D]">Refine</h3>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-white/80 shadow-sm">
              <X className="h-4 w-4 text-[#7A6A58]" />
            </Button>
          )}
        </div>

        {/* Variety */}
        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-[#8C7B67]">Variety</p>
            <h4 className="text-lg font-semibold text-[#1F2D3D]">Choose your grain</h4>
          </div>
          <div className="space-y-2 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-inner shadow-white/40">
            {["Pearl Millet", "Finger Millet (Ragi)", "Foxtail Millet", "Little Millet", "Proso Millet"].map((variety) => (
              <div key={variety} className="flex items-center gap-3">
                <Checkbox id={variety} className="rounded-full border-[#C8BBA8] data-[state=checked]:bg-[#2E7D32]" />
                <Label htmlFor={variety} className="text-sm font-medium text-[#1F2D3D]">
                  {variety}
                </Label>
              </div>
            ))}
          </div>
        </section>

        {/* Category */}
        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-[#8C7B67]">Category</p>
            <h4 className="text-lg font-semibold text-[#1F2D3D]">Processing style</h4>
          </div>
          <div className="space-y-2 rounded-2xl border border-dashed border-[#E6E0D6] p-4">
            {["Raw Grains", "Flour", "Packaged Food", "By-products"].map((category) => (
              <div key={category} className="flex items-center gap-3">
                <Checkbox id={category} className="rounded-full border-[#C8BBA8] data-[state=checked]:bg-[#2E7D32]" />
                <Label htmlFor={category} className="text-sm font-medium text-[#1F2D3D]">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </section>

        {/* Price Range */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.12em] text-[#8C7B67]">Price Range</p>
              <h4 className="text-lg font-semibold text-[#1F2D3D]">Comfortable pricing</h4>
            </div>
            <Badge className="rounded-full bg-white/60 text-[#7A6A58] shadow-sm">{`₹${priceRange[0]} - ₹${priceRange[1]}`}</Badge>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
            <div className="mt-3 flex justify-between text-sm text-[#7A6A58]">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-[#8C7B67]">Certification</p>
            <h4 className="text-lg font-semibold text-[#1F2D3D]">Quality seals</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {certificationOptions.map((cert) => (
              <button
                type="button"
                key={cert.value}
                onClick={() => toggleCertification(cert.value)}
                className={cn(
                  "rounded-full border border-transparent px-3 py-1 text-xs font-semibold shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2E7D32]",
                  "btn-ripple",
                  cert.colorClasses,
                  selectedCertifications.includes(cert.value) ? "ring-2 ring-[#2E7D32]" : "opacity-90 hover:opacity-100",
                )}
              >
                {cert.label}
              </button>
            ))}
          </div>
        </section>

        {/* Pack Size */}
        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-[#8C7B67]">Pack Size</p>
            <h4 className="text-lg font-semibold text-[#1F2D3D]">Preferred fulfillment</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["500g", "1kg", "2kg", "5kg", "10kg"].map((size) => (
              <label
                key={size}
                htmlFor={size}
                className="flex items-center justify-between rounded-2xl border border-[#E6E0D6] bg-white/80 px-4 py-2 text-sm font-semibold text-[#1F2D3D] shadow-sm"
              >
                {size}
                <Checkbox id={size} className="rounded-full border-[#C8BBA8] data-[state=checked]:bg-[#2E7D32]" />
              </label>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="btn-ripple flex-1 rounded-full border-[#E6E0D6] bg-white/90 text-[#7A6A58] hover:bg-white"
            onClick={clearFilters}
          >
            Clear All
          </Button>
          <Button className="btn-ripple flex-1 rounded-full bg-[#2E7D32] text-white hover:bg-[#256428]">Apply</Button>
        </div>
      </div>
    </div>
  );
};
