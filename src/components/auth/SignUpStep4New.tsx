import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, ArrowLeft, Upload, Check, Loader2 } from "lucide-react";
import type { SignUpData } from "./NewSignUpForm";

interface SignUpStep4NewProps {
  formData: SignUpData;
  updateFormData: (updates: Partial<SignUpData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SignUpStep4New = ({ formData, updateFormData, onNext, onPrev }: SignUpStep4NewProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [documentsRequired, setDocumentsRequired] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  // Check if documents are required
  useEffect(() => {
    const checkDocuments = async () => {
      setChecking(true);
      try {
        // TODO: Call backend to check if documents are required
        // const response = await fetch(`${API_BASE}/verification/check-documents?user_id=${formData.user_id}&role=${formData.role}`);
        // const data = await response.json();
        // setDocumentsRequired(data.required);
        
        // Simulate API call - for now, assume no documents needed
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDocumentsRequired(false);
      } catch (error) {
        console.error('Error checking documents:', error);
        setDocumentsRequired(false);
      } finally {
        setChecking(false);
      }
    };

    if (formData.user_id) {
      checkDocuments();
    }
  }, [formData.user_id, formData.role]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // TODO: Upload files via backend
      // const uploadFormData = new FormData();
      // Array.from(files).forEach((file) => {
      //   uploadFormData.append('files', file);
      // });
      // uploadFormData.append('user_id', formData.user_id.toString());
      // 
      // const response = await fetch(`${API_BASE}/verification/upload`, {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploaded(true);
      updateFormData({ documents: { upload_ids: ['doc_1', 'doc_2'] } });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (!documentsRequired || uploaded) {
      onNext();
    }
  };

  // Skip step if no documents required
  useEffect(() => {
    if (!checking && !documentsRequired) {
      // Auto-advance after a brief delay
      const timer = setTimeout(() => {
        onNext();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [checking, documentsRequired, onNext]);

  if (checking) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Loader2 className="h-12 w-12 text-[#BC8F29] animate-spin mb-4" />
        <p className={`text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "जांच रहा है..." : "Checking..."}
        </p>
      </motion.div>
    );
  }

  if (!documentsRequired) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Check className="h-16 w-16 mx-auto mb-4 text-[#7C8B56]" />
        <p className={`text-lg text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" 
            ? "कोई दस्तावेज़ आवश्यक नहीं है" 
            : "No documents required"}
        </p>
        <p className={`text-[#7C8B56] mt-2 ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" 
            ? "अगले चरण पर जा रहे हैं..." 
            : "Proceeding to next step..."}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-6"
    >
      <div>
        <h3 className={`text-2xl font-bold mb-2 text-[#3F5E46] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "चरण 4: दस्तावेज़ अपलोड" : "Step 4: Document Upload"}
        </h3>
        <p className={`text-[#7C8B56] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI"
            ? "कृपया आवश्यक दस्तावेज़ अपलोड करें"
            : "Please upload required documents"}
        </p>
      </div>

      {!uploaded ? (
        <div className="border-2 border-dashed border-[#D1B48C] rounded-xl p-8 text-center bg-white">
          <Upload className="h-12 w-12 mx-auto mb-4 text-[#7C8B56]" />
          <p className={`text-[#3F5E46] mb-4 ${language === "HI" ? "hindi" : ""}`}>
            {language === "HI" ? "दस्तावेज़ अपलोड करें" : "Upload documents"}
          </p>
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button
              type="button"
              asChild
              disabled={uploading}
              className="bg-[#BC8F29] hover:bg-[#BC8F29]/90 text-white rounded-xl"
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "HI" ? "अपलोड हो रहा है..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {language === "HI" ? "फ़ाइलें चुनें" : "Choose Files"}
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-[#7C8B56] rounded-xl p-8 text-center bg-[#7C8B56]/10"
        >
          <Check className="h-12 w-12 mx-auto mb-4 text-[#7C8B56]" />
          <p className={`text-[#3F5E46] font-semibold ${language === "HI" ? "hindi" : ""}`}>
            {language === "HI" ? "दस्तावेज़ अपलोड किए गए ✔️" : "Documents uploaded ✔️"}
          </p>
        </motion.div>
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
          type="button"
          onClick={handleNext}
          disabled={!uploaded}
          className="flex-1 h-[52px] bg-[#BC8F29] hover:bg-[#BC8F29]/90 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg font-semibold"
        >
          {language === "HI" ? "अगला कदम" : "Next Step"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SignUpStep4New;

