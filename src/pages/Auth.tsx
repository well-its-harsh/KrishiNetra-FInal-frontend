import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { Sprout, Shield, TrendingUp, Users } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="relative bg-white rounded-[12px] shadow-[0_6px_18px_rgba(4,57,21,0.08)] overflow-hidden">
          <div className={`container-auth ${isSignUp ? 'right-panel-active' : ''}`}>
            {/* Sign In Container */}
            <div className="sign-in-container">
              <SignInForm onSwitchToSignUp={() => setIsSignUp(true)} />
            </div>

            {/* Sign Up Container */}
            <div className="sign-up-container">
              <SignUpForm onSwitchToSignIn={() => setIsSignUp(false)} />
            </div>

            {/* Overlay Container */}
            <div className="overlay-container">
              <div className="overlay">
                <div className={`overlay-panel overlay-left ${isSignUp ? '' : 'active'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center"
                  >
                    <div className="mb-6">
                      <Sprout className="h-16 w-16 mx-auto text-[#4C763B]" />
                    </div>
                    <h2 className={`text-3xl font-bold mb-4 text-[#043915] ${language === "HI" ? "hindi" : ""}`}>
                      {language === "HI" ? "वापसी करें!" : "Welcome Back!"}
                    </h2>
                    <p className={`text-[#4C763B] mb-8 ${language === "HI" ? "hindi" : ""}`}>
                      {language === "HI" 
                        ? "अपने खाते में लॉग इन करके अपनी मिलेट यात्रा जारी रखें"
                        : "Continue your millet journey by signing in to your account"}
                    </p>
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="ghost-button"
                      aria-label={language === "HI" ? "साइन इन करें" : "Sign In"}
                    >
                      {language === "HI" ? "साइन इन करें" : "Sign In"}
                    </button>
                  </motion.div>
                </div>

                <div className={`overlay-panel overlay-right ${isSignUp ? 'active' : ''}`}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center"
                  >
                    <div className="mb-6 flex justify-center gap-4">
                      <Users className="h-12 w-12 text-[#FFFD8F]" />
                      <Shield className="h-12 w-12 text-[#B0CE88]" />
                      <TrendingUp className="h-12 w-12 text-[#4C763B]" />
                    </div>
                    <h2 className={`text-3xl font-bold mb-4 text-white ${language === "HI" ? "hindi" : ""}`}>
                      {language === "HI" ? "शुरू करें!" : "Get Started!"}
                    </h2>
                    <p className="text-white/90 mb-8 text-lg">
                      {language === "HI"
                        ? "भारत के श्री अन्न वैल्यू चेन का हिस्सा बनें"
                        : "Join India's Shree Anna value chain"}
                    </p>
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="ghost-button"
                      aria-label={language === "HI" ? "साइन अप करें" : "Sign Up"}
                    >
                      {language === "HI" ? "साइन अप करें" : "Sign Up"}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

