import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import type { SignUpData } from "./NewSignUpForm";

interface SignUpStep1NewProps {
  formData: SignUpData;
  updateFormData: (updates: Partial<SignUpData>) => void;
  onNext: () => void;
}

const SignUpStep1New = ({ formData, updateFormData, onNext }: SignUpStep1NewProps) => {
  const { language } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): { valid: boolean; strength: number; message: string } => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    strength = Object.values(checks).filter(Boolean).length;
    
    const messages = {
      HI: {
        weak: "कमजोर - कम से कम 8 अक्षर, 1 बड़ा अक्षर, 1 छोटा अक्षर, 1 अंक, 1 विशेष वर्ण",
        medium: "मध्यम - मजबूत पासवर्ड के लिए और सुधार करें",
        strong: "मजबूत पासवर्ड",
      },
      EN: {
        weak: "Weak - At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special",
        medium: "Medium - Improve for stronger password",
        strong: "Strong password",
      },
    };

    let message = messages[language].weak;
    if (strength >= 4) message = messages[language].medium;
    if (strength === 5) message = messages[language].strong;

    return {
      valid: checks.length && checks.uppercase && checks.lowercase && checks.digit && checks.special,
      strength,
      message,
    };
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = language === "HI" ? "नाम आवश्यक है" : "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = language === "HI" ? "ईमेल आवश्यक है" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === "HI" ? "वैध ईमेल दर्ज करें" : "Please enter a valid email";
    }

    const passwordCheck = validatePassword(formData.password);
    if (!passwordCheck.valid) {
      newErrors.password = passwordCheck.message;
    }

    if (!formData.terms_accepted) {
      newErrors.terms = language === "HI" ? "कृपया नियम और शर्तें स्वीकार करें" : "Please accept terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      // Call backend to create user
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: 'CONSUMER', // Default role, will be updated in step 2
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const userData = await response.json();
      updateFormData({ user_id: userData.id,email: formData.email,
  password: formData.password});
      onNext();
    } catch (error: any) {
      setErrors({ 
        submit: language === "HI" 
          ? error.message || "रजिस्ट्रेशन असफल। कृपया पुनः प्रयास करें।" 
          : error.message || "Registration failed. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = validatePassword(formData.password);

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <h3 className={`text-2xl font-bold mb-2 text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "चरण 1: आपकी खाता जानकारी" : "Step 1: Your Account Details"}
        </h3>
      </div>

      <div>
        <Label htmlFor="full_name" className={`mb-2 block text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "पूरा नाम" : "Full Name"} <span className="text-[#8C483F]">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7C8B56]" />
          <Input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => updateFormData({ full_name: e.target.value })}
            className={`pl-10 h-[48px] rounded-xl border-[#D1B48C] focus:border-[#7C8B56] focus:ring-2 focus:ring-[#7C8B56]/20 bg-white ${errors.full_name ? "border-[#8C483F]" : ""}`}
            placeholder={language === "HI" ? "आपका पूरा नाम" : "Enter your full name"}
          />
        </div>
        {errors.full_name && (
          <p className="mt-1 text-sm text-[#8C483F]">{errors.full_name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className={`mb-2 block text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "ईमेल पता" : "Email Address"} <span className="text-[#8C483F]">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7C8B56]" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`pl-10 h-[48px] rounded-xl border-[#D1B48C] focus:border-[#7C8B56] focus:ring-2 focus:ring-[#7C8B56]/20 bg-white ${errors.email ? "border-[#8C483F]" : ""}`}
            placeholder={language === "HI" ? "ईमेल पता" : "Email Address"}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-[#8C483F]">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className={`mb-2 block text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "पासवर्ड" : "Password"} <span className="text-[#8C483F]">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7C8B56]" />
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
            className={`pl-10 h-[48px] rounded-xl border-[#D1B48C] focus:border-[#7C8B56] focus:ring-2 focus:ring-[#7C8B56]/20 bg-white ${errors.password ? "border-[#8C483F]" : ""}`}
            placeholder={language === "HI" ? "पासवर्ड" : "Password"}
          />
        </div>
        {formData.password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1.5 flex-1 rounded ${
                    level <= passwordStrength.strength
                      ? level <= 2
                        ? 'bg-[#8C483F]'
                        : level <= 3
                        ? 'bg-[#BC8F29]'
                        : 'bg-[#7C8B56]'
                      : 'bg-[#D1B48C]'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs ${passwordStrength.strength <= 2 ? 'text-[#8C483F]' : passwordStrength.strength <= 3 ? 'text-[#BC8F29]' : 'text-[#7C8B56]'}`}>
              {passwordStrength.message}
            </p>
          </div>
        )}
        {errors.password && (
          <p className="mt-1 text-sm text-[#8C483F]">{errors.password}</p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={formData.terms_accepted}
          onCheckedChange={(checked) => updateFormData({ terms_accepted: checked === true })}
          className="mt-1 border-[#7C8B56] data-[state=checked]:bg-[#7C8B56] data-[state=checked]:border-[#7C8B56]"
        />
        <Label
          htmlFor="terms"
          className={`text-sm cursor-pointer text-[#3F5E46] ${language === "HI" ? "hindi" : ""} ${errors.terms ? "text-[#8C483F]" : ""}`}
        >
          {language === "HI" 
            ? "मैं नियम और शर्तें तथा गोपनीयता नीति से सहमत हूं"
            : "I agree to Terms & Conditions"}
        </Label>
      </div>
      {errors.terms && (
        <p className="text-sm text-[#8C483F]">{errors.terms}</p>
      )}

      {errors.submit && (
        <p className="text-sm text-[#8C483F]">{errors.submit}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-[52px] bg-[#BC8F29] hover:bg-[#BC8F29]/90 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg font-semibold text-base"
      >
        {loading
          ? (language === "HI" ? "रजिस्टर हो रहा है..." : "Registering...")
          : (language === "HI" ? "अगला कदम" : "NEXT STEP")
        }
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.form>
  );
};

export default SignUpStep1New;

