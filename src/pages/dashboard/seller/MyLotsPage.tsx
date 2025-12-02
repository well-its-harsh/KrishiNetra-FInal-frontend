import { useMemo, useState } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/seller/button";
import { Badge } from "@/components/ui/seller/badge";
import { Input } from "@/components/ui/seller/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/seller/select";
import { Card, CardContent } from "@/components/ui/seller/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/seller/table";
import { Eye, Edit, Trash2, Search, ArrowUpRight, Gavel, Package, CheckCircle2, Clock, Plus } from "lucide-react";
import { AuctionLot } from "@/components/seller/auctionData";
import { useNavigate } from "react-router-dom";
import { DeleteConfirmationModal, EditLotModal } from "@/components/seller/AuctionModals";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyAuctions, deleteAuction, AuctionDetail, AuctionWithBids } from "@/lib/api";

const mapAuctionToLot = (auction: AuctionDetail | AuctionWithBids): AuctionLot => {
    const quantityText = `${auction.quantity} kg`;

    let currentBid: number = 0;
    const anyWithBids = auction as AuctionWithBids;
    if (anyWithBids.current_highest_bid != null) {
        currentBid = typeof anyWithBids.current_highest_bid === "string"
            ? parseFloat(anyWithBids.current_highest_bid)
            : anyWithBids.current_highest_bid;
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
    else if (now >= start && now <= end && !("winner_id" in auction && auction.winner_id)) status = "LIVE";

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
        thumbnail: (auction as any).thumbnail || ((auction as any).images && (auction as any).images[0]) || null,
    };
};

const MyLotsPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: auctions, isLoading, isError } = useQuery<
        (AuctionDetail | AuctionWithBids)[]
    >({
        queryKey: ["my-auctions"],
        queryFn: () => fetchMyAuctions(),
    });

    const lots: AuctionLot[] = useMemo(() => {
        const raw = auctions ?? [];
        const mapped = raw.map(mapAuctionToLot);
        const statusOrder: Record<string, number> = { LIVE: 0, UPCOMING: 1, CLOSED: 2 };
        return mapped.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }, [auctions]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedLot, setSelectedLot] = useState<any>(null);

    // Dummy stats
    const stats = [
        { label: "Active Auctions", value: "3", icon: Gavel, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Closed Auctions", value: "12", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
        { label: "Total Bids", value: "145", icon: ArrowUpRight, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Total Volume", value: "8.5 Tons", icon: Package, color: "text-orange-600", bg: "bg-orange-100" },
    ];

    const handleDeleteClick = (lot: any) => {
        setSelectedLot(lot);
        setDeleteModalOpen(true);
    };

    const handleEditClick = (lot: any) => {
        setSelectedLot(lot);
        setEditModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedLot) return;
        try {
            await deleteAuction(Number(selectedLot.id));
            await queryClient.invalidateQueries({ queryKey: ["my-auctions"] });
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteModalOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F1E5]">
            <Navigation />

            <main className="container px-4 py-10 md:px-6 lg:px-10">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1F2D3D]">My Lots & Activity</h1>
                            <p className="text-[#7A6A58]">Manage your listings and track auction performance.</p>
                        </div>
                        <Button
                            onClick={() => navigate('/auction/create')}
                            className="rounded-full bg-[#2E7D32] hover:bg-[#256428] text-white shadow-lg"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Create New Lot
                        </Button>
                    </div>

                    {/* Stats Widgets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <Card key={idx} className="border-[#E6DFD4] shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#7A6A58]">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-[#1F2D3D]">{stat.value}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-[#E6DFD4] shadow-sm">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by Lot ID or Grain Type..." className="pl-9 bg-[#FFF8EC] border-[#E6DFD4] rounded-full" />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Select>
                                <SelectTrigger className="w-[150px] rounded-full bg-[#FFF8EC] border-[#E6DFD4]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="live">Live</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-[150px] rounded-full bg-[#FFF8EC] border-[#E6DFD4]">
                                    <SelectValue placeholder="State" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All States</SelectItem>
                                    <SelectItem value="karnataka">Karnataka</SelectItem>
                                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Lots Table */}
                    <Card className="border-[#E6DFD4] shadow-sm overflow-hidden min-h-[400px]">
                        {isLoading && (
                            <div className="flex items-center justify-center h-[400px] text-sm text-muted-foreground">
                                Loading your lots...
                            </div>
                        )}
                        {isError && !isLoading && (
                            <div className="flex items-center justify-center h-[400px] text-sm text-red-600">
                                Unable to load your lots. Please try again.
                            </div>
                        )}
                        {!isLoading && !isError && lots.length > 0 ? (
                            <Table>
                                <TableHeader className="bg-[#FFF8EC]">
                                    <TableRow>
                                        <TableHead className="font-semibold text-[#1F2D3D]">Lot ID</TableHead>
                                        <TableHead className="font-semibold text-[#1F2D3D]">Grain Type</TableHead>
                                        <TableHead className="font-semibold text-[#1F2D3D]">Quantity</TableHead>
                                        <TableHead className="font-semibold text-[#1F2D3D]">Status</TableHead>
                                        <TableHead className="font-semibold text-[#1F2D3D]">Highest Bid</TableHead>
                                        <TableHead className="font-semibold text-[#1F2D3D]">Time Left</TableHead>
                                        <TableHead className="font-semibold text-[#1F2D3D] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lots.map((lot) => (
                                        <TableRow key={lot.id} className="hover:bg-[#FFF8EC]/50 transition-colors">
                                            <TableCell className="font-medium text-[#1F2D3D]">#{lot.id}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{lot.name}</span>
                                                    <span className="text-xs text-muted-foreground">{lot.location}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{lot.quantity}</TableCell>
                                            <TableCell>
                                                <Badge className={`rounded-full font-normal ${lot.status === 'LIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                    lot.status === 'UPCOMING' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                                                        'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}>
                                                    {lot.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-semibold text-[#2E7D32]">₹{lot.currentBid.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-[#7A6A58]">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span className="text-sm">{lot.timeLeft}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/auction/${lot.id}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => handleEditClick(lot)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDeleteClick(lot)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (!isLoading && !isError ? (
                            <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
                                <div className="h-20 w-20 bg-[#FFF8EC] rounded-full flex items-center justify-center mb-4">
                                    <Package className="h-10 w-10 text-[#DFA44A]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#1F2D3D]">You haven't created any lots yet.</h3>
                                <p className="text-[#7A6A58] mt-2 mb-6 max-w-md">Start selling your produce by creating your first auction lot. It takes less than 2 minutes.</p>
                                <Button
                                    onClick={() => navigate('/auction/create')}
                                    className="rounded-full bg-[#2E7D32] hover:bg-[#256428] text-white px-8"
                                >
                                    Create First Lot
                                </Button>
                            </div>
                        ) : null)}
                    </Card>
                </div>
            </main>

            {/* Modals */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                lotId={selectedLot?.id}
            />

            <EditLotModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                lot={selectedLot}
            />
        </div>
    );
};

export default MyLotsPage;
