import { useNavigate } from "react-router";
import { ArrowLeft, Activity, Eye, Download, Heart, Search, Settings, LogIn } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";

type LogType = "login" | "read" | "download" | "favorite" | "search" | "profile";

interface LogEntry {
  id: number;
  type: LogType;
  action: string;
  detail: string;
  time: string;
}

const LOG_DATA: LogEntry[] = [
  { id: 1, type: "login", action: "Masuk ke sistem", detail: "Login berhasil dari perangkat baru", time: "29 Apr 2026, 09:05" },
  { id: 2, type: "read", action: "Membaca buku online", detail: "Kecerdasan Buatan & Deep Learning", time: "29 Apr 2026, 09:12" },
  { id: 3, type: "download", action: "Mengunduh PDF", detail: "Machine Learning: Teori & Praktik", time: "29 Apr 2026, 09:45" },
  { id: 4, type: "favorite", action: "Menyimpan ke favorit", detail: "Algoritma & Pemrograman dengan Python", time: "29 Apr 2026, 10:20" },
  { id: 5, type: "search", action: "Melakukan pencarian", detail: 'Keyword: "jaringan komputer"', time: "28 Apr 2026, 16:30" },
  { id: 6, type: "read", action: "Membaca buku online", detail: "Rekayasa Perangkat Lunak Agile", time: "28 Apr 2026, 16:55" },
  { id: 7, type: "download", action: "Mengunduh PDF", detail: "Pemrograman Web Modern: HTML, CSS & JavaScript", time: "28 Apr 2026, 17:10" },
  { id: 8, type: "favorite", action: "Menyimpan ke favorit", detail: "Statistika Terapan untuk Penelitian", time: "27 Apr 2026, 11:40" },
  { id: 9, type: "search", action: "Melakukan pencarian", detail: 'Keyword: "basis data"', time: "27 Apr 2026, 11:45" },
  { id: 10, type: "read", action: "Membaca buku online", detail: "Basis Data & Sistem Manajemen", time: "27 Apr 2026, 14:00" },
  { id: 11, type: "profile", action: "Memperbarui profil", detail: "Password berhasil diubah", time: "26 Apr 2026, 09:30" },
  { id: 12, type: "download", action: "Mengunduh PDF", detail: "Keamanan Informasi & Kriptografi", time: "25 Apr 2026, 15:20" },
  { id: 13, type: "favorite", action: "Menyimpan ke favorit", detail: "Psikologi Perkembangan & Pendidikan", time: "24 Apr 2026, 10:15" },
  { id: 14, type: "read", action: "Membaca buku online", detail: "Manajemen Strategik & Bisnis Modern", time: "23 Apr 2026, 13:45" },
  { id: 15, type: "login", action: "Masuk ke sistem", detail: "Login dari perangkat mobile", time: "22 Apr 2026, 08:00" },
];

const TYPE_CONFIG: Record<LogType, { icon: typeof Activity; color: string; bg: string; label: string }> = {
  login: { icon: LogIn, color: "#4475F2", bg: "rgba(68,117,242,0.1)", label: "Login" },
  read: { icon: Eye, color: "#22C55E", bg: "rgba(34,197,94,0.1)", label: "Baca" },
  download: { icon: Download, color: "#F97316", bg: "rgba(249,115,22,0.1)", label: "Unduh" },
  favorite: { icon: Heart, color: "#EF4444", bg: "rgba(239,68,68,0.1)", label: "Favorit" },
  search: { icon: Search, color: "#A855F7", bg: "rgba(168,85,247,0.1)", label: "Cari" },
  profile: { icon: Settings, color: "#789DFC", bg: "rgba(120,157,252,0.1)", label: "Profil" },
};

export function LogAktivitas() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<any[]>([]);

  const bg = isDark ? "#0F172A" : "#F8FAFC";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  useEffect(() => {
  axios
    .get("http://127.0.0.1:8000/api/logs")
    .then((res) => {
      setLogs(res.data.data);
    })
    .catch((err) => console.log(err));
}, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}>
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-8 h-16"
        style={{ backgroundColor: surface, borderBottom: `1px solid ${borderColor}`, boxShadow: isDark ? "0 1px 12px rgba(0,0,0,0.3)" : "0 1px 12px rgba(0,0,0,0.05)" }}
      >
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm hover:text-[#4475F2] transition-colors" style={{ color: textMuted }}>
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-7 h-7 object-contain" />
          <span style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
            Pustaka<span style={{ color: "#4475F2" }}>Nusa</span>
          </span>
        </div>
        <div className="w-20" />
      </header>

      <main className="px-5 md:px-8 py-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}>
            <Activity className="w-5 h-5 text-[#4475F2]" />
          </div>
          <div>
            <h1 className="text-xl" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
              Log Aktivitas Saya
            </h1>
            <p className="text-sm" style={{ color: textMuted }}>
              {user?.name || "Pengguna"} — Riwayat 30 hari terakhir
            </p>
          </div>
        </div>

        {/* Type legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <span
              key={key}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: cfg.bg, color: cfg.color, fontWeight: 500 }}
            >
              <cfg.icon className="w-3 h-3" />
              {cfg.label}
            </span>
          ))}
        </div>

        {/* Timeline */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}>
          {logs.map((log, i) => {
            console.log(log);
           const cfg = TYPE_CONFIG[log.type as LogType] || TYPE_CONFIG.login;
const Icon = cfg.icon;
            return (
              <div
                key={log.id}
                className="flex items-start gap-4 px-5 py-4 hover:bg-[#4475F2]/05 transition-colors"
                style={{ borderBottom: i < logs.length - 1 ? `1px solid ${borderColor}` : "none" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: textPrimary }}>{log.action}</p>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: textMuted }}>{log.detail}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                  <p className="text-xs mt-1" style={{ color: textMuted }}>{log.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
