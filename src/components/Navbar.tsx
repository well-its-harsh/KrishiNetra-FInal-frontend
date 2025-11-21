import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const menuItems = [
    { key: "nav.home", href: "home" },
    { key: "nav.marketplace", href: "marketplace" },
    { key: "nav.bidding", href: "bidding" },
    { key: "nav.traceability", href: "traceability" },
    { key: "nav.awareness", href: "awareness" },
    { key: "nav.schemes", href: "schemes" },
    { key: "nav.about", href: "about" },
    { key: "nav.survey", href: "survey" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-[#043915CC] backdrop-blur-md organic-shadow-medium"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">KrishiNetra</div>
            <div className="hidden sm:block text-xs text-primary hindi">श्री अन्न</div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.key}
                href={`#${item.href}`}
                className={`text-sm font-medium text-white hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}
              >
                {t(item.key)}
              </a>
            ))}
          </div>

          {/* Language Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="flex items-center space-x-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setLanguage("EN")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth ${
                  language === "EN"
                    ? "bg-primary text-earth"
                    : "text-white hover:text-primary"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("HI")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth hindi ${
                  language === "HI"
                    ? "bg-primary text-earth"
                    : "text-white hover:text-primary"
                }`}
              >
                HI
              </button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-[14px] border-white/30 text-white hover:bg-white/10 ${language === "HI" ? "hindi" : ""}`}
              onClick={() => window.location.href = '/auth'}
            >
              {t("nav.login")}
            </Button>
            <Button
              size="sm"
              className={`bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-[14px] ${language === "HI" ? "hindi" : ""}`}
              onClick={() => window.location.href = '/auth'}
            >
              {t("nav.signup")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 animate-fade-up">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.key}
                  href={`#${item.href}`}
                  className={`text-sm font-medium text-white hover:text-primary transition-smooth ${language === "HI" ? "hindi" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(item.key)}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                {/* Language Toggle Mobile */}
                <div className="flex items-center space-x-1 bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage("EN")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth ${
                      language === "EN"
                        ? "bg-primary text-earth"
                        : "text-white hover:text-primary"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("HI")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth hindi ${
                      language === "HI"
                        ? "bg-primary text-earth"
                        : "text-white hover:text-primary"
                    }`}
                  >
                    HI
                  </button>
                </div>
                <Button variant="outline" size="sm" className={`rounded-[14px] border-white/30 text-white hover:bg-white/10 ${language === "HI" ? "hindi" : ""}`}>
                  {t("nav.login")}
                </Button>
                <Button
                  size="sm"
                  className={`bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-[14px] ${language === "HI" ? "hindi" : ""}`}
                >
                  {t("nav.signup")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
