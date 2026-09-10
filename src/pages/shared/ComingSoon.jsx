import { Construction } from "lucide-react";

export default function ComingSoon({ title = "This page" }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-ink-border flex items-center justify-center mb-5">
        <Construction size={24} className="text-mist-500" />
      </div>
      <p className="text-mist-100 font-medium">{title} is under construction</p>
      <p className="text-mist-500 text-sm mt-1.5 max-w-sm">
        This section is owned by another part of the team and will be wired up in a later phase.
      </p>
    </div>
  );
}
