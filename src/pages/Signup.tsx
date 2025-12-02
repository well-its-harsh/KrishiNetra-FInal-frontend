import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import SignUpForm from "@/components/auth/NewSignUpForm";
import signupImage from "@/assets/signup.jpg";
import { Eye } from "lucide-react";
import StepIndicator from "@/components/auth/StepIndicator";

const Signup = () => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(3);

  const handleStepChange = (step: number, total: number) => {
    setCurrentStep(step);
    setTotalSteps(total);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6f521f] to-[#734e04] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Section - Form */}
            <div className="bg-white p-6 md:p-8 flex flex-col">
              <div className="flex-1 flex items-center">
                <div className="w-full">
                  <SignUpForm onStepChange={handleStepChange} />
                </div>
              </div>
            </div>

            {/* Right Section - Image & Info */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-between p-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/40 flex items-center justify-center backdrop-blur-sm">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                      <span className={`text-2xl font-bold text-white ${language === "HI" ? "hindi" : ""}`}>
                        KrishiNetra
                      </span>
                    </div>

                    <h1 className={`text-3xl font-bold text-white mb-2 ${language === "HI" ? "hindi" : ""}`}>
                      {language === "HI" ? "मिलेट आंदोलन में शामिल हों" : "Join the Millet Movement"}
                    </h1>
                    <p className={`text-white/80 text-sm mb-6 max-w-md ${language === "HI" ? "hindi" : ""}`}>
                      {language === "HI" 
                        ? "अपनी यात्रा शुरू करने के लिए तैयार हो जाएं" 
                        : "Let's get started on your journey"}
                    </p>

                    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 max-w-md">
                      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

                      <div className="mt-4 text-white/90 text-sm">
                        {currentStep === 1 && (
                          <>
                            <p className={`font-semibold ${language === "HI" ? "hindi" : ""}`}>
                              {language === "HI" ? "चरण 1: आपकी खाता जानकारी" : "Step 1: Your Account Details"}
                            </p>
                            <p className={`text-white/80 mt-1 ${language === "HI" ? "hindi" : ""}`}>
                              {language === "HI"
                                ? "KrishiNetra के साथ अपनी यात्रा शुरू करें"
                                : "Getting started with your KrishiNetra account"}
                            </p>
                            <p className={`mt-2 text-xs text-white/70 ${language === "HI" ? "hindi" : ""}`}>
                              {language === "HI" ? "पहले से खाता है?" : "Already have an account?"}{" "}
                              <span className="underline font-semibold">
                                {language === "HI" ? "साइन इन करें" : "Sign in"}
                              </span>
                            </p>
                          </>
                        )}
                        {currentStep === 2 && (
                          <>
                            <p className={`font-semibold ${language === "HI" ? "hindi" : ""}`}>
                              {language === "HI" ? "चरण 2: सत्यापन" : "Step 2: Verification"}
                            </p>
                            <p className={`text-white/80 mt-1 ${language === "HI" ? "hindi" : ""}`}>
                              {language === "HI" ? "अपनी पहचान सत्यापित करें" : "Verify your identity"}
                            </p>
                          </>
                        )}
                        {currentStep === 3 && (
                          <>
                            <p className={`font-semibold ${language === "HI" ? "hindi" : ""}`}>
                              {language === "HI" ? "चरण 3: पूरा" : "Step 3: Complete"}
                            </p>
                            <p className={`text-white/80 mt-1 ${language === "HI" ? "hindi" : ""}`}>
                              {language === "HI" 
                                ? "आपका खाता तैयार है। अब आप अपने डैशबोर्ड तक पहुंच सकते हैं।" 
                                : "Your account is ready. You can now access your dashboard."}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

