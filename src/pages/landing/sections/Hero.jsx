import { useState } from "react";
import { Play } from "lucide-react";
import Button from "../../../components/ui/Button";
import HowItWorksModal from "./HowItWorksModal";

export default function Hero() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <>
      <style>{`
        .hero-ecg-line {
          stroke-dasharray: 700;
          stroke-dashoffset: 700;
          animation: heroHeartbeat 2s linear infinite;
        }

        @keyframes heroHeartbeat {
          0% {
            stroke-dashoffset: 700;
            opacity: 0.2;
          }

          10% {
            opacity: 1;
          }

          65% {
            stroke-dashoffset: 0;
            opacity: 1;
          }

          75% {
            stroke-dashoffset: -100;
            opacity: 1;
          }

          100% {
            stroke-dashoffset: -700;
            opacity: 0.2;
          }
        }

        .hero-heart {
          animation: heartGlow 1.5s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes heartGlow {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(25,230,242,0.7));
          }

          50% {
            filter: drop-shadow(0 0 18px rgba(25,230,242,1));
          }
        }
      `}</style>

      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden border-b border-ink-border">

        {/* Hero Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-medtrack.png')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Cyan Glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(0,220,255,0.18), transparent 45%), linear-gradient(to bottom, rgba(2,12,20,0.15), rgba(2,12,20,0.65))",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 min-h-[calc(100vh-64px)] max-w-6xl mx-auto px-5 sm:px-8 flex flex-col items-center justify-center text-center">

          {/* ECG + Heart */}
          <div className="relative w-full max-w-5xl h-40 mb-4 pointer-events-none">

            {/* LEFT ECG */}
            <svg
              viewBox="0 0 500 140"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[46%] h-32"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="hero-ecg-line"
                d="
                  M0 70
                  H260
                  L280 70
                  L300 35
                  L320 105
                  L345 10
                  L370 130
                  L395 70
                  H500
                "
                fill="none"
                stroke="#19e6f2"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* FIXED HEART */}
            <div className="hero-heart absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">

              <svg
                viewBox="0 0 200 180"
                className="w-32 h-28 sm:w-40 sm:h-36"
                aria-hidden="true"
              >
                <path
                  d="
                    M100 165
                    C90 155 25 112 25 62
                    C25 35 43 18 68 18
                    C83 18 94 26 100 40
                    C106 26 117 18 132 18
                    C157 18 175 35 175 62
                    C175 112 110 155 100 165 Z
                  "
                  fill="none"
                  stroke="#4ff8ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="
                    M100 165
                    C90 155 25 112 25 62
                    C25 35 43 18 68 18
                    C83 18 94 26 100 40
                    C106 26 117 18 132 18
                    C157 18 175 35 175 62
                    C175 112 110 155 100 165 Z
                  "
                  fill="none"
                  stroke="#19e6f2"
                  strokeWidth="1"
                  opacity="0.7"
                />
              </svg>

            </div>

            {/* RIGHT ECG */}
            <svg
              viewBox="0 0 500 140"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[46%] h-32"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="hero-ecg-line"
                d="
                  M0 70
                  H105
                  L125 70
                  L145 35
                  L165 105
                  L190 10
                  L215 130
                  L240 70
                  H500
                "
                fill="none"
                stroke="#19e6f2"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

          </div>

          {/* MedTrack */}
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight leading-none fade-up"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 0 25px rgba(0,220,255,0.15)",
            }}
          >
            <span className="text-white">Med</span>
            <span className="text-teal-400">Track</span>
          </h1>

          {/* Tagline */}
          <p
            className="text-xl sm:text-2xl lg:text-3xl text-white mt-4 fade-up"
            style={{
              animationDelay: "100ms",
              textShadow: "0 2px 15px rgba(0,0,0,0.7)",
            }}
          >
            Track. Understand. Care.
          </p>

          {/* Description */}
          <p
            className="text-sm sm:text-base lg:text-lg text-white/85 max-w-xl mt-5 leading-relaxed fade-up"
            style={{
              animationDelay: "180ms",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            Organize your medical records,
            <br />
            gain insights, and get better care
            <br />
            with the power of AI.
          </p>

          {/* Watch Button */}
          <div
            className="mt-7 flex flex-col items-center fade-up"
            style={{
              animationDelay: "260ms",
            }}
          >
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setShowHowItWorks(true)}
              className="!w-14 !h-14 !p-0 !rounded-full flex items-center justify-center border-teal-400 text-white hover:bg-teal-400/20"
              aria-label="See how MedTrack works"
            >
              <Play
                size={22}
                fill="currentColor"
              />
            </Button>

            <span className="mt-3 text-sm text-white/90">
              See how MedTrack works
            </span>
          </div>

        </div>
      </section>

      <HowItWorksModal open={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </>
  );
}