import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { validateResetPasswordForm } from "../../utils/validators";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const validation = validateResetPasswordForm(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setLoading(true);
    try {
      await resetPassword(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout panelTitle="Password updated" panelText="You can now log in with your new password.">
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-center mb-5">
            <CheckCircle2 size={26} className="text-success" />
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Password Reset
          </h1>
          <p className="text-mist-400 text-sm">Redirecting you to login...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      panelTitle="Choose a strong new password"
      panelText="Use a unique password you don't use elsewhere to keep your medical records protected."
    >
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        Reset Password
      </h1>
      <p className="text-mist-400 text-sm mb-7">
        {email ? `Set a new password for ${email}` : "Set a new password for your account"}
      </p>

      {formError && (
        <Alert type="error" className="mb-5">
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <PasswordInput
          label="New Password"
          placeholder="Create a new password"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
          showStrength
          autoComplete="new-password"
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Reset Password
        </Button>
      </form>

      <p className="text-center text-sm text-mist-500 mt-7">
        <Link to="/login" className="text-teal-300 hover:text-teal-200 font-medium">
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
}
