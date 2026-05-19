import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Lightbulb,
  Send,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Eye,
  X,
  BookOpen,
  User,
  Calendar
} from "lucide-react";

import { toast } from "sonner";
import { Toaster } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";

const STATUS_STYLE: Record<
  string,
  { bg: string; color: string }
> = {
  Menunggu: {
    bg: "rgba(148,163,184,0.12)",
    color: "#64748B",
  },
  Ditinjau: {
    bg: "rgba(249,115,22,0.10)",
    color: "#F97316",
  },
  Ditolak: {
    bg: "rgba(239,68,68,0.10)",
    color: "#EF4444",
  },
  Diterima: {
    bg: "rgba(34,197,94,0.12)",
    color: "#22C55E",
  },
};

export function SaranBuku() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [alasan, setAlasan] = useState("");

  const [loading, setLoading] = useState(false);

  const [saranListState, setSaranListState] =
    useState<any[]>([]);

  const [detailSaran, setDetailSaran] =
    useState<any | null>(null);

  // ===============================
  // FETCH DATA
  // ===============================
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/suggestions"
      );

      if (res.data.success) {
        const mapped = res.data.data.map((s: any) => ({
          id: s.id.toString(),
          user: s.user?.name || "-",
          nimNidn:
            s.user?.nim || s.user?.nidn || "-",
          judul: s.subjek,
          penulis:
            s.pesan
              ?.split("Penulis: ")[1]
              ?.split("\n")[0] || "-",

          tanggal: new Date(
            s.created_at
          ).toLocaleDateString("id-ID"),

          status:
            s.status.charAt(0).toUpperCase() +
            s.status.slice(1).toLowerCase(),

          catatan: s.pesan,
        }));

        setSaranListState(mapped);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const bg = isDark ? "#0F172A" : "#F8FAFC";

  const surface = isDark
    ? "#1E293B"
    : "#FFFFFF";

  const textPrimary = isDark
    ? "#F8FAFC"
    : "#1A202C";

  const textMuted = isDark
    ? "#94A3B8"
    : "#64748B";

  const borderColor = isDark
    ? "#334155"
    : "#E2E8F0";

  const isAdmin = true;

  const mySaran = isAdmin
    ? saranListState
    : saranListState.filter(
        (s) =>
          s.nimNidn ===
          (user?.nimNidn || "-")
      );

  const acceptedSuggestions = mySaran.filter(
    (s) => s.status === "Diterima"
  );

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async () => {
    if (!judul.trim()) {
      toast.error(
        "Judul buku tidak boleh kosong."
      );
      return;
    }

    setLoading(true);

    try {
      const userRes = await axios.get(
        "http://127.0.0.1:8000/api/users"
      );

      const me = userRes.data.data.find(
        (u: any) =>
          u.nim === user?.nimNidn ||
          u.nidn === user?.nimNidn
      );

      if (!me) {
        toast.error(
          "User tidak ditemukan di backend."
        );

        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://127.0.0.1:8000/api/suggestions",
        {
          user_id: me.id,
          subjek: judul.trim(),
          pesan: `Penulis: ${penulis.trim()}\nAlasan: ${alasan.trim()}`,
        }
      );

      if (res.data.success) {
        toast.success(
          "Saran buku berhasil dikirim!"
        );

        setJudul("");
        setPenulis("");
        setAlasan("");

        fetchSuggestions();
      }
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengirim saran.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
  const handleUpdateStatus = async (
    id: string,
    newStatus: string
  ) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/suggestions/${id}`,
        {
          status: newStatus,
        }
      );

      setSaranListState((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      toast.success(
        `Status berhasil diperbarui → "${newStatus}".`
      );
    } catch (err) {
      console.log(err);

      toast.error(
        "Gagal mengupdate saran."
      );
    }
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/suggestions/${id}`
      );

      setSaranListState((prev) =>
        prev.filter((s) => s.id !== id)
      );

      toast.success("Saran berhasil dihapus.");
    } catch (err) {
      toast.error(
        "Gagal menghapus saran."
      );
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: bg,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Toaster
        position="top-right"
        richColors
      />

      {/* HEADER */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-8 h-16"
        style={{
          backgroundColor: surface,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="flex items-center gap-2 text-sm"
          style={{ color: textMuted }}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-7 h-7 object-contain"
          />

          <span
            style={{
              color: textPrimary,
              fontWeight: 700,
            }}
          >
            Pustaka
            <span
              style={{
                color: "#4475F2",
              }}
            >
              Nusa
            </span>
          </span>
        </div>

        <div className="w-20" />
      </header>

      <main className="px-5 md:px-8 py-8 max-w-6xl mx-auto">
        {/* TITLE */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: isDark
                ? "#1E3A5F"
                : "#EEF2FF",
            }}
          >
            <Lightbulb className="w-5 h-5 text-[#789DFC]" />
          </div>

          <div>
            <h1
              className="text-xl font-bold"
              style={{
                color: textPrimary,
              }}
            >
              Saran Buku
            </h1>

            <p
              className="text-sm"
              style={{
                color: textMuted,
              }}
            >
              Ajukan e-book yang ingin
              Anda baca
            </p>
          </div>
        </div>

        {/* ACCEPTED */}
        {acceptedSuggestions.length >
          0 && (
          <div
            className="mb-5 p-4 rounded-2xl"
            style={{
              backgroundColor: "#F0FDF4",
              border:
                "1px solid rgba(34,197,94,0.3)",
            }}
          >
            <p
              style={{
                color: "#166534",
              }}
            >
              Saran diterima:
              {" "}
              {acceptedSuggestions
                .map((s) => s.judul)
                .join(", ")}
            </p>
          </div>
        )}

        {/* TABLE */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: surface,
            border: `1px solid ${borderColor}`,
          }}
        >
          <div
            className="px-5 py-4"
            style={{
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            <div className="flex items-center justify-between">
              <h2
                className="font-bold"
                style={{
                  color: textPrimary,
                }}
              >
                {isAdmin
                  ? "Saran Pengguna"
                  : "Riwayat Saya"}
              </h2>

              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  backgroundColor:
                    "#EEF2FF",
                  color: "#4475F2",
                }}
              >
                {mySaran.length} data
              </span>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                {isAdmin && (
                  <th className="px-4 py-3 text-left text-xs">
                    Pengguna
                  </th>
                )}

                <th className="px-4 py-3 text-left text-xs">
                  Judul
                </th>

                <th className="px-4 py-3 text-left text-xs">
                  Penulis
                </th>

                <th className="px-4 py-3 text-left text-xs">
                  Tanggal
                </th>

                <th className="px-4 py-3 text-left text-xs">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-xs">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {mySaran.map((s) => (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: `1px solid ${borderColor}`,
                  }}
                >
                  {/* USER */}
                  {isAdmin && (
                    <td className="px-4 py-4">
                      {s.user}
                    </td>
                  )}

                  {/* JUDUL */}
                  <td className="px-4 py-4">
                    {s.judul}
                  </td>

                  {/* PENULIS */}
                  <td className="px-4 py-4">
                    {s.penulis}
                  </td>

                  {/* TANGGAL */}
                  <td className="px-4 py-4">
                    {s.tanggal}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    {isAdmin ? (
                      <select
                        value={s.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            s.id,
                            e.target.value
                          )
                        }
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor:
                            STATUS_STYLE[
                              s.status
                            ]?.bg,
                          color:
                            STATUS_STYLE[
                              s.status
                            ]?.color,
                          border: "none",
                          fontWeight: 600,
                        }}
                      >
                        <option value="Menunggu">
                          Menunggu
                        </option>

                        <option value="Ditinjau">
                          Ditinjau
                        </option>

                        <option value="Diterima">
                          Diterima
                        </option>

                        <option value="Ditolak">
                          Ditolak
                        </option>
                      </select>
                    ) : (
                      <span
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor:
                            STATUS_STYLE[
                              s.status
                            ]?.bg,
                          color:
                            STATUS_STYLE[
                              s.status
                            ]?.color,
                        }}
                      >
                        {s.status}
                      </span>
                    )}
                  </td>

                  {/* AKSI */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setDetailSaran(s)
                        }
                        style={{
                          color: "#4475F2",
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            s.id
                          )
                        }
                        style={{
                          color: "#EF4444",
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}