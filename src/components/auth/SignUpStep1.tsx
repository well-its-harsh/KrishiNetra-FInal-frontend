import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { registerUser } from "@/lib/api";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import type { SignUpData } from "./SignUpForm";

interface SignUpStep1Props {
  formData: SignUpData;
  updateFormData: (updates: Partial<SignUpData>) => void;
  onNext: () => void;
}

const SignUpStep1 = ({ formData, updateFormData, onNext }: SignUpStep1Props) => {
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

    if (!formData.phone_number) {
      newErrors.phone_number = language === "HI" ? "फोन नंबर आवश्यक है" : "Phone number is required";
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone_number) || formData.phone_number.replace(/\D/g, '').length < 10) {
      newErrors.phone_number = language === "HI" ? "वैध फोन नंबर दर्ज करें" : "Please enter a valid phone number";
    }

    const passwordCheck = validatePassword(formData.password);
    if (!passwordCheck.valid) {
      newErrors.password = passwordCheck.message;
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = language === "HI" ? "पासवर्ड मेल नहीं खाते" : "Passwords do not match";
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
      const response = await registerUser({
        name: formData.full_name,
        email: formData.email,
        phone: formData.phone_number,
        password: formData.password,
      });
      
      updateFormData({ user_id: response.user_id });
      onNext();
    } catch (error) {
      setErrors({ 
        submit: language === "HI" 
          ? "रजिस्ट्रेशन असफल। कृपया पुनः प्रयास करें।" 
          : "Registration failed. Please try again." 
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
        <h3 className={`text-2xl font-bold mb-2 text-[#043915] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "मूल जानकारी" : "Basic Information"}
        </h3>
        <p className={`text-[#4C763B] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" 
            ? "अपनी बुनियादी जानकारी दर्ज करें"
            : "Enter your basic information to get started"}
        </p>
      </div>

      <div>
        <Label htmlFor="full_name" className={`mb-2 block ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "पूरा नाम" : "Full Name"} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4C763B]" />
          <Input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => updateFormData({ full_name: e.target.value })}
            className={`pl-10 h-[44px] rounded-[12px] border-[#B0CE88] focus:border-[#4C763B] focus:ring-[#4C763B] ${errors.full_name ? "border-red-500" : ""}`}
            placeholder={language === "HI" ? "आपका पूरा नाम" : "Enter your full name"}
          />
        </div>
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className={`mb-2 block ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "ईमेल" : "Email"} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4C763B]" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`pl-10 h-[44px] rounded-[12px] border-[#B0CE88] focus:border-[#4C763B] focus:ring-[#4C763B] ${errors.email ? "border-red-500" : ""}`}
            placeholder={language === "HI" ? "आपका ईमेल" : "your.email@example.com"}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone_number" className={`mb-2 block ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "फोन नंबर" : "Phone Number"} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4C763B]" />
          <Input
            id="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={(e) => updateFormData({ phone_number: e.target.value })}
            className={`pl-10 h-[44px] rounded-[12px] border-[#B0CE88] focus:border-[#4C763B] focus:ring-[#4C763B] ${errors.phone_number ? "border-red-500" : ""}`}
            placeholder={language === "HI" ? "+91 9876543210" : "+91 9876543210"}
          />
        </div>
        {errors.phone_number && (
          <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className={`mb-2 block ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "पासवर्ड" : "Password"} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4C763B]" />
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
            className={`pl-10 h-[44px] rounded-[12px] border-[#B0CE88] focus:border-[#4C763B] focus:ring-[#4C763B] ${errors.password ? "border-red-500" : ""}`}
            placeholder={language === "HI" ? "मजबूत पासवर्ड बनाएं" : "Create a strong password"}
          />
        </div>
        {formData.password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded ${
                    level <= passwordStrength.strength
                      ? level <= 2
                        ? 'bg-red-500'
                        : level <= 3
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs ${passwordStrength.strength <= 2 ? 'text-red-600' : passwordStrength.strength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
              {passwordStrength.message}
            </p>
          </div>
        )}
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirm_password" className={`mb-2 block ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "पासवर्ड की पुष्टि करें" : "Confirm Password"} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4C763B]" />
          <Input
            id="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={(e) => updateFormData({ confirm_password: e.target.value })}
            className={`pl-10 h-[44px] rounded-[12px] border-[#B0CE88] focus:border-[#4C763B] focus:ring-[#4C763B] ${errors.confirm_password ? "border-red-500" : ""}`}
            placeholder={language === "HI" ? "पासवर्ड दोबारा दर्ज करें" : "Re-enter your password"}
          />
        </div>
        {errors.confirm_password && (
          <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={formData.terms_accepted}
          onCheckedChange={(checked) => updateFormData({ terms_accepted: checked === true })}
          className="mt-1"
        />
        <Label
          htmlFor="terms"
          className={`text-sm cursor-pointer ${language === "HI" ? "hindi" : ""} ${errors.terms ? "text-red-600" : ""}`}
        >
          {language === "HI" 
            ? "मैं नियम और शर्तें तथा गोपनीयता नीति से सहमत हूं"
            : "I agree to the Terms and Conditions and Privacy Policy"}
        </Label>
      </div>
      {errors.terms && (
        <p className="text-sm text-red-600">{errors.terms}</p>
      )}

      {errors.submit && (
        <p className="text-sm text-red-600">{errors.submit}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px] transition-all duration-180 hover:scale-[1.03] hover:shadow-lg"
      >
        {loading
          ? (language === "HI" ? "रजिस्टर हो रहा है..." : "Registering...")
          : (language === "HI" ? "अगला कदम" : "Next Step")
        }
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.form>
  );
};

export default SignUpStep1;

