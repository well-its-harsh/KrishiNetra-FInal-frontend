import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/consumer/card";
import { Badge } from "@/components/ui/consumer/badge";
import { Button } from "@/components/ui/consumer/button";
import { cancelOrderApi, fetchMyOrders, OrderDetail } from "@/lib/api";
import { ArrowRight, PackageCheck } from "lucide-react";

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-sky-100 text-sky-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchMyOrders(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelOrderApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const orders: OrderDetail[] = data?.orders ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-6 md:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[#1F2D3D]">My orders</h1>
          </div>

          {isLoading && <p className="text-sm text-muted-foreground">Loading orders...</p>}
          {isError && !isLoading && (
            <p className="text-sm text-red-500">Unable to load orders. Please try again.</p>
          )}

          <div className="space-y-4">
            {orders.length === 0 && !isLoading && (
              <p className="text-sm text-muted-foreground">No orders yet. Start by adding items to your cart.</p>
            )}
            {orders.map((order) => {
              const canCancel = order.status === "PENDING" || order.status === "PAID";
              const created = new Date(order.created_at).toLocaleString();
              const itemCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
              return (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base">Order #{order.id}</CardTitle>
                      <p className="text-xs text-muted-foreground">Placed on {created}</p>
                    </div>
                    <Badge className={`rounded-full px-3 py-1 text-xs ${statusColor[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-[#5B4D3B]">
                    <div className="flex justify-between">
                      <span>{itemCount} item(s)</span>
                      <span className="font-semibold">₹{Number(order.total)}</span>
                    </div>
                    <div className="space-y-1">
                      {order.order_items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span>
                            {item.product_name} × {item.quantity}
                          </span>
                          <span>₹{Number(item.subtotal)}</span>
                        </div>
                      ))}
                      {order.order_items.length > 3 && (
                        <p className="text-xs text-muted-foreground">+{order.order_items.length - 3} more items</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <PackageCheck className="h-4 w-4" />
                        <span>
                          Delivery status: {order.delivered_at ? "Delivered" : order.shipped_at ? "On the way" : "Processing"}
                        </span>
                      </div>
                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs"
                          disabled={cancelMutation.isPending}
                          onClick={() => cancelMutation.mutate(order.id)}
                        >
                          Cancel order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
