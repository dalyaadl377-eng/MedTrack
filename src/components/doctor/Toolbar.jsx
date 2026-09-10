import { Search } from "lucide-react";
import Select from "../ui/Select";

export default function Toolbar({ searchValue, onSearchChange, searchPlaceholder = "Search...", filters = [], right }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-500" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl bg-ink-850 border border-ink-border text-mist-100 placeholder:text-mist-500 pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
        />
      </div>
      {filters.map((f) => (
        <div key={f.name} className="w-full sm:w-44">
          <Select
            icon={f.icon}
            name={f.name}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            options={f.options}
          />
        </div>
      ))}
      {right}
    </div>
  );
}
