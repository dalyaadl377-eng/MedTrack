import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { getPasswordStrength } from "../../utils/validators";

const PasswordInput = forwardRef(function PasswordInput(
  { label, error, hint, id, showStrength = false, value, className = "", ...props },
  ref
) {
  const [visible, setVisible] = useState(false);
  const inputId = id || props.name;
  const strength = showStrength ? getPasswordStrength(value || "") : null;

  const barColors = ["bg-ink-600", "bg-danger", "bg-warn", "bg-teal-500", "bg-success"];

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-mist-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-500" />
        <input
          ref={ref}
          id={inputId}
          type={visible ? "text" : "password"}
          value={value}
          aria-invalid={!!error}
          className={[
            "w-full rounded-xl bg-ink-850 border text-mist-100 placeholder:text-mist-500",
            "pl-10 pr-11 py-2.75 text-sm outline-none transition-colors",
            "focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
            error ? "border-danger focus:border-danger focus:ring-danger" : "border-ink-border",
            className,
          ].join(" ")}
          style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-500 hover:text-mist-100 transition-colors"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {showStrength && value && (
        <div className="mt-2">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i < strength.score ? barColors[strength.score] : "bg-ink-600"}`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-mist-500">{strength.label}</p>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-mist-500">{hint}</p>}
    </div>
  );
});

export default PasswordInput;
