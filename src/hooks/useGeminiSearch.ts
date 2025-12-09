import { useState } from 'react';
import { recipes } from '../modules/consumer/recipe-hub/data/recipes';

interface SearchResult<T> {
    data: T[];
    loading: boolean;
    error: string | null;
}

// We now ignore the initialData passed in and use the real recipes source of truth
export const useGeminiSearch = <T>(initialData: T[]) => {
    const [results, setResults] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiResponseText, setAiResponseText] = useState<string>("");

    const search = async (query: string, type: 'products' | 'recipes') => {
        setLoading(true);
        setError(null);
        setAiResponseText("");

        // Select the correct dataset based on type
        // For recipes, we ALWAYS use the real recipes.ts file now
        let dataToSearch: any[] = initialData;
        if (type === 'recipes') {
            dataToSearch = recipes;
        }

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                // Mock response if no API key is present (for demonstration)
                console.warn("No VITE_GEMINI_API_KEY found. Using mock filtering.");
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

                // Smarter mock filtering:
                // 1. Tokenize query
                // 2. Remove stop words
                // 3. Check for matches
                const stopWords = ["i", "have", "want", "need", "looking", "for", "a", "an", "the", "and", "with", "is", "are", "some"];
                const keywords = query.toLowerCase()
                    .split(/[\s,]+/)
                    .filter(word => word.length > 2 && !stopWords.includes(word));

                const filtered = dataToSearch.filter((item: any) => {
                    const itemString = JSON.stringify(item).toLowerCase();
                    // Match if ALL keywords are present (strict) OR if at least one matches (loose)
                    // For better results, let's try to match at least one significant keyword
                    return keywords.some(keyword => itemString.includes(keyword));
                });

                setResults(filtered as T[]);
                setAiResponseText(
                    filtered.length > 0
                        ? `I found ${filtered.length} items matching your request for "${keywords.join(", ")}" from our local collection.`
                        : `I couldn't find any exact matches for "${query}" in our local collection. Try different keywords.`
                );
                setLoading(false);
                return;
            }

            // Real Gemini API Call
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

            for (const model of modelsToTry) {
                try {
                    let prompt = "";

                    // OPTIMIZATION: Local Weighted Pre-filtering
                    // Instead of sending ALL data (which is slow and large), we find the top 20 candidates locally
                    // and ask AI to refine/rank/explain them.

                    const searchTerms = query.toLowerCase().split(/[\s,]+/).filter(t => t.length > 2);

                    const scoredData = dataToSearch.map((item: any) => {
                        let score = 0;
                        const itemString = JSON.stringify(item).toLowerCase();
                        const title = item.title ? item.title.toLowerCase() : "";

                        searchTerms.forEach(term => {
                            if (title.includes(term)) score += 10; // High priority for title match
                            else if (itemString.includes(term)) score += 2; // Low priority for general match
                        });

                        return { item, score };
                    });

                    // specific filter for "ragi" or similar specific ingredient queries
                    // if query has specific ingredient, require at least one match
                    const hasMatches = scoredData.some(d => d.score > 0);

                    // Sort by score desc, take top 20
                    // If no matches found locally, we still send a small random subset or top generic items to let AI decide (or fallback)
                    // But usually we want to send the best candidates.
                    const topCandidates = scoredData
                        .filter(d => hasMatches ? d.score > 0 : true)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 20)
                        .map(d => d.item);

                    console.log(`Optimization: Filtered ${dataToSearch.length} items down to ${topCandidates.length} candidates.`);

                    if (type === 'recipes') {
                        prompt = `
                            You are an intelligent culinary assistant for a Millet Recipe Hub.
                            User Query: "${query}"
                            
                            Data to filter (Recipes):
                            ${JSON.stringify(topCandidates)} 
                            
                            Task:
                            1. Analyze the user's query (e.g., "I have a cold", "something sweet", "breakfast with ragi").
                            2. Filter the provided recipes to find the best matches based on ingredients, health benefits, and meal type.
                            3. Return ONLY a valid JSON object with this structure:
                            {
                              "responseText": "A brief, appetizing message explaining why these recipes were chosen.",
                              "matches": [ ...array of matching objects... ]
                            }
                        `;
                    } else {
                        // Product Search Prompt
                        prompt = `
                            You are an intelligent shopping assistant for a Millet Marketplace.
                            User Query: "${query}"
                            
                            Data to filter (Products):
                            ${JSON.stringify(topCandidates)} 
                            
                            Task:
                            1. Analyze the user's query (e.g., "cheap snacks", "organic flour", "gluten free options").
                            2. Filter the provided products to find the best matches based on price, category, brand, and badges.
                            3. CRITICAL: Return ONLY items that exist in the provided "Data to filter" list. Do NOT invent new products.
                            4. Return ONLY a valid JSON object with this structure:
                            {
                              "responseText": "A brief, helpful message explaining why these products were chosen (mentioning price or benefits if relevant).",
                              "matches": [ ...array of matching objects from the provided list... ]
                            }
                        `;
                    }

                    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: prompt }]
                            }]
                        })
                    });

                    if (res.ok) {
                        response = res;
                        usedModel = model;
                        break; // Success!
                    } else {
                        console.warn(`Model ${model} failed: ${res.status} ${res.statusText}`);
                        // Add a small delay before trying next model to avoid hitting rate limits immediately if they are shared
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (e) {
                    console.warn(`Model ${model} error:`, e);
                }
            }

            if (!response || !response.ok) {
                throw new Error(`All Gemini models failed. Please check your API key and permissions.`);
            }

            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text;

            // Clean up markdown code blocks if present
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : textResponse;

            let parsed;
            try {
                parsed = JSON.parse(jsonString);
            } catch (jsonError) {
                console.warn("JSON Parse Failed. Raw text:", textResponse);
                // Attempt to construct a valid response from raw text
                parsed = {
                    responseText: textResponse,
                    matches: [] // Fallback: show no specific matches but display the text
                };
            }

            setResults(parsed.matches || []);
            setAiResponseText(parsed.responseText || "Here are the results I found.");

        } catch (err: any) {
            console.error("AI Search Error:", err);
            setError(err.message || "Failed to perform AI search.");
            // Fallback to empty results
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return { search, results, loading, error, aiResponseText };
};
