import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/seller/button";
import { Badge } from "@/components/ui/seller/badge";
import { Slider } from "@/components/ui/seller/slider";
import { Plus, RefreshCw, ChevronDown, X, AlertCircle, Filter, ArrowUpDown } from "lucide-react";
import { AuctionCard, AuctionFilterPanel, SellerTools } from "@/components/seller/AuctionComponents";
import { AuctionCardSkeleton } from "@/components/seller/AuctionSkeletons";
import { AUCTION_LOTS } from "@/components/seller/auctionData";
import { useNavigate } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AuctionMarketplacePage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8);
    const [sortBy, setSortBy] = useState("Ending Soon");
    const [activeFilters, setActiveFilters] = useState(["Live", "Foxtail Millet"]); // Dummy initial filters

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Sort lots: LIVE first, then UPCOMING, then CLOSED
    const sortedLots = [...AUCTION_LOTS].sort((a, b) => {
        const statusOrder = { 'LIVE': 0, 'UPCOMING': 1, 'CLOSED': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    const handleLoadMore = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + 4);
            setIsLoading(false);
            toast({
                title: "Auctions Loaded",
                description: "More auction lots have been fetched.",
                className: "bg-[#2E7D32] text-white border-none",
            });
        }, 1000);
    };

    const removeFilter = (filter: string) => {
        setActiveFilters(activeFilters.filter(f => f !== filter));
        toast({
            title: "Filter Removed",
            description: `Removed ${filter} from active filters.`,
        });
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort);
        toast({
            title: "Sorted By",
            description: `Auctions sorted by ${sort}.`,
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="container px-4 py-6 md:px-6 lg:px-8">
                {/* Main Content Layout */}
                <div className="flex flex-col gap-6">

                    {/* Breadcrumb */}
                    <Breadcrumb className="mb-2">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/marketplace">Marketplace</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Seller</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Header & Tools Section */}
                    <section className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold text-[#1F2D3D]">Auction Marketplace</h1>
                            <p className="text-[#7A6A58]">Bid or create lots — connecting farmers, startups & bulk buyers</p>
                        </div>

                        {/* Seller Tools Row */}
                        <SellerTools />
                    </section>

                    <div className="flex gap-6">
                        {/* Desktop Filter Sidebar */}
                        <aside className="hidden w-64 lg:block">
                            <div className="sticky top-20">
                                <AuctionFilterPanel />
                            </div>
                        </aside>

                        {/* Main Grid Content */}
                        <div className="flex-1 space-y-5">
                            {/* Toolbar */}
                            <div className="flex flex-col gap-4 rounded-[20px] border border-[#E6DFD4] bg-white/90 p-4 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        {["All Lots", "Live", "Upcoming", "Closed", "My Bids"].map((cat, index) => (
                                            <button
                                                key={cat}
                                                className={`btn-ripple rounded-full border px-3 py-1 ${index === 0
                                                    ? "border-[#2E7D32] bg-[#2E7D32]/10 text-[#2E7D32]"
                                                    : "border-[#E6DFD4] bg-[#FFF8EC] text-[#7A6A58] hover:bg-white"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                        <span className="ml-2 text-[11px] text-[#B09782]">({sortedLots.length} lots)</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Sort Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="rounded-full border-[#E6DFD4] text-[#7A6A58]">
                                                    <ArrowUpDown className="mr-2 h-3 w-3" />
                                                    Sort by: <span className="ml-1 font-semibold text-[#1F2D3D]">{sortBy}</span>
                                                    <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                {["Highest Bid", "Ending Soon", "Quantity", "Newest"].map((sort) => (
                                                    <DropdownMenuItem key={sort} onClick={() => handleSortChange(sort)}>
                                                        {sort}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {/* Auto-refresh indicator */}
                                        <div className="hidden sm:flex items-center gap-2 text-xs text-[#7A6A58]">
                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                            <span>Auto-refresh</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Filters & Chips */}
                                <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-[#E6DFD4] pt-3 text-xs text-[#7A6A58]">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C7B67]">
                                        Active Filters
                                    </span>
                                    {activeFilters.map(filter => (
                                        <Badge key={filter} variant="secondary" className="rounded-full bg-[#E4F5E6] text-[#2E7D32] hover:bg-[#D5EAD5] gap-1 pr-1">
                                            {filter}
                                            <button onClick={() => removeFilter(filter)} className="rounded-full p-0.5 hover:bg-[#2E7D32]/10">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    {activeFilters.length === 0 && <span className="text-muted-foreground italic">None selected</span>}

                                    <div className="ml-auto flex items-center gap-2">
                                        <span className="text-[11px] text-[#B09782]">Min Bid</span>
                                        <Slider defaultValue={[1000]} min={0} max={10000} step={500} className="w-32" />
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            {isError ? (
                                /* Error State */
                                <Card className="border-[#E6DFD4] bg-[#FFF8EC]/50 text-center py-12">
                                    <CardContent className="flex flex-col items-center gap-4">
                                        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                                            <AlertCircle className="h-8 w-8 text-red-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#1F2D3D]">Something went wrong</h3>
                                        <p className="text-[#7A6A58]">We couldn't load the auctions. Please try again.</p>
                                        <Button onClick={() => setIsError(false)} className="rounded-full bg-[#2E7D32] text-white">
                                            Retry
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : isLoading ? (
                                /* Skeleton Loader */
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {[...Array(8)].map((_, i) => (
                                        <AuctionCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : sortedLots.length === 0 ? (
                                /* Empty State */
                                <Card className="border-[#E6DFD4] bg-[#FFF8EC]/50 text-center py-12">
                                    <CardContent className="flex flex-col items-center gap-4">
                                        <div className="h-16 w-16 bg-[#E6DFD4] rounded-full flex items-center justify-center">
                                            <Filter className="h-8 w-8 text-[#7A6A58]" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#1F2D3D]">No auctions available yet</h3>
                                        <p className="text-[#7A6A58]">Create your first lot to get started or adjust your filters.</p>
                                        <Button onClick={() => navigate('/auction/create')} className="rounded-full bg-[#2E7D32] text-white">
                                            Create Lot
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                /* Auction Grid */
                                <>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-500">
                                        {sortedLots.slice(0, visibleCount).map((lot) => (
                                            <AuctionCard key={lot.id} lot={lot} />
                                        ))}
                                    </div>

                                    {/* Load More */}
                                    {visibleCount < sortedLots.length && (
                                        <div className="flex justify-center pt-6">
                                            <Button
                                                onClick={handleLoadMore}
                                                variant="outline"
                                                className="rounded-full border-[#2E7D32] text-[#2E7D32] hover:bg-[#E4F5E6] px-8 py-6 h-auto text-lg font-medium shadow-sm hover:shadow-md transition-all"
                                            >
                                                Load More Auctions
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <Button
                    onClick={() => navigate('/auction/create')}
                    className="h-14 rounded-full bg-[#2E7D32] text-white shadow-lg hover:bg-[#256428] px-6 gap-2 animate-in zoom-in duration-300"
                >
                    <Plus className="h-5 w-5" />
                    <span className="font-semibold">Create Lot</span>
                </Button>
            </div>
        </div>
    );
};

export default AuctionMarketplacePage;
