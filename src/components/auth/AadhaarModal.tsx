import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Cropper from "cropperjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadAadhaar } from "@/lib/api";
import { decodeQRFromImage, parseAadhaarData, encryptAadhaarPayload, downloadJSON } from "@/lib/aadhaar-utils";
import { Upload, Camera, Download, Lock, X } from "lucide-react";
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
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (imageRef.current && selectedFile && !cropper) {
      const cropperInstance = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.8,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      });
      setCropper(cropperInstance);
    }

    return () => {
      if (cropper) {
        cropper.destroy();
      }
    };
  }, [selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError("");
      const reader = new FileReader();
      reader.onload = (e) => {
        if (imageRef.current) {
          imageRef.current.src = e.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError(language === "HI" ? "कृपया एक वैध छवि फ़ाइल चुनें" : "Please select a valid image file");
    }
  };

  const handleDecodeQR = async () => {
    if (!cropper || !canvasRef.current) {
      setError(language === "HI" ? "कृपया पहले छवि क्रॉप करें" : "Please crop the image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get cropped canvas
      const canvas = cropper.getCroppedCanvas({
        width: 800,
        height: 800,
      });

      // Draw to canvas for QR decoding
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = canvas.width;
        canvasRef.current.height = canvas.height;
        ctx.drawImage(canvas, 0, 0);

        // Get image data for QR decoding
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrData = await decodeQRFromImage(imageData);

        if (qrData) {
          const parsed = parseAadhaarData(qrData);
          if (parsed) {
            setExtractedData(parsed);
          } else {
            setError(language === "HI" ? "QR कोड से डेटा पार्स नहीं किया जा सका" : "Could not parse data from QR code");
          }
        } else {
          setError(language === "HI" ? "QR कोड नहीं मिला। कृपया मैन्युअल इनपुट का उपयोग करें।" : "QR code not found. Please use manual input.");
        }
      }
    } catch (err) {
      console.error("QR decode error:", err);
      setError(language === "HI" ? "QR कोड डिकोड करने में त्रुटि" : "Error decoding QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleEncryptAndUpload = async () => {
    if (!extractedData) {
      setError(language === "HI" ? "कृपया पहले QR कोड डिकोड करें" : "Please decode QR code first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Encrypt the payload
      const { encrypted } = await encryptAadhaarPayload(extractedData);

      // Upload encrypted payload
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
      downloadJSON(extractedData, 'aadhaar-data.json');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setError("");
    if (cropper) {
      cropper.destroy();
      setCropper(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[12px]">
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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mt-4">
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

          <TabsContent value="upload" className="space-y-4">
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-[#B0CE88] rounded-[12px] p-12 text-center cursor-pointer hover:border-[#4C763B] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-[#4C763B]" />
                <p className={`mb-2 ${language === "HI" ? "hindi" : ""}`}>
                  {language === "HI" ? "फ़ाइल चुनें या यहाँ खींचें" : "Choose file or drag and drop"}
                </p>
                <p className="text-sm text-gray-500">
                  {language === "HI" ? "PNG, JPG, JPEG (अधिकतम 5MB)" : "PNG, JPG, JPEG (Max 5MB)"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    ref={imageRef}
                    alt="Aadhaar card"
                    className="max-w-full h-auto"
                    style={{ display: 'none' }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                {!extractedData && (
                  <Button
                    onClick={handleDecodeQR}
                    disabled={loading}
                    className="w-full h-[44px] bg-[#4C763B] hover:bg-[#043915] text-white rounded-[12px]"
                  >
                    {loading
                      ? (language === "HI" ? "डिकोड हो रहा है..." : "Decoding...")
                      : (language === "HI" ? "QR कोड डिकोड करें" : "Decode QR Code")
                    }
                  </Button>
                )}

                {extractedData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#FAF7F0] rounded-[12px] space-y-2"
                  >
                    <h4 className={`font-semibold ${language === "HI" ? "hindi" : ""}`}>
                      {language === "HI" ? "निकाला गया डेटा:" : "Extracted Data:"}
                    </h4>
                    {extractedData.name && (
                      <p className={language === "HI" ? "hindi" : ""}>
                        <strong>{language === "HI" ? "नाम:" : "Name:"}</strong> {extractedData.name}
                      </p>
                    )}
                    {extractedData.masked_aadhaar && (
                      <p>
                        <strong>{language === "HI" ? "आधार:" : "Aadhaar:"}</strong> {extractedData.masked_aadhaar}
                      </p>
                    )}
                    {extractedData.dob && (
                      <p>
                        <strong>{language === "HI" ? "जन्म तिथि:" : "DOB:"}</strong> {extractedData.dob}
                      </p>
                    )}
                  </motion.div>
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

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-[12px] border border-blue-200">
          <div className="flex items-start gap-2">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className={`text-sm font-semibold text-blue-900 mb-1 ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI" ? "सुरक्षा नोट" : "Security Note"}
              </p>
              <p className={`text-xs text-blue-700 ${language === "HI" ? "hindi" : ""}`}>
                {language === "HI"
                  ? "आपका आधार डेटा स्थानीय रूप से एन्क्रिप्ट किया जाता है और केवल एन्क्रिप्टेड रूप में सर्वर पर भेजा जाता है। प्लेटफॉर्म आपके पूर्ण आधार नंबर को सादे पाठ में संग्रहीत नहीं करता है।"
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
                  ? (language === "HI" ? "अपलोड हो रहा है..." : "Uploading...")
                  : (language === "HI" ? "एन्क्रिप्ट और अपलोड करें" : "Encrypt & Upload")
                }
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
  );
};

export default AadhaarModal;

