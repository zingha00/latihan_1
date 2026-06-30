import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import AuthCard from "../../components/auth/AuthCard";
import InputField from "../../components/auth/InputField";
import { StoreIcon, ShoppingBagIcon } from "../../components/auth/icons";

const ROLES = [
  { value: "mitra", label: "Saya Mitra (Penjual)", Icon: StoreIcon },
  { value: "pembeli", label: "Saya Pembeli", Icon: ShoppingBagIcon },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // baru divalidasi setelah user keluar dari field (blur), bukan tiap
  // ketikan, biar gak langsung nampilin error pas baru mulai ngetik
  const emailFormatInvalid = emailTouched && email.length > 0 && !EMAIL_RE.test(email);
  const displayedEmailError = emailError || (emailFormatInvalid ? "Format email tidak valid" : "");

  async function handleSubmit(e) {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setSubmitting(true);

    try {
      await register({ name, email, password, phoneNumber, role, address });
      // TODO: ganti ke /dashboard-mitra dan /katalog setelah halaman itu ada
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setEmailError("Email sudah terdaftar");
      } else if (err.code === "auth/weak-password") {
        setPasswordError("Password terlalu lemah (minimal 6 karakter)");
      } else if (err.code === "auth/invalid-email") {
        setEmailError("Format email tidak valid");
      } else {
        setEmailError("Terjadi kesalahan, coba lagi");
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <div className="px-4 pt-10 sm:pt-14 pb-16 flex flex-col items-center">
        <AuthCard className="max-w-[400px] sm:max-w-[420px] p-8 sm:p-9">
          <h1
            className="text-[27px] sm:text-[28px] font-bold text-brand-green text-center"
            style={{ fontFamily: "Georgia, 'Playfair Display', serif" }}
          >
            Buat Akun Baru
          </h1>
          <p className="text-[13px] text-[#344054] text-center mt-1.5">
            Bergabung bersama SurplusFood
          </p>

          <form onSubmit={handleSubmit} className="mt-7">
            <label className="block text-[13px] font-medium text-[#344054] mb-2">
              Pilih Peran Anda
            </label>
            <div className="flex gap-3">
              {ROLES.map(({ value, label, Icon }) => (
                <label
                  key={value}
                  className={`flex-1 h-[72px] rounded-lg border cursor-pointer flex flex-col items-center justify-center gap-1 text-center px-2 transition-colors ${
                    role === value
                      ? "border-[1.5px] border-brand-greenBtn bg-brand-mintBgSoft text-[#344054]"
                      : "border-border bg-white text-ink-secondary"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={(e) => setRole(e.target.value)}
                    className="sr-only"
                  />
                  <Icon className="w-4 h-4" />
                  <span className="text-[12px]">{label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-3.5 mt-5">
              <InputField
                label="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
                height="h-[43px]"
              />

              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="nama@email.com"
                required
                error={displayedEmailError}
                height="h-[43px]"
              />

              <InputField
                label="Nomor HP"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
                height="h-[43px]"
              />

              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                required
                error={passwordError}
                height="h-[43px]"
              />

              {role === "mitra" && (
                <div>
                  <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                    Alamat (untuk pickup)
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    className="w-full border border-border-input rounded-lg px-3.5 py-2.5 text-[13px] text-ink placeholder:text-ink-placeholder outline-none focus:border-brand-greenBtn focus:shadow-[0_0_0_3px_rgba(0,122,85,0.12)]"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!role || submitting}
              className="w-full h-11 mt-[18px] bg-brand-greenBtn hover:bg-brand-greenHover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-bold rounded-[9px] transition-colors"
            >
              {submitting ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-[13px] text-ink-secondary text-center mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-brand-greenBtn font-bold">
              Masuk di sini
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
