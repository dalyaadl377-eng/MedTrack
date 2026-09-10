import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import MetricCard from "../../components/doctor/MetricCard";
import DonutChart from "../../components/doctor/DonutChart";
import TrendChart from "../../components/doctor/TrendChart";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { conditionColors } from "../../data/doctorMockData";
import { doctorNav } from "./doctorNav";
import { Users, FileCheck, ShieldAlert, CalendarClock } from "lucide-react";

export default function Analytics() {
  const { patients, appointments } = useDoctorData();
  const { loading } = useSimulatedLoad(600);

  const conditionData = useMemo(() => {
    const map = {};
    patients.forEach((p) => { map[p.condition] = (map[p.condition] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value, color: conditionColors[name] || conditionColors.Other }));
  }, [patients]);

  const statusData = useMemo(() => {
    const allReports = patients.flatMap((p) => p.reports);
    const map = { Reviewed: 0, "Pending Review": 0, Critical: 0 };
    allReports.forEach((r) => { map[r.status] = (map[r.status] || 0) + 1; });
    return { total: allReports.length, byStatus: map };
  }, [patients]);

  const apptsByType = useMemo(() => {
    const map = {};
    appointments.forEach((a) => { map[a.type] = (map[a.type] || 0) + 1; });
    return Object.entries(map).map(([type, count]) => ({ type, count }));
  }, [appointments]);

  const avgTrend = useMemo(() => {
    const months = patients[0]?.trends?.map((t) => t.month) || [];
    return months.map((month, idx) => {
      const withMonth = patients.map((p) => p.trends?.[idx]).filter(Boolean);
      const avgGlucose = withMonth.reduce((s, t) => s + t.glucose, 0) / (withMonth.length || 1);
      const avgChol = withMonth.reduce((s, t) => s + t.cholesterol, 0) / (withMonth.length || 1);
      return { month, glucose: Math.round(avgGlucose), cholesterol: Math.round(avgChol) };
    });
  }, [patients]);

  const activePatients = patients.filter((p) => p.status === "Active").length;

  if (loading) {
    return (
      <DashboardShell navItems={doctorNav}>
        <Loader full label="Crunching your practice analytics..." />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Analytics</h1>
        <p className="text-mist-400 mt-1">Practice-wide trends across your patient panel.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard icon={Users} label="Active Patients" value={activePatients} />
        <MetricCard icon={FileCheck} label="Total Reports" value={statusData.total} />
        <MetricCard icon={ShieldAlert} label="Critical Reports" value={statusData.byStatus.Critical} tone="danger" />
        <MetricCard icon={CalendarClock} label="Total Appointments" value={appointments.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card className="p-5">
          <h2 className="font-semibold text-mist-100 mb-4">Patients by Condition</h2>
          <DonutChart data={conditionData} centerValue={patients.length} centerLabel="Total" />
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold text-mist-100 mb-4">Appointments by Type</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={apptsByType} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#17293a" vertical={false} />
              <XAxis dataKey="type" stroke="#62788a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#62788a" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#08111c", border: "1px solid #17293a", borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="count" fill="#17b9c4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold text-mist-100 mb-4">Average Glucose & Cholesterol — All Patients</h2>
        <TrendChart
          data={avgTrend}
          lines={[{ key: "glucose", label: "Glucose (mg/dL)", color: "#8b7ef2" }, { key: "cholesterol", label: "Cholesterol (mg/dL)", color: "#e8a545" }]}
          showLegend
          height={300}
        />
      </Card>
    </DashboardShell>
  );
}
