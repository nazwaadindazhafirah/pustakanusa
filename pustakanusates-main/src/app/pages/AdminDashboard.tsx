import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderOpen,
  Lightbulb,
  FileText,
  Activity,
  Download,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  X,
  Upload,
  Search,
  LogOut,
  Menu,
  CheckCircle,
  XCircle,
  Printer,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Filter,
  Calendar,
  RefreshCw,
  MessageSquare,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Pencil,
  Award,
  Clock,
  Square,
  CheckSquare,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useBooks, type SaranItem } from "../context/BookContext";
import { type Book } from "../data/books";
import axios from "axios";
// @ts-ignore
import logo from "../../imports/Tak_berjudul3_20260429090610.png";
// @ts-ignore
import libraryBg from "../../imports/LibraryBackground.jpg";

type AdminView =
  | "dashboard"
  | "users"
  | "ebooks"
  | "kategori"
  | "saran"
  | "laporan"
  | "log";

interface UserData {
  id: string;
  name: string;
  nimNidn: string;
  role: string;
  password: string;
  status: boolean;
  lastActive: string;
}

interface KategoriData {
  id: string;
  name: string;
  count: number;
  status: boolean;
}

// ── KPI Data by Year ──

const CHART_DATA_BY_YEAR: Record<string, any[]> = {
  "2025": [
    { day: "Sen", akses: 3, unduh: 1 },
    { day: "Sel", akses: 4, unduh: 2 },
    { day: "Rab", akses: 4, unduh: 1 },
    { day: "Kam", akses: 6, unduh: 3 },
    { day: "Jum", akses: 5, unduh: 2 },
    { day: "Sab", akses: 2, unduh: 1 },
    { day: "Min", akses: 1, unduh: 0 },
  ],
  "2026": [
    { day: "Sen", akses: 4, unduh: 2 },
    { day: "Sel", akses: 6, unduh: 3 },
    { day: "Rab", akses: 5, unduh: 2 },
    { day: "Kam", akses: 8, unduh: 4 },
    { day: "Jum", akses: 7, unduh: 3 },
    { day: "Sab", akses: 3, unduh: 1 },
    { day: "Min", akses: 2, unduh: 1 },
  ],
};



