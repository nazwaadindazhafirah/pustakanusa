import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Bell,
  Menu,
  Heart,
  BookOpen,
  X,
  Filter,
  LogOut,
  History,
  ChevronRight,
  Activity,
  Lightbulb,
  Settings,
  ChevronDown,
  Check,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useBooks } from "../context/BookContext";
import { CATEGORIES } from "../data/books";
import axios from "axios";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";
import libraryBg1 from "../../imports/LibraryBackground.jpg";

const ITEMS_PER_PAGE = 15;

export function UserDashboard() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const { saranList, favoriteSet, toggleFavorite } = useBooks();
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const filterRef = useRef<HTMLDivElement>(null);

  // Fetch Ebooks from backend
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/ebooks')
      .then(response => {
        if (response.data.success) {
          // Mapping data backend ke format frontend agar sesuai dengan komponen BookCard
          const fetchedBooks = response.data.data.map((b: any) => ({
  id: b.id.toString(),
  title: b.judul,
  author: b.penulis,
  category: b.category?.nama_kategori || 'Lainnya',
  year: new Date(b.created_at).getFullYear().toString(),
  cover: b.cover_image 
    ? `http://127.0.0.1:8000/storage/${b.cover_image}` 
    : "https://via.placeholder.com/150",
  status: "active",
  isFavorite: false,

  // 🔥 TAMBAHAN
  isbn: b.isbn || "-",
  pages: b.jumlah_halaman || 0,
  language: b.bahasa || "Indonesia",
  synopsis: b.deskripsi || "-"
}));
          setAllBooks(fetchedBooks);
        }
      })
      .catch(error => console.error("Error fetching ebooks:", error));
  }, []);

  // Load persisted read notification IDs from localStorage
  useEffect(() => {
    if (user?.nimNidn) {
      try {
        const stored = localStorage.getItem(`pustaka_notif_read_${user.nimNidn}`);
        if (stored) setReadIds(new Set(JSON.parse(stored) as string[]));
      } catch {}
    }
  }, [user?.nimNidn]);

  const bg = isDark ? "#0F172A" : "#F8FAFC";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  const displayName = user?.name || "Pengguna";
  const displayNimNidn = user?.nimNidn || "—";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      const matchSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        !selectedCategory || book.category === selectedCategory;
      return matchSearch && matchCategory && book.status === "active";
    });
  }, [searchQuery, selectedCategory, allBooks]);

  const visibleBooks = filteredBooks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBooks.length;

  const toggleFav = (id: string) => toggleFavorite(id);

  // Live notifications: saran dengan update status dari admin
  const saranNotifs = useMemo(() => {
    return saranList
      .filter((s) => s.nimNidn === user?.nimNidn && s.status !== "Menunggu")
      .map((s) => {
        let text = "";
        if (s.status === "Diterima")
          text = `Saran buku Anda "${s.judul}" telah diterima dan akan segera tersedia! 🎉`;
        else if (s.status === "Ditolak")
          text = `Saran buku "${s.judul}" tidak dapat kami terima saat ini.`;
        else if (s.status === "Ditinjau")
          text = `Saran buku "${s.judul}" sedang ditinjau oleh pengelola.`;
        return { id: s.id, text, time: s.tanggal, unread: !readIds.has(s.id), status: s.status };
      });
  }, [saranList, user?.nimNidn, readIds]);

  const unreadCount = saranNotifs.filter((n) => n.unread).length;

  const markAllRead = () => {
    const allIds = saranNotifs.map((n) => n.id);
    const newSet = new Set([...readIds, ...allIds]);
    setReadIds(newSet);
    try {
      if (user?.nimNidn)
        localStorage.setItem(`pustaka_notif_read_${user.nimNidn}`, JSON.stringify([...newSet]));
    } catch {}
  };

  const menuItems = [
    { icon: Heart, label: "Favorit / Simpanan", path: "/favorit" },
    { icon: History, label: "Riwayat Unduhan", path: "/riwayat" },
    { icon: Activity, label: "Log Aktivitas Saya", path: "/log-saya" },
    { icon: Lightbulb, label: "Saran Buku", path: "/saran-buku" },
    { icon: Settings, label: "Edit Profil", path: "/profil" },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Sticky Header ── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-8 h-16"
        style={{
          backgroundColor: surface,
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: isDark
            ? "0 1px 12px rgba(0,0,0,0.3)"
            : "0 1px 12px rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <span
            style={{
              color: textPrimary,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "1.05rem",
            }}
          >
            Pustaka<span style={{ color: "#4475F2" }}>Nusa</span>
          </span>
        </button>

        <div className="flex items-center gap-2.5">
          <ThemeToggle size="sm" />

          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => {
                const opening = !notifOpen;
                setNotifOpen(opening);
                setDrawerOpen(false);
                if (opening) markAllRead();
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center relative"
              style={{ backgroundColor: isDark ? "#0F172A" : "#F1F5F9", color: textMuted }}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-white px-1"
                  style={{ backgroundColor: "#EF4444", fontSize: "10px", fontWeight: 700 }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div
                className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl overflow-hidden z-50"
                style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}
              >
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifikasi Saran</span>
                    {saranNotifs.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2" }}>
                        {saranNotifs.length}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setNotifOpen(false)} style={{ color: textMuted }}><X className="w-4 h-4" /></button>
                </div>
                {saranNotifs.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: textMuted }} />
                    <p className="text-sm" style={{ color: textMuted }}>Belum ada notifikasi</p>
                  </div>
                ) : (
                  saranNotifs.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 cursor-pointer transition-colors hover:bg-[#4475F2]/5"
                      style={{
                        borderBottom: `1px solid ${borderColor}`,
                        backgroundColor: n.unread ? (isDark ? "rgba(68,117,242,0.06)" : "rgba(68,117,242,0.02)") : "transparent"
                      }}
                      onClick={() => navigate("/saran-buku")}
                    >
                      <div className="flex items-start gap-2">
                        {n.unread && <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#4475F2]" />}
                        <div>
                          <p className="text-sm" style={{ color: textPrimary, lineHeight: 1.5 }}>{n.text}</p>
                          <p className="text-xs mt-1" style={{ color: textMuted }}>{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div className="px-4 py-2.5 text-center" style={{ borderTop: `1px solid ${borderColor}` }}>
                  <button
                    onClick={() => { setNotifOpen(false); navigate("/saran-buku"); }}
                    className="text-xs hover:underline"
                    style={{ color: "#4475F2" }}
                  >
                    Lihat semua saran →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => { setDrawerOpen((p) => !p); setNotifOpen(false); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: isDark ? "#0F172A" : "#F1F5F9", color: textMuted }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Sidebar Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDrawerOpen(false)}>
          <div
            className="w-72 h-full flex flex-col"
            style={{ backgroundColor: surface, boxShadow: "-8px 0 40px rgba(0,0,0,0.18)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-6 py-6"
              style={{
                background: isDark ? "linear-gradient(135deg, #1E3A5F, #1E293B)" : "linear-gradient(135deg, #EEF2FF, #D9E3FC)",
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold" style={{ color: isDark ? "#F8FAFC" : "#1A202C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Menu</span>
                <button onClick={() => setDrawerOpen(false)} style={{ color: textMuted }}><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #4475F2, #789DFC)" }}
                >
                  {displayName[0]?.toUpperCase() || "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate" style={{ color: isDark ? "#F8FAFC" : "#1A202C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{displayName}</p>
                  <p className="text-xs truncate" style={{ color: textMuted }}>{displayNimNidn}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor: isDark ? "#1E3A5F" : "#FFFFFF", color: "#4475F2" }}>
                    {user?.role || "Pengguna"}
                  </span>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {menuItems.map(({ icon: Icon, label, path }) => (
                <button
                  key={label}
                  onClick={() => { navigate(path); setDrawerOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-[#4475F2]/08 text-left"
                  style={{ color: textPrimary }}
                >
                  <Icon className="w-5 h-5 text-[#4475F2]" />
                  <span className="text-sm">{label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" style={{ color: textMuted }} />
                </button>
              ))}
            </nav>
            <div className="px-4 pb-6 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-left"
                style={{ color: "#EF4444" }}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Greeting Banner ── */}
      {user && (
        <section className="relative overflow-hidden px-5 md:px-8 py-14">
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
          {/* Bottom fade to page bg */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent, ${bg})`,
            }}
          />
          {/* Greeting Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1
              style={{
                color: "#FFFFFF",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                textShadow: "0 2px 16px rgba(0,0,0,0.2)",
              }}
            >
              Selamat Datang,{" "}
              <span style={{ color: "#D9E3FC" }}>{displayName}</span>
            </h1>
            <p
              className="mt-3 max-w-2xl mx-auto"
              style={{
                color: "rgba(255,255,255,0.80)",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.8,
                fontSize: "0.95rem",
              }}
            >
              Temukan buku favoritmu berikutnya dan mulailah mempelajari hal baru hari ini. Perluas wawasanmu, dapatkan pengetahuan baru, dan biarkan setiap halaman menginspirasi perjalanan tumbuhmu.
            </p>
          </div>
        </section>
      )}

      {/* ── Main Content ── */}
      <main className="px-5 md:px-8 pb-16">
        {/* Search Hero */}
        <section className="pt-6 pb-8 max-w-4xl mx-auto">
          {/* Search + Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Bar */}
            <div
              className="flex-1 flex items-center gap-3 px-5 rounded-2xl transition-all duration-200 focus-within:ring-2 focus-within:ring-[#4475F2]/25"
              style={{
                height: "52px",
                backgroundColor: surface,
                boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(68,117,242,0.08)",
                border: `1.5px solid ${borderColor}`,
              }}
            >
              <Search className="w-5 h-5 flex-shrink-0 text-[#4475F2]" />
              <input
                type="text"
                placeholder="Cari judul, penulis, atau kategori..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: textPrimary, fontFamily: "'Inter', sans-serif" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ color: textMuted }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <div ref={filterRef} className="relative flex-shrink-0">
              <button
                onClick={() => setFilterOpen((p) => !p)}
                className="flex items-center gap-2 px-5 h-[52px] rounded-2xl text-sm transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                style={{
                  backgroundColor: selectedCategory ? "#4475F2" : surface,
                  color: selectedCategory ? "#FFFFFF" : "#4475F2",
                  border: `1.5px solid ${selectedCategory ? "#4475F2" : borderColor}`,
                  boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(68,117,242,0.08)",
                  fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <Filter className="w-4 h-4" />
                {selectedCategory || "Filter Kategori"}
                <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </button>

              {filterOpen && (
                <div
                  className="absolute top-[calc(100%+8px)] right-0 z-50 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    backgroundColor: surface,
                    border: `1px solid ${borderColor}`,
                    minWidth: "200px",
                    maxHeight: "320px",
                    overflowY: "auto",
                  }}
                >
                  <div className="px-3 py-2" style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>Pilih Kategori</p>
                  </div>
                  <button
                    onClick={() => { setSelectedCategory(null); setVisibleCount(ITEMS_PER_PAGE); setFilterOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-[#4475F2]/08 transition-colors text-left"
                    style={{ color: !selectedCategory ? "#4475F2" : textPrimary, fontWeight: !selectedCategory ? 600 : 400 }}
                  >
                    Semua Kategori
                    {!selectedCategory && <Check className="w-4 h-4 text-[#4475F2]" />}
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setVisibleCount(ITEMS_PER_PAGE); setFilterOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-[#4475F2]/08 transition-colors text-left"
                      style={{ color: selectedCategory === cat ? "#4475F2" : textPrimary, fontWeight: selectedCategory === cat ? 600 : 400, borderTop: `1px solid ${borderColor}` }}
                    >
                      {cat}
                      {selectedCategory === cat && <Check className="w-4 h-4 text-[#4475F2]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results count */}
        <div className="max-w-7xl mx-auto mb-5 flex items-center justify-between">
          <p className="text-sm" style={{ color: textMuted }}>
            Menampilkan{" "}
            <span style={{ color: textPrimary, fontWeight: 600 }}>{Math.min(visibleCount, filteredBooks.length)}</span>
            {" "}dari{" "}
            <span style={{ color: textPrimary, fontWeight: 600 }}>{filteredBooks.length}</span>{" "}
            koleksi{selectedCategory ? ` dalam "${selectedCategory}"` : ""}
          </p>
          {searchQuery && (
            <p className="text-sm" style={{ color: textMuted }}>
              Hasil: <span style={{ color: "#4475F2", fontWeight: 600 }}>"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Book Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {visibleBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isDark={isDark}
              surface={surface}
              textPrimary={textPrimary}
              textMuted={textMuted}
              borderColor={borderColor}
              isFavorite={favoriteSet.has(book.id)}
              onToggleFavorite={toggleFav}
              onClick={() => navigate(`/book/${book.id}`)}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: isDark ? "#334155" : "#D9E3FC" }} />
            <p className="text-base" style={{ color: textMuted }}>Tidak ada buku yang ditemukan</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
              className="mt-4 px-6 py-2 rounded-full text-sm text-[#4475F2]"
              style={{ backgroundColor: isDark ? "#1E3A5F" : "#D9E3FC" }}
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Muat Lebih Banyak */}
        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisibleCount((p) => p + ITEMS_PER_PAGE)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: isDark ? "#1E293B" : "#EEF2FF",
                color: "#4475F2",
                border: `1.5px solid ${isDark ? "#334155" : "#C7D8FC"}`,
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <ChevronDown className="w-4 h-4" />
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-8 py-10" style={{ borderTop: `1px solid ${borderColor}` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-7 h-7 object-contain" />
            <span style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
              Pustaka<span style={{ color: "#4475F2" }}>Nusa</span>
            </span>
          </div>
          <p className="text-sm text-center" style={{ color: textMuted }}>
            Pustaka Nusa © 2026 — Perpustakaan Digital STITEK Bontang
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── Book Card ── */
interface BookCardProps {
  book: any;
  isDark: boolean;
  surface: string;
  textPrimary: string;
  textMuted: string;
  borderColor: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
}

function BookCard({
  book, isDark, surface, textPrimary, textMuted, borderColor, isFavorite, onToggleFavorite, onClick,
}: BookCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group"
      style={{
        backgroundColor: surface,
        border: `1px solid ${borderColor}`,
        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)",
      }}
      onClick={onClick}
    >
      {/* Cover */}
      <div className="relative" style={{ paddingTop: "148%" }}>
        <img
          src={book.cover}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(book.id); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: "rgba(255,255,255,0.92)", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{ color: isFavorite ? "#EF4444" : "#94A3B8", fill: isFavorite ? "#EF4444" : "none" }}
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3.5">
        <div
          className="text-xs px-2 py-0.5 rounded-full inline-block mb-2 truncate max-w-full"
          style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2" }}
        >
          {book.category}
        </div>
        <h3
          className="text-sm line-clamp-2"
          style={{
            color: textPrimary,
            fontWeight: 600,
            lineHeight: 1.4,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {book.title}
        </h3>
        <p className="text-xs mt-1 line-clamp-1" style={{ color: textMuted }}>
          {book.author}
        </p>
        <p
          className="text-xs mt-2 pt-2"
          style={{ color: textMuted, borderTop: `1px solid ${borderColor}` }}
        >
          {book.year}
        </p>
      </div>
    </div>
  );
}