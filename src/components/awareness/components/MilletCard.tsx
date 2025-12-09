import React from 'react';
import { Millet } from '../utils/typeDefinitions';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Leaf, Sparkles } from 'lucide-react';

interface MilletCardProps {
    millet: Millet;
    onViewDetails: (millet: Millet) => void;
}

const MilletCard: React.FC<MilletCardProps> = ({ millet, onViewDetails }) => {
    return (
        <Card className="rounded-xl border border-[#D1B48C] bg-white text-[#3F5E46] shadow-sm hover:shadow-xl hover:border-[#7C8B56] transition-all duration-300 h-full flex flex-col group overflow-hidden">
            {/* Top Header Section */}
            <div className="p-6 bg-[#FDFBF7] border-b border-[#F0E6D2] relative">
                <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="border-[#7C8B56] text-[#7C8B56] bg-white text-[10px] tracking-widest uppercase font-semibold">
                        {millet.type}
                    </Badge>
                    {millet.ayurvedic_profile.ama_reduction_score >= 8 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#BC8F29] bg-[#BC8F29]/10 px-2 py-0.5 rounded-full">
                            <Sparkles className="w-3 h-3" /> Detox
                        </span>
                    )}
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#3F5E46] mb-1 group-hover:text-[#BC8F29] transition-colors">
                    {millet.millet_name}
                </h3>
                <p className="text-xs font-medium text-[#7C8B56] italic">
                    {millet.botanical_name}
                </p>
            </div>

            <CardContent className="flex-1 p-6 pt-5 space-y-5">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-[#7C8B56]/5 border border-[#7C8B56]/10">
                        <span className="text-lg font-bold text-[#3F5E46]">{millet.nutritional_profile_per_100g.protein}<span className="text-[10px] font-normal">g</span></span>
                        <span className="text-[9px] uppercase tracking-widest text-[#7C8B56] font-semibold">Protein</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-[#7C8B56]/5 border border-[#7C8B56]/10">
                        <span className="text-lg font-bold text-[#3F5E46]">{millet.nutritional_profile_per_100g.fiber}<span className="text-[10px] font-normal">g</span></span>
                        <span className="text-[9px] uppercase tracking-widest text-[#7C8B56] font-semibold">Fiber</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-[#7C8B56]/5 border border-[#7C8B56]/10">
                        <span className={`text-lg font-bold ${millet.nutritional_profile_per_100g.glycemic_index < 55 ? 'text-emerald-600' : 'text-[#BC8F29]'}`}>
                            {millet.nutritional_profile_per_100g.glycemic_index}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-[#7C8B56] font-semibold">GI</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-3.5 h-3.5 text-[#BC8F29]" />
                        <span className="text-[11px] font-bold uppercase text-[#D1B48C] tracking-wide">Key Benefits</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {millet.diseases_or_conditions_it_helps.slice(0, 3).map((d, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-[#F3F6E9] text-[#556930]">
                                {d}
                            </span>
                        ))}
                        {millet.diseases_or_conditions_it_helps.length > 3 && (
                            <span className="inline-flex items-center px-1.5 py-1 rounded-md text-[10px] font-medium text-[#7C8B56] border border-[#D1B48C]/50">
                                +{millet.diseases_or_conditions_it_helps.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Button
                    variant="default"
                    className="w-full bg-[#3F5E46] hover:bg-[#2C4231] text-white rounded-xl h-11 text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
                    onClick={() => onViewDetails(millet)}
                >
                    Explore Benefits <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default MilletCard;
