export default function Logo({ size = "md", withTagline = false, className = "" }) {
  const sizes = {
    sm: { icon: 22, text: "text-lg" },
    md: { icon: 28, text: "text-xl" },
    lg: { icon: 40, text: "text-3xl" },
    xl: { icon: 56, text: "text-4xl" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="inline-flex items-center gap-2.5">
        <svg width={s.icon} height={s.icon} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            className="heartbeat-line"
            d="M1 20h7l3-8 4 16 3-12 2.5 6.5H23c1-4 3-6 6-6s5 2 6 6h4"
          />
        </svg>
        <span className={`font-semibold tracking-tight ${s.text}`} style={{ fontFamily: "var(--font-display)" }}>
          <span className="text-mist-100" style={{ color: "var(--color-mist-100)" }}>Med</span>
          <span style={{ color: "var(--color-teal-400)" }}>Track</span>
        </span>
      </div>
      {withTagline && (
        <span className="text-[11px] tracking-wide mt-0.5" style={{ color: "var(--color-mist-500)" }}>
          Track. Understand. Care.
        </span>
      )}
    </div>
  );
}
