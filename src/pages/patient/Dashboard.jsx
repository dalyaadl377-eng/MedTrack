import StatCard from "../../components/dashboard/StatCard";
import UploadReport from "../../components/dashboard/UploadReport";

import { useReports } from "../../context/ReportsContext";
import { useHealth } from "../../context/HealthContext";

import {
  FileText,
  HeartPulse,
  Activity,
  CalendarDays,
} from "lucide-react";

const Dashboard = () => {
  const { reports } = useReports();
  const { healthData } = useHealth();

  const reviewedReports = reports.filter(
    (report) => report.status === "Reviewed"
  ).length;

  const pendingReports = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const dashboardStats = [
    {
      id: 1,
      title: "Total Reports",
      value: reports.length,
      subtitle: "Medical reports",
      icon: FileText,
      type: "reports",
    },
    {
      id: 2,
      title: "Reviewed Reports",
      value: reviewedReports,
      subtitle: "Reports reviewed",
      icon: FileText,
      type: "success",
    },
    {
      id: 3,
      title: "Heart Rate",
      value: healthData.heartRate.value,
      subtitle: `${healthData.heartRate.unit} • ${healthData.heartRate.status}`,
      icon: HeartPulse,
      type: "heart",
    },
    {
      id: 4,
      title: "Blood Pressure",
      value: healthData.bloodPressure.value,
      subtitle: `${healthData.bloodPressure.unit} • ${healthData.bloodPressure.status}`,
      icon: Activity,
      type: "health",
    },
  ];

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Patient Dashboard</h1>

          <p>
            Welcome back, Sarah. Here's your health overview.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <section className="stats-grid">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            type={stat.type}
          />
        ))}
      </section>

      {/* Pending Reports Info */}
      {pendingReports > 0 && (
        <div className="dashboard-info-card">
          <div className="dashboard-info-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <strong>
              {pendingReports} report
              {pendingReports > 1 ? "s" : ""} pending review
            </strong>

            <p>
              Your recent medical reports are waiting to be
              reviewed by your doctor.
            </p>
          </div>
        </div>
      )}

      {/* Upload */}
      <div className="dashboard-upload">
        <UploadReport />
      </div>

    </div>
  );
};

export default Dashboard;