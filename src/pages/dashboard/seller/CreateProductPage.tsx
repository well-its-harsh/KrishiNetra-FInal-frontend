import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/seller/card";
import { Button } from "@/components/ui/seller/button";
import { Input } from "@/components/ui/seller/input";
import { Textarea } from "@/components/ui/seller/textarea";
import { Label } from "@/components/ui/seller/label";
import { Checkbox } from "@/components/ui/seller/checkbox";
import { createProduct, ProductCreatePayload } from "@/lib/api";

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
                    <Label htmlFor="price">Price (₹)</Label>
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
                    <Label htmlFor="quantity">Quantity (units / kg)</Label>
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
                    <Label htmlFor="grainType">Grain type</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description, processing details, taste notes, etc."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Karnataka, India"
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
