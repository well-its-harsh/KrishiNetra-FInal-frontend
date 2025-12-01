import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

type UserRole = "admin" | "consumer" | "seller" | "fpo";

interface User {
  id: string | number;
  email: string;
  name?: string;
  role: UserRole;
  email_verified: boolean;
  verification_status: "pending" | "verified" | "rejected";
}

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
export const mapBackendRole = (role: string): UserRole => {
    const r = role.trim().toUpperCase();
    if (r === "CONSUMER") return "consumer";
    if (r === "FPO") return "fpo";
    if (r === "BUSINESS") return "seller"; // backend BUSINESS = seller dashboard
    if (r === "ADMIN") return "admin";
    throw new Error(`Unknown backend role: ${role}`);
  };
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /** 🔥 BACKEND ROLE → FRONTEND ROLE */
  

  /** 🔥 Normalize backend structure to UI structure */
  const normalizeUser = (raw: any): User => ({
    id: raw.id,
    email: raw.email,
    name: raw.name,
    role: mapBackendRole(raw.role),
    email_verified: raw.is_authenticated,
    verification_status: raw.is_active ? "verified" : "pending",
  });

  /** 🔥 Auto-login on page refresh */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/verify`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Session expired");

        const data = await res.json(); // backend must now send { user: {...} }
        setUser(normalizeUser(data.user));
      } catch {
        localStorage.removeItem("authToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  /** 🔥 Login */
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json(); // must include { token, user }
      localStorage.setItem("authToken", data.token);

      const normalized = normalizeUser(data.user);
      setUser(normalized);

      // Redirect immediately
      const role = normalized.role;
      if (role === "consumer") navigate("/dashboard/consumer", { replace: true });
      else if (role === "seller" || role === "fpo") navigate("/dashboard/seller", { replace: true });
      else if (role === "admin") navigate("/dashboard/admin", { replace: true });
      else navigate("/", { replace: true });

    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your email/password.");
    } finally {
      setLoading(false);
    }
  };

  /** 🔥 Logout */
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/auth", { replace: true });
  };

  const value: AuthContextType = {
    user,
    setUser, // required for Step-5 signup autofill
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
