import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { UserLogin } from "./pages/UserLogin";
import { AdminLogin } from "./pages/AdminLogin";
import { UserDashboard } from "./pages/UserDashboard";
import { BookDetail } from "./pages/BookDetail";
import { AdminDashboard } from "./pages/AdminDashboard";
import { SaranBuku } from "./pages/SaranBuku";
import { ProfilUser } from "./pages/ProfilUser";
import { Favorit } from "./pages/Favorit";
import { RiwayatUnduhan } from "./pages/RiwayatUnduhan";
import { LogAktivitas } from "./pages/LogAktivitas";
import { NotFound } from "./pages/NotFound";
import { UserRoute, AdminRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  // Public routes
  { path: "/", Component: LandingPage },
  { path: "/login", Component: UserLogin },
  { path: "/login/admin", Component: AdminLogin },

  // User-only routes
  {
    path: "/dashboard",
    element: <UserRoute><UserDashboard /></UserRoute>,
  },
  {
    path: "/book/:id",
    element: <UserRoute><BookDetail /></UserRoute>,
  },
  {
    path: "/favorit",
    element: <UserRoute><Favorit /></UserRoute>,
  },
  {
    path: "/riwayat",
    element: <UserRoute><RiwayatUnduhan /></UserRoute>,
  },
  {
    path: "/log-saya",
    element: <UserRoute><LogAktivitas /></UserRoute>,
  },
  {
    path: "/saran-buku",
    element: <UserRoute><SaranBuku /></UserRoute>,
  },
  {
    path: "/profil",
    element: <UserRoute><ProfilUser /></UserRoute>,
  },

  // Admin-only routes
  {
    path: "/admin",
    element: <AdminRoute><AdminDashboard /></AdminRoute>,
  },

  // 404 catch-all
  { path: "*", Component: NotFound },
]);
