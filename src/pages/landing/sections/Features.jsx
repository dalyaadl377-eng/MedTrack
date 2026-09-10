import {
  FolderHeart,
  TrendingUp,
  ShieldCheck,
  Users2,
  BellRing,
  Monitor,
  Users,
  FileText,
  Shield,
  Clock3,
} from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader";
import Card from "../../../components/ui/Card";

const features = [
  {
    icon: FolderHeart,
    title: "Medical History",
    desc: "All your reports, prescriptions, and records in one place.",
  },
  {
    icon: TrendingUp,
    title: "Smart Insights",
    desc: "Understand your health trends with easy-to-read charts.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your data is encrypted and protected with the highest standards.",
  },
  {
    icon: Users2,
    title: "Doctor Collaboration",
    desc: "Share your data easily and collaborate with your doctor.",
  },
  {
    icon: BellRing,
    title: "Reminders",
    desc: "Never miss your medications or appointments.",
  },
  {
    icon: Monitor,
    title: "Access Anywhere",
    desc: "Access your health data from any device, anytime.",
  },
];

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Happy Users",
  },
  {
    icon: FileText,
    value: "50K+",
    label: "Reports Stored",
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Data Security",
  },
  {
    icon: Clock3,
    value: "24/7",
    label: "Access Anytime",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 sm:py-28 border-b border-ink-border"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Section Title */}
        <SectionHeader
          title="Everything You Need,"
          highlight="In One Place"
        />

        {/* Features */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {features.map((f) => (
            <Card
              key={f.title}
              className="
                group
                min-h-[195px]
                p-5
                flex
                flex-col
                items-center
                text-center
                justify-start
                rounded-xl
                border
                border-ink-border
                bg-ink-850/70
                transition-all
                duration-300
                hover:border-teal-500/50
                hover:-translate-y-1
              "
            >

              {/* Icon */}
              <div
                className="
                  w-14
                  h-14
                  rounded-xl
                  bg-teal-500/10
                  border
                  border-teal-500/20
                  flex
                  items-center
                  justify-center
                  mb-5
                  transition-all
                  duration-300
                  group-hover:bg-teal-500/15
                  group-hover:border-teal-400/40
                "
              >
                <f.icon
                  size={27}
                  strokeWidth={1.7}
                  className="text-teal-400"
                />
              </div>

              {/* Title */}
              <p className="font-medium text-sm text-mist-100 leading-tight">
                {f.title}
              </p>

              {/* Description */}
              <p className="text-xs text-mist-500 mt-3 leading-relaxed">
                {f.desc}
              </p>

            </Card>
          ))}

        </div>

        {/* Statistics */}
        <div
          className="
            mt-7
            rounded-xl
            border
            border-ink-border
            bg-ink-850/60
            overflow-hidden
          "
        >

          <div className="grid grid-cols-2 md:grid-cols-4">

            {stats.map((s, index) => (
              <div
                key={s.label}
                className={`
                  relative
                  flex
                  items-center
                  justify-center
                  gap-4
                  px-5
                  py-6
                  sm:py-7
                  ${index > 0 ? "border-l border-ink-border" : ""}
                `}
              >

                {/* Icon Circle */}
                <div
                  className="
                    shrink-0
                    w-12
                    h-12
                    rounded-full
                    border
                    border-teal-500/30
                    bg-teal-500/5
                    flex
                    items-center
                    justify-center
                  "
                >
                  <s.icon
                    size={22}
                    strokeWidth={1.7}
                    className="text-teal-400"
                  />
                </div>

                {/* Text */}
                <div>
                  <p
                    className="
                      text-2xl
                      sm:text-3xl
                      font-semibold
                      text-mist-100
                      leading-none
                    "
                    style={{
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {s.value}
                  </p>

                  <p className="text-xs text-mist-500 mt-2">
                    {s.label}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}