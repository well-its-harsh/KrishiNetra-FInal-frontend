import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import SignUpStep1 from "./SignUpStep1";
import SignUpStep2 from "./SignUpStep2";
import SignUpStep3 from "./SignUpStep3";
import SignUpStep4 from "./SignUpStep4";
import SignUpStep5 from "./SignUpStep5";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

export interface SignUpData {
  // Step 1
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  terms_accepted: boolean;
  
  // Step 2
  role: 'admin' | 'consumer' | 'seller' | 'fpo' | null;
  seller_type: 'farmer' | 'shg' | 'processor' | 'startup' | 'retailer' | null;
  
  // Step 3
  aadhaar_verified: boolean;
  aadhaar_data: any;
  phone_otp_verified: boolean;
  email_otp_verified: boolean;
  
  // Step 4
  documents: {
    shg_registration_id?: string;
    fpo_registration_number?: string;
    gst_number?: string;
    fssai_number?: string;
    upload_ids: string[];
  };
  
  // Internal
  user_id?: string;
  current_step: number;
}

const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<SignUpData>({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    terms_accepted: false,
    role: null,
    seller_type: null,
    aadhaar_verified: false,
    aadhaar_data: null,
    phone_otp_verified: false,
    email_otp_verified: false,
    documents: {
      upload_ids: []
    },
    current_step: 1
  });

  const updateFormData = (updates: Partial<SignUpData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (formData.current_step < 5) {
      setFormData(prev => ({ ...prev, current_step: prev.current_step + 1 }));
    }
  };

  const prevStep = () => {
    if (formData.current_step > 1) {
      setFormData(prev => ({ ...prev, current_step: prev.current_step - 1 }));
    }
  };

  const steps = [
    { number: 1, title: language === "HI" ? "मूल जानकारी" : "Basic Info" },
    { number: 2, title: language === "HI" ? "भूमिका चुनें" : "Select Role" },
    { number: 3, title: language === "HI" ? "सत्यापन" : "Verification" },
    { number: 4, title: language === "HI" ? "दस्तावेज़" : "Documents" },
    { number: 5, title: language === "HI" ? "समाप्त करें" : "Finish" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
      className="sign-up-form h-full"
    >
      <div className="h-full overflow-y-auto bg-white px-6 py-8 rounded-xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-180 ${
                    formData.current_step >= step.number
                      ? 'bg-[#4C763B] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {formData.current_step > step.number ? '✓' : step.number}
                </div>
                <span className={`mt-2 text-xs text-center ${language === "HI" ? "hindi" : ""} ${
                  formData.current_step >= step.number ? 'text-[#4C763B] font-semibold' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-all duration-180 ${
                    formData.current_step > step.number ? 'bg-[#4C763B]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            ))}
          </div>
          <p className={`text-sm text-gray-600 text-center ${language === "HI" ? "hindi" : ""}`}>
            {language === "HI" 
              ? `चरण ${formData.current_step} / ${steps.length}`
              : `Step ${formData.current_step} of ${steps.length}`}
          </p>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {formData.current_step === 1 && (
            <SignUpStep1
              key="step1"
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
            />
          )}
          {formData.current_step === 2 && (
            <SignUpStep2
              key="step2"
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {formData.current_step === 3 && (
            <SignUpStep3
              key="step3"
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {formData.current_step === 4 && (
            <SignUpStep4
              key="step4"
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {formData.current_step === 5 && (
            <SignUpStep5
              key="step5"
              formData={formData}
              onSwitchToSignIn={onSwitchToSignIn}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default SignUpForm;

