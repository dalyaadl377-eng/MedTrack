import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading...", full = false, size = 22 }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-mist-400 ${
        full ? "min-h-[50vh] w-full" : "py-10"
      }`}
      role="status"
      aria-live="polite"
    >
      <Loader2 size={size} className="animate-spin text-teal-400" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
