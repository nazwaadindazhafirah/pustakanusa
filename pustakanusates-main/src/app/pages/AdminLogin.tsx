import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ChevronRight, ArrowLeft, Shield, AlertCircle, X, UserX } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";
import libraryBg from "../../imports/LibraryBackground.jpg";

const BG_IMAGE = libraryBg;

// Dummy admin accounts
const ADMIN_ACCOUNTS = [
  { username: "admin", password: "admin123", name: "Administrator" },
  { username: "pustaka", password: "pustaka2026", name: "Petugas Perpustakaan" },
];

export function AdminLogin() {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState(""); // State A: wrong password
  const [showNotFoundModal, setShowNotFoundModal] = useState(false); // State B: not registered

  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const pageBg = isDark ? "#0F172A" : "#F0F4FF";

  const handleLogin = async () => {
    setInlineError("");
    if (!username.trim() || !password.trim()) {
      setInlineError("Username dan Password tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        nim: username.trim(), // API AuthController mengecek nim dan nidn (di AuthController kita ubah nanti atau fallback ke nidn)
        nidn: username.trim(),
        password: password.trim(),
      });

      if (res.data.success) {
        const foundAdmin = res.data.data;
        if (foundAdmin.role !== 'admin') {
          setInlineError("Akses ditolak. Silakan login dari portal mahasiswa.");
          return;
        }

        login({ name: foundAdmin.name, nimNidn: username, role: "admin" });
        navigate("/admin");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setInlineError("Password salah atau akun tidak ditemukan.");
      } else {
        setShowNotFoundModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: pageBg }}
    >
      {/* ── LEFT SIDE: Visual Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden">
        {/* Background: library image always visible, overlay adapts to theme */}
        {/* Light: dark navy-blue gradient overlay | Dark: deep navy overlay 86% */}
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG_IMAGE})` }} />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "rgba(8, 16, 38, 0.86)"
                : "linear-gradient(160deg, rgba(15,23,42,0.92) 0%, rgba(30,58,95,0.85) 55%, rgba(120,157,252,0.65) 100%)",
            }}
          />
        </>
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{
              backgroundColor: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
            }}
          >
            <img src={logo} alt="Pustaka Nusa" className="object-contain" style={{ width: "52px", height: "52px" }} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5" style={{ color: "#789DFC" }} />
            <span className="text-sm" style={{ color: "#789DFC", fontWeight: 600 }}>Panel Pengelola</span>
          </div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl text-white" style={{ fontWeight: 800 }}>Pustaka</span>
            <span className="text-2xl" style={{ color: "#789DFC", fontWeight: 800 }}>Nusa</span>
          </div>

          <div className="w-12 h-px mb-8" style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />

          <blockquote className="text-center">
            <p
              className="text-white mb-5"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                fontWeight: 500,
                lineHeight: 1.85,
                fontStyle: "italic",
              }}
            >
              "Ilmu pengetahuan tumbuh dari rasa ingin tahu yang dipelihara melalui membaca."
            </p>
            <footer>
              <span className="text-sm" style={{ color: "rgba(217,227,252,0.75)", fontWeight: 500 }}>
                — Pustaka Nusa, STITEK Bontang
              </span>
            </footer>
          </blockquote>

          <div
            className="mt-12 px-4 py-2 rounded-full text-xs"
            style={{
              backgroundColor: "rgba(120,157,252,0.15)",
              border: "1px solid rgba(120,157,252,0.3)",
              color: "#789DFC",
            }}
          >
            Akses Khusus Pengelola Sistem
          </div>

          {/* Demo credentials */}
          <div
            className="mt-6 px-4 py-3 rounded-2xl text-left w-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(120,157,252,0.2)",
            }}
          >
            <p className="text-xs mb-1 font-semibold" style={{ color: "rgba(120,157,252,0.9)" }}>Akun Demo Admin:</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
              User: <span className="font-mono font-bold text-white">admin</span> / Pass: <span className="font-mono font-bold text-white">admin123</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: Form Panel ── */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: pageBg }}>
        {/* Top bar — no notification icons */}
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm hover:text-[#789DFC] transition-colors"
            style={{ color: textMuted }}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <ThemeToggle size="sm" />
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <div
              className="rounded-3xl p-8 md:p-10"
              style={{
                backgroundColor: surface,
                boxShadow: isDark
                  ? "0 24px 80px rgba(0,0,0,0.5)"
                  : "0 24px 80px rgba(120,157,252,0.12)",
                border: `1px solid ${borderColor}`,
              }}
            >
              {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-2 mb-6">
                <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
                <span style={{ color: textPrimary, fontWeight: 700 }}>
                  Pustaka<span style={{ color: "#789DFC" }}>Nusa</span>
                </span>
              </div>

              {/* Security badge */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs mb-6 w-fit"
                style={{
                  backgroundColor: isDark ? "rgba(120,157,252,0.1)" : "rgba(120,157,252,0.08)",
                  color: "#789DFC",
                  border: "1px solid rgba(120,157,252,0.25)",
                }}
              >
                <Shield className="w-3.5 h-3.5" />
                Akses Terbatas — Pengelola Sistem
              </div>

              <h1
                className="mb-2"
                style={{
                  color: textPrimary,
                  fontWeight: 800,
                  fontSize: "1.6rem",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                }}
              >
                Selamat Datang
              </h1>
              <h2
                className="mb-1"
                style={{ color: "#789DFC", fontWeight: 800, fontSize: "1.1rem" }}
              >
                Pengelola
              </h2>
              <p className="text-sm mb-8" style={{ color: textMuted, lineHeight: 1.6 }}>
                Masuk dengan kredensial admin Anda untuk mengelola perpustakaan digital.
              </p>

              {/* State A: Inline error (wrong password) */}
              {inlineError && (
                <div
                  className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm mb-5"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.06)",
                    color: "#EF4444",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{inlineError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: textMuted }}>Username</label>
                  <input
                    type="text"
                    placeholder="Masukkan username admin"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setInlineError(""); }}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#789DFC]/25"
                    style={{
                      backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                      border: `1.5px solid ${inlineError ? "rgba(239,68,68,0.5)" : borderColor}`,
                      color: textPrimary,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: textMuted }}>Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Masukkan password admin"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setInlineError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#789DFC]/25 pr-12"
                      style={{
                        backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                        border: `1.5px solid ${inlineError ? "rgba(239,68,68,0.5)" : borderColor}`,
                        color: textPrimary,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-[#789DFC]"
                      style={{ color: textMuted }}
                    >
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading || !username.trim() || !password.trim()}
                  className="w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed mt-2"
                  style={{
                    background: "linear-gradient(135deg, #789DFC, #4475F2)",
                    fontWeight: 700,
                    boxShadow: "0 4px 18px rgba(120,157,252,0.30)",
                  }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Masuk ke Panel Admin
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs pt-1" style={{ color: textMuted }}>
                  Akses terbatas — hanya untuk pengelola sistem
                </p>
              </div>
            </div>

            <p className="text-center text-sm mt-5" style={{ color: textMuted }}>
              Mahasiswa atau dosen?{" "}
              <button
                onClick={() => navigate("/login")}
                className="hover:underline"
                style={{ color: "#4475F2", fontWeight: 600 }}
              >
                Portal Mahasiswa/Dosen
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ── State B: Account Not Found Modal ── */}
      {showNotFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-sm rounded-3xl p-8 relative"
            style={{
              backgroundColor: surface,
              border: `1px solid ${borderColor}`,
              boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
            }}
          >
            <button
              onClick={() => setShowNotFoundModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors"
              style={{ color: textMuted }}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
              >
                <UserX className="w-8 h-8 text-red-500" />
              </div>
              <h3
                className="mb-3"
                style={{ color: textPrimary, fontWeight: 800, fontSize: "1.2rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Akun Tidak Ditemukan
              </h3>
              <p className="text-sm mb-6" style={{ color: textMuted, lineHeight: 1.75 }}>
                Akun belum terdaftar. Silakan hubungi Petugas Perpustakaan untuk pendaftaran akun.
              </p>
              <button
                onClick={() => setShowNotFoundModal(false)}
                className="w-full py-3 rounded-xl text-white text-sm hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #789DFC, #4475F2)", fontWeight: 700 }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}