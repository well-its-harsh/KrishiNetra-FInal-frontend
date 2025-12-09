import { useState } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { Input } from "@/components/ui/consumer/input";
import { Search, ChefHat, Filter } from "lucide-react";
import { recipes, Recipe } from "../data/recipes";
import { RecipeCard } from "../components/RecipeCard";
import DualSearchBar from "@/components/common/DualSearchBar";
import { recipesData } from "@/assets/data/recipesData";

const makeSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};

const mapLocalRecipeToRecipe = (localRecipe: any): Recipe => ({
    id: parseInt(localRecipe.id),
    slug: makeSlug(localRecipe.title),
    title: localRecipe.title,
    region: "Global",
    mealType: "Lunch", // Default
    milletType: "Mixed Millet",
    category: ["Lunch"],
    festive: false,
    prepTime: localRecipe.time,
    cookTime: "0 mins",
    serves: 2,
    image: localRecipe.image,
    imagePrompt: "",
    ingredients: localRecipe.ingredients,
    instructions: [],
    nutrition: {
        energy: localRecipe.calories,
        protein: "",
        carbohydrates: "",
        fat: "",
        fiber: ""
    }
});

const RecipeHubPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [aiResults, setAiResults] = useState<any[] | null>(null);

    const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks"];
    const milletTypes = ["All", "Ragi", "Jowar", "Bajra", "Foxtail", "Little", "Kodo"];
    const [selectedMillet, setSelectedMillet] = useState("All");

    const filteredRecipes = aiResults
        ? aiResults.map(mapLocalRecipeToRecipe)
        : recipes.filter((recipe) => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All" || recipe.mealType === selectedCategory;
            const matchesMillet = selectedMillet === "All" || (recipe.milletType && recipe.milletType.includes(selectedMillet));
            return matchesSearch && matchesCategory && matchesMillet;
        });

    const handleAiResults = (results: any[]) => {
        setAiResults(results);
    };

    const handleNormalSearch = (query: string) => {
        setSearchTerm(query);
        if (query === "") {
            setAiResults(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8EC]">
            <Navigation />

            <main className="container px-4 py-8 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-[#2E7D32]">
                            <ChefHat className="h-6 w-6" />
                            <span className="text-sm font-semibold uppercase tracking-wider">Culinary Corner</span>
                        </div>
                        <h1 className="text-3xl font-bold text-[#1F2D3D] md:text-4xl">Millet Recipe Hub</h1>
                        <p className="mt-2 text-[#7A6A58]">Discover healthy, delicious, and traditional millet recipes.</p>
                    </div>

                    <div className="w-full max-w-md">
                        <div className="relative">
                            <DualSearchBar
                                onSearch={handleNormalSearch}
                                onAiResults={handleAiResults}
                                type="recipes"
                                data={recipesData}
                                placeholder="Search recipes (e.g., Ragi Dosa)..."
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-2 text-sm font-medium text-[#1F2D3D]">
                            <Filter className="h-4 w-4" /> Meal Type:
                        </span>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${selectedCategory === category
                                    ? "border-[#2E7D32] bg-[#2E7D32] text-white shadow-md"
                                    : "border-[#E6DFD4] bg-white text-[#7A6A58] hover:border-[#2E7D32] hover:text-[#2E7D32]"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-[#1F2D3D]">Millet Type:</span>
                        {milletTypes.map((millet) => (
                            <button
                                key={millet}
                                onClick={() => setSelectedMillet(millet)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${selectedMillet === millet
                                    ? "border-[#DFA44A] bg-[#FFF8EC] text-[#DFA44A]"
                                    : "border-transparent bg-transparent text-[#7A6A58] hover:bg-[#FFF8EC]"
                                    }`}
                            >
                                {millet}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <div className="mb-4 rounded-full bg-[#E6DFD4]/30 p-6">
                                <ChefHat className="h-12 w-12 text-[#B09782]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#1F2D3D]">No recipes found</h3>
                            <p className="text-[#7A6A58]">Try adjusting your search or filters.</p>
                            {aiResults && (
                                <button
                                    onClick={() => setAiResults(null)}
                                    className="mt-4 text-sm text-[#2E7D32] hover:underline"
                                >
                                    Clear AI Search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RecipeHubPage;
