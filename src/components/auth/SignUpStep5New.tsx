import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, mapBackendRole } from "@/contexts/AuthContext";
import type { SignUpData } from "./NewSignUpForm";
import { toast } from "sonner";
import { useState } from "react";
import { API_BASE } from "@/config/api";

interface SignUpStep5NewProps {
  formData: SignUpData;
}

const SignUpStep5New = ({ formData }: SignUpStep5NewProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoToDashboard = async () => {
  try {
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Missing email or password — cannot complete login.");
      return;
    }

    // Completely reset cookies/session
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    // Login
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    if (!loginRes.ok) throw new Error("Auto login failed");
    const loginData = await loginRes.json();

    const userId = loginData.user_id;

    // Fetch updated profile
    const profileRes = await fetch(`${API_BASE}/users/${userId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!profileRes.ok) throw new Error("Failed to fetch profile");

    const fullUser = await profileRes.json();

    // Save into AuthContext (true final state)
    const backendRole = fullUser.role as string;
    const normalizedRole = mapBackendRole(backendRole);

    const normalizedUser = {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      role: normalizedRole,
      email_verified: fullUser.is_authenticated,
      verification_status: fullUser.is_active ? "verified" : "pending",
    } as const;

    setUser(normalizedUser as any);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("user_id", String(fullUser.id));

    // Redirect using normalized role (same mapping as AuthContext.login)
    if (normalizedRole === "consumer") navigate("/dashboard/consumer", { replace: true });
    else if (normalizedRole === "seller") navigate("/dashboard/seller", { replace: true });
    else if (normalizedRole === "fpo") navigate("/dashboard/seller", { replace: true });
    else if (normalizedRole === "institution") navigate("/dashboard/institution", { replace: true });
    else if (normalizedRole === "transporter") navigate("/dashboard/transporter", { replace: true });
    else if (normalizedRole === "admin") navigate("/dashboard/admin", { replace: true });
    else navigate("/", { replace: true });

  } catch (err) {
    console.error(err);
    toast.error("Unable to load dashboard");
  } finally {
    setLoading(false);
  }
};



  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="text-center space-y-8 py-8"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#7C8B56] flex items-center justify-center shadow-lg">
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
            className="absolute inset-0 rounded-full bg-[#7C8B56]/20 animate-ping"
          />
        </div>
      </motion.div>

      {/* Message */}
      <div className="space-y-4">
        <h2 className={`text-4xl font-bold text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "पंजीकरण सफल!" : "Registration Successful!"}
        </h2>
        <p className={`text-lg text-[#7C8B56] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI"
            ? "आपका खाता सफलतापूर्वक बनाया गया है। अब आप अपने डैशबोर्ड तक पहुंच सकते हैं।"
            : "Your account has been successfully created. You can now access your dashboard."}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          onClick={handleGoToDashboard}
          disabled={loading}
          className="bg-[#BC8F29] hover:bg-[#BC8F29]/90 text-white rounded-xl h-[52px] px-8 
            transition-all duration-300 hover:scale-[1.02] hover:shadow-lg font-semibold"
        >
          {loading ? "Loading..." : language === "HI" ? "डैशबोर्ड पर जाएं" : "Go to Dashboard"}
          {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>

        <Button
          onClick={() => navigate("/signin")}
          variant="outline"
          className="border-[#7C8B56] text-[#7C8B56] hover:bg-[#7C8B56]/10 rounded-xl h-[52px] px-8"
        >
          <LogIn className="mr-2 h-5 w-5" />
          {language === "HI" ? "साइन इन करें" : "Sign In"}
        </Button>
      </div>
    </motion.div>
  );
};

export default SignUpStep5New;
