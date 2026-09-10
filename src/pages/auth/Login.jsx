import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { validateLoginForm } from "../../utils/validators";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const validation = validateLoginForm(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setLoading(true);
    try {
      const user = await login(form);
      const redirectTo = location.state?.from || (user.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      panelTitle="Your health, in your hands"
      panelText="Organize every report, track trends over time, and share results with your doctor in a single, secure place."
    >
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        Welcome back
      </h1>
      <p className="text-mist-400 text-sm mb-7">Login to your account</p>

      {formError && (
        <Alert type="error" className="mb-5">
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-mist-400 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-ink-border bg-ink-850 accent-teal-500"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-teal-300 hover:text-teal-200">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Login
        </Button>
      </form>

      <p className="text-center text-sm text-mist-500 mt-7">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-teal-300 hover:text-teal-200 font-medium">
          Sign Up
        </Link>
      </p>

      <p className="text-center text-xs text-mist-500 mt-6 border-t border-ink-border pt-5">
        Demo accounts — Patient: sarah.johnson@example.com · Doctor: ahmed.hassan@example.com
        <br />
        Password: Patient123! / Doctor123!
      </p>
    </AuthLayout>
  );
}
