import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  tone = "danger",
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tone === "danger" ? "bg-danger/10 text-danger" : "bg-teal-500/10 text-teal-300"}`}>
          <AlertTriangle size={22} />
        </div>
        <h3 className="text-base font-semibold text-mist-100">{title}</h3>
        <p className="text-sm text-mist-400">{description}</p>
        <div className="flex gap-3 w-full mt-3">
          <Button variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            fullWidth
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
