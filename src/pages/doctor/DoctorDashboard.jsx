import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, CalendarClock, FileCheck, ShieldAlert, UserPlus, Eye, ChevronRight, Sparkles,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import MetricCard from "../../components/doctor/MetricCard";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import DonutChart from "../../components/doctor/DonutChart";
import TrendChart from "../../components/doctor/TrendChart";
import AddPatientModal from "../../components/doctor/AddPatientModal";
import { useAuth } from "../../context/AuthContext";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { generateInsights } from "../../utils/aiInsights";
import { conditionColors } from "../../data/doctorMockData";
import { doctorNav } from "./doctorNav";

const statusTone = { Reviewed: "success", "Pending Review": "warn", Critical: "danger" };

export default function DoctorDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { patients, appointments, addPatient } = useDoctorData();
  const { loading } = useSimulatedLoad(600);
  const [showAdd, setShowAdd] = useState(false);
  const firstName = currentUser?.fullName?.split(" ")[0] || "Doctor";

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todaysAppts = appointments.filter((a) => a.date === today && a.status === "Upcoming");
    const allReports = patients.flatMap((p) => p.reports.map((r) => ({ ...r, patient: p })));
    const reviewed = allReports.filter((r) => r.status === "Reviewed");
    const critical = allReports.filter((r) => r.status === "Critical");
    return { totalPatients: patients.length, todaysAppts, reviewed, critical, allReports };
  }, [patients, appointments]);

  const conditionData = useMemo(() => {
    const map = {};
    patients.forEach((p) => {
      map[p.condition] = (map[p.condition] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: conditionColors[name] || conditionColors.Other,
    }));
  }, [patients]);

  const recentReports = useMemo(
    () => [...stats.allReports].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [stats.allReports]
  );

  const insights = useMemo(() => generateInsights(patients).slice(0, 3), [patients]);

  const avgTrend = useMemo(() => {
    const months = patients[0]?.trends?.map((t) => t.month) || [];
    return months.map((month, idx) => {
      const withMonth = patients.map((p) => p.trends?.[idx]).filter(Boolean);
      const avgChol = withMonth.reduce((s, t) => s + t.cholesterol, 0) / (withMonth.length || 1);
      return { month, cholesterol: Math.round(avgChol) };
    });
  }, [patients]);

  if (loading) {
    return (
      <DashboardShell navItems={doctorNav}>
        <Loader full label="Loading your dashboard..." />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Good morning, Dr. {firstName} 👋
          </h1>
          <p className="text-mist-400 mt-1">Here's what's happening in your practice today.</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <UserPlus size={16} /> Add New Patient
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard icon={Users} label="Total Patients" value={stats.totalPatients} onClick={() => navigate("/doctor/patients")} />
        <MetricCard icon={CalendarClock} label="Appointments Today" value={stats.todaysAppts.length} onClick={() => navigate("/doctor/appointments")} />
        <MetricCard icon={FileCheck} label="Reports Reviewed" value={stats.reviewed.length} onClick={() => navigate("/doctor/reports")} />
        <MetricCard icon={ShieldAlert} label="Critical Alerts" value={stats.critical.length} tone="danger" onClick={() => navigate("/doctor/notifications")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-mist-100">Patients Overview</h2>
            <button onClick={() => navigate("/doctor/patients")} className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-mist-500 text-xs uppercase tracking-wide">
                  <th className="font-medium px-2 pb-2">Patient</th>
                  <th className="font-medium px-2 pb-2">Condition</th>
                  <th className="font-medium px-2 pb-2">Last Visit</th>
                  <th className="font-medium px-2 pb-2">Status</th>
                  <th className="font-medium px-2 pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 5).map((p) => (
                  <tr key={p.id} className="border-t border-ink-border/60 hover:bg-ink-800/40">
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <PatientAvatar name={p.name} color={p.avatarColor} size={32} />
                        <div>
                          <p className="text-mist-100">{p.name}</p>
                          <p className="text-xs text-mist-500">{p.mrn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-mist-300">{p.condition}</td>
                    <td className="px-2 py-2.5 text-mist-400">{p.lastVisit}</td>
                    <td className="px-2 py-2.5">
                      <Badge tone={p.status === "Active" ? "success" : p.status === "Follow Up" ? "warn" : "neutral"}>{p.status}</Badge>
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <button onClick={() => navigate(`/doctor/patients/${p.id}`)} className="text-mist-400 hover:text-teal-300 transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-mist-100 mb-4">Patients by Condition</h2>
          <DonutChart data={conditionData} centerValue={stats.totalPatients} centerLabel="Total Patients" />
          <div className="flex flex-col gap-2 mt-4">
            {conditionData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-mist-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="text-mist-500">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-mist-100">Recent Reports</h2>
            <button onClick={() => navigate("/doctor/reports")} className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          {recentReports.length === 0 ? (
            <p className="text-sm text-mist-500 py-6 text-center">No reports yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink-border/60">
              {recentReports.map((r) => (
                <div key={`${r.patient.id}-${r.id}`} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-ink-800 flex items-center justify-center text-mist-400">
                      <FileCheck size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-mist-100">{r.name}</p>
                      <p className="text-xs text-mist-500">{r.patient.name} • {r.date}</p>
                    </div>
                  </div>
                  <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-mist-100 flex items-center gap-2">
              <Sparkles size={16} className="text-teal-400" /> AI Insights
            </h2>
            <button onClick={() => navigate("/doctor/ai-insights")} className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {insights.length === 0 && <p className="text-sm text-mist-500">No notable trends detected right now.</p>}
            {insights.map((i) => (
              <div key={i.id} className="rounded-xl bg-ink-800/60 border border-ink-border p-3">
                <p className="text-sm text-mist-100 font-medium">{i.title}</p>
                <p className="text-xs text-mist-500 mt-1 leading-relaxed">{i.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3 p-5">
          <h2 className="font-semibold text-mist-100 mb-4">Average Cholesterol Trend — All Patients</h2>
          <TrendChart data={avgTrend} lines={[{ key: "cholesterol", label: "Cholesterol (mg/dL)", color: "#35d3d6" }]} />
        </Card>
      </div>

      <AddPatientModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={(data) => {
          const p = addPatient(data);
          setShowAdd(false);
          navigate(`/doctor/patients/${p.id}`);
        }}
      />
    </DashboardShell>
  );
}
