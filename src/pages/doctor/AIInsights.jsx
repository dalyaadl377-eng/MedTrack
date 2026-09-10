import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, AlertOctagon, TrendingUp, TrendingDown, Info, ArrowRight } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Toolbar from "../../components/doctor/Toolbar";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { generateInsights } from "../../utils/aiInsights";
import { doctorNav } from "./doctorNav";

const typeConfig = {
  critical: { icon: AlertOctagon, cls: "text-danger bg-danger/10 border-danger/30", label: "Critical" },
  warning: { icon: TrendingUp, cls: "text-warn bg-warn/10 border-warn/30", label: "Trend Alert" },
  positive: { icon: TrendingDown, cls: "text-success bg-success/10 border-success/30", label: "Improving" },
  info: { icon: Info, cls: "text-teal-300 bg-teal-500/10 border-teal-500/30", label: "Info" },
};

export default function AIInsights() {
  const navigate = useNavigate();
  const { patients } = useDoctorData();
  const { loading } = useSimulatedLoad(700);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const insights = useMemo(() => generateInsights(patients), [patients]);

  const filtered = useMemo(() => {
    return insights.filter((i) => {
      const s = search.toLowerCase();
      const matchSearch = i.title.toLowerCase().includes(s) || i.description.toLowerCase().includes(s) || i.patientName?.toLowerCase().includes(s);
      const matchType = type === "All" || i.type === type;
      return matchSearch && matchType;
    });
  }, [insights, search, type]);

  const counts = useMemo(() => {
    const c = { critical: 0, warning: 0, positive: 0, info: 0 };
    insights.forEach((i) => { c[i.type] = (c[i.type] || 0) + 1; });
    return c;
  }, [insights]);

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
          <Sparkles size={22} className="text-teal-400" /> AI Insights
        </h1>
        <p className="text-mist-400 mt-1">Automatically generated from real trends, reports, and visit history across your patients.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <Card key={key} className="p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${cfg.cls}`}>
              <cfg.icon size={16} />
            </div>
            <p className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{counts[key] || 0}</p>
            <p className="text-sm text-mist-400">{cfg.label}</p>
          </Card>
        ))}
      </div>

      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search insights..."
        filters={[{ name: "type", value: type, onChange: setType, options: [{ label: "All Types", value: "All" }, ...Object.entries(typeConfig).map(([k, c]) => ({ label: c.label, value: k }))] }]}
      />

      {loading ? (
        <Card><Loader label="Analyzing patient data..." /></Card>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={Sparkles} title="No insights to show" description="As your patients' data updates, AI-generated insights will appear here." /></Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((i) => {
            const cfg = typeConfig[i.type];
            return (
              <Card key={i.id} className="p-4 flex items-start gap-4 hover:border-teal-500/30 transition-colors cursor-pointer" onClick={() => i.patientId && navigate(`/doctor/patients/${i.patientId}`)}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cfg.cls}`}>
                  <cfg.icon size={17} />
                </div>
                <div className="flex-1">
                  <p className="text-mist-100 font-medium">{i.title}</p>
                  <p className="text-sm text-mist-400 mt-1 leading-relaxed">{i.description}</p>
                </div>
                {i.patientId && <ArrowRight size={16} className="text-mist-500 shrink-0 mt-2" />}
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
