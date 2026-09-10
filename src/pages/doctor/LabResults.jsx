import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, GitCompare, ArrowUp, ArrowDown, FileText } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Toolbar from "../../components/doctor/Toolbar";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { doctorNav } from "./doctorNav";

const statusTone = { Reviewed: "success", "Pending Review": "warn", Critical: "danger" };

const valueToneClasses = {
  high: "text-danger",
  low: "text-teal-300",
  normal: "text-mist-100",
};

// Keeps numbers visually consistent: whole numbers show with no decimals,
// anything else is rounded to one decimal place instead of showing whatever
// precision happened to be stored (e.g. "138" not "138.00", "7.4" not "7.40000001").
const formatNumber = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return value;
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

export default function LabResults() {
  const navigate = useNavigate();
  const { patients } = useDoctorData();
  const { loading } = useSimulatedLoad(500);

  const [search, setSearch] = useState("");
  const [patientFilter, setPatientFilter] = useState("All");
  const [selected, setSelected] = useState([]);

  const labReports = useMemo(
    () => patients.flatMap((p) => p.reports.filter((r) => r.values?.length > 0).map((r) => ({ ...r, patient: p }))),
    [patients]
  );

  const patientOptions = useMemo(() => ["All", ...patients.map((p) => p.name)], [patients]);

  const summary = useMemo(() => {
    const critical = labReports.filter((r) => r.status === "Critical").length;
    const pending = labReports.filter((r) => r.status === "Pending Review").length;
    const reviewed = labReports.filter((r) => r.status === "Reviewed").length;
    const abnormalValues = labReports.reduce(
      (count, r) => count + r.values.filter((v) => v.status === "high" || v.status === "low").length,
      0
    );
    return { total: labReports.length, critical, pending, reviewed, abnormalValues };
  }, [labReports]);

  const filtered = useMemo(() => {
    return labReports
      .filter((r) => {
        const s = search.toLowerCase();
        const matchSearch = r.name.toLowerCase().includes(s) || r.patient.name.toLowerCase().includes(s);
        const matchPatient = patientFilter === "All" || r.patient.name === patientFilter;
        return matchSearch && matchPatient;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [labReports, search, patientFilter]);

  const toggleSelect = (key) => {
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 2) return [prev[1], key];
      return [...prev, key];
    });
  };

  const canCompare = selected.length === 2 && (() => {
    const [a, b] = selected.map((k) => filtered.find((r) => `${r.patient.id}-${r.id}` === k));
    return a && b && a.patient.id === b.patient.id;
  })();

  const handleCompare = () => {
    const [a, b] = selected.map((k) => filtered.find((r) => `${r.patient.id}-${r.id}` === k));
    navigate(`/doctor/compare?patient=${a.patient.id}&a=${a.id}&b=${b.id}`);
  };

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Lab Results</h1>
          <p className="text-mist-400 mt-1">{labReports.length} results with structured lab values.</p>
        </div>
        <Button size="sm" variant="outline" disabled={!canCompare} onClick={handleCompare}>
          <GitCompare size={15} /> Compare Selected ({selected.length}/2)
        </Button>
      </div>

      {!loading && labReports.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <Card className="p-4">
            <p className="text-xs text-mist-500 mb-1">Total Results</p>
            <p className="text-2xl font-semibold text-mist-100" style={{ fontFamily: "var(--font-display)" }}>{summary.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-mist-500 mb-1">Critical</p>
            <p className="text-2xl font-semibold text-danger" style={{ fontFamily: "var(--font-display)" }}>{summary.critical}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-mist-500 mb-1">Pending Review</p>
            <p className="text-2xl font-semibold text-warn" style={{ fontFamily: "var(--font-display)" }}>{summary.pending}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-mist-500 mb-1">Out-of-Range Values</p>
            <p className="text-2xl font-semibold text-mist-100" style={{ fontFamily: "var(--font-display)" }}>{summary.abnormalValues}</p>
          </Card>
        </div>
      )}

      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search lab results..."
        filters={[
          { name: "patient", value: patientFilter, onChange: setPatientFilter, options: patientOptions.map((p) => ({ label: p === "All" ? "All Patients" : p, value: p })) },
        ]}
      />

      {loading ? (
        <Card><Loader label="Loading lab results..." /></Card>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={FlaskConical} title="No lab results found" description="Structured lab values from patient reports will appear here." /></Card>
      ) : (
        <div className="flex flex-col gap-4">
          {selected.length === 2 && !canCompare && (
            <p className="text-sm text-warn px-1">Select two results from the same patient to compare.</p>
          )}
          {filtered.map((r) => {
            const key = `${r.patient.id}-${r.id}`;
            const abnormalCount = r.values.filter((v) => v.status === "high" || v.status === "low").length;
            return (
              <Card key={key} className={`p-4 transition-colors ${selected.includes(key) ? "border-teal-500/50" : ""}`}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selected.includes(key)} onChange={() => toggleSelect(key)} className="accent-teal-500 w-4 h-4" aria-label={`Select ${r.name} for comparison`} />
                    <PatientAvatar name={r.patient.name} color={r.patient.avatarColor} size={30} />
                    <div>
                      <p className="text-mist-100 font-medium flex items-center gap-1.5">
                        <FileText size={13} className="text-mist-500" /> {r.name}
                      </p>
                      <p className="text-xs text-mist-500">{r.patient.name} • {r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {abnormalCount > 0 && (
                      <span className="text-[11px] text-warn">{abnormalCount} out of range</span>
                    )}
                    <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {r.values.map((v) => {
                    const isAbnormal = v.status === "high" || v.status === "low";
                    return (
                      <div
                        key={v.label}
                        className={`rounded-lg px-3 py-2 border ${
                          isAbnormal ? "bg-danger/5 border-danger/20" : "bg-ink-800/50 border-transparent"
                        }`}
                      >
                        <p className="text-xs text-mist-500">{v.label}</p>
                        <p className={`text-sm font-semibold flex items-center gap-1 ${valueToneClasses[v.status] || "text-mist-100"}`}>
                          {formatNumber(v.value)}
                          <span className="text-[11px] font-normal text-mist-500">{v.unit}</span>
                          {v.status === "high" && <ArrowUp size={12} />}
                          {v.status === "low" && <ArrowDown size={12} />}
                        </p>
                        <p className="text-[11px] text-mist-500">Ref. range: {v.range} {v.unit}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
