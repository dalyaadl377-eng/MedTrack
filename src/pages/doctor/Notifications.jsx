import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertOctagon, TrendingUp, CalendarClock, MessageSquare, Info, Trash2, CheckCheck } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Toolbar from "../../components/doctor/Toolbar";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { doctorNav } from "./doctorNav";

const typeConfig = {
  critical: { icon: AlertOctagon, cls: "text-danger bg-danger/10" },
  trend: { icon: TrendingUp, cls: "text-warn bg-warn/10" },
  followup: { icon: CalendarClock, cls: "text-teal-300 bg-teal-500/10" },
  message: { icon: MessageSquare, cls: "text-teal-300 bg-teal-500/10" },
  system: { icon: Info, cls: "text-mist-400 bg-ink-700" },
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useDoctorData();
  const { loading } = useSimulatedLoad(400);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const s = search.toLowerCase();
      const matchSearch = n.title.toLowerCase().includes(s) || n.description.toLowerCase().includes(s);
      const matchType = type === "All" || n.type === type;
      return matchSearch && matchType;
    });
  }, [notifications, search, type]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Notifications</h1>
          <p className="text-mist-400 mt-1">{unreadCount} unread notifications.</p>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={markAllNotificationsRead}>
            <CheckCheck size={15} /> Mark All Read
          </Button>
        )}
      </div>

      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notifications..."
        filters={[{ name: "type", value: type, onChange: setType, options: [{ label: "All Types", value: "All" }, { label: "Critical", value: "critical" }, { label: "Trend Alert", value: "trend" }, { label: "Follow-up", value: "followup" }, { label: "Message", value: "message" }, { label: "System", value: "system" }] }]}
      />

      {loading ? (
        <Card><Loader label="Loading notifications..." /></Card>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={Bell} title="No notifications" description="You're all caught up." /></Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((n) => {
            const cfg = typeConfig[n.type] || typeConfig.system;
            return (
              <Card
                key={n.id}
                className={`p-4 flex items-start gap-3 cursor-pointer transition-colors hover:border-teal-500/30 ${!n.read ? "border-l-2 border-l-teal-500" : ""}`}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.patientId) navigate(`/doctor/patients/${n.patientId}`);
                }}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.cls}`}>
                  <cfg.icon size={16} />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${n.read ? "text-mist-300" : "text-mist-100"}`}>{n.title}</p>
                  <p className="text-sm text-mist-500 mt-0.5">{n.description}</p>
                  <p className="text-xs text-mist-500 mt-1">{n.time}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                  className="text-mist-500 hover:text-danger transition-colors shrink-0"
                  title="Dismiss"
                >
                  <Trash2 size={15} />
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
