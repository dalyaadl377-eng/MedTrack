import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import OTPInput from "../../components/ui/OTPInput";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";

const RESEND_SECONDS = 45;

export default function VerifyOtp() {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const purpose = location.state?.purpose || "signup";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!email) {
      navigate(purpose === "reset" ? "/forgot-password" : "/signup", { replace: true });
      return;
    }
    timerRef.current = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timerRef.current);
  }, [email, navigate, purpose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      if (purpose === "reset") {
        navigate("/reset-password", { state: { email } });
      } else {
        navigate("/onboarding", { state: { justVerified: true } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setNotice("");
    setError("");
    try {
      await resendOtp({ email, purpose });
      setSeconds(RESEND_SECONDS);
      setOtp("");
      setNotice("A new code has been sent to your email");
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <AuthLayout
      panelTitle="Almost there"
      panelText="A quick verification step keeps your medical records secure and makes sure only you can access your account."
    >
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        Verify Your Email
      </h1>
      <p className="text-mist-400 text-sm mb-7">
        Enter the 6-digit code we sent to <span className="text-mist-300">{email}</span>
      </p>

      {error && (
        <Alert type="error" className="mb-5">
          {error}
        </Alert>
      )}
      {notice && !error && (
        <Alert type="success" className="mb-5">
          {notice}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <OTPInput length={6} value={otp} onChange={setOtp} error={error && !otp ? " " : undefined} disabled={loading} />

        <div className="text-sm text-mist-500">
          {seconds > 0 ? (
            <span>Resend code ({String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")})</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-teal-300 hover:text-teal-200 font-medium disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Verify &amp; Continue
        </Button>
      </form>

      <p className="text-center text-sm text-mist-500 mt-7">
        Wrong email?{" "}
        <Link to="/signup" className="text-teal-300 hover:text-teal-200 font-medium">
          Go back
        </Link>
      </p>
    </AuthLayout>
  );
}
