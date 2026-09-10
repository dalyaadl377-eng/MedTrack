import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, id, className = "", ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-mist-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-500" />
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={[
            "w-full rounded-xl bg-ink-850 border text-mist-100 placeholder:text-mist-500",
            "px-3.5 py-2.75 text-sm outline-none transition-colors",
            "focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
            Icon ? "pl-10" : "",
            error ? "border-danger focus:border-danger focus:ring-danger" : "border-ink-border",
            className,
          ].join(" ")}
          style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-mist-500">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
