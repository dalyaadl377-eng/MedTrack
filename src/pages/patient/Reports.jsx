import { useState } from "react";

import {
  FileText,
  Search,
  Filter,
  CalendarDays,
  ChevronRight,
  Trash2,
  Plus,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useReports } from "../../context/ReportsContext";
import UploadReport from "../../components/dashboard/UploadReport";

const Reports = () => {
  const navigate = useNavigate();

  const {
    reports,
    deleteReport,
  } = useReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showUpload, setShowUpload] = useState(false);

  const filteredReports = reports.filter((report) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      report.name.toLowerCase().includes(search) ||
      report.type.toLowerCase().includes(search) ||
      report.doctor.toLowerCase().includes(search);

    const matchesFilter =
      filterType === "All" ||
      report.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteReport(id);
  };

  return (
    <div className="reports-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>My Reports</h1>

          <p>
            View and manage your medical reports and test results.
          </p>
        </div>

        <div className="reports-header-actions">

          <div className="reports-count">
            {filteredReports.length}{" "}
            {filteredReports.length === 1
              ? "Report"
              : "Reports"}
          </div>

          <button
            className="add-report-button"
            type="button"
            onClick={() => setShowUpload(true)}
          >
            <Plus size={18} />
            <span>Add New Report</span>
          </button>

        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="upload-modal-overlay">

          <div className="upload-modal">

            <div className="upload-modal-header">

              <div>
                <h2>Add New Report</h2>

                <p>
                  Upload your medical report or test result.
                </p>
              </div>

              <button
                className="upload-modal-close"
                type="button"
                onClick={() => setShowUpload(false)}
              >
                <X size={20} />
              </button>

            </div>

            <UploadReport />

          </div>

        </div>
      )}

      {/* Search & Filter */}
      <div className="reports-toolbar">

        <div className="reports-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="reports-filter">
          <Filter size={17} />

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value)
            }
          >
            <option value="All">
              All Reports
            </option>

            <option value="Blood Test">
              Blood Tests
            </option>

            <option value="Imaging">
              Imaging
            </option>
          </select>
        </div>

      </div>

      {/* Reports List */}
      <section className="reports-list">

        {filteredReports.length > 0 ? (

          filteredReports.map((report) => (

            <div
              className="report-card"
              key={report.id}
            >

              <div className="report-icon">
                <FileText size={22} />
              </div>

              <div className="report-info">

                <h3>
                  {report.name}
                </h3>

                <div className="report-meta">

                  <span>
                    {report.type}
                  </span>

                  <span className="meta-separator">
                    •
                  </span>

                  <span>
                    <CalendarDays size={13} />
                    {report.date}
                  </span>

                </div>

                <p>
                  {report.doctor}
                </p>

              </div>

              <div className="report-right">

                <span
                  className={`report-status ${
                    report.status === "Reviewed"
                      ? "status-reviewed"
                      : "status-pending"
                  }`}
                >
                  {report.status}
                </span>

                <div className="report-actions">

                  <button
                    className="report-details-button"
                    type="button"
                    onClick={() =>
                      navigate(
                       `/patient/reports/${report.id}`
                      )
                    }
                  >
                    <span>
                      View Details
                    </span>

                    <ChevronRight size={17} />
                  </button>

                  <button
                    className="report-delete-button"
                    type="button"
                    title="Delete report"
                    onClick={() =>
                      handleDelete(
                        report.id,
                        report.name
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="reports-empty">

            <FileText size={38} />

            <h3>
              {reports.length === 0
                ? "No Reports Yet"
                : "No Reports Found"}
            </h3>

            <p>
              {reports.length === 0
                ? "Upload your first medical report from the Dashboard."
                : "Try changing your search or filter."}
            </p>

          </div>

        )}

      </section>

    </div>
  );
};

export default Reports;