import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Eye, Trash2, SortDesc } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Toolbar from "../../components/doctor/Toolbar";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { doctorNav } from "./doctorNav";

export default function Reports() {
  const navigate = useNavigate();
  const { patients, updateReport, deleteReport } = useDoctorData();
  const { loading } = useSimulatedLoad(500);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("recent");
  const [toDelete, setToDelete] = useState(null);

  const allReports = useMemo(
    () => patients.flatMap((p) => p.reports.map((r) => ({ ...r, patient: p }))),
    [patients]
  );

  const categories = useMemo(() => ["All", ...new Set(allReports.map((r) => r.category))], [allReports]);

  const filtered = useMemo(() => {
    let list = allReports.filter((r) => {
      const s = search.toLowerCase();
      const matchSearch = r.name.toLowerCase().includes(s) || r.patient.name.toLowerCase().includes(s);
      const matchCategory = category === "All" || r.category === category;
      const matchStatus = status === "All" || r.status === status;
      return matchSearch && matchCategory && matchStatus;
    });
    if (sort === "recent") list = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [allReports, search, category, status, sort]);

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>All Reports</h1>
        <p className="text-mist-400 mt-1">{allReports.length} reports across all patients.</p>
      </div>

      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by report name or patient..."
        filters={[
          { name: "category", value: category, onChange: setCategory, options: categories.map((c) => ({ label: c === "All" ? "All Categories" : c, value: c })) },
          { name: "status", value: status, onChange: setStatus, options: ["All", "Reviewed", "Pending Review", "Critical"].map((s) => ({ label: s === "All" ? "All Status" : s, value: s })) },
          { name: "sort", value: sort, icon: SortDesc, onChange: setSort, options: [{ label: "Most Recent", value: "recent" }, { label: "Name (A-Z)", value: "name" }] },
        ]}
      />

      {loading ? (
        <Card><Loader label="Loading reports..." /></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={FileText} title={allReports.length === 0 ? "No reports yet" : "No reports found"} description="Reports uploaded for your patients will appear here." />
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-mist-500 text-xs uppercase tracking-wide border-b border-ink-border">
                <th className="font-medium px-5 py-3">Report</th>
                <th className="font-medium px-5 py-3">Patient</th>
                <th className="font-medium px-5 py-3">Category</th>
                <th className="font-medium px-5 py-3">Date</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={`${r.patient.id}-${r.id}`} className="border-b border-ink-border/60 last:border-0 hover:bg-ink-800/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-ink-800 flex items-center justify-center text-mist-400"><FileText size={15} /></div>
                      <span className="text-mist-100">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <PatientAvatar name={r.patient.name} color={r.patient.avatarColor} size={26} />
                      <span className="text-mist-300">{r.patient.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-mist-400">{r.category}</td>
                  <td className="px-5 py-3 text-mist-400">{r.date}</td>
                  <td className="px-5 py-3">
                    <Select
                      value={r.status}
                      onChange={(e) => updateReport(r.patient.id, r.id, { status: e.target.value })}
                      options={["Pending Review", "Reviewed", "Critical"].map((s) => ({ label: s, value: s }))}
                      className="!py-1.5 !text-xs"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => navigate(`/doctor/patients/${r.patient.id}`)} className="text-mist-400 hover:text-teal-300 transition-colors" title="View patient">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => setToDelete(r)} className="text-mist-400 hover:text-danger transition-colors" title="Delete report">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && deleteReport(toDelete.patient.id, toDelete.id)}
        title="Delete this report?"
        description="This report and its data will be permanently removed."
      />
    </DashboardShell>
  );
}
