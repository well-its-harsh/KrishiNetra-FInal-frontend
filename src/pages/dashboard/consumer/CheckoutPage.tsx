import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/consumer/card";
import { Button } from "@/components/ui/consumer/button";
import { Input } from "@/components/ui/consumer/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { checkoutOrder, fetchCart } from "@/lib/api";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [fakeMethod, setFakeMethod] = useState<"UPI" | "CARD">("UPI");
  const [fakeUpiId, setFakeUpiId] = useState("");
  const [fakeCardNumber, setFakeCardNumber] = useState("");
  const [fakeCardName, setFakeCardName] = useState("");
  const [fakeExpiry, setFakeExpiry] = useState("");
  const [fakeCvv, setFakeCvv] = useState("");

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const subtotal = cartData ? Number(cartData.cart.subtotal) : 0;

  const checkoutMutation = useMutation({
    mutationFn: () =>
      checkoutOrder({
        shipping_address: shippingAddress,
        shipping_phone: shippingPhone,
        payment_method: paymentMethod,
        notes: notes || undefined,
      }),
    onSuccess: () => {
      navigate("/orders");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "COD") {
      checkoutMutation.mutate();
      return;
    }

    if (!showPaymentStep) {
      setShowPaymentStep(true);
      setFakeMethod(paymentMethod as "UPI" | "CARD");
      return;
    }

    if (fakeMethod === "UPI" && !fakeUpiId.trim()) {
      alert("Enter a UPI ID to simulate payment.");
      return;
    }

    if (fakeMethod === "CARD" && (!fakeCardNumber.trim() || !fakeCardName.trim())) {
      alert("Enter basic card details to simulate payment.");
      return;
    }

    checkoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-6 md:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Delivery details</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House, street, area, city, pincode"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    required
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment">Payment method</Label>
                  <select
                    id="payment"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="COD">Cash on delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>
                {paymentMethod !== "COD" && showPaymentStep && (
                  <div className="space-y-3 rounded-xl border border-[#E6DFD4] bg-[#FFF8EC]/80 p-3 text-xs text-[#5B4D3B]">
                    <p className="text-[11px] font-semibold text-[#4A3F33]">
                      Razorpay sandbox · {fakeMethod === "UPI" ? "UPI" : "Card"} payment simulation
                    </p>
                    {fakeMethod === "UPI" && (
                      <div className="space-y-2">
                        <Label htmlFor="fakeUpi" className="text-[11px] text-[#7A6A58]">
                          UPI ID
                        </Label>
                        <Input
                          id="fakeUpi"
                          value={fakeUpiId}
                          onChange={(e) => setFakeUpiId(e.target.value)}
                          placeholder="name@bank"
                          className="h-9 text-sm"
                        />
                        <p className="text-[11px] text-[#A4886A]">
                          This is a sandbox screen. We will simulate a successful Razorpay callback when you place the
                          order.
                        </p>
                      </div>
                    )}
                    {fakeMethod === "CARD" && (
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label htmlFor="cardNumber" className="text-[11px] text-[#7A6A58]">
                            Card number
                          </Label>
                          <Input
                            id="cardNumber"
                            value={fakeCardNumber}
                            onChange={(e) => setFakeCardNumber(e.target.value)}
                            placeholder="4111 1111 1111 1111"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="cardName" className="text-[11px] text-[#7A6A58]">
                            Name on card
                          </Label>
                          <Input
                            id="cardName"
                            value={fakeCardName}
                            onChange={(e) => setFakeCardName(e.target.value)}
                            placeholder="Full name"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="expiry" className="text-[11px] text-[#7A6A58]">
                            Expiry
                          </Label>
                          <Input
                            id="expiry"
                            value={fakeExpiry}
                            onChange={(e) => setFakeExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="cvv" className="text-[11px] text-[#7A6A58]">
                            CVV
                          </Label>
                          <Input
                            id="cvv"
                            value={fakeCvv}
                            onChange={(e) => setFakeCvv(e.target.value)}
                            placeholder="123"
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any instructions for delivery or packaging"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => navigate("/dashboard/consumer")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full bg-[#2E7D32] text-white"
                    disabled={checkoutMutation.isPending}
                  >
                    {checkoutMutation.isPending ? "Placing order..." : "Place order"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#5B4D3B]">
              <div className="flex justify-between">
                <span>Items subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹0</span>
              </div>
              <div className="mt-2 flex justify-between text-base font-semibold">
                <span>To pay</span>
                <span>₹{subtotal}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
