import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const AuctionCardSkeleton = () => {
    return (
        <Card className="overflow-hidden rounded-[24px] border border-[#E6DFD4] bg-[#FFF8EC]/50 shadow-sm">
            <Skeleton className="h-48 w-full bg-[#E6DFD4]/50" />
            <CardContent className="p-5 space-y-3">
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-[#E6DFD4]" />
                    <Skeleton className="h-5 w-16 rounded-full bg-[#E6DFD4]" />
                </div>
                <Skeleton className="h-6 w-3/4 bg-[#E6DFD4]" />
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full bg-[#E6DFD4]/50" />
                    <Skeleton className="h-5 w-16 rounded-full bg-[#E6DFD4]/50" />
                </div>
                <div className="pt-2 flex justify-between items-center">
                    <Skeleton className="h-8 w-24 bg-[#E6DFD4]" />
                    <Skeleton className="h-9 w-24 rounded-full bg-[#E6DFD4]" />
                </div>
            </CardContent>
        </Card>
    );
};

export const AuctionTableSkeleton = () => {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-[#E6DFD4] rounded-xl bg-white">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg bg-[#E6DFD4]" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-[#E6DFD4]" />
                            <Skeleton className="h-3 w-20 bg-[#E6DFD4]/50" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-20 bg-[#E6DFD4]" />
                    <Skeleton className="h-6 w-24 bg-[#E6DFD4]" />
                    <Skeleton className="h-8 w-8 rounded-full bg-[#E6DFD4]" />
                </div>
            ))}
        </div>
    );
};

export const DetailSkeleton = () => {
    return (
        <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-[24px] bg-[#E6DFD4]" />
                <div className="flex gap-4">
                    <Skeleton className="h-24 w-24 rounded-[12px] bg-[#E6DFD4]" />
                    <Skeleton className="h-24 w-24 rounded-[12px] bg-[#E6DFD4]" />
                    <Skeleton className="h-24 w-24 rounded-[12px] bg-[#E6DFD4]" />
                </div>
            </div>
            <div className="space-y-6">
                <Skeleton className="h-4 w-32 bg-[#E6DFD4]" />
                <Skeleton className="h-10 w-3/4 bg-[#E6DFD4]" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20 rounded-[22px] bg-[#E6DFD4]" />
                    <Skeleton className="h-20 rounded-[22px] bg-[#E6DFD4]" />
                </div>
                <Skeleton className="h-40 rounded-[22px] bg-[#E6DFD4]" />
            </div>
        </div>
    );
};
