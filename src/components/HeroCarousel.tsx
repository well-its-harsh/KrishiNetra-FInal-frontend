import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroFarm from "@/assets/hero-millet-farm.jpg";
import heroGrains from "@/assets/hero-millet-grains.jpg";
import heroShg from "@/assets/hero-shg-women.jpg";
import heroFarmer from "@/assets/hero-farmer.jpg";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  const slides = [
    { image: heroFarm, alt: "Millet Farm" },
    { image: heroGrains, alt: "Millet Grains" },
    { image: heroShg, alt: "SHG Women" },
    { image: heroFarmer, alt: "Farmer in Field" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500); // 5-6 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = 0;
    let heroHeight = 0;
    let isVisible = true;

    // Cache hero height and check visibility
    const updateHeroHeight = () => {
      if (heroRef.current) {
        heroHeight = heroRef.current.offsetHeight;
      }
    };

    // Use IntersectionObserver to only animate when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            updateHeroHeight();
          }
        });
      },
      { threshold: 0 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
      updateHeroHeight();
    }

    const updateParallax = () => {
      if (!isVisible || !heroRef.current || !contentRef.current || !imageRef.current) {
        rafId = null;
        return;
      }
      
      const scrollY = window.scrollY;
      
      // Only update if scroll changed significantly (reduce calculations)
      if (Math.abs(scrollY - lastScrollY) < 1 && scrollY !== 0) {
        rafId = null;
        return;
      }
      
      // Limit parallax to hero section only
      if (scrollY > heroHeight) {
        rafId = null;
        return;
      }
      
      const scrollProgress = Math.min(scrollY / heroHeight, 1);
      
      // Reduced parallax intensity for smoother performance
      const parallaxOffset = scrollY * 0.3; // Reduced from 0.5
      const textOffset = scrollY * 0.15; // Reduced from 0.3
      
      // Use transform3d with rounded values to reduce repaints
      const imageY = Math.round(parallaxOffset);
      const textY = Math.round(textOffset);
      
      // Batch DOM updates
      imageRef.current.style.transform = `translate3d(0, ${imageY}px, 0)`;
      contentRef.current.style.transform = `translate3d(0, ${-textY}px, 0)`;
      contentRef.current.style.opacity = `${Math.max(0.7, 1 - scrollProgress * 0.2)}`;
      
      lastScrollY = scrollY;
      rafId = null;
    };

    const handleScroll = () => {
      // Only schedule one RAF at a time
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    // Throttle scroll events more aggressively
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 8); // ~120fps max
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    window.addEventListener("resize", updateHeroHeight, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("resize", updateHeroHeight);
      observer.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      clearTimeout(scrollTimeout);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="relative hero-extended w-full overflow-hidden"
    >
      {/* Carousel Images with Parallax */}
      <div 
        ref={imageRef} 
        className="absolute inset-0 parallax-slow"
        style={{ 
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              willChange: 'opacity',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              style={{ 
                willChange: 'auto',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              loading="eager"
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Enhanced Dark Overlay with Gradient Shadow for Text Readability */}
      <div className="absolute inset-0 hero-overlay hero-overlay-gradient" />

      {/* Hero Content - Floating Text */}
      <div className="relative h-screen flex items-center justify-center text-center px-6">
        <div 
          ref={contentRef} 
          className="max-w-5xl mx-auto floating-text"
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <h1 className={`text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl ${language === "HI" ? "hindi" : ""}`}>
            {t("hero.title")}
          </h1>
          <p className={`text-lg md:text-xl lg:text-2xl text-white mb-10 max-w-3xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className={`ripple bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-[14px] px-8 py-6 text-lg hover-glow transition-smooth hover:scale-105 ${language === "HI" ? "hindi" : ""}`}
            >
              {t("hero.explore")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`ripple border-2 border-primary text-primary hover:bg-primary hover:text-earth rounded-[14px] px-8 py-6 text-lg transition-smooth hover:scale-105 bg-primary/10 ${language === "HI" ? "hindi" : ""}`}
            >
              {t("hero.sell")}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-smooth z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-smooth z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-smooth ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/40 hover:bg-white/60 w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce-soft z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
