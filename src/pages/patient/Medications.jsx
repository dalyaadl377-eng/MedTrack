import { useState } from "react";

import {
  Pill,
  Search,
  Filter,
  Clock,
  User,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Save,
  AlertCircle,
} from "lucide-react";

import { useMedications } from "../../context/MedicationsContext";

const Medications = () => {
  const {
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
  } = useMedications();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] =
    useState("All");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedMedication, setSelectedMedication] =
    useState(null);

  const [editingMedication, setEditingMedication] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    time: "",
    doctor: "",
    startDate: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  /* =========================
     FILTER
  ========================= */

  const filteredMedications =
    medications.filter((medication) => {
      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        medication.name
          .toLowerCase()
          .includes(search) ||
        medication.doctor
          .toLowerCase()
          .includes(search) ||
        medication.dosage
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        filterStatus === "All" ||
        medication.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

  /* =========================
     FORM
  ========================= */

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Medication name is required.";
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage =
        "Dosage is required.";
    }

    if (!formData.time.trim()) {
      newErrors.time =
        "Medication time is required.";
    }

    if (!formData.doctor.trim()) {
      newErrors.doctor =
        "Doctor name is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate =
        "Start date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     OPEN ADD
  ========================= */

  const handleAddMedication = () => {
    setEditingMedication(null);

    setFormData({
      name: "",
      dosage: "",
      frequency: "Once daily",
      time: "",
      doctor: "",
      startDate: "",
      status: "Active",
    });

    setErrors({});
    setIsModalOpen(true);
  };

  /* =========================
     OPEN EDIT
  ========================= */

  const handleEditMedication = (medication) => {
    setEditingMedication(medication);

    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      time: medication.time,
      doctor: medication.doctor,
      startDate: medication.startDate,
      status: medication.status,
    });

    setErrors({});
    setIsModalOpen(true);
  };

  /* =========================
     SAVE
  ========================= */

  const handleSaveMedication = () => {
    if (!validateForm()) {
      return;
    }

    if (editingMedication) {
      updateMedication(
        editingMedication.id,
        formData
      );
    } else {
      addMedication(formData);
    }

    setIsModalOpen(false);
    setEditingMedication(null);
  };

  /* =========================
     DELETE
  ========================= */

  const handleDeleteMedication = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medication?"
    );

    if (!confirmed) {
      return;
    }

    deleteMedication(id);

    if (
      selectedMedication &&
      selectedMedication.id === id
    ) {
      setSelectedMedication(null);
    }
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedication(null);
    setErrors({});
  };

  return (
    <div className="medications-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <span className="health-page-kicker">
            TREATMENT PLAN
          </span>

          <h1>Medications</h1>

          <p>
            Keep track of your current medications
            and treatment schedule.
          </p>
        </div>

        <div className="medications-header-actions">

          <div className="medications-count">
            {filteredMedications.length}{" "}
            Medications
          </div>

          <button
            type="button"
            className="medication-add-button"
            onClick={handleAddMedication}
          >
            <Plus size={17} />
            Add Medication
          </button>

        </div>
      </div>

      {/* =========================
          SEARCH & FILTER
      ========================= */}

      <div className="medications-toolbar">

        <div className="medications-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search medications, dosage, doctors..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="medication-search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="medications-filter">
          <Filter size={17} />

          <select
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(
                event.target.value
              )
            }
          >
            <option value="All">
              All Medications
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

      </div>

      {/* =========================
          MEDICATIONS LIST
      ========================= */}

      <section className="medications-list">

        {filteredMedications.length > 0 ? (

          filteredMedications.map(
            (medication) => (

              <div
                className="medication-card"
                key={medication.id}
              >

                {/* Icon */}

                <div className="medication-icon">
                  <Pill size={23} />
                </div>

                {/* Main */}

                <div className="medication-main">

                  <div className="medication-title-row">

                    <div>
                      <h3>
                        {medication.name}
                      </h3>

                      <span className="medication-dosage">
                        {medication.dosage}
                      </span>
                    </div>

                    <span
                      className={`medication-status ${
                        medication.status ===
                        "Active"
                          ? "medication-active"
                          : "medication-completed"
                      }`}
                    >
                      {medication.status}
                    </span>

                  </div>

                  {/* Details */}

                  <div className="medication-details">

                    <div>
                      <Clock size={15} />

                      <span>
                        {medication.frequency}
                      </span>
                    </div>

                    <div>
                      <CalendarDays
                        size={15}
                      />

                      <span>
                        {medication.time}
                      </span>
                    </div>

                    <div>
                      <User size={15} />

                      <span>
                        {medication.doctor}
                      </span>
                    </div>

                  </div>

                  <div className="medication-start">
                    Started:{" "}
                    {medication.startDate}
                  </div>

                </div>

                {/* Actions */}

                <div className="medication-actions">

                  <button
                    type="button"
                    className="medication-action-button"
                    onClick={() =>
                      setSelectedMedication(
                        medication
                      )
                    }
                    title="View Details"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    type="button"
                    className="medication-action-button"
                    onClick={() =>
                      handleEditMedication(
                        medication
                      )
                    }
                    title="Edit Medication"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    className="medication-action-button medication-delete-button"
                    onClick={() =>
                      handleDeleteMedication(
                        medication.id
                      )
                    }
                    title="Delete Medication"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>
            )
          )

        ) : (

          /* =========================
             EMPTY STATE
          ========================= */

          <div className="medications-empty">

            <div className="medications-empty-icon">
              <Pill size={32} />
            </div>

            <h3>
              No Medications Found
            </h3>

            <p>
              Try changing your search or filter,
              or add a new medication.
            </p>

            <button
              type="button"
              className="medication-empty-button"
              onClick={handleAddMedication}
            >
              <Plus size={16} />
              Add Medication
            </button>

          </div>
        )}

      </section>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {isModalOpen && (
        <div
          className="medication-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="medication-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="medication-modal-header">

              <div>
                <span className="health-page-kicker">
                  {editingMedication
                    ? "UPDATE MEDICATION"
                    : "NEW MEDICATION"}
                </span>

                <h2>
                  {editingMedication
                    ? "Edit Medication"
                    : "Add Medication"}
                </h2>

                <p>
                  Enter the medication details
                  below.
                </p>
              </div>

              <button
                type="button"
                className="medication-modal-close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <X size={19} />
              </button>

            </div>

            <div className="medication-form">

              {/* Name */}

              <div className="medication-form-group">

                <label htmlFor="medication-name">
                  Medication Name
                </label>

                <input
                  id="medication-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Metformin"
                />

                {errors.name && (
                  <span className="medication-field-error">
                    <AlertCircle size={14} />
                    {errors.name}
                  </span>
                )}

              </div>

              {/* Dosage */}

              <div className="medication-form-group">

                <label htmlFor="medication-dosage">
                  Dosage
                </label>

                <input
                  id="medication-dosage"
                  name="dosage"
                  type="text"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="e.g. 500 mg"
                />

                {errors.dosage && (
                  <span className="medication-field-error">
                    <AlertCircle size={14} />
                    {errors.dosage}
                  </span>
                )}

              </div>

              {/* Frequency */}

              <div className="medication-form-row">

                <div className="medication-form-group">

                  <label htmlFor="medication-frequency">
                    Frequency
                  </label>

                  <select
                    id="medication-frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                  >
                    <option>
                      Once daily
                    </option>

                    <option>
                      Twice daily
                    </option>

                    <option>
                      Three times daily
                    </option>

                    <option>
                      Every other day
                    </option>

                    <option>
                      As needed
                    </option>
                  </select>

                </div>

                {/* Time */}

                <div className="medication-form-group">

                  <label htmlFor="medication-time">
                    Time
                  </label>

                  <input
                    id="medication-time"
                    name="time"
                    type="text"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="e.g. 08:00 AM"
                  />

                  {errors.time && (
                    <span className="medication-field-error">
                      <AlertCircle size={14} />
                      {errors.time}
                    </span>
                  )}

                </div>

              </div>

              {/* Doctor */}

              <div className="medication-form-group">

                <label htmlFor="medication-doctor">
                  Doctor
                </label>

                <input
                  id="medication-doctor"
                  name="doctor"
                  type="text"
                  value={formData.doctor}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Ahmed Hassan"
                />

                {errors.doctor && (
                  <span className="medication-field-error">
                    <AlertCircle size={14} />
                    {errors.doctor}
                  </span>
                )}

              </div>

              {/* Start Date */}

              <div className="medication-form-row">

                <div className="medication-form-group">

                  <label htmlFor="medication-start-date">
                    Start Date
                  </label>

                  <input
                    id="medication-start-date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                  />

                  {errors.startDate && (
                    <span className="medication-field-error">
                      <AlertCircle size={14} />
                      {errors.startDate}
                    </span>
                  )}

                </div>

                {/* Status */}

                <div className="medication-form-group">

                  <label htmlFor="medication-status">
                    Status
                  </label>

                  <select
                    id="medication-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>

                </div>

              </div>

            </div>

            <div className="medication-modal-actions">

              <button
                type="button"
                className="medication-cancel-button"
                onClick={handleCloseModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="medication-save-button"
                onClick={handleSaveMedication}
              >
                <Save size={16} />

                {editingMedication
                  ? "Save Changes"
                  : "Add Medication"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          DETAILS MODAL
      ========================= */}

      {selectedMedication && (
        <div
          className="medication-modal-overlay"
          onClick={() =>
            setSelectedMedication(null)
          }
        >

          <div
            className="medication-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="medication-details-header">

              <div className="medication-details-title">

                <div className="medication-details-icon">
                  <Pill size={24} />
                </div>

                <div>
                  <span>
                    MEDICATION DETAILS
                  </span>

                  <h2>
                    {selectedMedication.name}
                  </h2>
                </div>

              </div>

              <button
                type="button"
                className="medication-modal-close"
                onClick={() =>
                  setSelectedMedication(null)
                }
              >
                <X size={19} />
              </button>

            </div>

            <div className="medication-details-status-row">

              <span>
                Current Status
              </span>

              <span
                className={`medication-status ${
                  selectedMedication.status ===
                  "Active"
                    ? "medication-active"
                    : "medication-completed"
                }`}
              >
                {selectedMedication.status}
              </span>

            </div>

            <div className="medication-detail-grid">

              <div>
                <span>
                  Dosage
                </span>

                <strong>
                  {selectedMedication.dosage}
                </strong>
              </div>

              <div>
                <span>
                  Frequency
                </span>

                <strong>
                  {selectedMedication.frequency}
                </strong>
              </div>

              <div>
                <span>
                  Schedule
                </span>

                <strong>
                  {selectedMedication.time}
                </strong>
              </div>

              <div>
                <span>
                  Doctor
                </span>

                <strong>
                  {selectedMedication.doctor}
                </strong>
              </div>

              <div>
                <span>
                  Start Date
                </span>

                <strong>
                  {selectedMedication.startDate}
                </strong>
              </div>

            </div>

            <div className="medication-details-note">
              <Clock size={17} />

              <p>
                Follow the medication schedule
                provided by your doctor. Do not
                change the dosage without medical
                advice.
              </p>
            </div>

            <button
              type="button"
              className="medication-done-button"
              onClick={() =>
                setSelectedMedication(null)
              }
            >
              Done
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Medications;