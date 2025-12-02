import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Share2,
    ShieldCheck,
    Award,
    Leaf,
    CalendarDays,
    MapPin,
    Clock,
    Truck,
    Sprout,
    Warehouse,
    Factory,
    Package,
    ArrowUpRight,
    Gavel,
    FileText,
    Download,
    Star
} from "lucide-react";
import { Navigation } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/seller/button";
import { Badge } from "@/components/ui/seller/badge";
import { Card, CardContent } from "@/components/ui/seller/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/seller/tabs";
import { Separator } from "@/components/ui/seller/separator";
import { AuctionCard, BidInterface, BidHistoryTable } from "@/components/seller/AuctionComponents";
import { AuctionLot, AUCTION_LOTS } from "@/components/seller/auctionData";
import { useQuery } from "@tanstack/react-query";
import { fetchAuctionById, AuctionWithBids } from "@/lib/api";

// Placeholder images
import pearlMilletImage from "@/assets/product-pearl-millet.jpg";

const AuctionDetailPage = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);

    const auctionId = id ? Number(id) : NaN;
    const { data: auction, isLoading, isError } = useQuery<AuctionWithBids>({
        queryKey: ["auction", auctionId],
        enabled: !Number.isNaN(auctionId),
        queryFn: () => fetchAuctionById(auctionId),
    });

    const lot: AuctionLot | null = useMemo(() => {
        if (!auction) return null;
        const quantityText = `${auction.quantity} kg`;

        let currentBid: number = 0;
        if (auction.current_highest_bid != null) {
            currentBid = typeof auction.current_highest_bid === "string"
                ? parseFloat(auction.current_highest_bid)
                : auction.current_highest_bid;
        } else if (auction.final_price != null) {
            currentBid = typeof auction.final_price === "string" ? parseFloat(auction.final_price) : auction.final_price as number;
        } else {
            currentBid = typeof auction.base_price === "string" ? parseFloat(auction.base_price) : auction.base_price as number;
        }

        const now = new Date();
        const end = new Date(auction.end_time);
        const start = new Date(auction.start_time);

        let status: AuctionLot["status"] = "CLOSED";
        if (now < start) status = "UPCOMING";
        else if (now >= start && now <= end && !auction.winner_id) status = "LIVE";

        let timeLeft = "Ended";
        if (status === "LIVE") {
            const diffSeconds = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
            const h = String(Math.floor(diffSeconds / 3600)).padStart(2, "0");
            const m = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, "0");
            const s = String(diffSeconds % 60).padStart(2, "0");
            timeLeft = `${h}:${m}:${s}`;
        }

        const misc = auction.miscellaneous_data || {};

        return {
            id: String(auction.id),
            name: auction.name,
            quantity: quantityText,
            currentBid,
            timeLeft,
            status,
            grainType: misc.grainType || "Millet",
            location: misc.location || "India",
            certification: (misc.certification as string[]) || [],
        };
    }, [auction]);

    const images = [pearlMilletImage, pearlMilletImage, pearlMilletImage]; // Placeholder images

    const summaryInfo = [
        { label: "Verified by", value: "FPO Council", icon: ShieldCheck, tone: "bg-[#E4F5E6] text-[#2E7D32]" },
        { label: "Origin", value: lot.location, icon: MapPin, tone: "bg-[#FFF8EC] text-[#8B6F4E]" },
        { label: "Harvest date", value: "12 Oct 2024", icon: CalendarDays, tone: "bg-[#E1EEF9] text-[#1F4B6B]" },
        { label: "Quality", value: "Grade A", icon: Award, tone: "bg-[#FDEFD7] text-[#B7741D]" },
    ];

    const traceSteps = [
        { label: "Harvested", date: "02 Oct", location: lot.location, authority: "FPO supervisor", batch: "Batch F-2024-01", icon: Sprout },
        { label: "Cleaned", date: "05 Oct", location: "Block collection hub", authority: "SHG coordinator", batch: "Batch C-2024-01", icon: Warehouse },
        { label: "Processed", date: "08 Oct", location: "Regional Mill", authority: "Quality Team", batch: "Batch P-2024-01", icon: Factory },
        { label: "Certified", date: "10 Oct", location: "Lab Facility", authority: "Lab Technician", batch: "Batch L-2024-01", icon: Award },
        { label: "Ready for Dispatch", date: "12 Oct", location: "Central Storage", authority: "Store manager", batch: "Batch W-2024-01", icon: Truck },
    ];

    const [visibleTraceSteps, setVisibleTraceSteps] = useState(1);

    useEffect(() => {
        setVisibleTraceSteps(1);
        const timer = setInterval(() => {
            setVisibleTraceSteps((prev) => {
                if (prev >= traceSteps.length) {
                    clearInterval(timer);
                    return prev;
                }
                return prev + 1;
            });
        }, 450);
        return () => clearInterval(timer);
    }, []);

    if (isLoading || !lot) {
        return (
            <div className="min-h-screen bg-[#F7F1E5]">
                <Navigation />
                <main className="container px-4 py-10 md:px-6 lg:px-10">
                    <p className="text-sm text-muted-foreground">Loading auction details...</p>
                </main>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-[#F7F1E5]">
                <Navigation />
                <main className="container px-4 py-10 md:px-6 lg:px-10">
                    <p className="text-sm text-red-600">Unable to load this auction. Please try again.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F1E5]">
            <Navigation />

            <main className="container px-4 py-10 md:px-6 lg:px-10">
                <section className="grid gap-10 rounded-[32px] border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_30px_90px_rgba(95,79,54,0.12)] lg:grid-cols-2">

                    {/* Left Column: Images */}
                    <div className="space-y-5">
                        <div className="relative aspect-square overflow-hidden rounded-[24px] border border-[#E6DFD4] bg-[#FFF8EC] shadow-[0_30px_70px_rgba(95,79,54,0.18)]">
                            <img
                                src={images[selectedImage]}
                                alt={lot.name}
                                className="h-full w-full object-cover object-center transition duration-500 ease-out"
                            />
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-[#2E7D32] text-white px-3 py-1 text-sm">
                                    {lot.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-1">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`btn-ripple aspect-square w-24 min-w-[6rem] overflow-hidden rounded-[12px] border-2 transition-all duration-300 shadow-sm ${selectedImage === index ? "border-[#2E7D32] shadow-[0_15px_35px_rgba(46,125,50,0.3)]" : "border-transparent hover:border-[#D5EAD5]"
                                        }`}
                                >
                                    <img src={image} alt={`View ${index + 1}`} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Info & Bidding */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <p className="text-sm uppercase tracking-[0.4em] text-[#8C7B67]">Auction Lot #{lot.id}</p>
                            <h1 className="text-[2.25rem] font-semibold leading-tight text-[#1F2D3D]">{lot.name}</h1>

                            {/* Summary Cards */}
                            <div className="grid gap-3 rounded-[22px] border border-[#E6DFD4] bg-[#FFF8EC]/80 p-4 md:grid-cols-2">
                                {summaryInfo.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.label} className="flex items-center gap-3">
                                            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${item.tone} shadow-sm`}>
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.25em] text-[#8C7B67]">{item.label}</p>
                                                <p className="text-sm font-semibold text-[#1F2D3D]">{item.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="flex flex-wrap gap-2">
                            {lot.certification.map((badge) => (
                                <Badge
                                    key={badge}
                                    className="btn-ripple gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-[0_8px_18px_rgba(0,0,0,0.08)] bg-[#E4F5E6] text-[#2E7D32]"
                                >
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    <span>{badge}</span>
                                </Badge>
                            ))}
                        </div>

                        {/* Bidding Section */}
                        <div className="space-y-3 rounded-[22px] border border-[#E6DFD4] bg-white/90 p-6 shadow-lg">
                            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-[#8C7B67]">Current Highest Bid</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-[#2E7D32]">₹{lot.currentBid.toLocaleString()}</span>
                                        <span className="text-sm text-[#7A6A58]">for {lot.quantity}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-[#FFF8EC] px-4 py-2 text-[#B7741D] border border-[#FDEFD7]">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-semibold">{lot.timeLeft} left</span>
                                </div>
                            </div>

                            <Separator className="bg-[#E6DFD4]" />

                            <div className="pt-4">
                                <BidInterface currentBid={lot.currentBid} minIncrement={500} />
                            </div>
                        </div>

                        {/* Bid History (Sidebar placement) */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#1F2D3D]">Recent Bids</h3>
                            <BidHistoryTable />
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" size="icon" className="btn-ripple rounded-full border-[#E6DFD4] bg-white text-[#2E7D32] hover:bg-[#E4F5E6]">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </section>

                <Separator className="my-12 bg-[#E6DFD4]" />

                {/* Tabs Section */}
                <section className="space-y-8">
                    <Tabs defaultValue="overview">
                        <TabsList className="inline-flex rounded-full border border-[#E6DFD4] bg-white/80 p-1 shadow-inner shadow-white/60">
                            {[
                                { value: "overview", label: "Overview" },
                                { value: "trace", label: "Traceability" },
                                { value: "docs", label: "Lab Reports & Docs" },
                                { value: "reviews", label: "Seller Reviews" },
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="rounded-full px-6 py-2 text-sm font-semibold text-[#7A6A58] transition-all data-[state=active]:bg-[#FFF8EC] data-[state=active]:text-[#2E7D32] data-[state=active]:shadow-[0_12px_30px_rgba(46,125,50,0.12)]"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="overview" className="mt-8">
                            <Card className="rounded-[28px] border border-[#E6DFD4] bg-white/95 shadow-[0_25px_70px_rgba(95,79,54,0.1)]">
                                <CardContent className="p-8 space-y-4">
                                    <h3 className="text-2xl font-semibold text-[#1F2D3D]">Lot Details</h3>
                                    <p className="text-lg text-[#7A6A58] leading-relaxed">
                                        This lot of {lot.name} is sourced directly from {lot.location}. It has been verified for quality and is stored in optimal conditions.
                                        Ideal for bulk processing or retail packaging. The grain size is uniform, and moisture content is within regulated limits.
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                                        <div>
                                            <p className="text-xs uppercase text-[#8C7B67]">Grain Variety</p>
                                            <p className="font-semibold text-[#1F2D3D]">{lot.name.split(' ')[0]}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-[#8C7B67]">Moisture</p>
                                            <p className="font-semibold text-[#1F2D3D]">11%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-[#8C7B67]">Grade</p>
                                            <p className="font-semibold text-[#1F2D3D]">Premium A+</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-[#8C7B67]">Harvest Date</p>
                                            <p className="font-semibold text-[#1F2D3D]">Oct 2024</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-[#8C7B67]">Logistics Support</p>
                                            <p className="font-semibold text-[#1F2D3D]">Available</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="trace" className="mt-8 space-y-4">
                            <Card className="rounded-[28px] border border-[#E6DFD4] bg-white/95 shadow-[0_25px_70px_rgba(95,79,54,0.1)]">
                                <CardContent className="space-y-6 p-8">
                                    <h3 className="text-2xl font-semibold text-[#1F2D3D]">Seed-to-shelf timeline</h3>
                                    <div className="flex flex-wrap items-center gap-6">
                                        {traceSteps.map((step, index) => {
                                            const Icon = step.icon;
                                            const isVisible = index < visibleTraceSteps;
                                            return (
                                                <div
                                                    key={step.label}
                                                    className={`flex max-w-[210px] flex-col items-center text-center transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                                        }`}
                                                >
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC] text-[#2E7D32] shadow-sm">
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <p className="mt-3 text-sm font-semibold text-[#1F2D3D]">{step.label}</p>
                                                    <span className="mt-1 rounded-full bg-[#E4F5E6] px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                                                        {step.date}
                                                    </span>
                                                    <p className="mt-2 text-xs text-[#7A6A58]">{step.location}</p>
                                                    <p className="mt-1 text-[11px] text-[#B09782]">
                                                        {step.authority} · {step.batch}
                                                    </p>
                                                    {index < traceSteps.length - 1 && (
                                                        <span className="hidden h-px w-16 border-t border-dashed border-[#E6DFD4] lg:block" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="docs" className="mt-8">
                            <Card className="rounded-[28px] border border-[#E6DFD4] bg-white/95 shadow-[0_25px_70px_rgba(95,79,54,0.1)]">
                                <CardContent className="space-y-6 p-8">
                                    <h3 className="text-2xl font-semibold text-[#1F2D3D]">Lab Reports & Certificates</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {["Lab Analysis Report", "Organic Certificate", "FPO Registration", "Phytosanitary Cert"].map((doc) => (
                                            <div key={doc} className="flex items-center justify-between p-4 rounded-xl border border-[#E6DFD4] bg-[#FFF8EC]/50 hover:bg-[#FFF8EC] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-[#2E7D32]" />
                                                    <span className="font-medium text-[#1F2D3D]">{doc}</span>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-[#2E7D32]">
                                                    <Download className="h-4 w-4 mr-2" /> Download
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-8">
                            <Card className="rounded-[28px] border border-[#E6DFD4] bg-white/95 shadow-[0_25px_70px_rgba(95,79,54,0.1)]">
                                <CardContent className="space-y-4 p-8">
                                    <h3 className="text-2xl font-semibold text-[#1F2D3D]">Seller Ratings</h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="text-4xl font-bold text-[#1F2D3D]">4.8</div>
                                        <div className="flex flex-col">
                                            <div className="flex text-[#DFA44A]">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                                            </div>
                                            <span className="text-sm text-[#7A6A58]">Based on 124 auctions</span>
                                        </div>
                                    </div>
                                    <p className="text-[#7A6A58]">"Excellent quality grains and timely delivery. Highly recommended for bulk procurement." - Buyer from Gujarat</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>

                <Separator className="my-12 bg-[#E6DFD4]" />

                {/* Other Auctions */}
                <section className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-[#8C7B67]">More Opportunities</p>
                            <h2 className="text-2xl font-semibold text-[#1F2D3D]">Other Live Auctions</h2>
                        </div>
                        <Button variant="ghost" className="btn-ripple rounded-full text-[#2E7D32] hover:bg-[#E4F5E6]">
                            View all
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {AUCTION_LOTS.slice(0, 4).map((item) => (
                            <AuctionCard key={item.id} lot={item} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AuctionDetailPage;
