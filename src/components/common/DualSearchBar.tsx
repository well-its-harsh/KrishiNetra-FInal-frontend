import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AiSearchModal from '../aiSearch/AiSearchModal';

interface DualSearchBarProps {
    onSearch: (query: string) => void;
    onAiResults: (results: any[]) => void;
    type: 'products' | 'recipes';
    data: any[];
    placeholder?: string;
}

const DualSearchBar: React.FC<DualSearchBarProps> = ({ onSearch, onAiResults, type, data, placeholder }) => {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleNormalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <div className="relative w-full max-w-xl mx-auto">
            <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        value={searchQuery}
                        onChange={handleNormalSearch}
                        placeholder={placeholder || "Search..."}
                        className="pl-10 pr-4 h-12 rounded-full border-gray-200 shadow-sm focus-visible:ring-[#0D5B36]"
                    />
                </div>

                <Button
                    onClick={() => setIsAiModalOpen(true)}
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-[#0D5B36] to-[#1a8f5a] hover:from-[#094026] hover:to-[#147a4d] shadow-md p-0 flex items-center justify-center transition-all hover:scale-105"
                    title="AI Smart Search"
                >
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                </Button>
            </div>

            <AiSearchModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                type={type}
                initialData={data}
                onResultsFound={(results) => {
                    onAiResults(results);
                    // Optional: Close modal on success? Or keep open?
                    // User might want to read the AI text.
                    // setIsAiModalOpen(false); 
                }}
            />
        </div>
    );
};

export default DualSearchBar;
