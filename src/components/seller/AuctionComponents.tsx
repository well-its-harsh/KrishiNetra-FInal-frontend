import React, { useState } from 'react';
import { Clock, Gavel, MapPin, Package, Plus, BarChart3, List, Filter, Search, ChevronDown, RefreshCw, Heart, Star, ShoppingCart, X, ShieldCheck, Award, Leaf, CalendarDays, Truck, Sprout, Warehouse, Factory, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/seller/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/seller/card";
import { Badge } from "@/components/ui/seller/badge";
import { Input } from "@/components/ui/seller/input";
import { Slider } from "@/components/ui/seller/slider";
import { Checkbox } from "@/components/ui/seller/checkbox";
import { Label } from "@/components/ui/seller/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/seller/tabs";
import { cn } from "@/lib/utils";
import { AuctionLot, GRAIN_TYPES, CERTIFICATIONS } from '@/components/seller/auctionData';

// --- Auction Card (Matches ProductCard.tsx exactly) ---
interface AuctionCardProps {
    lot: AuctionLot;
}

const statusColors: Record<string, string> = {
    "LIVE": "bg-green-600 text-white",
    "UPCOMING": "bg-yellow-500 text-white",
    "CLOSED": "bg-gray-500 text-white",
};

export const AuctionCard = ({ lot }: AuctionCardProps) => {
    const navigate = useNavigate();
    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <CardContent className="p-0">
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Placeholder Image since we don't have real ones in dummy data, using a colored div or generic image */}
                    {lot.thumbnail ? (
                        <img
                            src={lot.thumbnail}
                            alt={lot.name}
                            className="h-full w-full object-cover object-center"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <Package className="h-12 w-12 opacity-20" />
                        </div>
                    )}
                    {/* Status Badge (replacing FPO/Lab badges position) */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge className={`text-xs px-2 py-0.5 ${statusColors[lot.status] || "bg-primary"}`}>
                            {lot.status}
                        </Badge>
                    </div>
                    {/* Heart Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 bg-background/80 hover:bg-background"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-3">
                    {/* Title & Location (replacing Brand) */}
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {lot.location}
                        </p>
                        <h3 className="font-semibold line-clamp-2 text-sm leading-tight">{lot.name}</h3>
                    </div>

                    {/* Highest Bid (replacing Rating) */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1 text-primary font-medium text-sm">
                            <Gavel className="h-3 w-3" />
                            <span>Highest Bid: ₹{lot.currentBid.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Certifications (replacing Badges) */}
                    <div className="flex flex-wrap gap-1">
                        {lot.certification.map((cert) => (
                            <Badge
                                key={cert}
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary-foreground"
                            >
                                {cert}
                            </Badge>
                        ))}
                    </div>

                    {/* Quantity & CTA (replacing Price & Add Button) */}
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <p className="text-lg font-bold">{lot.quantity}</p>
                            <p className="text-xs text-muted-foreground">Lot Size</p>
                        </div>
                        <Button
                            size="sm"
                            className="gap-2 bg-[#2E7D32] hover:bg-[#256428] text-white"
                            onClick={() => navigate(`/auction/${lot.id}`)}
                        >
                            View & Bid
                        </Button>
                    </div>

                    {/* Time Left (replacing Delivery Estimate) */}
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Time Left: {lot.timeLeft}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Seller Tools (Matches Index.tsx info cards) ---
import { useNavigate } from 'react-router-dom';

export const SellerTools = () => {
    const navigate = useNavigate();
    const tools = [
        { title: 'Create Auction Lot', icon: Plus, desc: 'List new produce', path: '/auction/create' },
        { title: 'My Lots & Activity', icon: List, desc: 'Track your listings', path: '/auction/my-lots' },
        { title: 'Auction Insights', icon: BarChart3, desc: 'Market trends & prices', path: '/auction/insights' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {tools.map((tool, idx) => (
                <div
                    key={idx}
                    onClick={() => navigate(tool.path)}
                    className="flex items-center gap-4 rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC]/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(95,79,54,0.18)] cursor-pointer"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
                        <tool.icon className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-[#1F2D3D]">{tool.title}</p>
                        <p className="text-xs text-[#7A6A58]">{tool.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Auction Filter Panel (Matches FilterPanel.tsx exactly) ---
interface AuctionFilterPanelProps {
    onClose?: () => void;
}

export const AuctionFilterPanel = ({ onClose }: AuctionFilterPanelProps) => {
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

                {/* Status */}
                <section className="space-y-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.12em] text-[#8C7B67]">Status</p>
                        <h4 className="text-lg font-semibold text-[#1F2D3D]">Auction Status</h4>
                    </div>
                    <div className="space-y-2 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-inner shadow-white/40">
                        {["Live", "Upcoming", "Closed"].map((status) => (
                            <div key={status} className="flex items-center gap-3">
                                <Checkbox id={status} className="rounded-full border-[#C8BBA8] data-[state=checked]:bg-[#2E7D32]" />
                                <Label htmlFor={status} className="text-sm font-medium text-[#1F2D3D]">
                                    {status}
                                </Label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Grain Type */}
                <section className="space-y-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.12em] text-[#8C7B67]">Grain Type</p>
                        <h4 className="text-lg font-semibold text-[#1F2D3D]">Variety</h4>
                    </div>
                    <div className="space-y-2 rounded-2xl border border-dashed border-[#E6E0D6] p-4">
                        {GRAIN_TYPES.map((type) => (
                            <div key={type} className="flex items-center gap-3">
                                <Checkbox id={type} className="rounded-full border-[#C8BBA8] data-[state=checked]:bg-[#2E7D32]" />
                                <Label htmlFor={type} className="text-sm font-medium text-[#1F2D3D]">
                                    {type}
                                </Label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quantity Range */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.12em] text-[#8C7B67]">Quantity</p>
                            <h4 className="text-lg font-semibold text-[#1F2D3D]">Volume (kg)</h4>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                        <Slider defaultValue={[100]} max={5000} step={100} className="w-full" />
                        <div className="mt-3 flex justify-between text-sm text-[#7A6A58]">
                            <span>100 kg</span>
                            <span>5000+ kg</span>
                        </div>
                    </div>
                </section>

                {/* Location */}
                <section className="space-y-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.12em] text-[#8C7B67]">Location</p>
                        <h4 className="text-lg font-semibold text-[#1F2D3D]">State / Region</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {["Karnataka", "Tamil Nadu", "Maharashtra", "Odisha", "Andhra"].map((loc) => (
                            <label
                                key={loc}
                                htmlFor={loc}
                                className="flex items-center justify-between rounded-2xl border border-[#E6E0D6] bg-white/80 px-4 py-2 text-sm font-semibold text-[#1F2D3D] shadow-sm"
                            >
                                {loc}
                                <Checkbox id={loc} className="rounded-full border-[#C8BBA8] data-[state=checked]:bg-[#2E7D32]" />
                            </label>
                        ))}
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        variant="outline"
                        className="btn-ripple flex-1 rounded-full border-[#E6DFD4] bg-white/90 text-[#7A6A58] hover:bg-white"
                    >
                        Clear All
                    </Button>
                    <Button className="btn-ripple flex-1 rounded-full bg-[#2E7D32] text-white hover:bg-[#256428]">Apply</Button>
                </div>
            </div>
        </div>
    );
};

// --- Bid Interface ---

export const BidInterface = ({ currentBid, minIncrement }: { currentBid: number, minIncrement: number }) => {
    const [bidAmount, setBidAmount] = useState(currentBid + minIncrement);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleBid = () => {
        setShowSuccessModal(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-full border border-[#E6DFD4] bg-white">
                        <Button variant="ghost" size="icon" className="btn-ripple rounded-full" onClick={() => setBidAmount(Math.max(currentBid + minIncrement, bidAmount - minIncrement))}>
                            -
                        </Button>
                        <span className="w-24 text-center text-lg font-semibold text-[#1F2D3D]">₹{bidAmount}</span>
                        <Button variant="ghost" size="icon" className="btn-ripple rounded-full" onClick={() => setBidAmount(bidAmount + minIncrement)}>
                            +
                        </Button>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-[#8C7B67]">Min Increment</p>
                        <p className="text-base font-semibold text-[#2E7D32]">₹{minIncrement}</p>
                    </div>
                </div>
            </div>
            <Button
                onClick={handleBid}
                className="w-full btn-ripple rounded-full bg-[#2E7D32] py-6 text-lg font-semibold text-white shadow-[0_25px_55px_rgba(46,125,50,0.35)] hover:bg-[#256428]"
            >
                <Gavel className="mr-2 h-5 w-5" />
                Place Bid
            </Button>

            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">Bid Placed Successfully</DialogTitle>
                        <DialogDescription className="text-center">
                            (Demo) You are now the highest bidder for this lot.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center mt-4">
                        <Button
                            className="bg-[#2E7D32] hover:bg-[#256428] text-white rounded-full px-8"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Continue Browsing
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// --- Bid History Table ---
export const BidHistoryTable = () => {
    const history = [
        { bidder: "AgroCorp Ltd.", amount: 12500, time: "2 mins ago" },
        { bidder: "GreenEarth Foods", amount: 12400, time: "15 mins ago" },
        { bidder: "Organic Staples", amount: 12200, time: "1 hour ago" },
        { bidder: "FarmFresh Co.", amount: 12000, time: "2 hours ago" },
    ];

    return (
        <div className="rounded-2xl border border-[#E6DFD4] overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-[#FFF8EC] text-[#7A6A58] font-semibold uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Bidder</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFD4]">
                    {history.map((bid, idx) => (
                        <tr key={idx} className="bg-white hover:bg-[#FFF8EC]/50">
                            <td className="px-4 py-3 font-medium text-[#1F2D3D]">{bid.bidder}</td>
                            <td className="px-4 py-3 text-[#2E7D32] font-bold">₹{bid.amount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-[#7A6A58]">{bid.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
