import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

const config = {
  success: { icon: CheckCircle2, cls: "border-success/30 bg-success/10 text-success" },
  warning: { icon: AlertTriangle, cls: "border-warn/30 bg-warn/10 text-warn" },
  error: { icon: XCircle, cls: "border-danger/30 bg-danger/10 text-danger" },
  info: { icon: Info, cls: "border-teal-500/30 bg-teal-500/10 text-teal-300" },
};

export default function Alert({ type = "info", title, children, className = "" }) {
  const { icon: Icon, cls } = config[type];
  return (
    <div role="alert" className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${cls} ${className}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        {children && <div className="text-mist-300 mt-0.5">{children}</div>}
      </div>
    </div>
  );
}
