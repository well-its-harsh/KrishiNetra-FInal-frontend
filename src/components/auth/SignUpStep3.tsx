import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { verifyEmail } from "@/lib/api";
import { ArrowRight, ArrowLeft, Shield, Mail, Phone } from "lucide-react";
import AadhaarModal from "./AadhaarModal";
import type { SignUpData } from "./SignUpForm";

interface SignUpStep3Props {
  formData: SignUpData;
  updateFormData: (updates: Partial<SignUpData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SignUpStep3 = ({ formData, updateFormData, onNext, onPrev }: SignUpStep3Props) => {
  const { language } = useLanguage();
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requiresAadhaar = formData.role === 'seller' || formData.role === 'fpo';
  const requiresEmailOTP = formData.role === 'consumer' || formData.role === 'seller' || formData.role === 'fpo';
  const requiresPhoneOTP = formData.role === 'seller' || formData.role === 'fpo';

  const handleVerifyEmail = async () => {
    if (!emailOTP || emailOTP.length !== 6) {
      setError(language === "HI" ? "कृपया 6 अंकों का OTP दर्ज करें" : "Please enter 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (formData.user_id) {
        await verifyEmail({
          user_id: formData.user_id,
          otp: emailOTP,
        });
        updateFormData({ email_otp_verified: true });
      }
    } catch (err) {
      setError(language === "HI" ? "OTP सत्यापन असफल" : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarSuccess = (data: any) => {
    updateFormData({
      aadhaar_verified: true,
      aadhaar_data: data,
    });
  };

  const canProceed = () => {
    if (requiresAadhaar && !formData.aadhaar_verified) return false;
    if (requiresEmailOTP && !formData.email_otp_verified) return false;
    if (requiresPhoneOTP && !formData.phone_otp_verified) return false;
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-6"
    >
      <div>
        <h3 className={`text-2xl font-bold mb-2 text-[#043915] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "पहचान सत्यापन" : "Identity Verification"}
        </h3>
        <p className={`text-[#4C763B] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI"
            ? "अपनी पहचान सत्यापित करें"
            : "Verify your identity to continue"}
        </p>
      </div>

      {/* Aadhaar Verification */}
      {requiresAadhaar && (
        <div className="p-6 border-2 border-[#B0CE88] rounded-[12px] space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-[#4C763B]" />
            <div>
              <h4 className={`font-semibold ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI" ? "आधार सत्यापन" : "Aadhaar Verification"}
                {formData.role === 'fpo' && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h4>
              <p className={`text-sm text-gray-600 ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI"
                  ? formData.role === 'fpo'
                    ? "FPO के लिए आवश्यक"
                    : "अनुशंसित (बाद में छोड़ा जा सकता है)"
                  : formData.role === 'fpo'
                  ? "Required for FPO"
                  : "Recommended (can be skipped for now)"}
              </p>
            </div>
          </div>

          {formData.aadhaar_verified ? (
            <div className="p-4 bg-green-50 rounded-[12px] border border-green-200">
              <p className={`text-sm text-green-800 ${language === "HI" ? "hindi" : ""}`}>
                ✓ {language === "HI" ? "आधार सत्यापित" : "Aadhaar verified"}
              </p>
            </div>
          ) : (
            <Button
              onClick={() => setShowAadhaarModal(true)}
              className="w-full h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px]"
            >
              {language === "HI" ? "आधार स्कैन/अपलोड करें" : "Scan/Upload Aadhaar"}
            </Button>
          )}
        </div>
      )}

      {/* Email OTP */}
      {requiresEmailOTP && (
        <div className="p-6 border-2 border-[#B0CE88] rounded-[12px] space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-[#4C763B]" />
            <div>
              <h4 className={`font-semibold ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI" ? "ईमेल सत्यापन" : "Email Verification"}
              </h4>
              <p className={`text-sm text-gray-600 ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI"
                  ? "आपके ईमेल पर OTP भेजा गया है"
                  : "OTP has been sent to your email"}
              </p>
            </div>
          </div>

          {formData.email_otp_verified ? (
            <div className="p-4 bg-green-50 rounded-[12px] border border-green-200">
              <p className={`text-sm text-green-800 ${language === "HI" ? "hindi" : ""}`}>
                ✓ {language === "HI" ? "ईमेल सत्यापित" : "Email verified"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className={language === "HI" ? "hindi" : ""}>
                  {language === "HI" ? "OTP दर्ज करें" : "Enter OTP"}
                </Label>
                <Input
                  type="text"
                  value={emailOTP}
                  onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-[44px] rounded-[12px] mt-2"
                  placeholder={language === "HI" ? "6 अंकों का OTP" : "6-digit OTP"}
                  maxLength={6}
                />
              </div>
              <Button
                onClick={handleVerifyEmail}
                disabled={loading || emailOTP.length !== 6}
                className="w-full h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px]"
              >
                {loading
                  ? (language === "HI" ? "सत्यापित हो रहा है..." : "Verifying...")
                  : (language === "HI" ? "सत्यापित करें" : "Verify")
                }
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Phone OTP */}
      {requiresPhoneOTP && (
        <div className="p-6 border-2 border-[#B0CE88] rounded-[12px] space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6 text-[#4C763B]" />
            <div>
              <h4 className={`font-semibold ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI" ? "फोन सत्यापन" : "Phone Verification"}
              </h4>
              <p className={`text-sm text-gray-600 ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI"
                  ? "आपके फोन पर OTP भेजा गया है"
                  : "OTP has been sent to your phone"}
              </p>
            </div>
          </div>

          {formData.phone_otp_verified ? (
            <div className="p-4 bg-green-50 rounded-[12px] border border-green-200">
              <p className={`text-sm text-green-800 ${language === "HI" ? "hindi" : ""}`}>
                ✓ {language === "HI" ? "फोन सत्यापित" : "Phone verified"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className={language === "HI" ? "hindi" : ""}>
                  {language === "HI" ? "OTP दर्ज करें" : "Enter OTP"}
                </Label>
                <Input
                  type="text"
                  value={phoneOTP}
                  onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-[44px] rounded-[12px] mt-2"
                  placeholder={language === "HI" ? "6 अंकों का OTP" : "6-digit OTP"}
                  maxLength={6}
                />
              </div>
              <Button
                onClick={() => updateFormData({ phone_otp_verified: true })}
                disabled={phoneOTP.length !== 6}
                className="w-full h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px]"
              >
                {language === "HI" ? "सत्यापित करें" : "Verify"}
              </Button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex-1 h-[44px] rounded-[12px] border-[#4C763B] text-[#4C763B] hover:bg-[#4C763B]/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === "HI" ? "पिछला" : "Previous"}
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed()}
          className="flex-1 h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px] transition-all duration-180 hover:scale-[1.03]"
        >
          {language === "HI" ? "अगला कदम" : "Next Step"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <AadhaarModal
        open={showAadhaarModal}
        onClose={() => setShowAadhaarModal(false)}
        onSuccess={handleAadhaarSuccess}
        userId={formData.user_id || ''}
      />
    </motion.div>
  );
};

export default SignUpStep3;

