import { useNavigate } from "react-router";
import { ArrowLeft, Download, FileText, CheckCircle, Clock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";
import { useEffect, useState } from "react";
import axios from "axios";

export function RiwayatUnduhan() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // ✅ STATE HARUS DI DALAM FUNCTION
  const [riwayat, setRiwayat] = useState<any[]>([]);

  // ✅ AMBIL DATA DARI BACKEND
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/riwayat-unduhan")
      .then(res => {
        setRiwayat(res.data);
      })
      .catch(err => {
        console.log("Error ambil riwayat:", err);
      });
  }, []);

  const bg = isDark ? "#0F172A" : "#F8FAFC";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-8 h-16"
        style={{
          backgroundColor: surface,
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: isDark
            ? "0 1px 12px rgba(0,0,0,0.3)"
            : "0 1px 12px rgba(0,0,0,0.05)"
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm hover:text-[#4475F2]"
          style={{ color: textMuted }}
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-7 h-7 object-contain" />
          <span style={{ color: textPrimary, fontWeight: 700 }}>
            Pustaka<span style={{ color: "#4475F2" }}>Nusa</span>
          </span>
        </div>

        <div className="w-20" />
      </header>

      {/* MAIN */}
      <main className="px-5 md:px-8 py-8 max-w-3xl mx-auto">
        
        {/* TITLE */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}
          >
            <Download className="w-5 h-5 text-[#4475F2]" />
          </div>
          <div>
            <h1 className="text-xl" style={{ color: textPrimary, fontWeight: 800 }}>
              Riwayat Unduhan
            </h1>
            <p className="text-sm" style={{ color: textMuted }}>
              {riwayat.length} file diunduh
            </p>
          </div>
        </div>

        {/* LIST */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: surface,
            border: `1px solid ${borderColor}`
          }}
        >
          {riwayat.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 hover:bg-[#4475F2]/05 cursor-pointer"
              style={{
                borderBottom:
                  i < riwayat.length - 1 ? `1px solid ${borderColor}` : "none"
              }}
              onClick={() => navigate(`/book/${item.ebook_id}`)}
            >
              {/* COVER */}
<img
  src={
    item.ebook?.cover_image
      ? `http://127.0.0.1:8000/storage/${item.ebook.cover_image}`
      : "/no-image.png"
  }
  alt={item.ebook?.judul}
  className="w-12 h-16 rounded-xl object-cover"
/>

{/* INFO */}
<div className="flex-1">
  <p className="text-sm font-semibold" style={{ color: textPrimary }}>
    {item.ebook?.judul}
  </p>

  <p className="text-xs" style={{ color: textMuted }}>
    {item.ebook?.penulis}
  </p>

  <div className="flex gap-3 mt-1">
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: "#EEF2FF",
        color: "#4475F2"
      }}
    >
      {item.ebook?.category?.nama_kategori || "-"}
    </span>
  </div>
</div>

              {/* STATUS */}
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-green-500">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-xs">Selesai</span>
                </div>

                <div className="flex items-center gap-1 text-xs" style={{ color: textMuted }}>
                  <Clock className="w-3 h-3" />
                  {item.created_at}
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}