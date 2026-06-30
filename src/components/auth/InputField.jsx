import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  error,
  height = "h-11",
  rightSlot,
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div>
      <label className="block text-[13px] font-medium text-[#344054] mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          className={`w-full ${height} border rounded-lg px-3.5 text-[13px] text-ink placeholder:text-ink-placeholder outline-none transition-colors ${
            isPassword ? "pr-10" : ""
          } ${
            error
              ? "border-danger-border"
              : "border-border-input focus:border-brand-greenBtn focus:shadow-[0_0_0_3px_rgba(0,122,85,0.12)]"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
            tabIndex={-1}
          >
            {show ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        )}
        {!isPassword && rightSlot}
      </div>
      {error && <p className="text-[11px] font-semibold text-danger mt-1.5">{error}</p>}
    </div>
  );
}
