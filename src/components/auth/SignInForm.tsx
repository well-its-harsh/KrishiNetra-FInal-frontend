import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { forgotPassword } from "@/lib/api";
import { Mail, Lock, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
}

const SignInForm = ({ onSwitchToSignUp }: SignInFormProps) => {
  const { language, t } = useLanguage();
  const { login, error: authError, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = language === "HI" ? "ईमेल आवश्यक है" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = language === "HI" ? "वैध ईमेल दर्ज करें" : "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = language === "HI" ? "पासवर्ड आवश्यक है" : "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    try {
      await login(email, password);
    } catch {
      // AuthContext already sets its own error; just mirror a generic message here if needed
      setErrors({
        submit: language === "HI"
          ? "लॉगिन असफल। कृपया पुनः प्रयास करें।"
          : "Login failed. Please try again."
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      return;
    }
    
    try {
      await forgotPassword({ email: forgotEmail });
      setShowForgotPassword(false);
      // Show success message
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
      className="sign-in-form p-12"
    >
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 text-[#043915] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "साइन इन करें" : "Sign In"}
        </h2>
        <p className={`text-[#4C763B] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" 
            ? "अपने खाते में लॉग इन करें"
            : "Sign in to your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className={`mb-2 block ${language === "HI" ? "hindi" : ""}`}>
            {language === "HI" ? "ईमेल" : "Email"}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4C763B]" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 h-[44px] rounded-[12px] border-[#B0CE88] focus:border-[#4C763B] focus:ring-[#4C763B] ${errors.email ? "border-red-500" : ""}`}
              placeholder={language === "HI" ? "आपका ईमेल" : "your.email@example.com"}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className={`mb-2 block ${language === "HI" ? "hindi" : ""}`}>
            {language === "HI" ? "पासवर्ड" : "Password"}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4C763B]" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 h-[44px] rounded-[12px] border-[#B0CE88] focus:border-[#4C763B] focus:ring-[#4C763B] ${errors.password ? "border-red-500" : ""}`}
              placeholder={language === "HI" ? "आपका पासवर्ड" : "Enter your password"}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className={`text-sm text-[#4C763B] hover:underline ${language === "HI" ? "hindi" : ""}`}
          >
            {language === "HI" ? "पासवर्ड भूल गए?" : "Forgot password?"}
          </button>
        </div>

        {(errors.submit || authError) && (
          <p className="text-sm text-red-600">{errors.submit || authError}</p>
        )}

        <Button
          type="submit"
          disabled={authLoading}
          className="w-full h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px] transition-all duration-180 hover:scale-[1.03] hover:shadow-lg"
        >
          {authLoading 
            ? (language === "HI" ? "लॉग इन हो रहा है..." : "Signing in...")
            : (language === "HI" ? "साइन इन करें" : "Sign In")
          }
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className={`text-sm text-gray-600 ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "खाता नहीं है?" : "Don't have an account?"}{" "}
          <button
            onClick={onSwitchToSignUp}
            className="text-[#4C763B] font-semibold hover:underline"
          >
            {language === "HI" ? "साइन अप करें" : "Sign Up"}
          </button>
        </p>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="rounded-[12px]">
          <DialogHeader>
            <DialogTitle className={language === "HI" ? "hindi" : ""}>
              {language === "HI" ? "पासवर्ड रीसेट करें" : "Reset Password"}
            </DialogTitle>
            <DialogDescription className={language === "HI" ? "hindi" : ""}>
              {language === "HI"
                ? "पासवर्ड रीसेट लिंक के लिए अपना ईमेल दर्ज करें"
                : "Enter your email to receive a password reset link"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="forgot-email" className={language === "HI" ? "hindi" : ""}>
                {language === "HI" ? "ईमेल" : "Email"}
              </Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="mt-2 h-[44px] rounded-[12px]"
                placeholder={language === "HI" ? "आपका ईमेल" : "your.email@example.com"}
              />
            </div>
            <Button
              onClick={handleForgotPassword}
              className="w-full h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px]"
            >
              {language === "HI" ? "लिंक भेजें" : "Send Reset Link"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SignInForm;

