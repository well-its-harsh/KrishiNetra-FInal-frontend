import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Download, Lock, X, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadAadhaar } from "@/lib/api";
import { parseAadhaarData, encryptAadhaarPayload, downloadJSON } from "@/lib/aadhaar-utils";
import { extractAadhaarQR } from "@/utils/extractAadhaarQR";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AadhaarModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  userId: string;
}

const AadhaarModal = ({ open, onClose, onSuccess, userId }: AadhaarModalProps) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"upload" | "scan">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setSelectedFile(file);

    try {
      const qrString = await extractAadhaarQR(file);

      const aadhaarJSON = {
        qrRawData: qrString,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        ...parseAadhaarData(qrString),
      };

      setExtractedData(aadhaarJSON);
    } catch (err) {
      console.error("QR scan error:", err);
      setError(
        language === "HI"
          ? "QR स्कैन विफल। कृपया एक स्पष्ट आधार कार्ड की छवि अपलोड करें।"
          : "QR scan failed. Please upload a clear Aadhaar card image."
      );
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setLoading(false);
    }
  };

  const handleEncryptAndUpload = async () => {
    if (!extractedData) {
      setError(
        language === "HI" ? "कृपया पहले QR कोड डिकोड करें" : "Please decode QR code first"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { encrypted } = await encryptAadhaarPayload(extractedData);

      await uploadAadhaar({
        user_id: userId,
        aadhaar_payload_encrypted: encrypted,
      });

      onSuccess(extractedData);
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(language === "HI" ? "अपलोड करने में त्रुटि" : "Error uploading");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJSON = () => {
    if (extractedData) {
      downloadJSON(extractedData, "aadhaar-data.json");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div id="aadhaar-hidden-scan-node" style={{ display: "none" }} />

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl rounded-[12px] overflow-hidden">
          <DialogHeader>
            <DialogTitle className={language === "HI" ? "hindi" : ""}>
              {language === "HI" ? "आधार स्कैन या अपलोड करें" : "Scan or Upload Aadhaar"}
            </DialogTitle>
            <DialogDescription className={language === "HI" ? "hindi" : ""}>
              {language === "HI"
                ? "आपका आधार सादे पाठ में संग्रहीत नहीं किया जाएगा। हम केवल एन्क्रिप्टेड पेलोड भेजते हैं।"
                : "Your Aadhaar will NOT be stored in plain text. We only send encrypted payload."}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className={language === "HI" ? "hindi" : ""}>
                <Upload className="mr-2 h-4 w-4" />
                {language === "HI" ? "अपलोड करें" : "Upload"}
              </TabsTrigger>
              <TabsTrigger value="scan" className={language === "HI" ? "hindi" : ""}>
                <Camera className="mr-2 h-4 w-4" />
                {language === "HI" ? "स्कैन करें" : "Scan"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              {!selectedFile ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <div>
                      <p className={language === "HI" ? "hindi" : ""}>
                        {language === "HI"
                          ? "अपना आधार कार्ड की छवि अपलोड करें"
                          : "Upload your Aadhaar card image"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {language === "HI"
                          ? "या फाइल को यहां खींचें और छोड़ें"
                          : "or drag and drop file here"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {language === "HI" ? "स्कैनिंग..." : "Scanning..."}
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          {language === "HI" ? "फ़ाइल चुनें" : "Select File"}
                        </>
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                      disabled={loading}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Aadhaar Preview"
                      className="max-h-96 w-full object-contain border rounded"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleReset} disabled={loading}>
                      <X className="mr-2 h-4 w-4" />
                      {language === "HI" ? "रीसेट करें" : "Reset"}
                    </Button>

                    {extractedData && (
                      <div className="flex items-center text-green-600">
                        <Check className="h-5 w-5 mr-2" />
                        {language === "HI" ? "स्कैन सफल!" : "Scan successful!"}
                      </div>
                    )}
                  </div>

                  {/* Extracted JSON UI FIXED */}
                  {extractedData && (
                    <div className="mt-4">
                      <p className="font-semibold text-gray-800 mb-2">
                        {language === "HI"
                          ? "निकाला गया आधार डेटा:"
                          : "Extracted Aadhaar QR Data:"}
                      </p>

                      <pre
                        className="bg-gray-100 p-4 rounded-md text-sm text-gray-900 whitespace-pre-wrap break-all border border-gray-300 max-h-64 overflow-y-auto leading-relaxed"
                      >
                        {JSON.stringify(extractedData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scan" className="space-y-4">
              <div className="text-center p-8 bg-[#FAF7F0] rounded-[12px]">
                <Camera className="h-12 w-12 mx-auto mb-4 text-[#4C763B]" />
                <p className={language === "HI" ? "hindi" : ""}>
                  {language === "HI"
                    ? "वेबकैम सुविधा जल्द ही उपलब्ध होगी"
                    : "Webcam feature coming soon"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {language === "HI"
                    ? "अभी के लिए, कृपया अपलोड टैब का उपयोग करें"
                    : "For now, please use the Upload tab"}
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          <div className="mt-6 p-4 bg-blue-50 rounded-[12px] border border-blue-200">
            <div className="flex items-start gap-2">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p
                  className={`text-sm font-semibold text-blue-900 mb-1 ${
                    language === "HI" ? "hindi" : ""
                  }`}
                >
                  {language === "HI" ? "सुरक्षा नोट" : "Security Note"}
                </p>
                <p className={`text-xs text-blue-700 ${language === "HI" ? "hindi" : ""}`}>
                  {language === "HI"
                    ? "आपका आधार डेटा स्थानीय रूप से एन्क्रिप्ट किया जाता है और केवल एन्क्रिप्टेड रूप में सर्वर पर भेजा जाता है। प्लेटफॉर्म आपके पूर्ण आधार नंबर को सादे पाठ में संग्रहीत नहीं करता।"
                    : "Your Aadhaar data is encrypted locally and only sent to the server in encrypted form. The platform does not store your full Aadhaar number in plain text."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            {extractedData && (
              <>
                <Button
                  onClick={handleDownloadJSON}
                  variant="outline"
                  className="flex-1 h-[44px] rounded-[12px] border-[#4C763B] text-[#4C763B]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {language === "HI" ? "JSON डाउनलोड करें" : "Download JSON"}
                </Button>

                <Button
                  onClick={handleEncryptAndUpload}
                  disabled={loading}
                  className="flex-1 h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px]"
                >
                  {loading
                    ? language === "HI"
                      ? "अपलोड हो रहा है..."
                      : "Uploading..."
                    : language === "HI"
                    ? "एन्क्रिप्ट और अपलोड करें"
                    : "Encrypt & Upload"}
                </Button>
              </>
            )}

            <Button
              onClick={handleReset}
              variant="outline"
              className="h-[44px] rounded-[12px]"
            >
              <X className="h-4 w-4" />
            </Button>

            <Button
              onClick={onClose}
              variant="ghost"
              className="h-[44px] rounded-[12px]"
            >
              {language === "HI" ? "बाद में छोड़ें" : "Skip for Later"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AadhaarModal;
