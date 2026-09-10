// Lightweight rule-engine that scans real patient data (trends, reports,
// visit history) and produces insight cards. This is what powers the
// "AI Insights" advanced feature — every insight below is derived from
// the actual mock data in context, not hardcoded copy.

const pctChange = (from, to) => (from ? ((to - from) / from) * 100 : 0);

export function generateInsights(patients) {
  const insights = [];

  patients.forEach((p) => {
    const t = p.trends || [];
    if (t.length >= 3) {
      const first = t[0];
      const last = t[t.length - 1];

      const cholChange = pctChange(first.cholesterol, last.cholesterol);
      if (cholChange >= 8) {
        insights.push({
          id: `chol-${p.id}`,
          patientId: p.id,
          patientName: p.name,
          type: "warning",
          title: `Rising cholesterol trend — ${p.name}`,
          description: `Cholesterol increased ${cholChange.toFixed(1)}% over the last ${t.length} months (${first.cholesterol} → ${last.cholesterol} mg/dL). Consider reviewing diet and lipid-lowering therapy.`,
        });
      } else if (cholChange <= -8) {
        insights.push({
          id: `chol-good-${p.id}`,
          patientId: p.id,
          patientName: p.name,
          type: "positive",
          title: `Cholesterol improving — ${p.name}`,
          description: `Cholesterol dropped ${Math.abs(cholChange).toFixed(1)}% over the last ${t.length} months. Current treatment plan appears effective.`,
        });
      }

      const glucoseChange = pctChange(first.glucose, last.glucose);
      if (glucoseChange >= 8) {
        insights.push({
          id: `glu-${p.id}`,
          patientId: p.id,
          patientName: p.name,
          type: "warning",
          title: `Glucose trending upward — ${p.name}`,
          description: `Fasting glucose rose ${glucoseChange.toFixed(1)}% (${first.glucose} → ${last.glucose} mg/dL) over the tracked period. Recommend reassessing glycemic control.`,
        });
      } else if (glucoseChange <= -8) {
        insights.push({
          id: `glu-good-${p.id}`,
          patientId: p.id,
          patientName: p.name,
          type: "positive",
          title: `Glucose control improving — ${p.name}`,
          description: `Fasting glucose fell ${Math.abs(glucoseChange).toFixed(1)}% over the last ${t.length} months. Keep up the current regimen.`,
        });
      }
    }

    const critical = (p.reports || []).filter((r) => r.status === "Critical");
    if (critical.length > 0) {
      insights.push({
        id: `crit-${p.id}`,
        patientId: p.id,
        patientName: p.name,
        type: "critical",
        title: `${critical.length} critical report${critical.length > 1 ? "s" : ""} — ${p.name}`,
        description: `${critical.map((r) => r.name).join(", ")} flagged as critical and may need immediate attention.`,
      });
    }

    const pending = (p.reports || []).filter((r) => r.status === "Pending Review");
    if (pending.length >= 2) {
      insights.push({
        id: `pending-${p.id}`,
        patientId: p.id,
        patientName: p.name,
        type: "info",
        title: `${pending.length} reports awaiting review — ${p.name}`,
        description: `Reports (${pending.map((r) => r.name).join(", ")}) have been pending review. Consider prioritizing this patient's queue.`,
      });
    }

    if (p.lastVisit) {
      const daysSince = Math.floor((Date.now() - new Date(p.lastVisit).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince > 60) {
        insights.push({
          id: `visit-${p.id}`,
          patientId: p.id,
          patientName: p.name,
          type: "warning",
          title: `No visit in ${daysSince} days — ${p.name}`,
          description: `${p.name} (${p.condition}) hasn't had a recorded visit in over ${daysSince} days. Consider outreach for a follow-up appointment.`,
        });
      }
    }
  });

  const order = { critical: 0, warning: 1, info: 2, positive: 3 };
  return insights.sort((a, b) => order[a.type] - order[b.type]);
}
