import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, MessageCircle, Heart, Brain, Utensils, Info, Bot } from "lucide-react";

// NOTE: This now uses the real Google Gemini API logic similar to useGeminiSearch.ts
// Configuration
// Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const faqs = [
    {
        question: "Which millet is best for diabetes?",
        answer: "Finger millet (Ragi) and Pearl millet (Bajra) are excellent for diabetes management due to their low glycemic index and high fiber content.",
        category: "health"
    },
    {
        question: "How to cook foxtail millet?",
        answer: "Rinse foxtail millet, use 1:2 ratio with water, bring to boil, then simmer for 15-20 minutes until fluffy. Perfect for upma, pulao, or porridge.",
        category: "cooking"
    },
    {
        question: "Is millet gluten-free?",
        answer: "Yes! All millets are naturally gluten-free, making them perfect for people with celiac disease or gluten sensitivity.",
        category: "health"
    },
    {
        question: "Best millet for weight loss?",
        answer: "Little millet and Kodo millet are excellent for weight management due to high protein and fiber content that keeps you full longer.",
        category: "health"
    },
    {
        question: "How to make millet baby food?",
        answer: "Cook finger millet with water until soft, blend to smooth paste. Add breast milk or formula. Rich in calcium and iron for growing babies.",
        category: "cooking"
    }
];

const nutritionComparison = [
    { millet: "Finger Millet", protein: "7.3g", fiber: "3.6g", calcium: "344mg", iron: "3.9mg", specialty: "Highest Calcium" },
    { millet: "Pearl Millet", protein: "11.6g", fiber: "1.2g", calcium: "42mg", iron: "8mg", specialty: "High Protein" },
    { millet: "Foxtail Millet", protein: "12.3g", fiber: "6.7g", calcium: "31mg", iron: "2.8mg", specialty: "High Fiber" },
    { millet: "Little Millet", protein: "7.7g", fiber: "7.6g", calcium: "17mg", iron: "9.3mg", specialty: "Weight Loss" }
];

interface AiMilletGuideProps {
    onBack?: () => void;
}

