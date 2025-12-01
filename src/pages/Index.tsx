import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import Counter from "@/components/StatsCounter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sprout,
  Users,
  ShoppingCart,
  QrCode,
  Shield,
  Truck,
  FileText,
  UtensilsCrossed,
  TrendingUp,
  Award,
  Leaf,
  Building,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import farmToFork from "@/assets/farm-to-fork.png";
import milletProducts from "@/assets/millet-products.jpg";
import infographic1 from "@/assets/infographic1.jpeg";
import infographic2 from "@/assets/infographic2.jpeg";
import infographic3 from "@/assets/infographic3.jpeg";

const Index = () => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const problemCards = [
    {
      icon: <Sprout className="h-12 w-12 text-rust" />,
      title: t("problem.farmersTitle"),
      description: t("problem.farmersDesc"),
      color: "bg-cream border-rust/20",
    },
    {
      icon: <Building className="h-12 w-12 text-mustard" />,
      title: t("problem.buyersTitle"),
      description: t("problem.buyersDesc"),
      color: "bg-cream/50 border-mustard/20",
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-secondary" />,
      title: t("problem.consumersTitle"),
      description: t("problem.consumersDesc"),
      color: "bg-cream border-secondary/20",
    },
    {
      icon: <Shield className="h-12 w-12 text-earth" />,
      title: t("problem.systemTitle"),
      description: t("problem.systemDesc"),
      color: "bg-cream/50 border-earth/20",
    },
  ];

  const features = [
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: t("features.bidding"),
      description: t("features.biddingDesc"),
    },
    {
      icon: <QrCode className="h-10 w-10" />,
      title: t("features.traceability"),
      description: t("features.traceabilityDesc"),
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: t("features.quality"),
      description: t("features.qualityDesc"),
    },
    {
      icon: <Truck className="h-10 w-10" />,
      title: t("features.logistics"),
      description: t("features.logisticsDesc"),
    },
    {
      icon: <FileText className="h-10 w-10" />,
      title: t("features.schemes"),
      description: t("features.schemesDesc"),
    },
    {
      icon: <UtensilsCrossed className="h-10 w-10" />,
      title: t("features.awareness"),
      description: t("features.awarenessDesc"),
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: t("features.verified"),
      description: t("features.verifiedDesc"),
    },
    {
      icon: <Leaf className="h-10 w-10" />,
      title: t("features.offline"),
      description: t("features.offlineDesc"),
    },
  ];

  const marketplaceSections = [
    {
      title: t("marketplace.b2b"),
      description: t("marketplace.b2bDesc"),
      gradient: "from-secondary to-accent",
      icon: <TrendingUp className="h-12 w-12" />,
    },
    {
      title: t("marketplace.shg"),
      description: t("marketplace.shgDesc"),
      gradient: "from-accent to-primary",
      icon: <Users className="h-12 w-12" />,
    },
    {
      title: t("marketplace.packaged"),
      description: t("marketplace.packagedDesc"),
      gradient: "from-primary to-secondary",
      icon: <Award className="h-12 w-12" />,
    },
    {
      title: t("marketplace.snacks"),
      description: t("marketplace.snacksDesc"),
      gradient: "from-secondary to-accent",
      icon: <UtensilsCrossed className="h-12 w-12" />,
    },
  ];

  const stats = [
    { number: 5000, suffix: "+", label: t("stats.farmers") },
    { number: 200, suffix: "+", label: t("stats.shgs") },
    { number: 10000, suffix: "+", label: t("stats.lots") },
    { number: 500, suffix: "+", label: t("stats.sellers") },
    { number: 50000, suffix: "+", label: t("stats.awareness") },
  ];

  const testimonials = [
    {
      name: t("testimonial.1.name"),
      role: t("testimonial.1.role"),
      quote: t("testimonial.1.quote"),
    },
    {
      name: t("testimonial.2.name"),
      role: t("testimonial.2.role"),
      quote: t("testimonial.2.quote"),
    },
    {
      name: t("testimonial.3.name"),
      role: t("testimonial.3.role"),
      quote: t("testimonial.3.quote"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />

      {/* Problem Section - Enhanced with Pain Points */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        id="problem"
        className="py-24 bg-gradient-to-b from-cream/30 to-background"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-earth tracking-tight ${language === "HI" ? "hindi" : ""}`}>
            {t("problem.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-20 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
            {t("problem.subtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {problemCards.map((card, index) => (
              <Card
                key={index}
                className={`p-8 hover-lift organic-shadow-medium transition-all duration-300 animate-fade-up border-2 ${card.color} rounded-[20px]`}
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="icon-bounce flex-shrink-0">{card.icon}</div>
                  <div className="flex-1">
                    <h3 className={`text-xl md:text-2xl font-bold mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
                      {card.title}
                    </h3>
                    <p className={`text-muted-foreground leading-relaxed ${language === "HI" ? "hindi" : ""}`}>{card.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {/* Summary Statement */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-10 bg-gradient-to-r from-rust/10 to-mustard/10 border-2 border-rust/30 rounded-[24px] text-center animate-fade-up" style={{ animationDelay: "0.6s" }}>
              <p className={`text-2xl md:text-3xl font-bold text-earth italic leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                "{t("problem.summary")}"
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why This Problem Matters */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="py-24 bg-gradient-to-br from-secondary/10 via-cream/20 to-mustard/10"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-earth tracking-tight ${language === "HI" ? "hindi" : ""}`}>
            {t("whyMatters.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mt-16">
            {[
              { icon: <Leaf className="h-10 w-10 text-secondary" />, title: t("whyMatters.climate"), desc: t("whyMatters.climateDesc"), number: "Climate Resilience" },
              { icon: <UtensilsCrossed className="h-10 w-10 text-mustard" />, title: t("whyMatters.nutrition"), desc: t("whyMatters.nutritionDesc"), number: "Nutrition Security" },
              { icon: <TrendingUp className="h-10 w-10 text-rust" />, title: t("whyMatters.income"), desc: t("whyMatters.incomeDesc"), number: "30-40%" },
              { icon: <Award className="h-10 w-10 text-earth" />, title: t("whyMatters.mission"), desc: t("whyMatters.missionDesc"), number: "Govt Mission" },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-8 hover-lift organic-shadow-medium transition-all duration-300 animate-scale-in bg-white/80 backdrop-blur-sm rounded-[20px] border-2 border-cream"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 icon-bounce">{item.icon}</div>
                  <h3 className={`text-xl font-bold mb-3 text-earth ${language === "HI" ? "hindi" : ""}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm text-muted-foreground leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                    {item.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Is Our Solution - Three Pillars */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        id="solution"
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-earth tracking-tight ${language === "HI" ? "hindi" : ""}`}>
            {t("solution.title")}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-16">
            {[
              { 
                icon: <TrendingUp className="h-16 w-16 text-white" />, 
                title: t("solution.pillar1"), 
                desc: t("solution.pillar1Desc"),
                gradient: "from-secondary to-accent",
              },
              { 
                icon: <QrCode className="h-16 w-16 text-white" />, 
                title: t("solution.pillar2"), 
                desc: t("solution.pillar2Desc"),
                gradient: "from-mustard to-rust",
              },
              { 
                icon: <Truck className="h-16 w-16 text-white" />, 
                title: t("solution.pillar3"), 
                desc: t("solution.pillar3Desc"),
                gradient: "from-earth to-secondary",
              },
            ].map((pillar, index) => (
              <Card
                key={index}
                className="p-10 hover-lift organic-shadow-medium transition-all duration-300 animate-fade-up rounded-[24px] border-2 border-cream overflow-hidden group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`h-32 bg-gradient-to-br ${pillar.gradient} rounded-[16px] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  {pillar.icon}
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
                  {pillar.title}
                </h3>
                <p className={`text-muted-foreground leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                  {pillar.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What is Krishi-Netra - Enhanced */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        id="about"
        className="py-24 bg-gradient-to-b from-cream/20 to-background"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-slide-left">
              <img
                src={farmToFork}
                alt="Farm to Fork Journey"
                className="rounded-2xl organic-shadow-medium w-full"
              />
            </div>
            <div className="animate-slide-right">
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-earth tracking-tight ${language === "HI" ? "hindi" : ""}`}>
                {t("krishinetra.title")}
              </h2>
              {/* One-liner Highlight Block */}
              <Card className="p-6 mb-8 bg-gradient-to-r from-rust/10 to-mustard/10 border-2 border-rust/30 rounded-[20px]">
                <p className={`text-lg md:text-xl font-semibold text-earth leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                  {t("krishinetra.oneLiner")}
                </p>
              </Card>
              <p className={`text-lg text-muted-foreground mb-6 leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                {t("krishinetra.desc1")}
              </p>
              <p className={`text-lg text-muted-foreground mb-8 leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                {t("krishinetra.desc2")}
              </p>
              <Button
                size="lg"
                className={`ripple bg-rust hover:bg-rust/90 text-rust-foreground rounded-[14px] px-8 py-6 hover-glow transition-smooth hover:scale-105 shadow-lg ${language === "HI" ? "hindi" : ""}`}
              >
                {t("krishinetra.learnMore")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Millets - Blog/Article Cards */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="py-24 bg-gradient-to-b from-background to-cream/20"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-earth tracking-tight ${language === "HI" ? "hindi" : ""}`}>
            {t("whyMillets.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-16 text-lg md:text-xl max-w-3xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
            {t("whyMillets.subtitle")}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                image: infographic1,
                title: t("whyMillets.article1.title"),
                excerpt: t("whyMillets.article1.excerpt"),
                readMore: t("whyMillets.readMore"),
              },
              {
                image: infographic2,
                title: t("whyMillets.article2.title"),
                excerpt: t("whyMillets.article2.excerpt"),
                readMore: t("whyMillets.readMore"),
              },
              {
                image: infographic3,
                title: t("whyMillets.article3.title"),
                excerpt: t("whyMillets.article3.excerpt"),
                readMore: t("whyMillets.readMore"),
              },
            ].map((article, index) => (
              <Card
                key={index}
                className="overflow-hidden hover-lift organic-shadow-medium transition-all duration-300 animate-fade-up rounded-[24px] border-2 border-cream group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl md:text-2xl font-bold mb-4 text-earth leading-tight ${language === "HI" ? "hindi" : ""}`}>
                    {article.title}
                  </h3>
                  <p className={`text-muted-foreground mb-6 leading-relaxed line-clamp-3 ${language === "HI" ? "hindi" : ""}`}>
                    {article.excerpt}
                  </p>
                  <Button
                    variant="outline"
                    className={`w-full border-2 border-rust text-rust hover:bg-rust hover:text-rust-foreground rounded-[12px] transition-all duration-300 ${language === "HI" ? "hindi" : ""}`}
                  >
                    {article.readMore}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Farm-to-Fork Journey - Storytelling with Location Pins */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
        className="py-24 bg-gradient-to-b from-cream/20 via-background to-cream/10"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-earth tracking-tight ${language === "HI" ? "hindi" : ""}`}>
            {t("journey.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-20 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
            {t("journey.subtitle")}
          </p>
          
          <div className="relative max-w-7xl mx-auto">
            {/* Journey Path Line - Horizontal on desktop, vertical on mobile */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-mustard to-rust transform -translate-y-1/2 z-0" />
            <div className="md:hidden absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-mustard to-rust transform -translate-x-1/2 z-0" />
            
            {/* Journey Steps */}
            <div className="relative grid grid-cols-1 md:grid-cols-7 gap-8 md:gap-4">
              {[
                {
                  icon: Sprout,
                  label: t("journey.farm"),
                  location: t("journey.farmLocation"),
                  story: t("journey.farmStory"),
                  color: "from-secondary to-accent",
                  position: "top-0 md:top-auto",
                },
                {
                  icon: Users,
                  label: t("journey.fpo"),
                  location: t("journey.fpoLocation"),
                  story: t("journey.fpoStory"),
                  color: "from-accent to-mustard",
                  position: "bottom-0 md:top-auto",
                },
                {
                  icon: TrendingUp,
                  label: t("journey.bidding"),
                  location: t("journey.biddingLocation"),
                  story: t("journey.biddingStory"),
                  color: "from-mustard to-rust",
                  position: "top-0 md:top-auto",
                },
                {
                  icon: Building,
                  label: t("journey.processing"),
                  location: t("journey.processingLocation"),
                  story: t("journey.processingStory"),
                  color: "from-rust to-earth",
                  position: "bottom-0 md:top-auto",
                },
                {
                  icon: Award,
                  label: t("journey.packaging"),
                  location: t("journey.packagingLocation"),
                  story: t("journey.packagingStory"),
                  color: "from-earth to-secondary",
                  position: "top-0 md:top-auto",
                },
                {
                  icon: Truck,
                  label: t("journey.logistics"),
                  location: t("journey.logisticsLocation"),
                  story: t("journey.logisticsStory"),
                  color: "from-secondary to-mustard",
                  position: "bottom-0 md:top-auto",
                },
                {
                  icon: ShoppingCart,
                  label: t("journey.consumer"),
                  location: t("journey.consumerLocation"),
                  story: t("journey.consumerStory"),
                  color: "from-mustard to-rust",
                  position: "top-0 md:top-auto",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative z-10 animate-fade-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Location Pin */}
                  <div className="flex flex-col items-center group cursor-pointer">
                    {/* Pin Icon */}
                    <div className={`relative mb-4 w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center organic-shadow-medium hover-lift transition-all duration-300 group-hover:scale-110`}>
                      <step.icon className="h-12 w-12 text-white z-10" />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <MapPin className="h-6 w-6 text-rust animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Location Card - Appears on hover */}
                    <div className={`absolute ${step.position} left-1/2 transform -translate-x-1/2 w-64 md:w-72 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-20 mb-4 md:mb-0`}>
                      <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-cream organic-shadow-medium rounded-[20px]">
                        <div className="flex items-start gap-3 mb-3">
                          <MapPin className="h-5 w-5 text-rust flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className={`text-lg font-bold text-earth mb-1 ${language === "HI" ? "hindi" : ""}`}>
                              {step.label}
                            </h3>
                            <p className={`text-sm text-mustard font-semibold ${language === "HI" ? "hindi" : ""}`}>
                              {step.location}
                            </p>
                          </div>
                        </div>
                        <p className={`text-sm text-muted-foreground leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                          {step.story}
                        </p>
                      </Card>
                    </div>
                    
                    {/* Step Label */}
                    <p className={`mt-2 font-semibold text-foreground text-center text-sm md:text-base ${language === "HI" ? "hindi" : ""}`}>
                      {step.label}
                    </p>
                    
                    {/* Arrow Connector (hidden on last item) */}
                    {index < 6 && (
                      <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-0">
                        <ArrowRight className="h-6 w-6 text-mustard/50" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Traceability Badge at the end */}
            <div className="mt-16 flex justify-center animate-fade-up" style={{ animationDelay: "1.2s" }}>
              <Card className="p-8 bg-gradient-to-r from-rust/10 to-mustard/10 border-2 border-rust/30 rounded-[24px] max-w-2xl">
                <div className="flex items-center gap-4 justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-earth to-secondary flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold text-earth mb-2 ${language === "HI" ? "hindi" : ""}`}>
                      {t("journey.traceability")}
                    </h3>
                    <p className={`text-muted-foreground ${language === "HI" ? "hindi" : ""}`}>
                      {t("journey.traceabilityDesc")}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Sections - Continuous Horizontal Auto-Scroll */}
      <section
        ref={(el) => (sectionsRef.current[6] = el)}
        id="marketplace"
        className="py-20 overflow-hidden"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
            {t("marketplace.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
            {t("marketplace.subtitle")}
          </p>
          
          {/* Continuous Auto-Scroll Container */}
          <div className="auto-scroll-container">
            <div className="flex gap-6 auto-scroll">
              {/* First set of cards */}
              {marketplaceSections.map((section, index) => (
                <Card
                  key={`first-${index}`}
                  className="min-w-[320px] md:min-w-[400px] flex-shrink-0 overflow-hidden hover-lift organic-shadow-medium rounded-[16px] group"
                >
                  <div className={`h-64 bg-gradient-to-br ${section.gradient} relative p-8 flex flex-col justify-center items-center text-center transition-transform duration-300 group-hover:scale-105`}>
                    <div className="mb-4 text-earth/90 group-hover:scale-110 transition-transform icon-bounce">
                      {section.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-earth mb-3">
                      {section.title}
                    </h3>
                    <p className="text-base text-earth/80">
                      {section.description}
                    </p>
                  </div>
                </Card>
              ))}
              {/* Duplicate set for seamless loop */}
              {marketplaceSections.map((section, index) => (
                <Card
                  key={`second-${index}`}
                  className="min-w-[320px] md:min-w-[400px] flex-shrink-0 overflow-hidden hover-lift organic-shadow-medium rounded-[16px] group"
                >
                  <div className={`h-64 bg-gradient-to-br ${section.gradient} relative p-8 flex flex-col justify-center items-center text-center transition-transform duration-300 group-hover:scale-105`}>
                    <div className="mb-4 text-earth/90 group-hover:scale-110 transition-transform icon-bounce">
                      {section.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-earth mb-3">
                      {section.title}
                    </h3>
                    <p className="text-base text-earth/80">
                      {section.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features - Grouped Clusters */}
      <section
        ref={(el) => (sectionsRef.current[7] = el)}
        className="py-24 bg-gradient-to-b from-background to-cream/20"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-earth tracking-tight ${language === "HI" ? "hindi" : ""}`}>
            {t("features.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-20 text-lg md:text-xl max-w-3xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
            {t("features.subtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { icon: <TrendingUp className="h-10 w-10 text-white" />, title: t("features.marketplace"), desc: t("features.marketplaceDesc"), gradient: "from-secondary to-accent" },
              { icon: <Award className="h-10 w-10 text-white" />, title: t("features.quality"), desc: t("features.qualityDesc"), gradient: "from-mustard to-rust" },
              { icon: <QrCode className="h-10 w-10 text-white" />, title: t("features.traceability"), desc: t("features.traceabilityDesc"), gradient: "from-earth to-secondary" },
              { icon: <Truck className="h-10 w-10 text-white" />, title: t("features.logistics"), desc: t("features.logisticsDesc"), gradient: "from-rust to-mustard" },
              { icon: <FileText className="h-10 w-10 text-white" />, title: t("features.payments"), desc: t("features.paymentsDesc"), gradient: "from-secondary to-earth" },
              { icon: <UtensilsCrossed className="h-10 w-10 text-white" />, title: t("features.awareness"), desc: t("features.awarenessDesc"), gradient: "from-mustard to-secondary" },
              { icon: <Award className="h-10 w-10 text-white" />, title: t("features.schemes"), desc: t("features.schemesDesc"), gradient: "from-earth to-rust" },
              { icon: <Users className="h-10 w-10 text-white" />, title: t("features.rural"), desc: t("features.ruralDesc"), gradient: "from-accent to-mustard" },
              { icon: <TrendingUp className="h-10 w-10 text-white" />, title: t("features.insights"), desc: t("features.insightsDesc"), gradient: "from-rust to-earth" },
            ].map((cluster, index) => (
              <Card
                key={index}
                className="p-8 hover-lift organic-shadow-medium transition-all duration-300 animate-fade-up rounded-[20px] border-2 border-cream group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-20 bg-gradient-to-br ${cluster.gradient} rounded-[12px] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  {cluster.icon}
                </div>
                <h3 className={`text-xl md:text-2xl font-bold mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
                  {cluster.title}
                </h3>
                <p className={`text-sm text-muted-foreground leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                  {cluster.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section
        ref={(el) => (sectionsRef.current[8] = el)}
        className="py-20 bg-gradient-to-br from-secondary to-accent"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 text-earth ${language === "HI" ? "hindi" : ""}`}>
            {t("stats.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Counter end={stat.number} suffix={stat.suffix} />
                <p className={`mt-4 text-lg font-semibold text-earth ${language === "HI" ? "hindi" : ""}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Survey Section - 4-Part Sliding Card Stack */}
      <section
        ref={(el) => (sectionsRef.current[9] = el)}
        id="survey"
        className="py-24 bg-gradient-to-br from-cream/30 via-mustard/10 to-rust/10"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-earth tracking-tight ${language === "HI" ? "hindi" : ""}`}>
            {t("survey.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-16 text-lg md:text-xl max-w-3xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
            {t("survey.subtitle")}
          </p>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: <Sprout className="h-12 w-12 text-rust" />, title: t("survey.farmers"), desc: t("survey.farmersDesc"), color: "from-rust/20 to-mustard/20", border: "border-rust/30" },
                { icon: <Users className="h-12 w-12 text-mustard" />, title: t("survey.shgs"), desc: t("survey.shgsDesc"), color: "from-mustard/20 to-secondary/20", border: "border-mustard/30" },
                { icon: <Building className="h-12 w-12 text-secondary" />, title: t("survey.buyers"), desc: t("survey.buyersDesc"), color: "from-secondary/20 to-earth/20", border: "border-secondary/30" },
                { icon: <ShoppingCart className="h-12 w-12 text-earth" />, title: t("survey.consumers"), desc: t("survey.consumersDesc"), color: "from-earth/20 to-rust/20", border: "border-earth/30" },
              ].map((card, index) => (
                <Card
                  key={index}
                  className={`p-8 hover-lift organic-shadow-medium transition-all duration-300 animate-stack rounded-[20px] border-2 ${card.border} bg-gradient-to-br ${card.color}`}
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    zIndex: 4 - index
                  }}
                >
                  <div className="flex items-start gap-6">
                    <div className="icon-bounce flex-shrink-0">{card.icon}</div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
                        {card.title}
                      </h3>
                      <p className={`text-muted-foreground leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={(el) => (sectionsRef.current[10] = el)}
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
            {t("testimonials.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
            {t("testimonials.subtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 hover-lift organic-shadow animate-fade-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="mb-6">
                  <div className="text-4xl text-secondary">"</div>
                </div>
                <p className={`text-muted-foreground mb-6 italic ${language === "HI" ? "hindi" : ""}`}>{testimonial.quote}</p>
                <div className="border-t border-border pt-4">
                  <p className={`font-bold text-foreground ${language === "HI" ? "hindi" : ""}`}>{testimonial.name}</p>
                  <p className={`text-sm text-muted-foreground ${language === "HI" ? "hindi" : ""}`}>{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-earth text-earth-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">KrishiNetra</h3>
              <p className={`text-earth-foreground/80 mb-4 ${language === "HI" ? "hindi" : ""}`}>
                {t("footer.tagline")}
              </p>
              {/* Social Icons */}
              <div className="flex space-x-4">
                <a href="#" className="p-2 rounded-full bg-earth-foreground/10 hover:bg-earth-foreground/20 transition-smooth" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 rounded-full bg-earth-foreground/10 hover:bg-earth-foreground/20 transition-smooth" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 rounded-full bg-earth-foreground/10 hover:bg-earth-foreground/20 transition-smooth" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 rounded-full bg-earth-foreground/10 hover:bg-earth-foreground/20 transition-smooth" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${language === "HI" ? "hindi" : ""}`}>{t("footer.about")}</h4>
              <ul className="space-y-2 text-earth-foreground/80">
                <li><a href="#about" className={`hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}>{t("footer.aboutUs")}</a></li>
                <li><a href="#marketplace" className={`hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}>{t("footer.marketplace")}</a></li>
                <li><a href="#survey" className={`hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}>{t("footer.survey")}</a></li>
                <li><a href="#" className={`hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}>{t("footer.mission")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${language === "HI" ? "hindi" : ""}`}>{t("footer.contact")}</h4>
              <ul className="space-y-2 text-earth-foreground/80">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:info@krishinetra.in" className="hover:text-primary transition-smooth">info@krishinetra.in</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+911800123456" className="hover:text-primary transition-smooth">1800-123-456</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${language === "HI" ? "hindi" : ""}`}>{t("footer.policies")}</h4>
              <ul className="space-y-2 text-earth-foreground/80">
                <li><a href="#" className={`hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}>{t("footer.privacy")}</a></li>
                <li><a href="#" className={`hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}>{t("footer.terms")}</a></li>
                <li><a href="#" className={`hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}>{t("footer.refund")}</a></li>
                <li><a href="#" className={`hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}>{t("footer.faqs")}</a></li>
              </ul>
            </div>
          </div>
          
          {/* Language Selector & Government Schemes */}
          <div className="border-t border-earth-foreground/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <span className={`text-sm font-semibold ${language === "HI" ? "hindi" : ""}`}>{t("footer.language")}</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setLanguage("EN")}
                    className={`text-xs rounded-[12px] border-earth-foreground/30 text-earth-foreground hover:bg-earth-foreground/10 ${language === "EN" ? "bg-earth-foreground/20" : ""}`}
                  >
                    English
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setLanguage("HI")}
                    className={`text-xs rounded-[12px] border-earth-foreground/30 text-earth-foreground hover:bg-earth-foreground/10 hindi ${language === "HI" ? "bg-earth-foreground/20" : ""}`}
                  >
                    हिंदी
                  </Button>
                </div>
              </div>
              
              {/* Government Scheme Logos Placeholder */}
              <div className="flex items-center gap-4">
                <span className={`text-sm text-earth-foreground/60 ${language === "HI" ? "hindi" : ""}`}>{t("footer.supported")}</span>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-earth-foreground/10 rounded-lg text-xs font-semibold">Govt. of India</div>
                  <div className="px-4 py-2 bg-earth-foreground/10 rounded-lg text-xs font-semibold">Shree Anna</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-earth-foreground/20 mt-8 pt-8 text-center text-earth-foreground/60">
            <p className={language === "HI" ? "hindi" : ""}>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
