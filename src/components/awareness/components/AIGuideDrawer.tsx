import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles } from 'lucide-react';
import { AyurvedicData } from '../utils/typeDefinitions';

interface AIGuideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data: AyurvedicData;
}

const AIGuideDrawer: React.FC<AIGuideDrawerProps> = ({ isOpen, onClose, data }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history, loading]);

    const handleSearch = async () => {
        if (!query.trim()) return;

        const userQuery = query;
        setQuery(""); // clear input
        setHistory(prev => [...prev, { role: 'user', content: userQuery }]);
        setLoading(true);
        setError(null);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                // Mock response for development if no key
                setTimeout(() => {
                    setHistory(prev => [...prev, {
                        role: 'ai',
                        content: "I'm currently running in demo mode (no API key). Based on the database, I can tell you that Millets are great for balancing Doshas! Please configure VITE_GEMINI_API_KEY for real answers."
                    }]);
                    setLoading(false);
                }, 1000);
                return;
            }

            const contextPrompt = `
            You are an AI millet advisor for an Ayurvedic app. 
            You have access to the following JSON database of millet knowledge:
            ${JSON.stringify(data.millets)}
            
            And disease recommendations:
            ${JSON.stringify(data.database_section_for_diseases)}

            User Question: "${userQuery}"

            INSTRUCTIONS:
            1. Answer ONLY based on the JSON data provided above. Do not invent facts.
            2. If the user asks about a specific disease not in the list, check the 'diseases_or_conditions_it_helps' field in the millets list.
            3. Be concise, friendly, and helpful. Format your response with clear paragraphs or bullet points if needed.
            4. If recommending a millet, mention its Ayurvedic benefits (Dosha/Guna) briefly.
            `;

            const modelsToTry = [
                'gemini-2.5-pro',
                'gemini-2.0-flash-exp',
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-flash-latest',
                'gemini-pro-latest'
            ];

            let response;
            let responseText = "";

            for (const model of modelsToTry) {
                try {
                    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: contextPrompt }] }]
                        })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.candidates && data.candidates.length > 0) {
                            responseText = data.candidates[0].content.parts[0].text;
                            response = res;
                            break;
                        }
                    }
                } catch (e) {
                    console.warn(`Model ${model} failed, trying next.`);
                }
            }

            if (responseText) {
                setHistory(prev => [...prev, { role: 'ai', content: responseText }]);
            } else {
                throw new Error("Unable to get a response from AI services.");
            }

        } catch (e: any) {
            console.error(e);
            setError("Sorry, I had trouble connecting to the Ayurvedic knowledge base. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[500px] flex flex-col p-0">
                <SheetHeader className="p-6 border-b bg-secondary/10">
                    <SheetTitle className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-5 w-5 text-yellow-600" />
                        AI Millet Advisor
                    </SheetTitle>
                    <SheetDescription>
                        Ask anything about millet nutrition, ayurvedic benefits, or recipes.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                        {history.length === 0 && (
                            <div className="text-center text-muted-foreground mt-10">
                                <Bot className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p>Start by asking: "Which millet is good for diabetes?" or "How do I balance Pitta?"</p>
                            </div>
                        )}

                        {history.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-muted max-w-[85%] rounded-lg p-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <SheetFooter className="p-4 border-t mt-auto">
                    <div className="flex w-full gap-2">
                        <Input
                            placeholder="Ask about millets..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            disabled={loading}
                        />
                        <Button size="icon" onClick={handleSearch} disabled={loading || !query.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default AIGuideDrawer;
