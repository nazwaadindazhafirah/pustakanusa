import { useNavigate } from "react-router";
import { BookOpen, Home, ArrowLeft, Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";

export function NotFound() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const bg = isDark ? "#0F172A" : "#F8FAFC";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5"
      style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #4475F2, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #789DFC, transparent)" }}
        />
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
          <span
            style={{
              color: textPrimary,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "1.15rem",
            }}
          >
            Pustaka<span style={{ color: "#4475F2" }}>Nusa</span>
          </span>
        </div>

        {/* 404 Illustration */}
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-7 relative"
          style={{
            backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF",
            boxShadow: "0 12px 40px rgba(68,117,242,0.15)",
          }}
        >
          <BookOpen className="w-14 h-14" style={{ color: "#4475F2", opacity: 0.7 }} />
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background: "linear-gradient(135deg, #EF4444, #F97316)", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ?
          </div>
        </div>

        {/* Code */}
        <div
          className="text-8xl mb-3"
          style={{
            color: "#4475F2",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 900,
            letterSpacing: "-4px",
            opacity: 0.9,
          }}
        >
          404
        </div>

        {/* Heading */}
        <h1
          className="text-2xl mb-3"
          style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm mb-8" style={{ color: textMuted, lineHeight: 1.7 }}>
          Halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
          Kembali ke beranda dan lanjutkan eksplorasi koleksi e-book.
        </p>

        {/* Quick links */}
        <div
          className="rounded-2xl p-4 mb-6 text-left"
          style={{
            backgroundColor: surface,
            border: `1px solid ${borderColor}`,
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <p className="text-xs mb-3" style={{ color: textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Halaman yang Tersedia
          </p>
          {[
            { label: "Beranda Utama", path: "/", icon: Home, desc: "Landing page Pustaka Nusa" },
            { label: "Login Mahasiswa / Dosen", path: "/login", icon: ArrowLeft, desc: "Portal pengguna" },
            { label: "Cari Koleksi Buku", path: "/dashboard", icon: Search, desc: "Jelajahi e-book perpustakaan" },
          ].map(({ label, path, icon: Icon, desc }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[#4475F2]/08 text-left group mb-1"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}
              >
                <Icon className="w-4 h-4 text-[#4475F2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: textPrimary, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {label}
                </p>
                <p className="text-xs" style={{ color: textMuted }}>{desc}</p>
              </div>
              <ArrowLeft className="w-4 h-4 rotate-180 text-[#4475F2] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/")}
          className="w-full py-3.5 rounded-2xl text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #4475F2, #789DFC)",
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: "0 8px 24px rgba(68,117,242,0.35)",
          }}
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
