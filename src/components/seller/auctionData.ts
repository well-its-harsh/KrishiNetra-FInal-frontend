export type AuctionStatus = 'LIVE' | 'UPCOMING' | 'CLOSED';

export interface AuctionLot {
    id: string;
    name: string;
    quantity: string;
    currentBid: number;
    timeLeft: string; // Static string for now e.g. "00:30:15"
    status: AuctionStatus;
    grainType: string;
    location: string;
    certification: string[];
    thumbnail?: string | null;
}

export const AUCTION_LOTS: AuctionLot[] = [
    {
        id: '1',
        name: 'Premium Foxtail Millet Bulk',
        quantity: '500 kg',
        currentBid: 45000,
        timeLeft: '00:45:20',
        status: 'LIVE',
        grainType: 'Foxtail',
        location: 'Karnataka',
        certification: ['Organic', 'FPO']
    },
    {
        id: '2',
        name: 'Barnyard Millet - Grade A',
        quantity: '2 tons',
        currentBid: 120000,
        timeLeft: '02:15:00',
        status: 'LIVE',
        grainType: 'Barnyard',
        location: 'Tamil Nadu',
        certification: ['Lab-tested']
    },
    {
        id: '3',
        name: 'Sorghum (Jowar) Harvest',
        quantity: '1000 kg',
        currentBid: 32000,
        timeLeft: '12:00:00',
        status: 'UPCOMING',
        grainType: 'Sorghum',
        location: 'Maharashtra',
        certification: ['FPO']
    },
    {
        id: '4',
        name: 'Finger Millet (Ragi) Lot',
        quantity: '5 tons',
        currentBid: 250000,
        timeLeft: 'Ended',
        status: 'CLOSED',
        grainType: 'Finger',
        location: 'Odisha',
        certification: ['Organic']
    },
    {
        id: '5',
        name: 'Little Millet Processing Batch',
        quantity: '750 kg',
        currentBid: 55000,
        timeLeft: '01:30:00',
        status: 'LIVE',
        grainType: 'Little',
        location: 'Andhra Pradesh',
        certification: ['Lab-tested', 'FPO']
    }
];

export const GRAIN_TYPES = ['Foxtail', 'Barnyard', 'Finger', 'Little', 'Sorghum', 'Pearl'];
export const CERTIFICATIONS = ['FPO/SHG', 'Organic', 'Lab-tested'];
