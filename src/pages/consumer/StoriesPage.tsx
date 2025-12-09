import { ShgFpoStories } from "@/components/consumer/ShgFpoStories";
import { Navigation } from "@/components/navigation/Navigation";

const StoriesPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container px-4 py-6 md:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
                <ShgFpoStories />
            </main>
        </div>
    );
};

export default StoriesPage;
