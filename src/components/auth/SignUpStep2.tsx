import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { setUserRole } from "@/lib/api";
import { Users, ShoppingCart, Building, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import type { SignUpData } from "./SignUpForm";

interface SignUpStep2Props {
  formData: SignUpData;
  updateFormData: (updates: Partial<SignUpData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SignUpStep2 = ({ formData, updateFormData, onNext, onPrev }: SignUpStep2Props) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    {
      id: 'consumer' as const,
      icon: ShoppingCart,
      title: language === "HI" ? "उपभोक्ता/एनजीओ" : "Consumer/NGO",
      description: language === "HI" 
        ? "मिलेट उत्पाद खरीदें और जागरूकता फैलाएं"
        : "Purchase millet products and spread awareness"
    },
    {
      id: 'seller' as const,
      icon: Building,
      title: language === "HI" ? "विक्रेता" : "Seller",
      description: language === "HI"
        ? "अपने मिलेट उत्पाद बेचें"
        : "Sell your millet products"
    },
    {
      id: 'fpo' as const,
      icon: Users,
      title: language === "HI" ? "एफपीओ" : "FPO",
      description: language === "HI"
        ? "किसान उत्पादक संगठन"
        : "Farmer Producer Organization"
    },
    {
      id: 'admin' as const,
      icon: Shield,
      title: language === "HI" ? "व्यवस्थापक" : "Admin",
      description: language === "HI"
        ? "प्लेटफॉर्म प्रबंधन"
        : "Platform management"
    },
  ];

  const sellerTypes = [
    { value: 'farmer', label: language === "HI" ? "किसान" : "Farmer" },
    { value: 'shg', label: language === "HI" ? "स्वयं सहायता समूह" : "SHG" },
    { value: 'processor', label: language === "HI" ? "प्रोसेसर" : "Processor" },
    { value: 'startup', label: language === "HI" ? "स्टार्टअप" : "Startup" },
    { value: 'retailer', label: language === "HI" ? "खुदरा विक्रेता" : "Retailer" },
  ];

  const handleRoleSelect = (role: typeof formData.role) => {
    updateFormData({ role, seller_type: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role) {
      setError(language === "HI" ? "कृपया एक भूमिका चुनें" : "Please select a role");
      return;
    }

    if (formData.role === 'seller' && !formData.seller_type) {
      setError(language === "HI" ? "कृपया विक्रेता प्रकार चुनें" : "Please select seller type");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      if (formData.user_id) {
        await setUserRole({
          user_id: formData.user_id,
          role: formData.role,
          seller_type: formData.seller_type || undefined,
        });
      }
      onNext();
    } catch (err) {
      setError(language === "HI" ? "भूमिका सेट करने में त्रुटि" : "Error setting role");
    } finally {
      setLoading(false);
    }
  };

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
          {language === "HI" ? "अपनी भूमिका चुनें" : "Select Your Role"}
        </h3>
        <p className={`text-[#4C763B] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI"
            ? "आप किस भूमिका में भाग लेना चाहते हैं?"
            : "What role would you like to participate in?"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = formData.role === role.id;
          const isAdmin = role.id === 'admin';
          
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => !isAdmin && handleRoleSelect(role.id)}
              disabled={isAdmin}
              className={`p-6 rounded-[12px] border-2 transition-all duration-180 hover:scale-[1.02] ${
                isSelected
                  ? 'border-[#4C763B] bg-[#4C763B]/5 shadow-[0_6px_18px_rgba(4,57,21,0.08)]'
                  : 'border-[#B0CE88] bg-white hover:border-[#4C763B]'
              } ${isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Icon className={`h-8 w-8 mb-3 ${isSelected ? 'text-[#4C763B]' : 'text-[#B0CE88]'}`} />
              <h4 className={`font-semibold mb-2 text-left ${language === "HI" ? "hindi" : ""}`}>
                {role.title}
              </h4>
              <p className={`text-sm text-gray-600 text-left ${language === "HI" ? "hindi" : ""}`}>
                {role.description}
              </p>
            </button>
          );
        })}
      </div>

      {formData.role === 'seller' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.36 }}
          className="space-y-4"
        >
          <Label className={language === "HI" ? "hindi" : ""}>
            {language === "HI" ? "विक्रेता प्रकार" : "Seller Type"} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.seller_type || ""}
            onValueChange={(value) => updateFormData({ seller_type: value as typeof formData.seller_type })}
          >
            <SelectTrigger className="h-[44px] rounded-[12px] border-[#B0CE88] focus:border-[#4C763B]">
              <SelectValue placeholder={language === "HI" ? "विक्रेता प्रकार चुनें" : "Select seller type"} />
            </SelectTrigger>
            <SelectContent>
              {sellerTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
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
          type="submit"
          disabled={loading || !formData.role || (formData.role === 'seller' && !formData.seller_type)}
          className="flex-1 h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px] transition-all duration-180 hover:scale-[1.03]"
        >
          {loading
            ? (language === "HI" ? "सहेज रहा है..." : "Saving...")
            : (language === "HI" ? "अगला कदम" : "Next Step")
          }
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.form>
  );
};

export default SignUpStep2;

