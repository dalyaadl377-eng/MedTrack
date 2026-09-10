import {
  UploadCloud,
  FolderKanban,
  LineChart,
  BellRing,
  Users,
} from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader";

export const howItWorksSteps = [
  {
    icon: UploadCloud,
    title: "Upload",
    desc: "Upload your medical reports and lab results securely.",
  },
  {
    icon: FolderKanban,
    title: "Organize",
    desc: "We organize your data by date, type, and health condition.",
  },
  {
    icon: LineChart,
    title: "Track",
    desc: "Track your health trends with smart charts and insights.",
  },
  {
    icon: BellRing,
    title: "Get Alerts",
    desc: "Get notified about important changes that need attention.",
  },
  {
    icon: Users,
    title: "Share & Consult",
    desc: "Share with your doctor and get better, faster care.",
  },
];

export default function HowItWorks() {
  return (
    <>
      {/* Moving Dot Animation */}
      <style>{`
        .how-it-works-dot {
          position: absolute;
          top: 28px;
          left: 10%;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #19e6f2;
          box-shadow:
            0 0 5px rgba(25, 230, 242, 0.9),
            0 0 12px rgba(25, 230, 242, 0.8),
            0 0 20px rgba(25, 230, 242, 0.45);
          transform: translate(-50%, -50%);
          z-index: 5;
          animation: moveHowItWorksDot 4s linear infinite;
        }

        @keyframes moveHowItWorksDot {
          0% {
            left: 10%;
            opacity: 0;
          }

          5% {
            opacity: 1;
          }

          45% {
            opacity: 1;
          }

          50% {
            opacity: 1;
          }

          95% {
            opacity: 1;
          }

          100% {
            left: 90%;
            opacity: 0;
          }
        }

        @media (max-width: 639px) {
          .how-it-works-dot {
            display: none;
          }
        }
      `}</style>

      <section
        id="how-it-works"
        className="py-20 sm:py-28 border-b border-ink-border"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <SectionHeader
            title="How MedTrack"
            highlight="Works"
          />

          {/* Steps */}
          <div className="relative mt-14">

            {/* Connecting Line */}
            <div className="hidden sm:block absolute top-7 left-[10%] right-[10%] h-px bg-ink-border" />

            {/* Moving Dot */}
            <div className="hidden sm:block absolute inset-0 pointer-events-none">
              <div className="how-it-works-dot" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-4">

              {howItWorksSteps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center text-center"
                >

                  {/* Icon */}
                  <div className="relative z-10 w-14 h-14 rounded-full bg-ink-850 border border-teal-500/30 flex items-center justify-center mb-4">
                    <step.icon
                      size={22}
                      className="text-teal-400"
                    />
                  </div>

                  {/* Number */}
                  <span className="text-xs text-teal-400 font-medium mb-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <p className="font-medium text-mist-100">
                    {step.title}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-mist-500 mt-1.5 max-w-[180px]">
                    {step.desc}
                  </p>

                </div>
              ))}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}