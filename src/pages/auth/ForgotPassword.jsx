import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { validateForgotPasswordForm } from "../../utils/validators";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const validation = validateForgotPasswordForm({ email });
    setError(validation.email || "");
    if (validation.email) return;

    setLoading(true);
    try {
      await forgotPassword({ email });
      navigate("/verify-otp", { state: { email, purpose: "reset" } });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      panelTitle="Locked out? We've got you"
      panelText="We'll send a one-time code to your email so you can securely set a new password and get back to tracking your health."
    >
      <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-mist-400 hover:text-mist-100 mb-6">
        <ArrowLeft size={15} /> Back to Login
      </Link>

      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        Forgot Password?
      </h1>
      <p className="text-mist-400 text-sm mb-7">
        Enter your email and we&apos;ll send you a code to reset your password.
      </p>

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
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          error={error}
          autoComplete="email"
        />

        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Send Reset Code
        </Button>
      </form>

      <p className="text-center text-sm text-mist-500 mt-7">
        Remembered it?{" "}
        <Link to="/login" className="text-teal-300 hover:text-teal-200 font-medium">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
