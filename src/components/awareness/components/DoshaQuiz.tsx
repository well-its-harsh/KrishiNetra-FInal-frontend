import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { AyurvedicData } from '../utils/typeDefinitions';
import { ArrowRight, RefreshCcw } from 'lucide-react';

interface DoshaQuizProps {
    personalizationData: AyurvedicData['user_personalization'];
}

// Simple logic to determine Dosha
// Usually much more complex, but for this module creating a simplified version based on provided data/context
// Questions derived from general Ayurveda knowledge to map to Vata/Pitta/Kapha
const QUESTIONS = [
    {
        id: 1,
        text: "How does your body typically react to weather?",
        options: [
            { id: 'v', text: "I dislike cold and dry weather. My skin gets dry easily.", dosha: 'Vata' },
            { id: 'p', text: "I dislike hot weather. I sweat easily and get overheated.", dosha: 'Pitta' },
            { id: 'k', text: "I dislike damp and cold weather. I tend to retain water.", dosha: 'Kapha' }
        ]
    },
    {
        id: 2,
        text: "How is your digestion usually?",
        options: [
            { id: 'v', text: "Irregular over varied. Sometimes I'm hungry, sometimes not. Gas/Bloating is common.", dosha: 'Vata' },
            { id: 'p', text: "Strong and intense. I get irritable if I miss a meal. Acidity is occasional.", dosha: 'Pitta' },
            { id: 'k', text: "Slow and steady. I can skip meals easily not feeling hungry. Heaviness after eating.", dosha: 'Kapha' }
        ]
    },
    {
        id: 3,
        text: "How would you describe your energy levels?",
        options: [
            { id: 'v', text: "Fluctuates. I get bursts of energy then sudden exhaustion.", dosha: 'Vata' },
            { id: 'p', text: "High and focused. I can push myself but might burnout.", dosha: 'Pitta' },
            { id: 'k', text: "Steady and enduring, but slow to get started.", dosha: 'Kapha' }
        ]
    }
];

const DoshaQuiz: React.FC<DoshaQuizProps> = ({ personalizationData }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [result, setResult] = useState<string | null>(null);

    const handleOptionSelect = (value: string) => {
        setAnswers({ ...answers, [currentStep]: value });
    };

    const handleNext = () => {
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            calculateResult();
        }
    };

    const calculateResult = () => {
        // Count occurrences of Vata, Pitta, Kapha
        const counts: Record<string, number> = { 'Vata': 0, 'Pitta': 0, 'Kapha': 0 };
        Object.values(answers).forEach(dosha => {
            counts[dosha] = (counts[dosha] || 0) + 1;
        });

        // Find absolute winner (simple logic)
        let winner = 'Vata';
        let maxCount = -1;

        Object.entries(counts).forEach(([dosha, count]) => {
            if (count > maxCount) {
                maxCount = count;
                winner = dosha;
            }
        });

        setResult(winner);
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers({});
        setResult(null);
    };

    if (result) {
        const recommendation = personalizationData.dosha_based_millet_recommendations.find(r => r.dosha === result);

        return (
            <div className="animate-in fade-in zoom-in duration-500">
                <Card className="border-2 border-[#D1B48C] bg-white text-[#3F5E46] shadow-lg">
                    <CardHeader className="bg-[#FDFBF7] border-b border-[#D1B48C]/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-3xl font-serif text-[#3F5E46]">Your Predominant Dosha seems to be <span className="text-[#BC8F29]">{result}</span></CardTitle>
                                <CardDescription className="text-[#7C8B56]">Based on your answers, here is your personalized millet guide.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={resetQuiz} title="Retake Quiz" className="hover:bg-[#BC8F29]/10 text-[#BC8F29]"><RefreshCcw className="h-5 w-5" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        <div className="bg-[#BC8F29]/5 p-5 rounded-xl border border-[#D1B48C]">
                            <h4 className="font-semibold text-lg mb-2 text-[#3F5E46]">Ayurvedic Recommendation</h4>
                            <p className="text-[#556930] italic font-medium">"{recommendation?.recommendation}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-[#F3F6E9] border border-[#7C8B56]/20">
                                <h4 className="font-bold text-[#3F5E46] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#7C8B56]"></span> Best Millets for You
                                </h4>
                                <ul className="space-y-2">
                                    {recommendation?.preferred_millets.map((m, i) => (
                                        <li key={i} className="text-sm font-medium text-[#556930] flex items-center gap-2">
                                            <ArrowRight className="h-3 w-3 text-[#BC8F29]" /> {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#BC8F29]/20">
                                <h4 className="font-bold text-[#3F5E46] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#BC8F29]"></span> Try this Recipe
                                </h4>
                                <ul className="space-y-2">
                                    {recommendation?.recipes_example.map((r, i) => (
                                        <li key={i} className="text-sm text-[#556930] flex items-center gap-2">
                                            <ArrowRight className="h-3 w-3 text-[#BC8F29]" /> {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const question = QUESTIONS[currentStep];

    return (
        <Card className="max-w-xl mx-auto border border-[#D1B48C] shadow-lg bg-white">
            <CardHeader className="bg-[#FDFBF7] border-b border-[#D1B48C]/30 text-center">
                <CardTitle className="text-2xl font-serif text-[#3F5E46]">Discover Your Dosha Profile</CardTitle>
                <CardDescription className="text-[#7C8B56]">Answer 3 quick questions to get personalized millet recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="mb-6 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#BC8F29]/10 text-xs font-bold uppercase text-[#BC8F29] mb-2">Question {currentStep + 1} of {QUESTIONS.length}</span>
                    <h3 className="text-xl font-medium text-[#3F5E46]">{question.text}</h3>
                </div>
                <RadioGroup value={answers[currentStep]} onValueChange={handleOptionSelect} className="space-y-3">
                    {question.options.map((option) => (
                        <div key={option.id}
                            onClick={() => handleOptionSelect(option.dosha)}
                            className={`flex items-center space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 
                                ${answers[currentStep] === option.dosha
                                    ? 'border-[#BC8F29] bg-[#BC8F29]/5'
                                    : 'border-transparent bg-[#F3F6E9] hover:bg-[#E8EFD8] hover:border-[#7C8B56]/30'
                                }`
                            }
                        >
                            <RadioGroupItem value={option.dosha} id={`option-${option.id}`} className="text-[#BC8F29] border-[#BC8F29]" />
                            <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer text-[#3F5E46] font-medium">{option.text}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between p-6 border-t border-[#D1B48C]/20 bg-[#FDFBF7]">
                <Button
                    variant="ghost"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="text-[#7C8B56] hover:text-[#3F5E46]"
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!answers[currentStep]}
                    className="bg-[#3F5E46] hover:bg-[#2C4231] text-white rounded-lg px-6"
                >
                    {currentStep === QUESTIONS.length - 1 ? "Get Results" : "Next Question"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DoshaQuiz;
