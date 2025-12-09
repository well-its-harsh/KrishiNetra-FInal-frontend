import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    MessageSquare,
    Star,
    Send,
    ThumbsUp,
    ThumbsDown,
    Lightbulb,
    Bug,
    Heart,
    Zap,
    CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const feedbackCategories = [
    { id: "general", name: "General Feedback", icon: MessageSquare, color: "bg-blue-50 border-blue-200 text-blue-800" },
    { id: "bug", name: "Bug Report", icon: Bug, color: "bg-red-50 border-red-200 text-red-800" },
    { id: "feature", name: "Feature Request", icon: Lightbulb, color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
    { id: "product", name: "Product Quality", icon: Star, color: "bg-green-50 border-green-200 text-green-800" },
    { id: "service", name: "Customer Service", icon: Heart, color: "bg-pink-50 border-pink-200 text-pink-800" },
    { id: "performance", name: "App Performance", icon: Zap, color: "bg-purple-50 border-purple-200 text-purple-800" }
];

const initialMockFeedback = [
    {
        id: 1,
        category: "product",
        rating: 5,
        title: "Excellent Millet Quality",
        message: "The finger millet I ordered was of exceptional quality. Fresh and well-packaged!",
        date: "2024-01-15",
        status: "resolved",
        response: "Thank you for your feedback! We're glad you loved our finger millet."
    },
    {
        id: 2,
        category: "feature",
        rating: 4,
        title: "Recipe Suggestions",
        message: "Would love to see more regional millet recipes in the app.",
        date: "2024-01-12",
        status: "in_progress",
        response: "Great suggestion! Our team is working on adding more regional recipes."
    },
    {
        id: 3,
        category: "service",
        rating: 5,
        title: "Quick Delivery",
        message: "Delivery was faster than expected. Great service!",
        date: "2024-01-10",
        status: "resolved",
        response: "We're happy to hear about your positive delivery experience!"
    }
];

interface UserFeedbackProps {
    onBack?: () => void;
}

export const UserFeedback = ({ onBack }: UserFeedbackProps) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { toast } = useToast();

    // Local state for feedback items to support "mock backend" persistence
    const [feedbackItems, setFeedbackItems] = useState<any[]>([]);

    useEffect(() => {
        // Load from local storage or use initial mock data
        const storedFeedback = localStorage.getItem('user_feedback');
        if (storedFeedback) {
            setFeedbackItems(JSON.parse(storedFeedback));
        } else {
            setFeedbackItems(initialMockFeedback);
            localStorage.setItem('user_feedback', JSON.stringify(initialMockFeedback));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCategory || !title || !message) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const newFeedback = {
                id: Date.now(),
                category: selectedCategory,
                rating,
                title,
                message,
                date: new Date().toISOString().split('T')[0],
                status: "pending",
                response: null
            };

            const updatedFeedback = [newFeedback, ...feedbackItems];
            setFeedbackItems(updatedFeedback);
            localStorage.setItem('user_feedback', JSON.stringify(updatedFeedback));

            toast({
                title: "Feedback Submitted!",
                description: "Thank you for your feedback. We'll review it and get back to you soon.",
            });

            // Reset form
            setSelectedCategory("");
            setRating(0);
            setTitle("");
            setMessage("");
            setEmail("");
            setShowForm(false);

        } catch (error) {
            toast({
                title: "Submission Failed",
                description: "Please try again later",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "resolved": return "bg-green-100 text-green-800";
            case "in_progress": return "bg-yellow-100 text-yellow-800";
            case "pending": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "resolved": return "Resolved";
            case "in_progress": return "In Progress";
            case "pending": return "Pending";
            default: return "Unknown";
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 md:p-12 border border-green-100/50">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-5"></div>
                <div className="relative z-10 text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg transform rotate-[-5deg]">
                            <MessageSquare className="h-8 w-8 text-white" />
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg transform rotate-[5deg]">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
                        Your Voice Matters
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Help us improve KrishiNetra by sharing your feedback, suggestions, and experiences
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        <Badge className="bg-green-100 text-green-800 px-3 py-1 hover:bg-green-200">💬 Share Feedback</Badge>
                        <Badge className="bg-blue-100 text-blue-800 px-3 py-1 hover:bg-blue-200">⭐ Rate Experience</Badge>
                        <Badge className="bg-purple-100 text-purple-800 px-3 py-1 hover:bg-purple-200">💡 Suggest Features</Badge>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-50 group" onClick={() => setShowForm(true)}>
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Send className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#1F2D3D] mb-2">Submit New Feedback</h3>
                        <p className="text-[#7A6A58]">Share your thoughts, report issues, or suggest improvements</p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-50 group">
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Star className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#1F2D3D] mb-2">Rate Your Experience</h3>
                        <p className="text-[#7A6A58]">Help others by rating products and services</p>
                    </CardContent>
                </Card>
            </div>

            {/* Feedback Form */}
            {showForm && (
                <Card className="border-2 border-[#2E7D32]/20 animate-in fade-in slide-in-from-bottom-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[#1F2D3D]">
                            <MessageSquare className="h-6 w-6 text-[#2E7D32]" />
                            Submit Feedback
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Category Selection */}
                            <div>
                                <Label className="text-[#1F2D3D] mb-3 block">Feedback Category *</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {feedbackCategories.map(category => {
                                        const Icon = category.icon;
                                        return (
                                            <Card
                                                key={category.id}
                                                className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === category.id
                                                    ? category.color + " shadow-md ring-2 ring-offset-2 ring-green-500"
                                                    : "border-[#E6DFD4] hover:bg-[#FFF8EC]"
                                                    }`}
                                                onClick={() => setSelectedCategory(category.id)}
                                            >
                                                <CardContent className="p-3 text-center">
                                                    <Icon className={`h-6 w-6 mx-auto mb-2 ${selectedCategory === category.id
                                                        ? "text-current"
                                                        : "text-[#2E7D32]"
                                                        }`} />
                                                    <p className={`text-xs font-medium ${selectedCategory === category.id
                                                        ? "text-current"
                                                        : "text-[#1F2D3D]"
                                                        }`}>
                                                        {category.name}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <Label className="text-[#1F2D3D] mb-3 block">Overall Rating</Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${star <= rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <Label htmlFor="title" className="text-[#1F2D3D] mb-2 block">
                                    Feedback Title *
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Brief summary of your feedback"
                                    className="border-[#E6DFD4] focus:border-[#2E7D32] focus:ring-green-200"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <Label htmlFor="message" className="text-[#1F2D3D] mb-2 block">
                                    Detailed Feedback *
                                </Label>
                                <Textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Please provide detailed feedback..."
                                    rows={4}
                                    className="border-[#E6DFD4] focus:border-[#2E7D32] focus:ring-green-200"
                                />
                            </div>

                            {/* Email (Optional) */}
                            <div>
                                <Label htmlFor="email" className="text-[#1F2D3D] mb-2 block">
                                    Email (Optional - for follow-up)
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="border-[#E6DFD4] focus:border-[#2E7D32] focus:ring-green-200"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 border-[#E6DFD4] text-[#7A6A58] hover:bg-[#FFF8EC]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-[#2E7D32] hover:bg-[#256428] text-white"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Submit Feedback
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Recent Feedback */}
            <Card className="border-green-100 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#1F2D3D]">
                        <MessageSquare className="h-6 w-6 text-[#2E7D32]" />
                        Your Recent Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {feedbackItems.map(feedback => (
                            <Card key={feedback.id} className="border border-[#E6DFD4] hover:border-green-200 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(feedback.status)}>
                                                {getStatusText(feedback.status)}
                                            </Badge>
                                            <Badge className="bg-[#E4F5E6] text-[#2E7D32]">
                                                {feedbackCategories.find(cat => cat.id === feedback.category)?.name}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= feedback.rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <h4 className="font-semibold text-[#1F2D3D] mb-2 text-lg">{feedback.title}</h4>
                                    <p className="text-[#7A6A58] text-sm mb-3">{feedback.message}</p>

                                    {feedback.response && (
                                        <div className="bg-[#E4F5E6] rounded-lg p-3 mt-3 border border-green-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
                                                <span className="text-sm font-medium text-[#2E7D32]">Team Response</span>
                                            </div>
                                            <p className="text-sm text-[#1F2D3D]">{feedback.response}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E6DFD4]">
                                        <span className="text-xs text-[#7A6A58]">{feedback.date}</span>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" className="text-[#2E7D32] hover:bg-[#E4F5E6] hover:text-green-800">
                                                <ThumbsUp className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {feedbackItems.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No feedback submitted yet.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
