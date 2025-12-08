/**
 * API Placeholder Functions for KrishiNetra Auth & Verification
 * 
 * To connect to FastAPI backend:
 * 1. Set API_BASE_URL in .env or config
 * 2. Replace mock responses with actual fetch calls
 * 3. Update error handling for real API responses
 */

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
import { API_BASE_URL } from "@/config/api";

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
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",     // ⬅ REQUIRED so HttpOnly cookies are saved
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Login failed");
  }

  return response.json(); // backend returns user info, NOT token
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

export type ProductListItem = {
  id: number;
  name: string;
  price: number | string;
  quantity: number;
  thumbnail?: string | null;
  created_at: string;
};

export type ProductListResponse = {
  products: ProductListItem[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductDetail = {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  quantity: number;
  images?: string[] | null;
  thumbnail?: string | null;
  miscellaneous_data?: Record<string, any> | null;
  seller_id: number;
  created_at: string;
  updated_at: string;
};

type ProductQueryParams = {
  skip?: number;
  limit?: number;
  min_price?: number;
  max_price?: number;
  seller_id?: number;
  search?: string;
  in_stock?: boolean;
};

export const fetchProducts = async (params?: ProductQueryParams): Promise<ProductListResponse> => {
  const url = new URL(`${API_BASE_URL}/products/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  const response = await fetch(url.toString(), {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export type ProductCreatePayload = {
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  images?: string[] | null;
  thumbnail?: string | null;
  miscellaneous_data?: Record<string, any> | null;
};

export type ProductResponse = {
  message: string;
  product: ProductDetail;
};

export const createProduct = async (payload: ProductCreatePayload): Promise<ProductResponse> => {
  const response = await fetch(`${API_BASE_URL}/products/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to create product');
  }

  return response.json();
};

export const fetchMyProducts = async (
  skip: number = 0,
  limit: number = 100,
): Promise<ProductListResponse> => {
  const url = new URL(`${API_BASE_URL}/products/my/products`);
  url.searchParams.set('skip', String(skip));
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url.toString(), {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch my products');
  }
  return response.json();
};

export const searchProducts = async (q: string, skip: number = 0, limit: number = 100): Promise<ProductListResponse> => {
  const url = new URL(`${API_BASE_URL}/products/search`);
  url.searchParams.set('q', q);
  url.searchParams.set('skip', String(skip));
  url.searchParams.set('limit', String(limit));
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to search products');
  }
  return response.json();
};

export const fetchProductDetail = async (productId: number): Promise<ProductDetail> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch product detail');
  }
  return response.json();
};

export const checkProductAvailability = async (
  productId: number,
  quantity: number,
): Promise<{ available: boolean; message: string }> => {
  const url = new URL(`${API_BASE_URL}/products/${productId}/availability`);
  url.searchParams.set('quantity', String(quantity));
  const response = await fetch(url.toString(), {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to check product availability');
  }
  return response.json();
};
// ==================== CART & ORDERS ====================

export type CartProduct = {
  id: number;
  name: string;
  price: number | string;
  thumbnail?: string | null;
  quantity: number;
};

export type CartItemDetail = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  product: CartProduct;
};

export type CartSummary = {
  items: CartItemDetail[];
  total_items: number;
  subtotal: number | string;
  total: number | string;
};

export type CartResponse = {
  message: string;
  cart: CartSummary;
};

export type CartItemCreatePayload = {
  product_id: number;
  quantity: number;
};

export type CartItemUpdatePayload = {
  quantity: number;
};

export type CartItemResponse = {
  message: string;
  cart_item: CartItemDetail;
};

