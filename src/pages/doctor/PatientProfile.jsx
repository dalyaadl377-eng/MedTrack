import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Phone, Mail, MapPin, Droplet, AlertCircle, Plus, Trash2, FileText,
  Activity, FlaskConical, TrendingUp, GitCompare, Edit3,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Loader from "../../components/ui/Loader";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import TrendChart from "../../components/doctor/TrendChart";
import AddPatientModal from "../../components/doctor/AddPatientModal";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { doctorNav } from "./doctorNav";

const reportStatusTone = { Reviewed: "success", "Pending Review": "warn", Critical: "danger" };

const historyTypes = ["Diagnosis", "Follow-up", "Surgery", "Medication", "Test Review", "Note"];
const reportCategories = ["Blood Test", "Imaging", "Lab Test", "Other"];

function HistoryFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || { type: "Note", title: "", description: "", date: new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Medical History Entry" description="Record a diagnosis, visit note, or procedure.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={historyTypes.map((t) => ({ label: t, value: t }))} />
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={error} placeholder="e.g. Follow-up visit" />
        <div className="w-full">
          <label className="block text-sm font-medium text-mist-300 mb-1.5">Notes</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl bg-ink-850 border border-ink-border text-mist-100 placeholder:text-mist-500 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            placeholder="Clinical notes..."
          />
        </div>
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" fullWidth>Save Entry</Button>
        </div>
      </form>
    </Modal>
  );
}

function ReportFormModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", category: "Blood Test", date: new Date().toISOString().slice(0, 10), fileType: "PDF" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Report name is required");
    onSave({ ...form, status: "Pending Review", values: [] });
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload New Report" description="Add a report or test result for this patient.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input label="Report Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={error} placeholder="e.g. Complete Blood Count" />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={reportCategories.map((c) => ({ label: c, value: c }))} />
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <Select label="File Type" value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} options={["PDF", "IMG"].map((t) => ({ label: t, value: t }))} />
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" fullWidth>Upload Report</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatientById, updatePatient, addHistoryEntry, deleteHistoryEntry, addReport, updateReport, deleteReport } = useDoctorData();
  const { loading } = useSimulatedLoad(500, [id]);
  const patient = getPatientById(id);

  const [tab, setTab] = useState("overview");
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [historyToDelete, setHistoryToDelete] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [compareIds, setCompareIds] = useState([]);

  const labReports = useMemo(
    () => (patient?.reports || []).filter((r) => r.values && r.values.length > 0),
    [patient]
  );

  if (loading) {
    return (
      <DashboardShell navItems={doctorNav}>
        <Loader full label="Loading patient record..." />
      </DashboardShell>
    );
  }

  if (!patient) {
    return (
      <DashboardShell navItems={doctorNav}>
        <ErrorState title="Patient not found" description="This patient record may have been removed." onRetry={() => navigate("/doctor/patients")} />
      </DashboardShell>
    );
  }

  const tabs = [
    { key: "overview", label: "Overview", icon: Activity },
    { key: "history", label: "Medical History", icon: FileText },
    { key: "reports", label: "Reports", icon: FileText },
    { key: "labs", label: "Lab Results", icon: FlaskConical },
    { key: "trends", label: "Trends", icon: TrendingUp },
  ];

  const toggleCompare = (reportId) => {
    setCompareIds((prev) => {
      if (prev.includes(reportId)) return prev.filter((r) => r !== reportId);
      if (prev.length >= 2) return [prev[1], reportId];
      return [...prev, reportId];
    });
  };

  return (
    <DashboardShell navItems={doctorNav}>
      <button onClick={() => navigate("/doctor/patients")} className="flex items-center gap-1.5 text-sm text-mist-400 hover:text-mist-100 mb-4 transition-colors">
        <ArrowLeft size={15} /> Back to Patients
      </button>

      <Card className="p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <PatientAvatar name={patient.name} color={patient.avatarColor} size={56} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{patient.name}</h1>
                <Badge tone={patient.status === "Active" ? "success" : patient.status === "Follow Up" ? "warn" : "neutral"}>{patient.status}</Badge>
              </div>
              <p className="text-mist-400 text-sm mt-0.5">{patient.mrn} • {patient.age} yrs • {patient.gender} • {patient.condition}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowEdit(true)}>
            <Edit3 size={15} /> Edit Patient
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-ink-border">
          <div className="flex items-center gap-2 text-sm text-mist-300"><Phone size={14} className="text-mist-500" /> {patient.phone}</div>
          <div className="flex items-center gap-2 text-sm text-mist-300"><Mail size={14} className="text-mist-500" /> {patient.email}</div>
          <div className="flex items-center gap-2 text-sm text-mist-300"><Droplet size={14} className="text-mist-500" /> {patient.bloodType}</div>
          <div className="flex items-center gap-2 text-sm text-mist-300"><MapPin size={14} className="text-mist-500" /> {patient.address}</div>
        </div>
      </Card>

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.key ? "bg-teal-500/10 text-teal-300 border border-teal-500/30" : "text-mist-400 hover:text-mist-100 hover:bg-ink-800 border border-transparent"
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="p-5 lg:col-span-2">
            <h2 className="font-semibold text-mist-100 mb-4">Vitals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(patient.vitals || {}).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-ink-800/50 border border-ink-border p-3.5">
                  <p className="text-xs text-mist-500 capitalize mb-1">{k.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-mist-100 font-medium">{v}</p>
                </div>
              ))}
            </div>
            {patient.allergies?.length > 0 && (
              <div className="mt-5 pt-5 border-t border-ink-border">
                <h3 className="text-sm font-medium text-mist-300 mb-2 flex items-center gap-1.5"><AlertCircle size={14} className="text-warn" /> Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((a) => (
                    <Badge key={a} tone="warn">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold text-mist-100 mb-4">Latest Activity</h2>
            <div className="flex flex-col gap-3">
              {patient.history.slice(0, 3).map((h) => (
                <div key={h.id} className="text-sm">
                  <p className="text-mist-100">{h.title}</p>
                  <p className="text-xs text-mist-500">{h.date}</p>
                </div>
              ))}
              {patient.history.length === 0 && <p className="text-sm text-mist-500">No history recorded yet.</p>}
            </div>
          </Card>
        </div>
      )}

      {tab === "history" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-mist-100">Medical History</h2>
            <Button size="sm" onClick={() => setShowHistoryForm(true)}><Plus size={15} /> Add Entry</Button>
          </div>
          {patient.history.length === 0 ? (
            <EmptyState icon={FileText} title="No history recorded" description="Add diagnoses, visits, and procedures as they happen." actionLabel="Add Entry" onAction={() => setShowHistoryForm(true)} />
          ) : (
            <div className="flex flex-col divide-y divide-ink-border/60">
              {patient.history.map((h) => (
                <div key={h.id} className="flex items-start justify-between gap-4 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone="teal">{h.type}</Badge>
                      <span className="text-xs text-mist-500">{h.date}</span>
                    </div>
                    <p className="text-mist-100 font-medium mt-1.5">{h.title}</p>
                    <p className="text-sm text-mist-400 mt-0.5">{h.description}</p>
                  </div>
                  <button onClick={() => setHistoryToDelete(h)} className="text-mist-500 hover:text-danger transition-colors shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "reports" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-mist-100">Reports</h2>
            <Button size="sm" onClick={() => setShowReportForm(true)}><Plus size={15} /> Upload Report</Button>
          </div>
          {patient.reports.length === 0 ? (
            <EmptyState icon={FileText} title="No reports uploaded" description="Reports uploaded for this patient will appear here." actionLabel="Upload Report" onAction={() => setShowReportForm(true)} />
          ) : (
            <div className="flex flex-col divide-y divide-ink-border/60">
              {patient.reports.map((r) => (
                <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-ink-800 flex items-center justify-center text-mist-400"><FileText size={17} /></div>
                    <div>
                      <p className="text-mist-100 font-medium">{r.name}</p>
                      <p className="text-xs text-mist-500">{r.category} • {r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={r.status}
                      onChange={(e) => updateReport(patient.id, r.id, { status: e.target.value })}
                      options={["Pending Review", "Reviewed", "Critical"].map((s) => ({ label: s, value: s }))}
                      className="!py-1.5 !text-xs"
                    />
                    <button onClick={() => setReportToDelete(r)} className="text-mist-500 hover:text-danger transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "labs" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-mist-100">Lab Results</h2>
            <Button
              size="sm"
              variant="outline"
              disabled={compareIds.length !== 2}
              onClick={() => navigate(`/doctor/compare?patient=${patient.id}&a=${compareIds[0]}&b=${compareIds[1]}`)}
            >
              <GitCompare size={15} /> Compare Selected ({compareIds.length}/2)
            </Button>
          </div>
          {labReports.length === 0 ? (
            <EmptyState icon={FlaskConical} title="No lab results yet" description="Structured lab values will appear here once reports are uploaded." />
          ) : (
            <div className="flex flex-col gap-4">
              {labReports.map((r) => (
                <div key={r.id} className={`rounded-xl border p-4 transition-colors ${compareIds.includes(r.id) ? "border-teal-500/50 bg-teal-500/5" : "border-ink-border"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={compareIds.includes(r.id)} onChange={() => toggleCompare(r.id)} className="accent-teal-500 w-4 h-4" />
                      <p className="text-mist-100 font-medium">{r.name}</p>
                      <span className="text-xs text-mist-500">{r.date}</span>
                    </div>
                    <Badge tone={reportStatusTone[r.status]}>{r.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {r.values.map((v) => (
                      <div key={v.label} className="rounded-lg bg-ink-800/50 px-3 py-2">
                        <p className="text-xs text-mist-500">{v.label}</p>
                        <p className={`text-sm font-medium ${v.status === "high" || v.status === "low" ? "text-warn" : "text-mist-100"}`}>
                          {v.value} {v.unit}
                        </p>
                        <p className="text-[11px] text-mist-500">Range: {v.range}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "trends" && (
        <Card className="p-5">
          <h2 className="font-semibold text-mist-100 mb-4">Trends Over Time</h2>
          {(patient.trends || []).length < 2 ? (
            <EmptyState icon={TrendingUp} title="Not enough data" description="Trends will appear once more reports are recorded over time." />
          ) : (
            <TrendChart
              data={patient.trends}
              lines={[
                { key: "hemoglobin", label: "Hemoglobin (g/dL)", color: "#35d3d6" },
                { key: "cholesterol", label: "Cholesterol (mg/dL)", color: "#e8a545" },
                { key: "glucose", label: "Glucose (mg/dL)", color: "#8b7ef2" },
              ]}
              showLegend
              height={320}
            />
          )}
        </Card>
      )}

      <HistoryFormModal
        open={showHistoryForm}
        onClose={() => setShowHistoryForm(false)}
        onSave={(entry) => {
          addHistoryEntry(patient.id, entry);
          setShowHistoryForm(false);
        }}
      />
      <ReportFormModal
        open={showReportForm}
        onClose={() => setShowReportForm(false)}
        onSave={(report) => {
          addReport(patient.id, report);
          setShowReportForm(false);
        }}
      />
      <AddPatientModal
        open={showEdit}
        mode="edit"
        initial={patient}
        onClose={() => setShowEdit(false)}
        onCreate={(data) => {
          updatePatient(patient.id, data);
          setShowEdit(false);
        }}
      />
      <ConfirmDialog
        open={!!historyToDelete}
        onClose={() => setHistoryToDelete(null)}
        onConfirm={() => historyToDelete && deleteHistoryEntry(patient.id, historyToDelete.id)}
        title="Delete this entry?"
        description="This medical history entry will be permanently removed."
      />
      <ConfirmDialog
        open={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={() => reportToDelete && deleteReport(patient.id, reportToDelete.id)}
        title="Delete this report?"
        description="This report and its data will be permanently removed."
      />
    </DashboardShell>
  );
}
