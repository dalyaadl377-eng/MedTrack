import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./splash.css";

const Splash = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, initializing } = useAuth();

  const audioRef = useRef(null);

  useEffect(() => {
    const soundTimer = setTimeout(() => {
      const audio = new Audio("/sounds/heartbeat.mp3");

      audio.volume = 0.55;
      audio.preload = "auto";

      audioRef.current = audio;

      audio.play().catch(() => {
        // Browser autoplay may be blocked.
      });
    }, 850);

    return () => {
      clearTimeout(soundTimer);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (initializing) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate(
          role === "DOCTOR"
            ? "/doctor/dashboard"
            : "/patient/dashboard",
          { replace: true }
        );
      } else {
        navigate("/home", { replace: true });
      }
    }, 4300);

    return () => clearTimeout(timer);
  }, [initializing, isAuthenticated, role, navigate]);

  return (
    <div className="splash-page">

      <div className="splash-grid" />
      <div className="splash-wave splash-wave-one" />
      <div className="splash-wave splash-wave-two" />
      <div className="splash-glow" />

      <div className="splash-content">

        {/* ================= HEART ================= */}

        <div className="splash-heart">
          <svg
            viewBox="0 0 200 180"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="heartGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4ff8ff" />
                <stop offset="50%" stopColor="#1ee2ed" />
                <stop offset="100%" stopColor="#27a9ff" />
              </linearGradient>
            </defs>

            <path
              className="heart-inside"
              d="
                M100 165
                C90 155 25 112 25 62
                C25 35 43 18 68 18
                C83 18 94 26 100 40
                C106 26 117 18 132 18
                C157 18 175 35 175 62
                C175 112 110 155 100 165
                Z
              "
            />

            <path
              className="heart-outline"
              d="
                M100 165
                C90 155 25 112 25 62
                C25 35 43 18 68 18
                C83 18 94 26 100 40
                C106 26 117 18 132 18
                C157 18 175 35 175 62
                C175 112 110 155 100 165
                Z
              "
            />
          </svg>
        </div>

        {/* ================= ECG ================= */}

        <div className="splash-ecg">

          {/* LEFT */}

          <svg
            className="ecg-side ecg-left"
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="ecg-glow"
              pathLength="1000"
              d="
                M0 100
                H285
                L320 100
                L340 100
                L360 72
                L380 128
                L405 18
                L430 182
                L455 100
                H600
              "
            />

            <path
              className="ecg-line"
              pathLength="1000"
              d="
                M0 100
                H285
                L320 100
                L340 100
                L360 72
                L380 128
                L405 18
                L430 182
                L455 100
                H600
              "
            />
          </svg>

          {/* RIGHT */}

          <svg
            className="ecg-side ecg-right"
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="ecg-glow"
              pathLength="1000"
              d="
                M0 100
                H145
                L170 100
                L195 182
                L220 18
                L245 128
                L265 72
                L285 100
                H315
                H600
              "
            />

            <path
              className="ecg-line"
              pathLength="1000"
              d="
                M0 100
                H145
                L170 100
                L195 182
                L220 18
                L245 128
                L265 72
                L285 100
                H315
                H600
              "
            />
          </svg>

        </div>

        {/* ================= LOGO ================= */}

        <div className="splash-logo">
          <span className="logo-med">Med</span>
          <span className="logo-track">Track</span>
        </div>

        {/* ================= TAGLINE ================= */}

        <div className="splash-tagline">
          Track. Understand. Care.
        </div>

        {/* ================= SUBTITLE ================= */}

        <div className="splash-subtitle">
          Your health. Organized. Everywhere.
        </div>

      </div>
    </div>
  );
};

export default Splash;