import { Inbox } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-ink-border flex items-center justify-center mb-4">
        <Icon size={24} className="text-mist-500" />
      </div>
      <p className="text-mist-100 font-medium">{title}</p>
      {description && <p className="text-mist-500 text-sm mt-1.5 max-w-sm">{description}</p>}
      {actionLabel && (
        <Button size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
