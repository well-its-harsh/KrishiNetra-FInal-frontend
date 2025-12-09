import React from 'react';
import { Disease } from '../utils/typeDefinitions';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";

interface DiseaseFilterProps {
    diseases: Disease[];
    selectedDisease: string | null;
    onSelectDisease: (diseaseId: string | null) => void;
}

const DiseaseFilter: React.FC<DiseaseFilterProps> = ({ diseases, selectedDisease, onSelectDisease }) => {
    return (
        <div className="w-full flex justify-center">
            <ScrollArea className="w-full max-w-4xl whitespace-nowrap rounded-xl border border-[#D1B48C] bg-white p-2 shadow-sm">
                <div className="flex w-max space-x-2 p-1">
                    <button
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 border-2",
                            selectedDisease === null
                                ? "bg-[#3F5E46] text-white border-[#3F5E46] shadow-md"
                                : "bg-white text-[#7C8B56] border-transparent hover:border-[#D1B48C] hover:bg-[#FDFBF7]"
                        )}
                        onClick={() => onSelectDisease(null)}
                    >
                        All Goals
                    </button>
                    {diseases.map((disease) => {
                        const isSelected = selectedDisease === disease.disease_id;
                        return (
                            <button
                                key={disease.disease_id}
                                className={cn(
                                    "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 border-2",
                                    isSelected
                                        ? "bg-[#BC8F29] text-white border-[#BC8F29] shadow-md"
                                        : "bg-white text-[#556930] border-transparent hover:border-[#D1B48C] hover:bg-[#FDFBF7]"
                                )}
                                onClick={() => onSelectDisease(disease.disease_id)}
                            >
                                {disease.disease_name.split('(')[0].trim()}
                            </button>
                        );
                    })}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </div>
    );
};

export default DiseaseFilter;
