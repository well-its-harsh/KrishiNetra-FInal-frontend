import { useState } from "react";
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
import { createAuctionWithImages } from "@/lib/api";

const CreateAuctionPage = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [grainType, setGrainType] = useState<string | undefined>();
    const [quantity, setQuantity] = useState<string>("");
    const [location, setLocation] = useState<string | undefined>();
    const [basePrice, setBasePrice] = useState<string>("");
    const [minIncrement, setMinIncrement] = useState<string>("");
    const [notes, setNotes] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [certificates, setCertificates] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }
        if (!grainType || !location) {
            setError("Please select grain type and location.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createAuctionWithImages({
                name: title,
                description: notes || undefined,
                quantity: Number(quantity),
                base_price: Number(basePrice),
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                miscellaneous_data: {
                    grainType,
                    location,
                    minIncrement: Number(minIncrement) || undefined,
                },
                images,
            });

            setShowSuccessModal(true);
        } catch (err: any) {
            console.error(err);
            setError(err?.message || "Failed to create auction. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F1E5]">
            <Navigation />

            <main className="container px-4 py-10 md:px-6 lg:px-10 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1F2D3D]">Create New Auction Lot</h1>
                    <p className="text-[#7A6A58]">List your produce for competitive bidding by verified buyers.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="border-[#E6DFD4] shadow-md bg-white/95">
                        <CardHeader>
                            <CardTitle>Lot Details</CardTitle>
                            <CardDescription>Provide accurate information to attract the best bids.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Lot Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Premium Organic Foxtail Millet"
                                        required
                                        className="bg-[#FFF8EC] border-[#E6DFD4]"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="grainType">Grain Type</Label>
                                    <Select
                                        required
                                        value={grainType}
                                        onValueChange={(val) => setGrainType(val)}
                                    >
                                        <SelectTrigger className="bg-[#FFF8EC] border-[#E6DFD4]">
                                            <SelectValue placeholder="Select grain type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GRAIN_TYPES.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity (kg)</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="e.g. 500"
                                        required
                                        className="bg-[#FFF8EC] border-[#E6DFD4]"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location (State)</Label>
                                    <Select
                                        required
                                        value={location}
                                        onValueChange={(val) => setLocation(val)}
                                    >
                                        <SelectTrigger className="bg-[#FFF8EC] border-[#E6DFD4]">
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["Karnataka", "Tamil Nadu", "Maharashtra", "Odisha", "Andhra Pradesh", "Rajasthan"].map(loc => (
                                                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Pricing & Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="basePrice">Base Price (₹)</Label>
                                    <Input
                                        id="basePrice"
                                        type="number"
                                        placeholder="Starting bid amount"
                                        required
                                        className="bg-[#FFF8EC] border-[#E6DFD4]"
                                        value={basePrice}
                                        onChange={(e) => setBasePrice(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="minIncrement">Min Increment (₹)</Label>
                                    <Input
                                        id="minIncrement"
                                        type="number"
                                        placeholder="e.g. 500"
                                        required
                                        className="bg-[#FFF8EC] border-[#E6DFD4]"
                                        value={minIncrement}
                                        onChange={(e) => setMinIncrement(e.target.value)}
                                    />
                                </div>

                                {/* Start Date */}
                                <div className="space-y-2 flex flex-col">
                                    <Label className="mb-2">Start Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal bg-[#FFF8EC] border-[#E6DFD4]",
                                                    !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
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
                                <div className="space-y-2 flex flex-col">
                                    <Label className="mb-2">End Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal bg-[#FFF8EC] border-[#E6DFD4]",
                                                    !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
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
                            </div>

                            {/* Uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label>Product Images</Label>
                                    <label className="border-2 border-dashed border-[#E6DFD4] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#FFF8EC]/50 transition-colors cursor-pointer h-40">
                                        <Upload className="h-8 w-8 text-[#7A6A58] mb-2" />
                                        <p className="text-sm font-medium text-[#1F2D3D]">Upload Images</p>
                                        <p className="text-xs text-[#7A6A58]">JPG, PNG (Max 5MB)</p>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                setImages(files as File[]);
                                            }}
                                        />
                                    </label>
                                </div>
                                <div className="space-y-4">
                                    <Label>Certifications</Label>
                                    <label className="border-2 border-dashed border-[#E6DFD4] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#FFF8EC]/50 transition-colors cursor-pointer h-40">
                                        <FileText className="h-8 w-8 text-[#7A6A58] mb-2" />
                                        <p className="text-sm font-medium text-[#1F2D3D]">Upload Certificates</p>
                                        <p className="text-xs text-[#7A6A58]">PDF, Docs (Max 10MB)</p>
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                setCertificates(files as File[]);
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Describe quality, packaging, or logistics details..."
                                    className="bg-[#FFF8EC] border-[#E6DFD4] min-h-[100px]"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}

                            <div className="flex justify-end gap-4 pt-4">
                                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full border-[#E6DFD4]">Cancel</Button>
                                <Button type="submit" disabled={isSubmitting} className="rounded-full bg-[#2E7D32] hover:bg-[#256428] text-white min-w-[150px]">
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
                            <DialogTitle className="text-center text-2xl font-bold text-[#1F2D3D]">Lot Created Successfully!</DialogTitle>
                            <DialogDescription className="text-center text-[#7A6A58]">
                                Your auction lot has been listed and is now visible to buyers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-center mt-6">
                            <Button
                                className="bg-[#2E7D32] hover:bg-[#256428] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                                onClick={() => navigate('/auction/my-lots')}
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
