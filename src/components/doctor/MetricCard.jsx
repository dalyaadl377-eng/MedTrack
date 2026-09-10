import Card from "../ui/Card";

const toneCls = {
  default: "text-teal-400 bg-teal-500/10",
  danger: "text-danger bg-danger/10",
  success: "text-success bg-success/10",
  warn: "text-warn bg-warn/10",
};

export default function MetricCard({ icon: Icon, label, value, trend, tone = "default", onClick }) {
  return (
    <Card
      className={`p-5 ${onClick ? "cursor-pointer hover:border-teal-500/40 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${toneCls[tone]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <div className="flex items-center justify-between mt-0.5">
        <p className="text-sm text-mist-400">{label}</p>
        {trend && <span className="text-xs text-success">{trend}</span>}
      </div>
    </Card>
  );
}
