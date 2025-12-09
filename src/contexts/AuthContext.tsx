import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "@/config/api";

type UserRole = "admin" | "consumer" | "seller" | "fpo" | "institution" | "transporter";

interface User {
  id: number;
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
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const mapBackendRole = (role: string): UserRole => {
  const r = role.trim().toUpperCase();
  if (r === "CONSUMER") return "consumer";
  if (r === "FPO") return "fpo";
  if (r === "BUSINESS" || r === "SELLER") return "seller";
  if (r === "INSTITUTION") return "institution";
  if (r === "TRANSPORTER") return "transporter";
  if (r === "ADMIN") return "admin";
  console.warn("Unknown backend role:", r);
  return "consumer"; // safe fallback to avoid app crash
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeUser = (raw: any): User => ({
  id: raw.id,
  email: raw.email,
  name: raw.name,
  role: mapBackendRole(raw.role),

  // Correct mappings
  email_verified: raw.is_authenticated,          // whether user verified email/login
  verification_status: raw.is_active
    ? "verified"
    : raw.is_authenticated
    ? "pending"
    : "rejected",
});


  /** 🔥 Restore session from backend + sync with localStorage */
  useEffect(() => {
  const restore = async () => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const raw = await res.json();
      const normalized = normalizeUser(raw);
      setUser(normalized);
      localStorage.setItem("user", JSON.stringify(normalized));
    } catch {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
    } finally {
      setLoading(false);
    }
  };

  restore();
}, []);


  /** 🔥 Login */
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) throw new Error("Invalid credentials");
      const loginData = await loginRes.json();

      const profileRes = await fetch(`${API_BASE}/users/${loginData.user_id}`, {
        credentials: "include",
      });
      const profile = await profileRes.json();
      const normalized = normalizeUser(profile);

      setUser(normalized);
      localStorage.setItem("user", JSON.stringify(normalized));

      const from = (location.state as any)?.from?.pathname;
      if (from) return navigate(from, { replace: true });

      if (normalized.role === "consumer") navigate("/dashboard/consumer", { replace: true });
      else if (normalized.role === "seller") navigate("/dashboard/seller", { replace: true });
      else if (normalized.role === "fpo") navigate("/dashboard/fpo", { replace: true });
      else if (normalized.role === "institution") navigate("/dashboard/institution", { replace: true });
      else if (normalized.role === "transporter") navigate("/dashboard/transporter", { replace: true });
      else navigate("/dashboard/admin", { replace: true });

    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /** 🔥 Logout */
  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    navigate("/signin", { replace: true });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg font-semibold">
        Loading session...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
