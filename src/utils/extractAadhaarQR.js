import { Html5Qrcode } from "html5-qrcode";

export async function extractAadhaarQR(file) {
  const scanner = new Html5Qrcode("aadhaar-hidden-scan-node");

  try {
    const rawQR = await scanner.scanFile(file, true);
    return rawQR; // return RAW QR string from Aadhaar
  } catch (err) {
    console.error("QR error:", err);
    throw new Error("Unable to read Aadhaar QR. Please upload a clear QR image.");
  }
}
