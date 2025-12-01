import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/consumer/button";
import heroFieldImage from "@/assets/hero-field-harvest.jpg";
import heroKitchenImage from "@/assets/hero-kitchen-recipe.jpg";
import scanToCookImage from "@/assets/tile-scan-to-cook.jpg";
import recipesImage from "@/assets/tile-recipes.jpg";
import dailyChallengeImage from "@/assets/tile-daily-challenge.jpg";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: heroFieldImage,
    title: "Farm-Fresh Organic Millets",
    subtitle: "Directly from verified farmers to your kitchen",
    cta: "Shop Now",
  },
  {
    id: 2,
    image: heroKitchenImage,
    title: "Traditional Recipes, Modern Health",
    subtitle: "Discover authentic millet recipes for every meal",
    cta: "Explore Recipes",
  },
  {
    id: 3,
    image: scanToCookImage,
    title: "Scan to Track & Cook",
    subtitle: "Full traceability from farm to plate",
    cta: "Learn More",
  },
  {
    id: 4,
    image: recipesImage,
    title: "Daily Millet Challenge",
    subtitle: "Join thousands in healthy eating habits",
    cta: "Join Now",
  },
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-[300px] overflow-hidden rounded-xl md:h-[400px] lg:h-[500px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative h-full w-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-12 lg:px-16">
              <h2 className="mb-2 max-w-2xl text-2xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
                {slide.title}
              </h2>
              <p className="mb-6 max-w-xl text-sm text-primary-foreground/90 md:text-lg">
                {slide.subtitle}
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-primary-foreground"
                : "bg-primary-foreground/50 hover:bg-primary-foreground/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
