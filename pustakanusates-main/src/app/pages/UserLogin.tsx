import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ChevronRight, ArrowLeft, AlertCircle, X, UserX } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";
import libraryBg from "../../imports/LibraryBackground.jpg";

const BG_IMAGE = libraryBg;

// Dummy registered accounts
const DUMMY_USERS = [
  { nimNidn: "20210001", password: "user123", name: "Ahmad Fauzi", role: "mahasiswa" as const, status: true },
  { nimNidn: "20210045", password: "siti456", name: "Siti Aminah", role: "mahasiswa" as const, status: true },
  { nimNidn: "20220112", password: "rizky321", name: "Rizky Maulana", role: "mahasiswa" as const, status: false },
  { nimNidn: "NIDN-0023456", password: "hendra789", name: "Dr. Hendra Putra", role: "dosen" as const, status: true },
  { nimNidn: "NIDN-0078901", password: "maya654", name: "Prof. Maya Indah", role: "dosen" as const, status: true },
];

export function UserLogin() {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nimNidn, setNimNidn] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState(""); // State A: wrong password
  const [showNotFoundModal, setShowNotFoundModal] = useState(false); // State B: not registered
  const [showInactiveAlert, setShowInactiveAlert] = useState(false); // State C: account inactive

  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const pageBg = isDark ? "#0F172A" : "#F0F4FF";

  const handleLogin = async () => {
    setInlineError("");
    setShowInactiveAlert(false);
    if (!nimNidn.trim() || !password.trim()) {
      setInlineError("NIM/NIDN dan Password tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        nim: nimNidn.trim(),
        password: password.trim(),
      });

      if (res.data.success) {
        const foundUser = res.data.data;
        if (foundUser.role !== 'user') {
          setInlineError("Akses ditolak. Silakan login dari portal admin.");
          return;
        }

        login({ name: foundUser.name, nimNidn: foundUser.nim, role: "mahasiswa" });
        navigate("/dashboard");
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
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Background: library image always visible, overlay adapts to theme */}
        {/* Light: blue-gradient overlay | Dark: deep navy overlay 85% */}
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG_IMAGE})` }} />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "rgba(8, 16, 38, 0.85)"
                : "linear-gradient(160deg, rgba(20,36,100,0.88) 0%, rgba(68,117,242,0.80) 60%, rgba(120,157,252,0.60) 100%)",
            }}
          />
        </>
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <img src={logo} alt="Pustaka Nusa" style={{ width: "52px", height: "52px", objectFit: "contain" }} />
          </div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl text-white" style={{ fontWeight: 800 }}>Pustaka</span>
            <span className="text-2xl" style={{ color: "#D9E3FC", fontWeight: 800 }}>Nusa</span>
          </div>

          <div className="w-12 h-px mb-8" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />

          <blockquote className="text-center">
            <p
              className="text-white mb-5"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                fontWeight: 500,
                lineHeight: 1.85,
                fontStyle: "italic",
              }}
            >
              "Ilmu pengetahuan tumbuh dari rasa ingin tahu yang dipelihara melalui membaca."
            </p>
            <footer>
              <span className="text-sm" style={{ color: "rgba(217,227,252,0.8)", fontWeight: 500 }}>
                — Pustaka Nusa, STITEK Bontang
              </span>
            </footer>
          </blockquote>

          <div
            className="mt-12 px-4 py-2 rounded-full text-xs"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Portal Mahasiswa &amp; Dosen
          </div>

          {/* Demo credentials hint */}
          <div
            className="mt-6 px-4 py-3 rounded-2xl text-left w-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <p className="text-xs mb-2 font-semibold" style={{ color: "rgba(217,227,252,0.9)" }}>Akun Demo:</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
              NIM: <span className="font-mono font-bold text-white">20210001</span> / Pass: <span className="font-mono font-bold text-white">user123</span><br />
              NIDN: <span className="font-mono font-bold text-white">NIDN-0023456</span> / Pass: <span className="font-mono font-bold text-white">hendra789</span>
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
            className="flex items-center gap-2 text-sm hover:text-[#4475F2] transition-colors"
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
                  : "0 24px 80px rgba(68,117,242,0.10)",
                border: `1px solid ${borderColor}`,
              }}
            >
              {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-2 mb-6">
                <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
                <span style={{ color: textPrimary, fontWeight: 700 }}>
                  Pustaka<span style={{ color: "#4475F2" }}>Nusa</span>
                </span>
              </div>

              <h1
                className="mb-2 text-center"
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
                className="mb-1 text-center"
                style={{ color: "#4475F2", fontWeight: 800, fontSize: "1.1rem" }}
              >
                Portal Mahasiswa / Dosen
              </h2>
              <p className="text-sm mb-8 text-center" style={{ color: textMuted, lineHeight: 1.6 }}>
                Masuk menggunakan NIM atau NIDN Anda.
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

              {/* State C: Inactive account alert */}
              {showInactiveAlert && (
                <div
                  className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm mb-5"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.08)",
                    color: "#EF4444",
                    border: "1.5px solid rgba(239,68,68,0.35)",
                  }}
                >
                  <UserX className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <p style={{ fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "2px" }}>
                      Akses Ditolak
                    </p>
                    <p style={{ color: "#EF4444", opacity: 0.85 }}>
                      Akun Anda sedang dinonaktifkan. Silakan hubungi admin.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: textMuted }}>NIM / NIDN</label>
                  <input
                    type="text"
                    placeholder="Contoh: 20210001 atau NIDN-0023456"
                    value={nimNidn}
                    onChange={(e) => { setNimNidn(e.target.value); setInlineError(""); setShowInactiveAlert(false); }}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#4475F2]/25"
                    style={{
                      backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                      border: `1.5px solid ${inlineError || showInactiveAlert ? "rgba(239,68,68,0.5)" : borderColor}`,
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
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setInlineError(""); setShowInactiveAlert(false); }}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#4475F2]/25 pr-12"
                      style={{
                        backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                        border: `1.5px solid ${inlineError || showInactiveAlert ? "rgba(239,68,68,0.5)" : borderColor}`,
                        color: textPrimary,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-[#4475F2]"
                      style={{ color: textMuted }}
                    >
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <a href="#" className="text-xs hover:underline" style={{ color: textMuted }}>
                      Lupa Password?{" "}
                      <span style={{ color: "#4475F2", fontWeight: 600 }}>Hubungi Admin Perpustakaan</span>
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading || !nimNidn.trim() || !password.trim()}
                  className="w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed mt-2"
                  style={{
                    background: "linear-gradient(135deg, #4475F2, #789DFC)",
                    fontWeight: 700,
                    boxShadow: "0 4px 18px rgba(68,117,242,0.30)",
                  }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Masuk ke Pustaka Nusa
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs pt-1" style={{ color: textMuted }}>
                  Akun dikelola oleh Admin Perpustakaan STITEK
                </p>
              </div>
            </div>

            <p className="text-center text-sm mt-5" style={{ color: textMuted }}>
              Pengelola perpustakaan?{" "}
              <button
                onClick={() => navigate("/login/admin")}
                className="hover:underline"
                style={{ color: "#4475F2", fontWeight: 600 }}
              >
                Portal Admin
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
              <div
                className="w-full px-4 py-3 rounded-2xl mb-6 text-left"
                style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}
              >
                <p className="text-xs mb-1" style={{ color: textMuted }}>Kontak Perpustakaan:</p>
                <p className="text-sm" style={{ color: textPrimary, fontWeight: 600 }}>informatika@stitek.ac.id</p>
                <p className="text-sm" style={{ color: textPrimary, fontWeight: 600 }}>+62 (0549) xxx-xxxx</p>
              </div>
              <button
                onClick={() => setShowNotFoundModal(false)}
                className="w-full py-3 rounded-xl text-white text-sm hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #4475F2, #789DFC)", fontWeight: 700 }}
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