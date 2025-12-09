import { Recipe } from "../data/recipes";
import { useState } from "react";
import { Clock, Users, ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/consumer/badge";
import { Button } from "@/components/ui/consumer/button";

interface RecipeCardProps {
    recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
    const [imgSrc, setImgSrc] = useState(recipe.image);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setImgSrc("https://images.unsplash.com/photo-1505253758473-96b701d8fe52?q=80&w=2448&auto=format&fit=crop");
            setHasError(true);
        }
    };

    return (
        <Link to={`/dashboard/consumer/recipes/${recipe.slug}`} className="group block h-full">
            <div className="relative h-full overflow-hidden rounded-[20px] border border-[#E6DFD4] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(95,79,54,0.15)]">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={imgSrc}
                        alt={recipe.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={handleError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <Badge className="bg-white/90 text-[#2E7D32] hover:bg-white backdrop-blur-sm shadow-sm">
                            {recipe.milletType || "Millet"}
                        </Badge>
                        {recipe.festive && (
                            <Badge className="bg-[#DFA44A]/90 text-white hover:bg-[#DFA44A] backdrop-blur-sm shadow-sm">
                                Festive Special
                            </Badge>
                        )}
                    </div>

                    <button className="absolute top-3 right-3 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/40">
                        <Heart className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col p-5">
                    <div className="mb-2 flex items-center justify-between text-xs text-[#8C7B67]">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {recipe.prepTime || "30 mins"}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {recipe.serves ? `${recipe.serves} servings` : "2 servings"}
                        </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-[#1F2D3D] line-clamp-1 group-hover:text-[#2E7D32] transition-colors">
                        {recipe.title}
                    </h3>

                    <p className="mb-4 text-sm text-[#7A6A58] line-clamp-2">
                        A delicious {recipe.region} delicacy made with {recipe.milletType || "millet"} perfect for {recipe.mealType.toLowerCase()}.
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-[#E6DFD4] pt-4">
                        <span className="text-xs font-medium text-[#B09782] uppercase tracking-wider">
                            {recipe.mealType}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 rounded-full text-[#2E7D32] hover:bg-[#2E7D32]/10 hover:text-[#2E7D32] px-0"
                        >
                            View Recipe <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};
