"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  employeeId?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; role?: "admin" | "user" }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("proums_user");
    const token = localStorage.getItem("proums_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
  };

  const removeCookie = (name: string) => {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) return { success: false };

      const newUser: User = {
        id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        employeeId: data.user.employeeId || null,
      };

      localStorage.setItem("proums_token", data.token);
      localStorage.setItem("proums_user", JSON.stringify(newUser));

      setCookie("proums_token", data.token);
      setCookie("proums_role", newUser.role);

      setUser(newUser);
      return { success: true, role: newUser.role };
    } catch {
      return { success: false };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!data.success) return false;

      const newUser: User = {
        id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        employeeId: data.user.employeeId || null,
      };

      localStorage.setItem("proums_token", data.token);
      localStorage.setItem("proums_user", JSON.stringify(newUser));

      setCookie("proums_token", data.token);
      setCookie("proums_role", newUser.role);

      setUser(newUser);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("proums_token");
    localStorage.removeItem("proums_user");

    removeCookie("proums_token");
    removeCookie("proums_role");

    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
