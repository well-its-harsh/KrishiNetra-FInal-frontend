import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadDocument, submitFPOVerification, submitBusinessVerification } from "@/lib/api";
import { ArrowRight, ArrowLeft, Upload, FileText } from "lucide-react";
import type { SignUpData } from "./SignUpForm";

interface SignUpStep4Props {
  formData: SignUpData;
  updateFormData: (updates: Partial<SignUpData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SignUpStep4 = ({ formData, updateFormData, onNext, onPrev }: SignUpStep4Props) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleFileUpload = async (file: File, docType: string) => {
    if (!formData.user_id) return;

    setLoading(true);
    setError("");

    try {
      const response = await uploadDocument({
        user_id: formData.user_id,
        doc_type: docType,
        file,
      });

      updateFormData({
        documents: {
          ...formData.documents,
          upload_ids: [...formData.documents.upload_ids, response.upload_id],
        },
      });
    } catch (err) {
      setError(language === "HI" ? "अपलोड असफल" : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.user_id) return;

    setLoading(true);
    setError("");

    try {
      if (formData.role === 'fpo' && formData.documents.fpo_registration_number) {
        await submitFPOVerification({
          user_id: formData.user_id,
          fpo_registration_number: formData.documents.fpo_registration_number,
          upload_ids: formData.documents.upload_ids,
        });
      } else if (formData.role === 'seller' && (formData.documents.gst_number || formData.documents.fssai_number)) {
        await submitBusinessVerification({
          user_id: formData.user_id,
          gst: formData.documents.gst_number,
          fssai: formData.documents.fssai_number,
          upload_ids: formData.documents.upload_ids,
        });
      }

      onNext();
    } catch (err) {
      setError(language === "HI" ? "दस्तावेज़ सबमिट करने में त्रुटि" : "Error submitting documents");
    } finally {
      setLoading(false);
    }
  };

  const FileUploadArea = ({ 
    docType, 
    label, 
    accept = ".pdf,.jpg,.jpeg,.png",
    required = false 
  }: { 
    docType: string; 
    label: string; 
    accept?: string;
    required?: boolean;
  }) => {
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file, docType);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file, docType);
    };

    return (
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-[#B0CE88] rounded-[12px] p-6 text-center cursor-pointer hover:border-[#4C763B] transition-colors"
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-[#4C763B]" />
        <Label className={`cursor-pointer ${language === "HI" ? "hindi" : ""}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id={`file-${docType}`}
        />
        <label htmlFor={`file-${docType}`} className="block mt-2">
          <span className={`text-sm text-gray-600 ${language === "HI" ? "hindi" : ""}`}>
            {language === "HI" ? "क्लिक करें या फ़ाइल खींचें" : "Click or drag file"}
          </span>
        </label>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-6"
    >
      <div>
        <h3 className={`text-2xl font-bold mb-2 text-[#043915] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI" ? "व्यावसायिक दस्तावेज़" : "Business Documents"}
        </h3>
        <p className={`text-[#4C763B] ${language === "HI" ? "hindi" : ""}`}>
          {language === "HI"
            ? "अपने व्यावसायिक दस्तावेज़ अपलोड करें"
            : "Upload your business documents"}
        </p>
      </div>

      {/* SHG Documents */}
      {formData.role === 'seller' && formData.seller_type === 'shg' && (
        <div className="space-y-4">
          <div>
            <Label className={language === "HI" ? "hindi" : ""}>
              {language === "HI" ? "SHG पंजीकरण ID" : "SHG Registration ID"}
            </Label>
            <Input
              value={formData.documents.shg_registration_id || ""}
              onChange={(e) => updateFormData({
                documents: { ...formData.documents, shg_registration_id: e.target.value }
              })}
              className="h-[44px] rounded-[12px] mt-2"
              placeholder={language === "HI" ? "SHG पंजीकरण संख्या" : "SHG registration number"}
            />
          </div>
          <FileUploadArea
            docType="shg_certificate"
            label={language === "HI" ? "SHG प्रमाणपत्र" : "SHG Certificate"}
            required
          />
        </div>
      )}

      {/* FPO Documents */}
      {formData.role === 'fpo' && (
        <div className="space-y-4">
          <div>
            <Label className={language === "HI" ? "hindi" : ""}>
              {language === "HI" ? "FPO पंजीकरण संख्या" : "FPO Registration Number"} <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.documents.fpo_registration_number || ""}
              onChange={(e) => updateFormData({
                documents: { ...formData.documents, fpo_registration_number: e.target.value }
              })}
              className="h-[44px] rounded-[12px] mt-2"
              placeholder={language === "HI" ? "FPO पंजीकरण संख्या" : "FPO registration number"}
              required
            />
          </div>
          <FileUploadArea
            docType="fpo_certificate"
            label={language === "HI" ? "FPO पंजीकरण प्रमाणपत्र" : "FPO Registration Certificate"}
            required
          />
          <FileUploadArea
            docType="fpo_digital_certificate"
            label={language === "HI" ? "डिजिटल प्रमाणपत्र (PDF)" : "Digital Certificate (PDF)"}
            accept=".pdf"
          />
        </div>
      )}

      {/* Processor/Startup/Retailer Documents */}
      {(formData.seller_type === 'processor' || formData.seller_type === 'startup' || formData.seller_type === 'retailer') && (
        <div className="space-y-4">
          <div>
            <Label className={language === "HI" ? "hindi" : ""}>
              {language === "HI" ? "GST नंबर" : "GST Number"}
            </Label>
            <Input
              value={formData.documents.gst_number || ""}
              onChange={(e) => updateFormData({
                documents: { ...formData.documents, gst_number: e.target.value }
              })}
              className="h-[44px] rounded-[12px] mt-2"
              placeholder={language === "HI" ? "GST नंबर" : "GST number"}
            />
          </div>
          {formData.documents.gst_number && (
            <FileUploadArea
              docType="gst_certificate"
              label={language === "HI" ? "GST प्रमाणपत्र" : "GST Certificate"}
            />
          )}
          <div>
            <Label className={language === "HI" ? "hindi" : ""}>
              {language === "HI" ? "FSSAI नंबर" : "FSSAI Number"}
            </Label>
            <Input
              value={formData.documents.fssai_number || ""}
              onChange={(e) => updateFormData({
                documents: { ...formData.documents, fssai_number: e.target.value }
              })}
              className="h-[44px] rounded-[12px] mt-2"
              placeholder={language === "HI" ? "FSSAI नंबर" : "FSSAI number"}
            />
          </div>
          {formData.documents.fssai_number && (
            <FileUploadArea
              docType="fssai_certificate"
              label={language === "HI" ? "FSSAI प्रमाणपत्र" : "FSSAI Certificate"}
            />
          )}
        </div>
      )}

      {/* Consumer/NGO - No documents required */}
      {formData.role === 'consumer' && (
        <div className="p-6 bg-[#FAF7F0] rounded-[12px] text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-[#4C763B]" />
          <p className={language === "HI" ? "hindi" : ""}>
            {language === "HI"
              ? "उपभोक्ता/एनजीओ के लिए कोई अतिरिक्त दस्तावेज़ आवश्यक नहीं है"
              : "No additional documents required for Consumer/NGO"}
          </p>
        </div>
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
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px] transition-all duration-180 hover:scale-[1.03]"
        >
          {loading
            ? (language === "HI" ? "सहेज रहा है..." : "Saving...")
            : (language === "HI" ? "सहेजें और जारी रखें" : "Save & Continue")
          }
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SignUpStep4;

