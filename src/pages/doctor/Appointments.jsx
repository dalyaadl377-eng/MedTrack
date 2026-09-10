import { useState, useMemo } from "react";
import { CalendarClock, Plus, Trash2, Video, MapPin, CheckCircle2, XCircle } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Toolbar from "../../components/doctor/Toolbar";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { doctorNav } from "./doctorNav";

const statusTone = { Upcoming: "teal", Completed: "success", Cancelled: "danger" };
const apptTypes = ["Consultation", "Follow-up", "Test Review", "Checkup"];

function AppointmentFormModal({ open, onClose, onSave, patients }) {
  const [form, setForm] = useState({ patientId: "", date: "", time: "", type: "Consultation", location: "In-person" });
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.patientId) errs.patientId = "Select a patient";
    if (!form.date) errs.date = "Date is required";
    if (!form.time) errs.time = "Time is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const patient = patients.find((p) => p.id === form.patientId);
    onSave({ ...form, patientName: patient.name });
    setForm({ patientId: "", date: "", time: "", type: "Consultation", location: "In-person" });
  };

  return (
    <Modal open={open} onClose={onClose} title="Book Appointment" description="Schedule a new appointment with a patient.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Select
          label="Patient"
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          options={[{ label: "Select a patient", value: "" }, ...patients.map((p) => ({ label: p.name, value: p.id }))]}
        />
        {errors.patientId && <p className="text-xs text-danger -mt-3">{errors.patientId}</p>}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} error={errors.date} />
          <Input label="Time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} error={errors.time} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={apptTypes.map((t) => ({ label: t, value: t }))} />
          <Select label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} options={["In-person", "Video"].map((l) => ({ label: l, value: l }))} />
        </div>
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" fullWidth>Book Appointment</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Appointments() {
  const { patients, appointments, addAppointment, updateAppointment, deleteAppointment } = useDoctorData();
  const { loading } = useSimulatedLoad(500);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => {
        const s = search.toLowerCase();
        const matchSearch = a.patientName.toLowerCase().includes(s) || a.type.toLowerCase().includes(s);
        const matchStatus = status === "All" || a.status === status;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
  }, [appointments, search, status]);

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Appointments & Schedule</h1>
          <p className="text-mist-400 mt-1">{appointments.filter((a) => a.status === "Upcoming").length} upcoming appointments.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus size={15} /> Book Appointment</Button>
      </div>

      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by patient or type..."
        filters={[{ name: "status", value: status, onChange: setStatus, options: ["All", "Upcoming", "Completed", "Cancelled"].map((s) => ({ label: s === "All" ? "All Status" : s, value: s })) }]}
      />

      {loading ? (
        <Card><Loader label="Loading schedule..." /></Card>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={CalendarClock} title="No appointments" description="Book your first appointment to get started." actionLabel="Book Appointment" onAction={() => setShowForm(true)} /></Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => {
            const patient = patients.find((p) => p.id === a.patientId);
            return (
              <Card key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <PatientAvatar name={a.patientName} color={patient?.avatarColor} size={40} />
                  <div>
                    <p className="text-mist-100 font-medium">{a.patientName}</p>
                    <p className="text-xs text-mist-500 flex items-center gap-1.5 mt-0.5">
                      {a.date} • {a.time} • {a.type} •{" "}
                      {a.location === "Video" ? <Video size={12} /> : <MapPin size={12} />} {a.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                  {a.status === "Upcoming" && (
                    <>
                      <button onClick={() => updateAppointment(a.id, { status: "Completed" })} className="text-mist-400 hover:text-success transition-colors" title="Mark completed">
                        <CheckCircle2 size={17} />
                      </button>
                      <button onClick={() => updateAppointment(a.id, { status: "Cancelled" })} className="text-mist-400 hover:text-warn transition-colors" title="Cancel">
                        <XCircle size={17} />
                      </button>
                    </>
                  )}
                  <button onClick={() => setToDelete(a)} className="text-mist-400 hover:text-danger transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AppointmentFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        patients={patients}
        onSave={(data) => {
          addAppointment(data);
          setShowForm(false);
        }}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && deleteAppointment(toDelete.id)}
        title="Delete this appointment?"
        description="This appointment will be permanently removed from the schedule."
      />
    </DashboardShell>
  );
}
