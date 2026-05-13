import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Download,
  ChevronRight,
  Eye,
  Heart,
  BookOpen,
  Tag,
  Calendar,
  Globe,
  Hash,
  FileText,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useBooks } from "../context/BookContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Toaster } from "sonner";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";

type ReaderState = "idle" | "loading-read" | "reading" | "loading-download" | "downloaded";

export function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { books: allBooks, addLog, favoriteSet, toggleFavorite } = useBooks();
  const [book, setBook] = useState<any>(null);
  const { user } = useAuth();
  const [readerState, setReaderState] = useState<ReaderState>("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);

  

useEffect(() => {
  if (!id) return;

  axios
    .get(`http://127.0.0.1:8000/api/ebooks/${id}`)
    .then((res) => {
      if (res.data.success) {
        const b = res.data.data;

        setBook({
          id: b.id.toString(),
          title: b.judul,
          author: b.penulis,
          category: b.category?.nama_kategori || "Lainnya",
          year: b.tahun_terbit || "-",
          cover: b.cover_url || "https://via.placeholder.com/150",
          pages: b.jumlah_halaman || 0,
          language: b.bahasa || "Indonesia",
          isbn: b.isbn || "-",
          synopsis: b.deskripsi || "-",
          pdf: b.pdf_url,
        });
      }
    })
    .catch((err) => console.error(err));
}, [id]);
if (!book) {
  return <div>Loading...</div>;
}
  const relatedBooks = allBooks.filter(
    (b) => b.id !== book?.id && b.category === book?.category
  ).slice(0, 5);
  const displayRelated = relatedBooks.length > 0 ? relatedBooks : allBooks.filter((b) => b.id !== book?.id).slice(0, 5);

  const bg = isDark ? "#0F172A" : "#F8FAFC";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  const handleReadOnline = () => {
    setReaderState("loading-read");
    toast("Menyiapkan Pembaca Online...", {
      icon: <Loader2 className="w-4 h-4 animate-spin text-[#4475F2]" />,
      duration: 3000,
      style: { backgroundColor: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#1A202C" },
    });
    setTimeout(() => {
      setReaderState("reading");
      if (book) addLog({ actor: user?.name || "Pengguna", action: "membaca online", detail: book.title, type: "read", kategori: book.category });
    }, 2500);
  };

  const handleDownload = async () => {
  if (readerState === "loading-download") return;

  setReaderState("loading-download");
  setDownloadProgress(0);

  toast("Unduhan Dimulai", {
    icon: <Download className="w-4 h-4 text-[#4475F2]" />,
    style: { backgroundColor: isDark ? "#1E293B" : "#EEF2FF", color: "#4475F2" },
    duration: 2000,
  });

  // 🔥 TAMBAHAN PENTING (INI YANG KAMU BUTUH)
  try {
    await axios.post("http://127.0.0.1:8000/api/download", {
      ebook_id: book.id,
    });
  } catch (error) {
    console.log("gagal simpan download", error);
  }

  // animasi tetap jalan
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 5;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      setDownloadProgress(100);
      setReaderState("downloaded");

      if (book)
        addLog({
          actor: user?.name || "Pengguna",
          action: "mengunduh PDF",
          detail: book.title,
          type: "download",
          kategori: book.category,
        });

      toast.success("File berhasil diunduh!");
      
      // 🔥 buka file PDF
      window.open(book.pdf, "_blank");

    } else {
      setDownloadProgress(progress);
    }
  }, 200);
};
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}
    >
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-10 h-16"
        style={{
          backgroundColor: surface,
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: isDark ? "0 1px 12px rgba(0,0,0,0.3)" : "0 1px 12px rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:bg-[#D9E3FC]/40"
          style={{ color: "#4475F2" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm hidden md:block">Kembali ke Dashboard</span>
        </button>

        <div className="flex items-center gap-2.5">
          <img src={logo} alt="logo" className="w-7 h-7 object-contain" />
          <span
            style={{
              color: textPrimary,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            Pustaka<span style={{ color: "#4475F2" }}>Nusa</span>
          </span>
        </div>

        <ThemeToggle size="sm" />
      </header>

      {/* Loading overlay — Reading */}
      {readerState === "loading-read" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className="w-80 rounded-2xl p-8 text-center"
            style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}>
              <Loader2 className="w-7 h-7 text-[#4475F2] animate-spin" />
            </div>
            <p className="font-semibold mb-2" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Menyiapkan Pembaca Online
            </p>
            <p className="text-sm" style={{ color: textMuted }}>
              Memuat dokumen PDF...
            </p>
            <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? "#334155" : "#E2E8F0" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: "65%", background: "linear-gradient(90deg, #4475F2, #789DFC)", animation: "indeterminate 1.5s infinite" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Download progress overlay */}
      {readerState === "loading-download" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className="w-80 rounded-2xl p-8 text-center"
            style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}>
              <Download className="w-7 h-7 text-[#4475F2]" />
            </div>
            <p className="font-semibold mb-1" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Unduhan Sedang Berlangsung
            </p>
            <p className="text-sm mb-4" style={{ color: textMuted }}>
              {book.title}
            </p>
            <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: isDark ? "#334155" : "#E2E8F0" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(downloadProgress, 100)}%`,
                  background: "linear-gradient(90deg, #4475F2, #789DFC)",
                }}
              />
            </div>
            <p className="text-sm font-semibold" style={{ color: "#4475F2" }}>
              {Math.min(downloadProgress, 100)}%
            </p>
          </div>
        </div>
      )}

      {/* PDF Viewer overlay */}
     {/* PDF Viewer overlay */}
{readerState === "reading" && (
  <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: isDark ? "#0F172A" : "#F1F5F9" }}>
    
    {/* HEADER */}
    <div
      className="flex items-center justify-between px-5 h-14 flex-shrink-0"
      style={{ backgroundColor: surface, borderBottom: `1px solid ${borderColor}` }}
    >
      <p className="text-sm font-semibold" style={{ color: textPrimary }}>
        {book.title}
      </p>

      <button
        onClick={() => setReaderState("idle")}
        className="px-4 py-2 rounded-xl text-sm"
      >
        Tutup
      </button>
    </div>

    {/* 🔥 INI YANG PALING PENTING */}
    <div className="flex-1">
      <iframe
        src={book.pdf}
        width="100%"
        height="100%"
        style={{ border: "none" }}
      ></iframe>
    </div>

  </div>
)}

      <main className="px-5 md:px-10 py-8 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 flex-wrap">
          {[
            { label: "Beranda", onClick: () => navigate("/dashboard") },
            { label: book.category, onClick: () => navigate("/dashboard") },
            { label: book.title },
          ].map((crumb, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              {crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className="text-sm hover:text-[#4475F2] transition-colors"
                  style={{ color: textMuted }}
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-sm max-w-xs truncate" style={{ color: "#4475F2", fontWeight: 500 }}>
                  {crumb.label}
                </span>
              )}
              {i < arr.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: textMuted }} />
              )}
            </div>
          ))}
        </nav>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-14">
          {/* Left: Cover + Actions */}
          <div className="md:col-span-2">
            {/* Cover */}
            <div
              className="rounded-2xl overflow-hidden mb-6"
              style={{
                boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.6)" : "0 20px 60px rgba(68,117,242,0.15)",
                maxWidth: "300px",
                margin: "0 auto",
              }}
            >
              <div className="relative" style={{ paddingTop: "140%" }}>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 max-w-xs mx-auto">
              <button
                onClick={handleReadOnline}
                disabled={readerState === "loading-read"}
                className="w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2.5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{
                  backgroundColor: "#4475F2",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  boxShadow: "0 4px 16px rgba(68,117,242,0.30)",
                }}
              >
                {readerState === "loading-read" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
                Baca Online
              </button>

              <button
                onClick={handleDownload}
                disabled={readerState === "loading-download"}
                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all hover:bg-[#4475F2] hover:text-white active:scale-95 disabled:opacity-60"
                style={{
                  border: "2px solid #4475F2",
                  color: readerState === "downloaded" ? "#22C55E" : "#4475F2",
                  borderColor: readerState === "downloaded" ? "#22C55E" : "#4475F2",
                  backgroundColor: "transparent",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                {readerState === "loading-download" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : readerState === "downloaded" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {readerState === "downloaded" ? "Terunduh" : "Unduh PDF"}
              </button>

              <button
                onClick={() => toggleFavorite(book.id)}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{
                  backgroundColor: isDark ? "#1E293B" : "#F8FAFC",
                  color: favoriteSet.has(book.id) ? "#EF4444" : textMuted,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <Heart className="w-4 h-4" style={{ fill: favoriteSet.has(book.id) ? "#EF4444" : "none" }} />
                <span className="text-sm">{favoriteSet.has(book.id) ? "Tersimpan di Favorit" : "Simpan ke Favorit"}</span>
              </button>
            </div>

            {/* Metadata mini-cards */}
            <div
              className="mt-5 grid grid-cols-3 gap-2 max-w-xs mx-auto"
            >
              {[
                { label: "Halaman", value: `${book.pages}` },
                { label: "Tahun", value: `${book.year}` },
                { label: "Bahasa", value: book.language },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="text-center py-3 rounded-xl"
                  style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}
                >
                  <p className="text-sm font-bold" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {value}
                  </p>
                  <p className="text-xs" style={{ color: textMuted }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="md:col-span-3">
            {/* Category */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm mb-4"
              style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2" }}
            >
              <Tag className="w-3.5 h-3.5" />
              {book.category}
            </div>

            {/* Title */}
            <h1
              className="mb-3"
              style={{
                color: textPrimary,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
              }}
            >
              {book.title}
            </h1>

            <p className="text-base mb-8" style={{ color: textMuted }}>
              oleh{" "}
              <span style={{ color: "#4475F2", fontWeight: 600 }}>{book.author}</span>
            </p>

            {/* Synopsis */}
            <div
              className="p-6 rounded-2xl mb-6"
              style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#4475F2]" />
                <h3 style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                  Sinopsis
                </h3>
              </div>
              <p style={{ color: textMuted, lineHeight: 1.85, fontSize: "0.95rem" }}>
                {book.synopsis}
              </p>
            </div>

            {/* Metadata detail */}
            <div
              className="p-6 rounded-2xl"
              style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}
            >
              <h3
                className="mb-4"
                style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Detail Informasi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Tag, label: "Kategori", value: book.category },
                  { icon: Calendar, label: "Tahun Terbit", value: String(book.year) },
                  { icon: Globe, label: "Bahasa", value: book.language },
                  { icon: Hash, label: "ISBN", value: book.isbn },
                  { icon: BookOpen, label: "Jumlah Halaman", value: `${book.pages} halaman` },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF" }}
                    >
                      <Icon className="w-4 h-4 text-[#4475F2]" />
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: textMuted }}>{label}</p>
                      <p className="text-sm font-medium" style={{ color: textPrimary }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Books */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2
              style={{
                color: textPrimary,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              Buku Terkait
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity"
              style={{ color: "#4475F2" }}
            >
              Lihat semua <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {displayRelated.map((b) => (
              <div
                key={b.id}
                onClick={() => navigate(`/book/${b.id}`)}
                className="flex-shrink-0 cursor-pointer rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ width: "130px", backgroundColor: surface, border: `1px solid ${borderColor}` }}
              >
                <div className="relative" style={{ paddingTop: "136%" }}>
                  <img src={b.cover} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs line-clamp-2" style={{ color: textPrimary, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {b.title}
                  </p>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: textMuted }}>{b.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}