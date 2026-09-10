import { useState } from "react";

import {
  Bell,
  Clock,
  Pill,
  CalendarDays,
  Stethoscope,
  Search,
  Filter,
  CheckCircle,
  Plus,
  X,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import { useReminders } from "../../context/ReminderContext";
import { useNotifications } from "../../context/NotificationsContext";

const Reminders = () => {
  const {
    reminders,
    addReminder,
    updateReminder,
    markReminderDone,
    deleteReminder,
  } = useReminders();

  const { addNotification } = useNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [selectedReminder, setSelectedReminder] = useState(null);
  const [editingReminder, setEditingReminder] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "Medication",
    time: "",
    date: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const filteredReminders = reminders.filter((reminder) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      reminder.title.toLowerCase().includes(search) ||
      reminder.type.toLowerCase().includes(search) ||
      reminder.description.toLowerCase().includes(search);

    const matchesStatus =
      filterStatus === "All" ||
      reminder.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingReminder(null);

    setFormData({
      title: "",
      type: "Medication",
      time: "",
      date: "",
      description: "",
    });

    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (reminder) => {
    setEditingReminder(reminder);

    setFormData({
      title: reminder.title,
      type: reminder.type,
      time: reminder.time,
      date: reminder.date,
      description: reminder.description,
    });

    setErrors({});
    setShowModal(true);
  };

  const openDetails = (reminder) => {
    setSelectedReminder(reminder);
    setShowDetails(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    if (!formData.title.trim()) {
      newErrors.title = "Reminder title is required.";
    }

    if (!formData.time) {
      newErrors.time = "Reminder time is required.";
    }

    if (!formData.date.trim()) {
      newErrors.date = "Reminder date is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const reminderData = {
      ...formData,
    };

    if (editingReminder) {
      updateReminder(
        editingReminder.id,
        reminderData
      );
    } else {
      addReminder(reminderData);

      addNotification({
        title: "New Reminder Added",
        message: `${formData.title} has been added to your reminders.`,
        type: "health",
        path: "/patient/reminders",
      });
    }

    setShowModal(false);
  };

  const handleDelete = () => {
    if (!selectedReminder) return;

    deleteReminder(selectedReminder.id);

    setSelectedReminder(null);
    setShowDeleteConfirm(false);
    setShowDetails(false);
  };

  const handleMarkDone = (id) => {
    markReminderDone(id);
  };

  return (
    <div className="reminders-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Reminders</h1>

          <p>
            Stay on track with your medications,
            appointments, and health activities.
          </p>
        </div>

        <button
          type="button"
          className="primary-action-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Reminder
        </button>
      </div>

      {/* Toolbar */}
      <div className="reminders-toolbar">

        <div className="reminders-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search reminders..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="reminders-filter">
          <Filter size={17} />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
          >
            <option value="All">
              All Reminders
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

      {/* List */}
      <section className="reminders-list">

        {filteredReminders.length > 0 ? (
          filteredReminders.map((reminder) => {

            const Icon = reminder.icon;

            return (
              <div
                className={`reminder-card ${
                  reminder.status === "Completed"
                    ? "reminder-completed-card"
                    : ""
                }`}
                key={reminder.id}
              >

                <div className="reminder-icon">
                  <Icon size={22} />
                </div>

                <div className="reminder-main">

                  <div className="reminder-header">

                    <div>
                      <span className="reminder-type">
                        {reminder.type}
                      </span>

                      <h3>
                        {reminder.title}
                      </h3>
                    </div>

                    <span
                      className={`reminder-status ${
                        reminder.status === "Active"
                          ? "reminder-active"
                          : "reminder-done"
                      }`}
                    >
                      {reminder.status}
                    </span>

                  </div>

                  <p className="reminder-description">
                    {reminder.description}
                  </p>

                  <div className="reminder-details">

                    <div>
                      <Clock size={15} />
                      <span>
                        {reminder.time}
                      </span>
                    </div>

                    <div>
                      <CalendarDays size={15} />
                      <span>
                        {reminder.date}
                      </span>
                    </div>

                  </div>

                </div>

                {/* Actions */}
                <div className="reminder-actions">

                  <button
                    type="button"
                    className="reminder-action-button"
                    title="View Details"
                    onClick={() =>
                      openDetails(reminder)
                    }
                  >
                    <Eye size={16} />
                  </button>

                  {reminder.status === "Active" && (
                    <>
                      <button
                        type="button"
                        className="reminder-action-button"
                        title="Edit"
                        onClick={() =>
                          openEditModal(reminder)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="mark-done-button"
                        onClick={() =>
                          handleMarkDone(
                            reminder.id
                          )
                        }
                      >
                        <CheckCircle size={16} />
                        Mark as Done
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    className="reminder-delete-button"
                    title="Delete"
                    onClick={() => {
                      setSelectedReminder(reminder);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>
            );
          })
        ) : (
          <div className="reminders-empty">

            <Bell size={40} />

            <h3>
              No Reminders Found
            </h3>

            <p>
              Try changing your search or filter,
              or add a new reminder.
            </p>

          </div>
        )}

      </section>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">

          <div className="modal-card">

            <div className="modal-header">

              <div>
                <h2>
                  {editingReminder
                    ? "Edit Reminder"
                    : "Add Reminder"}
                </h2>

                <p>
                  {editingReminder
                    ? "Update reminder information."
                    : "Create a new health reminder."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="modal-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">
                <label>
                  Reminder Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Take Metformin"
                  value={formData.title}
                  onChange={handleChange}
                />

                {errors.title && (
                  <span className="form-error">
                    {errors.title}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Medication">
                    Medication
                  </option>

                  <option value="Appointment">
                    Appointment
                  </option>

                  <option value="Checkup">
                    Checkup
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>
                    Time
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />

                  {errors.time && (
                    <span className="form-error">
                      {errors.time}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Date
                  </label>

                  <input
                    type="text"
                    name="date"
                    placeholder="e.g. Today"
                    value={formData.date}
                    onChange={handleChange}
                  />

                  {errors.date && (
                    <span className="form-error">
                      {errors.date}
                    </span>
                  )}
                </div>

              </div>

              <div className="form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe the reminder..."
                  value={formData.description}
                  onChange={handleChange}
                />

                {errors.description && (
                  <span className="form-error">
                    {errors.description}
                  </span>
                )}
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-action-button"
                >
                  {editingReminder
                    ? "Save Changes"
                    : "Add Reminder"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* Details Modal */}
      {showDetails &&
        selectedReminder && (
          <div className="modal-overlay">

            <div className="modal-card details-modal">

              <div className="modal-header">

                <div>
                  <span className="reminder-type">
                    {selectedReminder.type}
                  </span>

                  <h2>
                    {selectedReminder.title}
                  </h2>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() =>
                    setShowDetails(false)
                  }
                >
                  <X size={20} />
                </button>

              </div>

              <div className="details-content">

                <div className="detail-item">
                  <Clock size={18} />

                  <div>
                    <span>Time</span>
                    <strong>
                      {selectedReminder.time}
                    </strong>
                  </div>
                </div>

                <div className="detail-item">
                  <CalendarDays size={18} />

                  <div>
                    <span>Date</span>
                    <strong>
                      {selectedReminder.date}
                    </strong>
                  </div>
                </div>

                <div className="detail-item">
                  <Bell size={18} />

                  <div>
                    <span>Status</span>
                    <strong>
                      {selectedReminder.status}
                    </strong>
                  </div>
                </div>

                <div className="detail-description">
                  <span>
                    Description
                  </span>

                  <p>
                    {selectedReminder.description}
                  </p>
                </div>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowDetails(false)
                  }
                >
                  Close
                </button>

                {selectedReminder.status ===
                  "Active" && (
                  <button
                    type="button"
                    className="primary-action-button"
                    onClick={() => {
                      handleMarkDone(
                        selectedReminder.id
                      );
                      setShowDetails(false);
                    }}
                  >
                    <CheckCircle size={16} />
                    Mark as Done
                  </button>
                )}

              </div>

            </div>

          </div>
        )}

      {/* Delete Confirmation */}
      {showDeleteConfirm &&
        selectedReminder && (
          <div className="modal-overlay">

            <div className="modal-card delete-modal">

              <div className="delete-icon">
                <Trash2 size={24} />
              </div>

              <h2>
                Delete Reminder?
              </h2>

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {selectedReminder.title}
                </strong>
                ?
              </p>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowDeleteConfirm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="danger-button"
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

export default Reminders;