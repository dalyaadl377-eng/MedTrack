import { Link } from "react-router-dom";
import { HeartPulse, ArrowRight } from "lucide-react";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-card">

        {/* Background waves */}
        <div className="cta-wave cta-wave-one"></div>
        <div className="cta-wave cta-wave-two"></div>

        {/* Heart Icon */}
        <div className="cta-icon">
          <HeartPulse size={52} strokeWidth={1.5} />
        </div>

        {/* Text */}
        <div className="cta-content">
          <h2>
            Ready to Take Control
            <br />
            of <span>Your Health?</span>
          </h2>

          <p>
            Join thousands of patients and doctors
            <br />
            who trust MedTrack.
          </p>
        </div>

        {/* Buttons */}
        <div className="cta-actions">
          <Link to="/signup" className="cta-button cta-primary">
            Sign Up Now
            <ArrowRight size={18} />
          </Link>

          <Link to="/login" className="cta-button cta-secondary">
            Login
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}