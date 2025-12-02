import { Sprout, Heart, Star, ShieldCheck, Leaf, Award } from "lucide-react";

export const CATEGORIES = [
    "Foxtail", "Barnyard", "Pearl", "Finger", "Little", "Sorghum", "Value-added snacks", "Flour", "Ready-to-eat"
];

export const SORT_OPTIONS = [
    "Best Rated", "High Nutrition", "Low Price", "Trending"
];

export const PRODUCTS = [
    {
        id: 1,
        name: "Organic Foxtail Millet",
        category: "Foxtail",
        rating: 4.8,
        reviews: 124,
        price: 85,
        originalPrice: 100,
        image: "https://images.unsplash.com/photo-1664449339005-7241470d26fc?q=80&w=2534&auto=format&fit=crop",
        badges: ["Diabetes Friendly", "High Fiber"],
        nutrition: { protein: "12g", fiber: "8g", calcium: "31mg" },
        farmer: "Ramesh Kumar",
        location: "Karnataka"
    },
    {
        id: 2,
        name: "Premium Pearl Millet Flour",
        category: "Flour",
        rating: 4.9,
        reviews: 89,
        price: 65,
        originalPrice: 75,
        image: "https://images.unsplash.com/photo-1631209121750-a9f606954319?q=80&w=2664&auto=format&fit=crop",
        badges: ["Gluten Free", "Iron Rich"],
        nutrition: { protein: "11g", fiber: "6g", calcium: "42mg" },
        farmer: "Lakshmi Devi",
        location: "Rajasthan"
    },
    {
        id: 3,
        name: "Sprouted Ragi Malt",
        category: "Value-added snacks",
        rating: 4.7,
        reviews: 256,
        price: 240,
        originalPrice: 280,
        image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=2689&auto=format&fit=crop",
        badges: ["Kids Favorite", "Calcium Rich"],
        nutrition: { protein: "7g", fiber: "15g", calcium: "344mg" },
        farmer: "Green Earth FPO",
        location: "Tamil Nadu"
    },
    {
        id: 4,
        name: "Little Millet Rice",
        category: "Little",
        rating: 4.6,
        reviews: 56,
        price: 95,
        originalPrice: 110,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2670&auto=format&fit=crop",
        badges: ["Weight Loss", "Low GI"],
        nutrition: { protein: "9.7g", fiber: "7.6g", calcium: "17mg" },
        farmer: "Suresh Patil",
        location: "Maharashtra"
    },
    {
        id: 5,
        name: "Multi-Millet Cookies",
        category: "Ready-to-eat",
        rating: 4.9,
        reviews: 432,
        price: 150,
        originalPrice: 180,
        image: "https://images.unsplash.com/photo-1499636138143-bd649025ebeb?q=80&w=2670&auto=format&fit=crop",
        badges: ["No Maida", "No Sugar"],
        nutrition: { protein: "8g", fiber: "5g", calcium: "20mg" },
        farmer: "Millet Mama SHG",
        location: "Telangana"
    },
    {
        id: 6,
        name: "Sorghum (Jowar) Flakes",
        category: "Sorghum",
        rating: 4.5,
        reviews: 78,
        price: 120,
        originalPrice: 140,
        image: "https://images.unsplash.com/photo-1646637385986-22441c098198?q=80&w=2670&auto=format&fit=crop",
        badges: ["Breakfast Special", "Heart Healthy"],
        nutrition: { protein: "10g", fiber: "9g", calcium: "25mg" },
        farmer: "Organic Roots",
        location: "Andhra Pradesh"
    }
];

export const TESTIMONIALS = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Health Enthusiast",
        content: "Switching to millets has been the best decision for my family's health. Shree Anna makes it so easy to find quality products directly from farmers.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Dr. Rajesh Verma",
        role: "Nutritionist",
        content: "I recommend millets to all my diabetic patients. The variety and quality available on this platform are unmatched.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2670&auto=format&fit=crop"
    }
];

export const WHY_MILLETS = [
    {
        icon: Heart,
        title: "Nutritional Powerhouse",
        description: "Rich in protein, fiber, and essential minerals."
    },
    {
        icon: Leaf,
        title: "Climate Smart",
        description: "Requires less water and is drought resistant."
    },
    {
        icon: ShieldCheck,
        title: "Chemical Free",
        description: "Naturally pest resistant, grown without harmful pesticides."
    },
    {
        icon: Award,
        title: "Farmer Friendly",
        description: "Supports sustainable livelihoods for small farmers."
    }
];
