import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

type UserRole = "admin" | "consumer" | "seller" | "fpo";

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
  if (r === "BUSINESS") return "seller";
  if (r === "ADMIN") return "admin";
  throw new Error(`Unknown backend role: ${role}`);
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const normalizeUser = (raw: any): User => ({
    id: raw.id,
    email: raw.email,
    name: raw.name,
    role: mapBackendRole(raw.role),
    email_verified: raw.is_authenticated,
    verification_status: raw.is_active ? "verified" : "pending",
  });

  /** 🔥 Restore session from cookies on refresh */
  useEffect(() => {
    const restore = async () => {
      try {
        const res = await fetch(`${API_BASE}/profiles/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not logged in");
        const profile = await res.json();
        setUser(normalizeUser(profile));
      } catch {
        setUser(null);
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
      const userId = loginData.user_id;

      // Fetch updated role from DB
      const profileRes = await fetch(`${API_BASE}/users/${userId}`, {
        credentials: "include",
      });
      const profile = await profileRes.json();
      const normalized = normalizeUser(profile);

      setUser(normalized);

      // Route by role
      const r = normalized.role;
      if (r === "consumer") navigate("/dashboard/consumer", { replace: true });
      else if (r === "seller") navigate("/dashboard/seller", { replace: true });
      else if (r === "fpo") navigate("/dashboard/fpo", { replace: true });
      else if (r === "admin") navigate("/dashboard/admin", { replace: true });

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
    navigate("/signin", { replace: true });
  };

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
