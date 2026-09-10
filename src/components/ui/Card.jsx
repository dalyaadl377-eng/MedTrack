export default function Card({ as: Comp = "div", className = "", children, glow = false, ...props }) {
  return (
    <Comp
      className={[
        "rounded-2xl border border-ink-border bg-ink-850/80 backdrop-blur-sm",
        glow ? "shadow-[0_0_40px_-12px_rgba(23,185,196,0.25)]" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Comp>
  );
}
