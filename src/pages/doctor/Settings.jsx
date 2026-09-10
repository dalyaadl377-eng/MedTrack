import { useState } from "react";
import { Bell, Moon, Shield, Save } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";
import Alert from "../../components/ui/Alert";
import { validateResetPasswordForm } from "../../utils/validators";
import { doctorNav } from "./doctorNav";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${checked ? "bg-teal-500" : "bg-ink-700"}`}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-ink-950 transition-transform left-0.5"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function Settings() {
  const [prefs, setPrefs] = useState({
    criticalAlerts: true,
    appointmentReminders: true,
    messageNotifications: true,
    weeklyDigest: false,
    darkMode: true,
  });
  const [saved, setSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ password: "", confirmPassword: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaved, setPwSaved] = useState(false);

  const handleSavePrefs = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const errs = validateResetPasswordForm(pwForm);
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setPwSaved(true);
    setPwForm({ password: "", confirmPassword: "" });
    setTimeout(() => setPwSaved(false), 3000);
  };

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Settings</h1>
        <p className="text-mist-400 mt-1">Manage notifications, appearance, and account security.</p>
      </div>

      {saved && <Alert type="success" title="Preferences saved" className="mb-5">Your notification preferences have been updated.</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <h2 className="font-semibold text-mist-100 mb-4 flex items-center gap-2"><Bell size={16} className="text-teal-400" /> Notifications</h2>
          <div className="flex flex-col divide-y divide-ink-border/60">
            {[
              { key: "criticalAlerts", label: "Critical patient alerts", desc: "Get notified immediately for critical reports." },
              { key: "appointmentReminders", label: "Appointment reminders", desc: "Reminders before scheduled appointments." },
              { key: "messageNotifications", label: "New message alerts", desc: "Notify me when patients send messages." },
              { key: "weeklyDigest", label: "Weekly summary digest", desc: "A weekly email summary of your practice." },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="text-sm text-mist-100">{item.label}</p>
                  <p className="text-xs text-mist-500 mt-0.5">{item.desc}</p>
                </div>
                <Toggle checked={prefs[item.key]} onChange={(v) => setPrefs({ ...prefs, [item.key]: v })} />
              </div>
            ))}
          </div>

          <h2 className="font-semibold text-mist-100 mb-1 mt-6 flex items-center gap-2"><Moon size={16} className="text-teal-400" /> Appearance</h2>
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-sm text-mist-100">Dark mode</p>
              <p className="text-xs text-mist-500 mt-0.5">MedTrack is optimized for dark mode.</p>
            </div>
            <Toggle checked={prefs.darkMode} onChange={(v) => setPrefs({ ...prefs, darkMode: v })} />
          </div>

          <Button size="sm" className="mt-4" onClick={handleSavePrefs}><Save size={14} /> Save Preferences</Button>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-mist-100 mb-4 flex items-center gap-2"><Shield size={16} className="text-teal-400" /> Security</h2>
          {pwSaved && <Alert type="success" title="Password updated" className="mb-4">Your password has been changed successfully.</Alert>}
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <PasswordInput
              label="New Password"
              value={pwForm.password}
              onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
              error={pwErrors.password}
              showStrength
              placeholder="Enter new password"
            />
            <PasswordInput
              label="Confirm New Password"
              value={pwForm.confirmPassword}
              onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              error={pwErrors.confirmPassword}
              placeholder="Re-enter new password"
            />
            <Button type="submit" className="self-start">Update Password</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
