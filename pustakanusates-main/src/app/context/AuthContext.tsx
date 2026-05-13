import React, { createContext, useContext, useState } from "react";

export interface UserSession {
  name: string;
  nimNidn: string;
  role: "mahasiswa" | "dosen" | "admin";
  avatar?: string;
}

interface AuthContextType {
  user: UserSession | null;
  login: (user: UserSession) => void;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
}

const AUTH_KEY = "pustaka_nusa_session";

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updatePassword: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? (JSON.parse(stored) as UserSession) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: UserSession) => {
    setUser(userData);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  };

  const updatePassword = (_newPassword: string) => {
    // In a real app, this would call an API
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
