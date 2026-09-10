import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Droplets,
  Pencil,
  Save,
  X,
  CheckCircle,
} from "lucide-react";

import { useProfile } from "../../context/ProfileContext";

const Profile = () => {
  const { profile, updateProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleEdit = () => {
    setFormData(profile);
    setErrors({});
    setSuccessMessage("");
    setIsEditing(true);
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

    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[+\d\s()-]{8,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    }

    if (!formData.bloodType.trim()) {
      newErrors.bloodType = "Blood type is required.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    updateProfile(formData);

    setIsEditing(false);
    setSuccessMessage("Profile updated successfully.");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleCancel = () => {
    setFormData(profile);
    setErrors({});
    setIsEditing(false);
    setSuccessMessage("");
  };

  const getInitials = () => {
    const firstInitial = profile.firstName?.charAt(0) || "";
    const lastInitial = profile.lastName?.charAt(0) || "";

    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>
            Manage your personal information and profile details.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            className="profile-edit-button"
            onClick={handleEdit}
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="profile-header-actions">
            <button
              type="button"
              className="profile-cancel-button"
              onClick={handleCancel}
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="button"
              className="profile-save-button"
              onClick={handleSave}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="profile-success-message">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      <section className="profile-card">
        <div className="profile-card-top">
          <div className="large-profile-avatar">
            {getInitials()}
          </div>

          <div>
            <h2>
              {profile.firstName} {profile.lastName}
            </h2>
            <p>Patient</p>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-form-grid">
          <div className="profile-field">
            <label htmlFor="firstName">First Name</label>

            <div
              className={`profile-input ${
                errors.firstName ? "profile-input-error" : ""
              }`}
            >
              <User size={16} />

              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {errors.firstName && (
              <span className="profile-error">
                {errors.firstName}
              </span>
            )}
          </div>

          <div className="profile-field">
            <label htmlFor="lastName">Last Name</label>

            <div
              className={`profile-input ${
                errors.lastName ? "profile-input-error" : ""
              }`}
            >
              <User size={16} />

              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {errors.lastName && (
              <span className="profile-error">
                {errors.lastName}
              </span>
            )}
          </div>

          <div className="profile-field">
            <label htmlFor="email">Email Address</label>

            <div
              className={`profile-input ${
                errors.email ? "profile-input-error" : ""
              }`}
            >
              <Mail size={16} />

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {errors.email && (
              <span className="profile-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="profile-field">
            <label htmlFor="phone">Phone Number</label>

            <div
              className={`profile-input ${
                errors.phone ? "profile-input-error" : ""
              }`}
            >
              <Phone size={16} />

              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {errors.phone && (
              <span className="profile-error">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="profile-field">
            <label htmlFor="dateOfBirth">
              Date of Birth
            </label>

            <div
              className={`profile-input ${
                errors.dateOfBirth
                  ? "profile-input-error"
                  : ""
              }`}
            >
              <CalendarDays size={16} />

              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {!isEditing && (
              <span className="profile-readable-date">
                {formatDate(profile.dateOfBirth)}
              </span>
            )}

            {errors.dateOfBirth && (
              <span className="profile-error">
                {errors.dateOfBirth}
              </span>
            )}
          </div>

          <div className="profile-field">
            <label htmlFor="bloodType">Blood Type</label>

            <div
              className={`profile-input ${
                errors.bloodType ? "profile-input-error" : ""
              }`}
            >
              <Droplets size={16} />

              {isEditing ? (
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <input
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  disabled
                />
              )}
            </div>

            {errors.bloodType && (
              <span className="profile-error">
                {errors.bloodType}
              </span>
            )}
          </div>

          <div className="profile-field profile-full-width">
            <label htmlFor="address">Address</label>

            <div
              className={`profile-input ${
                errors.address ? "profile-input-error" : ""
              }`}
            >
              <MapPin size={16} />

              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {errors.address && (
              <span className="profile-error">
                {errors.address}
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;