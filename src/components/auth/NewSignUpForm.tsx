import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import StepIndicator from "./StepIndicator";
import SignUpStep1New from "./SignUpStep1New";
import SignUpStep2New from "./SignUpStep2New";
import SignUpStep3New from "./SignUpStep3New";
import SignUpStep4New from "./SignUpStep4New";
import SignUpStep5New from "./SignUpStep5New";

export interface SignUpData {
  // Step 1
  full_name: string;
  email: string;
  password: string;
  terms_accepted: boolean;
  
  // Step 2
  role: 'CONSUMER' | 'FPO' | 'BUSINESS' | null;
  
  // Step 3
  aadhaar_verified: boolean;
  aadhaar_data: any;
  email_otp_verified: boolean;
  email_otp: string;
  
  // Step 4
  documents: {
    upload_ids: string[];
  };
  
  // Internal
  user_id?: number;
  current_step: number;
}

const SignUpForm = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<SignUpData>({
    full_name: '',
    email: '',
    password: '',
    terms_accepted: false,
    role: null,
    aadhaar_verified: false,
    aadhaar_data: null,
    email_otp_verified: false,
    email_otp: '',
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

  const totalSteps = 5;

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <StepIndicator 
        currentStep={formData.current_step} 
        totalSteps={totalSteps}
      />

      {/* Step Content */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {formData.current_step === 1 && (
            <SignUpStep1New
              key="step1"
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
            />
          )}
          {formData.current_step === 2 && (
            <SignUpStep2New
              key="step2"
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {formData.current_step === 3 && (
            <SignUpStep3New
              key="step3"
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {formData.current_step === 4 && (
            <SignUpStep4New
              key="step4"
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {formData.current_step === 5 && (
            <SignUpStep5New
              key="step5"
              formData={formData}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignUpForm;



