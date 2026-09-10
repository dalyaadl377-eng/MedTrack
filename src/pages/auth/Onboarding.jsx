import { Navigate, useNavigate } from "react-router-dom";
import { PartyPopper, Check } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const steps = {
  PATIENT: ["Personal Info", "Medical Info", "Notifications"],
  DOCTOR: ["Professional Info", "Clinic Info", "Preferences"],
};

export default function Onboarding() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return <Navigate to="/login" replace />;

  const isDoctor = currentUser.role === "DOCTOR";
  const dest = isDoctor ? "/doctor/dashboard" : "/patient/dashboard";

  return (
    <AuthLayout
      panelTitle={isDoctor ? "Welcome to MedTrack, Doctor" : "Welcome to MedTrack"}
      panelText="A few quick details help us tailor your dashboard — you can always update these later from Settings."
    >
      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-5">
        <PartyPopper size={24} className="text-teal-300" />
      </div>
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        {isDoctor ? "Welcome Doctor! 🎉" : "Welcome Aboard! 🎉"}
      </h1>
      <p className="text-mist-400 text-sm mb-7">
        Let&apos;s set up your {isDoctor ? "professional" : "patient"} profile.
      </p>

      <ul className="flex flex-col gap-3 mb-8">
        {steps[currentUser.role || "PATIENT"].map((step) => (
          <li key={step} className="flex items-center gap-3 text-sm text-mist-300">
            <span className="w-6 h-6 rounded-full border border-teal-500/40 bg-teal-500/10 flex items-center justify-center shrink-0">
              <Check size={13} className="text-teal-300" />
            </span>
            {step}
          </li>
        ))}
      </ul>

      <Button fullWidth onClick={() => navigate(dest)}>
        Get Started
      </Button>
      <button
        onClick={() => navigate(dest)}
        className="w-full text-center text-sm text-mist-500 hover:text-mist-300 mt-4"
      >
        Skip for now
      </button>
    </AuthLayout>
  );
}
