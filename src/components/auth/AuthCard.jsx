export default function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`w-full bg-white border border-border-soft rounded-xl shadow-soft p-9 sm:p-10 ${className}`}
    >
      {children}
    </div>
  );
}
