import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import Counter from "@/components/StatsCounter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
} from "lucide-react";
import farmToFork from "@/assets/farm-to-fork.png";
import milletProducts from "@/assets/millet-products.jpg";

const Index = () => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

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
      title: "Low Market Access",
      description: "Farmers struggle to reach buyers and get fair prices for their millet produce",
    },
    {
      icon: <Users className="h-12 w-12 text-secondary" />,
      title: "SHGs Lack Visibility",
      description: "Self Help Groups need platforms to showcase their quality millet products",
    },
    {
      icon: <Building className="h-12 w-12 text-secondary" />,
      title: "Sourcing Challenges",
      description: "Processors struggle to find reliable sources of quality millet",
    },
    {
      icon: <Shield className="h-12 w-12 text-secondary" />,
      title: "Trust Deficit",
      description: "Consumers don't have transparency in millet product authenticity",
    },
  ];

  const features = [
    {
      icon: <QrCode className="h-10 w-10" />,
      title: "Traceability QR",
      description: "Track millet from farm to your plate",
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: "Quality Verification",
      description: "Government-backed quality badges",
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Verified Sellers",
      description: "Authenticated farmer onboarding",
    },
    {
      icon: <Truck className="h-10 w-10" />,
      title: "Logistics Support",
      description: "End-to-end delivery solutions",
    },
    {
      icon: <FileText className="h-10 w-10" />,
      title: "Govt Schemes",
      description: "Navigate agricultural schemes",
    },
    {
      icon: <UtensilsCrossed className="h-10 w-10" />,
      title: "Recipe Hub",
      description: "Nutrition awareness & recipes",
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Market Insights",
      description: "Real-time pricing & trends",
    },
    {
      icon: <Leaf className="h-10 w-10" />,
      title: "Sustainability",
      description: "Promoting organic farming",
    },
  ];

  const marketplaceSections = [
    {
      title: "B2B Millet Lot Bidding",
      description: "Transparent auction platform for bulk millet procurement with competitive pricing",
      gradient: "from-secondary to-accent",
    },
    {
      title: "B2C Millet Store",
      description: "Direct consumer marketplace for premium packaged millet products",
      gradient: "from-accent to-primary",
    },
    {
      title: "SHG Products Showcase",
      description: "Empowering women-led groups with digital storefront for artisanal millet goods",
      gradient: "from-primary to-secondary",
    },
  ];

  const stats = [
    { number: 5000, suffix: "+", label: "Farmers Onboarded" },
    { number: 200, suffix: "+", label: "SHGs Empowered" },
    { number: 10000, suffix: "+", label: "Millet Lots Processed" },
    { number: 500, suffix: "+", label: "Verified Sellers" },
    { number: 50000, suffix: "+", label: "Nutrition Awareness Reach" },
  ];

  const testimonials = [
    {
      name: "Ramesh Kumar",
      role: "Millet Farmer, Karnataka",
      quote:
        "KrishiNetra helped me connect directly with buyers. I got 30% better price than local mandis!",
    },
    {
      name: "Lakshmi SHG",
      role: "Self Help Group, Tamil Nadu",
      quote:
        "Our millet products now reach customers across India. This platform changed our lives.",
    },
    {
      name: "Arun Processors",
      role: "Food Processing Unit",
      quote:
        "Sourcing quality millet has become hassle-free. The traceability feature ensures transparency.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />

      {/* Problem Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        id="problem"
        className="py-20 bg-muted/30"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-earth">
            The Challenge We're Solving
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
            Understanding the gaps in India's millet value chain
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((problem, index) => (
              <Card
                key={index}
                className="p-8 hover-lift organic-shadow transition-smooth"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">{problem.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground">{problem.description}</p>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-earth">
                What is <span className="text-secondary">KrishiNetra</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                KrishiNetra is a comprehensive digital millet marketplace that
                revolutionizes the entire millet value chain. We integrate farmers,
                FPOs, SHGs, processors, buyers, and consumers on a single platform.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                With features like end-to-end traceability, transparent bidding,
                quality verification, and awareness programs, we ensure that Shree
                Anna reaches every household while empowering every stakeholder in
                the journey.
              </p>
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl px-8 py-6"
              >
                Learn More About Our Mission
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
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-earth">
            Farm-to-Fork Journey
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
            Transparent traceability at every step
          </p>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0 md:space-x-4">
              {[
                { icon: Sprout, label: "Farm" },
                { icon: Users, label: "FPO Collection" },
                { icon: TrendingUp, label: "Bidding" },
                { icon: Building, label: "Processing" },
                { icon: Award, label: "Packaging" },
                { icon: ShoppingCart, label: "Consumer" },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center animate-scale-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center organic-shadow-medium hover-lift">
                    <step.icon className="h-10 w-10 text-earth" />
                  </div>
                  <p className="mt-4 font-semibold text-foreground text-center">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Sections - Card Stacking */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        id="marketplace"
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-earth">
            Our Marketplace Ecosystem
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
            Multiple platforms, one unified experience
          </p>
          <div className="space-y-8 max-w-5xl mx-auto">
            {marketplaceSections.map((section, index) => (
              <Card
                key={index}
                className="overflow-hidden hover-lift organic-shadow-medium animate-stack"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`h-64 bg-gradient-to-br ${section.gradient} relative`}>
                  <img
                    src={milletProducts}
                    alt={section.title}
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                    <h3 className="text-3xl md:text-4xl font-bold text-earth mb-4">
                      {section.title}
                    </h3>
                    <p className="text-lg text-earth/90 max-w-2xl">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="py-20 bg-muted/30"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-earth">
            Powerful Features
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
            Built for transparency, trust, and efficiency
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover-lift organic-shadow text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-earth">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
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
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-earth">
            Our Growing Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Counter end={stat.number} suffix={stat.suffix} />
                <p className="mt-4 text-lg font-semibold text-earth">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={(el) => (sectionsRef.current[6] = el)}
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-earth">
            Stories of Transformation
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
            Hear from our community
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
                <p className="text-muted-foreground mb-6 italic">{testimonial.quote}</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-earth text-earth-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">KrishiNetra</h3>
              <p className="text-earth-foreground/80">
                Empowering India's millet revolution through digital innovation
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-earth-foreground/80">
                <li><a href="#marketplace" className="hover:text-primary transition-smooth">Marketplace</a></li>
                <li><a href="#about" className="hover:text-primary transition-smooth">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-earth-foreground/80">
                <li><a href="#" className="hover:text-primary transition-smooth">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">FAQs</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Languages</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs rounded-lg">
                  English
                </Button>
                <Button variant="outline" size="sm" className="text-xs rounded-lg">
                  हिंदी
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-earth-foreground/20 mt-8 pt-8 text-center text-earth-foreground/60">
            <p>© 2024 KrishiNetra. Empowering farmers, enriching lives. Made with 💚 for Bharat.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
