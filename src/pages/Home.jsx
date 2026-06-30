import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import { getTimeLeft, getUrgencyColor, formatPrice, getDiscountPercent } from "../utils/timeUtils";

// Countdown kecil untuk card
function CountdownBadge({ expiryTime }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiryTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(expiryTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  if (!timeLeft) return (
    <span className="text-xs text-red-500 font-medium flex items-center gap-1">
      ⏰ Sudah kedaluwarsa
    </span>
  );

  const color = getUrgencyColor(timeLeft.diff);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <span className={`text-xs font-medium flex items-center gap-1 ${color.text}`}>
      ⏰ Kedaluwarsa dalam {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
    </span>
  );
}

// Card produk
function FoodCard({ item, onClick }) {
  const discount = getDiscountPercent(item.originalPrice, item.discountPrice);

  return (
    <div
      onClick={() => onClick(item.foodId)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      {/* Gambar */}
      <div className="relative h-44 bg-gray-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-50">
            <span className="text-5xl">🍱</span>
          </div>
        )}
        {/* Badge sisa porsi */}
        <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full font-medium">
          Sisa {item.quantity} Porsi
        </span>
        {/* Badge hemat */}
        <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          Hemat {discount}%
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <span>📍</span> {item.mitraName || "Mitra SurplusFood"}
        </p>

        {/* Harga */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(item.originalPrice)}
          </span>
        </div>
        <p className="text-emerald-600 font-bold text-base mb-3">
          {formatPrice(item.discountPrice)}
        </p>

        {/* Countdown */}
        <div className="border-t border-gray-100 pt-3">
          <CountdownBadge expiryTime={item.expiryTime} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Query real-time: ambil yang status 'available'
    const q = query(
      collection(db, "food_items"),
      where("status", "==", "available")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const items = snapshot.docs
        .map((doc) => ({ foodId: doc.id, ...doc.data() }))
        // Filter client-side: buang yang sudah expired
        .filter((item) => {
          const expiry = item.expiryTime?.toDate?.()
            ? item.expiryTime.toDate()
            : new Date(item.expiryTime);
          return expiry > now;
        });
      setFoodItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  function handleCardClick(foodId) {
    navigate(`/detail/${foodId}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="px-6 md:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto">
        <div className="max-w-lg">
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mb-4">
            🌍 #1 Food Rescue Platform in Indonesia
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Selamatkan <span className="text-emerald-600">Makanan Sisa</span>,<br />
            Selamatkan Bumi
          </h1>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            Platform yang menghubungkan katering dan restoran dengan makanan berlebih
            ke pembeli dengan harga diskon sebelum kedaluwarsa. Nikmati makanan lezat
            sambil menjaga lingkungan.
          </p>
          <button
            onClick={() => document.getElementById("katalog").scrollIntoView({ behavior: "smooth" })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-full font-semibold flex items-center gap-2 transition"
          >
            Mulai Sekarang →
          </button>
        </div>

        {/* Ilustrasi */}
        <div className="w-64 h-64 border-2 border-dashed border-emerald-200 rounded-2xl flex items-center justify-center bg-emerald-50 flex-shrink-0">
          <span className="text-8xl">📦</span>
        </div>
      </section>

      {/* KATALOG */}
      <section id="katalog" className="px-6 md:px-16 py-10 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tersedia di Sekitar Anda</h2>

        {loading ? (
          // Skeleton loading
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : foodItems.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <span className="text-6xl">🍽️</span>
            <p className="text-gray-500 mt-4 text-lg font-medium">
              Belum ada makanan surplus saat ini
            </p>
            <p className="text-gray-400 text-sm mt-1">Cek lagi nanti ya!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {foodItems.slice(0, 3).map((item) => (
                <FoodCard key={item.foodId} item={item} onClick={handleCardClick} />
              ))}
            </div>
            {foodItems.length > 3 && (
              <div className="text-center mt-8">
                <button className="border border-gray-300 text-gray-700 px-8 py-2.5 rounded-full text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 transition">
                  Lihat Semua Makanan
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CARA KERJA */}
      <section className="bg-gray-50 py-16 px-6 md:px-16 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cara Kerja SurplusFood</h2>
          <p className="text-gray-500 text-sm mb-12">
            Tiga langkah mudah untuk berkontribusi mengurangi limbah makanan sambil menikmati
            hidangan berkualitas dengan harga hemat.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🏪", step: "1. Mitra Upload", desc: "Restoran dan katering mendaftarkan makanan berkualitas baik dengan harga diskon yang menarik sebelum jam tutup." },
              { icon: "🛍️", step: "2. Pembeli Klaim", desc: "Pengguna mencari dan memesan makanan favorit melalui aplikasi, lalu membayar dengan aman secara online." },
              { icon: "♻️", step: "3. Selamatkan Makanan", desc: "Ambil pesanan Anda di toko, nikmati makanan lezat, dan banggalah karena Anda baru saja membantu menyelamatkan bumi." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.step}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 px-6 md:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-emerald-600 text-sm">SurplusFood</p>
            <p className="text-xs text-gray-400 mt-1">© 2024 SurplusFood. Menyelamatkan makanan, melestarikan bumi.</p>
          </div>
          <div className="flex gap-6 text-xs text-gray-400">
            <span className="hover:text-gray-600 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-gray-600 cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-gray-600 cursor-pointer">Bantuan</span>
            <span className="hover:text-gray-600 cursor-pointer">Kontak</span>
          </div>
        </div>
      </footer>
    </div>
  );
}