export function AdminDashboard() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Data States
  const [users, setUsers] = useState<UserData[]>([]);
  const [kategori, setKategori] = useState<KategoriData[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [saranList, setSaranList] = useState<SaranItem[]>([]);
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState({
  books: 0,
  users: 0,
  downloads: 0,
  saran: 0
});
const [monthlyData, setMonthlyData] = useState([]);

  // Fetch Functions
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users");
      if (res.data.success) {
        const mapped = res.data.data.map((u: any) => ({
          id: u.id.toString(),
          name: u.name,
          nimNidn: u.nim || u.nidn || "-",
          role: u.role === "admin" ? "Admin" : "User",
          password: "●●●●●●●●", // Tidak ditampilkan demi keamanan
          status: true, // asumsikan active
          lastActive: new Date(u.updated_at).toLocaleDateString()
        }));
        setUsers(mapped);
      }
    } catch(err) { console.error(err); }
  };

  const fetchEbooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/ebooks");
      if (res.data.success) {
        const mapped = res.data.data.map((b: any) => ({
          id: b.id.toString(),
          title: b.judul,
          author: b.penulis,
          category: b.category?.nama_kategori || 'Lainnya',
          category_id: b.category_id,
          year: b.tahun_terbit || new Date(b.created_at).getFullYear().toString(),
          cover: b.cover_image ? `http://127.0.0.1:8000/storage/${b.cover_image}` : null,
          status: b.status === 'tersedia' ? "active" : "inactive",
          downloads: b.jumlah_unduh || 0,
          isFavorite: false,
          language: b.bahasa || 'Indonesia',
          isbn: b.isbn || '-',
          pages: b.jumlah_halaman || 0,
          synopsis: b.deskripsi || '-',
          tanggalMasuk: b.tanggal_input || new Date(b.created_at).toISOString().split('T')[0],
          description: b.deskripsi || '-',
          pdfUrl: b.file_pdf ? `http://127.0.0.1:8000/storage/${b.file_pdf}` : null
        }));
        setBooks(mapped);
      }
    } catch(err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categories");
      if (res.data.success) {
        const mapped = res.data.data.map((k: any) => ({
          id: k.id.toString(),
          name: k.nama_kategori,
          count: 0, // Should be aggregate from ebooks if possible
          status: true
        }));
        setKategori(mapped);
      }
    } catch(err) { console.error(err); }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/suggestions");
      if (res.data.success) {
        const mapped = res.data.data.map((s: any) => ({
          id: s.id.toString(),
          user: s.user?.name || "—",
          nimNidn: s.user?.nim || s.user?.nidn || "—",
          judul: s.subjek,
          penulis: s.pesan.split("Penulis: ")[1]?.split("\n")[0] || "—",
          tanggal: new Date(s.created_at).toLocaleDateString("id-ID"),
          status: s.status || "Menunggu",
          catatan: s.pesan
        }));
        setSaranList(mapped);
      }
    } catch(err) { console.error(err); }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/logs");
      if (res.data.success) {
        const mapped = res.data.data.map((l: any) => ({
          id: l.id,
          actor: l.user?.name || "Sistem",
          action: l.action,
          detail: l.detail || "-",
          time: new Date(l.created_at).toLocaleString("id-ID"),
          type: "update", // asumsikan default, atau parsing action
          kategori: l.kategori || "Sistem"
        }));
        setAdminLogs(mapped);
      }
    } catch(err) { console.error(err); }
  };
  const fetchDashboard = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/dashboard");
    setDashboardData(res.data);
  } catch (err) {
    console.error(err);
  }
};
const fetchMonthly = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/dashboard/monthly");

    console.log("API Monthly:", res.data);

    setMonthlyData(res.data.data || []); // 🔥 ANTI CRASH

  } catch (err) {
    console.error(err);
    setMonthlyData([]); // 🔥 fallback
  }
};
  // Helper untuk mencatat log ke backend (pengganti addLog static)
  const addLog = async (entry: any) => {
    try {
      const me = users.find((u) => u.nimNidn === user?.nimNidn);
      if(me) {
        await axios.post("http://127.0.0.1:8000/api/logs", {
          user_id: me.id,
          action: entry.action,
          detail: entry.detail,
          kategori: entry.kategori
        });
        fetchLogs();
      }
    } catch(err) { console.error("Gagal mencatat log", err); }
  };

  useEffect(() => {
  fetchUsers();
  fetchEbooks();
  fetchCategories();
  fetchSuggestions();
  fetchLogs();
  fetchDashboard();
  fetchMonthly(); // 🔥 TAMBAH INI
}, []);

  const [selectedYear, setSelectedYear] = useState("2026");
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showKategoriModal, setShowKategoriModal] = useState(false);
  const [showSaranReadModal, setShowSaranReadModal] = useState<SaranItem | null>(null);
  const [showSaranStatusModal, setShowSaranStatusModal] = useState<SaranItem | null>(null);
  const [showBookDetailModal, setShowBookDetailModal] = useState<Book | null>(null);
  const [showEditKategoriModal, setShowEditKategoriModal] = useState<KategoriData | null>(null);

  // Edit targets
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; label?: string } | null>(null);

  // Delete animation
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Bulk selection
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());
  const [bulkDeleteModal, setBulkDeleteModal] = useState<{ type: "users" | "books"; count: number } | null>(null);

  const adminName = user?.name || "Administrator";

  const bg = isDark ? "#0F172A" : "#F1F5F9";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  const navItems: { key: AdminView; icon: typeof LayoutDashboard; label: string }[] = [
    { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { key: "users", icon: Users, label: "Manajemen User" },
    { key: "ebooks", icon: BookOpen, label: "Manajemen E-book" },
    { key: "kategori", icon: FolderOpen, label: "Manajemen Kategori" },
    { key: "saran", icon: Lightbulb, label: "Saran Buku" },
    { key: "log", icon: Activity, label: "Log Aktivitas" },
    { key: "laporan", icon: FileText, label: "Laporan" },
  ];

  
  const kpiCards = [
  {
    label: "Total E-book",
    value: dashboardData.books,
    sub: "Koleksi tersedia",
    color: "#4475F2",
    bg: isDark ? "#1E3A5F" : "#EEF2FF",
    icon: BookOpen
  },
  {
    label: "User Aktif",
    value: dashboardData.users,
    sub: "Total user",
    color: "#22C55E",
    bg: isDark ? "#14352A" : "#F0FDF4",
    icon: Users
  },
  {
    label: "Total Unduhan",
    value: dashboardData.downloads,
    sub: "Data real",
    color: "#F97316",
    bg: isDark ? "#2D1C0A" : "#FFF7ED",
    icon: Download
  },
  {
    label: "Saran Masuk",
    value: dashboardData.saran,
    sub: "Perlu ditinjau",
    color: "#A855F7",
    bg: isDark ? "#27143F" : "#FAF5FF",
    icon: Lightbulb
  },
];

  // ── Handlers ──
  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    const { type, id, label } = deleteTarget;

    try {
      if (type === "book") {
        setDeletingBookId(id);
        await axios.delete(`http://127.0.0.1:8000/api/ebooks/${id}`);
        fetchEbooks();
        addLog({ actor: adminName, action: "menghapus e-book", detail: label || "", type: "delete", kategori: "Koleksi" });
        toast.success(`E-book "${label}" berhasil dihapus.`);
        setDeletingBookId(null);
      } else if (type === "user") {
        setDeletingUserId(id);
        await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
        fetchUsers();
        addLog({ actor: adminName, action: "menghapus user", detail: label || "", type: "delete", kategori: "Sistem" });
        toast.success(`User "${label}" berhasil dihapus.`);
        setDeletingUserId(null);
      } else if (type === "saran") {
        await axios.delete(`http://127.0.0.1:8000/api/suggestions/${id}`);
        fetchSuggestions();
        addLog({ actor: adminName, action: "menghapus saran buku", detail: label || "", type: "delete", kategori: "Sistem" });
        toast.success("Saran berhasil dihapus.");
      } else if (type === "kategori") {
        await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
        fetchCategories();
        addLog({ actor: adminName, action: "menghapus kategori", detail: `Kategori: ${label}`, type: "delete", kategori: "Sistem" });
        toast.success(`Kategori "${label}" berhasil dihapus.`);
      }
    } catch (err) {
      toast.error(`Gagal menghapus ${type}.`);
      setDeletingBookId(null);
      setDeletingUserId(null);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSaveUser = async (userData: Omit<UserData, "id" | "lastActive">) => {
    try {
      if (editUser) {
        await axios.put(`http://127.0.0.1:8000/api/users/${editUser.id}`, {
          name: userData.name,
          email: `${userData.nimNidn}@example.com`,
          password: userData.password !== "●●●●●●●●" ? userData.password : undefined,
          role: userData.role === "Admin" ? "admin" : "user",
          nim: userData.role === "User" ? userData.nimNidn : undefined,
          nidn: userData.role === "Admin" ? userData.nimNidn : undefined
        });
        addLog({ actor: adminName, action: "memperbarui data user", detail: userData.name, type: "update", kategori: "Sistem" });
        toast.success("Data user berhasil diperbarui.");
      } else {
        await axios.post("http://127.0.0.1:8000/api/users", {
          name: userData.name,
          email: `${userData.nimNidn}@example.com`, // Dummy email
          password: userData.password,
          role: userData.role === "Admin" ? "admin" : "user",
          nim: userData.role === "User" ? userData.nimNidn : undefined,
          nidn: userData.role === "Admin" ? userData.nimNidn : undefined
        });
        addLog({ actor: adminName, action: "menambahkan user baru", detail: `${userData.name} (${userData.nimNidn})`, type: "add", kategori: "Sistem" });
        toast.success("User baru berhasil ditambahkan.");
      }
      fetchUsers();
    } catch(err) { toast.error("Gagal menyimpan user."); }
    setShowUserModal(false);
  };

  const handleSaveBook = async (bookData: any, filePdf: any, coverImage: any) => {
    try {
      const formData = new FormData();

      formData.append("judul", bookData.title || "");
      formData.append("penulis", bookData.author || "");

      if (!bookData.category) {
        toast.error("Kategori wajib dipilih!");
        return;
      }

      formData.append("category_id", bookData.category);

      formData.append("deskripsi", bookData.description || bookData.synopsis || "-");
      formData.append("isbn", bookData.isbn || "-");
      formData.append("jumlah_halaman", bookData.pages?.toString() || "0");
      formData.append("tahun_terbit", bookData.year || "2024");

      formData.append(
        "tanggal_input",
        new Date().toISOString().split("T")[0]
      );

      formData.append(
        "status",
        bookData.status === "active" ? "tersedia" : "tidak_tersedia"
      );

      if (filePdf) {
        formData.append("file_pdf", filePdf);
      } else if (!editBook) {
        toast.error("File PDF wajib!");
        return;
      }

      if (coverImage) {
        formData.append("cover_image", coverImage);
      }

      if (editBook) {
        formData.append("_method", "PUT");
        await axios.post(
          `http://127.0.0.1:8000/api/ebooks/${editBook.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Ebook berhasil diperbarui!");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/ebooks",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Ebook berhasil ditambahkan!");
      }

      fetchEbooks();
      setShowBookModal(false);
      setEditBook(null);

    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan ebook");
    }
  };
  
    // 🔥 FIX CATEGORY (WAJIB ADA)
   
  const handleRenameKategori = async (id: string, newName: string) => {
    const old = kategori.find((k) => k.id === id);
    if (!old) return;
    try {
      await axios.put(`http://127.0.0.1:8000/api/categories/${id}`, { nama_kategori: newName, slug: newName.toLowerCase().replace(/ /g, "-") });
      fetchCategories();
      fetchEbooks();
      addLog({ actor: adminName, action: "memperbarui nama kategori", detail: `"${old.name}" → "${newName}"`, type: "update", kategori: "Sistem" });
      toast.success(`Kategori "${old.name}" → "${newName}" berhasil diperbarui.`);
    } catch(err) { toast.error("Gagal memperbarui nama kategori."); }
    setShowEditKategoriModal(null);
  };

  const handleDeleteKategoriWithCheck = (id: string, name: string) => {
    const linked = books.filter((b) => b.category === name).length;
    if (linked > 0) {
      toast.error(`Tidak dapat menghapus "${name}" — masih ada ${linked} e-book terhubung. Pindahkan kategori e-book tersebut terlebih dahulu.`);
      return;
    }
    setDeleteTarget({ type: "kategori", id, label: name });
  };

  const toggleUserStatus = async (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    try {
      const nextStatus = !target.status;
      // Asumsi role & status ditangani di controller backend. Namun di sini kita put ulang role default
      await axios.put(`http://127.0.0.1:8000/api/users/${id}`, { status: nextStatus });
      fetchUsers();
      addLog({ actor: adminName, action: `memperbarui status user`, detail: `${target.name} → ${nextStatus ? "Aktif" : "Nonaktif"}`, type: "update", kategori: "Sistem" });
      toast(nextStatus ? "User Berhasil Diaktifkan" : "User Berhasil Dinonaktifkan", { style: { backgroundColor: nextStatus ? "#22C55E" : "#F97316", color: "white" } });
    } catch(err) { toast.error("Gagal update user."); }
  };

  const toggleBookStatus = async (id: string) => {
    const target = books.find((b) => b.id === id);
    if (!target) return;
    try {
      const nextStatus = target.status === "active" ? "dipinjam" : "tersedia";
      await axios.put(`http://127.0.0.1:8000/api/ebooks/${id}`, { status: nextStatus });
      fetchEbooks();
      addLog({ actor: adminName, action: nextStatus === "tersedia" ? "mengaktifkan e-book" : "menonaktifkan e-book", detail: target.title, type: "update", kategori: target.category });
      toast(nextStatus === "tersedia" ? "E-book Diaktifkan" : "E-book Dinonaktifkan", { style: { backgroundColor: nextStatus === "tersedia" ? "#22C55E" : "#F97316", color: "white" } });
    } catch(err) { toast.error("Gagal update ebook."); }
  };

  const toggleKategoriStatus = async (id: string) => {
    const target = kategori.find((k) => k.id === id);
    if (!target) return;
    try {
      const nextStatus = !target.status;
      await axios.put(`http://127.0.0.1:8000/api/categories/${id}`, { status: nextStatus });
      fetchCategories();
      addLog({ actor: adminName, action: nextStatus ? "mengaktifkan kategori" : "menonaktifkan kategori", detail: `Kategori: ${target.name}`, type: "update", kategori: "Sistem" });
      toast(nextStatus ? "Kategori Diaktifkan" : "Kategori Dinonaktifkan", { style: { backgroundColor: nextStatus ? "#22C55E" : "#64748B", color: "white" } });
    } catch(err) { toast.error("Gagal update kategori."); }
  };

  const updateSaranStatus = async (id: string, newStatus: string) => {
    const saranItem = saranList.find((s) => s.id === id);
    try {
      await axios.put(`http://127.0.0.1:8000/api/suggestions/${id}`, { status: newStatus });
      fetchSuggestions();
      addLog({ actor: adminName, action: `memperbarui status saran`, detail: `"${saranItem?.judul || ""}" → ${newStatus}`, type: "update", kategori: "Sistem" });
      if (newStatus === "Diterima") {
        toast.success(`Saran diterima! Notifikasi terkirim ke pengguna: "Saran buku Anda telah diterima dan akan segera tersedia!"`);
      } else {
        toast.success(`Status berhasil diperbarui → "${newStatus}".`);
      }
    } catch(err) { toast.error("Gagal mengupdate saran."); }
    setShowSaranStatusModal(null);
  };

  // Bulk actions
  const handleBulkDeleteUsers = async () => {
    const count = selectedUserIds.size;
    for (const uid of selectedUserIds) {
      await axios.delete(`http://127.0.0.1:8000/api/users/${uid}`).catch(() => {});
    }
    fetchUsers();
    addLog({ actor: adminName, action: `menghapus massal ${count} user`, detail: `Bulk delete: ${count} user`, type: "delete", kategori: "Sistem" });
    toast.success(`${count} user berhasil dihapus.`);
    setSelectedUserIds(new Set());
    setBulkDeleteModal(null);
  };

  const handleBulkDeleteBooks = async () => {
    const count = selectedBookIds.size;
    for (const bid of selectedBookIds) {
      await axios.delete(`http://127.0.0.1:8000/api/ebooks/${bid}`).catch(() => {});
    }
    fetchEbooks();
    addLog({ actor: adminName, action: `menghapus massal ${count} e-book`, detail: `Bulk delete: ${count} e-book`, type: "delete", kategori: "Sistem" });
    toast.success(`${count} e-book berhasil dihapus.`);
    setSelectedBookIds(new Set());
    setBulkDeleteModal(null);
  };

  return (
    <div
      className="flex min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}
    >
      <Toaster position="top-right" richColors />

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 overflow-hidden ${sidebarOpen ? "w-64" : "w-16"}`}
        style={{ boxShadow: "4px 0 32px rgba(0,0,0,0.2)" }}
      >
        {/* Background: library image always visible, overlay adapts to theme */}
        {/* Light: blue overlay 75% | Dark: deep navy overlay 82% */}
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${libraryBg})` }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: isDark
                ? "rgba(8, 16, 38, 0.82)"
                : "rgba(79, 125, 243, 0.75)",
            }}
          />
          {/* Subtle depth gradient — always present */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.24) 100%)" }}
          />
        </>

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <img src={logo} alt="logo" className="w-9 h-9 object-contain flex-shrink-0" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
            {sidebarOpen && (
              <span className="text-white text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                Pustaka<span style={{ color: "#D9E3FC" }}>Nusa</span>
              </span>
            )}
          </div>

          {/* Admin info */}
          {sidebarOpen && (
            <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)", fontWeight: 700 }}>
                  {adminName[0]?.toUpperCase() || "A"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-white text-xs truncate" style={{ fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{adminName}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>Administrator</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                title={!sidebarOpen ? label : undefined}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
                style={{
                  backgroundColor: activeView === key ? "rgba(255,255,255,0.22)" : "transparent",
                  color: activeView === key ? "#FFFFFF" : "rgba(255,255,255,0.72)",
                  backdropFilter: activeView === key ? "blur(8px)" : "none",
                  boxShadow: activeView === key ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                  borderLeft: activeView === key ? "3px solid rgba(255,255,255,0.8)" : "3px solid transparent",
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} />
                {sidebarOpen && (
                  <span className="text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: activeView === key ? 700 : 500, textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
                    {label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-red-500/20 text-left"
              style={{ color: "rgba(255,200,200,0.9)" }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>Keluar</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300" style={{ marginLeft: sidebarOpen ? "256px" : "64px" }}>
        {/* Header */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-5 h-16"
          style={{
            backgroundColor: surface,
            borderBottom: `1px solid ${borderColor}`,
            boxShadow: isDark ? "0 1px 12px rgba(0,0,0,0.3)" : "0 1px 12px rgba(0,0,0,0.06)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[#4475F2]/10"
              style={{ color: textMuted }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base" style={{ color: textPrimary, fontWeight: 700 }}>
                {navItems.find((n) => n.key === activeView)?.label}
              </h1>
              <p className="text-xs" style={{ color: textMuted }}>Pustaka Nusa — Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle size="sm" />

            {/* Year filter */}
            {activeView === "dashboard" && (
              <div className="relative">
                <button
                  onClick={() => setShowYearDropdown((p) => !p)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2", border: "1.5px solid rgba(68,117,242,0.25)", fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <Calendar className="w-4 h-4" />
                  {selectedYear}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showYearDropdown ? "rotate-180" : ""}`} />
                </button>
                {showYearDropdown && (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-50 rounded-xl overflow-hidden shadow-xl" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, minWidth: "110px" }}>
                    {["2025", "2026"].map((y) => (
                      <button
                        key={y}
                        onClick={() => { setSelectedYear(y); setShowYearDropdown(false); }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#4475F2]/08 transition-colors text-left"
                        style={{ color: selectedYear === y ? "#4475F2" : textPrimary, fontWeight: selectedYear === y ? 700 : 400 }}
                      >
                        {y}
                        {selectedYear === y && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: isDark ? "#0F172A" : "#F1F5F9" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs" style={{ background: "linear-gradient(135deg, #4475F2, #789DFC)", fontWeight: 700 }}>
                {adminName[0]?.toUpperCase() || "A"}
              </div>
              <span className="text-sm hidden md:block" style={{ color: textPrimary, fontWeight: 600 }}>{adminName}</span>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 px-6 pt-4 pb-0 text-xs" style={{ color: textMuted }}>
          <button className="hover:text-[#4475F2] transition-colors" style={{ fontWeight: 500 }} onClick={() => setActiveView("dashboard")}>
            Admin Panel
          </button>
          {activeView !== "dashboard" && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span style={{ color: textPrimary, fontWeight: 600 }}>
                {navItems.find((n) => n.key === activeView)?.label}
              </span>
            </>
          )}
        </div>

        {/* Content */}
        <main className="flex-1 p-5 md:p-6 overflow-auto">
          {activeView === "dashboard" && (
            <DashboardView
              isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
              kpiCards={kpiCards} selectedYear={selectedYear}
              weeklyData={CHART_DATA_BY_YEAR[selectedYear]}
              monthlyData={monthlyData}
            />
          )}
          {activeView === "users" && (
            <UsersView
              users={users} isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
              onToggleStatus={toggleUserStatus}
              onEdit={(u: UserData) => { setEditUser(u); setShowUserModal(true); }}
              onDelete={(id: string, name: string) => setDeleteTarget({ type: "user", id, label: name })}
              onAdd={() => { setEditUser(null); setShowUserModal(true); }}
              deletingId={deletingUserId}
              selectedIds={selectedUserIds}
              onSelectId={(id: string) => setSelectedUserIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; })}
              onSelectAll={(ids: string[]) => setSelectedUserIds(new Set(ids))}
              onClearSelection={() => setSelectedUserIds(new Set())}
              onBulkDelete={() => setBulkDeleteModal({ type: "users", count: selectedUserIds.size })}
            />
          )}
          {activeView === "ebooks" && (
            <EbooksView
              books={books} isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
              onToggleStatus={toggleBookStatus}
              onView={(b: Book) => setShowBookDetailModal(b)}
              onEdit={(b: Book) => { setEditBook(b); setShowBookModal(true); }}
              onDelete={(id: string, title: string) => setDeleteTarget({ type: "book", id, label: title })}
              onAdd={() => { setEditBook(null); setShowBookModal(true); }}
              deletingId={deletingBookId}
              selectedIds={selectedBookIds}
              onSelectId={(id: string) => setSelectedBookIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; })}
              onSelectAll={(ids: string[]) => setSelectedBookIds(new Set(ids))}
              onClearSelection={() => setSelectedBookIds(new Set())}
              onBulkDelete={() => setBulkDeleteModal({ type: "books", count: selectedBookIds.size })}
            />
          )}
          {activeView === "kategori" && (
            <KategoriView
              kategori={kategori} books={books} isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
              onToggle={toggleKategoriStatus}
              onDelete={handleDeleteKategoriWithCheck}
              onAdd={() => setShowKategoriModal(true)}
              onEdit={(k: KategoriData) => setShowEditKategoriModal(k)}
            />
          )}
          {activeView === "saran" && (
            <SaranView
              saranList={saranList} isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
              onDelete={(id: string, judul: string) => setDeleteTarget({ type: "saran", id, label: judul })}
              onRead={(s: SaranItem) => setShowSaranReadModal(s)}
              onEditStatus={(s: SaranItem) => setShowSaranStatusModal(s)}
            />
          )}
          {activeView === "laporan" && (
            <LaporanView
              isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
              books={books} kategori={kategori} saranList={saranList}
            />
          )}
          {activeView === "log" && (
            <LogView isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor} logs={adminLogs} />
          )}
        </main>
      </div>

      {/* ── Book Detail Modal ── */}
      {showBookDetailModal && (
        <BookDetailModal
          book={showBookDetailModal}
          isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
          onClose={() => setShowBookDetailModal(null)}
          onEdit={() => { setEditBook(showBookDetailModal); setShowBookDetailModal(null); setShowBookModal(true); }}
          onDelete={() => { setDeleteTarget({ type: "book", id: showBookDetailModal.id, label: showBookDetailModal.title }); setShowBookDetailModal(null); }}
        />
      )}

      {/* ── Book Modal ── */}
      {showBookModal && (
  <BookModal
    book={editBook}
    kategori={kategori} // 🔥 FIX WAJIB
    isDark={isDark}
    surface={surface}
    textPrimary={textPrimary}
    textMuted={textMuted}
    borderColor={borderColor}
    onClose={() => setShowBookModal(false)}
    onSave={handleSaveBook}
  />
)}

      {/* ── User Modal ── */}
      {showUserModal && (
        <UserModal
          user={editUser}
          isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
          onClose={() => setShowUserModal(false)}
          onSave={handleSaveUser}
        />
      )}

      {/* ── Kategori Add Modal ── */}
      {showKategoriModal && (
        <KategoriModal
          isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
          onClose={() => setShowKategoriModal(false)}
          onSave={async (name: string) => {
            try {
               await axios.post("http://127.0.0.1:8000/api/categories", {
                 nama_kategori: name,
                 slug: name.toLowerCase().replace(/ /g, '-')
               });
               fetchCategories();
               setShowKategoriModal(false);
               addLog({ actor: adminName, action: "menambahkan kategori baru", detail: `Kategori: ${name}`, type: "add", kategori: "Sistem" });
               toast.success(`Kategori "${name}" berhasil ditambahkan.`);
            } catch (err) {
               toast.error("Gagal menambah kategori");
            }
          }}
        />
      )}

      {/* ── Kategori Edit Modal ── */}
      {showEditKategoriModal && (
        <KategoriEditModal
          kategori={showEditKategoriModal}
          isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
          onClose={() => setShowEditKategoriModal(null)}
          onSave={(newName: string) => handleRenameKategori(showEditKategoriModal.id, newName)}
        />
      )}

      {/* ── Saran Read Modal ── */}
      {showSaranReadModal && (
        <SaranReadModal
          saran={showSaranReadModal}
          isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
          onClose={() => setShowSaranReadModal(null)}
        />
      )}

      {/* ── Saran Status Modal ── */}
      {showSaranStatusModal && (
        <SaranStatusModal
          saran={showSaranStatusModal}
          isDark={isDark} surface={surface} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor}
          onClose={() => setShowSaranStatusModal(null)}
          onSave={(newStatus: string) => updateSaranStatus(showSaranStatusModal.id, newStatus)}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm mx-4 p-7 rounded-2xl" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(239,68,68,0.1)" }}>
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.05rem" }}>Konfirmasi Hapus</h3>
                <p className="text-xs mt-0.5" style={{ color: textMuted }}>Tindakan tidak dapat dibatalkan</p>
              </div>
            </div>
            {deleteTarget.label && (
              <div className="px-4 py-3 rounded-xl mb-4 text-sm" style={{ backgroundColor: isDark ? "#0F172A" : "#FFF5F5", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                "{deleteTarget.label}"
              </div>
            )}
            <p className="text-sm mb-6" style={{ color: textMuted, lineHeight: 1.6 }}>
              Apakah Anda yakin ingin menghapus data ini? Data akan dihapus secara permanen dari sistem.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 rounded-xl text-sm transition-all hover:opacity-80" style={{ border: `1px solid ${borderColor}`, color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Batal</button>
              <button onClick={handleDeleteConfirmed} className="flex-1 py-3 rounded-xl text-sm text-white hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: "#EF4444", fontWeight: 700 }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Delete Modal ── */}
      {bulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm mx-4 p-7 rounded-2xl" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(239,68,68,0.1)" }}>
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.05rem" }}>Hapus Massal</h3>
                <p className="text-xs mt-0.5" style={{ color: textMuted }}>{bulkDeleteModal.count} item dipilih</p>
              </div>
            </div>
            <p className="text-sm mb-6" style={{ color: textMuted, lineHeight: 1.6 }}>
              Hapus <strong>{bulkDeleteModal.count} {bulkDeleteModal.type === "users" ? "user" : "e-book"}</strong> sekaligus? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setBulkDeleteModal(null)} className="flex-1 py-3 rounded-xl text-sm" style={{ border: `1px solid ${borderColor}`, color: textMuted }}>Batal</button>
              <button
                onClick={bulkDeleteModal.type === "users" ? handleBulkDeleteUsers : handleBulkDeleteBooks}
                className="flex-1 py-3 rounded-xl text-sm text-white hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: "#EF4444", fontWeight: 700 }}
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard View ───
function DashboardView({ isDark, surface, textPrimary, textMuted, borderColor, kpiCards, selectedYear, weeklyData, monthlyData }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card: any) => (
          <div
            key={card.label}
            className="p-5 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ backgroundColor: surface, border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs mb-1" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{card.label}</p>
                <p className="text-3xl" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>{card.value}</p>
                <p className="text-xs mt-1" style={{ color: card.color, fontWeight: 600 }}>{card.sub}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-xs px-2 py-1 rounded-lg w-fit" style={{ backgroundColor: card.bg, color: card.color, fontWeight: 600 }}>
              Tahun {selectedYear}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-6 rounded-2xl" style={{ backgroundColor: surface, border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)" }}>
          <h3 className="text-sm mb-1" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Aktivitas Mingguan</h3>
          <p className="text-xs mb-5" style={{ color: textMuted }}>Data akses & unduhan — {selectedYear}</p>
          <div style={{ height: "200px", width: "100%" }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <XAxis key="x" dataKey="day" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                <YAxis key="y" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                <Tooltip key="tt" contentStyle={{ backgroundColor: isDark ? "#1E293B" : "#fff", border: `1px solid ${borderColor}`, borderRadius: "12px", fontSize: "12px" }} />
                <Line key="l-akses" type="monotone" dataKey="akses" stroke="#4475F2" strokeWidth={2.5} dot={false} name="Akses" />
                <Line key="l-unduh" type="monotone" dataKey="unduh" stroke="#F97316" strokeWidth={2.5} dot={false} name="Unduhan" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-5 mt-3">
            {[{ label: "Akses Buku", color: "#4475F2" }, { label: "Unduhan", color: "#F97316" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded-full inline-block" style={{ backgroundColor: l.color }} />
                <span className="text-xs" style={{ color: textMuted }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl" style={{ backgroundColor: surface, border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)" }}>
          <h3 className="text-sm mb-1" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Statistik Bulanan</h3>
          <p className="text-xs mb-4" style={{ color: textMuted }}>{selectedYear}</p>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                {["Bulan", "Buku", "User", "Unduh"].map(h => (
                  <th key={h} className="text-left pb-2.5" style={{ color: textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
             {Array.isArray(monthlyData) &&
  monthlyData.map((row: any, i: number) => (
    <tr
      key={i}
      style={{
        borderBottom: `1px solid ${borderColor}`,
        backgroundColor:
          i % 2 === 0
            ? "transparent"
            : isDark
            ? "rgba(255,255,255,0.02)"
            : "rgba(0,0,0,0.01)",
      }}
    >
      <td className="py-2.5" style={{ color: textMuted }}>
        {row.month}
      </td>
      <td className="py-2.5 font-semibold" style={{ color: "#4475F2" }}>
        {row.buku}
      </td>
      <td className="py-2.5 font-semibold" style={{ color: "#22C55E" }}>
        {row.user}
      </td>
      <td className="py-2.5 font-semibold" style={{ color: "#F97316" }}>
        {row.unduh}
      </td>
    </tr>
  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Shared: PAGE SIZE ───
const PAGE_SIZE = 10;

// ─── Shared: Pagination Component ───
function Pagination({ total, currentPage, onPageChange, isDark, textPrimary, textMuted, borderColor }: {
  total: number; currentPage: number; onPageChange: (p: number) => void;
  isDark: boolean; textPrimary: string; textMuted: string; borderColor: string;
}) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) return null;
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };
  const from = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const to = Math.min(currentPage * PAGE_SIZE, total);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4" style={{ borderTop: `1px solid ${borderColor}` }}>
      <p className="text-sm" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Menampilkan <span style={{ color: textPrimary, fontWeight: 600 }}>{from}–{to}</span> dari{" "}
        <span style={{ color: textPrimary, fontWeight: 600 }}>{total}</span> data
      </p>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
          className="px-3.5 py-1.5 rounded-xl text-sm transition-all hover:opacity-80 disabled:opacity-35 disabled:cursor-not-allowed"
          style={{ border: `1.5px solid ${borderColor}`, color: "#4F7DF3", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, background: "transparent" }}>
          ← Sebelumnya
        </button>
        {getPages().map((p, i) => p === "..." ? (
          <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-sm" style={{ color: textMuted }}>…</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p as number)}
            className="w-8 h-8 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ backgroundColor: currentPage === p ? "#4F7DF3" : "transparent", color: currentPage === p ? "#FFF" : textPrimary, border: currentPage === p ? "none" : `1.5px solid ${borderColor}`, fontWeight: currentPage === p ? 700 : 500, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === Math.ceil(total / PAGE_SIZE)}
          className="px-3.5 py-1.5 rounded-xl text-sm transition-all hover:opacity-80 disabled:opacity-35 disabled:cursor-not-allowed"
          style={{ border: `1.5px solid ${borderColor}`, color: "#4F7DF3", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, background: "transparent" }}>
          Berikutnya →
        </button>
      </div>
    </div>
  );
}

// ─── Shared: Skeleton Rows ───
function SkeletonRows({ cols, isDark }: { cols: number; isDark: boolean }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div className="h-4 rounded-lg" style={{ backgroundColor: isDark ? "#334155" : "#F1F5F9", width: ["50%","70%","40%","60%","30%"][j % 5] }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Users View ───
function UsersView({ users, isDark, surface, textPrimary, textMuted, borderColor, onToggleStatus, onEdit, onDelete, onAdd, deletingId, selectedIds, onSelectId, onSelectAll, onClearSelection, onBulkDelete }: any) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [skelLoading, setSkelLoading] = useState(false);
  const filtered = users.filter((u: any) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.nimNidn.toLowerCase().includes(search.toLowerCase())
  );
  const allFilteredSelected = filtered.length > 0 && filtered.every((u: any) => selectedIds.has(u.id));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePageChange = (p: number) => { setSkelLoading(true); setTimeout(() => { setPage(p); setSkelLoading(false); }, 300); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 sm:max-w-sm" style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}>
          <Search className="w-4 h-4 text-[#4475F2]" />
          <input type="text" placeholder="Cari nama atau NIM/NIDN..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="flex-1 bg-transparent text-sm outline-none" style={{ color: textPrimary }} />
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button onClick={onBulkDelete} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: "#EF4444", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Trash2 className="w-4 h-4" /> Hapus {selectedIds.size} Terpilih
            </button>
          )}
          <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: "#4475F2", fontWeight: 700, boxShadow: "0 4px 12px rgba(68,117,242,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Plus className="w-4 h-4" /> Tambah User
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState textMuted={textMuted} label="user" />
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
                  <th className="text-left px-4 py-3.5">
                    <button onClick={() => allFilteredSelected ? onClearSelection() : onSelectAll(filtered.map((u: any) => u.id))}>
                      {allFilteredSelected ? <CheckSquare className="w-4 h-4 text-[#4475F2]" /> : <Square className="w-4 h-4" style={{ color: textMuted }} />}
                    </button>
                  </th>
                  {["Nama", "NIM/NIDN", "Role", "Status", "Aksi"].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skelLoading ? <SkeletonRows cols={6} isDark={isDark} /> : paginated.map((u: any, i: number) => (
                  <tr key={u.id} className="hover:bg-[#4475F2]/5 transition-all"
                    style={{
                      borderBottom: i < paginated.length - 1 ? `1px solid ${borderColor}` : "none",
                      backgroundColor: selectedIds.has(u.id) ? (isDark ? "rgba(68,117,242,0.08)" : "rgba(68,117,242,0.04)") : i % 2 !== 0 ? (isDark ? "rgba(255,255,255,0.015)" : "rgba(248,250,252,0.7)") : "transparent",
                      opacity: deletingId === u.id ? 0 : 1,
                      transform: deletingId === u.id ? "translateX(20px)" : "none",
                      transition: "all 0.35s ease-out",
                    }}>
                    <td className="px-4 py-4"><button onClick={() => onSelectId(u.id)}>{selectedIds.has(u.id) ? <CheckSquare className="w-4 h-4 text-[#4475F2]" /> : <Square className="w-4 h-4" style={{ color: textMuted }} />}</button></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #4475F2, #789DFC)", fontWeight: 700 }}>{u.name[0]}</div>
                        <div><span className="text-sm" style={{ color: textPrimary, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{u.name}</span><p className="text-xs" style={{ color: textMuted }}>{u.lastActive}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-mono whitespace-nowrap" style={{ color: textMuted }}>{u.nimNidn}</td>
                    <td className="px-4 py-4"><span className="px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: u.role === "Admin" ? "rgba(168,85,247,0.12)" : isDark ? "#1E3A5F" : "#D9E3FC", color: u.role === "Admin" ? "#A855F7" : "#4475F2", fontWeight: 600 }}>{u.role}</span></td>
                    <td className="px-4 py-4">
                      <button onClick={() => onToggleStatus(u.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80 whitespace-nowrap" style={{ backgroundColor: u.status ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: u.status ? "#22C55E" : "#EF4444", fontWeight: 600 }}>
                        {u.status ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}{u.status ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => onEdit(u)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-yellow-500/10 transition-colors" style={{ color: "#F59E0B" }}><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(u.id, u.name)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: "#EF4444" }}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination total={filtered.length} currentPage={page} onPageChange={handlePageChange} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor} />
        </div>
      )}
    </div>
  );
}

// ─── Ebooks View ───
function EbooksView({ books, isDark, surface, textPrimary, textMuted, borderColor, onToggleStatus, onView, onEdit, onDelete, onAdd, deletingId, selectedIds, onSelectId, onSelectAll, onClearSelection, onBulkDelete }: any) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [skelLoading, setSkelLoading] = useState(false);
  const [sortCol, setSortCol] = useState<"tanggalMasuk" | "title" | "year">("tanggalMasuk");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const handleSort = (col: "tanggalMasuk" | "title" | "year") => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
    setPage(1);
  };

  const formatTanggal = (d?: string) => {
    if (!d) return "—";
    const [y, m, day] = d.split("-");
    return `${day}-${m}-${y}`;
  };

  const filtered = (books as Book[]).filter((b: Book) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  ).sort((a: Book, b: Book) => {
    let cmp = 0;
    if (sortCol === "tanggalMasuk") cmp = (a.tanggalMasuk || "").localeCompare(b.tanggalMasuk || "");
    else if (sortCol === "year") cmp = (a.year || 0) - (b.year || 0);
    else cmp = a.title.localeCompare(b.title);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every((b: any) => selectedIds.has(b.id));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePageChange = (p: number) => { setSkelLoading(true); setTimeout(() => { setPage(p); setSkelLoading(false); }, 300); };
  const SortIcon = ({ col }: { col: "tanggalMasuk" | "title" | "year" }) => (
    sortCol === col
      ? <span className="ml-1" style={{ color: "#4475F2" }}>{sortDir === "asc" ? "↑" : "↓"}</span>
      : <span className="ml-1" style={{ color: textMuted, opacity: 0.4 }}>↕</span>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 sm:max-w-sm" style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}>
          <Search className="w-4 h-4 text-[#4475F2]" />
          <input type="text" placeholder="Cari judul atau penulis..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="flex-1 bg-transparent text-sm outline-none" style={{ color: textPrimary }} />
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm"
              style={{ backgroundColor: "#EF4444", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Trash2 className="w-4 h-4" />
              Hapus {selectedIds.size} Terpilih
            </button>
          )}
          <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: "#4475F2", fontWeight: 700, boxShadow: "0 4px 12px rgba(68,117,242,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Plus className="w-4 h-4" /> Tambah Buku Baru
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState textMuted={textMuted} label="e-book" />
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
                  <th className="text-left px-4 py-3.5">
                    <button onClick={() => allFilteredSelected ? onClearSelection() : onSelectAll(filtered.map((b: any) => b.id))}>
                      {allFilteredSelected
                        ? <CheckSquare className="w-4 h-4 text-[#4475F2]" />
                        : <Square className="w-4 h-4" style={{ color: textMuted }} />
                      }
                    </button>
                  </th>
                  {["Cover"].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs uppercase tracking-wide" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{h}</th>
                  ))}
                  <th className="text-left px-4 py-3.5 text-xs uppercase tracking-wide cursor-pointer select-none hover:opacity-80" onClick={() => handleSort("title")} style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Judul & Penulis<SortIcon col="title" />
                  </th>
                  {["Kategori"].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs uppercase tracking-wide" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{h}</th>
                  ))}
                  <th className="text-left px-4 py-3.5 text-xs uppercase tracking-wide cursor-pointer select-none hover:opacity-80" onClick={() => handleSort("year")} style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Tahun<SortIcon col="year" />
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs uppercase tracking-wide cursor-pointer select-none hover:opacity-80 whitespace-nowrap" onClick={() => handleSort("tanggalMasuk")} style={{ color: sortCol === "tanggalMasuk" ? "#4475F2" : textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Tgl. Ditambahkan<SortIcon col="tanggalMasuk" />
                  </th>
                  {["Status", "Aksi"].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs uppercase tracking-wide" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skelLoading ? <SkeletonRows cols={7} isDark={isDark} /> : paginated.map((book: Book, i: number) => (
                  <tr
                    key={book.id}
                    className="hover:bg-[#4475F2]/5 transition-all"
                    style={{
                      borderBottom: i < paginated.length - 1 ? `1px solid ${borderColor}` : "none",
                      backgroundColor: selectedIds.has(book.id) ? (isDark ? "rgba(68,117,242,0.08)" : "rgba(68,117,242,0.04)") : i % 2 !== 0 ? (isDark ? "rgba(255,255,255,0.015)" : "rgba(248,250,252,0.7)") : "transparent",
                      opacity: deletingId === book.id ? 0 : 1,
                      transform: deletingId === book.id ? "translateX(20px)" : "none",
                      transition: "all 0.35s ease-out",
                    }}
                  >
                    <td className="px-4 py-3.5">
                      <button onClick={() => onSelectId(book.id)}>
                        {selectedIds.has(book.id)
                          ? <CheckSquare className="w-4 h-4 text-[#4475F2]" />
                          : <Square className="w-4 h-4" style={{ color: textMuted }} />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <img src={book.cover} alt={book.title} className="w-10 h-14 rounded-lg object-cover" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm line-clamp-1" style={{ color: textPrimary, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{book.title}</p>
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: textMuted }}>{book.author}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: isDark ? "#1E3A5F" : "#D9E3FC", color: "#4475F2", fontWeight: 600 }}>{book.category}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm whitespace-nowrap" style={{ color: textMuted }}>{book.year}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap px-2.5 py-1 rounded-full" style={{ backgroundColor: isDark ? "rgba(68,117,242,0.08)" : "#EEF2FF", color: "#4475F2" }}>
                        <Calendar className="w-3 h-3" />
                        {formatTanggal(book.tanggalMasuk)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => onToggleStatus(book.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80" style={{ backgroundColor: book.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: book.status === "active" ? "#22C55E" : "#EF4444", fontWeight: 600 }}>
                        {book.status === "active" ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {book.status === "active" ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => onView(book)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#4475F2]/10 transition-colors" style={{ color: "#4475F2" }} title="Detail"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => onEdit(book)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-yellow-500/10 transition-colors" style={{ color: "#F59E0B" }} title="Edit"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(book.id, book.title)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: "#EF4444" }} title="Hapus"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination total={filtered.length} currentPage={page} onPageChange={handlePageChange} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor} />
        </div>
      )}
    </div>
  );
}

// ─── Kategori View ───
function KategoriView({ kategori, books, isDark, surface, textPrimary, textMuted, borderColor, onToggle, onDelete, onAdd, onEdit }: any) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [skelLoading, setSkelLoading] = useState(false);
  const filtered = kategori.filter((k: any) => k.name.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePageChange = (p: number) => { setSkelLoading(true); setTimeout(() => { setPage(p); setSkelLoading(false); }, 300); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 sm:max-w-sm" style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}>
          <Search className="w-4 h-4 text-[#4475F2]" />
          <input type="text" placeholder="Cari kategori..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="flex-1 bg-transparent text-sm outline-none" style={{ color: textPrimary }} />
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: "#4475F2", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus className="w-4 h-4" /> Tambah Kategori
        </button>
      </div>

      <div className="flex items-start gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: isDark ? "rgba(68,117,242,0.1)" : "#EEF2FF", border: "1px solid rgba(68,117,242,0.2)" }}>
        <Info className="w-4 h-4 text-[#4475F2] flex-shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: "#4475F2", fontWeight: 500, lineHeight: 1.6 }}>
          Kategori nonaktif tidak muncul di dropdown pengguna. Kategori yang masih memiliki e-book <strong>tidak dapat dihapus</strong> — pindahkan e-book terlebih dahulu.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
              {["Nama Kategori", "E-book Terhubung", "Status", "Aksi"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wide" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skelLoading ? <SkeletonRows cols={4} isDark={isDark} /> : paginated.map((k: any, i: number) => {
              const linkedCount = books.filter((b: Book) => b.category === k.name).length;
              return (
                <tr key={k.id} className="hover:bg-[#4475F2]/5 transition-colors" style={{ borderBottom: i < paginated.length - 1 ? `1px solid ${borderColor}` : "none", backgroundColor: i % 2 !== 0 ? (isDark ? "rgba(255,255,255,0.015)" : "rgba(248,250,252,0.7)") : "transparent" }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: k.status ? (isDark ? "#1E3A5F" : "#EEF2FF") : (isDark ? "#2D1A1A" : "#FFF5F5") }}>
                        <FolderOpen className="w-4 h-4" style={{ color: k.status ? "#4475F2" : "#EF4444" }} />
                      </div>
                      <span className="text-sm" style={{ color: k.status ? textPrimary : textMuted, fontWeight: 600, textDecoration: k.status ? "none" : "line-through", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.name}</span>
                      {!k.status && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>Tersembunyi</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: textMuted }}>
                      {linkedCount} buku{" "}
                      {linkedCount > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: isDark ? "#1E3A5F" : "#D9E3FC", color: "#4475F2" }}>terhubung</span>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => onToggle(k.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80" style={{ backgroundColor: k.status ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: k.status ? "#22C55E" : "#EF4444", fontWeight: 600 }}>
                      {k.status ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {k.status ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => onEdit(k)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-yellow-500/10 transition-colors" style={{ color: "#F59E0B" }} title="Edit nama"><Pencil className="w-4 h-4" /></button>
                      <button
                        onClick={() => onDelete(k.id, k.name)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors"
                        style={{ color: linkedCount > 0 ? textMuted : "#EF4444", opacity: linkedCount > 0 ? 0.4 : 1 }}
                        title={linkedCount > 0 ? "Tidak bisa dihapus — ada buku terhubung" : "Hapus"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination total={filtered.length} currentPage={page} onPageChange={handlePageChange} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor} />
      </div>
    </div>
  );
}

// ─── Saran View ───
function SaranView({ saranList, isDark, surface, textPrimary, textMuted, borderColor, onDelete, onRead, onEditStatus }: any) {
  const [page, setPage] = useState(1);
  const [skelLoading, setSkelLoading] = useState(false);
  const paginated = saranList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePageChange = (p: number) => { setSkelLoading(true); setTimeout(() => { setPage(p); setSkelLoading(false); }, 300); };
  const statusColor = (s: string) => {
    if (s === "Ditinjau") return { bg: "rgba(249,115,22,0.1)", color: "#F97316" };
    if (s === "Ditolak") return { bg: "rgba(239,68,68,0.1)", color: "#EF4444" };
    if (s === "Diterima") return { bg: "rgba(34,197,94,0.12)", color: "#22C55E" };
    return { bg: "rgba(148,163,184,0.15)", color: "#64748B" };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <h3 className="text-sm" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
            Saran E-book dari Pengguna ({saranList.length})
          </h3>
          <span className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(68,117,242,0.1)", color: "#4475F2", fontWeight: 600 }}>
            {saranList.filter((s: any) => s.status === "Menunggu").length} Menunggu
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
              {["Pengguna", "Judul yang Diinginkan", "Tanggal", "Status", "Aksi"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wide" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skelLoading ? <SkeletonRows cols={5} isDark={isDark} /> : paginated.map((s: any, i: number) => {
              const sc = statusColor(s.status);
              return (
                <tr key={s.id} className="hover:bg-[#4475F2]/5 transition-colors" style={{ borderBottom: i < paginated.length - 1 ? `1px solid ${borderColor}` : "none", backgroundColor: i % 2 !== 0 ? (isDark ? "rgba(255,255,255,0.015)" : "rgba(248,250,252,0.7)") : "transparent" }}>
                  <td className="px-5 py-4">
                    <p className="text-sm" style={{ color: textPrimary, fontWeight: 600 }}>{s.user}</p>
                    <p className="text-xs" style={{ color: textMuted }}>{s.nimNidn}</p>
                  </td>
                  <td className="px-5 py-4 text-sm max-w-xs" style={{ color: textPrimary }}>{s.judul}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: textMuted }}>{s.tanggal}</td>
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-full text-xs flex items-center gap-1.5 w-fit" style={{ backgroundColor: sc.bg, color: sc.color, fontWeight: 600 }}>
                      {s.status === "Diterima" && <Award className="w-3 h-3" />}
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => onRead(s)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#4475F2]/10 transition-colors" style={{ color: "#4475F2" }} title="Baca">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEditStatus(s)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-yellow-500/10 transition-colors" style={{ color: "#F59E0B" }} title="Edit Status">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(s.id, s.judul)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: "#EF4444" }} title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination total={saranList.length} currentPage={page} onPageChange={handlePageChange} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor} />
      </div>
    </div>
  );
}

// ─── Laporan View (Strategis) ───
function LaporanView({ isDark, surface, textPrimary, textMuted, borderColor, books = [], kategori = [], saranList = [] }: any) {
  const [activeTab, setActiveTab] = useState<"ebook" | "saran">("ebook");

  // ── E-book tab filters ──
  const [ebFilterKat, setEbFilterKat] = useState("");
  const [ebDari, setEbDari] = useState("");
  const [ebSampai, setEbSampai] = useState("");
  const [ebSearch, setEbSearch] = useState("");
  const [ebPage, setEbPage] = useState(1);
  const [ebSkelLoading, setEbSkelLoading] = useState(false);

  // ── Saran tab filters ──
  const [saranFilterStatus, setSaranFilterStatus] = useState("");
  const [saranStart, setSaranStart] = useState("");
  const [saranEnd, setSaranEnd] = useState("");
  const [saranPage, setSaranPage] = useState(1);
  const [saranSkelLoading, setSaranSkelLoading] = useState(false);

  const handleEbPageChange = (p: number) => { setEbSkelLoading(true); setTimeout(() => { setEbPage(p); setEbSkelLoading(false); }, 300); };
  const handleSaranPageChange = (p: number) => { setSaranSkelLoading(true); setTimeout(() => { setSaranPage(p); setSaranSkelLoading(false); }, 300); };

  const inp = {
    backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
    border: `1.5px solid ${borderColor}`,
    color: textPrimary,
  };

  // ── Helpers ──
  const fmtDate = (d?: string) => { if (!d) return "—"; const [y, m, day] = d.split("-"); return `${day}-${m}-${y}`; };

  // ── Derived: E-book (filtered by tanggalMasuk range) ──
  const filteredBooks = (books as any[]).filter((b: any) => {
    const matchKat = !ebFilterKat || b.category === ebFilterKat;
    const tgl = b.tanggalMasuk || "";
    const matchDate = (!ebDari || tgl >= ebDari) && (!ebSampai || tgl <= ebSampai);
    const matchSearch = !ebSearch || b.title.toLowerCase().includes(ebSearch.toLowerCase()) || b.author.toLowerCase().includes(ebSearch.toLowerCase());
    return matchKat && matchDate && matchSearch;
  }).sort((a: any, b: any) => (b.tanggalMasuk || "").localeCompare(a.tanggalMasuk || ""));
  const ebPaginated = filteredBooks.slice((ebPage - 1) * PAGE_SIZE, ebPage * PAGE_SIZE);

  const totalKoleksi = (books as any[]).length;
  const bukuAktif = (books as any[]).filter((b: any) => b.status === "active").length;
  const katCount: Record<string, number> = {};
  (books as any[]).forEach((b: any) => { katCount[b.category] = (katCount[b.category] || 0) + 1; });
  const kategoriTerpopuler = Object.entries(katCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  // ── Derived: Saran ──
  const filteredSaran = (saranList as any[]).filter((s: any) => {
    const matchStatus = !saranFilterStatus || s.status === saranFilterStatus;
    return matchStatus;
  });
  const saranPaginated = filteredSaran.slice((saranPage - 1) * PAGE_SIZE, saranPage * PAGE_SIZE);

  const SARAN_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
    Menunggu: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
    Ditinjau: { bg: "rgba(249,115,22,0.10)", color: "#F97316" },
    Ditolak: { bg: "rgba(239,68,68,0.10)", color: "#EF4444" },
    Diterima: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
  };

  const resetEbook = () => { setEbFilterKat(""); setEbDari(""); setEbSampai(""); setEbSearch(""); setEbPage(1); };
  const resetSaran = () => { setSaranFilterStatus(""); setSaranStart(""); setSaranEnd(""); setSaranPage(1); };

  const tabStyle = (tab: "ebook" | "saran") => ({
    color: activeTab === tab ? "#4475F2" : textMuted,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: activeTab === tab ? 700 : 500,
    paddingBottom: "12px",
    paddingLeft: "6px",
    paddingRight: "6px",
    cursor: "pointer",
    background: "none",
    outline: "none",
    border: "none",
    borderBottom: activeTab === tab ? "2.5px solid #4475F2" : "2.5px solid transparent",
    transition: "color 0.15s, border-color 0.15s",
    fontSize: "0.9rem",
  } as React.CSSProperties);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.25rem" }}>
            Laporan Strategis
          </h2>
          <p className="text-sm mt-1" style={{ color: textMuted }}>Inventaris e-book dan pengelolaan saran pustaka</p>
        </div>
        {/* Cetak Laporan */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast("Laporan PDF sedang dibuat…", { icon: "📄", style: { backgroundColor: isDark ? "#1E293B" : "#FFF5F5", color: "#EF4444" } })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: isDark ? "#2D0D0D" : "#FFF5F5", color: "#EF4444", border: "1.5px solid #EF4444", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Printer className="w-4 h-4" /> Download PDF
          </button>
          <button
            onClick={() => toast("Laporan Excel sedang dibuat…", { icon: "📊", style: { backgroundColor: isDark ? "#1E293B" : "#F0FFF4", color: "#22C55E" } })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: isDark ? "#0D2D1A" : "#F0FFF4", color: "#22C55E", border: "1.5px solid #22C55E", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <FileSpreadsheet className="w-4 h-4" /> Download Excel
          </button>
        </div>
      </div>

      {/* Tab Strip */}
      <div style={{ borderBottom: `1px solid ${borderColor}` }}>
        <div className="flex items-center gap-6">
          <button style={tabStyle("ebook")} onClick={() => setActiveTab("ebook")}>
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" />Laporan Inventaris E-book</span>
          </button>
          <button style={tabStyle("saran")} onClick={() => setActiveTab("saran")}>
            <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4" />Laporan Pengelolaan Saran</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════ TAB: E-BOOK ═══════════════════ */}
      {activeTab === "ebook" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Koleksi", value: totalKoleksi, icon: BookOpen, color: "#4475F2", bg: isDark ? "#1E3A5F" : "#EEF2FF" },
              { label: "Buku Aktif", value: bukuAktif, icon: CheckCircle, color: "#22C55E", bg: isDark ? "#14352A" : "#F0FDF4" },
              { label: "Kategori Terpopuler", value: kategoriTerpopuler, icon: Award, color: "#F97316", bg: isDark ? "#2D1C0A" : "#FFF7ED" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-5 rounded-2xl"
                style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: textMuted }}>{label}</p>
                  <p style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.25rem" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* E-book Filter */}
          <div className="p-5 rounded-2xl" style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-[#4475F2]" />
              <span className="text-sm" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Filter Inventaris</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Kategori</label>
                <select value={ebFilterKat} onChange={e => { setEbFilterKat(e.target.value); setEbPage(1); }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inp}>
                  <option value="">Semua Kategori</option>
                  {(kategori as any[]).map((k: any) => (
                    <option key={k.id} value={k.name}>{k.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Dari Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: textMuted }} />
                  <input type="date" value={ebDari} onChange={e => { setEbDari(e.target.value); setEbPage(1); }} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inp} />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Sampai Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: textMuted }} />
                  <input type="date" value={ebSampai} min={ebDari || undefined} onChange={e => { setEbSampai(e.target.value); setEbPage(1); }} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inp} />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Cari Judul / Penulis</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
                  <input type="text" placeholder="Ketik judul atau penulis..." value={ebSearch} onChange={e => { setEbSearch(e.target.value); setEbPage(1); }} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inp} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#4475F2", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Search className="w-4 h-4" /> Cari
              </button>
              <button
                onClick={resetEbook}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm hover:opacity-90 active:scale-95"
                style={{ color: "#4475F2", border: "1.5px solid #4475F2", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", background: "transparent" }}
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* E-book Table */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
              <h3 className="text-sm" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                Inventaris E-book
              </h3>
              <span className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(68,117,242,0.1)", color: "#4475F2" }}>
                Menampilkan {filteredBooks.length} dari {totalKoleksi} judul
              </span>
            </div>
            {filteredBooks.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? "#334155" : "#D9E3FC" }} />
                <p className="text-sm" style={{ color: textMuted }}>Tidak ada data yang cocok</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA" }}>
                      {["No", "Judul Buku", "ISBN", "Kategori", "Penulis", "Tgl. Input", "Status"].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wide" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ebSkelLoading ? <SkeletonRows cols={7} isDark={isDark} /> : ebPaginated.map((book: any, i: number) => (
                      <tr
                        key={book.id}
                        className="hover:bg-[#4475F2]/5 transition-colors"
                        style={{
                          borderBottom: i < ebPaginated.length - 1 ? `1px solid ${borderColor}` : "none",
                          backgroundColor: i % 2 !== 0 ? (isDark ? "rgba(255,255,255,0.015)" : "rgba(248,250,252,0.7)") : "transparent",
                        }}
                      >
                        <td className="px-5 py-4 text-sm" style={{ color: textMuted, fontWeight: 600 }}>{(ebPage - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="px-5 py-4" style={{ minWidth: "220px" }}>
                          <p className="text-sm line-clamp-2" style={{ color: textPrimary, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: "260px" }}>{book.title}</p>
                        </td>
                        <td className="px-5 py-4 text-xs whitespace-nowrap" style={{ color: textMuted }}>{book.isbn}</td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs whitespace-nowrap" style={{ backgroundColor: isDark ? "#1E3A5F" : "#D9E3FC", color: "#4475F2", fontWeight: 600 }}>{book.category}</span>
                        </td>
                        <td className="px-5 py-4 text-sm whitespace-nowrap" style={{ color: textMuted }}>{book.author}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 text-xs whitespace-nowrap px-2.5 py-1.5 rounded-full" style={{ backgroundColor: isDark ? "rgba(68,117,242,0.1)" : "#EEF2FF", color: "#4475F2", fontWeight: 600 }}>
                            <Calendar className="w-3 h-3" />{fmtDate(book.tanggalMasuk)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs whitespace-nowrap"
                            style={{
                              backgroundColor: book.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.10)",
                              color: book.status === "active" ? "#22C55E" : "#EF4444",
                              fontWeight: 600,
                            }}
                          >
                            {book.status === "active" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {book.status === "active" ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {filteredBooks.length > 0 && <Pagination total={filteredBooks.length} currentPage={ebPage} onPageChange={handleEbPageChange} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor} />}
          </div>
        </>
      )}

      {/* ═══════════════════ TAB: SARAN ═══════════════════ */}
      {activeTab === "saran" && (
        <>
          {/* Saran Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(["Menunggu", "Ditinjau", "Diterima", "Ditolak"] as const).map((status) => {
              const count = (saranList as any[]).filter((s: any) => s.status === status).length;
              const style = SARAN_STATUS_STYLE[status];
              return (
                <div key={status} className="p-5 rounded-2xl" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}>
                  <p className="text-xs mb-1" style={{ color: textMuted }}>{status}</p>
                  <p style={{ color: style.color, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.6rem" }}>{count}</p>
                  <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? "#334155" : "#E2E8F0" }}>
                    <div className="h-full rounded-full" style={{ width: `${(saranList as any[]).length > 0 ? (count / (saranList as any[]).length) * 100 : 0}%`, backgroundColor: style.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Saran Filter */}
          <div className="p-5 rounded-2xl" style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-[#789DFC]" />
              <span className="text-sm" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Filter Saran</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Status</label>
                <select value={saranFilterStatus} onChange={e => { setSaranFilterStatus(e.target.value); setSaranPage(1); }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inp}>
                  <option value="">Semua Status</option>
                  {["Menunggu", "Ditinjau", "Diterima", "Ditolak"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Dari Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: textMuted }} />
                  <input type="date" value={saranStart} onChange={e => { setSaranStart(e.target.value); setSaranPage(1); if (saranEnd && e.target.value > saranEnd) setSaranEnd(""); }} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inp} />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Sampai Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: textMuted }} />
                  <input type="date" value={saranEnd} min={saranStart || undefined} onChange={e => { setSaranEnd(e.target.value); setSaranPage(1); }} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inp} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#789DFC", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Search className="w-4 h-4" /> Cari
              </button>
              <button
                onClick={resetSaran}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm hover:opacity-90 active:scale-95"
                style={{ color: "#789DFC", border: "1.5px solid #789DFC", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", background: "transparent" }}
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Saran Table */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
              <h3 className="text-sm" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                Data Pengelolaan Saran
              </h3>
              <span className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(120,157,252,0.12)", color: "#789DFC" }}>
                {filteredSaran.length} entri
              </span>
            </div>
            {filteredSaran.length === 0 ? (
              <div className="py-16 text-center">
                <Lightbulb className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? "#334155" : "#D9E3FC" }} />
                <p className="text-sm" style={{ color: textMuted }}>Tidak ada saran yang cocok dengan filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA" }}>
                      {["No", "Tanggal Saran", "Nama Pengusul", "NIM / NIDN", "Judul Buku yang Disarankan", "Status Akhir"].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wide" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {saranSkelLoading ? <SkeletonRows cols={6} isDark={isDark} /> : saranPaginated.map((s: any, i: number) => (
                      <tr
                        key={s.id}
                        className="hover:bg-[#789DFC]/5 transition-colors"
                        style={{
                          borderBottom: i < saranPaginated.length - 1 ? `1px solid ${borderColor}` : "none",
                          backgroundColor: i % 2 !== 0 ? (isDark ? "rgba(255,255,255,0.015)" : "rgba(248,250,252,0.7)") : "transparent",
                        }}
                      >
                        <td className="px-5 py-4 text-sm" style={{ color: textMuted, fontWeight: 600 }}>{(saranPage - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="px-5 py-4 text-sm whitespace-nowrap" style={{ color: textMuted }}>{s.tanggal}</td>
                        <td className="px-5 py-4 text-sm whitespace-nowrap" style={{ color: textPrimary, fontWeight: 600 }}>{s.user}</td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs whitespace-nowrap" style={{ backgroundColor: isDark ? "#1E293B" : "#F1F5F9", color: textMuted, fontFamily: "monospace" }}>{s.nimNidn}</span>
                        </td>
                        <td className="px-5 py-4" style={{ minWidth: "220px" }}>
                          <p className="text-sm line-clamp-2" style={{ color: textPrimary, maxWidth: "280px" }}>{s.judul}</p>
                          {s.penulis && s.penulis !== "—" && (
                            <p className="text-xs mt-0.5" style={{ color: textMuted }}>oleh {s.penulis}</p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs whitespace-nowrap"
                            style={{ backgroundColor: SARAN_STATUS_STYLE[s.status]?.bg, color: SARAN_STATUS_STYLE[s.status]?.color, fontWeight: 600 }}
                          >
                            {s.status === "Diterima" && <CheckCircle className="w-3 h-3" />}
                            {s.status === "Ditolak" && <XCircle className="w-3 h-3" />}
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {filteredSaran.length > 0 && <Pagination total={filteredSaran.length} currentPage={saranPage} onPageChange={handleSaranPageChange} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} borderColor={borderColor} />}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Log View ───
function LogView({ isDark, surface, textPrimary, textMuted, borderColor, logs = [] }: any) {
  const [search, setSearch] = useState("");
  const filtered = (logs as any[]).filter((l: any) =>
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.detail.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase())
  );

  const typeColors: Record<string, { bg: string; color: string }> = {
    add: { bg: "rgba(34,197,94,0.1)", color: "#22C55E" },
    update: { bg: "rgba(249,115,22,0.1)", color: "#F97316" },
    delete: { bg: "rgba(239,68,68,0.1)", color: "#EF4444" },
    download: { bg: "rgba(68,117,242,0.1)", color: "#4475F2" },
    read: { bg: "rgba(120,157,252,0.1)", color: "#789DFC" },
  };
  const typeLabel: Record<string, string> = { add: "Tambah", update: "Perbarui", delete: "Hapus", download: "Unduh", read: "Baca" };

  return (
    <div className="space-y-4">
      {/* Retention notice */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: isDark ? "rgba(68,117,242,0.08)" : "#EEF2FF", border: "1px solid rgba(68,117,242,0.18)" }}>
        <Clock className="w-4 h-4 text-[#4475F2] flex-shrink-0" />
        <p className="text-xs" style={{ color: "#4475F2", fontWeight: 500 }}>
          <strong>Kebijakan Retensi:</strong> Log aktivitas otomatis dihapus setiap 30 hari untuk menjaga performa sistem.
        </p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl max-w-sm" style={{ backgroundColor: surface, border: `1px solid ${borderColor}` }}>
        <Search className="w-4 h-4 text-[#4475F2]" />
        <input type="text" placeholder="Cari log aktivitas..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" style={{ color: textPrimary }} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#4475F2]" />
            <h3 className="text-sm" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Log Aktivitas Sistem</h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Live
          </span>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Activity className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? "#334155" : "#D9E3FC" }} />
            <p className="text-sm" style={{ color: textMuted }}>Tidak ada log yang sesuai dengan pencarian</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor }}>
            {filtered.map((log, i) => {
              const tc = typeColors[log.type] || typeColors.add;
              return (
                <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-[#4475F2]/5 transition-colors" style={{ backgroundColor: i % 2 === 0 ? "transparent" : (isDark ? "rgba(255,255,255,0.01)" : "rgba(248,250,252,0.4)") }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: tc.bg }}>
                    <Activity className="w-4 h-4" style={{ color: tc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: textPrimary }}>
                      <span style={{ color: "#4475F2", fontWeight: 700 }}>{log.actor}</span>{" "}
                      {log.action}:{" "}
                      <span className="italic" style={{ color: textMuted }}>"{log.detail}"</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs" style={{ color: textMuted }}>{log.time}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: isDark ? "#1E3A5F" : "#D9E3FC", color: "#4475F2" }}>{log.kategori}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: tc.bg, color: tc.color, fontWeight: 600 }}>
                    {typeLabel[log.type] || log.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Book Detail Modal ───
function BookDetailModal({ book, isDark, surface, textPrimary, textMuted, borderColor, onClose, onEdit, onDelete }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 24px 80px rgba(0,0,0,0.3)", maxHeight: "92vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <h2 className="text-base" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Detail E-book</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: textMuted }}><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          <div className="flex gap-6">
            <img src={book.cover} alt={book.title} className="w-32 h-44 object-cover rounded-xl flex-shrink-0" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }} />
            <div className="flex-1 min-w-0">
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: isDark ? "#1E3A5F" : "#D9E3FC", color: "#4475F2", fontWeight: 600 }}>{book.category}</span>
              <h3 className="text-xl mt-2 mb-1" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, lineHeight: 1.3 }}>{book.title}</h3>
              <p className="text-sm mb-4" style={{ color: textMuted }}>{book.author}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ISBN", value: book.isbn },
                  { label: "Tahun Terbit", value: book.year },
                  { label: "Bahasa", value: book.language },
                  { label: "Halaman", value: `${book.pages} hal.` },
                  { label: "Unduhan", value: book.downloads },
                  { label: "Status", value: book.status === "active" ? "Aktif" : "Nonaktif" },
                ].map(({ label, value }) => (
                  <div key={label} className="px-3 py-2.5 rounded-xl" style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}>
                    <p className="text-xs mb-0.5" style={{ color: textMuted }}>{label}</p>
                    <p className="text-sm" style={{ color: textPrimary, fontWeight: 600 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}>
            <p className="text-xs mb-2" style={{ color: textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sinopsis</p>
            <p className="text-sm" style={{ color: textPrimary, lineHeight: 1.8 }}>{book.synopsis}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <button onClick={onDelete} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm hover:opacity-90" style={{ backgroundColor: isDark ? "#2D0D0D" : "#FFF5F5", color: "#EF4444", border: "1.5px solid rgba(239,68,68,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
            <Trash2 className="w-4 h-4" /> Hapus
          </button>
          <button onClick={onEdit} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: "#4475F2", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 12px rgba(68,117,242,0.3)" }}>
            <Edit3 className="w-4 h-4" /> Edit E-book
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Book Modal ───
function BookModal({
  book,
  kategori, // 🔥 TAMBAH INI
  isDark,
  surface,
  textPrimary,
  textMuted,
  borderColor,
  onClose,
  onSave
}: any) {
  const todayISO = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [isbn, setIsbn] = useState(book?.isbn || "");
  const [pages, setPages] = useState(String(book?.pages || ""));
  const [year, setYear] = useState(String(book?.year || ""));
  const [category, setCategory] = useState(book?.category_id || "");
  const [synopsis, setSynopsis] = useState(book?.synopsis || "");
  const [language, setLanguage] = useState(book?.language || "Indonesia");
  const [tanggalMasuk, setTanggalMasuk] = useState(book?.tanggalMasuk || todayISO);
  const [coverName, setCoverName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [filePdf, setFilePdf] = useState<File | null>(null);
const [coverImage, setCoverImage] = useState<File | null>(null);

  useEffect(() => {
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, []);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    let progress = 0;
    progressRef.current = setInterval(() => {
      progress += Math.random() * 12 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressRef.current!);
        setIsUploading(false);
      }
      setUploadProgress(Math.round(progress));
    }, 150);
  };

  const handlePdfFile = (file: File) => {
  if (!file || file.type !== "application/pdf") {
    toast.error("File harus PDF!");
    return;
  }

  if (file.size > 50 * 1024 * 1024) {
    toast.error("File maksimal 50MB!");
    return;
  }

  setFilePdf(file); // 🔥 INI YANG DIPAKAI BACKEND
  setPdfUrl(URL.createObjectURL(file)); // preview
  simulateUpload();
};

  const handleSave = () => {
    if (!title.trim() || !category) {
      toast.error("Judul dan Kategori wajib diisi!");
      return;
    }
    const bookData = {
      title: title.trim(),
      author: author.trim() || "—",
      isbn: isbn.trim(),
      pages: parseInt(pages) || 0,
      year: parseInt(year) || 2024,
      category: category,
      synopsis: synopsis.trim(),
      language: language || "Indonesia",
      cover: book?.cover || `https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400`,
      status: book?.status || "active" as const,
      tanggalMasuk: tanggalMasuk || todayISO,
    };
  onSave(bookData, filePdf, coverImage);
  };

  const inputStyle = { backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${borderColor}`, color: textPrimary };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 24px 80px rgba(0,0,0,0.3)", maxHeight: "92vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <h2 className="text-base" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
            {book ? "Edit E-book" : "Tambah E-book Baru"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: textMuted }}><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Judul Buku <span style={{ color: "#EF4444" }}>*</span></label>
              <input type="text" placeholder="Masukkan judul buku" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Penulis</label>
              <input type="text" placeholder="Nama penulis" value={author} onChange={e => setAuthor(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: textMuted }}>ISBN</label>
              <input type="text" placeholder="978-xxx-xxx-xxx-x" value={isbn} onChange={e => setIsbn(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Jumlah Halaman</label>
              <input type="number" placeholder="contoh: 300" value={pages} onChange={e => setPages(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30" style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Tahun Terbit</label>
              <input type="number" placeholder="2024" value={year} onChange={e => setYear(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Kategori</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30" style={inputStyle}>
                <option value="">Pilih kategori</option>
                {kategori?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal Masuk field */}
          <div>
            <label className="block text-xs mb-1.5" style={{ color: textMuted }}>
              Tanggal Masuk / Tanggal Input
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: isDark ? "rgba(68,117,242,0.15)" : "#EEF2FF", color: "#4475F2" }}>
                Auto: Hari ini
              </span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#4475F2" }} />
              <input
                type="date"
                value={tanggalMasuk}
                max={todayISO}
                onChange={e => setTanggalMasuk(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30"
                style={inputStyle}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: textMuted }}>
              Otomatis terisi hari ini. Dapat diubah untuk backdate jika diperlukan.
            </p>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Sinopsis</label>
            <textarea placeholder="Deskripsi singkat buku..." value={synopsis} onChange={e => setSynopsis(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30 resize-none" style={{ ...inputStyle, lineHeight: 1.6 }} />
          </div>

          {/* Cover upload */}
          <div>
            <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Upload Cover (Gambar)</label>
            <label className="block rounded-xl p-4 text-center cursor-pointer transition-all hover:border-[#4475F2]" style={{ border: `2px dashed ${borderColor}`, backgroundColor: isDark ? "#0F172A" : "#F8FAFC" }}>
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setCoverName(file.name);
                  setCoverImage(file);
                } else {
                  setCoverName(null);
                  setCoverImage(null);
                }
              }} />
              <Eye className="w-6 h-6 mx-auto mb-1.5 text-[#789DFC]" />
              <p className="text-xs" style={{ color: coverName ? "#4475F2" : textMuted, fontWeight: coverName ? 600 : 400 }}>{coverName || "Klik untuk upload gambar cover"}</p>
            </label>
          </div>

          {/* PDF Upload */}
          <div
  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
  onDragLeave={() => setDragOver(false)}
  onDrop={e => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handlePdfFile(f);
  }}
  onClick={() => fileInputRef.current?.click()}
  className="rounded-xl p-6 text-center transition-all cursor-pointer"
  style={{
    border: `2px dashed ${
      dragOver ? "#4475F2" : filePdf ? "#22C55E" : borderColor
    }`,
    backgroundColor: dragOver
      ? "#EEF2FF"
      : filePdf
      ? "#F0FDF4"
      : "#F8FAFC",
  }}
>
              <input
  ref={fileInputRef}
  type="file"
  accept="application/pdf"
  className="hidden"
  onChange={e => {
    const f = e.target.files?.[0];
    if (f) handlePdfFile(f);
  }}
/>
             <Upload
  className="w-7 h-7 mx-auto mb-2"
  style={{ color: filePdf ? "#22C55E" : "#4475F2" }}
/>
              <p
  className="text-sm"
  style={{
    color: filePdf ? "#22C55E" : textPrimary,
    fontWeight: filePdf ? 600 : 400,
  }}
>
  {filePdf
    ? `✔ ${filePdf.name}`
    : "Drag & drop file PDF atau klik di sini"}
</p>
            </div>

            {/* Progress Bar */}
            {(isUploading || uploadProgress === 100) && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: textMuted }}>
                    {isUploading ? "Mengunggah PDF..." : "Upload selesai ✓"}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: uploadProgress === 100 ? "#22C55E" : "#4475F2" }}>{uploadProgress}%</span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: isDark ? "#334155" : "#E2E8F0" }}>
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%`, backgroundColor: uploadProgress === 100 ? "#22C55E" : "#4475F2" }}
                  />
                </div>
                {uploadProgress === 100 && filePdf && (
  <p className="text-xs mt-1.5" style={{ color: "#22C55E" }}>
    📄 {filePdf.name} ({(filePdf.size / 1024 / 1024).toFixed(2)} MB)
  </p>
)}
              </div>
            )}

            {/* PDF Preview */}
            {filePdf && !isUploading && (
              <div className="mt-3">
                <button
                  onClick={() => setShowPreview((p) => !p)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2", fontWeight: 600 }}
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? "Sembunyikan Preview" : "Pratinjau PDF"}
                </button>

                {showPreview && (
                  <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                    <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: isDark ? "#0F172A" : "#F1F5F9", borderBottom: `1px solid ${borderColor}` }}>
                      <span className="text-xs" style={{ color: textMuted }}>📄 {filePdf.name}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#4475F2]/10" style={{ color: "#4475F2" }}><ZoomOut className="w-3.5 h-3.5" /></button>
                        <span className="text-xs" style={{ color: textPrimary, minWidth: "42px", textAlign: "center" }}>{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#4475F2]/10" style={{ color: "#4475F2" }}><ZoomIn className="w-3.5 h-3.5" /></button>
                        <button onClick={() => pdfUrl && window.open(pdfUrl, "_blank")} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#4475F2]/10" style={{ color: "#4475F2" }}><Maximize2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div style={{ height: "400px", overflow: "auto", backgroundColor: isDark ? "#0F172A" : "#F8FAFC" }}>
                      <iframe src={pdfUrl || ""} style={{ width: `${zoom}%`, height: "100%", minHeight: "400px", border: "none", display: "block", margin: "0 auto" }} title="PDF Preview" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>


        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm" style={{ color: textMuted, border: `1px solid ${borderColor}`, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Batal</button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-5 py-2.5 rounded-xl text-sm text-white hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ backgroundColor: "#4475F2", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 12px rgba(68,117,242,0.3)" }}
          >
            {book ? "Simpan Perubahan" : "Tambah Buku"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── User Modal ───
function UserModal({ user, isDark, surface, textPrimary, textMuted, borderColor, onClose, onSave }: any) {
  const [name, setName] = useState(user?.name || "");
  const [nimNidn, setNimNidn] = useState(user?.nimNidn || "");
  const [password, setPassword] = useState(user?.password || "");
  const [role, setRole] = useState(user?.role || "User");
  const [showPass, setShowPass] = useState(false);

  const isValidPassword = (pw: string) => pw.length >= 6 && /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw);
  const passwordValid = isValidPassword(password);
  const passwordTouched = password.length > 0;
  const passwordError = passwordTouched && !passwordValid;

  const inputStyle = { backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${borderColor}`, color: textPrimary };

  const handleSave = () => {
    if (!name.trim() || !nimNidn.trim() || !password.trim()) return;
    if (!passwordValid) return;
    onSave({ name: name.trim(), nimNidn: nimNidn.trim(), password: password.trim(), role, status: user?.status ?? true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <h2 className="text-base" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
            {user ? "Edit User" : "Tambah User Baru"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: textMuted }}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nama Lengkap</label>
            <input type="text" placeholder="Nama lengkap user" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>NIM / NIDN</label>
            <input type="text" placeholder="NIM atau NIDN" value={nimNidn} onChange={e => setNimNidn(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password user"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30"
                style={{
                  backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                  border: `1.5px solid ${passwordError ? "rgba(239,68,68,0.5)" : borderColor}`,
                  color: textPrimary,
                }}
              />
              <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: textMuted }}>
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password hint */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className={`w-1.5 h-1.5 rounded-full ${passwordTouched && password.length >= 6 ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-xs" style={{ color: passwordTouched && password.length >= 6 ? "#22C55E" : textMuted }}>Min. 6 karakter</span>
              <div className={`w-1.5 h-1.5 rounded-full ml-2 ${passwordTouched && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-xs" style={{ color: passwordTouched && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? "#22C55E" : textMuted }}>Kombinasi huruf dan angka</span>
            </div>
            {passwordError && (
              <p className="text-xs mt-1" style={{ color: "#EF4444" }}>Password minimal 6 karakter, kombinasi huruf dan angka.</p>
            )}
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30" style={inputStyle}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm" style={{ color: textMuted, border: `1px solid ${borderColor}`, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Batal</button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !nimNidn.trim() || !password.trim() || !passwordValid}
            className="px-5 py-2.5 rounded-xl text-sm text-white hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ backgroundColor: "#4475F2", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {user ? "Simpan Perubahan" : "Tambah User"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Kategori Add Modal ───
function KategoriModal({ isDark, surface, textPrimary, textMuted, borderColor, onClose, onSave }: any) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <h2 className="text-base" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Tambah Kategori Baru</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: textMuted }}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Nama Kategori</label>
          <input
            type="text"
            placeholder="Contoh: Matematika, Fisika..."
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30"
            style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${borderColor}`, color: textPrimary }}
          />
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${borderColor}` }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm" style={{ color: textMuted, border: `1px solid ${borderColor}` }}>Batal</button>
          <button
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim()}
            className="px-5 py-2.5 rounded-xl text-sm text-white hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ backgroundColor: "#4475F2", fontWeight: 700 }}
          >
            Tambah Kategori
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Kategori Edit Modal ───
function KategoriEditModal({ kategori, isDark, surface, textPrimary, textMuted, borderColor, onClose, onSave }: any) {
  const [name, setName] = useState(kategori.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-[#4475F2]" />
            <h2 className="text-base" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Edit Nama Kategori</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: textMuted }}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: isDark ? "rgba(68,117,242,0.08)" : "#EEF2FF", color: "#4475F2", border: "1px solid rgba(68,117,242,0.2)" }}>
            <p className="text-xs" style={{ fontWeight: 500 }}>Perubahan nama akan otomatis diperbarui di semua e-book yang terhubung.</p>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: textMuted }}>Nama Kategori Baru</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4475F2]/30"
              style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${borderColor}`, color: textPrimary }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${borderColor}` }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm" style={{ color: textMuted, border: `1px solid ${borderColor}` }}>Batal</button>
          <button
            onClick={() => name.trim() && name.trim() !== kategori.name && onSave(name.trim())}
            disabled={!name.trim() || name.trim() === kategori.name}
            className="px-5 py-2.5 rounded-xl text-sm text-white hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ backgroundColor: "#4475F2", fontWeight: 700 }}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Saran Read Modal ───
function SaranReadModal({ saran, isDark, surface, textPrimary, textMuted, borderColor, onClose }: any) {
  const statusColor = (s: string) => {
    if (s === "Ditinjau") return { bg: "rgba(249,115,22,0.1)", color: "#F97316" };
    if (s === "Ditolak") return { bg: "rgba(239,68,68,0.1)", color: "#EF4444" };
    if (s === "Diterima") return { bg: "rgba(34,197,94,0.12)", color: "#22C55E" };
    return { bg: "rgba(148,163,184,0.15)", color: "#64748B" };
  };
  const sc = statusColor(saran.status);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#4475F2]" />
            <h2 className="text-base" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Detail Saran</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: textMuted }}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: textPrimary, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{saran.user}</p>
              <p className="text-xs" style={{ color: textMuted }}>{saran.nimNidn} · {saran.tanggal}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: sc.bg, color: sc.color, fontWeight: 600 }}>{saran.status}</span>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}>
            <p className="text-xs mb-1" style={{ color: textMuted }}>Judul Buku yang Disarankan:</p>
            <p className="text-sm" style={{ color: textPrimary, fontWeight: 700 }}>{saran.judul}</p>
          </div>
          <div>
            <p className="text-xs mb-2" style={{ color: textMuted }}>Catatan dari Pengguna:</p>
            <p className="text-sm" style={{ color: textPrimary, lineHeight: 1.75 }}>{saran.catatan}</p>
          </div>
        </div>
        <div className="px-6 py-4" style={{ borderTop: `1px solid ${borderColor}` }}>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm hover:opacity-90 transition-all" style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: "#4475F2", fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Saran Status Modal ───
