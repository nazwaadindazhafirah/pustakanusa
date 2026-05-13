import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, CheckCircle, User, Lock, Save } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import logo from "../../imports/Tak_berjudul3_20260429090610.png";

export function ProfilUser() {
  const { isDark } = useTheme();
  const { user, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const bg = isDark ? "#0F172A" : "#F8FAFC";
  const surface = isDark ? "#1E293B" : "#FFFFFF";
  const textPrimary = isDark ? "#F8FAFC" : "#1A202C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  const displayName = user?.name || "Pengguna";
  const displayNimNidn = user?.nimNidn || "—";
  const displayRole = user?.role || "mahasiswa";

  const handleSave = () => {
    if (!oldPass || !newPass || !confirmPass) {
      toast.error("Semua field password harus diisi.");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("Password baru dan konfirmasi tidak cocok.");
      return;
    }
    if (newPass.length < 6) {
      toast.error("Password baru minimal 6 karakter.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updatePassword(newPass);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      toast.success("Password berhasil diperbarui!");
    }, 1000);
  };

  const passwordFields = [
    { label: "Password Lama", value: oldPass, setter: setOldPass, show: showOld, toggleShow: () => setShowOld((p) => !p) },
    { label: "Password Baru", value: newPass, setter: setNewPass, show: showNew, toggleShow: () => setShowNew((p) => !p) },
    { label: "Konfirmasi Password Baru", value: confirmPass, setter: setConfirmPass, show: showConfirm, toggleShow: () => setShowConfirm((p) => !p) },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}
    >
      <Toaster position="top-right" richColors />
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-8 h-16"
        style={{ backgroundColor: surface, borderBottom: `1px solid ${borderColor}`, boxShadow: isDark ? "0 1px 12px rgba(0,0,0,0.3)" : "0 1px 12px rgba(0,0,0,0.06)" }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm hover:text-[#4475F2] transition-colors"
          style={{ color: textMuted }}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-7 h-7 object-contain" />
          <span style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
            Pustaka<span style={{ color: "#4475F2" }}>Nusa</span>
          </span>
        </div>
        <div className="w-20" />
      </header>

      <main className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
        <h1 className="text-xl mb-6" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
          Edit Profil
        </h1>

        {/* Side-by-side on lg+, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Profile Info (read-only) */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <User className="w-4 h-4 text-[#4475F2]" />
              <h2 className="text-sm font-semibold" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Informasi Akun
              </h2>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #4475F2, #789DFC)" }}
              >
                {displayName[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-base font-semibold" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {displayName}
                </p>
                <p className="text-sm" style={{ color: textMuted }}>{displayNimNidn}</p>
                <span
                  className="inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold capitalize"
                  style={{ backgroundColor: isDark ? "#1E3A5F" : "#D9E3FC", color: "#4475F2" }}
                >
                  {displayRole}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Nama Lengkap", value: displayName },
                { label: "NIM / NIDN", value: displayNimNidn },
                { label: "Role", value: displayRole.charAt(0).toUpperCase() + displayRole.slice(1) },
                { label: "Status Akun", value: "Aktif" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="px-4 py-3 rounded-xl"
                  style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${borderColor}` }}
                >
                  <p className="text-xs mb-0.5" style={{ color: textMuted }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: textPrimary }}>
                    {label === "Status Akun" ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        {value}
                      </span>
                    ) : value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: surface, border: `1px solid ${borderColor}`, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-4 h-4 text-[#4475F2]" />
              <h2 className="text-sm font-semibold" style={{ color: textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Ubah Password
              </h2>
            </div>

            <div className="space-y-4">
              {passwordFields.map(({ label, value, setter, show, toggleShow }) => (
                <div key={label}>
                  <label className="block text-sm mb-1.5" style={{ color: textMuted }}>{label}</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      placeholder={`Masukkan ${label.toLowerCase()}`}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#4475F2]/30 pr-11"
                      style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${borderColor}`, color: textPrimary }}
                    />
                    <button
                      type="button"
                      onClick={toggleShow}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-[#4475F2]"
                      style={{ color: textMuted }}
                    >
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}

              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
                style={{ backgroundColor: isDark ? "#1E3A5F" : "#EEF2FF", color: textMuted }}
              >
                <CheckCircle className="w-4 h-4 text-[#4475F2] flex-shrink-0" />
                Password baru minimal 6 karakter. Gunakan kombinasi huruf, angka, dan simbol.
              </div>

              <button
                onClick={handleSave}
                disabled={loading || !oldPass || !newPass || !confirmPass}
                className="w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #4475F2, #789DFC)", fontWeight: 700 }}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}