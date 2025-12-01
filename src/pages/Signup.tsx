import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import SignUpForm from "@/components/auth/NewSignUpForm";
import signupImage from "@/assets/signup.png";
import { Eye } from "lucide-react";

const Signup = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6f521f] to-[#734e04] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh] overflow-y-auto">
            {/* Left Section - Form */}
            <div className="bg-white p-6 md:p-8 flex flex-col">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#3F5E46] flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <span className={`text-xl font-bold text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
                  KrishiNetra
                </span>
              </div>

              {/* Title */}
              <h1 className={`text-2xl font-bold text-gray-800 mb-2 ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI" ? "मिलेट आंदोलन में शामिल हों" : "Join the Millet Movement"}
              </h1>
              
              {/* Subtitle */}
              <p className={`text-gray-600 mb-6 text-sm ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI" 
                  ? "अपनी यात्रा शुरू करने के लिए तैयार हो जाएं" 
                  : "Let's get started on your journey"}
              </p>

              {/* Signup Form */}
              <div className="flex-1">
                <SignUpForm />
              </div>
            </div>

            {/* Right Section - Image */}
            <div className="hidden lg:block relative bg-white">
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="h-full w-full"
              >
                <img
                  src={signupImage}
                  alt="Millet farming"
                  className="w-full h-full object-cover my-2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

