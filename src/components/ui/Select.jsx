import { ChevronDown } from "lucide-react";

export default function Select({ label, icon: Icon, options, className = "", id, ...props }) {
  const selectId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-mist-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-500 pointer-events-none" />}
        <select
          id={selectId}
          className={[
            "w-full appearance-none rounded-xl bg-ink-850 border border-ink-border text-mist-100",
            "text-sm outline-none transition-colors py-2.5 pr-9",
            Icon ? "pl-10" : "pl-3.5",
            "focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
            className,
          ].join(" ")}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist-500 pointer-events-none" />
      </div>
    </div>
  );
}
