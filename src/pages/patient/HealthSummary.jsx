import { useState } from "react";

import {
  HeartPulse,
  Activity,
  Droplets,
  Weight,
  Pencil,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useHealth } from "../../context/HealthContext";
import { useNotifications } from "../../context/NotificationsContext";
import healthBody from "../../assets/images/health-body.png";

const HealthSummary = () => {
  const navigate = useNavigate();

  const {
    healthData,
    updateHealthData,
  } = useHealth();

  const { addNotification } = useNotifications();

  /* =========================================
     STATES
  ========================================= */

  const [isEditing, setIsEditing] = useState(false);

  const [selectedMetric, setSelectedMetric] =
    useState(null);

  const [selectedPeriod, setSelectedPeriod] =
    useState("month");

  const [formData, setFormData] = useState({
    heartRate: healthData.heartRate.value,
    bloodPressure: healthData.bloodPressure.value,
    bloodSugar: healthData.bloodSugar.value,
    weight: healthData.weight.value,
  });

  const [errors, setErrors] = useState({});

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =========================================
     PERIOD INFORMATION
  ========================================= */

  const periodInfo = {
    month: {
      title: "This Month Overview",
      description:
        "Your latest recorded health measurements",
    },

    week: {
      title: "This Week Overview",
      description:
        "Your latest health measurements this week",
    },

    year: {
      title: "This Year Overview",
      description:
        "Your health measurements and yearly overview",
    },
  };

  /* =========================================
     HEALTH METRICS
  ========================================= */

  const healthItems = [
    {
      key: "heartRate",
      icon: HeartPulse,
      label: "Heart Rate",
      description: "Resting heart rate",
      unit: healthData.heartRate.unit,
      normalRange: "60 - 100 BPM",
      details:
        "Heart rate shows how many times your heart beats per minute while resting.",
      advice:
        "A regular resting heart rate can help indicate how your cardiovascular system is functioning.",
    },

    {
      key: "bloodPressure",
      icon: Activity,
      label: "Blood Pressure",
      description: "Systolic / Diastolic",
      unit: healthData.bloodPressure.unit,
      normalRange: "Around 120/80 mmHg",
      details:
        "Blood pressure measures the force of blood against the walls of your arteries.",
      advice:
        "Tracking blood pressure regularly can help you monitor changes in your cardiovascular health.",
    },

    {
      key: "bloodSugar",
      icon: Droplets,
      label: "Blood Sugar",
      description: "Glucose level",
      unit: healthData.bloodSugar.unit,
      normalRange: "70 - 99 mg/dL",
      details:
        "Blood sugar represents the amount of glucose currently present in your blood.",
      advice:
        "Keeping track of glucose levels can help identify changes in blood sugar patterns.",
    },

    {
      key: "weight",
      icon: Weight,
      label: "Weight",
      description: "Body weight",
      unit: healthData.weight.unit,
      normalRange: "Personal target",
      details:
        "Body weight can be monitored over time to understand changes in your overall health.",
      advice:
        "Looking at weight trends over time is usually more useful than focusing on a single measurement.",
    },
  ];

  /* =========================================
     FORM CHANGE
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

    const heartRate = Number(
      formData.heartRate
    );

    const bloodSugar = Number(
      formData.bloodSugar
    );

    const weight = Number(
      formData.weight
    );

    /* HEART RATE */

    if (
      formData.heartRate === "" ||
      Number.isNaN(heartRate)
    ) {
      newErrors.heartRate =
        "Enter a valid heart rate.";
    } else if (
      heartRate < 30 ||
      heartRate > 220
    ) {
      newErrors.heartRate =
        "Heart rate must be between 30 and 220.";
    }

    /* BLOOD PRESSURE */

    const bloodPressurePattern =
      /^\d{2,3}\/\d{2,3}$/;

    if (
      !bloodPressurePattern.test(
        formData.bloodPressure
      )
    ) {
      newErrors.bloodPressure =
        "Use format 120/80.";
    }

    /* BLOOD SUGAR */

    if (
      formData.bloodSugar === "" ||
      Number.isNaN(bloodSugar)
    ) {
      newErrors.bloodSugar =
        "Enter a valid blood sugar.";
    } else if (
      bloodSugar < 40 ||
      bloodSugar > 500
    ) {
      newErrors.bloodSugar =
        "Blood sugar must be between 40 and 500.";
    }

    /* WEIGHT */

    if (
      formData.weight === "" ||
      Number.isNaN(weight)
    ) {
      newErrors.weight =
        "Enter a valid weight.";
    } else if (
      weight < 20 ||
      weight > 300
    ) {
      newErrors.weight =
        "Weight must be between 20 and 300 kg.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =========================================
     STATUS
  ========================================= */

  const getStatus = (key, value) => {
    if (key === "heartRate") {
      const number = Number(value);

      if (
        number >= 60 &&
        number <= 100
      ) {
        return "Normal";
      }

      return "Needs Attention";
    }

    if (key === "bloodPressure") {
      const [systolic, diastolic] =
        value.split("/").map(Number);

      if (
        systolic <= 120 &&
        diastolic <= 80
      ) {
        return "Normal";
      }

      if (
        systolic <= 129 &&
        diastolic < 80
      ) {
        return "Elevated";
      }

      return "Needs Attention";
    }

    if (key === "bloodSugar") {
      const number = Number(value);

      if (
        number >= 70 &&
        number <= 99
      ) {
        return "Normal";
      }

      return "Needs Attention";
    }

    if (key === "weight") {
      return "Stable";
    }

    return "Normal";
  };

  /* =========================================
     SAVE HEALTH DATA
  ========================================= */

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    updateHealthData("heartRate", {
      value: Number(formData.heartRate),
      status: getStatus(
        "heartRate",
        formData.heartRate
      ),
    });

    updateHealthData("bloodPressure", {
      value: formData.bloodPressure,
      status: getStatus(
        "bloodPressure",
        formData.bloodPressure
      ),
    });

    updateHealthData("bloodSugar", {
      value: Number(formData.bloodSugar),
      status: getStatus(
        "bloodSugar",
        formData.bloodSugar
      ),
    });

    updateHealthData("weight", {
      value: Number(formData.weight),
      status: getStatus(
        "weight",
        formData.weight
      ),
    });

    /* =========================================
       ADD NOTIFICATION
    ========================================= */

    addNotification({
      title: "Health Data Updated",
      message:
        "Your latest health measurements have been updated successfully.",
      type: "health",
      path: "/patient/health-summary",
    });

    setIsEditing(false);
    setErrors({});

    setSuccessMessage(
      "Health data updated successfully."
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  };

  /* =========================================
     EDIT
  ========================================= */

  const handleEdit = () => {
    setFormData({
      heartRate:
        healthData.heartRate.value,

      bloodPressure:
        healthData.bloodPressure.value,

      bloodSugar:
        healthData.bloodSugar.value,

      weight:
        healthData.weight.value,
    });

    setErrors({});
    setSuccessMessage("");
    setIsEditing(true);
  };

  /* =========================================
     CANCEL
  ========================================= */

  const handleCancel = () => {
    setFormData({
      heartRate:
        healthData.heartRate.value,

      bloodPressure:
        healthData.bloodPressure.value,

      bloodSugar:
        healthData.bloodSugar.value,

      weight:
        healthData.weight.value,
    });

    setErrors({});
    setIsEditing(false);
  };

  /* =========================================
     PERIOD CHANGE
  ========================================= */

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  /* =========================================
     OPEN METRIC DETAILS
  ========================================= */

  const handleMetricDetails = (item) => {
    setSelectedMetric(item);
  };

  /* =========================================
     CLOSE METRIC DETAILS
  ========================================= */

  const closeMetricDetails = () => {
    setSelectedMetric(null);
  };

  /* =========================================
     OPEN INSIGHTS
  ========================================= */

  const handleViewInsights = () => {
    navigate("/patient/insights");
  };

  return (
    <div className="health-summary-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="health-summary-page-header">

        <div>

          <span className="health-page-kicker">
            HEALTH OVERVIEW
          </span>

          <h1>
            Health Summary
          </h1>

          <p>
            Monitor your latest health
            measurements and vital signs.
          </p>

        </div>

        {!isEditing ? (

          <button
            type="button"
            className="health-edit-button"
            onClick={handleEdit}
          >
            <Pencil size={16} />
            Edit Health Data
          </button>

        ) : (

          <div className="health-header-actions">

            <button
              type="button"
              className="health-cancel-button"
              onClick={handleCancel}
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="button"
              className="health-save-button"
              onClick={handleSave}
            >
              <Save size={16} />
              Save Changes
            </button>

          </div>

        )}

      </div>

      {/* =====================================
          SUCCESS MESSAGE
      ===================================== */}

      {successMessage && (

        <div className="health-success-message">

          <CheckCircle size={18} />

          <span>
            {successMessage}
          </span>

        </div>

      )}

      {/* =====================================
          MAIN CARD
      ===================================== */}

      <section className="health-main-card">

        {/* ===================================
            CARD HEADER
        =================================== */}

        <div className="health-card-top">

          <div>

            <h2>
              Health Summary
            </h2>

            <p>
              {periodInfo[selectedPeriod].description}
            </p>

          </div>

          {/* =================================
              WORKING PERIOD SELECT
          ================================= */}

          <select
            className="health-period-select"
            value={selectedPeriod}
            onChange={handlePeriodChange}
          >

            <option value="month">
              This Month Overview
            </option>

            <option value="week">
              This Week
            </option>

            <option value="year">
              This Year
            </option>

          </select>

        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        {!isEditing ? (

          <div className="health-main-content">

            {/* =================================
                BODY IMAGE
            ================================= */}

            <div className="health-visual">

              <div className="health-visual-glow"></div>

              <img
                src={healthBody}
                alt="Human body health visualization"
                className="health-body-image"
              />

              <div className="health-visual-overlay">

                <div className="health-visual-status">

                  <HeartPulse size={18} />

                  <div>

                    <strong>
                      Good
                    </strong>

                    <span>
                      Your health is stable
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================
                METRICS
            ================================= */}

            <div className="health-metrics">

              {healthItems.map((item) => {

                const Icon = item.icon;

                const data =
                  healthData[item.key];

                const isNormal =
                  data.status === "Normal" ||
                  data.status === "Stable";

                return (

                  <div
                    className="health-metric-row"
                    key={item.key}
                  >

                    {/* ICON */}

                    <div className="health-metric-icon">

                      <Icon size={20} />

                    </div>

                    {/* NAME */}

                    <div className="health-metric-name">

                      <strong>
                        {item.label}
                      </strong>

                      <span>
                        {item.description}
                      </span>

                    </div>

                    {/* VALUE */}

                    <div className="health-metric-value">

                      <strong>
                        {data.value}
                      </strong>

                      <span>
                        {data.unit}
                      </span>

                    </div>

                    {/* STATUS */}

                    <span
                      className={`health-status-badge ${
                        isNormal
                          ? "health-status-normal"
                          : "health-status-warning"
                      }`}
                    >

                      <span className="status-dot"></span>

                      {data.status}

                    </span>

                    {/* =================================
                        WORKING ARROW
                    ================================= */}

                    <button
                      type="button"
                      className="health-metric-arrow"
                      onClick={() =>
                        handleMetricDetails(item)
                      }
                      aria-label={`View ${item.label} details`}
                    >

                      <ArrowRight size={19} />

                    </button>

                  </div>

                );
              })}

              {/* =================================
                  INSIGHTS BUTTON
              ================================= */}

              <button
                type="button"
                className="health-insights-button"
                onClick={handleViewInsights}
              >

                <span>
                  View Full Insights
                </span>

                <ArrowRight size={17} />

              </button>

            </div>

          </div>

        ) : (

          /* ===================================
             EDIT FORM
          =================================== */

          <div className="health-edit-form">

            {/* HEART RATE */}

            <div className="health-form-group">

              <label htmlFor="heartRate">
                Heart Rate
              </label>

              <div className="health-input-wrapper">

                <HeartPulse size={18} />

                <input
                  id="heartRate"
                  name="heartRate"
                  type="number"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="72"
                />

                <span>
                  BPM
                </span>

              </div>

              {errors.heartRate && (

                <div className="health-field-error">

                  <AlertCircle size={14} />

                  {errors.heartRate}

                </div>

              )}

            </div>

            {/* BLOOD PRESSURE */}

            <div className="health-form-group">

              <label htmlFor="bloodPressure">
                Blood Pressure
              </label>

              <div className="health-input-wrapper">

                <Activity size={18} />

                <input
                  id="bloodPressure"
                  name="bloodPressure"
                  type="text"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="120/80"
                />

                <span>
                  mmHg
                </span>

              </div>

              {errors.bloodPressure && (

                <div className="health-field-error">

                  <AlertCircle size={14} />

                  {errors.bloodPressure}

                </div>

              )}

            </div>

            {/* BLOOD SUGAR */}

            <div className="health-form-group">

              <label htmlFor="bloodSugar">
                Blood Sugar
              </label>

              <div className="health-input-wrapper">

                <Droplets size={18} />

                <input
                  id="bloodSugar"
                  name="bloodSugar"
                  type="number"
                  value={formData.bloodSugar}
                  onChange={handleChange}
                  placeholder="95"
                />

                <span>
                  mg/dL
                </span>

              </div>

              {errors.bloodSugar && (

                <div className="health-field-error">

                  <AlertCircle size={14} />

                  {errors.bloodSugar}

                </div>

              )}

            </div>

            {/* WEIGHT */}

            <div className="health-form-group">

              <label htmlFor="weight">
                Weight
              </label>

              <div className="health-input-wrapper">

                <Weight size={18} />

                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="68"
                />

                <span>
                  kg
                </span>

              </div>

              {errors.weight && (

                <div className="health-field-error">

                  <AlertCircle size={14} />

                  {errors.weight}

                </div>

              )}

            </div>

          </div>

        )}

      </section>

      {/* =====================================
          METRIC DETAILS MODAL
      ===================================== */}

      {selectedMetric && (

        <div
          className="health-metric-modal-overlay"
          onClick={closeMetricDetails}
        >

          <div
            className="health-metric-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================
                MODAL HEADER
            ================================= */}

            <div className="health-metric-modal-header">

              <div className="health-modal-title">

                <div className="health-modal-icon">

                  {(() => {

                    const Icon =
                      selectedMetric.icon;

                    return (
                      <Icon size={22} />
                    );

                  })()}

                </div>

                <div>

                  <h2>
                    {selectedMetric.label}
                  </h2>

                  <p>
                    {selectedMetric.description}
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="health-modal-close"
                onClick={closeMetricDetails}
                aria-label="Close details"
              >

                <X size={19} />

              </button>

            </div>

            {/* =================================
                CURRENT VALUE
            ================================= */}

            <div className="health-modal-value-card">

              <span>
                Current Value
              </span>

              <div>

                <strong>
                  {
                    healthData[
                      selectedMetric.key
                    ].value
                  }
                </strong>

                <span>
                  {
                    healthData[
                      selectedMetric.key
                    ].unit
                  }
                </span>

              </div>

              <span
                className={`health-status-badge ${
                  healthData[
                    selectedMetric.key
                  ].status === "Normal" ||
                  healthData[
                    selectedMetric.key
                  ].status === "Stable"
                    ? "health-status-normal"
                    : "health-status-warning"
                }`}
              >

                <span className="status-dot"></span>

                {
                  healthData[
                    selectedMetric.key
                  ].status
                }

              </span>

            </div>

            {/* =================================
                DETAILS
            ================================= */}

            <div className="health-modal-section">

              <span className="health-modal-section-label">
                About this measurement
              </span>

              <p>
                {selectedMetric.details}
              </p>

            </div>

            {/* =================================
                NORMAL RANGE
            ================================= */}

            <div className="health-modal-range">

              <div>

                <span>
                  Reference Range
                </span>

                <strong>
                  {selectedMetric.normalRange}
                </strong>

              </div>

              <CheckCircle size={20} />

            </div>

            {/* =================================
                ADVICE
            ================================= */}

            <div className="health-modal-advice">

              <UserRound size={18} />

              <div>

                <strong>
                  Health Tracking
                </strong>

                <p>
                  {selectedMetric.advice}
                </p>

              </div>

            </div>

            {/* =================================
                CLOSE
            ================================= */}

            <button
              type="button"
              className="health-modal-done"
              onClick={closeMetricDetails}
            >
              Done
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default HealthSummary;