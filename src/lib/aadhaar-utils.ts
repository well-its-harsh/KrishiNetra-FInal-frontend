/**
 * Aadhaar QR Code Decoding and Encryption Utilities
 * 
 * This module handles:
 * 1. QR code decoding from Aadhaar card images
 * 2. XML/JSON parsing of Aadhaar data
 * 3. Local encryption using Web Crypto API
 */

import jsQR from 'jsqr';

/**
 * Decode QR code from image data
 */
export const decodeQRFromImage = async (imageData: ImageData): Promise<string | null> => {
  try {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    return code ? code.data : null;
  } catch (error) {
    console.error('QR decode error:', error);
    return null;
  }
};

/**
 * Parse Aadhaar XML/JSON from QR data
 * Aadhaar QR typically contains XML with embedded data
 */
export const parseAadhaarData = (qrData: string): {
  name?: string;
  dob?: string;
  gender?: string;
  masked_aadhaar?: string;
  address?: string;
  uuid?: string;
} | null => {
  try {
    // Aadhaar QR can be XML or JSON
    // Try parsing as XML first
    if (qrData.startsWith('<?xml') || qrData.startsWith('<')) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(qrData, 'text/xml');
      
      // Extract common Aadhaar XML fields
      const name = xmlDoc.querySelector('name')?.textContent || 
                   xmlDoc.querySelector('PrintLetterBarcodeData')?.getAttribute('name');
      const dob = xmlDoc.querySelector('dob')?.textContent ||
                  xmlDoc.querySelector('PrintLetterBarcodeData')?.getAttribute('dob');
      const gender = xmlDoc.querySelector('gender')?.textContent ||
                     xmlDoc.querySelector('PrintLetterBarcodeData')?.getAttribute('gender');
      const uid = xmlDoc.querySelector('uid')?.textContent ||
                  xmlDoc.querySelector('PrintLetterBarcodeData')?.getAttribute('uid');
      
      return {
        name: name || undefined,
        dob: dob || undefined,
        gender: gender || undefined,
        masked_aadhaar: uid ? `${uid.slice(0, 4)}****${uid.slice(-4)}` : undefined,
        uuid: xmlDoc.querySelector('uid')?.textContent || undefined
      };
    }
    
    // Try parsing as JSON
    try {
      const json = JSON.parse(qrData);
      return {
        name: json.name || json.NAME,
        dob: json.dob || json.DOB,
        gender: json.gender || json.GENDER,
        masked_aadhaar: json.masked_aadhaar || json.UID ? 
          `${(json.masked_aadhaar || json.UID).slice(0, 4)}****${(json.masked_aadhaar || json.UID).slice(-4)}` : undefined,
        address: json.address || json.ADDRESS,
        uuid: json.uuid || json.UUID
      };
    } catch {
      // If not JSON, return raw data
      return {
        name: undefined,
        masked_aadhaar: qrData.slice(0, 4) + '****' + qrData.slice(-4)
      };
    }
  } catch (error) {
    console.error('Aadhaar parse error:', error);
    return null;
  }
};

/**
 * Encrypt Aadhaar payload using Web Crypto API (AES-GCM)
 * 
 * Security Note: In production, use a key derived from server public key
 * or a key exchange protocol. This is a client-side encryption example.
 */
export const encryptAadhaarPayload = async (
  payload: Record<string, any>
): Promise<{ encrypted: string; key: string }> => {
  try {
    // Generate a random key (in production, use server public key)
    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
    
    // Export key for transmission (in production, encrypt this with server public key)
    const exportedKey = await crypto.subtle.exportKey('raw', key);
    const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
    
    // Convert payload to JSON
    const payloadJson = JSON.stringify(payload);
    const payloadBytes = new TextEncoder().encode(payloadJson);
    
    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      payloadBytes
    );
    
    // Combine IV + encrypted data and encode as base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    const encryptedBase64 = btoa(String.fromCharCode(...combined));
    
    return {
      encrypted: encryptedBase64,
      key: keyBase64
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt Aadhaar data');
  }
};

/**
 * Download JSON file locally
 */
export const downloadJSON = (data: Record<string, any>, filename: string = 'aadhaar-data.json') => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

