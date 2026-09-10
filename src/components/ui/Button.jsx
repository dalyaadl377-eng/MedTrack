import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-teal-500 text-ink-950 hover:bg-teal-400 focus-visible:ring-teal-300 shadow-[0_0_0_1px_rgba(23,185,196,0.4),0_8px_24px_-8px_rgba(23,185,196,0.55)]",
  outline:
    "bg-transparent text-mist-100 border border-ink-border hover:border-teal-500 hover:text-teal-300 focus-visible:ring-teal-300",
  ghost:
    "bg-transparent text-mist-300 hover:text-mist-100 hover:bg-ink-800 focus-visible:ring-teal-300",
  danger:
    "bg-transparent text-danger border border-danger/40 hover:bg-danger/10 focus-visible:ring-danger",
};

const sizes = {
  sm: "text-sm px-3.5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Comp
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-500",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </Comp>
  );
}
