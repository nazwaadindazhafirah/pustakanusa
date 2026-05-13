import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { BOOKS, type Book } from "../data/books";

export interface AdminLog {
  id: number;
  actor: string;
  action: string;
  detail: string;
  time: string;
  type: "add" | "update" | "delete" | "download" | "read";
  kategori: string;
}

export interface SaranItem {
  id: string;
  user: string;
  nimNidn: string;
  judul: string;
  penulis: string;
  tanggal: string;
  status: "Menunggu" | "Ditinjau" | "Ditolak" | "Diterima";
  catatan: string;
}

export interface FavoriteItem {
  id: string;
  savedAt: string;
}

const INITIAL_LOGS: AdminLog[] = [
  { id: 1, actor: "Admin", action: "menambahkan buku baru", detail: "Algoritma & Pemrograman dengan Python", time: "29 Apr 2026, 09:12", type: "add", kategori: "Teknik Informatika" },
  { id: 2, actor: "Ahmad Fauzi", action: "mengunduh PDF", detail: "Machine Learning: Teori & Praktik", time: "29 Apr 2026, 08:55", type: "download", kategori: "Teknik Informatika" },
  { id: 3, actor: "Admin", action: "memperbarui status user", detail: "Rizky Maulana → Nonaktif", time: "28 Apr 2026, 16:30", type: "update", kategori: "Sistem" },
  { id: 4, actor: "Siti Aminah", action: "membaca online", detail: "Basis Data & Sistem Manajemen", time: "28 Apr 2026, 15:10", type: "read", kategori: "Sistem Informasi" },
  { id: 5, actor: "Admin", action: "menghapus kategori", detail: "Kategori: Keuangan", time: "28 Apr 2026, 14:00", type: "delete", kategori: "Sistem" },
  { id: 6, actor: "Prof. Maya Indah", action: "mengunduh PDF", detail: "Statistika Terapan untuk Penelitian", time: "27 Apr 2026, 11:45", type: "download", kategori: "Sistem Informasi" },
  { id: 7, actor: "Admin", action: "menonaktifkan kategori", detail: "Kategori: Akuntansi", time: "27 Apr 2026, 10:20", type: "update", kategori: "Sistem" },
  { id: 8, actor: "Dr. Hendra Putra", action: "mengajukan saran buku", detail: "The Pragmatic Programmer", time: "26 Apr 2026, 09:00", type: "add", kategori: "Teknik Informatika" },
  { id: 9, actor: "Admin", action: "menambahkan user baru", detail: "Rizky Maulana (20220112)", time: "25 Apr 2026, 14:30", type: "add", kategori: "Sistem" },
  { id: 10, actor: "Ahmad Fauzi", action: "membaca online", detail: "Pemrograman Web Modern", time: "25 Apr 2026, 10:15", type: "read", kategori: "Teknik Informatika" },
];

const INITIAL_SARAN: SaranItem[] = [
  { id: "s1", user: "Ahmad Fauzi", nimNidn: "20210001", judul: "Clean Code – Robert C. Martin", penulis: "Robert C. Martin", tanggal: "20 Apr 2026", status: "Menunggu", catatan: "Sangat dibutuhkan untuk mata kuliah Rekayasa Perangkat Lunak." },
  { id: "s2", user: "Siti Aminah", nimNidn: "20210045", judul: "Design Patterns (Gang of Four)", penulis: "Erich Gamma et al.", tanggal: "15 Apr 2026", status: "Ditinjau", catatan: "Referensi wajib untuk tugas akhir saya tentang arsitektur software." },
  { id: "s3", user: "Dr. Hendra Putra", nimNidn: "NIDN-0023456", judul: "The Pragmatic Programmer", penulis: "Hunt & Thomas", tanggal: "10 Apr 2026", status: "Ditolak", catatan: "Buku ini relevan untuk mengajar mahasiswa cara berpikir seperti programmer profesional." },
  { id: "s4", user: "Rizky Maulana", nimNidn: "20220112", judul: "Introduction to Algorithms (CLRS)", penulis: "Cormen et al.", tanggal: "05 Apr 2026", status: "Menunggu", catatan: "Perlu untuk persiapan kompetisi programming." },
  { id: "s5", user: "Ahmad Fauzi", nimNidn: "20210001", judul: "Artificial Intelligence: A Modern Approach", penulis: "Russell & Norvig", tanggal: "01 Apr 2026", status: "Diterima", catatan: "Referensi utama mata kuliah Kecerdasan Buatan." },
  { id: "s6", user: "Ahmad Fauzi", nimNidn: "20210001", judul: "Deep Learning – Goodfellow", penulis: "Ian Goodfellow", tanggal: "28 Mar 2026", status: "Ditolak", catatan: "Untuk penelitian tugas akhir bidang deep learning." },
  { id: "s7", user: "Ahmad Fauzi", nimNidn: "20210001", judul: "You Don't Know JS", penulis: "Kyle Simpson", tanggal: "25 Mar 2026", status: "Menunggu", catatan: "" },
];

function formatNow(): string {
  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const d = now.getDate();
  const m = months[now.getMonth()];
  const y = now.getFullYear();
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${d} ${m} ${y}, ${h}:${min}`;
}

interface BookContextType {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  adminLogs: AdminLog[];
  addLog: (entry: Omit<AdminLog, "id" | "time">) => void;
  saranList: SaranItem[];
  setSaranList: React.Dispatch<React.SetStateAction<SaranItem[]>>;
  // Shared favorites
  favoriteItems: FavoriteItem[];
  toggleFavorite: (id: string) => void;
  favoriteSet: Set<string>;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(INITIAL_LOGS);
  const [saranList, setSaranList] = useState<SaranItem[]>(INITIAL_SARAN);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>(
    BOOKS.filter((b) => b.isFavorite).map((b) => ({ id: b.id, savedAt: "Sebelumnya" }))
  );

  const addLog = useCallback((entry: Omit<AdminLog, "id" | "time">) => {
    setAdminLogs((prev) => [{ ...entry, id: Date.now(), time: formatNow() }, ...prev]);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteItems((prev) => {
      if (prev.some((f) => f.id === id)) return prev.filter((f) => f.id !== id);
      return [{ id, savedAt: "Baru saja" }, ...prev];
    });
  }, []);

  const favoriteSet = useMemo(() => new Set(favoriteItems.map((f) => f.id)), [favoriteItems]);

  return (
    <BookContext.Provider value={{ books, setBooks, adminLogs, addLog, saranList, setSaranList, favoriteItems, toggleFavorite, favoriteSet }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error("useBooks must be used within BookProvider");
  return ctx;
}