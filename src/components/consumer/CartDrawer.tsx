import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockCartItems = [
  {
    id: "1",
    name: "Organic Pearl Millet (Bajra)",
    brand: "FarmFresh Co-op",
    price: 89,
    qty: 2,
    unit: "per kg",
    delivery: "Arrives in 2–3 days",
  },
  {
    id: "2",
    name: "Ragi Flour Artisan",
    brand: "Millet Basket",
    price: 120,
    qty: 1,
    unit: "per kg",
    delivery: "Arrives by tomorrow",
  },
];

export const CartDrawer = () => {
  const navigate = useNavigate();

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative btn-ripple rounded-full">
          <ShoppingCart className="h-5 w-5" />
          {mockCartItems.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
              {mockCartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-md flex-col border-l border-[#E6DFD4] bg-[#FFF8EC] px-0">
        <SheetHeader className="px-6 pb-2 pt-6">
          <SheetTitle className="flex items-center justify-between text-lg text-[#1F2D3D]">
            Your millet cart
            <Badge className="rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">{mockCartItems.length} items</Badge>
          </SheetTitle>
        </SheetHeader>
        <Separator className="bg-[#E6DFD4]" />
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {mockCartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-2xl border border-[#E6DFD4] bg-white/90 p-4 shadow-[0_10px_30px_rgba(95,79,54,0.12)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F9F2E6] text-sm font-semibold text-[#2E7D32]">
                {item.qty}×
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C7B67]">{item.brand}</p>
                <p className="text-sm font-semibold text-[#1F2D3D]">{item.name}</p>
                <p className="text-xs text-[#7A6A58]">
                  ₹{item.price} {item.unit}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-[#7A6A58]">
                  <Clock3 className="h-3.5 w-3.5 text-[#DFA44A]" />
                  <span>{item.delivery}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-semibold text-[#1F2D3D]">₹{item.price * item.qty}</span>
                <div className="flex items-center rounded-full border border-[#E6DFD4] bg-[#FFF8EC] text-xs">
                  <button className="px-2 py-1">-</button>
                  <span className="px-2">{item.qty}</span>
                  <button className="px-2 py-1">+</button>
                </div>
                <button className="text-xs text-[#B09782] hover:text-[#8C7B67]">
                  <Trash2 className="mr-1 inline-block h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>
          ))}
          {mockCartItems.length === 0 && (
            <p className="text-sm text-[#7A6A58]">Your cart is empty. Start adding fresh millets from the marketplace.</p>
          )}
        </div>
        <div className="space-y-3 border-t border-[#E6DFD4] bg-white/90 px-6 py-4">
          <div className="space-y-1 text-sm text-[#5B4D3B]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotal}</span>
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
              <span>₹{total}</span>
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


