import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGeminiSearch } from '@/hooks/useGeminiSearch';

interface AiSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'products' | 'recipes';
    initialData: any[];
    onResultsFound: (results: any[]) => void;
}

const AiSearchModal: React.FC<AiSearchModalProps> = ({ isOpen, onClose, type, initialData, onResultsFound }) => {
    const [query, setQuery] = useState("");
    const { search, results, loading, aiResponseText } = useGeminiSearch(initialData);

    useEffect(() => {
        if (results && results.length > 0) {
            onResultsFound(results);
        }
    }, [results, onResultsFound]);

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (!query.trim()) return;
        await search(query, type);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#0D5B36]/20 animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-[#0D5B36] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Sparkles className="h-5 w-5 text-yellow-300" />
                        <h3 className="font-semibold text-lg">AI Smart Search</h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 bg-[#FDFBF7]">

                    {/* AI Response Area */}
                    <div className="min-h-[150px] bg-white rounded-xl p-4 border border-gray-100 shadow-inner">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                                <Loader2 className="h-8 w-8 animate-spin text-[#0D5B36]" />
                                <p className="text-sm">Analyzing your request...</p>
                            </div>
                        ) : aiResponseText ? (
                            <div className="prose prose-sm">
                                <p className="text-[#1F2D3D] leading-relaxed">{aiResponseText}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                                <Sparkles className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm">
                                    {type === 'products'
                                        ? "Try: \"I want gluten-free snacks for my kids\""
                                        : "Try: \"I have bajra and curd, what can I make?\""}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-2">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder={type === 'products' ? "Describe what you're looking for..." : "Enter ingredients or preferences..."}
                            className="flex-1 border-[#0D5B36]/20 focus-visible:ring-[#0D5B36]"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                            className="bg-[#0D5B36] hover:bg-[#094026] text-white"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiSearchModal;
