import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUp, ArrowDown, Minus } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Alert from "../../components/ui/Alert";
import ErrorState from "../../components/ui/ErrorState";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import { useDoctorData } from "../../context/DoctorDataContext";
import { doctorNav } from "./doctorNav";

const statusTone = { Reviewed: "success", "Pending Review": "warn", Critical: "danger" };

// Keeps numbers visually consistent: whole numbers show with no decimals,
// anything else is rounded to one decimal place.
const formatNumber = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return value;
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

const sharedLabelCount = (reportA, reportB) => {
  const labelsB = new Set((reportB.values || []).map((v) => v.label));
  return (reportA.values || []).filter((v) => labelsB.has(v.label)).length;
};

// Finds the best pair of lab-value reports to show as a default example:
// prefers a patient/pair that share at least one measurement label (so the
// comparison table is actually meaningful), otherwise falls back to the two
// most recent lab-value reports of the first eligible patient.
const findDefaultPair = (patients) => {
  let best = null;

  for (const patient of patients) {
    const valueReports = (patient.reports || []).filter((r) => r.values?.length > 0);
    if (valueReports.length < 2) continue;

    for (let i = 0; i < valueReports.length; i++) {
      for (let j = i + 1; j < valueReports.length; j++) {
        const overlap = sharedLabelCount(valueReports[i], valueReports[j]);
        const [older, newer] =
          new Date(valueReports[i].date) <= new Date(valueReports[j].date)
            ? [valueReports[i], valueReports[j]]
            : [valueReports[j], valueReports[i]];

        if (!best || overlap > best.overlap) {
          best = { patientId: patient.id, idA: older.id, idB: newer.id, overlap };
        }
      }
    }

    // Found a pair that actually shares measurements for this patient — good enough.
    if (best?.overlap > 0) break;
  }

  return best;
};

export default function CompareReports() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { getPatientById, patients } = useDoctorData();

  const paramPatientId = params.get("patient");
  const paramIdA = params.get("a");
  const paramIdB = params.get("b");

  // Fallback: when the page is opened directly (e.g. from the sidebar link)
  // without an explicit selection, default to the best available example
  // pair so the comparison screen never lands on an empty
  // "Nothing to compare" state by default.
  const defaultSelection = useMemo(() => {
    if (paramPatientId && paramIdA && paramIdB) return null;
    return findDefaultPair(patients);
  }, [paramPatientId, paramIdA, paramIdB, patients]);

  const patientId = paramPatientId || defaultSelection?.patientId;
  const idA = paramIdA || defaultSelection?.idA;
  const idB = paramIdB || defaultSelection?.idB;
  const isDefaultSelection = !paramPatientId && !!defaultSelection;

  const patient = getPatientById(patientId);

  const reportA = patient?.reports.find((r) => r.id === idA);
  const reportB = patient?.reports.find((r) => r.id === idB);

  const rows = useMemo(() => {
    if (!reportA || !reportB) return [];
    const labels = new Set([...(reportA.values || []).map((v) => v.label), ...(reportB.values || []).map((v) => v.label)]);
    return [...labels].map((label) => {
      const a = reportA.values.find((v) => v.label === label);
      const b = reportB.values.find((v) => v.label === label);
      let delta = null;
      if (a && b) delta = b.value - a.value;
      return { label, a, b, delta };
    });
  }, [reportA, reportB]);

  if (!patient || !reportA || !reportB) {
    return (
      <DashboardShell navItems={doctorNav}>
        <ErrorState title="Nothing to compare" description="Select two lab results from a patient's Lab Results tab to compare them here." onRetry={() => navigate("/doctor/lab-results")} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={doctorNav}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-mist-400 hover:text-mist-100 mb-4 transition-colors">
        <ArrowLeft size={15} /> Back
      </button>

      {isDefaultSelection && (
        <Alert type="info" title="Showing an example comparison" className="mb-5">
          No results were selected yet, so we picked {patient.name}'s two most recent lab results.
          Head to{" "}
          <button type="button" onClick={() => navigate("/doctor/lab-results")} className="underline hover:text-teal-200">
            Lab Results
          </button>{" "}
          to compare a different pair.
        </Alert>
      )}

      <div className="flex items-center gap-3 mb-6">
        <PatientAvatar name={patient.name} color={patient.avatarColor} size={44} />
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Compare Reports — {patient.name}</h1>
          <p className="text-mist-400 text-sm mt-0.5">{reportA.name} ({reportA.date}) vs {reportB.name} ({reportB.date})</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <Card className="p-4">
          <p className="text-xs text-mist-500 mb-1">Report A</p>
          <p className="text-mist-100 font-medium">{reportA.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-mist-500">{reportA.date}</span>
            <Badge tone={statusTone[reportA.status]}>{reportA.status}</Badge>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-mist-500 mb-1">Report B</p>
          <p className="text-mist-100 font-medium">{reportB.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-mist-500">{reportB.date}</span>
            <Badge tone={statusTone[reportB.status]}>{reportB.status}</Badge>
          </div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-left text-mist-500 text-xs uppercase tracking-wide border-b border-ink-border">
              <th className="font-medium px-5 py-3">Measurement</th>
              <th className="font-medium px-5 py-3">{reportA.date}</th>
              <th className="font-medium px-5 py-3">{reportB.date}</th>
              <th className="font-medium px-5 py-3">Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-ink-border/60 last:border-0">
                <td className="px-5 py-3 text-mist-100">{row.label}</td>
                <td className="px-5 py-3 text-mist-300">{row.a ? `${formatNumber(row.a.value)} ${row.a.unit}` : "—"}</td>
                <td className="px-5 py-3 text-mist-300">{row.b ? `${formatNumber(row.b.value)} ${row.b.unit}` : "—"}</td>
                <td className="px-5 py-3">
                  {row.delta === null ? (
                    <span className="text-mist-500">—</span>
                  ) : row.delta === 0 ? (
                    <span className="flex items-center gap-1 text-mist-400"><Minus size={13} /> No change</span>
                  ) : row.delta > 0 ? (
                    <span className="flex items-center gap-1 text-warn"><ArrowUp size={13} /> +{formatNumber(row.delta)} {row.b.unit}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-success"><ArrowDown size={13} /> {formatNumber(row.delta)} {row.b.unit}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardShell>
  );
}
