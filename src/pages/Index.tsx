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
} from "lucide-react";
import farmToFork from "@/assets/farm-to-fork.png";
import milletProducts from "@/assets/millet-products.jpg";

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

  const problems = [
    {
      icon: <Sprout className="h-12 w-12 text-secondary" />,
      title: t("problem.lowMarket"),
      description: t("problem.lowMarketDesc"),
    },
    {
      icon: <Users className="h-12 w-12 text-secondary" />,
      title: t("problem.shgVisibility"),
      description: t("problem.shgVisibilityDesc"),
    },
    {
      icon: <Building className="h-12 w-12 text-secondary" />,
      title: t("problem.sourcing"),
      description: t("problem.sourcingDesc"),
    },
    {
      icon: <Shield className="h-12 w-12 text-secondary" />,
      title: t("problem.trust"),
      description: t("problem.trustDesc"),
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

      {/* Problem Section - Stacked Cards */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        id="problem"
        className="py-20 bg-muted/30"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
            {t("problem.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
            {t("problem.subtitle")}
          </p>
          <div className="max-w-4xl mx-auto space-y-6">
            {problems.map((problem, index) => (
              <Card
                key={index}
                className="p-8 hover-lift organic-shadow-medium transition-smooth animate-stack rounded-[16px]"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  zIndex: problems.length - index
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="icon-bounce">{problem.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {problem.title}
                    </h3>
                    <p className="text-muted-foreground">{problem.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What is KrishiNetra */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        id="about"
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <img
                src={farmToFork}
                alt="Farm to Fork Journey"
                className="rounded-2xl organic-shadow-medium w-full"
              />
            </div>
            <div className="animate-slide-right">
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 text-earth ${language === "HI" ? "hindi" : ""}`}>
                {t("solution.title")} <span className="text-secondary">{t("solution.titleHighlight")}</span>?
              </h2>
              <p className={`text-lg text-muted-foreground mb-6 leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                {t("solution.desc1")}
              </p>
              <p className={`text-lg text-muted-foreground mb-8 leading-relaxed ${language === "HI" ? "hindi" : ""}`}>
                {t("solution.desc2")}
              </p>
              <Button
                size="lg"
                className={`ripple bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-[14px] px-8 py-6 hover-glow transition-smooth hover:scale-105 ${language === "HI" ? "hindi" : ""}`}
              >
                {t("solution.learnMore")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Farm-to-Fork Journey Timeline */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="py-20 bg-gradient-to-b from-muted/30 to-background"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
            {t("journey.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
            {t("journey.subtitle")}
          </p>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0 md:space-x-4">
              {[
                { icon: Sprout, label: t("journey.farm") },
                { icon: Users, label: t("journey.fpo") },
                { icon: TrendingUp, label: t("journey.bidding") },
                { icon: Building, label: t("journey.processing") },
                { icon: Award, label: t("journey.packaging") },
                { icon: ShoppingCart, label: t("journey.consumer") },
                { icon: QrCode, label: t("journey.traceability") },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center animate-scale-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center organic-shadow-medium hover-lift">
                    <step.icon className="h-10 w-10 text-earth" />
                  </div>
                  <p className={`mt-4 font-semibold text-foreground text-center ${language === "HI" ? "hindi" : ""}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Sections - Continuous Horizontal Auto-Scroll */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
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

      {/* Features Grid */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="py-20 bg-muted/30"
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
            {t("features.title")}
          </h2>
          <p className={`text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
            {t("features.subtitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover-lift organic-shadow-medium text-center animate-scale-in rounded-[16px] group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-earth icon-bounce group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 text-foreground ${language === "HI" ? "hindi" : ""}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm text-muted-foreground ${language === "HI" ? "hindi" : ""}`}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
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

      {/* Survey Section */}
      <section
        ref={(el) => (sectionsRef.current[6] = el)}
        id="survey"
        className="py-20 bg-gradient-to-br from-accent/20 to-secondary/20"
      >
        <div className="container mx-auto px-6">
          <Card className="max-w-3xl mx-auto p-12 text-center organic-shadow-medium rounded-[16px] animate-fade-up">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-earth ${language === "HI" ? "hindi" : ""}`}>
              {t("survey.title")}
            </h2>
            <p className={`text-lg text-muted-foreground mb-8 max-w-2xl mx-auto ${language === "HI" ? "hindi" : ""}`}>
              {t("survey.desc")}
            </p>
            <Button
              size="lg"
              className={`ripple bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-[14px] px-8 py-6 text-lg hover-glow transition-smooth hover:scale-105 ${language === "HI" ? "hindi" : ""}`}
            >
              {t("survey.button")}
            </Button>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={(el) => (sectionsRef.current[7] = el)}
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
