import React, { useState, useMemo } from 'react';
import ayurvedicData from './data/ayurvedicMillets.json';
import { AyurvedicData, Millet } from './utils/typeDefinitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilletCard from './components/MilletCard';
import MilletDetailsModal from './components/MilletDetailsModal';
import DiseaseFilter from './components/DiseaseFilter';
import DoshaQuiz from './components/DoshaQuiz';
import RecipesSuggestion from './components/RecipesSuggestion';
import AIGuideDrawer from './components/AIGuideDrawer';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Flame, Droplets, Wind, Leaf, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AwarenessPage: React.FC = () => {
    const navigate = useNavigate();
    const data = ayurvedicData as AyurvedicData;
    const [selectedMillet, setSelectedMillet] = useState<Millet | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);

    // Filter millets based on selected disease
    const filteredMillets = useMemo(() => {
        if (!selectedDiseaseId) return data.millets;

        // Find the disease name to match against the strings in millet array
        const diseaseObj = data.database_section_for_diseases.diseases.find(d => d.disease_id === selectedDiseaseId);
        if (!diseaseObj) return data.millets;

        const simpleName = diseaseObj.disease_name.split('(')[0].trim();

        return data.millets.filter(millet =>
            millet.diseases_or_conditions_it_helps.some(condition =>
                condition.includes(simpleName) || simpleName.includes(condition)
            )
        );
    }, [selectedDiseaseId, data.millets]);

    const handleMilletClick = (millet: Millet) => {
        setSelectedMillet(millet);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F6F0E4] relative overflow-hidden">
            {/* Decorative Mandala Patterns */}
            <div className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none z-20">
                <img src="https://i.pinimg.com/1200x/00/74/ec/0074eca7605dd9ec66f0d0e4d742a888.jpg" alt="" className="w-full h-full object-contain" />
            </div>
            <div className="absolute bottom-0 left-0 w-96 h-96 opacity-5 pointer-events-none z-20 rotate-180">
                <img src="https://i.pinimg.com/1200x/00/74/ec/0074eca7605dd9ec66f0d0e4d742a888.jpg" alt="" className="w-full h-full object-contain" />
            </div>

            {/* Hero Section */}
            <div className="relative z-30 border-b border-[#D9CBB3] bg-white">
                <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
                    <Button 
                        variant="ghost" 
                        className="mb-8 text-[#2F4F3A] hover:text-[#6B8E4E] hover:bg-[#EEF4EC] transition-all"
                        onClick={() => navigate('/dashboard/consumer')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#6B8E4E]" />
                                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#6B8E4E]">आयुर्वेद • Ancient Wisdom</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#2F4F3A] leading-tight">
                                Ayurvedic
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E4E] to-[#2F4F3A]">Millet Guide</span>
                            </h1>
                            
                            <p className="text-[#5B4D3B] text-lg md:text-xl leading-relaxed max-w-xl">
                                Journey through 5,000 years of Vedic wisdom. Discover sacred grains aligned with your Prakriti, harmonizing body, mind, and spirit.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-[#6B8E4E] to-[#2F4F3A] hover:from-[#5A7A42] hover:to-[#243D2E] text-white shadow-2xl hover:shadow-[#6B8E4E]/50 transition-all duration-300 rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest group"
                                    onClick={() => setIsAIOpen(true)}
                                >
                                    <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                    AI Vaidya Advisor
                                </Button>
                            </div>

                            {/* Dosha Icons */}
                            <div className="flex gap-6 pt-6">
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Flame className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-[#C48A6A]">Pitta</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Droplets className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-[#C48A6A]">Kapha</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Wind className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-[#C48A6A]">Vata</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block relative">
                            <div className="relative w-full h-[500px] rounded-[30px] overflow-hidden shadow-2xl border border-[#D9CBB3]">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                >
                                    <source src="/myvideo.mp4" type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2F4F3A]/80 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-white text-sm font-serif italic">"When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need." - Ayurvedic Proverb</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-12 px-4 md:px-8 space-y-12 relative z-30">

                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-[#F4EFE6] to-[#E3D9C6] rounded-[24px] p-6 border border-[#D9CBB3] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all group">
                        <div className="w-12 h-12 rounded-full bg-[#FFF4E0] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Sun className="w-6 h-6 text-[#D4A017]" />
                        </div>
                        <h3 className="text-xl font-serif font-semibold text-[#2F4F3A] mb-2">Dinacharya</h3>
                        <p className="text-[#5B4D3B] text-sm">Align your meals with natural circadian rhythms for optimal digestion and vitality.</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#F4EFE6] to-[#E3D9C6] rounded-[24px] p-6 border border-[#D9CBB3] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all group">
                        <div className="w-12 h-12 rounded-full bg-[#EEF4EC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Leaf className="w-6 h-6 text-[#6B8E4E]" />
                        </div>
                        <h3 className="text-xl font-serif font-semibold text-[#2F4F3A] mb-2">Prakriti Balance</h3>
                        <p className="text-[#5B4D3B] text-sm">Discover millets that harmonize your unique constitutional type and restore equilibrium.</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#F4EFE6] to-[#E3D9C6] rounded-[24px] p-6 border border-[#D9CBB3] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all group">
                        <div className="w-12 h-12 rounded-full bg-[#F5E6DC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Moon className="w-6 h-6 text-[#C48A6A]" />
                        </div>
                        <h3 className="text-xl font-serif font-semibold text-[#2F4F3A] mb-2">Rasa Therapy</h3>
                        <p className="text-[#5B4D3B] text-sm">Experience the six tastes (Shad Rasa) through ancient grain wisdom.</p>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="bg-gradient-to-r from-white/95 to-amber-50/95 backdrop-blur-md border-2 border-amber-300/50 rounded-full p-1.5 shadow-2xl inline-flex w-full md:w-auto overflow-x-auto">
                            <TabsTrigger
                                value="overview"
                                className="rounded-full px-8 py-3 text-sm font-bold text-amber-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                            >
                                Sacred Grains
                            </TabsTrigger>
                            <TabsTrigger
                                value="disease"
                                className="rounded-full px-8 py-3 text-sm font-bold text-amber-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                            >
                                Healing Path
                            </TabsTrigger>
                            <TabsTrigger
                                value="dosha"
                                className="rounded-full px-8 py-3 text-sm font-bold text-amber-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                            >
                                Prakriti Quiz
                            </TabsTrigger>
                            <TabsTrigger
                                value="recipes"
                                className="rounded-full px-8 py-3 text-sm font-bold text-amber-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                            >
                                Vedic Kitchen
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {data.millets.map((millet, idx) => (
                                <div key={millet.millet_id} className="h-full" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <MilletCard millet={millet} onViewDetails={handleMilletClick} />
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Disease-Wise Guide Tab */}
                    <TabsContent value="disease" className="space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gradient-to-br from-white/95 to-amber-50/90 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-amber-300/50 shadow-2xl">
                            <div className="mb-12 text-center max-w-3xl mx-auto">
                                <div className="inline-block mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto shadow-lg">
                                        <Flame className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">Chikitsa - Healing Path</h2>
                                <p className="text-amber-800 text-lg">Select your health concern to discover ancient grain remedies backed by 5,000 years of Ayurvedic wisdom.</p>
                            </div>

                            <DiseaseFilter
                                diseases={data.database_section_for_diseases.diseases}
                                selectedDisease={selectedDiseaseId}
                                onSelectDisease={setSelectedDiseaseId}
                            />

                            <div className="mt-12">
                                {filteredMillets.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {filteredMillets.map((millet) => (
                                            <MilletCard key={millet.millet_id} millet={millet} onViewDetails={handleMilletClick} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="bg-[#F3F6E9] p-6 rounded-full mb-4">
                                            <Sparkles className="h-8 w-8 text-[#BC8F29]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#3F5E46] mb-2">No direct matches found</h3>
                                        <p className="text-[#556930] max-w-md mb-6">Our basic database doesn't finding a precise match. Our AI Advisor might have more specific insights.</p>
                                        <Button variant="outline" className="border-[#BC8F29] text-[#BC8F29] hover:bg-[#BC8F29]/10" onClick={() => setIsAIOpen(true)}>Ask AI Advisor</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Dosha Quiz Tab */}
                    <TabsContent value="dosha" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="max-w-5xl mx-auto py-12">
                            <div className="text-center mb-16 relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                    <img src="https://i.pinimg.com/736x/05/d1/c1/05d1c13d6d8743fb515bc382e6676695.jpg" alt="" className="w-96 h-96 object-contain" />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-600 mb-3 block">आत्मज्ञान • Self Knowledge</span>
                                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-amber-900 mb-6">
                                        Discover Your
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Prakriti</span>
                                    </h2>
                                    <p className="text-amber-800 max-w-2xl mx-auto text-lg leading-relaxed">
                                        Unlock your unique Ayurvedic constitution through ancient diagnostic wisdom. Learn which sacred millets harmonize your Vata, Pitta, and Kapha energies.
                                    </p>
                                </div>
                            </div>
                            <DoshaQuiz personalizationData={data.user_personalization} />
                        </div>
                    </TabsContent>

                    {/* Recipes Tab */}
                    <TabsContent value="recipes" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-md rounded-3xl p-8 border-2 border-amber-300/50 shadow-xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                            <Leaf className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900">Vedic Kitchen</h2>
                                            <p className="text-amber-800 mt-1">Seasonal and medicinal recipes for deep healing</p>
                                        </div>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1596040033229-a0b3b83a6c8c?w=200&h=200&fit=crop" alt="" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                                </div>
                            </div>
                            <RecipesSuggestion millets={data.millets} />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Modals & Drawers */}
                <MilletDetailsModal
                    millet={selectedMillet}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />

                <AIGuideDrawer
                    isOpen={isAIOpen}
                    onClose={() => setIsAIOpen(false)}
                    data={data}
                />

            </div>
        </div>
    );
};

export default AwarenessPage;
