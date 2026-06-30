import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import AuthCard from "../../components/auth/AuthCard";
import InputField from "../../components/auth/InputField";
import { LeafIcon, ArrowRightIcon, SpinnerIcon } from "../../components/auth/icons";

export default function Login() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // login() cuma sign-in ke Auth — data role didapat lewat listener
  // onAuthStateChanged yang update currentUser secara async, jadi redirect
  // berbasis role harus nunggu currentUser ke-update, bukan langsung di sini
  const [awaitingRedirect, setAwaitingRedirect] = useState(false);

  useEffect(() => {
    if (awaitingRedirect && currentUser) {
      if (currentUser.role === "mitra") {
        navigate("/"); // TODO: ganti ke /dashboard-mitra setelah halaman itu ada
      } else {
        navigate("/"); // TODO: ganti ke /katalog setelah halaman itu ada
      }
    }
  }, [awaitingRedirect, currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      setAwaitingRedirect(true);
    } catch {
      setError("Email atau password salah");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)" }}
      />

      <Navbar />

      <div className="relative px-4 pt-12 sm:pt-16 pb-16 flex flex-col items-center">
        <AuthCard className="max-w-[420px] sm:max-w-[440px]">
          <div className="w-12 h-12 rounded-full bg-brand-mint flex items-center justify-center mx-auto mb-5">
            <LeafIcon className="w-6 h-6" />
          </div>

          <h1 className="text-[19px] font-bold text-ink text-center">Selamat Datang Kembali</h1>
          <p className="text-[13px] text-ink-secondary text-center mt-1.5">
            Silakan masuk untuk mengelola surplus Anda.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              height="h-[46px]"
            />

            <div>
              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                height="h-[46px]"
              />
              <div className="flex justify-end mt-1.5">
                <a href="#" className="text-[12px] font-semibold text-brand-greenBtn">
                  Lupa password?
                </a>
              </div>
            </div>

            {error && <p className="text-[12px] font-semibold text-danger text-center">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[46px] mt-1 bg-brand-greenBtn hover:bg-brand-greenHover disabled:opacity-60 disabled:hover:bg-brand-greenBtn text-white text-[14px] font-bold rounded-[9px] flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <>
                  <SpinnerIcon className="w-4 h-4" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[13px] text-ink-secondary text-center mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="text-brand-greenBtn font-bold">
              Daftar di sini
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
