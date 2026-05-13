import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Lightbulb, Send, AlertTriangle, CheckCircle, Trash2, Eye, X, BookOpen, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useBooks } from "../context/BookContext";
import axios from "axios";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Menunggu: { bg: "rgba(148,163,184,0.12)", color: "#64748B" },
  Ditinjau: { bg: "rgba(249,115,22,0.10)", color: "#F97316" },
  Ditolak: { bg: "rgba(239,68,68,0.10)", color: "#EF4444" },
  Diterima: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
};

export function SaranBuku() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { saranList, setSaranList } = useBooks();
  const navigate = useNavigate();

  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [saranListState, setSaranListState] = useState<any[]>([]);
  
  // Fetch from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/suggestions")
      .then((res) => {
        if(res.data.success) {
          const mapped = res.data.data.map((s: any) => ({
            id: s.id.toString(),
            user: s.user?.name || "—",
            nimNidn: s.user?.nim || s.user?.nidn || "—",
            judul: s.subjek,
            penulis: s.pesan.split("Penulis: ")[1]?.split("\n")[0] || "—", // Asumsi
            tanggal: new Date(s.created_at).toLocaleDateString("id-ID"),
            status: s.status || "Menunggu",
            catatan: s.pesan
          }));
          setSaranListState(mapped);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const [detailSaran, setDetailSaran] = useState<any | null>(null);

  const bg = isDark ? "#0F172A" : "#F8FAFC";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

 // CEK ROLE
const isAdmin = user?.role === "admin";

// ADMIN lihat semua
// USER lihat miliknya sendiri
const mySaran = isAdmin
  ? saranListState
  : saranListState.filter(
      (s) => s.nimNidn === (user?.nimNidn || "—")
    );

const acceptedSuggestions = mySaran.filter(
  (s) => s.status === "Diterima"
);

  const handleSubmit = async () => {
    if (!judul.trim()) {
      toast.error("Judul buku tidak boleh kosong.");
      return;
    }
    setLoading(true);
    
    try {
      const userRes = await axios.get("http://127.0.0.1:8000/api/users");
      const me = userRes.data.data.find((u:any) => u.nim === user?.nimNidn || u.nidn === user?.nimNidn);
      
      if (!me) {
        toast.error("User tidak ditemukan di backend.");
        setLoading(false);
        return;
      }
      
      const res = await axios.post("http://127.0.0.1:8000/api/suggestions", {
        user_id: me.id,
        subjek: judul.trim(),
        pesan: `Penulis: ${penulis.trim()}\nAlasan: ${alasan.trim()}`,
      });
      
      if (res.data.success) {
        toast.success("Saran buku berhasil dikirim!");
        setJudul("");
        setPenulis("");
        setAlasan("");
        // Reload suggestions
        const newS = res.data.data;
        setSaranListState(prev => [{
            id: newS.id.toString(),
            user: me.name,
            nimNidn: me.nim || me.nidn,
            judul: newS.subjek,
            penulis: penulis.trim(),
            tanggal: "Baru saja",
            status: "Menunggu",
            catatan: newS.pesan
        }, ...prev]);
      }
    } catch (err) {
      toast.error("Gagal mengirim saran.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/suggestions/${id}`);
      setSaranListState((prev) => prev.filter((s) => s.id !== id));
      toast("Saran dihapus.", { style: { backgroundColor: isDark ? "#1E293B" : "#fff" } });
    } catch(err) {
      toast.error("Gagal menghapus saran.");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}>
      <Toaster position="top-right" richColors />
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

      <main className="px-5 md:px-8 py-8 max-w-6xl mx-auto">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}>
            <Lightbulb className="w-5 h-5 text-[#789DFC]" />
          </div>
          <div>
            <h1 className="text-xl" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
              Saran Buku
            </h1>
            <p className="text-sm" style={{ color: textMuted }}>Ajukan e-book yang ingin Anda baca di Pustaka Nusa</p>
          </div>
        </div>

        {/* Notification: accepted suggestions */}
        {acceptedSuggestions.length > 0 && (
          <div
            className="flex items-start gap-3 px-5 py-4 rounded-2xl mb-6"
            style={{ backgroundColor: isDark ? "#14352A" : "#F0FDF4", border: "1.5px solid rgba(34,197,94,0.35)" }}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: "#22C55E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Kabar Baik! Saran Anda Diterima 🎉
              </p>
              <p className="text-sm" style={{ color: isDark ? "#86EFAC" : "#166534", lineHeight: 1.65 }}>
                Saran buku Anda telah diterima dan akan segera tersedia di Pustaka Nusa!{" "}
                <strong>({acceptedSuggestions.map((s) => `"${s.judul}"`).join(", ")})</strong>
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div
          className="flex items-start gap-3 px-5 py-4 rounded-2xl mb-6"
          style={{ backgroundColor: isDark ? "#2D1C0A" : "#FFF7ED", border: "1px solid rgba(249,115,22,0.25)" }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#F97316" }} />
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Disclaimer Penting</p>
            <p className="text-sm" style={{ color: isDark ? "#FDA97A" : "#9A3412", lineHeight: 1.65 }}>
              Permintaan buku yang diajukan <strong>belum tentu dikabulkan</strong> oleh pengelola perpustakaan. Pengadaan koleksi bergantung pada ketersediaan anggaran, hak cipta, dan relevansi akademik.
            </p>
          </div>
        </div>

        {/* Side-by-side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Form */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 h-full"
              style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}
            >
              <h2 className="text-base mb-5" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                Saran Buku Baru
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: textMuted }}>
                    Judul Buku <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Clean Code"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#789DFC]/25 transition-all"
                    style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${borderColor}`, color: textPrimary }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: textMuted }}>
                    Penulis <span className="text-xs" style={{ color: textMuted }}>(opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama penulis"
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#789DFC]/25 transition-all"
                    style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${borderColor}`, color: textPrimary }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: textMuted }}>
                    Alasan / Relevansi Akademik <span className="text-xs" style={{ color: textMuted }}>(opsional)</span>
                  </label>
                  <textarea
                    placeholder="Jelaskan mengapa buku ini diperlukan..."
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#789DFC]/25 transition-all resize-none"
                    style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${borderColor}`, color: textPrimary, lineHeight: 1.65 }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !judul.trim()}
                  className="w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#789DFC", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 14px rgba(120,157,252,0.30)" }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Saran
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: History Table */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}
            >
              <div className="px-5 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {isAdmin ? "Saran E-book dari Pengguna" : "Riwayat Saran Saya"}
                  </h2>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2" }}>
                    {mySaran.length} data
                  </span>
                </div>
              </div>

              {/* Scrollable table body */}
              <div style={{ maxHeight: "380px", overflowY: "auto" }}>
                {mySaran.length === 0 ? (
                  <div className="text-center py-12">
                    <Lightbulb className="w-10 h-10 mx-auto mb-3" style={{ color: isDark ? "#334155" : "#D9E3FC" }} />
                    <p className="text-sm" style={{ color: textMuted }}>Belum ada saran yang dikirim</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="sticky top-0" style={{ backgroundColor: surface }}>
                      <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                        {[
  ...(isAdmin ? ["Pengguna"] : []),
  "Judul Buku",
  "Penulis",
  "Tanggal",
  "Status",
  ""
].map((h) => (
  <th
    key={h}
    className="text-left px-4 py-3 text-xs uppercase tracking-wide"
    style={{ color: textMuted }}
  >
    {h}
  </th>
))}
                      </tr>
                    </thead>
                    <tbody>
                      {mySaran.map((s, i) => (
                        <tr
                          key={s.id}
                          className="hover:bg-[#789DFC]/5 transition-colors"
                          style={{ borderBottom: i < mySaran.length - 1 ? `1px solid ${borderColor}` : "none" }}
                        >
                          {isAdmin && (
  <td className="px-4 py-3.5">
    <p
      className="text-sm font-medium"
      style={{ color: textPrimary }}
    >
      {s.user}
    </p>
  </td>
)}
                          <td className="px-4 py-3.5">
                            <p className="text-sm font-medium line-clamp-2" style={{ color: textPrimary, maxWidth: "160px" }}>
                              {s.judul}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: textMuted, whiteSpace: "nowrap" }}>
                            {s.penulis || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-xs" style={{ color: textMuted, whiteSpace: "nowrap" }}>
                            {s.tanggal}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs w-fit whitespace-nowrap"
                              style={{ backgroundColor: STATUS_STYLE[s.status]?.bg, color: STATUS_STYLE[s.status]?.color }}
                            >
                              {s.status === "Diterima" && <CheckCircle className="w-3 h-3" />}
                              {s.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setDetailSaran(s)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#4475F2]/10 transition-colors"
                                style={{ color: "#4475F2" }}
                                title="Lihat Detail"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(s.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors"
                                style={{ color: "#EF4444" }}
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {detailSaran && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md rounded-3xl p-7 relative"
            style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}
          >
            <button
              onClick={() => setDetailSaran(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              style={{ color: textMuted }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}>
                <BookOpen className="w-5 h-5 text-[#789DFC]" />
              </div>
              <div>
                <h3 style={{ color: textPrimary, fontWeight: 800, fontSize: "1rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Detail Saran Buku
                </h3>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: STATUS_STYLE[detailSaran.status]?.bg, color: STATUS_STYLE[detailSaran.status]?.color }}
                >
                  {detailSaran.status === "Diterima" && <CheckCircle className="w-3 h-3 inline mr-1" />}
                  {detailSaran.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Judul */}
              <div className="p-3.5 rounded-xl" style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}>
                <p className="text-xs mb-1" style={{ color: textMuted }}>Judul Buku</p>
                <p className="text-sm" style={{ color: textPrimary, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {detailSaran.judul}
                </p>
              </div>

              {/* Penulis & Tanggal row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}>
                  <p className="text-xs mb-1 flex items-center gap-1" style={{ color: textMuted }}>
                    <User className="w-3 h-3" /> Penulis
                  </p>
                  <p className="text-sm" style={{ color: textPrimary, fontWeight: 500 }}>{detailSaran.penulis || "—"}</p>
                </div>
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}>
                  <p className="text-xs mb-1 flex items-center gap-1" style={{ color: textMuted }}>
                    <Calendar className="w-3 h-3" /> Tanggal
                  </p>
                  <p className="text-sm" style={{ color: textPrimary, fontWeight: 500 }}>{detailSaran.tanggal}</p>
                </div>
              </div>

              {/* Alasan */}
              <div className="p-3.5 rounded-xl" style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}>
                <p className="text-xs mb-1.5" style={{ color: textMuted }}>Alasan / Relevansi Akademik</p>
                {detailSaran.catatan ? (
                  <p className="text-sm" style={{ color: textPrimary, lineHeight: 1.7 }}>{detailSaran.catatan}</p>
                ) : (
                  <p className="text-sm italic" style={{ color: textMuted }}>Tidak ada keterangan</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setDetailSaran(null)}
              className="w-full mt-5 py-3 rounded-xl text-white text-sm hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg, #789DFC, #4475F2)", fontWeight: 700 }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}