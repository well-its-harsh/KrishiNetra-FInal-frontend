import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, TrendingUp, Play, ShoppingCart, Heart } from "lucide-react";

const stories = [
    {
        id: 1,
        title: "Lakshmi SHG's Millet Revolution",
        subtitle: "From ₹5,000 to ₹50,000 monthly income",
        location: "Mandya, Karnataka",
        image: "/api/placeholder/400/250",
        type: "SHG",
        members: 15,
        products: ["Ragi Cookies", "Millet Laddu", "Foxtail Flour"],
        impact: {
            income: "₹50,000/month",
            families: 15,
            region: "Karnataka"
        },
        story: "Started with just 5 women, now empowering 15 families through millet-based products. Their organic ragi cookies are bestsellers across South India.",
        videoUrl: "#",
        shopLink: "/shop/lakshmi-shg"
    },
    {
        id: 2,
        title: "Green Valley FPO Success",
        subtitle: "Connecting 200+ farmers to premium markets",
        location: "Warangal, Telangana",
        image: "/api/placeholder/400/250",
        type: "FPO",
        members: 200,
        products: ["Pearl Millet", "Sorghum", "Little Millet"],
        impact: {
            income: "₹2.5L/month",
            families: 200,
            region: "Telangana"
        },
        story: "This FPO transformed 200 small farmers' lives by providing direct market access and fair pricing for their millet produce.",
        videoUrl: "#",
        shopLink: "/shop/green-valley-fpo"
    },
    {
        id: 3,
        title: "Annapurna Women's Collective",
        subtitle: "Traditional recipes, modern packaging",
        location: "Coimbatore, Tamil Nadu",
        image: "/api/placeholder/400/250",
        type: "SHG",
        members: 25,
        products: ["Millet Mix", "Health Drinks", "Baby Food"],
        impact: {
            income: "₹75,000/month",
            families: 25,
            region: "Tamil Nadu"
        },
        story: "25 women preserving traditional millet recipes while building a sustainable business. Their millet-based baby food is doctor-recommended.",
        videoUrl: "#",
        shopLink: "/shop/annapurna-collective"
    },
    {
        id: 4,
        title: "Sunrise Farmers Producer Company",
        subtitle: "Organic millet pioneers",
        location: "Nashik, Maharashtra",
        image: "/api/placeholder/400/250",
        type: "FPO",
        members: 150,
        products: ["Organic Bajra", "Jowar Flour", "Mixed Millet"],
        impact: {
            income: "₹1.8L/month",
            families: 150,
            region: "Maharashtra"
        },
        story: "Leading the organic millet movement in Maharashtra, this FPO has helped 150 farmers transition to chemical-free farming.",
        videoUrl: "#",
        shopLink: "/shop/sunrise-fpc"
    }
];

const getTypeColor = (type: string) => {
    return type === "SHG"
        ? "bg-pink-100 text-pink-800 border-pink-200"
        : "bg-blue-100 text-blue-800 border-blue-200";
};

const getTypeIcon = (type: string) => {
    return type === "SHG" ? "👩‍🤝‍👩" : "🌾";
};

interface ShgFpoStoriesProps {
    onBack?: () => void;
}

