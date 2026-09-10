import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Toolbar from "../../components/doctor/Toolbar";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { doctorNav } from "./doctorNav";

export default function MedicalHistory() {
  const navigate = useNavigate();
  const { patients } = useDoctorData();
  const { loading } = useSimulatedLoad(500);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const allEntries = useMemo(
    () => patients.flatMap((p) => p.history.map((h) => ({ ...h, patient: p }))).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [patients]
  );

  const types = useMemo(() => ["All", ...new Set(allEntries.map((h) => h.type))], [allEntries]);

  const filtered = useMemo(() => {
    return allEntries.filter((h) => {
      const s = search.toLowerCase();
      const matchSearch = h.title.toLowerCase().includes(s) || h.patient.name.toLowerCase().includes(s) || h.description.toLowerCase().includes(s);
      const matchType = type === "All" || h.type === type;
      return matchSearch && matchType;
    });
  }, [allEntries, search, type]);

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Medical History</h1>
        <p className="text-mist-400 mt-1">{allEntries.length} recorded entries across all patients.</p>
      </div>

      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search history by title, patient, or notes..."
        filters={[{ name: "type", value: type, onChange: setType, options: types.map((t) => ({ label: t === "All" ? "All Types" : t, value: t })) }]}
      />

      {loading ? (
        <Card><Loader label="Loading medical history..." /></Card>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={Activity} title="No history found" description="Try adjusting your search or filters." /></Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((h) => (
            <Card key={`${h.patient.id}-${h.id}`} className="p-4 flex items-start justify-between gap-4 hover:border-teal-500/30 transition-colors cursor-pointer" onClick={() => navigate(`/doctor/patients/${h.patient.id}`)}>
              <div className="flex items-start gap-3">
                <PatientAvatar name={h.patient.name} color={h.patient.avatarColor} size={38} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone="teal">{h.type}</Badge>
                    <span className="text-xs text-mist-500">{h.date}</span>
                  </div>
                  <p className="text-mist-100 font-medium mt-1.5">{h.title}</p>
                  <p className="text-sm text-mist-400 mt-0.5">{h.patient.name} • {h.description}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-mist-500 shrink-0 mt-1" />
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
