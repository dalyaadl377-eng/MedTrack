import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-ink-border bg-[#06121d]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Logo & Description */}
          <div>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 mb-4"
            >
              <HeartPulse
                size={30}
                className="text-teal-400"
              />

              <span
                className="text-2xl font-semibold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Med<span className="text-teal-400">Track</span>
              </span>
            </Link>

            <p className="text-sm text-mist-400 leading-relaxed max-w-xs">
              Track. Understand. Care.
              <br />
              Better insights for better care.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Product
            </h3>

            <div className="flex flex-col gap-3">

              <a
                href="#features"
                className="text-sm text-mist-400 hover:text-teal-400 transition"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="text-sm text-mist-400 hover:text-teal-400 transition"
              >
                How It Works
              </a>

              <a
                href="#for-patients"
                className="text-sm text-mist-400 hover:text-teal-400 transition"
              >
                For Patients
              </a>

              <a
                href="#for-doctors"
                className="text-sm text-mist-400 hover:text-teal-400 transition"
              >
                For Doctors
              </a>

            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Company
            </h3>

            <div className="flex flex-col gap-3">

              <a
                href="#about"
                className="text-sm text-mist-400 hover:text-teal-400 transition"
              >
                About Us
              </a>

              <Link
                to="/login"
                className="text-sm text-mist-400 hover:text-teal-400 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="text-sm text-mist-400 hover:text-teal-400 transition"
              >
                Sign Up
              </Link>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-ink-border flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-mist-500">
            © 2026 MedTrack. All rights reserved.
          </p>

          <p className="text-xs text-mist-500">
            Track. Understand. Care.
          </p>

        </div>

      </div>
    </footer>
  );
}