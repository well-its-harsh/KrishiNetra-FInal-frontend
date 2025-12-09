import { UserFeedback } from "@/components/consumer/UserFeedback";
import { Navigation } from "@/components/navigation/Navigation";

const FeedbackPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="container px-4 py-6 md:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col gap-2 mb-6">
                    <h1 className="text-2xl font-bold text-[#1F2D3D]">User Feedback</h1>
                    <p className="text-sm text-[#7A6A58]">We value your suggestions</p>
                </div>

                <UserFeedback />
            </main>
        </div>
    );
};

export default FeedbackPage;
