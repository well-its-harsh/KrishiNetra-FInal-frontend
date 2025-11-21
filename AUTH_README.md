# KrishiNetra Authentication & Verification Flow

## Overview

This is a production-ready signup/login and verification flow for KrishiNetra, implementing a multi-step sliding panel authentication system with role-based signup, Aadhaar verification, and document uploads.

## Features

### ✅ Implemented

1. **Sliding Panel Auth UI**
   - Smooth sign-in/sign-up panel transitions
   - Overlay with motivational content
   - Responsive design (desktop-first, mobile-friendly)

2. **Multi-Step Signup (5 Steps)**
   - Step 1: Basic Info (name, email, phone, password with strength indicator)
   - Step 2: Role Selection (Consumer/NGO, Seller, FPO, Admin)
   - Step 3: Identity Verification (Aadhaar, Email OTP, Phone OTP)
   - Step 4: Business Documents (role-based document uploads)
   - Step 5: Finish/Verification Pending

3. **Aadhaar Verification**
   - Image upload with drag & drop
   - Image cropping with Cropper.js
   - QR code decoding from cropped image
   - Local encryption using Web Crypto API (AES-GCM)
   - JSON download for user records
   - Security notes displayed to users

4. **Document Upload System**
   - Drag & drop file uploads
   - Role-based document requirements:
     - SHG: Registration ID + Certificate
     - FPO: Registration Number + Certificate + Digital Certificate
     - Processor/Startup/Retailer: GST + FSSAI certificates
   - Upload progress tracking

5. **Client-Side Validation**
   - Email format validation
   - Password strength (8+ chars, uppercase, lowercase, digit, special)
   - Phone number validation
   - Real-time error messages
   - Inline validation feedback

6. **Bilingual Support**
   - English/Hindi toggle
   - All UI text translated
   - Proper font rendering for Hindi (Noto Sans Devanagari)

7. **Accessibility**
   - WCAG AA color contrast
   - Large touch targets (≥44px)
   - Proper labels for all inputs
   - ARIA labels where needed

## File Structure

```
src/
├── pages/
│   └── Auth.tsx                    # Main auth page with sliding panels
├── components/
│   └── auth/
│       ├── SignInForm.tsx          # Login form
│       ├── SignUpForm.tsx          # Multi-step signup container
│       ├── SignUpStep1.tsx         # Basic info step
│       ├── SignUpStep2.tsx         # Role selection step
│       ├── SignUpStep3.tsx         # Verification step
│       ├── SignUpStep4.tsx         # Documents step
│       ├── SignUpStep5.tsx         # Finish step
│       └── AadhaarModal.tsx        # Aadhaar upload/scan modal
├── lib/
│   ├── api.ts                      # API placeholder functions
│   └── aadhaar-utils.ts            # Aadhaar QR decode & encryption
└── contexts/
    └── LanguageContext.tsx         # Language management
```

## API Integration

### Current Status

All API calls are **placeholder functions** with mock responses. They are located in `src/lib/api.ts`.

### Connecting to FastAPI Backend

1. **Set API Base URL**

   Create a `.env` file in the project root:
   ```env
   VITE_API_BASE_URL=https://your-api-domain.com
   ```

2. **Update API Functions**

   In `src/lib/api.ts`, uncomment the actual fetch calls and comment out the mock responses.

   Example:
   ```typescript
   export const registerUser = async (data: {...}) => {
     // Remove mock delay and response
     // await mockDelay(800);
     
     // Uncomment actual API call
     const response = await fetch(`${API_BASE_URL}/auth/register`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data)
     });
     
     if (!response.ok) {
       throw new Error('Registration failed');
     }
     
     return await response.json();
   };
   ```

3. **API Endpoints Required**

   The following endpoints need to be implemented in your FastAPI backend:

   **Auth Endpoints:**
   - `POST /auth/register` - Register new user
   - `POST /auth/verify-email` - Verify email OTP
   - `POST /auth/set-role` - Set user role
   - `POST /auth/login` - User login
   - `POST /auth/forgot-password` - Request password reset

   **Verification Endpoints:**
   - `POST /verification/aadhaar` - Upload encrypted Aadhaar
   - `POST /verification/upload` - Upload document (form-data)
   - `POST /verification/fpo` - Submit FPO verification
   - `POST /verification/business` - Submit business docs
   - `GET /verification/status?user_id=` - Get verification status

   **User Endpoints:**
   - `GET /users/{user_id}/profile` - Get user profile

   **Admin Endpoints (Future):**
   - `POST /admin/verification/approve` - Approve verification

### Request/Response Formats

See `src/lib/api.ts` for detailed request/response formats for each endpoint.

## Design Tokens

All design tokens are defined in `src/index.css`:

- **Colors:**
  - Millet Yellow: `#FFFD8F`
  - Sage Green: `#B0CE88`
  - Forest Green: `#4C763B`
  - Dark Earth: `#043915`
  - Soft BG: `#FAF7F0`

- **Typography:**
  - Headings: Inter
  - Body: Noto Sans
  - Hindi: Noto Sans Devanagari

- **Corner Radius:** 12px
- **Shadow:** `0 6px 18px rgba(4, 57, 21, 0.08)`
- **Animations:** ease-out-quint, durations: 180ms/360ms/600ms

## Security Notes

### Aadhaar Handling

1. **Local Encryption:** Aadhaar data is encrypted client-side using Web Crypto API (AES-GCM)
2. **No Plain Text Storage:** Platform does not store full Aadhaar numbers in plain text
3. **Encrypted Transmission:** Only encrypted payload is sent to server
4. **User Download:** Users can download their extracted JSON locally

### Password Security

- Strong password requirements enforced client-side
- Passwords are hashed server-side (backend responsibility)
- Never log or display passwords

## Testing

### Mock Mode

Currently, all API calls return mock responses with simulated delays. This allows frontend development and testing without a backend.

### Test User Flow

1. Navigate to `/auth`
2. Click "Sign Up"
3. Complete all 5 steps
4. Test role selection and conditional fields
5. Test Aadhaar upload and QR decode
6. Test document uploads
7. Verify verification pending screen

## Known Limitations

1. **Webcam Scanning:** Aadhaar webcam scan feature is placeholder (shows "coming soon")
2. **OTP Generation:** Email/Phone OTPs are not actually sent (mock responses)
3. **File Upload:** Documents are uploaded but not actually stored (mock upload_id returned)
4. **Dashboard:** Dashboard route (`/dashboard`) is placeholder

## Next Steps

1. **Backend Integration:**
   - Implement FastAPI endpoints
   - Set up database for user storage
   - Implement OTP generation and verification
   - Set up file storage for documents

2. **Enhancements:**
   - Add webcam support for Aadhaar scanning
   - Implement real-time OTP input
   - Add document preview before upload
   - Create admin dashboard for verification approval

3. **Testing:**
   - Add unit tests for validation functions
   - Add integration tests for API calls
   - Add E2E tests for complete signup flow

## Support

For questions or issues, contact: harshagnani7@gmail.com