export const ShgFpoStories = ({ onBack }: ShgFpoStoriesProps) => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Inspiring Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 md:p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-12"></div>
                <div className="relative z-10 text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                        <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
                        SHG & FPO Stories
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Inspiring journeys of farmers, women's groups, and producer organizations transforming rural communities
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        <Badge className="bg-green-100 text-green-800 px-3 py-1">🌾 Farmer Stories</Badge>
                        <Badge className="bg-pink-100 text-pink-800 px-3 py-1">👩🌾 Women Empowerment</Badge>
                        <Badge className="bg-blue-100 text-blue-800 px-3 py-1">💰 Income Growth</Badge>
                    </div>
                </div>
            </div>

            {/* Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">👩‍🤝‍👩</div>
                        <h3 className="font-bold text-lg text-pink-800">50+</h3>
                        <p className="text-sm text-pink-700">Women SHGs</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">🌾</div>
                        <h3 className="font-bold text-lg text-blue-800">25+</h3>
                        <p className="text-sm text-blue-700">FPOs Connected</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
                        <h3 className="font-bold text-lg text-green-800">1000+</h3>
                        <p className="text-sm text-green-700">Families Empowered</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">💰</div>
                        <h3 className="font-bold text-lg text-yellow-800">₹10L+</h3>
                        <p className="text-sm text-yellow-700">Monthly Income Generated</p>
                    </CardContent>
                </Card>
            </div>

            {/* Inspiring Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stories.map(story => (
                    <Card key={story.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white rounded-2xl hover:-translate-y-2">
                        {/* Beautiful Image with Video Overlay */}
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={`https://images.unsplash.com/photo-${story.id === 1 ? '1559526324-4b87b5e36e44' : story.id === 2 ? '1574323347407-f5e1ad6d020b' : story.id === 3 ? '1586201375761-83865001e31c' : '1567620905586-95d1ca6f7980'}?w=500&h=300&fit=crop`}
                                alt={story.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            <div className="absolute top-4 left-4">
                                <Badge className={`${getTypeColor(story.type)} shadow-lg`}>
                                    {getTypeIcon(story.type)} {story.type}
                                </Badge>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white font-bold text-lg mb-1">{story.title}</h3>
                                <p className="text-emerald-200 text-sm font-medium">{story.subtitle}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute inset-0 bg-black/20 hover:bg-black/30 text-white opacity-0 hover:opacity-100 transition-opacity"
                            >
                                <Play className="h-12 w-12" />
                            </Button>
                        </div>

                        <CardContent className="p-6 space-y-4">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="h-4 w-4 text-[#7A6A58]" />
                                    <span className="text-sm text-[#7A6A58]">{story.location}</span>
                                </div>
                                <h3 className="font-bold text-lg text-[#1F2D3D] mb-1">{story.title}</h3>
                                <p className="text-sm text-[#2E7D32] font-semibold">{story.subtitle}</p>
                            </div>

                            {/* Story */}
                            <p className="text-sm text-[#7A6A58] leading-relaxed">{story.story}</p>

                            {/* Products */}
                            <div>
                                <p className="text-xs font-semibold text-[#1F2D3D] mb-2">Products:</p>
                                <div className="flex flex-wrap gap-1">
                                    {story.products.map(product => (
                                        <Badge key={product} className="bg-[#FFF8EC] text-[#7A6A58] text-xs hover:bg-[#FFE0B2]">
                                            {product}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Impact Metrics */}
                            <div className="grid grid-cols-3 gap-4 py-3 border-t border-[#E6DFD4]">
                                <div className="text-center">
                                    <TrendingUp className="h-4 w-4 text-[#2E7D32] mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-[#1F2D3D]">{story.impact.income}</p>
                                    <p className="text-xs text-[#7A6A58]">Income</p>
                                </div>
                                <div className="text-center">
                                    <Users className="h-4 w-4 text-[#2E7D32] mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-[#1F2D3D]">{story.impact.families}</p>
                                    <p className="text-xs text-[#7A6A58]">Families</p>
                                </div>
                                <div className="text-center">
                                    <MapPin className="h-4 w-4 text-[#2E7D32] mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-[#1F2D3D]">{story.impact.region}</p>
                                    <p className="text-xs text-[#7A6A58]">Region</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    className="flex-1 bg-[#2E7D32] hover:bg-[#256428] gap-2"
                                    size="sm"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Shop from this {story.type}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[#E6DFD4] text-[#7A6A58] hover:bg-[#FFF8EC]"
                                >
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-[#E4F5E6] to-[#F1F7DB] border-2 border-[#2E7D32]/20">
                <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-[#2E7D32] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#1F2D3D] mb-2">Join the Movement</h3>
                    <p className="text-[#7A6A58] mb-4">
                        Support rural communities by purchasing directly from SHGs and FPOs.
                        Every purchase creates sustainable livelihoods and preserves traditional knowledge.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Button className="bg-[#2E7D32] hover:bg-[#256428]">
                            Explore All Stories
                        </Button>
                        <Button variant="outline" className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#E4F5E6]">
                            Partner with Us
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
