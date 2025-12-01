import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Check, Camera, Upload, Loader2 } from "lucide-react";
import type { SignUpData } from "./NewSignUpForm";

interface SignUpStep3NewProps {
  formData: SignUpData;
  updateFormData: (data: Partial<SignUpData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SignUpStep3New = ({
  formData,
  updateFormData,
  onNext,
  onPrev
}: SignUpStep3NewProps) => {
  const { language } = useLanguage();
  const [aadhaarStep, setAadhaarStep] = useState<
    "upload" | "scanning" | "verified"
  >("upload");
  const [emailOtp, setEmailOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const needsAadhaar =
    formData.role === "FPO" || formData.role === "BUSINESS";

  // Aadhaar mock
  const handleAadhaarUpload = async () => {
    setAadhaarStep("scanning");
    setTimeout(() => {
      setAadhaarStep("verified");
      updateFormData({ aadhaar_verified: true });
    }, 2000);
  };

  // FIXED: Send OTP (requires formData.email)
  const handleSendOtp = async () => {
    if (!formData.email) {
      setErrors({
        otp:
          language === "HI"
            ? "ईमेल उपलब्ध नहीं है"
            : "Email missing – cannot send OTP"
      });
      return;
    }

    setOtpLoading(true);
    setErrors({});

    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpSent(true);
    } catch {
      setErrors({
        otp:
          language === "HI"
            ? "OTP भेजने में त्रुटि"
            : "Error sending OTP"
      });
    } finally {
      setOtpLoading(false);
    }
  };

  // FIXED: OTP Verification (kept original logic)
  const handleVerifyOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setErrors({
        otp:
          language === "HI"
            ? "कृपया 6 अंकों का OTP दर्ज करें"
            : "Please enter 6-digit OTP"
      });
      return;
    }

    setVerifyLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateFormData({
        email_otp_verified: true,
        email_otp: emailOtp
      });
      onNext();
    } catch {
      setErrors({
        otp:
          language === "HI" ? "गलत OTP" : "Invalid OTP"
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  // FIXED: Auto-send OTP (single cleaned effect)
  useEffect(() => {
    if (!formData.email) return;
    if (otpSent) return;

    if (!needsAadhaar || formData.aadhaar_verified) {
      handleSendOtp();
    }
  }, [formData.email, formData.aadhaar_verified, needsAadhaar]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.36 }}
      className="space-y-6"
    >
      <div>
        <h3
          className={`text-2xl font-bold mb-2 text-[#3F5E46] ${
            language === "HI" ? "hindi" : ""
          }`}
        >
          {language === "HI"
            ? "चरण 3: सत्यापन"
            : "Step 3: Verification"}
        </h3>
        <p className={`text-[#7C8B56] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI"
            ? "अपनी पहचान सत्यापित करें"
            : "Verify your identity"}
        </p>
      </div>

      {/* Aadhaar (unchanged) */}
      {needsAadhaar && (
        <div className="space-y-4">
          <h4
            className={`text-lg font-semibold text-[#3F5E46] ${
              language === "HI" ? "hindi" : ""
            }`}
          >
            {language === "HI"
              ? "आधार सत्यापन"
              : "Aadhaar Verification"}
          </h4>

          <AnimatePresence mode="wait">
            {aadhaarStep === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-dashed border-[#D1B48C] rounded-xl p-8 text-center bg-white"
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-[#7C8B56]" />
                <p
                  className={`text-[#3F5E46] mb-4 ${
                    language === "HI" ? "hindi" : ""
                  }`}
                >
                  {language === "HI"
                    ? "आधार कार्ड अपलोड करें या स्कैन करें"
                    : "Upload or scan your Aadhaar card"}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    type="button"
                    onClick={handleAadhaarUpload}
                    className="bg-[#BC8F29] hover:bg-[#BC8F29]/90 text-white rounded-xl"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {language === "HI" ? "अपलोड करें" : "Upload"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAadhaarUpload}
                    variant="outline"
                    className="border-[#7C8B56] text-[#7C8B56] hover:bg-[#7C8B56]/10 rounded-xl"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {language === "HI" ? "स्कैन करें" : "Scan"}
                  </Button>
                </div>
              </motion.div>
            )}

            {aadhaarStep === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-[#BC8F29] rounded-xl p-8 text-center bg-[#BC8F29]/5"
              >
                <Loader2 className="h-12 w-12 mx-auto mb-4 text-[#BC8F29] animate-spin" />
                <p
                  className={`text-[#3F5E46] font-medium ${
                    language === "HI" ? "hindi" : ""
                  }`}
                >
                  {language === "HI"
                    ? "आधार सफलतापूर्वक स्कैन किया गया"
                    : "Aadhaar successfully scanned"}
                </p>
              </motion.div>
            )}

            {aadhaarStep === "verified" && (
              <motion.div
                key="verified"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-[#7C8B56] rounded-xl p-8 text-center bg-[#7C8B56]/10"
              >
                <Check className="h-12 w-12 mx-auto mb-4 text-[#7C8B56]" />
                <p
                  className={`text-[#3F5E46] font-semibold ${
                    language === "HI" ? "hindi" : ""
                  }`}
                >
                  {language === "HI"
                    ? "आधार सत्यापित ✔️"
                    : "Aadhaar verified ✔️"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Email OTP (kept but fixed) */}
      <div className="space-y-4">
        <h4
          className={`text-lg font-semibold text-[#3F5E46] ${
            language === "HI" ? "hindi" : ""
          }`}
        >
          {language === "HI"
            ? "ईमेल OTP सत्यापन"
            : "Email OTP Verification"}
        </h4>

        {!otpSent ? (
          <div className="border-2 border-[#D1B48C] rounded-xl p-6 bg-white">
            <p
              className={`text-[#3F5E46] mb-4 ${
                language === "HI" ? "hindi" : ""
              }`}
            >
              {language === "HI"
                ? `OTP ${formData.email} पर भेजा जाएगा`
                : `OTP will be sent to ${formData.email}`}
            </p>

            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={otpLoading}
              className="w-full bg-[#BC8F29] hover:bg-[#BC8F29]/90 text-white rounded-xl h-[48px]"
            >
              {otpLoading
                ? language === "HI"
                  ? "भेज रहा है..."
                  : "Sending..."
                : language === "HI"
                ? "OTP भेजें"
                : "Send OTP"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="otp"
                className={`mb-2 block text-[#3F5E46] ${
                  language === "HI" ? "hindi" : ""
                }`}
              >
                {language === "HI"
                  ? "OTP दर्ज करें"
                  : "Enter OTP"}
              </Label>

              <Input
                id="otp"
                type="text"
                maxLength={6}
                value={emailOtp}
                onChange={(e) =>
                  setEmailOtp(e.target.value.replace(/\D/g, ""))
                }
                className="h-[48px] rounded-xl border-[#D1B48C] focus:border-[#7C8B56] focus:ring-2 focus:ring-[#7C8B56]/20 bg-white text-center text-2xl tracking-widest"
                placeholder="000000"
              />

              {errors.otp && (
                <p className="mt-1 text-sm text-[#8C483F]">
                  {errors.otp}
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verifyLoading || emailOtp.length !== 6}
              className="w-full bg-[#BC8F29] hover:bg-[#BC8F29]/90 text-white rounded-xl h-[48px]"
            >
              {verifyLoading
                ? language === "HI"
                  ? "सत्यापित कर रहा है..."
                  : "Verifying..."
                : language === "HI"
                ? "सत्यापित करें"
                : "Verify OTP"}
            </Button>

            <button
              type="button"
              onClick={handleSendOtp}
              className="text-sm text-[#7C8B56] hover:text-[#3F5E46] underline"
            >
              {language === "HI"
                ? "OTP पुनः भेजें"
                : "Resend OTP"}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex-1 h-[52px] rounded-xl border-[#7C8B56] text-[#7C8B56] hover:bg-[#7C8B56]/10"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {language === "HI" ? "पिछला" : "Previous"}
        </Button>
      </div>
    </motion.div>
  );
};

export default SignUpStep3New;
