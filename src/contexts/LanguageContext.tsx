import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "EN" | "HI";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Navbar
    "nav.home": "Home",
    "nav.marketplace": "Marketplace",
    "nav.bidding": "Bidding",
    "nav.traceability": "Traceability",
    "nav.awareness": "Awareness",
    "nav.schemes": "Schemes",
    "nav.about": "About",
    "nav.survey": "Survey",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    
    // Hero Section
    "hero.title": "Empowering India's Shree Anna Value Chain — Digitally & Transparently.",
    "hero.subtitle": "KrishiNetra bridges farmers, SHGs, buyers, processors, and consumers through a unified millet marketplace.",
    "hero.explore": "Explore Marketplace",
    "hero.sell": "Sell My Produce",
    
    // Problem Section
    "problem.title": "The Challenge We're Solving",
    "problem.subtitle": "Understanding the gaps in India's millet value chain",
    "problem.lowMarket": "Low Market Access",
    "problem.lowMarketDesc": "Farmers struggle to reach buyers and get fair prices for their millet produce",
    "problem.shgVisibility": "SHGs Lack Visibility",
    "problem.shgVisibilityDesc": "Self Help Groups need platforms to showcase their quality millet products",
    "problem.sourcing": "Sourcing Challenges",
    "problem.sourcingDesc": "Processors struggle to find reliable sources of quality millet",
    "problem.trust": "Trust Deficit",
    "problem.trustDesc": "Consumers don't have transparency in millet product authenticity",
    
    // Solution Section
    "solution.title": "What is",
    "solution.titleHighlight": "KrishiNetra",
    "solution.desc1": "KrishiNetra is a comprehensive digital millet marketplace that revolutionizes the entire millet value chain. We integrate farmers, FPOs, SHGs, processors, buyers, and consumers on a single platform.",
    "solution.desc2": "With features like end-to-end traceability, transparent bidding, quality verification, and awareness programs, we ensure that Shree Anna reaches every household while empowering every stakeholder in the journey.",
    "solution.learnMore": "Learn More About Our Mission",
    
    // Journey Section
    "journey.title": "Farm-to-Fork Journey",
    "journey.subtitle": "Transparent traceability at every step",
    "journey.farm": "Farm",
    "journey.fpo": "FPO",
    "journey.bidding": "Bidding",
    "journey.processing": "Processing",
    "journey.packaging": "Packaging",
    "journey.consumer": "Consumer",
    "journey.traceability": "Traceability",
    
    // Marketplace
    "marketplace.title": "Our Marketplace Ecosystem",
    "marketplace.subtitle": "Multiple platforms, one unified experience",
    "marketplace.b2b": "B2B Millet Lots",
    "marketplace.b2bDesc": "Transparent auction platform for bulk millet procurement",
    "marketplace.shg": "SHG Products",
    "marketplace.shgDesc": "Women-led groups showcasing artisanal millet goods",
    "marketplace.packaged": "Packaged Millets",
    "marketplace.packagedDesc": "Premium packaged millet products for consumers",
    "marketplace.snacks": "Millet Snacks",
    "marketplace.snacksDesc": "Healthy millet-based snacks and ready-to-eat products",
    
    // Features
    "features.title": "Powerful Features",
    "features.subtitle": "Built for transparency, trust, and efficiency",
    "features.bidding": "Bidding Marketplace",
    "features.biddingDesc": "Transparent auction platform for bulk procurement",
    "features.traceability": "Traceability QR",
    "features.traceabilityDesc": "Track millet from farm to your plate",
    "features.quality": "Quality Verification",
    "features.qualityDesc": "Government-backed quality badges",
    "features.logistics": "Logistics",
    "features.logisticsDesc": "End-to-end delivery solutions",
    "features.schemes": "Govt Schemes Navigator",
    "features.schemesDesc": "Navigate agricultural schemes",
    "features.awareness": "Awareness Hub",
    "features.awarenessDesc": "Nutrition awareness & recipes",
    "features.verified": "Verified Sellers",
    "features.verifiedDesc": "Authenticated farmer onboarding",
    "features.offline": "Rural Offline Mode",
    "features.offlineDesc": "Accessible without internet",
    
    // Stats
    "stats.title": "Our Growing Impact",
    "stats.farmers": "Farmers Onboarded",
    "stats.shgs": "SHGs Empowered",
    "stats.lots": "Millet Lots Processed",
    "stats.sellers": "Verified Sellers",
    "stats.awareness": "Nutrition Awareness Reach",
    
    // Survey
    "survey.title": "Help Us Improve — Take Our 2-Minute Millet Awareness Survey",
    "survey.desc": "Your inputs help shape India's next-gen millet ecosystem.",
    "survey.button": "Take Survey",
    
    // Testimonials
    "testimonials.title": "Stories of Transformation",
    "testimonials.subtitle": "Hear from our community",
    "testimonial.1.quote": "KrishiNetra helped me connect directly with buyers. I got 30% better price than local mandis!",
    "testimonial.1.name": "Ramesh Kumar",
    "testimonial.1.role": "Millet Farmer, Karnataka",
    "testimonial.2.quote": "Our millet products now reach customers across India. This platform changed our lives.",
    "testimonial.2.name": "Lakshmi SHG",
    "testimonial.2.role": "Self Help Group, Tamil Nadu",
    "testimonial.3.quote": "Sourcing quality millet has become hassle-free. The traceability feature ensures transparency.",
    "testimonial.3.name": "Arun Processors",
    "testimonial.3.role": "Food Processing Unit",
    
    // Footer
    "footer.tagline": "Empowering India's millet revolution through digital innovation",
    "footer.about": "About",
    "footer.aboutUs": "About Us",
    "footer.marketplace": "Marketplace",
    "footer.survey": "Survey",
    "footer.mission": "Our Mission",
    "footer.contact": "Contact",
    "footer.help": "Help Center",
    "footer.faqs": "FAQs",
    "footer.terms": "Terms of Service",
    "footer.refund": "Refund Policy",
    "footer.policies": "Policies",
    "footer.privacy": "Privacy Policy",
    "footer.language": "Language:",
    "footer.supported": "Supported by:",
    "footer.copyright": "© 2024 KrishiNetra. Empowering farmers, enriching lives. Made with 💚 for Bharat.",
  },
  HI: {
    // Navbar
    "nav.home": "होम",
    "nav.marketplace": "मार्केटप्लेस",
    "nav.bidding": "बोली",
    "nav.traceability": "ट्रेसबिलिटी",
    "nav.awareness": "जागरूकता",
    "nav.schemes": "योजनाएं",
    "nav.about": "हमारे बारे में",
    "nav.survey": "सर्वेक्षण",
    "nav.login": "लॉगिन",
    "nav.signup": "साइन अप",
    
    // Hero Section
    "hero.title": "भारत के श्री अन्न वैल्यू चेन को सशक्त बनाना — डिजिटल और पारदर्शी रूप से।",
    "hero.subtitle": "कृषि नेत्र किसानों, स्वयं सहायता समूहों, खरीदारों, प्रोसेसरों और उपभोक्ताओं को एक एकीकृत बाजरा बाज़ार के माध्यम से जोड़ता है।",
    "hero.explore": "मार्केटप्लेस देखें",
    "hero.sell": "मेरी उपज बेचें",
    
    // Problem Section
    "problem.title": "हम जिस चुनौती का समाधान कर रहे हैं",
    "problem.subtitle": "भारत के बाजरा वैल्यू चेन में अंतराल को समझना",
    "problem.lowMarket": "कम बाज़ार पहुंच",
    "problem.lowMarketDesc": "किसानों को खरीदारों तक पहुंचने और अपनी बाजरा उपज के लिए उचित मूल्य प्राप्त करने में कठिनाई होती है",
    "problem.shgVisibility": "स्वयं सहायता समूहों की दृश्यता की कमी",
    "problem.shgVisibilityDesc": "स्वयं सहायता समूहों को अपने गुणवत्तापूर्ण बाजरा उत्पादों को प्रदर्शित करने के लिए प्लेटफॉर्म की आवश्यकता है",
    "problem.sourcing": "सोर्सिंग चुनौतियां",
    "problem.sourcingDesc": "प्रोसेसरों को गुणवत्तापूर्ण बाजरा के विश्वसनीय स्रोत खोजने में कठिनाई होती है",
    "problem.trust": "विश्वास की कमी",
    "problem.trustDesc": "उपभोक्ताओं को बाजरा उत्पादों की प्रामाणिकता में पारदर्शिता नहीं है",
    
    // Solution Section
    "solution.title": "क्या है",
    "solution.titleHighlight": "कृषि नेत्र",
    "solution.desc1": "कृषि नेत्र एक व्यापक डिजिटल बाजरा बाज़ार है जो पूरे बाजरा वैल्यू चेन में क्रांति लाता है। हम किसानों, एफपीओ, स्वयं सहायता समूहों, प्रोसेसरों, खरीदारों और उपभोक्ताओं को एक ही प्लेटफॉर्म पर एकीकृत करते हैं।",
    "solution.desc2": "एंड-टू-एंड ट्रेसबिलिटी, पारदर्शी बोली, गुणवत्ता सत्यापन और जागरूकता कार्यक्रमों जैसी सुविधाओं के साथ, हम यह सुनिश्चित करते हैं कि श्री अन्न हर घर तक पहुंचे जबकि यात्रा में हर हितधारक को सशक्त बनाया जाए।",
    "solution.learnMore": "हमारे मिशन के बारे में अधिक जानें",
    
    // Journey Section
    "journey.title": "फार्म-टू-फोर्क यात्रा",
    "journey.subtitle": "हर कदम पर पारदर्शी ट्रेसबिलिटी",
    "journey.farm": "खेत",
    "journey.fpo": "एफपीओ",
    "journey.bidding": "बोली",
    "journey.processing": "प्रसंस्करण",
    "journey.packaging": "पैकेजिंग",
    "journey.consumer": "उपभोक्ता",
    "journey.traceability": "ट्रेसबिलिटी",
    
    // Marketplace
    "marketplace.title": "हमारा मार्केटप्लेस इकोसिस्टम",
    "marketplace.subtitle": "कई प्लेटफॉर्म, एक एकीकृत अनुभव",
    "marketplace.b2b": "बी2बी बाजरा लॉट",
    "marketplace.b2bDesc": "थोक बाजरा खरीद के लिए पारदर्शी नीलामी प्लेटफॉर्म",
    "marketplace.shg": "स्वयं सहायता समूह उत्पाद",
    "marketplace.shgDesc": "महिला-नेतृत्व वाले समूह शिल्प बाजरा सामान प्रदर्शित करते हैं",
    "marketplace.packaged": "पैक किए गए बाजरा",
    "marketplace.packagedDesc": "उपभोक्ताओं के लिए प्रीमियम पैक किए गए बाजरा उत्पाद",
    "marketplace.snacks": "बाजरा स्नैक्स",
    "marketplace.snacksDesc": "स्वस्थ बाजरा-आधारित स्नैक्स और तैयार-से-खाने वाले उत्पाद",
    
    // Features
    "features.title": "शक्तिशाली सुविधाएं",
    "features.subtitle": "पारदर्शिता, विश्वास और दक्षता के लिए निर्मित",
    "features.bidding": "बोली मार्केटप्लेस",
    "features.biddingDesc": "थोक खरीद के लिए पारदर्शी नीलामी प्लेटफॉर्म",
    "features.traceability": "ट्रेसबिलिटी क्यूआर",
    "features.traceabilityDesc": "खेत से आपकी प्लेट तक बाजरा ट्रैक करें",
    "features.quality": "गुणवत्ता सत्यापन",
    "features.qualityDesc": "सरकार-समर्थित गुणवत्ता बैज",
    "features.logistics": "लॉजिस्टिक्स",
    "features.logisticsDesc": "एंड-टू-एंड डिलीवरी समाधान",
    "features.schemes": "सरकारी योजना नेविगेटर",
    "features.schemesDesc": "कृषि योजनाओं को नेविगेट करें",
    "features.awareness": "जागरूकता हब",
    "features.awarenessDesc": "पोषण जागरूकता और व्यंजन",
    "features.verified": "सत्यापित विक्रेता",
    "features.verifiedDesc": "प्रमाणित किसान ऑनबोर्डिंग",
    "features.offline": "ग्रामीण ऑफलाइन मोड",
    "features.offlineDesc": "इंटरनेट के बिना सुलभ",
    
    // Stats
    "stats.title": "हमारा बढ़ता प्रभाव",
    "stats.farmers": "किसान ऑनबोर्ड किए गए",
    "stats.shgs": "स्वयं सहायता समूह सशक्त",
    "stats.lots": "बाजरा लॉट प्रसंस्कृत",
    "stats.sellers": "सत्यापित विक्रेता",
    "stats.awareness": "पोषण जागरूकता पहुंच",
    
    // Survey
    "survey.title": "हमें सुधारने में मदद करें — हमारे 2-मिनट बाजरा जागरूकता सर्वेक्षण में भाग लें",
    "survey.desc": "आपके इनपुट भारत के अगली पीढ़ी के बाजरा इकोसिस्टम को आकार देने में मदद करते हैं।",
    "survey.button": "सर्वेक्षण करें",
    
    // Testimonials
    "testimonials.title": "परिवर्तन की कहानियां",
    "testimonials.subtitle": "हमारे समुदाय से सुनें",
    "testimonial.1.quote": "कृषि नेत्र ने मुझे सीधे खरीदारों से जुड़ने में मदद की। मुझे स्थानीय मंडियों की तुलना में 30% बेहतर मूल्य मिला!",
    "testimonial.1.name": "रमेश कुमार",
    "testimonial.1.role": "बाजरा किसान, कर्नाटक",
    "testimonial.2.quote": "हमारे बाजरा उत्पाद अब पूरे भारत में ग्राहकों तक पहुंचते हैं। इस प्लेटफॉर्म ने हमारे जीवन को बदल दिया।",
    "testimonial.2.name": "लक्ष्मी स्वयं सहायता समूह",
    "testimonial.2.role": "स्वयं सहायता समूह, तमिलनाडु",
    "testimonial.3.quote": "गुणवत्तापूर्ण बाजरा सोर्स करना अब परेशानी मुक्त हो गया है। ट्रेसबिलिटी सुविधा पारदर्शिता सुनिश्चित करती है।",
    "testimonial.3.name": "अरुण प्रोसेसर्स",
    "testimonial.3.role": "खाद्य प्रसंस्करण इकाई",
    
    // Footer
    "footer.tagline": "डिजिटल नवाचार के माध्यम से भारत की बाजरा क्रांति को सशक्त बनाना",
    "footer.about": "के बारे में",
    "footer.aboutUs": "हमारे बारे में",
    "footer.marketplace": "मार्केटप्लेस",
    "footer.survey": "सर्वेक्षण",
    "footer.mission": "हमारा मिशन",
    "footer.contact": "संपर्क करें",
    "footer.help": "सहायता केंद्र",
    "footer.faqs": "अक्सर पूछे जाने वाले प्रश्न",
    "footer.terms": "सेवा की शर्तें",
    "footer.refund": "रिफंड नीति",
    "footer.policies": "नीतियां",
    "footer.privacy": "गोपनीयता नीति",
    "footer.language": "भाषा:",
    "footer.supported": "द्वारा समर्थित:",
    "footer.copyright": "© 2024 कृषि नेत्र। किसानों को सशक्त बनाना, जीवन को समृद्ध बनाना। भारत के लिए 💚 के साथ बनाया गया।",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to EN
    const saved = localStorage.getItem("language") as Language;
    return saved && (saved === "EN" || saved === "HI") ? saved : "EN";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang === "HI" ? "hi" : "en";
  };

  useEffect(() => {
    // Set initial lang attribute
    document.documentElement.lang = language === "HI" ? "hi" : "en";
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

