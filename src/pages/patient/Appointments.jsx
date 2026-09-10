import { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Search,
  Filter,
  Video,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Save,
  CheckCircle,
} from "lucide-react";

import { useAppointments } from "../../context/AppointmentsContext";
import { useNotifications } from "../../context/NotificationsContext";

const emptyForm = {
  doctor: "",
  specialty: "",
  date: "",
  time: "",
  location: "",
  type: "In Person",
};

const Appointments = () => {
  const {
    appointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
  } = useAppointments();

  const { addNotification } = useNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [editingAppointment, setEditingAppointment] =
    useState(null);

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] =
    useState("");

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        appointment.doctor
          .toLowerCase()
          .includes(search) ||
        appointment.specialty
          .toLowerCase()
          .includes(search) ||
        appointment.location
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        filterStatus === "All" ||
        appointment.status === filterStatus;

      return matchesSearch && matchesStatus;
    }
  );

  const openAddModal = () => {
    setEditingAppointment(null);
    setFormData(emptyForm);
    setErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (appointment) => {
    setEditingAppointment(appointment);

    setFormData({
      doctor: appointment.doctor,
      specialty: appointment.specialty,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location,
      type: appointment.type,
    });

    setErrors({});
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingAppointment(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctor.trim()) {
      newErrors.doctor = "Doctor name is required.";
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty =
        "Specialty is required.";
    }

    if (!formData.date.trim()) {
      newErrors.date = "Date is required.";
    }

    if (!formData.time.trim()) {
      newErrors.time = "Time is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location =
        "Location is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "";

    if (
      time.includes("AM") ||
      time.includes("PM")
    ) {
      return time;
    }

    const [hours, minutes] = time.split(":");

    if (
      hours === undefined ||
      minutes === undefined
    ) {
      return time;
    }

    const hour = Number(hours);

    if (Number.isNaN(hour)) {
      return time;
    }

    const period = hour >= 12 ? "PM" : "AM";

    const formattedHour =
      hour % 12 === 0 ? 12 : hour % 12;

    return `${String(formattedHour).padStart(
      2,
      "0"
    )}:${minutes} ${period}`;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const appointmentData = {
      ...formData,
      date: formatDate(formData.date),
      time: formatTime(formData.time),
    };

    if (editingAppointment) {
      updateAppointment(
        editingAppointment.id,
        appointmentData
      );

      setSuccessMessage(
        "Appointment updated successfully."
      );
    } else {
      addAppointment(appointmentData);

      // Add notification only for a new appointment
      addNotification({
        title: "Appointment Scheduled",
        message: `Your appointment with ${formData.doctor} has been scheduled for ${formatDate(
          formData.date
        )} at ${formatTime(formData.time)}.`,
        type: "appointment",
        path: "/patient/appointments",
      });

      setSuccessMessage(
        "Appointment added successfully."
      );
    }

    closeFormModal();

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleCancel = (appointment) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel the appointment with ${appointment.doctor}?`
    );

    if (!confirmed) {
      return;
    }

    cancelAppointment(appointment.id);

    setSuccessMessage(
      "Appointment cancelled successfully."
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleDelete = () => {
    if (!selectedAppointment) {
      return;
    }

    deleteAppointment(selectedAppointment.id);

    setSelectedAppointment(null);
    setShowDeleteModal(false);

    setSuccessMessage(
      "Appointment deleted successfully."
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const getStatusClass = (status) => {
    if (status === "Upcoming") {
      return "appointment-upcoming";
    }

    if (status === "Completed") {
      return "appointment-completed";
    }

    return "appointment-cancelled";
  };

  return (
    <div className="appointments-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Appointments</h1>

          <p>
            Manage your upcoming and previous medical
            appointments.
          </p>
        </div>

        <div className="appointments-header-actions">
          <div className="appointments-count">
            {filteredAppointments.length} Appointments
          </div>

          <button
            type="button"
            className="add-appointment-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Appointment
          </button>
        </div>
      </div>

      {/* Success */}
      {successMessage && (
        <div className="appointments-success">
          <CheckCircle size={17} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="appointments-toolbar">
        <div className="appointments-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search doctor, specialty or location..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="appointments-filter">
          <Filter size={17} />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
          >
            <option value="All">
              All Appointments
            </option>

            <option value="Upcoming">
              Upcoming
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      {/* Appointments */}
      <section className="appointments-list">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div
              className="appointment-card"
              key={appointment.id}
            >
              <div className="appointment-doctor-icon">
                <User size={23} />
              </div>

              <div className="appointment-main">
                <div className="appointment-header">
                  <div>
                    <h3>
                      {appointment.doctor}
                    </h3>

                    <span>
                      {appointment.specialty}
                    </span>
                  </div>

                  <span
                    className={`appointment-status ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="appointment-details">
                  <div>
                    <CalendarDays size={15} />

                    <span>
                      {appointment.date}
                    </span>
                  </div>

                  <div>
                    <Clock size={15} />

                    <span>
                      {appointment.time}
                    </span>
                  </div>

                  <div>
                    {appointment.type ===
                    "Video Call" ? (
                      <Video size={15} />
                    ) : (
                      <MapPin size={15} />
                    )}

                    <span>
                      {appointment.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="appointment-actions">
                <button
                  type="button"
                  className="appointment-view-button"
                  onClick={() =>
                    handleViewDetails(appointment)
                  }
                  title="View details"
                >
                  <Eye size={16} />
                </button>

                {appointment.status ===
                  "Upcoming" && (
                  <>
                    <button
                      type="button"
                      className="appointment-edit-button"
                      onClick={() =>
                        openEditModal(appointment)
                      }
                      title="Edit appointment"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="cancel-appointment-button"
                      onClick={() =>
                        handleCancel(appointment)
                      }
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  </>
                )}

                {appointment.status !==
                  "Upcoming" && (
                  <button
                    type="button"
                    className="appointment-delete-button"
                    onClick={() => {
                      setSelectedAppointment(
                        appointment
                      );
                      setShowDeleteModal(true);
                    }}
                    title="Delete appointment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="appointments-empty">
            <CalendarDays size={40} />

            <h3>No Appointments Found</h3>

            <p>
              Try changing your search or filter.
            </p>
          </div>
        )}
      </section>

      {/* Add / Edit Modal */}
      {showFormModal && (
        <div
          className="appointment-modal-overlay"
          onClick={closeFormModal}
        >
          <div
            className="appointment-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="appointment-modal-header">
              <div>
                <h2>
                  {editingAppointment
                    ? "Edit Appointment"
                    : "Add Appointment"}
                </h2>

                <p>
                  {editingAppointment
                    ? "Update appointment information."
                    : "Create a new medical appointment."}
                </p>
              </div>

              <button
                type="button"
                className="appointment-modal-close"
                onClick={closeFormModal}
              >
                <X size={19} />
              </button>
            </div>

            <div className="appointment-form">
              <div className="appointment-form-grid">
                <div className="appointment-form-field">
                  <label htmlFor="doctor">
                    Doctor
                  </label>

                  <input
                    id="doctor"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Ahmed Hassan"
                  />

                  {errors.doctor && (
                    <span className="appointment-form-error">
                      {errors.doctor}
                    </span>
                  )}
                </div>

                <div className="appointment-form-field">
                  <label htmlFor="specialty">
                    Specialty
                  </label>

                  <input
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="e.g. Cardiology"
                  />

                  {errors.specialty && (
                    <span className="appointment-form-error">
                      {errors.specialty}
                    </span>
                  )}
                </div>

                <div className="appointment-form-field">
                  <label htmlFor="date">
                    Date
                  </label>

                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />

                  {errors.date && (
                    <span className="appointment-form-error">
                      {errors.date}
                    </span>
                  )}
                </div>

                <div className="appointment-form-field">
                  <label htmlFor="time">
                    Time
                  </label>

                  <input
                    id="time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />

                  {errors.time && (
                    <span className="appointment-form-error">
                      {errors.time}
                    </span>
                  )}
                </div>

                <div className="appointment-form-field">
                  <label htmlFor="type">
                    Appointment Type
                  </label>

                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="In Person">
                      In Person
                    </option>

                    <option value="Video Call">
                      Video Call
                    </option>
                  </select>
                </div>

                <div className="appointment-form-field">
                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Medical center or online"
                  />

                  {errors.location && (
                    <span className="appointment-form-error">
                      {errors.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="appointment-modal-actions">
                <button
                  type="button"
                  className="appointment-modal-cancel"
                  onClick={closeFormModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="appointment-modal-save"
                  onClick={handleSubmit}
                >
                  <Save size={16} />

                  {editingAppointment
                    ? "Save Changes"
                    : "Add Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal &&
        selectedAppointment && (
          <div
            className="appointment-modal-overlay"
            onClick={() =>
              setShowDetailsModal(false)
            }
          >
            <div
              className="appointment-modal appointment-details-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="appointment-modal-header">
                <div>
                  <h2>Appointment Details</h2>

                  <p>
                    Complete information about this
                    appointment.
                  </p>
                </div>

                <button
                  type="button"
                  className="appointment-modal-close"
                  onClick={() =>
                    setShowDetailsModal(false)
                  }
                >
                  <X size={19} />
                </button>
              </div>

              <div className="appointment-details-content">
                <div className="appointment-details-profile">
                  <div className="appointment-details-avatar">
                    <User size={25} />
                  </div>

                  <div>
                    <h3>
                      {selectedAppointment.doctor}
                    </h3>

                    <span>
                      {
                        selectedAppointment.specialty
                      }
                    </span>
                  </div>
                </div>

                <div className="appointment-details-grid">
                  <div>
                    <CalendarDays size={17} />

                    <span>Date</span>

                    <strong>
                      {selectedAppointment.date}
                    </strong>
                  </div>

                  <div>
                    <Clock size={17} />

                    <span>Time</span>

                    <strong>
                      {selectedAppointment.time}
                    </strong>
                  </div>

                  <div>
                    {selectedAppointment.type ===
                    "Video Call" ? (
                      <Video size={17} />
                    ) : (
                      <MapPin size={17} />
                    )}

                    <span>Location</span>

                    <strong>
                      {
                        selectedAppointment.location
                      }
                    </strong>
                  </div>

                  <div>
                    <CalendarDays size={17} />

                    <span>Type</span>

                    <strong>
                      {selectedAppointment.type}
                    </strong>
                  </div>
                </div>

                <div className="appointment-detail-status">
                  <span>Status</span>

                  <span
                    className={`appointment-status ${getStatusClass(
                      selectedAppointment.status
                    )}`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Delete Confirmation */}
      {showDeleteModal &&
        selectedAppointment && (
          <div
            className="appointment-modal-overlay"
            onClick={() =>
              setShowDeleteModal(false)
            }
          >
            <div
              className="appointment-delete-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="appointment-delete-icon">
                <Trash2 size={22} />
              </div>

              <h2>Delete Appointment?</h2>

              <p>
                Are you sure you want to delete the
                appointment with{" "}
                <strong>
                  {selectedAppointment.doctor}
                </strong>
                ?
              </p>

              <div className="appointment-delete-actions">
                <button
                  type="button"
                  className="appointment-modal-cancel"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                >
                  Keep Appointment
                </button>

                <button
                  type="button"
                  className="appointment-confirm-delete"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Appointments;