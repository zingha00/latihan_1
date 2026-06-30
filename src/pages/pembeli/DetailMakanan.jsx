import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { getTimeLeft, formatPrice, getDiscountPercent } from "../../utils/timeUtils";

// Countdown besar untuk halaman detail
function CountdownDetail({ expiryTime }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiryTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(expiryTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  const pad = (n) => String(n).padStart(2, "0");

  if (!timeLeft) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
      <p className="text-red-600 font-semibold">Waktu pengambilan sudah berakhir</p>
    </div>
  );

  const isUrgent = timeLeft.diff < 30 * 60 * 1000;

  return (
    <div className={`border rounded-xl p-4 ${isUrgent ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
      <p className="text-xs text-gray-500 text-center mb-3 font-medium">
        Waktu Pengambilan Berakhir Dalam
      </p>
      <div className="flex items-center justify-center gap-2">
        {[pad(timeLeft.hours), pad(timeLeft.minutes), pad(timeLeft.seconds)].map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-2xl border-2
              ${isUrgent ? "bg-red-500 text-white border-red-400" : "bg-white text-gray-800 border-gray-200"}`}>
              {val}
            </div>
            {i < 2 && <span className={`font-bold text-xl ${isUrgent ? "text-red-500" : "text-gray-400"}`}>:</span>}
          </div>
        ))}
      </div>
      {isUrgent && (
        <p className="text-red-500 text-xs text-center mt-3 font-medium flex items-center justify-center gap-1">
          ⚠️ Segera Ambil!
        </p>
      )}
    </div>
  );
}

export default function DetailMakanan() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      try {
        const docRef = doc(db, "food_items", foodId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItem({ foodId: docSnap.id, ...docSnap.data() });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [foodId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !item) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-6xl">😔</span>
      <p className="text-gray-600 font-medium">Makanan ini sudah tidak tersedia</p>
      <button onClick={() => navigate("/")} className="text-emerald-600 underline text-sm">
        Kembali ke Katalog
      </button>
    </div>
  );

  const discount = getDiscountPercent(item.originalPrice, item.discountPrice);
  const isExpired = !getTimeLeft(item.expiryTime);
  const isUnavailable = item.status !== "available" || isExpired;

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Hero Image */}
      <div className="relative h-56 bg-gray-200">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-50">
            <span className="text-8xl">🍱</span>
          </div>
        )}
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
        >
          ←
        </button>
        {/* Sisa porsi badge */}
        <span className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-medium">
          Sisa {item.quantity}
        </span>
      </div>

      {/* Konten */}
      <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
        {/* Judul & Mitra */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{item.title}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            🏪 {item.mitraName || "Mitra SurplusFood"}
          </p>
        </div>

        {/* Harga & Countdown */}
        <div className="grid grid-cols-2 gap-4">
          {/* Harga */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full mb-2 inline-block">
              Hemat {discount}%
            </span>
            <p className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</p>
            <p className="text-emerald-600 font-bold text-xl">{formatPrice(item.discountPrice)}</p>
          </div>

          {/* Countdown */}
          <CountdownDetail expiryTime={item.expiryTime} />
        </div>

        {/* Deskripsi */}
        {item.description && (
          <div>
            <h2 className="text-base font-bold text-emerald-600 mb-2">Deskripsi Makanan</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        )}

        {/* Instruksi */}
        <div>
          <h2 className="text-base font-bold text-emerald-600 mb-3">Instruksi Pengambilan</h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-emerald-700">
              <span>📍</span>
              <span>Tunjukkan bukti klaim di aplikasi kepada kasir {item.mitraName || "mitra"}.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-emerald-700">
              <span>🛍️</span>
              <span>Bawa kantong belanja sendiri (opsional) untuk mendukung gerakan ramah lingkungan.</span>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="h-44 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
          <p className="text-gray-400 text-sm">📍 Lokasi mitra akan ditampilkan di sini</p>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4">
        {isUnavailable ? (
          <button disabled className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-semibold text-base cursor-not-allowed">
            {item.status === "booked" ? "Sudah Diklaim" : "Tidak Tersedia"}
          </button>
        ) : (
          <button
            onClick={() => alert(`Fitur klaim akan diimplementasi — foodId: ${foodId}`)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-base transition active:scale-95"
          >
            Klaim Sekarang
          </button>
        )}
      </div>
    </div>
  );
}