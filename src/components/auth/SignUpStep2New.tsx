import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingCart, Building, Users, ArrowRight, ArrowLeft } from "lucide-react";
import type { SignUpData } from "./NewSignUpForm";

interface SignUpStep2NewProps {
  formData: SignUpData;
  updateFormData: (updates: Partial<SignUpData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SignUpStep2New = ({ formData, updateFormData, onNext, onPrev }: SignUpStep2NewProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    {
      id: 'CONSUMER' as const,
      icon: ShoppingCart,
      title: language === "HI" ? "उपभोक्ता" : "Consumer",
      description: language === "HI" 
        ? "मिलेट उत्पाद खरीदें और जागरूकता फैलाएं"
        : "Purchase millet products and spread awareness"
    },
    {
      id: 'FPO' as const,
      icon: Users,
      title: language === "HI" ? "एफपीओ" : "FPO",
      description: language === "HI"
        ? "किसान उत्पादक संगठन"
        : "Farmer Producer Organization"
    },
    {
      id: 'BUSINESS' as const,
      icon: Building,
      title: language === "HI" ? "थोक विक्रेता" : "Wholeseller",
      description: language === "HI"
        ? "अपने मिलेट उत्पाद बेचें"
        : "Sell your millet products"
    },
  ];

  const handleRoleSelect = (role: typeof formData.role) => {
    updateFormData({ role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.role) {
    setError(language === "HI" ? "कृपया एक भूमिका चुनें" : "Please select a role");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    // 1️⃣ Update user role in backend
    const res = await fetch(`${API_BASE_URL}/users/${formData.user_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        role: formData.role,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to update role");
    }

    // 2️⃣ Fetch updated profile to confirm saved role
    const verifyRes = await fetch(`${API_BASE_URL}/users/${formData.user_id}`, {
      credentials: "include",
    });

    const updated = await verifyRes.json();
    const backendRole = updated.role; // "BUSINESS" / "FPO" / "CONSUMER"

    // 3️⃣ Update local form state with TRUE backend role
    updateFormData({ role: backendRole });

    // 4️⃣ Now safe to move to next step
    onNext();
  } catch (err: any) {
    setError(err.message || "Error setting role");
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
        <h3 className={`text-2xl font-bold mb-2 text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "चरण 2: भूमिका चुनें" : "Step 2: Select Role"}
        </h3>
        <p className={`text-[#7C8B56] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI"
            ? "आप किस भूमिका में भाग लेना चाहते हैं?"
            : "What role would you like to participate in?"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = formData.role === role.id;
          
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => handleRoleSelect(role.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                isSelected
                  ? 'border-[#7C8B56] bg-[#7C8B56]/10 shadow-lg'
                  : 'border-[#D1B48C] bg-white hover:border-[#7C8B56]'
              } cursor-pointer`}
            >
              <Icon className={`h-10 w-10 mb-3 ${isSelected ? 'text-[#7C8B56]' : 'text-[#D1B48C]'}`} />
              <h4 className={`font-semibold mb-2 text-left text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
                {role.title}
              </h4>
              <p className={`text-sm text-[#7C8B56] text-left ${language === "HI" ? "hindi" : ""}`}>
                {role.description}
              </p>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-[#8C483F]">{error}</p>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex-1 h-[52px] rounded-xl border-[#7C8B56] text-[#7C8B56] hover:bg-[#7C8B56]/10"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {language === "HI" ? "पिछला" : "Previous"}
        </Button>
        <Button
          type="submit"
          disabled={loading || !formData.role}
          className="flex-1 h-[52px] bg-[#BC8F29] hover:bg-[#BC8F29]/90 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg font-semibold"
        >
          {loading
            ? (language === "HI" ? "सहेज रहा है..." : "Saving...")
            : (language === "HI" ? "अगला कदम" : "Next Step")
          }
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.form>
  );
};

export default SignUpStep2New;



