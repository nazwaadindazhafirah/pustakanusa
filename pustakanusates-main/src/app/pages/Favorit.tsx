import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Heart, BookOpen, Download, Eye, Search, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useBooks } from "../context/BookContext";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";

export function Favorit() {
  const { isDark } = useTheme();
  const { books: allBooks, favoriteItems, toggleFavorite } = useBooks();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const bg = isDark ? "#0F172A" : "#F8FAFC";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  // Build favorite books list from shared context (preserves add-order)
  const favBooks = favoriteItems
    .map((fi) => {
      const book = allBooks.find((b) => b.id === fi.id);
      return book ? { ...book, savedAt: fi.savedAt } : null;
    })
    .filter(Boolean) as (typeof allBooks[0] & { savedAt: string })[];

  const filtered = favBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

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

      <main className="px-5 md:px-8 py-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? "#2D0D0D" : "#FFF5F5" }}>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
              Favorit / Simpanan
            </h1>
            <p className="text-sm" style={{ color: textMuted }}>{favBooks.length} buku tersimpan</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-6" style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}>
          <Search className="w-4 h-4 text-[#4475F2]" />
          <input
            type="text"
            placeholder="Cari buku favorit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: textPrimary }}
          />
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl overflow-hidden group"
                style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}
              >
                <div className="relative" style={{ paddingTop: "148%" }}>
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    onClick={() => navigate(`/book/${book.id}`)}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => navigate(`/book/${book.id}`)}
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <Eye className="w-4 h-4 text-[#4475F2]" />
                    </button>
                    <button
                      onClick={() => navigate(`/book/${book.id}`)}
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <Download className="w-4 h-4 text-[#22C55E]" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(book.id)}
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs line-clamp-2 mb-1" style={{ color: textPrimary, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {book.title}
                  </p>
                  <p className="text-xs line-clamp-1" style={{ color: textMuted }}>{book.author}</p>
                  <p className="text-xs mt-1" style={{ color: textMuted }}>{book.savedAt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: isDark ? "#334155" : "#FEE2E2" }} />
            <p className="text-base" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {search ? "Tidak ada buku favorit yang ditemukan" : "Belum ada buku yang difavoritkan"}
            </p>
            {!search && (
              <p className="text-sm mt-2" style={{ color: textMuted }}>
                Klik ikon ❤ pada buku di dashboard untuk menyimpannya di sini
              </p>
            )}
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-5 px-6 py-2.5 rounded-full text-sm text-white"
              style={{ background: "linear-gradient(135deg, #4475F2, #789DFC)" }}
            >
              Jelajahi Koleksi Buku
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
