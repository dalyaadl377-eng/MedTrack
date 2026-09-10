import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import "./ForDoctorsPatients.css";

const doctorPoints = [
  "Access patient data securely",
  "Track health trends easily",
  "Collaborate and improve care",
];

const patientPoints = [
  "Organize your medical records",
  "Understand your health better",
  "Share and connect with your doctor",
];

function Points({ points }) {
  return (
    <ul className="fp-points">
      {points.map((point) => (
        <li key={point}>
          <Check size={15} />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ForDoctorsPatients() {
  return (
    <section id="for-doctors" className="fp-section">
      <div id="for-patients" className="fp-container">

        {/* ================= DOCTOR IMAGE ================= */}
        <div className="fp-person fp-doctor-image">
          <img
            src="/images/doctor.png"
            alt="Doctor"
          />
        </div>

        {/* ================= DOCTOR TEXT ================= */}
        <div className="fp-content fp-doctor-content">
          <p className="fp-tag">For Doctors</p>

          <h2>
            Better insights.
            <br />
            Smarter decisions.
          </h2>

          <Points points={doctorPoints} />

          <Link to="/signup" className="fp-button">
            <span>Learn More</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* ================= HEART ================= */}
        <div className="fp-heart">
          <div className="fp-heart-glow" />

          <img
            src="/images/heart-hologram.png"
            alt="MedTrack Heart"
          />
        </div>

        {/* ================= PATIENT TEXT ================= */}
        <div className="fp-content fp-patient-content">
          <p className="fp-tag">For Patients</p>

          <h2>
            Your health.
            <br />
            In your hands.
          </h2>

          <Points points={patientPoints} />

          <Link to="/signup" className="fp-button">
            <span>Learn More</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* ================= PATIENT IMAGE ================= */}
        <div className="fp-person fp-patient-image">
          <img
            src="/images/patient.png"
            alt="Patient"
          />
        </div>

      </div>
    </section>
  );
}