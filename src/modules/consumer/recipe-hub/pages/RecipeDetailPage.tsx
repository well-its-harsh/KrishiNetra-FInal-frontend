import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/consumer/button";
import { Badge } from "@/components/ui/consumer/badge";
import { Clock, Users, ArrowLeft, Heart, Share2, ShoppingCart, Bookmark, ChefHat } from "lucide-react";
import { getRecipeBySlug } from "../data/recipes";

const RecipeDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const recipe = getRecipeBySlug(slug || "");
    const [imgSrc, setImgSrc] = useState(recipe?.image || "");
    const [hasError, setHasError] = useState(false);

    if (!recipe) {
        return (
            <div className="min-h-screen bg-[#FFF8EC]">
                <Navigation />
                <div className="container flex flex-col items-center justify-center py-20 text-center">
                    <h2 className="text-2xl font-bold text-[#1F2D3D]">Recipe not found</h2>
                    <p className="mb-6 text-[#7A6A58]">The recipe you are looking for does not exist.</p>
                    <Button asChild className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                        <Link to="/dashboard/consumer/recipes">Back to Recipes</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const handleError = () => {
        if (!hasError) {
            setImgSrc("https://images.unsplash.com/photo-1505253758473-96b701d8fe52?q=80&w=2448&auto=format&fit=crop");
            setHasError(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8EC]">
            <Navigation />

            <main className="pb-16">
                {/* Hero Section */}
                <div className="relative h-[400px] w-full overflow-hidden md:h-[500px]">
                    <img
                        src={imgSrc}
                        alt={recipe.title}
                        className="h-full w-full object-cover"
                        onError={handleError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2D3D] via-transparent to-transparent opacity-90" />

                    <div className="absolute top-6 left-4 md:left-8 z-10">
                        <Link
                            to="/dashboard/consumer/recipes"
                            className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Hub
                        </Link>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                        <div className="container mx-auto">
                            <div className="mb-4 flex flex-wrap gap-2">
                                <Badge className="bg-[#2E7D32] text-white hover:bg-[#2E7D32]">{recipe.milletType || "Millet"}</Badge>
                                <Badge className="bg-white/20 text-white backdrop-blur-md hover:bg-white/30">{recipe.mealType}</Badge>
                                {recipe.festive && (
                                    <Badge className="bg-[#DFA44A] text-white hover:bg-[#DFA44A]">Festive Special</Badge>
                                )}
                            </div>
                            <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">{recipe.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/90">
                                <span className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    {recipe.prepTime || "30 mins"} Prep
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    {recipe.cookTime || "15 mins"} Cook
                                </span>
                                <span className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    {recipe.serves ? `${recipe.serves} Servings` : "2 Servings"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto mt-8 px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Left Column: Ingredients & Nutrition */}
                        <div className="space-y-6">
                            {/* Actions Card */}
                            <div className="rounded-2xl border border-[#E6DFD4] bg-white p-6 shadow-sm">
                                <div className="flex gap-3">
                                    <Button className="flex-1 gap-2 bg-[#2E7D32] hover:bg-[#1B5E20]">
                                        <ShoppingCart className="h-4 w-4" /> Shop Ingredients
                                    </Button>
                                    <Button variant="outline" size="icon" className="border-[#E6DFD4] text-[#7A6A58] hover:bg-[#FFF8EC]">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="border-[#E6DFD4] text-[#7A6A58] hover:bg-[#FFF8EC]">
                                        <Bookmark className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="border-[#E6DFD4] text-[#7A6A58] hover:bg-[#FFF8EC]">
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Ingredients */}
                            <div className="rounded-2xl border border-[#E6DFD4] bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-xl font-bold text-[#1F2D3D]">Ingredients</h3>
                                <ul className="space-y-3">
                                    {recipe.ingredients.length > 0 ? (
                                        recipe.ingredients.map((ingredient, index) => (
                                            <li key={index} className="flex items-start gap-3 text-[#5F4F36]">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DFA44A]" />
                                                <span>{ingredient}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-[#7A6A58] italic">Ingredients not listed.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Nutrition */}
                            <div className="rounded-2xl border border-[#E6DFD4] bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-xl font-bold text-[#1F2D3D]">Nutrition Facts</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-[#FFF8EC] p-3 text-center">
                                        <p className="text-xs font-medium text-[#7A6A58] uppercase">Energy</p>
                                        <p className="text-lg font-bold text-[#2E7D32]">{recipe.nutrition.energy || "-"}</p>
                                    </div>
                                    <div className="rounded-lg bg-[#FFF8EC] p-3 text-center">
                                        <p className="text-xs font-medium text-[#7A6A58] uppercase">Protein</p>
                                        <p className="text-lg font-bold text-[#2E7D32]">{recipe.nutrition.protein || "-"}</p>
                                    </div>
                                    <div className="rounded-lg bg-[#FFF8EC] p-3 text-center">
                                        <p className="text-xs font-medium text-[#7A6A58] uppercase">Carbs</p>
                                        <p className="text-lg font-bold text-[#2E7D32]">{recipe.nutrition.carbohydrates || "-"}</p>
                                    </div>
                                    <div className="rounded-lg bg-[#FFF8EC] p-3 text-center">
                                        <p className="text-xs font-medium text-[#7A6A58] uppercase">Fiber</p>
                                        <p className="text-lg font-bold text-[#2E7D32]">{recipe.nutrition.fiber || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Instructions */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-2xl border border-[#E6DFD4] bg-white p-6 shadow-sm md:p-8">
                                <h3 className="mb-6 text-2xl font-bold text-[#1F2D3D]">Instructions</h3>
                                <div className="space-y-8">
                                    {recipe.instructions.length > 0 ? (
                                        recipe.instructions.map((step, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-sm font-bold text-white">
                                                    {index + 1}
                                                </div>
                                                <p className="pt-1 text-lg leading-relaxed text-[#5F4F36]">{step}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[#7A6A58] italic">Instructions not listed.</p>
                                    )}
                                </div>
                            </div>

                            {/* CTA Banner */}
                            <div className="overflow-hidden rounded-2xl bg-[#2E7D32] p-8 text-white relative">
                                <div className="relative z-10">
                                    <h3 className="mb-2 text-2xl font-bold">Ready to cook this?</h3>
                                    <p className="mb-6 text-white/80">Get all fresh organic millet ingredients delivered to your doorstep.</p>
                                    <Button className="bg-white text-[#2E7D32] hover:bg-white/90">
                                        Order Ingredients Now
                                    </Button>
                                </div>
                                <ChefHat className="absolute -bottom-6 -right-6 h-48 w-48 text-white/10 rotate-12" />
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default RecipeDetailPage;
