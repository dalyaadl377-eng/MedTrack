import { useState } from "react";
import {
  Bell,
  Mail,
  Shield,
  Lock,
  Save,
  Smartphone,
  X,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

import { useSettings } from "../../context/SettingsContext";

const Settings = () => {
  const {
    settings,
    updateSetting,
  } = useSettings();

  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleToggle = (name) => {
    updateSetting(name, !settings[name]);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (passwordErrors[name]) {
      setPasswordErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword =
        "Current password is required.";
    }

    if (!passwordData.newPassword.trim()) {
      errors.newPassword =
        "New password is required.";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword =
        "Password must be at least 8 characters.";
    }

    if (!passwordData.confirmPassword.trim()) {
      errors.confirmPassword =
        "Please confirm your new password.";
    } else if (
      passwordData.confirmPassword !==
      passwordData.newPassword
    ) {
      errors.confirmPassword =
        "Passwords do not match.";
    }

    setPasswordErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = () => {
    if (!validatePassword()) {
      return;
    }

    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordErrors({});

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordErrors({});

    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  const renderToggle = (name, label) => {
    return (
      <button
        type="button"
        className={`toggle ${
          settings[name] ? "toggle-on" : ""
        }`}
        onClick={() => handleToggle(name)}
        aria-label={`Toggle ${label}`}
        aria-pressed={settings[name]}
      >
        <span />
      </button>
    );
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>
            Manage your notifications, privacy, and security
            preferences.
          </p>
        </div>

        <button
          type="button"
          className="settings-save-button"
          onClick={handleSave}
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      {saved && (
        <div className="settings-success">
          <CheckCircle size={17} />
          <span>
            Settings saved successfully.
          </span>
        </div>
      )}

      {/* Notifications */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">
            <Bell size={20} />
          </div>

          <div>
            <h2>Notifications</h2>
            <p>
              Choose which notifications you would like to
              receive.
            </p>
          </div>
        </div>

        <div className="settings-options">
          <div className="setting-row">
            <div className="setting-info">
              <Mail size={18} />

              <div>
                <h3>Email Notifications</h3>
                <p>
                  Receive important updates and account
                  notifications by email.
                </p>
              </div>
            </div>

            {renderToggle(
              "emailNotifications",
              "email notifications"
            )}
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <Bell size={18} />

              <div>
                <h3>Appointment Reminders</h3>
                <p>
                  Get reminders before your upcoming
                  appointments.
                </p>
              </div>
            </div>

            {renderToggle(
              "appointmentReminders",
              "appointment reminders"
            )}
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <Smartphone size={18} />

              <div>
                <h3>Medication Reminders</h3>
                <p>
                  Receive reminders when it is time to take
                  your medication.
                </p>
              </div>
            </div>

            {renderToggle(
              "medicationReminders",
              "medication reminders"
            )}
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <Bell size={18} />

              <div>
                <h3>Health Updates</h3>
                <p>
                  Receive updates about your health trends
                  and reports.
                </p>
              </div>
            </div>

            {renderToggle(
              "healthUpdates",
              "health updates"
            )}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">
            <Shield size={20} />
          </div>

          <div>
            <h2>Security</h2>
            <p>
              Manage your account security preferences.
            </p>
          </div>
        </div>

        <div className="settings-options">
          <div className="setting-row">
            <div className="setting-info">
              <Lock size={18} />

              <div>
                <h3>Two-Factor Authentication</h3>
                <p>
                  Add an extra layer of security to your
                  account.
                </p>
              </div>
            </div>

            {renderToggle(
              "twoFactor",
              "two factor authentication"
            )}
          </div>

          <button
            type="button"
            className="change-password-button"
            onClick={() =>
              setShowPasswordModal(true)
            }
          >
            <Lock size={17} />
            Change Password
          </button>
        </div>
      </section>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="password-modal-overlay"
          onClick={closePasswordModal}
        >
          <div
            className="password-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="password-modal-header">
              <div>
                <h2>Change Password</h2>
                <p>
                  Update your account password securely.
                </p>
              </div>

              <button
                type="button"
                className="password-modal-close"
                onClick={closePasswordModal}
                aria-label="Close change password modal"
              >
                <X size={19} />
              </button>
            </div>

            <div className="password-form">
              <div className="password-field">
                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <div
                  className={`password-input ${
                    passwordErrors.currentPassword
                      ? "password-input-error"
                      : ""
                  }`}
                >
                  <Lock size={16} />

                  <input
                    id="currentPassword"
                    type={
                      showPasswords.current
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    className="password-visibility"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    aria-label="Toggle current password visibility"
                  >
                    {showPasswords.current ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {passwordErrors.currentPassword && (
                  <span className="password-error">
                    {passwordErrors.currentPassword}
                  </span>
                )}
              </div>

              <div className="password-field">
                <label htmlFor="newPassword">
                  New Password
                </label>

                <div
                  className={`password-input ${
                    passwordErrors.newPassword
                      ? "password-input-error"
                      : ""
                  }`}
                >
                  <Lock size={16} />

                  <input
                    id="newPassword"
                    type={
                      showPasswords.new
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    className="password-visibility"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    aria-label="Toggle new password visibility"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {passwordErrors.newPassword && (
                  <span className="password-error">
                    {passwordErrors.newPassword}
                  </span>
                )}
              </div>

              <div className="password-field">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <div
                  className={`password-input ${
                    passwordErrors.confirmPassword
                      ? "password-input-error"
                      : ""
                  }`}
                >
                  <Lock size={16} />

                  <input
                    id="confirmPassword"
                    type={
                      showPasswords.confirm
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />

                  <button
                    type="button"
                    className="password-visibility"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    aria-label="Toggle confirm password visibility"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {passwordErrors.confirmPassword && (
                  <span className="password-error">
                    {passwordErrors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="password-modal-actions">
                <button
                  type="button"
                  className="password-cancel-button"
                  onClick={closePasswordModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="password-save-button"
                  onClick={handleChangePassword}
                >
                  <Save size={16} />
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;