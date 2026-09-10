import { useState, useMemo } from "react";
import { Stethoscope, Edit3 } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Toolbar from "../../components/doctor/Toolbar";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { doctorNav } from "./doctorNav";

function NotesModal({ open, onClose, appointment, onSave }) {
  const [notes, setNotes] = useState(appointment?.notes || "");

  if (!appointment) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Consultation Notes — ${appointment.patientName}`} description={`${appointment.date} • ${appointment.time}`}>
      <textarea
        rows={6}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-xl bg-ink-850 border border-ink-border text-mist-100 placeholder:text-mist-500 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
        placeholder="Write clinical notes for this consultation..."
      />
      <div className="flex gap-3 mt-4">
        <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
        <Button fullWidth onClick={() => { onSave(notes); onClose(); }}>Save Notes</Button>
      </div>
    </Modal>
  );
}

export default function Consultations() {
  const { patients, appointments, updateAppointment } = useDoctorData();
  const { loading } = useSimulatedLoad(500);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const consultations = useMemo(
    () => appointments.filter((a) => a.status === "Completed").sort((a, b) => new Date(b.date) - new Date(a.date)),
    [appointments]
  );

  const filtered = useMemo(
    () => consultations.filter((c) => c.patientName.toLowerCase().includes(search.toLowerCase())),
    [consultations, search]
  );

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Consultations</h1>
        <p className="text-mist-400 mt-1">{consultations.length} completed consultations with clinical notes.</p>
      </div>

      <Toolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by patient name..." />

      {loading ? (
        <Card><Loader label="Loading consultations..." /></Card>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={Stethoscope} title="No consultations yet" description="Completed appointments will appear here so you can add clinical notes." /></Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((c) => {
            const patient = patients.find((p) => p.id === c.patientId);
            return (
              <Card key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <PatientAvatar name={c.patientName} color={patient?.avatarColor} size={38} />
                    <div>
                      <p className="text-mist-100 font-medium">{c.patientName}</p>
                      <p className="text-xs text-mist-500 mt-0.5">{c.date} • {c.time} • {c.type}</p>
                      <p className="text-sm text-mist-400 mt-2">{c.notes || <span className="text-mist-500 italic">No notes added yet.</span>}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditing(c)} className="text-mist-400 hover:text-teal-300 transition-colors shrink-0" title="Edit notes">
                    <Edit3 size={16} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <NotesModal
        open={!!editing}
        appointment={editing}
        onClose={() => setEditing(null)}
        onSave={(notes) => editing && updateAppointment(editing.id, { notes })}
      />
    </DashboardShell>
  );
}
