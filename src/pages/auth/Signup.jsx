import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, Stethoscope, HeartPulse } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { validateSignupForm } from "../../utils/validators";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", role: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const selectRole = (role) => {
    setForm((f) => ({ ...f, role }));
    setErrors((er) => ({ ...er, role: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const validation = validateSignupForm(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setLoading(true);
    try {
      const { email } = await signup(form);
      navigate("/verify-otp", { state: { email, purpose: "signup" } });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      panelTitle="Join thousands who trust MedTrack"
      panelText="Whether you're organizing your own health records or managing patients, MedTrack keeps everything connected, secure, and easy to understand."
    >
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        Create Your Account
      </h1>
      <p className="text-mist-400 text-sm mb-7">Join MedTrack and start your journey</p>

      {formError && (
        <Alert type="error" className="mb-5">
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Full Name"
          icon={User}
          placeholder="Jane Doe"
          value={form.fullName}
          onChange={handleChange("fullName")}
          error={errors.fullName}
          autoComplete="name"
        />
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
          autoComplete="email"
        />
        <PasswordInput
          label="Password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
          showStrength
          autoComplete="new-password"
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div>
          <span className="block text-sm font-medium text-mist-300 mb-1.5">You are:</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => selectRole("PATIENT")}
              className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                form.role === "PATIENT"
                  ? "border-teal-500 bg-teal-500/10 text-teal-300"
                  : "border-ink-border text-mist-400 hover:border-ink-500"
              }`}
            >
              <HeartPulse size={16} /> Patient
            </button>
            <button
              type="button"
              onClick={() => selectRole("DOCTOR")}
              className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                form.role === "DOCTOR"
                  ? "border-teal-500 bg-teal-500/10 text-teal-300"
                  : "border-ink-border text-mist-400 hover:border-ink-500"
              }`}
            >
              <Stethoscope size={16} /> Doctor
            </button>
          </div>
          {errors.role && <p className="mt-1.5 text-xs text-danger">{errors.role}</p>}
        </div>

        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-mist-500 mt-7">
        Already have an account?{" "}
        <Link to="/login" className="text-teal-300 hover:text-teal-200 font-medium">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
