import { useNavigate } from "react-router";
import {
  Search,
  FileText,
  Download,
  Heart,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  ArrowDown,
  Shield,
  Target,
  GraduationCap,
  Lightbulb,
  BookOpen,
  Handshake,
  Users,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";
import libraryBg1 from "../../imports/LibraryBackground.jpg";

export function LandingPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const bg = isDark ? "#0F172A" : "#FFFFFF";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const accentBg = isDark ? "#111827" : "#F8FAFC";

  const features = [
    {
      icon: Search,
      title: "Pencarian Cepat",
      desc: "Temukan e-book dan jurnal dalam hitungan detik dengan mesin pencari cerdas berbasis kata kunci dan kategori.",
      color: "#4475F2",
      bg: isDark ? "#1E3A5F" : "#EEF2FF",
    },
    {
      icon: FileText,
      title: "Baca PDF Online",
      desc: "Baca dokumen langsung di browser tanpa perlu mengunduh. Didukung PDF viewer terintegrasi yang cepat.",
      color: "#22C55E",
      bg: isDark ? "#14352A" : "#F0FDF4",
    },
    {
      icon: Download,
      title: "Unduh E-book",
      desc: "Simpan koleksi favorit ke perangkat untuk dibaca kapan saja dan di mana saja, bahkan saat offline.",
      color: "#F97316",
      bg: isDark ? "#2D1C0A" : "#FFF7ED",
    },
    {
      icon: Heart,
      title: "Kelola Favorit",
      desc: "Simpan dan organisir referensi penting ke daftar favorit pribadi. Akses kembali dengan mudah.",
      color: "#EF4444",
      bg: isDark ? "#2D0D0D" : "#FFF5F5",
    },
  ];

  const advantages = [
    {
      icon: Shield,
      title: "Akses Eksklusif Sivitas STITEK",
      desc: "Platform ini hanya dapat diakses oleh mahasiswa, dosen, dan staf STITEK yang terdaftar. Keamanan data dan privasi akademik terjamin sepenuhnya melalui sistem autentikasi berbasis NIM/NIDN.",
      tag: "Keamanan & Privasi",
      color: "#4475F2",
    },
    {
      icon: Users,
      title: "Tanpa Antrean Digital",
      desc: "Berbeda dengan buku fisik, koleksi digital bisa diakses oleh banyak pengguna sekaligus — tidak ada antrean, tidak ada batas peminjaman.",
      tag: "Efisiensi",
      color: "#22C55E",
    },
    {
      icon: GraduationCap,
      title: "Antarmuka Modern Gen Z",
      desc: "Dirancang khusus dengan UI minimalist modern yang intuitif, mendukung dark mode, dan fully responsive di semua perangkat — dari smartphone hingga desktop.",
      tag: "Desain Modern",
      color: "#789DFC",
    },
  ];

  const misiItems = [
    {
      icon: GraduationCap,
      text: "Mengembangkan pendidikan di bidang Teknik Informatika sesuai perkembangan teknologi.",
    },
    {
      icon: Lightbulb,
      text: "Menumbuhkan penerapan IPTEK yang inovatif dan bermanfaat bagi masyarakat luas.",
    },
    {
      icon: Target,
      text: "Kurikulum berbasis moral, kewirausahaan, dan profesionalisme yang berkarakter.",
    },
    {
      icon: Handshake,
      text: "Menjalin kerjasama di bidang tridharma perguruan tinggi dengan berbagai mitra.",
    },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Sticky Navbar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-20 h-16"
        style={{
          backgroundColor: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: isDark
            ? "none"
            : `1px solid ${borderColor}`,
          boxShadow: isDark
            ? "0 1px 0 0 rgba(120,157,252,0.12), 0 2px 12px rgba(0,0,0,0.3)"
            : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Pustaka Nusa" className="w-9 h-9 object-contain" />
          <div>
            <span className="text-lg" style={{ color: textPrimary, fontWeight: 800 }}>Pustaka</span>
            <span className="text-lg" style={{ color: "#4475F2", fontWeight: 800 }}>Nusa</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-7">
          {[
            { label: "Fitur", href: "#fitur" },
            { label: "Keunggulan", href: "#keunggulan" },
            { label: "Visi & Misi", href: "#visi-misi" },
            { label: "Tentang", href: "#tentang" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm hover:text-[#4475F2] transition-colors"
              style={{ color: textMuted }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" />
          <button
            onClick={() => navigate("/login")}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2", fontWeight: 600 }}
          >
            Masuk
          </button>
        </div>
      </nav>

      {/* ── SECTION 1: HERO ── */}
      <section
        className="relative overflow-hidden px-6 md:px-20 pt-20 pb-28"
        style={{
          minHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Background: library image always visible, overlay adapts to theme */}
        {/* Light: blue overlay 80% | Dark: deep navy overlay 84% */}
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${libraryBg1})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: isDark
                ? "rgba(8, 16, 38, 0.84)"
                : "rgba(79, 125, 243, 0.80)",
            }}
          />
        </>

        <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <img src={logo} alt="Pustaka Nusa Logo" className="w-16 h-16 object-contain" />
            </div>
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-7"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
            Perpustakaan Digital Kampus STITEK Bontang
          </div>

          <h1
            className="mb-5"
            style={{
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 16px rgba(0,0,0,0.2)",
            }}
          >
            Selamat Datang di{" "}
            <span style={{ color: "#D9E3FC" }}>Pustaka Nusa</span>
          </h1>
          <p
            className="text-base md:text-lg mb-2"
            style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}
          >
            Jendela Literasi Digital Kampus STITEK
          </p>

          <p
            className="max-w-xl mx-auto mb-11 text-base"
            style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}
          >
            Akses ribuan referensi akademik — e-book, jurnal, dan makalah penelitian — kapan saja dan di mana saja, eksklusif untuk sivitas akademika STITEK Bontang.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-[#4475F2] transition-all duration-200 hover:opacity-90 active:scale-95 w-full sm:w-auto"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              <Users className="w-5 h-5" />
              Portal Mahasiswa / Dosen
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/login/admin")}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl transition-all duration-200 hover:bg-white/20 w-full sm:w-auto"
              style={{
                border: "2px solid rgba(255,255,255,0.6)",
                color: "#FFFFFF",
                backgroundColor: "rgba(255,255,255,0.08)",
                fontWeight: 700,
                fontSize: "0.95rem",
                backdropFilter: "blur(4px)",
              }}
            >
              <Shield className="w-5 h-5" />
              Portal Pengelola
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Scroll</span>
          <ArrowDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
        </div>
      </section>

      {/* ── SECTION 2: FEATURES ── */}
      <section id="fitur" className="px-6 md:px-20 py-24" style={{ backgroundColor: accentBg }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-5"
              style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2" }}
            >
              Fitur Unggulan
            </div>
            <h2
              style={{
                color: textPrimary,
                fontWeight: 800,
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              Semua yang Anda Butuhkan,
              <br />
              <span style={{ color: "#4475F2" }}>Dalam Satu Platform</span>
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-base" style={{ color: textMuted, lineHeight: 1.75 }}>
              Dirancang untuk memenuhi kebutuhan akademik mahasiswa dan dosen STITEK secara menyeluruh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  backgroundColor: surface,
                  border: isDark ? "none" : `1px solid ${borderColor}`,
                  boxShadow: isDark
                    ? "0 4px 24px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(120,157,252,0.08)"
                    : "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-base mb-2" style={{ color: textPrimary, fontWeight: 700 }}>
                  {f.title}
                </h3>
                <p className="text-sm" style={{ color: textMuted, lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ADVANTAGES ── */}
      <section id="keunggulan" className="px-6 md:px-20 py-24" style={{ backgroundColor: bg }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-5"
              style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2" }}
            >
              Keunggulan Kami
            </div>
            <h2
              style={{
                color: textPrimary,
                fontWeight: 800,
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              Kenapa Memilih{" "}
              <span style={{ color: "#4475F2" }}>Pustaka Nusa?</span>
            </h2>
          </div>

          <div className="space-y-10">
            {advantages.map((adv, i) => (
              <div
                key={adv.title}
                className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-16`}
              >
                {/* Illustration */}
                <div
                  className="flex-shrink-0 w-full md:w-72 h-56 rounded-3xl flex flex-col items-center justify-center gap-4"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, ${adv.color}15, ${adv.color}08)`
                      : `linear-gradient(135deg, ${adv.color}10, ${adv.color}05)`,
                    border: `1.5px solid ${adv.color}25`,
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${adv.color}30, ${adv.color}15)` }}
                  >
                    <adv.icon className="w-10 h-10" style={{ color: adv.color }} />
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${adv.color}15`, color: adv.color, fontWeight: 600 }}
                  >
                    {adv.tag}
                  </span>
                </div>

                <div className="flex-1">
                  <h3
                    className="text-xl md:text-2xl mb-4"
                    style={{ color: textPrimary, fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.01em" }}
                  >
                    {adv.title}
                  </h3>
                  <p className="text-base" style={{ color: textMuted, lineHeight: 1.85 }}>
                    {adv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: VISI & MISI ── */}
      <section
        id="visi-misi"
        className="px-6 md:px-20 py-24"
        style={{ backgroundColor: accentBg }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-5"
              style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2" }}
            >
              Identitas Institusi
            </div>
            <h2
              style={{
                color: textPrimary,
                fontWeight: 800,
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              Visi &amp; Misi{" "}
              <span style={{ color: "#4475F2" }}>STITEK Bontang</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* VISI */}
            <div
              className="rounded-3xl p-8 h-full"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #1E3A5F, #0F2040)"
                  : "linear-gradient(135deg, #4475F2, #6B92FF)",
                boxShadow: "0 12px 40px rgba(68,117,242,0.25)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-widest">Visi</p>
                  <p className="text-base text-white" style={{ fontWeight: 700 }}>STITEK Bontang</p>
                </div>
              </div>
              <p
                className="text-white leading-relaxed"
                style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", fontWeight: 600, lineHeight: 1.8 }}
              >
                MENJADI PRODI YANG UNGGUL DI BIDANG PENGEMBANGAN PERANGKAT LUNAK DAN MULTIMEDIA
              </p>
              <div
                className="mt-6 pt-6"
                style={{
                  borderTop: isDark ? "none" : "1px solid rgba(255,255,255,0.15)",
                  background: isDark
                    ? "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)"
                    : "none",
                  ...(isDark ? {
                    borderRadius: "0 0 8px 8px",
                    marginTop: "1.5rem",
                    paddingTop: "1.5rem",
                    marginLeft: "-2rem",
                    marginRight: "-2rem",
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                  } : {}),
                }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/60">Program Studi Teknik Informatika</span>
                </div>
              </div>
            </div>

            {/* MISI */}
            <div
              className="rounded-3xl p-8"
              style={{
                backgroundColor: surface,
                border: isDark ? "none" : `1.5px solid ${borderColor}`,
                boxShadow: isDark
                  ? "0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(120,157,252,0.08)"
                  : "0 8px 32px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}
                >
                  <GraduationCap className="w-5 h-5 text-[#4475F2]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest" style={{ color: textMuted }}>Misi</p>
                  <p className="text-base" style={{ color: textPrimary, fontWeight: 700 }}>STITEK Bontang</p>
                </div>
              </div>
              <ol className="space-y-5">
                {misiItems.map((m, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}
                    >
                      <m.icon className="w-4 h-4 text-[#4475F2]" />
                    </div>
                    <div className="flex-1 pt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full mr-2"
                        style={{ backgroundColor: isDark ? "#1E3A5F" : "#D9E3FC", color: "#4475F2", fontWeight: 600 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm" style={{ color: textMuted, lineHeight: 1.7 }}>
                        {m.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section
        className="px-6 md:px-20 py-20"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1E293B, #0D1B2E)"
            : "linear-gradient(135deg, #4475F2, #789DFC)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <img src={logo} alt="logo" className="w-16 h-16 object-contain mx-auto mb-5 opacity-90" />
          <h2
            className="mb-4"
            style={{
              color: isDark ? "#F8FAFC" : "#FFFFFF",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Mulai Perjalanan Literasi Digital Anda
          </h2>
          <p className="mb-8 text-base" style={{ color: isDark ? "rgba(255,255,252,0.8)" : "rgba(255,255,255,0.8)", lineHeight: 1.75 }}>
            Bergabunglah dengan sivitas akademika STITEK dan nikmati akses tak terbatas ke koleksi digital berkualitas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: "#FFFFFF", color: "#4475F2", fontWeight: 700 }}
            >
              Masuk Sekarang
            </button>
            <button
              onClick={() => navigate("/login/admin")}
              className="px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(68,117,242,0.3), rgba(120,157,252,0.2))"
                  : "transparent",
                border: isDark ? "none" : "2px solid rgba(255,255,255,0.5)",
                color: isDark ? "#789DFC" : "#FFFFFF",
                fontWeight: 700,
                boxShadow: isDark ? "inset 0 0 0 1px rgba(120,157,252,0.3)" : "none",
              }}
            >
              Portal Admin
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: LONG FOOTER ── */}
      <footer
        id="tentang"
        className="px-6 md:px-20 pt-16 pb-8"
        style={{
          backgroundColor: isDark ? "#0D1B2E" : "#1A2744",
          color: "#F8FAFC",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12"
            style={{
              borderBottom: isDark ? "none" : "1px solid rgba(255,255,255,0.08)",
              ...(isDark ? {
                paddingBottom: "3rem",
                backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(120,157,252,0.15) 50%, transparent 100%)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "bottom",
                backgroundSize: "100% 1px",
              } : {}),
            }}
          >
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
                <div>
                  <span className="text-lg text-white font-bold">Pustaka</span>
                  <span className="text-lg font-bold" style={{ color: "#789DFC" }}>Nusa</span>
                </div>
              </div>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>
                Platform perpustakaan digital STITEK Bontang. Memberikan akses literasi digital kepada seluruh sivitas akademika kampus.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[#4475F2]"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-red-600"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Tentang */}
            <div>
              <h4 className="text-sm font-bold mb-5 text-white uppercase tracking-wider">Tentang</h4>
              <ul className="space-y-3">
                {["Visi & Misi", "Tim Perpustakaan — STITEK", "Layanan Akademik", "Koleksi Digital"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-[#789DFC] transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layanan */}
            <div>
              <h4 className="text-sm font-bold mb-5 text-white uppercase tracking-wider">Layanan</h4>
              <ul className="space-y-3">
                {["Pencarian E-book", "Baca Online", "Unduhan Digital", "Saran Buku", "Bantuan Teknis"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-[#789DFC] transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="text-sm font-bold mb-5 text-white uppercase tracking-wider">Kontak Kami</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#789DFC" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                    Jl. Letjen S PARMAN, No. 56,<br />
                    Kota Bontang,<br />
                    Kalimantan Timur
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#789DFC" }} />
                  <a href="mailto:informatika@stitek.ac.id" className="text-sm hover:text-[#789DFC] transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>
                    informatika@stitek.ac.id
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#789DFC" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>+62 (0549) xxx-xxxx</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center md:text-left" style={{ color: "rgba(255,255,255,0.4)" }}>
              Copyright © 2026{" "}
              <span style={{ color: "#789DFC", fontWeight: 600 }}>STITEK Bontang</span>{" "}
              — Pustaka Nusa. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Pustaka Nusa v2.0 — Sistem Perpustakaan Digital
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}