import React from 'react';
import { Millet } from '../utils/typeDefinitions';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat } from 'lucide-react';

interface RecipesSuggestionProps {
    millets: Millet[];
}

const RecipesSuggestion: React.FC<RecipesSuggestionProps> = ({ millets }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {millets.map(millet => (
                millet.recommended_ayurvedic_recipes.map((recipe, idx) => (
                    <Card key={`${millet.millet_id}-${idx}`} className="hover:shadow-lg transition-all duration-300 border border-[#D1B48C]/30 bg-white group overflow-hidden rounded-xl">
                        <CardHeader className="bg-[#FDFBF7] pb-4 border-b border-[#D1B48C]/20">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="border-[#7C8B56] text-[#7C8B56] bg-white text-[10px] tracking-widest uppercase">{millet.millet_name}</Badge>
                                <div className="p-2 bg-[#BC8F29]/10 rounded-full">
                                    <ChefHat className="h-4 w-4 text-[#BC8F29]" />
                                </div>
                            </div>
                            <CardTitle className="text-lg mt-2 font-serif font-bold text-[#3F5E46] group-hover:text-[#BC8F29] transition-colors">{recipe.recipe_name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-3">
                            <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-[#F3F6E9]">
                                <span className="text-[#556930] font-medium">Ayurvedic Focus</span>
                                <span className="font-bold text-[#3F5E46]">{recipe.dosha_focus}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm px-2">
                                <span className="text-[#7C8B56]">Best Season</span>
                                <span className="font-medium text-[#3F5E46] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#BC8F29]"></span>
                                    {recipe.season}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ))}
        </div>
    );
};

export default RecipesSuggestion;
