import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  CalendarDays,
  User,
  Download,
  Trash2,
} from "lucide-react";

import { useReports } from "../../context/ReportsContext";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    reports,
    deleteReport,
  } = useReports();

  const [downloadMessage, setDownloadMessage] = useState("");

  const report = reports.find(
    (item) => item.id.toString() === id
  );

  if (!report) {
    return (
      <div className="report-details-page">

        <button
          className="back-button"
          type="button"
          onClick={() => navigate("/patient/reports")}
        >
          <ArrowLeft size={18} />
          Back to Reports
        </button>

        <div className="report-not-found">

          <FileText size={40} />

          <h2>Report Not Found</h2>

          <p>
            The report you are looking for does not exist.
          </p>

        </div>

      </div>
    );
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${report.name}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteReport(report.id);

    navigate("/patient/reports");
  };

  const handleDownload = () => {
  if (!report.file) {
    setDownloadMessage(
      "This report file is not available for download."
    );

    setTimeout(() => {
      setDownloadMessage("");
    }, 3000);

    return;
  }

  const fileUrl = URL.createObjectURL(report.file);

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = report.fileName || report.name;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(fileUrl);
};

  return (
    <div className="report-details-page">

      {/* Back Button */}
      <button
        className="back-button"
        type="button"
        onClick={() => navigate("/patient/reports")}
      >
        <ArrowLeft size={18} />
        Back to Reports
      </button>

      {/* Header */}
      <div className="report-details-header">

        <div>
          <h1>{report.name}</h1>

          <p>
            View detailed information about this medical report.
          </p>
        </div>

        <div className="report-header-actions">

          <button
            className="download-report-button"
            type="button"
            onClick={handleDownload}
          >
            <Download size={18} />
            Download Report
          </button>

          <button
            className="delete-report-button"
            type="button"
            onClick={handleDelete}
          >
            <Trash2 size={18} />
            Delete
          </button>

        </div>

      </div>

      {/* Download Message */}
      {downloadMessage && (
        <div className="report-action-message">
          <FileText size={18} />
          <span>{downloadMessage}</span>
        </div>
      )}

      {/* Report Information */}
      <section className="report-details-card">

        <div className="details-card-header">

          <div className="details-file-icon">
            <FileText size={24} />
          </div>

          <div>

            <h2>Report Information</h2>

            <span
              className={`report-status ${
                report.status === "Reviewed"
                  ? "status-reviewed"
                  : "status-pending"
              }`}
            >
              {report.status}
            </span>

          </div>

        </div>

        <div className="report-details-grid">

          <div className="detail-item">
            <span>Report Name</span>
            <strong>{report.name}</strong>
          </div>

          <div className="detail-item">
            <span>Report Type</span>
            <strong>{report.type}</strong>
          </div>

          <div className="detail-item">

            <span>
              <CalendarDays size={15} />
              Date
            </span>

            <strong>{report.date}</strong>

          </div>

          <div className="detail-item">

            <span>
              <User size={15} />
              Doctor
            </span>

            <strong>{report.doctor}</strong>

          </div>

        </div>

      </section>

      {/* Report Summary */}
      <section className="report-summary-card">

        <div className="summary-header">

          <div>
            <h2>Report Summary</h2>

            <p>
              Overview of the uploaded medical report
            </p>
          </div>

          <span className="summary-badge">
            {report.status}
          </span>

        </div>

        <div className="summary-content">

          <div className="summary-item">
            <span>Report Type</span>
            <strong>{report.type}</strong>
          </div>

          <div className="summary-item">
            <span>Uploaded Date</span>
            <strong>{report.date}</strong>
          </div>

          <div className="summary-item">
            <span>Reviewed By</span>
            <strong>{report.doctor}</strong>
          </div>

        </div>

        <div className="summary-note">

          <FileText size={20} />

          <div>

            <strong>Report Available</strong>

            <p>
              Your report has been successfully added to
              your medical records. You can access the
              report details from your reports list.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default ReportDetails;