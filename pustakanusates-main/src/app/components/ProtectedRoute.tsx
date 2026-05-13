import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

/**
 * UserRoute — hanya bisa diakses oleh user yang sudah login (bukan admin).
 * Jika belum login → redirect ke /login
 * Jika admin → redirect ke /admin
 */
export function UserRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

/**
 * AdminRoute — hanya bisa diakses oleh admin yang sudah login.
 * Jika belum login → redirect ke /login/admin
 * Jika bukan admin → redirect ke /dashboard
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login/admin" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
