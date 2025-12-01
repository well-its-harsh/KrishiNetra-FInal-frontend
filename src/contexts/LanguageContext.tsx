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
    "hero.tagline": "Growing Trust. Connecting Every Grain.",
    "hero.title": "EMPOWER YOUR PLATE.",
    "hero.oneLiner": "A full-stack millet ecosystem that unites farmers, FPOs, SHGs, buyers, processors, and consumers through trade, traceability, quality, logistics, and government support — all in one digital platform.",
    "hero.explore": "Explore Platform",
    "hero.sell": "Sell My Produce",
    
    // Problem Section
    "problem.title": "Problem We Are Solving",
    "problem.subtitle": "Understanding the gaps in India's millet value chain",
    "problem.farmersTitle": "Farmers & SHGs Pain Points",
    "problem.farmersDesc": "Limited market access, price exploitation by middlemen, lack of direct buyer connections, and difficulty showcasing product quality",
    "problem.buyersTitle": "Buyers Pain Points",
    "problem.buyersDesc": "Difficulty sourcing quality millet at scale, lack of traceability, unreliable supply chains, and inconsistent quality standards",
    "problem.consumersTitle": "Consumers Pain Points",
    "problem.consumersDesc": "Uncertainty about product authenticity, lack of nutritional information, limited awareness about millet benefits, and difficulty finding trusted sources",
    "problem.systemTitle": "System-Level Gaps",
    "problem.systemDesc": "Fragmented value chain, lack of digital infrastructure, insufficient government scheme awareness, and poor logistics coordination",
    "problem.summary": "Millet demand exists, supply exists — the chain is broken.",
    "problem.lowMarket": "Low Market Access",
    "problem.lowMarketDesc": "Farmers struggle to reach buyers and get fair prices for their millet produce",
    "problem.shgVisibility": "SHGs Lack Visibility",
    "problem.shgVisibilityDesc": "Self Help Groups need platforms to showcase their quality millet products",
    "problem.sourcing": "Sourcing Challenges",
    "problem.sourcingDesc": "Processors struggle to find reliable sources of quality millet",
    "problem.trust": "Trust Deficit",
    "problem.trustDesc": "Consumers don't have transparency in millet product authenticity",
    
    // Why Problem Matters
    "whyMatters.title": "Why This Problem Matters",
    "whyMatters.climate": "Climate Resilience",
    "whyMatters.climateDesc": "Millets are drought-resistant crops crucial for food security in changing climate",
    "whyMatters.nutrition": "Nutrition Security",
    "whyMatters.nutritionDesc": "Millets are nutrient-dense superfoods essential for combating malnutrition",
    "whyMatters.income": "Farmer Income",
    "whyMatters.incomeDesc": "Fair pricing and direct market access can increase farmer income by 30-40%",
    "whyMatters.mission": "Government Mission",
    "whyMatters.missionDesc": "Supporting India's Shree Anna mission to promote millet consumption nationwide",
    
    // Solution Pillars
    "solution.title": "What Is Our Solution",
    "solution.pillar1": "Marketplace",
    "solution.pillar1Desc": "Unified B2B and B2C marketplace connecting all stakeholders with transparent bidding and direct trade",
    "solution.pillar2": "Quality + Traceability",
    "solution.pillar2Desc": "End-to-end traceability with QR codes, quality verification badges, and blockchain-backed authenticity",
    "solution.pillar3": "Logistics + Awareness + Govt Support",
    "solution.pillar3Desc": "Integrated logistics, nutrition awareness hub, and government scheme navigator for complete ecosystem support",
    
    // What Is Krishi-Netra
    "krishinetra.title": "What Is Krishi-Netra",
    "krishinetra.oneLiner": "A full-stack millet ecosystem that unites farmers, FPOs, SHGs, buyers, processors, and consumers through trade, traceability, quality, logistics, and government support — all in one digital platform.",
    "krishinetra.desc1": "KrishiNetra is a comprehensive digital millet marketplace that revolutionizes the entire millet value chain. We integrate farmers, FPOs, SHGs, processors, buyers, and consumers on a single platform.",
    "krishinetra.desc2": "With features like end-to-end traceability, transparent bidding, quality verification, and awareness programs, we ensure that Shree Anna reaches every household while empowering every stakeholder in the journey.",
    "krishinetra.learnMore": "Learn More About Our Mission",
    
    // Why Millets
    "whyMillets.title": "Why Millets",
    "whyMillets.subtitle": "Discover the incredible benefits and importance of millets in our modern world",
    "whyMillets.article1.title": "Nutritional Powerhouse: The Health Benefits of Millets",
    "whyMillets.article1.excerpt": "Millets are packed with essential nutrients, fiber, and minerals. They are gluten-free, rich in antioxidants, and help in managing diabetes and heart health. Learn how these ancient grains can transform your diet.",
    "whyMillets.article2.title": "Climate Resilience: Millets for a Sustainable Future",
    "whyMillets.article2.excerpt": "Millets are drought-resistant crops that require minimal water and can thrive in harsh conditions. Discover how millets contribute to climate change mitigation and food security in challenging environments.",
    "whyMillets.article3.title": "Economic Impact: Empowering Farmers Through Millets",
    "whyMillets.article3.excerpt": "Millets offer better returns for farmers, require less investment, and provide food security. Explore how the millet revolution is transforming rural economies and creating sustainable livelihoods.",
    "whyMillets.readMore": "Read More",
    
    // Journey Section - Storytelling
    "journey.title": "Farm-to-Fork Journey",
    "journey.subtitle": "Follow your millet's story from seed to plate, with complete transparency at every location",
    "journey.farm": "Farm",
    "journey.farmLocation": "Rural Farmlands, Karnataka",
    "journey.farmStory": "Our journey begins in the fertile fields where farmers cultivate millets using traditional wisdom and modern techniques. Each grain is carefully harvested and prepared for the next step.",
    "journey.fpo": "FPO",
    "journey.fpoLocation": "Farmer Producer Organization",
    "journey.fpoStory": "Farmers come together through FPOs to aggregate their produce, ensuring better bargaining power and quality standards. This collective strength empowers smallholder farmers.",
    "journey.bidding": "Bidding",
    "journey.biddingLocation": "Digital Marketplace",
    "journey.biddingStory": "Transparent online auctions connect farmers directly with buyers. Fair pricing ensures farmers get the best value for their hard work, eliminating middlemen.",
    "journey.processing": "Processing",
    "journey.processingLocation": "Certified Processing Units",
    "journey.processingStory": "Quality millets are processed in government-certified facilities, maintaining nutritional value while ensuring food safety and hygiene standards.",
    "journey.packaging": "Packaging",
    "journey.packagingLocation": "Packaging Facilities",
    "journey.packagingStory": "Millets are carefully packaged with QR codes for traceability. Each package tells the story of its origin, ensuring authenticity and quality.",
    "journey.logistics": "Logistics",
    "journey.logisticsLocation": "Distribution Network",
    "journey.logisticsStory": "Efficient logistics ensure fresh millets reach consumers on time. Real-time tracking keeps you informed about your order's journey.",
    "journey.consumer": "Consumer",
    "journey.consumerLocation": "Your Home",
    "journey.consumerStory": "Finally, nutritious millets reach your plate. Scan the QR code to see the complete journey and know exactly where your food came from.",
    "journey.traceability": "End-to-End Traceability",
    "journey.traceabilityDesc": "Every step is recorded and verified. Scan the QR code on any product to see its complete journey from farm to your home.",
    
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
    
    // Features - Grouped Clusters
    "features.title": "Full Feature List",
    "features.subtitle": "26 features organized into 9 powerful clusters",
    "features.marketplace": "Marketplace",
    "features.marketplaceDesc": "B2B bidding, B2C marketplace, SHG products, packaged goods, and snack categories",
    "features.quality": "Quality & Trust",
    "features.qualityDesc": "Quality verification badges, government-backed certifications, and verified seller network",
    "features.traceability": "Traceability",
    "features.traceabilityDesc": "QR code tracking, blockchain-backed authenticity, and farm-to-fork journey visibility",
    "features.logistics": "Logistics",
    "features.logisticsDesc": "End-to-end delivery solutions, real-time tracking, and integrated shipping partners",
    "features.payments": "Payments",
    "features.paymentsDesc": "Secure payment gateway, multiple payment options, and transparent transaction history",
    "features.awareness": "Awareness Hub",
    "features.awarenessDesc": "Nutrition information, recipe database, health benefits, and cooking guides",
    "features.schemes": "Schemes & Certifications",
    "features.schemesDesc": "Government scheme navigator, subsidy information, and certification assistance",
    "features.rural": "Rural UX",
    "features.ruralDesc": "Offline mode, regional language support, voice navigation, and low-data usage",
    "features.insights": "Insights",
    "features.insightsDesc": "Market analytics, price trends, demand forecasting, and business intelligence",
    
    // Stats
    "stats.title": "Our Growing Impact",
    "stats.farmers": "Farmers Onboarded",
    "stats.shgs": "SHGs Empowered",
    "stats.lots": "Millet Lots Processed",
    "stats.sellers": "Verified Sellers",
    "stats.awareness": "Nutrition Awareness Reach",
    
    // Survey
    "survey.title": "Survey Output",
    "survey.subtitle": "Insights from our community",
    "survey.farmers": "Farmers & SHGs",
    "survey.farmersDesc": "Key insights from farmers and self-help groups about market access, pricing, and platform needs",
    "survey.shgs": "SHGs",
    "survey.shgsDesc": "Women-led groups sharing their experiences with digital marketplaces and product visibility",
    "survey.buyers": "Buyers",
    "survey.buyersDesc": "Buyer perspectives on sourcing quality millet, traceability requirements, and supply chain expectations",
    "survey.consumers": "Consumers",
    "survey.consumersDesc": "Consumer feedback on product authenticity, nutritional awareness, and purchasing preferences",
    "survey.button": "View Full Survey Results",
    
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
    "hero.tagline": "विश्वास बढ़ाना। हर दाने को जोड़ना।",
    "hero.title": "अपनी प्लेट को सशक्त बनाएं।",
    "hero.oneLiner": "एक पूर्ण-स्टैक बाजरा इकोसिस्टम जो व्यापार, ट्रेसबिलिटी, गुणवत्ता, लॉजिस्टिक्स और सरकारी समर्थन के माध्यम से किसानों, एफपीओ, स्वयं सहायता समूहों, खरीदारों, प्रोसेसरों और उपभोक्ताओं को एक डिजिटल प्लेटफॉर्म में एकजुट करता है।",
    "hero.explore": "प्लेटफॉर्म देखें",
    "hero.sell": "मेरी उपज बेचें",
    
    // Problem Section
    "problem.title": "समस्या जिसका हम समाधान कर रहे हैं",
    "problem.subtitle": "भारत के बाजरा वैल्यू चेन में अंतराल को समझना",
    "problem.farmersTitle": "किसान और स्वयं सहायता समूहों की समस्याएं",
    "problem.farmersDesc": "सीमित बाज़ार पहुंच, बिचौलियों द्वारा मूल्य शोषण, प्रत्यक्ष खरीदार कनेक्शन की कमी, और उत्पाद गुणवत्ता प्रदर्शित करने में कठिनाई",
    "problem.buyersTitle": "खरीदारों की समस्याएं",
    "problem.buyersDesc": "बड़े पैमाने पर गुणवत्तापूर्ण बाजरा सोर्स करने में कठिनाई, ट्रेसबिलिटी की कमी, अविश्वसनीय आपूर्ति श्रृंखला, और असंगत गुणवत्ता मानक",
    "problem.consumersTitle": "उपभोक्ताओं की समस्याएं",
    "problem.consumersDesc": "उत्पाद प्रामाणिकता के बारे में अनिश्चितता, पोषण जानकारी की कमी, बाजरा लाभों के बारे में सीमित जागरूकता, और विश्वसनीय स्रोत खोजने में कठिनाई",
    "problem.systemTitle": "सिस्टम-स्तरीय अंतराल",
    "problem.systemDesc": "खंडित वैल्यू चेन, डिजिटल बुनियादी ढांचे की कमी, अपर्याप्त सरकारी योजना जागरूकता, और खराब लॉजिस्टिक्स समन्वय",
    "problem.summary": "बाजरा की मांग है, आपूर्ति है — श्रृंखला टूटी हुई है।",
    "problem.lowMarket": "कम बाज़ार पहुंच",
    "problem.lowMarketDesc": "किसानों को खरीदारों तक पहुंचने और अपनी बाजरा उपज के लिए उचित मूल्य प्राप्त करने में कठिनाई होती है",
    "problem.shgVisibility": "स्वयं सहायता समूहों की दृश्यता की कमी",
    "problem.shgVisibilityDesc": "स्वयं सहायता समूहों को अपने गुणवत्तापूर्ण बाजरा उत्पादों को प्रदर्शित करने के लिए प्लेटफॉर्म की आवश्यकता है",
    "problem.sourcing": "सोर्सिंग चुनौतियां",
    "problem.sourcingDesc": "प्रोसेसरों को गुणवत्तापूर्ण बाजरा के विश्वसनीय स्रोत खोजने में कठिनाई होती है",
    "problem.trust": "विश्वास की कमी",
    "problem.trustDesc": "उपभोक्ताओं को बाजरा उत्पादों की प्रामाणिकता में पारदर्शिता नहीं है",
    
    // Why Problem Matters
    "whyMatters.title": "यह समस्या क्यों मायने रखती है",
    "whyMatters.climate": "जलवायु लचीलापन",
    "whyMatters.climateDesc": "बाजरा सूखा-प्रतिरोधी फसलें हैं जो बदलती जलवायु में खाद्य सुरक्षा के लिए महत्वपूर्ण हैं",
    "whyMatters.nutrition": "पोषण सुरक्षा",
    "whyMatters.nutritionDesc": "बाजरा पोषक तत्वों से भरपूर सुपरफूड हैं जो कुपोषण से लड़ने के लिए आवश्यक हैं",
    "whyMatters.income": "किसान आय",
    "whyMatters.incomeDesc": "उचित मूल्य निर्धारण और प्रत्यक्ष बाज़ार पहुंच किसान आय को 30-40% तक बढ़ा सकती है",
    "whyMatters.mission": "सरकारी मिशन",
    "whyMatters.missionDesc": "भारत के श्री अन्न मिशन का समर्थन करना जो राष्ट्रव्यापी बाजरा खपत को बढ़ावा देता है",
    
    // Solution Pillars
    "solution.title": "हमारा समाधान क्या है",
    "solution.pillar1": "मार्केटप्लेस",
    "solution.pillar1Desc": "एकीकृत B2B और B2C मार्केटप्लेस जो पारदर्शी बोली और प्रत्यक्ष व्यापार के साथ सभी हितधारकों को जोड़ता है",
    "solution.pillar2": "गुणवत्ता + ट्रेसबिलिटी",
    "solution.pillar2Desc": "QR कोड के साथ एंड-टू-एंड ट्रेसबिलिटी, गुणवत्ता सत्यापन बैज, और ब्लॉकचेन-समर्थित प्रामाणिकता",
    "solution.pillar3": "लॉजिस्टिक्स + जागरूकता + सरकारी समर्थन",
    "solution.pillar3Desc": "एकीकृत लॉजिस्टिक्स, पोषण जागरूकता हब, और पूर्ण इकोसिस्टम समर्थन के लिए सरकारी योजना नेविगेटर",
    
    // What Is Krishi-Netra
    "krishinetra.title": "कृषि-नेत्र क्या है",
    "krishinetra.oneLiner": "एक पूर्ण-स्टैक बाजरा इकोसिस्टम जो व्यापार, ट्रेसबिलिटी, गुणवत्ता, लॉजिस्टिक्स और सरकारी समर्थन के माध्यम से किसानों, एफपीओ, स्वयं सहायता समूहों, खरीदारों, प्रोसेसरों और उपभोक्ताओं को एक डिजिटल प्लेटफॉर्म में एकजुट करता है।",
    "krishinetra.desc1": "कृषि नेत्र एक व्यापक डिजिटल बाजरा बाज़ार है जो पूरे बाजरा वैल्यू चेन में क्रांति लाता है। हम किसानों, एफपीओ, स्वयं सहायता समूहों, प्रोसेसरों, खरीदारों और उपभोक्ताओं को एक ही प्लेटफॉर्म पर एकीकृत करते हैं।",
    "krishinetra.desc2": "एंड-टू-एंड ट्रेसबिलिटी, पारदर्शी बोली, गुणवत्ता सत्यापन और जागरूकता कार्यक्रमों जैसी सुविधाओं के साथ, हम यह सुनिश्चित करते हैं कि श्री अन्न हर घर तक पहुंचे जबकि यात्रा में हर हितधारक को सशक्त बनाया जाए।",
    "krishinetra.learnMore": "हमारे मिशन के बारे में अधिक जानें",
    
    // Why Millets
    "whyMillets.title": "बाजरा क्यों",
    "whyMillets.subtitle": "हमारी आधुनिक दुनिया में बाजरा के अविश्वसनीय लाभ और महत्व की खोज करें",
    "whyMillets.article1.title": "पोषण शक्ति: बाजरा के स्वास्थ्य लाभ",
    "whyMillets.article1.excerpt": "बाजरा आवश्यक पोषक तत्वों, फाइबर और खनिजों से भरपूर होते हैं। वे ग्लूटेन-मुक्त हैं, एंटीऑक्सीडेंट से भरपूर हैं, और मधुमेह और हृदय स्वास्थ्य के प्रबंधन में मदद करते हैं। जानें कि ये प्राचीन अनाज आपके आहार को कैसे बदल सकते हैं।",
    "whyMillets.article2.title": "जलवायु लचीलापन: एक स्थायी भविष्य के लिए बाजरा",
    "whyMillets.article2.excerpt": "बाजरा सूखा-प्रतिरोधी फसलें हैं जिन्हें न्यूनतम पानी की आवश्यकता होती है और कठोर परिस्थितियों में पनप सकते हैं। जानें कि बाजरा चुनौतीपूर्ण वातावरण में जलवायु परिवर्तन शमन और खाद्य सुरक्षा में कैसे योगदान देता है।",
    "whyMillets.article3.title": "आर्थिक प्रभाव: बाजरा के माध्यम से किसानों को सशक्त बनाना",
    "whyMillets.article3.excerpt": "बाजरा किसानों को बेहतर रिटर्न प्रदान करता है, कम निवेश की आवश्यकता होती है, और खाद्य सुरक्षा प्रदान करता है। जानें कि बाजरा क्रांति ग्रामीण अर्थव्यवस्थाओं को कैसे बदल रही है और स्थायी आजीविका बना रही है।",
    "whyMillets.readMore": "अधिक पढ़ें",
    
    // Journey Section - Storytelling
    "journey.title": "फार्म-टू-फोर्क यात्रा",
    "journey.subtitle": "बीज से प्लेट तक अपने बाजरा की कहानी का अनुसरण करें, हर स्थान पर पूर्ण पारदर्शिता के साथ",
    "journey.farm": "खेत",
    "journey.farmLocation": "ग्रामीण खेत, कर्नाटक",
    "journey.farmStory": "हमारी यात्रा उपजाऊ खेतों में शुरू होती है जहाँ किसान पारंपरिक ज्ञान और आधुनिक तकनीकों का उपयोग करके बाजरा उगाते हैं। प्रत्येक दाना सावधानी से काटा जाता है और अगले चरण के लिए तैयार किया जाता है।",
    "journey.fpo": "एफपीओ",
    "journey.fpoLocation": "किसान उत्पादक संगठन",
    "journey.fpoStory": "किसान एफपीओ के माध्यम से अपनी उपज को एकत्र करने के लिए एक साथ आते हैं, बेहतर सौदेबाजी शक्ति और गुणवत्ता मानक सुनिश्चित करते हैं। यह सामूहिक शक्ति छोटे किसानों को सशक्त बनाती है।",
    "journey.bidding": "बोली",
    "journey.biddingLocation": "डिजिटल मार्केटप्लेस",
    "journey.biddingStory": "पारदर्शी ऑनलाइन नीलामी किसानों को सीधे खरीदारों से जोड़ती है। उचित मूल्य निर्धारण सुनिश्चित करता है कि किसानों को अपनी मेहनत का सर्वोत्तम मूल्य मिले, बिचौलियों को समाप्त करके।",
    "journey.processing": "प्रसंस्करण",
    "journey.processingLocation": "प्रमाणित प्रसंस्करण इकाइयां",
    "journey.processingStory": "गुणवत्तापूर्ण बाजरा सरकार-प्रमाणित सुविधाओं में प्रसंस्कृत किया जाता है, खाद्य सुरक्षा और स्वच्छता मानकों को सुनिश्चित करते हुए पोषण मूल्य बनाए रखता है।",
    "journey.packaging": "पैकेजिंग",
    "journey.packagingLocation": "पैकेजिंग सुविधाएं",
    "journey.packagingStory": "बाजरा को ट्रेसबिलिटी के लिए QR कोड के साथ सावधानी से पैक किया जाता है। प्रत्येक पैकेज अपनी उत्पत्ति की कहानी बताता है, प्रामाणिकता और गुणवत्ता सुनिश्चित करता है।",
    "journey.logistics": "लॉजिस्टिक्स",
    "journey.logisticsLocation": "वितरण नेटवर्क",
    "journey.logisticsStory": "कुशल लॉजिस्टिक्स सुनिश्चित करते हैं कि ताजा बाजरा समय पर उपभोक्ताओं तक पहुंचे। रियल-टाइम ट्रैकिंग आपको अपने ऑर्डर की यात्रा के बारे में सूचित रखती है।",
    "journey.consumer": "उपभोक्ता",
    "journey.consumerLocation": "आपका घर",
    "journey.consumerStory": "अंत में, पौष्टिक बाजरा आपकी प्लेट तक पहुंचता है। पूरी यात्रा देखने के लिए QR कोड स्कैन करें और जानें कि आपका भोजन वास्तव में कहाँ से आया है।",
    "journey.traceability": "एंड-टू-एंड ट्रेसबिलिटी",
    "journey.traceabilityDesc": "हर कदम दर्ज और सत्यापित किया जाता है। पूरी यात्रा देखने के लिए किसी भी उत्पाद पर QR कोड स्कैन करें, खेत से आपके घर तक।",
    
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
    
    // Features - Grouped Clusters
    "features.title": "पूर्ण सुविधा सूची",
    "features.subtitle": "9 शक्तिशाली क्लस्टर में व्यवस्थित 26 सुविधाएं",
    "features.marketplace": "मार्केटप्लेस",
    "features.marketplaceDesc": "B2B बोली, B2C मार्केटप्लेस, स्वयं सहायता समूह उत्पाद, पैक किए गए सामान, और स्नैक श्रेणियां",
    "features.quality": "गुणवत्ता और विश्वास",
    "features.qualityDesc": "गुणवत्ता सत्यापन बैज, सरकार-समर्थित प्रमाणपत्र, और सत्यापित विक्रेता नेटवर्क",
    "features.traceability": "ट्रेसबिलिटी",
    "features.traceabilityDesc": "QR कोड ट्रैकिंग, ब्लॉकचेन-समर्थित प्रामाणिकता, और खेत-से-प्लेट यात्रा दृश्यता",
    "features.logistics": "लॉजिस्टिक्स",
    "features.logisticsDesc": "एंड-टू-एंड डिलीवरी समाधान, रियल-टाइम ट्रैकिंग, और एकीकृत शिपिंग भागीदार",
    "features.payments": "भुगतान",
    "features.paymentsDesc": "सुरक्षित भुगतान गेटवे, कई भुगतान विकल्प, और पारदर्शी लेनदेन इतिहास",
    "features.awareness": "जागरूकता हब",
    "features.awarenessDesc": "पोषण जानकारी, व्यंजन डेटाबेस, स्वास्थ्य लाभ, और खाना पकाने के गाइड",
    "features.schemes": "योजनाएं और प्रमाणपत्र",
    "features.schemesDesc": "सरकारी योजना नेविगेटर, सब्सिडी जानकारी, और प्रमाणपत्र सहायता",
    "features.rural": "ग्रामीण UX",
    "features.ruralDesc": "ऑफलाइन मोड, क्षेत्रीय भाषा समर्थन, वॉइस नेविगेशन, और कम-डेटा उपयोग",
    "features.insights": "अंतर्दृष्टि",
    "features.insightsDesc": "बाज़ार विश्लेषण, मूल्य रुझान, मांग पूर्वानुमान, और व्यावसायिक बुद्धिमत्ता",
    
    // Stats
    "stats.title": "हमारा बढ़ता प्रभाव",
    "stats.farmers": "किसान ऑनबोर्ड किए गए",
    "stats.shgs": "स्वयं सहायता समूह सशक्त",
    "stats.lots": "बाजरा लॉट प्रसंस्कृत",
    "stats.sellers": "सत्यापित विक्रेता",
    "stats.awareness": "पोषण जागरूकता पहुंच",
    
    // Survey
    "survey.title": "सर्वेक्षण आउटपुट",
    "survey.subtitle": "हमारे समुदाय से अंतर्दृष्टि",
    "survey.farmers": "किसान और स्वयं सहायता समूह",
    "survey.farmersDesc": "बाज़ार पहुंच, मूल्य निर्धारण, और प्लेटफॉर्म जरूरतों के बारे में किसानों और स्वयं सहायता समूहों से मुख्य अंतर्दृष्टि",
    "survey.shgs": "स्वयं सहायता समूह",
    "survey.shgsDesc": "डिजिटल मार्केटप्लेस और उत्पाद दृश्यता के साथ अपने अनुभव साझा करने वाले महिला-नेतृत्व वाले समूह",
    "survey.buyers": "खरीदार",
    "survey.buyersDesc": "गुणवत्तापूर्ण बाजरा सोर्स करने, ट्रेसबिलिटी आवश्यकताओं, और आपूर्ति श्रृंखला अपेक्षाओं पर खरीदार दृष्टिकोण",
    "survey.consumers": "उपभोक्ता",
    "survey.consumersDesc": "उत्पाद प्रामाणिकता, पोषण जागरूकता, और खरीदारी प्राथमिकताओं पर उपभोक्ता प्रतिक्रिया",
    "survey.button": "पूर्ण सर्वेक्षण परिणाम देखें",
    
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