function SaranStatusModal({ saran, isDark, surface, textPrimary, textMuted, borderColor, onClose, onSave }: any) {
  const [selected, setSelected] = useState(saran.status);
  const statuses = [
    { value: "Menunggu", color: "#64748B", bg: "rgba(148,163,184,0.1)", desc: "Saran belum ditinjau" },
    { value: "Ditinjau", color: "#F97316", bg: "rgba(249,115,22,0.08)", desc: "Sedang dalam pertimbangan" },
    { value: "Diterima", color: "#22C55E", bg: "rgba(34,197,94,0.08)", desc: "Saran diterima & akan ditambahkan" },
    { value: "Ditolak", color: "#EF4444", bg: "rgba(239,68,68,0.08)", desc: "Saran tidak dapat dikabulkan" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden" style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <h2 className="text-base" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Edit Status Saran</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ color: textMuted }}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-xs mb-3" style={{ color: textMuted }}>Pilih status untuk: <strong style={{ color: textPrimary }}>{saran.judul}</strong></p>
          {statuses.map(s => (
            <button
              key={s.value}
              onClick={() => setSelected(s.value)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: selected === s.value ? s.bg : (isDark ? "#0F172A" : "#F8FAFC"),
                border: `1.5px solid ${selected === s.value ? s.color : borderColor}`,
                color: selected === s.value ? s.color : textPrimary,
              }}
            >
              <div className="text-left">
                <div className="flex items-center gap-2">
                  {s.value === "Diterima" && <Award className="w-4 h-4" />}
                  <p style={{ fontWeight: selected === s.value ? 700 : 500 }}>{s.value}</p>
                </div>
                <p className="text-xs mt-0.5" style={{ color: textMuted }}>{s.desc}</p>
              </div>
              {selected === s.value && <Check className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${borderColor}` }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm" style={{ color: textMuted, border: `1px solid ${borderColor}` }}>Batal</button>
          <button
            onClick={() => onSave(selected)}
            className="px-5 py-2.5 rounded-xl text-sm text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: "#4475F2", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Simpan Status
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ───
function EmptyState({ textMuted, label }: { textMuted: string; label: string }) {
  return (
    <div className="py-20 text-center">
      <Search className="w-14 h-14 mx-auto mb-4" style={{ color: textMuted, opacity: 0.4 }} />
      <p className="text-sm" style={{ color: textMuted }}>Tidak ada {label} yang sesuai dengan pencarian</p>
    </div>
  );
}
