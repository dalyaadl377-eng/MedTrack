import { useState } from "react";

import {
  Activity,
  Stethoscope,
  Pill,
  CalendarDays,
  FileText,
  Search,
  Filter,
  ArrowRight,
  X,
  Clock3,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { useMedicalHistory } from "../../context/MedicalHistoryContext";

const MedicalHistory = () => {
  const {
    history,
    addHistory,
    updateHistory,
    deleteHistory,
  } = useMedicalHistory();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [selectedHistory, setSelectedHistory] =
    useState(null);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingHistory, setEditingHistory] =
    useState(null);

  const [deleteId, setDeleteId] =
    useState(null);

  const [formData, setFormData] = useState({
    title: "",
    doctor: "",
    type: "Checkup",
    date: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  /* =========================================
     SEARCH + FILTER
  ========================================= */

  const filteredHistory = history.filter((item) => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    const matchesSearch =
      item.title
        .toLowerCase()
        .includes(search) ||
      item.doctor
        .toLowerCase()
        .includes(search) ||
      item.type
        .toLowerCase()
        .includes(search) ||
      item.description
        .toLowerCase()
        .includes(search);

    const matchesFilter =
      filterType === "All" ||
      item.type === filterType;

    return (
      matchesSearch &&
      matchesFilter
    );
  });

  /* =========================================
     DATE HELPERS
  ========================================= */

  // Converts a displayed date like:
  // "Sep 04, 2026"
  // into:
  // "2026-09-04"
  // for <input type="date">
  const toInputDate = (dateValue) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Converts:
  // "2026-09-04"
  // into:
  // "Sep 04, 2026"
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(
      `${dateValue}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  /* =========================================
     FORM RESET
  ========================================= */

  const resetForm = () => {
    setFormData({
      title: "",
      doctor: "",
      type: "Checkup",
      date: "",
      description: "",
    });

    setErrors({});
    setEditingHistory(null);
  };

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  const handleOpenEdit = (item) => {
    setEditingHistory(item);

    setFormData({
      title: item.title,
      doctor: item.doctor,
      type: item.type,
      date: toInputDate(item.date),
      description: item.description,
    });

    setErrors({});
    setIsFormOpen(true);
    setSelectedHistory(null);
  };

  /* =========================================
     CLOSE FORM
  ========================================= */

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  /* =========================================
     HANDLE INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* =========================================
     VALIDATION
  ========================================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title =
        "Record title is required.";
    }

    if (!formData.doctor.trim()) {
      newErrors.doctor =
        "Doctor name is required.";
    }

    if (!formData.date) {
      newErrors.date =
        "Date is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =========================================
     SAVE RECORD
  ========================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const recordData = {
      title: formData.title.trim(),
      doctor: formData.doctor.trim(),
      type: formData.type,
      date: formatDate(formData.date),
      description:
        formData.description.trim(),

      icon:
        formData.type === "Checkup"
          ? Stethoscope
          : formData.type === "Lab Test"
          ? Activity
          : formData.type === "Medication"
          ? Pill
          : FileText,
    };

    if (editingHistory) {
      updateHistory(
        editingHistory.id,
        recordData
      );
    } else {
      addHistory(recordData);
    }

    handleCloseForm();
  };

  /* =========================================
     DELETE RECORD
  ========================================= */

  const handleDelete = () => {
    if (!deleteId) {
      return;
    }

    deleteHistory(deleteId);

    setDeleteId(null);
    setSelectedHistory(null);
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="history-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-header">

        <div>

          <span className="history-page-kicker">
            MEDICAL RECORDS
          </span>

          <h1>
            Medical History
          </h1>

          <p>
            Review your previous medical visits,
            tests, and treatment history.
          </p>

        </div>

        <div className="history-header-actions">

          <div className="history-count">
            {filteredHistory.length}{" "}
            {filteredHistory.length === 1
              ? "Record"
              : "Records"}
          </div>

          <button
            type="button"
            className="history-add-button"
            onClick={handleOpenAdd}
          >
            <Plus size={17} />
            Add Record
          </button>

        </div>

      </div>

      {/* =====================================
          SEARCH + FILTER
      ===================================== */}

      <div className="history-toolbar">

        <div className="history-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search medical history..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

          {searchTerm && (

            <button
              type="button"
              className="history-search-clear"
              onClick={() =>
                setSearchTerm("")
              }
              aria-label="Clear search"
            >
              <X size={15} />
            </button>

          )}

        </div>

        <div className="history-filter">

          <Filter size={17} />

          <select
            value={filterType}
            onChange={(event) =>
              setFilterType(
                event.target.value
              )
            }
          >

            <option value="All">
              All Records
            </option>

            <option value="Checkup">
              Checkups
            </option>

            <option value="Lab Test">
              Lab Tests
            </option>

            <option value="Medication">
              Medications
            </option>

          </select>

        </div>

      </div>

      {/* =====================================
          TIMELINE
      ===================================== */}

      <section className="history-timeline">

        {filteredHistory.length > 0 ? (

          filteredHistory.map((item) => {

            const Icon = item.icon;

            return (

              <div
                className="history-item"
                key={item.id}
              >

                {/* TIMELINE ICON */}

                <div className="history-line">

                  <div className="history-icon">

                    <Icon size={20} />

                  </div>

                </div>

                {/* HISTORY CARD */}

                <div className="history-card">

                  <div className="history-card-header">

                    <div>

                      <span className="history-type">
                        {item.type}
                      </span>

                      <h3>
                        {item.title}
                      </h3>

                    </div>

                    <div className="history-date">

                      <CalendarDays size={15} />

                      {item.date}

                    </div>

                  </div>

                  <p className="history-description">
                    {item.description}
                  </p>

                  <div className="history-card-footer">

                    <div className="history-doctor">

                      <Stethoscope size={15} />

                      <span>
                        {item.doctor}
                      </span>

                    </div>

                    <div className="history-actions">

                      {/* VIEW DETAILS */}

                      <button
                        type="button"
                        className="history-details-button"
                        onClick={() =>
                          setSelectedHistory(item)
                        }
                      >

                        <span>
                          View Details
                        </span>

                        <ArrowRight
                          size={16}
                        />

                      </button>

                      {/* EDIT */}

                      <button
                        type="button"
                        className="history-icon-action"
                        onClick={() =>
                          handleOpenEdit(item)
                        }
                        aria-label="Edit record"
                      >

                        <Pencil size={15} />

                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        className="history-icon-action history-delete-action"
                        onClick={() =>
                          setDeleteId(item.id)
                        }
                        aria-label="Delete record"
                      >

                        <Trash2 size={15} />

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            );

          })

        ) : (

          /* =================================
             EMPTY STATE
          ================================= */

          <div className="history-empty">

            <div className="history-empty-icon">

              <FileText size={32} />

            </div>

            <h3>
              No Medical Records Found
            </h3>

            <p>
              Try changing your search or
              filter to find another record.
            </p>

            {(searchTerm ||
              filterType !== "All") && (

              <button
                type="button"
                className="history-reset-button"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("All");
                }}
              >
                Clear Filters
              </button>

            )}

          </div>

        )}

      </section>

      {/* =====================================
          DETAILS MODAL
      ===================================== */}

      {selectedHistory && (

        <div
          className="history-modal-overlay"
          onClick={() =>
            setSelectedHistory(null)
          }
        >

          <div
            className="history-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="history-modal-header">

              <div className="history-modal-title">

                <div className="history-modal-icon">

                  {(() => {

                    const Icon =
                      selectedHistory.icon;

                    return (
                      <Icon size={22} />
                    );

                  })()}

                </div>

                <div>

                  <span className="history-type">
                    {selectedHistory.type}
                  </span>

                  <h2>
                    {selectedHistory.title}
                  </h2>

                </div>

              </div>

              <button
                type="button"
                className="history-modal-close"
                onClick={() =>
                  setSelectedHistory(null)
                }
                aria-label="Close details"
              >

                <X size={19} />

              </button>

            </div>

            {/* MODAL INFO */}

            <div className="history-modal-info">

              <div className="history-modal-info-item">

                <div className="history-modal-info-icon">

                  <CalendarDays
                    size={17}
                  />

                </div>

                <div>

                  <span>
                    Date
                  </span>

                  <strong>
                    {selectedHistory.date}
                  </strong>

                </div>

              </div>

              <div className="history-modal-info-item">

                <div className="history-modal-info-icon">

                  <Stethoscope
                    size={17}
                  />

                </div>

                <div>

                  <span>
                    Doctor
                  </span>

                  <strong>
                    {selectedHistory.doctor}
                  </strong>

                </div>

              </div>

              <div className="history-modal-info-item">

                <div className="history-modal-info-icon">

                  <Clock3
                    size={17}
                  />

                </div>

                <div>

                  <span>
                    Record Type
                  </span>

                  <strong>
                    {selectedHistory.type}
                  </strong>

                </div>

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="history-modal-section">

              <span>
                Medical Record Details
              </span>

              <p>
                {selectedHistory.description}
              </p>

            </div>

            {/* STATUS */}

            <div className="history-modal-status">

              <div className="history-status-dot"></div>

              <div>

                <strong>
                  Record Available
                </strong>

                <p>
                  This medical record is
                  available in your patient
                  history.
                </p>

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="history-modal-actions">

              <button
                type="button"
                className="history-modal-edit"
                onClick={() =>
                  handleOpenEdit(
                    selectedHistory
                  )
                }
              >

                <Pencil size={15} />

                Edit

              </button>

              <button
                type="button"
                className="history-modal-delete"
                onClick={() =>
                  setDeleteId(
                    selectedHistory.id
                  )
                }
              >

                <Trash2 size={15} />

                Delete

              </button>

              <button
                type="button"
                className="history-modal-done"
                onClick={() =>
                  setSelectedHistory(null)
                }
              >
                Done
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {isFormOpen && (

        <div
          className="history-modal-overlay"
          onClick={handleCloseForm}
        >

          <div
            className="history-form-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* FORM HEADER */}

            <div className="history-modal-header">

              <div>

                <span className="history-page-kicker">
                  MEDICAL RECORD
                </span>

                <h2>
                  {editingHistory
                    ? "Edit Record"
                    : "Add Medical Record"}
                </h2>

              </div>

              <button
                type="button"
                className="history-modal-close"
                onClick={handleCloseForm}
                aria-label="Close form"
              >

                <X size={19} />

              </button>

            </div>

            {/* FORM */}

            <form
              className="history-form"
              onSubmit={handleSubmit}
            >

              <div className="history-form-grid">

                {/* TITLE */}

                <div className="history-form-field">

                  <label>
                    Record Title
                  </label>

                  <input
                    name="title"
                    type="text"
                    placeholder="e.g. General Checkup"
                    value={formData.title}
                    onChange={handleChange}
                  />

                  {errors.title && (

                    <span className="history-form-error">
                      {errors.title}
                    </span>

                  )}

                </div>

                {/* DOCTOR */}

                <div className="history-form-field">

                  <label>
                    Doctor
                  </label>

                  <input
                    name="doctor"
                    type="text"
                    placeholder="e.g. Dr. Ahmed Hassan"
                    value={formData.doctor}
                    onChange={handleChange}
                  />

                  {errors.doctor && (

                    <span className="history-form-error">
                      {errors.doctor}
                    </span>

                  )}

                </div>

                {/* TYPE */}

                <div className="history-form-field">

                  <label>
                    Record Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >

                    <option value="Checkup">
                      Checkup
                    </option>

                    <option value="Lab Test">
                      Lab Test
                    </option>

                    <option value="Medication">
                      Medication
                    </option>

                  </select>

                </div>

                {/* DATE */}

                <div className="history-form-field">

                  <label>
                    Date
                  </label>

                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                  />

                  {errors.date && (

                    <span className="history-form-error">
                      {errors.date}
                    </span>

                  )}

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="history-form-field">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  placeholder="Describe the medical record..."
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                />

                {errors.description && (

                  <span className="history-form-error">
                    {errors.description}
                  </span>

                )}

              </div>

              {/* FORM ACTIONS */}

              <div className="history-form-actions">

                <button
                  type="button"
                  className="history-form-cancel"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="history-form-save"
                >

                  {editingHistory
                    ? "Save Changes"
                    : "Add Record"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================
          DELETE CONFIRMATION
      ===================================== */}

      {deleteId && (

        <div
          className="history-modal-overlay"
          onClick={() =>
            setDeleteId(null)
          }
        >

          <div
            className="history-delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="history-delete-icon">

              <Trash2 size={24} />

            </div>

            <h2>
              Delete Medical Record?
            </h2>

            <p>
              This action will permanently
              remove this record from your
              medical history.
            </p>

            <div className="history-delete-actions">

              <button
                type="button"
                className="history-form-cancel"
                onClick={() =>
                  setDeleteId(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="history-form-delete"
                onClick={handleDelete}
              >
                Delete Record
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default MedicalHistory;