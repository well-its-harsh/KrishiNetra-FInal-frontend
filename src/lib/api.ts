/**
 * API Placeholder Functions for KrishiNetra Auth & Verification
 * 
 * To connect to FastAPI backend:
 * 1. Set API_BASE_URL in .env or config
 * 2. Replace mock responses with actual fetch calls
 * 3. Update error handling for real API responses
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.krishinetra.in';

// Mock delay to simulate API calls
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== AUTH ENDPOINTS ====================

/**
 * POST /auth/register
 * Register a new user
 */
export const registerUser = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  await mockDelay(800);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/register`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return await response.json();
  
  // Mock response
  return {
    user_id: `user_${Date.now()}`,
    email: data.email,
    email_verified: false,
    message: 'Registration successful. Please verify your email.'
  };
};

/**
 * POST /auth/verify-email
 * Verify email with OTP
 */
export const verifyEmail = async (data: {
  user_id: string;
  otp: string;
}) => {
  await mockDelay(600);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return await response.json();
  
  return {
    verified: true,
    message: 'Email verified successfully'
  };
};

/**
 * POST /auth/set-role
 * Set user role and seller type
 */
export const setUserRole = async (data: {
  user_id: string;
  role: 'admin' | 'consumer' | 'seller' | 'fpo';
  seller_type?: 'farmer' | 'shg' | 'processor' | 'startup' | 'retailer';
}) => {
  await mockDelay(500);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/set-role`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return await response.json();
  
  return {
    success: true,
    role: data.role,
    seller_type: data.seller_type || null
  };
};

/**
 * POST /auth/login
 * Login user
 */
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  await mockDelay(700);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return await response.json();
  
  // Mock response
  return {
    token: `mock_token_${Date.now()}`,
    user_id: 'user_123',
    role: 'consumer',
    email_verified: true,
    verification_status: 'pending'
  };
};

/**
 * POST /auth/forgot-password
 * Request password reset
 */
export const forgotPassword = async (data: { email: string }) => {
  await mockDelay(500);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return await response.json();
  
  return {
    message: 'Password reset link sent to your email'
  };
};

// ==================== VERIFICATION ENDPOINTS ====================

/**
 * POST /verification/aadhaar
 * Upload encrypted Aadhaar payload
 */
export const uploadAadhaar = async (data: {
  user_id: string;
  aadhaar_payload_encrypted: string;
}) => {
  await mockDelay(1000);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/verification/aadhaar`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return await response.json();
  
  return {
    upload_id: `aadhaar_${Date.now()}`,
    status: 'uploaded',
    message: 'Aadhaar verification submitted'
  };
};

/**
 * POST /verification/upload
 * Upload document (form-data)
 */
export const uploadDocument = async (data: {
  user_id: string;
  doc_type: string;
  file: File;
}) => {
  await mockDelay(1200);
  
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('user_id', data.user_id);
  // formData.append('doc_type', data.doc_type);
  // formData.append('file', data.file);
  // 
  // const response = await fetch(`${API_BASE_URL}/verification/upload`, {
  //   method: 'POST',
  //   body: formData
  // });
  // return await response.json();
  
  return {
    upload_id: `doc_${Date.now()}`,
    status: 'uploaded',
    file_name: data.file.name
  };
};

/**
 * POST /verification/fpo
 * Submit FPO verification documents
 */
export const submitFPOVerification = async (data: {
  user_id: string;
  fpo_registration_number: string;
  upload_ids: string[];
}) => {
  await mockDelay(800);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/verification/fpo`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return await response.json();
  
  return {
    verification_id: `fpo_${Date.now()}`,
    status: 'submitted',
    message: 'FPO verification submitted for review'
  };
};

/**
 * POST /verification/business
 * Submit business documents (GST, FSSAI)
 */
export const submitBusinessVerification = async (data: {
  user_id: string;
  gst?: string;
  fssai?: string;
  upload_ids: string[];
}) => {
  await mockDelay(800);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/verification/business`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return await response.json();
  
  return {
    verification_id: `business_${Date.now()}`,
    status: 'submitted'
  };
};

/**
 * GET /verification/status?user_id=
 * Get verification status
 */
export const getVerificationStatus = async (user_id: string) => {
  await mockDelay(500);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/verification/status?user_id=${user_id}`);
  // return await response.json();
  
  return {
    user_id,
    email_verified: true,
    aadhaar_verified: false,
    documents_verified: false,
    overall_status: 'pending',
    submitted_at: new Date().toISOString()
  };
};

// ==================== USER PROFILE ====================

/**
 * GET /users/{user_id}/profile
 * Get user profile
 */
export const getUserProfile = async (user_id: string) => {
  await mockDelay(500);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/users/${user_id}/profile`);
  // return await response.json();
  
  return {
    user_id,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    role: 'seller',
    seller_type: 'farmer',
    verification_status: 'pending',
    badges: []
  };
};

