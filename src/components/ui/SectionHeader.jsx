export default function SectionHeader({ eyebrow, title, highlight, description, align = "center" }) {
  const alignCls = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-3 max-w-2xl ${alignCls}`}>
      {eyebrow && <span className="text-teal-400 text-sm font-medium">{eyebrow}</span>}
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        {title} {highlight && <span className="text-teal-400">{highlight}</span>}
      </h2>
      {description && <p className="text-mist-400 text-base leading-relaxed">{description}</p>}
    </div>
  );
}