export const fetchCart = async (): Promise<CartResponse> => {
  const response = await fetch(`${API_BASE_URL}/cart/`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

export const addToCartApi = async (payload: CartItemCreatePayload): Promise<CartItemResponse> => {
  const response = await fetch(`${API_BASE_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to add to cart');
  }
  return response.json();
};

export const updateCartItemApi = async (
  cartItemId: number,
  payload: CartItemUpdatePayload,
): Promise<CartItemResponse> => {
  const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to update cart item');
  }
  return response.json();
};

export const removeCartItemApi = async (cartItemId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to remove cart item');
  }
};

export const clearCartApi = async (): Promise<{ message: string; items_removed: number }> => {
  const response = await fetch(`${API_BASE_URL}/cart/clear`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to clear cart');
  }
  return response.json();
};

export const fetchCartCount = async (): Promise<{ count: number }> => {
  const response = await fetch(`${API_BASE_URL}/cart/count`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart count');
  }
  return response.json();
};

export const validateCartApi = async (): Promise<{ valid: boolean; message: string; errors?: string[] }> => {
  const response = await fetch(`${API_BASE_URL}/cart/validate`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to validate cart');
  }
  return response.json();
};

export type OrderItemDetail = {
  id: number;
  order_id: number;
  product_id: number;
  seller_id: number;
  product_name: string;
  product_price: number | string;
  quantity: number;
  subtotal: number | string;
};

export type OrderDetail = {
  id: number;
  user_id: number;
  status: string;
  subtotal: number | string;
  tax: number | string;
  shipping_fee: number | string;
  total: number | string;
  shipping_address: string;
  shipping_phone: string;
  payment_method?: string | null;
  payment_transaction_id?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  paid_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  order_items: OrderItemDetail[];
};

export type OrderListResponse = {
  orders: OrderDetail[];
  total: number;
  skip: number;
  limit: number;
};

export type OrderCreatePayload = {
  shipping_address: string;
  shipping_phone: string;
  payment_method?: string | null;
  notes?: string | null;
};

export type OrderResponse = {
  message: string;
  order: OrderDetail;
};

export const checkoutOrder = async (payload: OrderCreatePayload): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to checkout');
  }
  return response.json();
};

export const fetchMyOrders = async (
  skip: number = 0,
  limit: number = 100,
): Promise<OrderListResponse> => {
  const url = new URL(`${API_BASE_URL}/orders/my-orders`);
  url.searchParams.set('skip', String(skip));
  url.searchParams.set('limit', String(limit));
  const response = await fetch(url.toString(), {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

export const cancelOrderApi = async (orderId: number): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to cancel order');
  }
  return response.json();
};

// ==================== AUCTIONS ====================

export type AuctionStatusString = 'LIVE' | 'UPCOMING' | 'CLOSED';

export type AuctionDetail = {
  id: number;
  name: string;
  description?: string | null;
  quantity: number | string;
  base_price: number | string;
  start_time: string;
  end_time: string;
  final_price?: number | string | null;
  winner_id?: number | null;
  seller_id: number;
  images?: string[] | null;
  thumbnail?: string | null;
  miscellaneous_data?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
};

export type AuctionWithBids = AuctionDetail & {
  current_highest_bid: number | string | null;
  total_bids: number;
  is_active?: boolean;
};

export type AuctionStatusResponse = {
  auction_id: number;
  is_active: boolean;
  current_highest_bid: number | string | null;
  highest_bidder_id: number | null;
  total_bids: number;
  time_remaining: number | null;
};

type AuctionListKind = 'all' | 'active' | 'upcoming' | 'completed';

export const fetchAuctions = async (
  kind: AuctionListKind = 'all',
  skip: number = 0,
  limit: number = 100,
): Promise<AuctionDetail[] | AuctionWithBids[]> => {
  let path = '/auctions/';
  if (kind === 'active') path = '/auctions/active';
  else if (kind === 'upcoming') path = '/auctions/upcoming';
  else if (kind === 'completed') path = '/auctions/completed';

  const url = new URL(`${API_BASE_URL}${path}`);
  url.searchParams.set('skip', String(skip));
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url.toString(), {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch auctions');
  }
  return response.json();
};

export const fetchMyAuctions = async (
  skip: number = 0,
  limit: number = 100,
): Promise<AuctionDetail[]> => {
  const url = new URL(`${API_BASE_URL}/auctions/my-auctions`);
  url.searchParams.set('skip', String(skip));
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url.toString(), {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch my auctions');
  }
  return response.json();
};

export const fetchAuctionStatus = async (auctionId: number): Promise<AuctionStatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}/status`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch auction status');
  }
  return response.json();
};

export const createAuctionWithImages = async (params: {
  name: string;
  description?: string;
  quantity: number;
  base_price: number;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  miscellaneous_data?: Record<string, any>;
  images?: File[];
}): Promise<{ message: string; auction: AuctionDetail }> => {
  const formData = new FormData();
  formData.append('name', params.name);
  if (params.description) formData.append('description', params.description);
  formData.append('quantity', String(params.quantity));
  formData.append('base_price', String(params.base_price));
  formData.append('start_time', params.start_time);
  formData.append('end_time', params.end_time);
  if (params.miscellaneous_data) {
    formData.append('miscellaneous_data', JSON.stringify(params.miscellaneous_data));
  }
  if (params.images && params.images.length) {
    params.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/auctions/with-images`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to create auction');
  }

  return response.json();
};

export const fetchAuctionById = async (auctionId: number): Promise<AuctionWithBids> => {
  const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch auction');
  }
  return response.json();
};

export const deleteAuction = async (auctionId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete auction');
  }
};

