"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "./api";

interface AuthContextType {
  isAuthenticated: boolean;
  initialized: boolean;
  link: (code: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  async function link(code: string) {
    // take code and login user
    const res = await api.loginOTP(code);
    if (res.success) {
      setIsAuthenticated(true);
    } else {
      alert(res.error);
    }
  }

  useEffect(() => {
    // check if user is authenticated
    api.getUserInfo().then((res) => {
      if (res.success) {
        setIsAuthenticated(true);
      }
      setInitialized(true);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, initialized, link }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
