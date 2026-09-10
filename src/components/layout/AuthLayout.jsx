import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

export default function AuthLayout({ children, panelTitle, panelText }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-950">
      <div className="flex flex-col px-6 sm:px-10 py-8">
        <Link to="/">
          <Logo size="sm" />
        </Link>
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-sm fade-up">{children}</div>
        </div>
      </div>

      <div className="hidden lg:flex relative overflow-hidden bg-ink-900 border-l border-ink-border items-center justify-center">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(600px circle at 30% 20%, rgba(23,185,196,0.25), transparent 60%), radial-gradient(500px circle at 80% 80%, rgba(53,211,214,0.18), transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-md px-10 text-center">
          <svg viewBox="0 0 400 120" className="w-full mb-8" aria-hidden="true">
            <path
              className="heartbeat-line draw-line"
              d="M10 60h60l15-35 20 70 15-55 12 20h258"
            />
          </svg>
          <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            {panelTitle}
          </h2>
          <p className="text-mist-400 text-sm leading-relaxed">{panelText}</p>
        </div>
      </div>
    </div>
  );
}
