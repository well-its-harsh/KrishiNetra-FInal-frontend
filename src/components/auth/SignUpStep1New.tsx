import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_BASE } from "@/config/api";
import { User, Mail, Lock, ArrowRight, ShoppingCart, Building, Users } from "lucide-react";
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
      newErrors.email = language === "HI" ? "वैध ईमेल दर्ज करें" : "Enter a valid email";
    }

    const pwd = validatePassword(formData.password);
    if (!pwd.valid) newErrors.password = pwd.message;

    if (!formData.role) {
      newErrors.role = language === "HI" ? "कृपया भूमिका चुनें" : "Please select a role";
    }

    if (!formData.terms_accepted) {
      newErrors.terms = language === "HI" ? "नियमों व शर्तों को स्वीकार करें" : "Please accept terms & conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        is_active: true,
        is_authenticated: true,
      };

      const { data: userData } = await axios.post<{ id: number }>(
        `${API_BASE}/auth/register`,
        payload,
        { withCredentials: true }
      );

      updateFormData({
        user_id: userData.id,
        role: formData.role,
        email: formData.email,
        password: formData.password,
      });

      onNext();
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrors({
          submit: language === "HI"
            ? "यह ईमेल पहले से मौजूद है। लॉगिन करें।"
            : "This email already exists. Please log in.",
        });
      } else {
        setErrors({
          submit: language === "HI"
            ? "रजिस्ट्रेशन असफल। पुनः प्रयास करें।"
            : "Registration failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = validatePassword(formData.password);

  /** ROLE LIST — FIXED ERROR */
  const roles = [
    {
      id: "CONSUMER",
      icon: ShoppingCart,
      title: language === "HI" ? "उपभोक्ता" : "Consumer",
      description: language === "HI"
        ? "उत्पाद खरीदें और जागरूकता बढ़ाएं"
        : "Purchase millet products and spread awareness",
    },
    {
      id: "FPO",
      icon: Users,
      title: language === "HI" ? "एफपीओ" : "FPO",
      description: language === "HI" ? "किसान उत्पादक संगठन" : "Farmer Producer Organization",
    },
    {
      id: "BUSINESS",
      icon: Building,
      title: language === "HI" ? "थोक विक्रेता" : "Wholeseller",
      description: language === "HI" ? "अपने उत्पाद बेचें" : "Sell your millet products",
    },
    {
      id: "INSTITUTION",
      icon: Building,
      title: language === "HI" ? "संस्था" : "Institution",
      description: language === "HI"
        ? "स्कूल, अस्पताल, सरकारी संस्थान"
        : "Institutions purchasing for programs & meals",
    },
    {
      id: "TRANSPORTER",
      icon: Users,
      title: language === "HI" ? "परिवहन" : "Transporter",
      description: language === "HI"
        ? "लॉजिस्टिक्स और ट्रांसपोर्ट"
        : "Logistics / transport partner",
    },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.36 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Full name */}
      <div>
        <Label htmlFor="full_name">{language === "HI" ? "पूरा नाम" : "Full Name"} *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7C8B56]" />
          <Input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => updateFormData({ full_name: e.target.value })}
            className={`pl-10 ${errors.full_name ? "border-[#8C483F]" : ""}`}
          />
        </div>
        {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">{language === "HI" ? "ईमेल पता" : "Email Address"} *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7C8B56]" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`pl-10 ${errors.email ? "border-[#8C483F]" : ""}`}
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password">{language === "HI" ? "पासवर्ड" : "Password"} *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7C8B56]" />
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
            className={`pl-10 ${errors.password ? "border-[#8C483F]" : ""}`}
          />
        </div>
        {formData.password && (
          <>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded ${
                    i < passwordStrength.strength
                      ? passwordStrength.strength <= 2
                        ? "bg-red-500"
                        : passwordStrength.strength <= 3
                        ? "bg-yellow-500"
                        : "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs mt-1">{passwordStrength.message}</p>
          </>
        )}
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      {/* Roles */}
      <div>
        <Label>{language === "HI" ? "अपनी भूमिका चुनें" : "Select Your Role"} *</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = formData.role === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => updateFormData({ role: role.id as SignUpData["role"] })}

                className={`p-4 rounded-xl border-2 transition ${
                  isSelected
                    ? "border-[#7C8B56] bg-[#7C8B56]/10 shadow-lg"
                    : "border-[#D1B48C] bg-white hover:border-[#7C8B56]"
                }`}
              >
                <Icon className={`h-8 w-8 mb-2 ${isSelected ? "text-[#7C8B56]" : "text-[#D1B48C]"}`} />
                <h4 className="font-semibold text-[#3F5E46]">{role.title}</h4>
                <p className="text-sm text-[#7C8B56]">{role.description}</p>
              </button>
            );
          })}
        </div>
        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
      </div>

      {/* Terms */}
      <div className="flex gap-2">
        <Checkbox
          id="terms"
          checked={formData.terms_accepted}
          onCheckedChange={(checked) => updateFormData({ terms_accepted: checked === true })}
        />
        <Label htmlFor="terms">
          {language === "HI"
            ? "मैं नियम और शर्तें तथा गोपनीयता नीति से सहमत हूं"
            : "I agree to Terms & Conditions"}
        </Label>
      </div>
      {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

      <Button
        disabled={loading}
        type="submit"
        className="w-full flex items-center justify-center gap-2"
      >
        {loading
          ? language === "HI"
            ? "रजिस्टर हो रहा है..."
            : "Registering..."
          : language === "HI"
          ? "अगला कदम"
          : "NEXT STEP"}
        <ArrowRight />
      </Button>
    </motion.form>
  );
};

export default SignUpStep1New;
