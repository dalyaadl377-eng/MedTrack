import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Eye, Trash2, MessageSquare, SortAsc } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Toolbar from "../../components/doctor/Toolbar";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import AddPatientModal from "../../components/doctor/AddPatientModal";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { doctorNav } from "./doctorNav";

const statusTone = { Active: "success", "Follow Up": "warn", Inactive: "neutral" };

export default function Patients() {
  const navigate = useNavigate();
  const { patients, addPatient, deletePatient } = useDoctorData();
  const { loading } = useSimulatedLoad(500);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sort, setSort] = useState("recent");
  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const conditions = useMemo(() => ["All", ...new Set(patients.map((p) => p.condition))], [patients]);

  const filtered = useMemo(() => {
    let list = patients.filter((p) => {
      const s = search.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(s) || p.mrn.toLowerCase().includes(s) || p.condition.toLowerCase().includes(s);
      const matchStatus = status === "All" || p.status === status;
      const matchCondition = condition === "All" || p.condition === condition;
      return matchSearch && matchStatus && matchCondition;
    });

    if (sort === "recent") list = [...list].sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "age") list = [...list].sort((a, b) => b.age - a.age);
    return list;
  }, [patients, search, status, condition, sort]);

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Patients</h1>
          <p className="text-mist-400 mt-1">{patients.length} patients under your care.</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <UserPlus size={16} /> Add New Patient
        </Button>
      </div>

      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search patients by name, MRN, or condition..."
        filters={[
          { name: "status", value: status, onChange: setStatus, options: ["All", "Active", "Follow Up", "Inactive"].map((v) => ({ label: v === "All" ? "All Status" : v, value: v })) },
          { name: "condition", value: condition, onChange: setCondition, options: conditions.map((v) => ({ label: v === "All" ? "All Conditions" : v, value: v })) },
          { name: "sort", value: sort, icon: SortAsc, onChange: setSort, options: [{ label: "Recent Visit", value: "recent" }, { label: "Name (A-Z)", value: "name" }, { label: "Age", value: "age" }] },
        ]}
      />

      {loading ? (
        <Card><Loader label="Loading patients..." /></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title={patients.length === 0 ? "No patients yet" : "No patients found"}
            description={patients.length === 0 ? "Add your first patient to start tracking their care." : "Try adjusting your search or filters."}
            actionLabel={patients.length === 0 ? "Add New Patient" : undefined}
            onAction={() => setShowAdd(true)}
          />
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-mist-500 text-xs uppercase tracking-wide border-b border-ink-border">
                <th className="font-medium px-5 py-3">Patient</th>
                <th className="font-medium px-5 py-3">Age / Gender</th>
                <th className="font-medium px-5 py-3">Condition</th>
                <th className="font-medium px-5 py-3">Last Visit</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-ink-border/60 last:border-0 hover:bg-ink-800/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <PatientAvatar name={p.name} color={p.avatarColor} />
                      <div>
                        <p className="text-mist-100">{p.name}</p>
                        <p className="text-xs text-mist-500">{p.mrn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-mist-300">{p.age} / {p.gender}</td>
                  <td className="px-5 py-3 text-mist-300">{p.condition}</td>
                  <td className="px-5 py-3 text-mist-400">{p.lastVisit}</td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone[p.status] || "neutral"}>{p.status}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => navigate(`/doctor/patients/${p.id}`)} className="text-mist-400 hover:text-teal-300 transition-colors" title="View profile">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => navigate("/doctor/messages")} className="text-mist-400 hover:text-teal-300 transition-colors" title="Message">
                        <MessageSquare size={16} />
                      </button>
                      <button onClick={() => setToDelete(p)} className="text-mist-400 hover:text-danger transition-colors" title="Delete patient">
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

      <AddPatientModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={(data) => {
          addPatient(data);
          setShowAdd(false);
        }}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && deletePatient(toDelete.id)}
        title={`Remove ${toDelete?.name}?`}
        description="This will permanently remove the patient and all associated records from your practice."
      />
    </DashboardShell>
  );
}
