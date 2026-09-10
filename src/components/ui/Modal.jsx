import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, description, children, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${widths[size]} rounded-2xl border border-ink-border bg-ink-900 shadow-2xl max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-ink-border sticky top-0 bg-ink-900 z-10">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-mist-100" style={{ fontFamily: "var(--font-display)" }}>
                  {title}
                </h2>
              )}
              {description && <p className="text-sm text-mist-400 mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-mist-500 hover:text-mist-100 transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
