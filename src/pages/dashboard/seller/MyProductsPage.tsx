import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/seller/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/seller/table";
import { Button } from "@/components/ui/seller/button";
import { Badge } from "@/components/ui/seller/badge";
import { fetchMyProducts, ProductListItem } from "@/lib/api";

const MyProductsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-products"],
    queryFn: () => fetchMyProducts(),
  });

  const products: ProductListItem[] = useMemo(() => data?.products ?? [], [data]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <section className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1F2D3D]">My Products</h1>
              <p className="text-[#7A6A58]">Manage products that are visible in the consumer marketplace.</p>
            </div>
            <Button className="rounded-full bg-[#2E7D32] text-white" onClick={() => navigate("/products/create")}>
              List new product
            </Button>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Listed products</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}
              {isError && !isLoading && (
                <p className="text-sm text-red-500">Unable to load products. Please try again.</p>
              )}
              {!isLoading && !isError && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                          No products listed yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {products.map((p) => {
                      const priceNumber =
                        typeof p.price === "string" ? parseFloat(p.price) : p.price;
                      const created = new Date(p.created_at).toLocaleDateString();
                      const inStock = p.quantity > 0;
                      return (
                        <TableRow key={p.id}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>₹{priceNumber.toLocaleString()}</TableCell>
                          <TableCell>{p.quantity}</TableCell>
                          <TableCell>
                            <Badge className={inStock ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}>
                              {inStock ? "In stock" : "Out of stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>{created}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MyProductsPage;
