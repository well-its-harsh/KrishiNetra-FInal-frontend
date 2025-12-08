import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCart, updateCartItemApi, removeCartItemApi, CartItemDetail } from "@/lib/api";

export const CartDrawer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const cart = data?.cart;
  const items: CartItemDetail[] = cart?.items ?? [];
  const subtotalNumber = cart ? Number(cart.subtotal) : 0;
  const totalNumber = cart ? Number(cart.total) : 0;
  const shipping = 0;
  const tax = 0;

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateCartItemApi(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (id: number) => removeCartItemApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleAdjustQty = (item: CartItemDetail, delta: number) => {
    const next = item.quantity + delta;
    if (next <= 0) return;
    updateQuantityMutation.mutate({ id: item.id, quantity: next });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative btn-ripple rounded-full">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-md flex-col border-l border-[#E6DFD4] bg-[#FFF8EC] px-0">
        <SheetHeader className="px-6 pb-2 pt-6">
          <SheetTitle className="flex items-center justify-between text-lg text-[#1F2D3D]">
            Your millet cart
            <Badge className="rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">{items.length} items</Badge>
          </SheetTitle>
        </SheetHeader>
        <Separator className="bg-[#E6DFD4]" />
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {isLoading && (
            <p className="text-sm text-[#7A6A58]">Loading cart...</p>
          )}
          {!isLoading && items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-2xl border border-[#E6DFD4] bg-white/90 p-4 shadow-[0_10px_30px_rgba(95,79,54,0.12)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F9F2E6] text-sm font-semibold text-[#2E7D32]">
                {item.quantity}×
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-[#1F2D3D]">{item.product.name}</p>
                <p className="text-xs text-[#7A6A58]">
                  ₹{Number(item.product.price)} per unit
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-[#7A6A58]">
                  <Clock3 className="h-3.5 w-3.5 text-[#DFA44A]" />
                  <span>Delivery in 2–3 days</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-semibold text-[#1F2D3D]">₹{Number(item.product.price) * item.quantity}</span>
                <div className="flex items-center rounded-full border border-[#E6DFD4] bg-[#FFF8EC] text-xs">
                  <button className="px-2 py-1" onClick={() => handleAdjustQty(item, -1)}>-</button>
                  <span className="px-2">{item.quantity}</span>
                  <button className="px-2 py-1" onClick={() => handleAdjustQty(item, 1)}>+</button>
                </div>
                <button
                  className="text-xs text-[#B09782] hover:text-[#8C7B67]"
                  onClick={() => removeItemMutation.mutate(item.id)}
                >
                  <Trash2 className="mr-1 inline-block h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>
          ))}
          {!isLoading && items.length === 0 && (
            <p className="text-sm text-[#7A6A58]">Your cart is empty. Start adding fresh millets from the marketplace.</p>
          )}
        </div>
        <div className="space-y-3 border-t border-[#E6DFD4] bg-white/90 px-6 py-4">
          <div className="space-y-1 text-sm text-[#5B4D3B]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotalNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax}</span>
            </div>
            <Separator className="my-2 bg-[#E6DFD4]" />
            <div className="flex justify-between text-base font-semibold text-[#1F2D3D]">
              <span>Total</span>
              <span>₹{totalNumber}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="btn-ripple flex-1 rounded-full bg-[#2E7D32] text-white hover:bg-[#256428]"
              onClick={() => navigate("/checkout")}
            >
              Proceed to checkout
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="btn-ripple flex-1 rounded-full border-[#E6DFD4] text-[#7A6A58] hover:bg-[#FFF8EC]">
              Apply coupon
            </Button>
            <Button variant="ghost" className="btn-ripple flex-1 rounded-full text-[#2E7D32] hover:bg-[#E4F5E6]">
              Continue shopping
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};


