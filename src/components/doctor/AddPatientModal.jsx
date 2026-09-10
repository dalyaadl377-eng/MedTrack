import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const conditions = ["Hypertension", "Diabetes Type 2", "Asthma", "Coronary Artery Disease", "Thyroid Disorder", "Other"];
const genders = ["Female", "Male", "Other"];

const empty = { name: "", age: "", gender: "Female", condition: "Hypertension", phone: "", email: "" };

export default function AddPatientModal({ open, onClose, onCreate, initial, mode = "create" }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...empty, ...initial } : empty);
      setErrors({});
    }
  }, [open, initial]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.age || Number(form.age) <= 0 || Number(form.age) > 120) e.age = "Enter a valid age";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    setTimeout(() => {
      onCreate({ ...form, age: Number(form.age) });
      setSaving(false);
    }, 400);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add New Patient" : "Edit Patient"}
      description={mode === "create" ? "Create a new patient record." : "Update patient information."}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          placeholder="e.g. Nadia Farouk"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            error={errors.age}
            placeholder="34"
          />
          <Select
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            options={genders.map((g) => ({ label: g, value: g }))}
          />
        </div>
        <Select
          label="Primary Condition"
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
          options={conditions.map((c) => ({ label: c, value: c }))}
        />
        <Input
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors.phone}
          placeholder="+20 100 000 0000"
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          placeholder="patient@example.com"
        />
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth loading={saving}>
            {mode === "create" ? "Add Patient" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
