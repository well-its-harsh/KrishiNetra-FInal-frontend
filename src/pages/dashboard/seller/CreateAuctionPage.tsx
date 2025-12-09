import { useState, useRef } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/seller/button";
import { Input } from "@/components/ui/seller/input";
import { Label } from "@/components/ui/seller/label";
import { Textarea } from "@/components/ui/seller/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/seller/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/seller/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/seller/dialog";
import { Calendar } from "@/components/ui/seller/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/seller/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, CheckCircle2, FileText, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GRAIN_TYPES } from "@/components/seller/auctionData";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../../lib/uploadImage";
import { createAuction } from "@/lib/api";           // ✔ JSON endpoint

const CreateAuctionPage = () => {
  const navigate = useNavigate();
  const MARKET_PRICES: Record<string, number> = {
    "Foxtail Millet": 3200,
    "Little Millet": 3000,
    "Kodo Millet": 2800,
    "Barnyard Millet": 2600,
    "Proso Millet": 2500,
    "Finger Millet": 2700,
    "Sorghum": 2200,
    "Pearl Millet": 2100,
    "Other": 2500,
  };
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const [title, setTitle] = useState("");
  const [grainType, setGrainType] = useState("")
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [minIncrement, setMinIncrement] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submittingRef.current || isSubmitting) return;

    setError(null);
    submittingRef.current = true;
    setIsSubmitting(true);

    if (!startDate || !endDate || !startTime || !endTime) {
      setError("Select start/end date and time.");
      submittingRef.current = false;
      setIsSubmitting(false);
      return;
    }

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const start = new Date(startDate);
    start.setHours(sh, sm, 0, 0);

    const end = new Date(endDate);
    end.setHours(eh, em, 0, 0);

    if (end <= start) {
      setError("End time must be after start time.");
      submittingRef.current = false;
      setIsSubmitting(false);
      return;
    }

    try {
      // 🔥 upload images FIRST
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        const uploads = await Promise.all(images.map((file) => uploadImage(file)));
        uploadedUrls = uploads;
      }

      // 🔥 JSON payload (NO FormData)
      const payload = {
        name: title,
        description: notes || undefined,
        quantity: Number(quantity),
        base_price: Number(basePrice),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        miscellaneous_data: {
          grainType,
          location,
          minIncrement: Number(minIncrement) || 0,
        },
        images: uploadedUrls,                      // ✔ array of URLs
        thumbnail: uploadedUrls[0] || null,       // ✔ first image
      };

      console.log("📤 FINAL PAYLOAD SENT:", payload);
      const res = await createAuction(payload);   // ✔ correct call

      console.log("🎉 Auction created:", res);
      setShowSuccessModal(true);

    } catch (err: any) {
      console.error("❌ Auction error:", err);
      setError(err?.message || "Failed to create auction.");
      submittingRef.current = false;
      setIsSubmitting(false);
      return;
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    submittingRef.current = false;
    navigate("/auction/my-lots");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1EC] to-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Card className="max-w-4xl mx-auto border-[#E6DFD4] shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-t-xl">
              <CardTitle className="text-3xl font-bold">Create New Auction Lot</CardTitle>
              <CardDescription className="text-white/90">
                List your produce for competitive bidding by verified buyers.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Lot Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#1F2D3D] flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lot Details
                </h3>
                <p className="text-sm text-[#7A6A58]">Provide accurate information to attract the best bids.</p>

                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lot Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Premium Wheat Harvest 2024"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grainType">Grain Type</Label>
                    <Select value={grainType} onValueChange={(val) => setGrainType(val)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grain type" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRAIN_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (kg)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="e.g., 5000"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location (State)</Label>
                    <Select value={location} onValueChange={(val) => setLocation(val)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Karnataka", "Tamil Nadu", "Maharashtra", "Odisha", "Andhra Pradesh", "Rajasthan"].map(
                          (loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="hidden md:block" />
                  <div className="space-y-2">
                    <Label>Today's Market Snapshot</Label>
                    <div className="rounded-2xl border border-[#E6DFD4] bg-gradient-to-b from-[#FFFDF7] to-[#FFF3E0] p-4 text-xs text-[#5B4D3B] shadow-sm space-y-3">
                      <p className="text-[11px] text-[#7A6A58] leading-snug">
                        Indicative prices per 100 kg for millets listed on the platform. Use this as a guide and adjust
                        your base price based on your lot's quality, certifications, and demand.
                      </p>
                      <div className="max-h-40 overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-2">
                          {GRAIN_TYPES.map((type) => {
                            const value = MARKET_PRICES[type] ?? MARKET_PRICES["Other"];
                            return (
                              <div
                                key={type}
                                className="flex items-center justify-between rounded-full bg-white/80 px-3 py-1.5 border border-[#F0E4D4] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                              >
                                <span className="truncate mr-2 text-[11px] font-medium text-[#4B4338]">{type}</span>
                                <span className="text-[11px] font-semibold text-[#2E7D32]">₹{value.toLocaleString()}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Dates */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#1F2D3D] flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pricing & Schedule
                </h3>

                <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-start">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price (₹)</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      placeholder="e.g., 25000"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minIncrement">Min Increment (₹)</Label>
                    <Input
                      id="minIncrement"
                      type="number"
                      placeholder="e.g., 500"
                      value={minIncrement}
                      onChange={(e) => setMinIncrement(e.target.value)}
                    />
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const d = new Date(date);
                            d.setHours(0, 0, 0, 0);
                            return d < today;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => {
                            const base = startDate ? new Date(startDate) : new Date();
                            base.setHours(0, 0, 0, 0);
                            const d = new Date(date);
                            d.setHours(0, 0, 0, 0);
                            return d < base;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Start Time */}
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  {/* End Time */}
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Uploads */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-[#E6DFD4] rounded-lg p-6 text-center hover:border-[#2E7D32] transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-[#7A6A58] mb-2" />
                    <p className="text-sm text-[#7A6A58] mb-2">Upload Images</p>
                    <p className="text-xs text-[#A89580]">JPG, PNG (Max 5MB)</p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="mt-2"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setImages(files as File[]);
                      }}
                    />
                    {images.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">{images.length} image(s) selected.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Certifications</Label>
                  <div className="border-2 border-dashed border-[#E6DFD4] rounded-lg p-6 text-center hover:border-[#2E7D32] transition-colors">
                    <FileText className="h-8 w-8 mx-auto text-[#7A6A58] mb-2" />
                    <p className="text-sm text-[#7A6A58] mb-2">Upload Certificates</p>
                    <p className="text-xs text-[#A89580]">PDF, Docs (Max 10MB)</p>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      className="mt-2"
                      onChange={() => {
                        // kept for future extension; currently not sent to backend
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information about quality, storage conditions, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="rounded-full border-[#E6DFD4]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#2E7D32] hover:bg-[#256428] text-white min-w-[150px]"
                >
                  {isSubmitting ? "Creating..." : "Create Auction Lot"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md text-center">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-[#1F2D3D]">
                Lot Created Successfully!
              </DialogTitle>
              <DialogDescription className="text-center text-[#7A6A58]">
                Your auction lot has been listed and is now visible to buyers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center mt-6">
              <Button
                className="bg-[#2E7D32] hover:bg-[#256428] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={handleModalClose}
              >
                View My Lots
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CreateAuctionPage;