export const AiMilletGuide = ({ onBack }: AiMilletGuideProps) => {
    const [question, setQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState<Array<{ question: string, answer: string, error?: boolean }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showWhyMillets, setShowWhyMillets] = useState(false);

    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        const currentQuestion = question;
        setQuestion(""); // Clear input early

        try {
            // Real Gemini API Call with Model Fallback Strategy
            // Try available models from the user's list (2.x series)
            const modelsToTry = [
                'gemini-2.5-pro',
                'gemini-2.0-flash-exp',
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-flash-latest',
                'gemini-pro-latest'
            ];

            let response;
            let usedModel = '';

            const prompt = `You are a friendly and knowledgeable AI assistant for a Millet Marketplace application. 
            Answer the following question about millets, nutrition, farming, or cooking in a helpful and simplified way for consumers. 
            Question: ${currentQuestion}`;

            for (const model of modelsToTry) {
                try {
                    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: {
                                temperature: 0.7,
                                topK: 40,
                                topP: 0.95,
                                maxOutputTokens: 500,
                            },
                        }),
                    });

                    if (res.ok) {
                        response = res;
                        usedModel = model;
                        break; // Success!
                    } else {
                        console.warn(`Model ${model} failed: ${res.status} ${res.statusText}`);
                        // Small delay before retry
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                } catch (e) {
                    console.warn(`Model ${model} error:`, e);
                }
            }

            if (!response || !response.ok) {
                throw new Error(`All Gemini models failed. Please check your API key.`);
            }

            const data = await response.json();
            const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate an answer at this moment.";

            setChatHistory(prev => [...prev, { question: currentQuestion, answer: aiResponseText }]);

        } catch (error) {
            console.error("AI Error:", error);
            setChatHistory(prev => [...prev, { question: currentQuestion, answer: "Sorry, I'm having trouble connecting to the millet knowledge base right now. Please try again.", error: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFaqClick = (faq: typeof faqs[0]) => {
        setChatHistory(prev => [...prev, { question: faq.question, answer: faq.answer }]);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Header with Background */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8 md:p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10 text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                            <Bot className="h-8 w-8 text-white" />
                        </div>
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg animate-pulse">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-800 bg-clip-text text-transparent">
                        AI Millet Guide
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Your intelligent companion for millet nutrition, cooking tips, and personalized health recommendations
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1">🤖 AI Powered</Badge>
                        <Badge className="bg-blue-100 text-blue-800 px-3 py-1">🧠 Smart Answers</Badge>
                        <Badge className="bg-purple-100 text-purple-800 px-3 py-1">⚡ Instant Results</Badge>
                    </div>
                </div>
            </div>

            {/* Enhanced Chat Interface */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Chat with Millet AI</h3>
                            <p className="text-emerald-100 text-sm">Ask anything about millets and nutrition</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    {/* Chat History */}
                    <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                        {chatHistory.length === 0 && (
                            <div className="text-center py-8 text-slate-400 italic">
                                Start the conversation! Ask about recipes, health benefits, or farming tips.
                            </div>
                        )}
                        {chatHistory.map((chat, index) => (
                            <div key={index} className="space-y-2 animate-in slide-in-from-bottom-2 fade-in">
                                <div className="bg-[#F1F7DB] p-3 rounded-lg ml-auto max-w-[80%]">
                                    <p className="text-sm font-medium text-[#1F2D3D]">{chat.question}</p>
                                </div>
                                <div className={`p-3 rounded-lg max-w-[90%] ${chat.error ? 'bg-red-50 text-red-700' : 'bg-[#E4F5E6]'}`}>
                                    <p className={`text-sm ${chat.error ? 'text-red-700' : 'text-[#2E7D32]'} whitespace-pre-wrap`}>{chat.answer}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-[#E4F5E6] p-3 rounded-lg max-w-[40%] animate-pulse">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 animate-spin text-[#2E7D32]" />
                                    <span className="text-sm text-[#2E7D32]">Consulting knowledge base...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Input */}
                    <div className="relative">
                        <div className="flex gap-3 p-2 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                            <Input
                                placeholder="Ask me anything about millets, nutrition, or cooking..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                                className="flex-1 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 text-slate-700 placeholder:text-slate-400"
                            />
                            <Button
                                onClick={handleAskQuestion}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg rounded-xl px-6 text-white"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Send className="h-4 w-4" />
                                        <span className="text-sm font-medium">Ask AI</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* FAQs */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1F2D3D] flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-[#2E7D32]" />
                    Popular Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {faqs.map((faq, index) => (
                        <Card
                            key={index}
                            className="cursor-pointer hover:shadow-md transition-shadow border border-[#E6DFD4] hover:border-emerald-200"
                            onClick={() => handleFaqClick(faq)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-2">
                                    {faq.category === 'health' ? <Heart className="h-4 w-4 text-red-500 mt-1" /> : <Utensils className="h-4 w-4 text-orange-500 mt-1" />}
                                    <p className="text-sm font-medium text-[#1F2D3D]">{faq.question}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Nutrition Comparison */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1F2D3D] flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#2E7D32]" />
                    Millet Nutrition Comparison (per 100g)
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[#E6DFD4]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#F1F7DB]">
                                <th className="p-3 text-left text-sm font-semibold text-[#1F2D3D]">Millet</th>
                                <th className="p-3 text-left text-sm font-semibold text-[#1F2D3D]">Protein</th>
                                <th className="p-3 text-left text-sm font-semibold text-[#1F2D3D]">Fiber</th>
                                <th className="p-3 text-left text-sm font-semibold text-[#1F2D3D]">Calcium</th>
                                <th className="p-3 text-left text-sm font-semibold text-[#1F2D3D]">Iron</th>
                                <th className="p-3 text-left text-sm font-semibold text-[#1F2D3D]">Best For</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nutritionComparison.map((item, index) => (
                                <tr key={index} className="hover:bg-[#FFF8EC] border-t border-[#E6DFD4]">
                                    <td className="p-3 font-medium text-[#1F2D3D]">{item.millet}</td>
                                    <td className="p-3 text-[#7A6A58]">{item.protein}</td>
                                    <td className="p-3 text-[#7A6A58]">{item.fiber}</td>
                                    <td className="p-3 text-[#7A6A58]">{item.calcium}</td>
                                    <td className="p-3 text-[#7A6A58]">{item.iron}</td>
                                    <td className="p-3">
                                        <Badge className="bg-[#E4F5E6] text-[#2E7D32] text-xs hover:bg-[#C8E6C9]">{item.specialty}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Why Millets Toggle */}
            <div className="text-center">
                <Button
                    variant="outline"
                    onClick={() => setShowWhyMillets(!showWhyMillets)}
                    className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#E4F5E6] gap-2"
                >
                    <Info className="h-4 w-4" />
                    {showWhyMillets ? "Hide" : "Show"} Complete Millet Information
                </Button>
            </div>

            {/* Why Millets Information Placeholder (if not found in source) */}
            {showWhyMillets && (
                <div className="animate-in fade-in slide-in-from-bottom-4 p-6 bg-[#F5F9F0] rounded-2xl border border-green-100">
                    <h4 className="text-lg font-bold text-green-800 mb-2">Why Millets?</h4>
                    <p className="text-green-700">Millets are climate-resilient superfoods packed with nutrients. They require less water to grow than rice or wheat and are naturally pest-resistant.</p>
                </div>
            )}
        </div>
    );
};
