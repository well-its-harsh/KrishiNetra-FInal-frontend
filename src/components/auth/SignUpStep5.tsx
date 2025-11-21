import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Clock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SignUpStep5Props {
  formData: any;
  onSwitchToSignIn: () => void;
}

const SignUpStep5 = ({ formData, onSwitchToSignIn }: SignUpStep5Props) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const requiresVerification = formData.role === 'fpo' || formData.role === 'seller';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="text-center space-y-6"
    >
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>
        <h3 className={`text-3xl font-bold mb-4 text-[#043915] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "सफलतापूर्वक पंजीकृत!" : "Successfully Registered!"}
        </h3>
        <p className={`text-[#4C763B] text-lg ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI"
            ? "आपका खाता बनाया गया है"
            : "Your account has been created"}
        </p>
      </div>

      {requiresVerification ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 bg-[#FAF7F0] rounded-[12px] border-2 border-[#B0CE88] space-y-6"
        >
          <div className="flex items-center justify-center gap-3">
            <Clock className="h-8 w-8 text-[#4C763B]" />
            <h4 className={`text-xl font-semibold ${language === "HI" ? "hindi" : ""}`}>
              {language === "HI" ? "सत्यापन लंबित" : "Verification Pending"}
            </h4>
          </div>

          <div className="space-y-4 text-left">
            <p className={`text-gray-700 ${language === "HI" ? "hindi" : ""}`}>
              {language === "HI"
                ? "आपके दस्तावेज़ समीक्षा के लिए जमा किए गए हैं। सत्यापन में 2-3 कार्य दिवस लग सकते हैं।"
                : "Your documents have been submitted for review. Verification may take 2-3 business days."}
            </p>

            <div className="p-4 bg-white rounded-[12px] space-y-2">
              <p className={`font-semibold ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI" ? "अगले कदम:" : "Next Steps:"}
              </p>
              <ul className={`list-disc list-inside space-y-1 text-sm text-gray-600 ${language === "HI" ? "hindi" : ""}`}>
                <li>
                  {language === "HI"
                    ? "आपको ईमेल पर अपडेट प्राप्त होंगे"
                    : "You will receive updates via email"}
                </li>
                <li>
                  {language === "HI"
                    ? "सत्यापन पूरा होने पर आपको सूचित किया जाएगा"
                    : "You will be notified once verification is complete"}
                </li>
                <li>
                  {language === "HI"
                    ? "किसी भी प्रश्न के लिए सहायता से संपर्क करें"
                    : "Contact support for any questions"}
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#4C763B]">
              <Mail className="h-4 w-4" />
              <a href="mailto:harshagnani7@gmail.com" className="hover:underline">
                harshagnani7@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 bg-green-50 rounded-[12px] border border-green-200"
        >
          <p className={`text-green-800 ${language === "HI" ? "hindi" : ""}`}>
            {language === "HI"
              ? "आपका खाता तैयार है! आप अभी डैशबोर्ड का उपयोग शुरू कर सकते हैं।"
              : "Your account is ready! You can start using the dashboard now."}
          </p>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => navigate('/dashboard')}
          className="h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px] px-8 transition-all duration-180 hover:scale-[1.03]"
        >
          {language === "HI" ? "डैशबोर्ड पर जाएं" : "Go to Dashboard"}
        </Button>
        <Button
          onClick={onSwitchToSignIn}
          variant="outline"
          className="h-[44px] rounded-[12px] border-[#4C763B] text-[#4C763B] hover:bg-[#4C763B]/10"
        >
          {language === "HI" ? "साइन इन करें" : "Sign In"}
        </Button>
      </div>
    </motion.div>
  );
};

export default SignUpStep5;

