import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import SignUpStep1New from "./SignUpStep1New";
import SignUpStep3New from "./SignUpStep3New";
import SignUpStep5New from "./SignUpStep5New";

export interface SignUpData {
  // Step 1
  full_name: string;
  email: string;
  password: string;
  terms_accepted: boolean;
  
  // Step 2
  role: 'CONSUMER' | 'FPO' | 'BUSINESS' | 'INSTITUTION' | 'TRANSPORTER' | null;
  
  // Step 2 (continued) / Step 3
  aadhaar_verified: boolean;
  aadhaar_data: any;
  email_otp_verified: boolean;
  email_otp: string;
  
  // Documents
  documents?: {
    upload_ids: string[];
  };

  // Internal
  user_id?: number;
  current_step: number;
}

interface NewSignUpFormProps {
  onStepChange?: (step: number, totalSteps: number) => void;
}

const SignUpForm = ({ onStepChange }: NewSignUpFormProps) => {
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
    current_step: 1
  });

  const updateFormData = (updates: Partial<SignUpData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const totalSteps = 3;

  const nextStep = () => {
    setFormData(prev => {
      const next = Math.min(prev.current_step + 1, totalSteps);
      const updated = { ...prev, current_step: next };
      if (next !== prev.current_step) {
        onStepChange?.(next, totalSteps);
      }
      return updated;
    });
  };

  const prevStep = () => {
    setFormData(prev => {
      const next = Math.max(prev.current_step - 1, 1);
      const updated = { ...prev, current_step: next };
      if (next !== prev.current_step) {
        onStepChange?.(next, totalSteps);
      }
      return updated;
    });
  };

  return (
    <div className="w-full">
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
            <SignUpStep3New
              key="step3"
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {formData.current_step === 3 && (
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



