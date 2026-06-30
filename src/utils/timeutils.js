// Hitung sisa waktu dari sekarang ke expiryTime
export function getTimeLeft(expiryTime) {
  const now = new Date().getTime();
  const expiry = expiryTime?.toDate?.()
    ? expiryTime.toDate().getTime()
    : new Date(expiryTime).getTime();
  const diff = expiry - now;

  if (diff <= 0) return null; // sudah expired

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, diff };
}

// Warna urgensi berdasarkan sisa waktu
export function getUrgencyColor(diff) {
  const twoHours = 2 * 60 * 60 * 1000;
  const thirtyMin = 30 * 60 * 1000;

  if (diff > twoHours) return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
  if (diff > thirtyMin) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  return { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
}

export function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercent(original, discount) {
  return Math.round(((original - discount) / original) * 100);
}