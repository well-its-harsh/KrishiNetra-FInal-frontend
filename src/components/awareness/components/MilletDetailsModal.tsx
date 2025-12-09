import React from 'react';
import { Millet } from '../utils/typeDefinitions';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Leaf, Activity, AlertTriangle, Utensils, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MilletDetailsModalProps {
    millet: Millet | null;
    isOpen: boolean;
    onClose: () => void;
}

const MilletDetailsModal: React.FC<MilletDetailsModalProps> = ({ millet, isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!millet) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-[90vw] h-[85vh] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-[#7C8B56]/30 shadow-2xl rounded-2xl flex flex-col">

                {/* Header Section */}
                <div className="p-6 pb-4 border-b border-[#BC8F29]/20 bg-[#F9F5F0]">
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="border-[#7C8B56] text-[#3F5E46] bg-[#7C8B56]/10 px-3 py-1">
                            {millet.type}
                        </Badge>
                    </div>
                    <DialogTitle className="text-3xl md:text-4xl font-serif text-[#3F5E46] mb-1">
                        {millet.millet_name}
                    </DialogTitle>
                    <DialogDescription className="text-[#7C8B56] italic font-medium">
                        {millet.botanical_name}
                    </DialogDescription>
                </div>

                <ScrollArea className="flex-1 p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Left Column: Stats & Ayurveda */}
                        <div className="space-y-6">
                            {/* Nutritional Gems */}
                            <div className="bg-[#7C8B56]/5 rounded-xl p-5 border border-[#7C8B56]/10">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#3F5E46]">
                                    <Activity className="h-5 w-5 text-[#BC8F29]" />
                                    Nutritional Essentials
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-2">
                                        <span className="block text-2xl font-bold text-[#3F5E46]">{millet.nutritional_profile_per_100g.protein}g</span>
                                        <span className="text-xs uppercase text-[#7C8B56] font-semibold tracking-wider">Protein</span>
                                    </div>
                                    <div className="text-center p-2 border-l border-[#7C8B56]/20">
                                        <span className="block text-2xl font-bold text-[#3F5E46]">{millet.nutritional_profile_per_100g.fiber}g</span>
                                        <span className="text-xs uppercase text-[#7C8B56] font-semibold tracking-wider">Fiber</span>
                                    </div>
                                    <div className="text-center p-2 border-l border-[#7C8B56]/20">
                                        <span className={`block text-2xl font-bold ${millet.nutritional_profile_per_100g.glycemic_index < 55 ? 'text-emerald-700' : 'text-[#BC8F29]'}`}>
                                            {millet.nutritional_profile_per_100g.glycemic_index}
                                        </span>
                                        <span className="text-xs uppercase text-[#7C8B56] font-semibold tracking-wider">GI</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ayurvedic Profile */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#3F5E46]">
                                    <Leaf className="h-5 w-5 text-[#7C8B56]" />
                                    Ayurvedic Properties
                                </h3>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 bg-[#FDFBF7] rounded-lg border border-[#D1B48C]/50">
                                        <span className="text-[10px] uppercase font-bold text-[#BC8F29]">Virya (Potency)</span>
                                        <p className="font-medium text-[#3F5E46]">{millet.ayurvedic_profile.virya}</p>
                                    </div>
                                    <div className="p-3 bg-[#FDFBF7] rounded-lg border border-[#D1B48C]/50">
                                        <span className="text-[10px] uppercase font-bold text-[#BC8F29]">Vipaka (Post-Digestive)</span>
                                        <p className="font-medium text-[#3F5E46]">{millet.ayurvedic_profile.vipaka}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="bg-[#7C8B56]/10 text-[#3F5E46] hover:bg-[#7C8B56]/20">
                                        Guna: {millet.ayurvedic_profile.guna}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-[#7C8B56]/10 text-[#3F5E46] hover:bg-[#7C8B56]/20">
                                        Ama Score: {millet.ayurvedic_profile.ama_reduction_score}/10
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Benefits & Usage */}
                        <div className="space-y-6">
                            {/* Synopsis */}
                            <div className="bg-[#BC8F29]/5 p-5 rounded-xl border border-[#BC8F29]/10">
                                <p className="text-[#3F5E46] leading-relaxed italic">
                                    "{millet.ayurvedic_reasoning_why_it_helps_disease}"
                                </p>
                            </div>

                            {/* Targeted Benefits */}
                            <div>
                                <h4 className="text-sm font-bold uppercase text-[#7C8B56] tracking-wider mb-3">Therapeutic Benefits</h4>
                                <div className="flex flex-wrap gap-2">
                                    {millet.diseases_or_conditions_it_helps.map((condition, idx) => (
                                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-[#F3F6E9] text-[#556930] border border-[#DCE4C5]">
                                            {condition}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-[#D1B48C]/30" />

                            {/* Recipe Highlight */}
                            <div>
                                <h4 className="text-sm font-bold uppercase text-[#7C8B56] tracking-wider mb-2 flex items-center gap-2">
                                    <Utensils className="h-4 w-4" /> Recommended Recipe
                                </h4>
                                {millet.recommended_ayurvedic_recipes.map((recipe, idx) => (
                                    <div key={idx} className="p-3 rounded-lg border border-dashed border-[#BC8F29] bg-[#FFFCF5]">
                                        <p className="font-bold text-[#8C483F]">{recipe.recipe_name}</p>
                                        <p className="text-xs text-[#BC8F29] mt-1">{recipe.dosha_focus} • {recipe.season}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Contraindications Warning */}
                            {millet.contraindications.who_should_avoid && (
                                <div className="flex gap-2 items-start p-3 bg-red-50 rounded-lg text-xs text-red-800 border-l-2 border-red-400">
                                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold">Ayurvedic Precaution:</span> {millet.contraindications.who_should_avoid}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </ScrollArea>

                <div className="p-6 border-t border-[#BC8F29]/20 bg-[#F9F5F0] flex justify-end">
                    <Button
                        onClick={() => navigate(`/dashboard/consumer?query=${millet.millet_name}`)}
                        className="bg-[#BC8F29] hover:bg-[#BC8F29]/90 text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-[#BC8F29]/20 transition-all"
                    >
                        Find {millet.millet_name} Products <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default MilletDetailsModal;
