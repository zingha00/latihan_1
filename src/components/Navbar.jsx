import { Link } from "react-router-dom";

const MENU = ["Tentang Kami", "Cara Kerja", "Kemitraan"];

export default function Navbar() {
  return (
    <nav className="h-16 bg-white border-b border-border-soft px-6 sm:px-12 flex items-center justify-between">
      <Link to="/" className="text-brand-greenBtn font-bold text-[17px]">
        SurplusFood
      </Link>

      <div className="hidden md:flex items-center gap-10">
        {MENU.map((item) => (
          <a key={item} href="#" className="text-[14px] text-[#344054]">
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-5">
        <Link to="/register" className="text-[14px] font-semibold text-brand-greenBtn">
          Daftar
        </Link>
        <Link
          to="/login"
          className="bg-brand-greenBtn hover:bg-brand-greenHover text-white text-[14px] font-semibold rounded-lg px-5 py-2.5 transition-colors"
        >
          Masuk
        </Link>
      </div>
    </nav>
  );
}
