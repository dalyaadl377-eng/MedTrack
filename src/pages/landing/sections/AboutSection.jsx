import { Target, Eye, ShieldCheck } from "lucide-react";

import Card from "../../../components/ui/Card";

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "Empower people to take control of their health.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "A world where every health record tells a better story.",
  },
  {
    icon: ShieldCheck,
    title: "Our Values",
    desc: "Privacy, Innovation, Care, and Trust.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 sm:py-28 border-b border-ink-border"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div>
          <span className="text-teal-400 text-sm font-medium">
            About Us
          </span>

          <h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight mt-3 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MedTrack was built with a simple mission:
          </h2>

          <p className="text-teal-300 font-medium mb-4">
            Make healthcare smarter, organized, and accessible for everyone.
          </p>

          <p className="text-mist-400 leading-relaxed mb-8">
            We combine technology, AI, and healthcare expertise to help
            patients and doctors connect, collaborate, and make better
            decisions.
          </p>

          {/* MISSION / VISION / VALUES */}
          <div className="grid sm:grid-cols-3 gap-4">
            {pillars.map((p) => {
              const Icon = p.icon;

              return (
                <div key={p.title}>
                  <Icon
                    size={18}
                    className="text-teal-400 mb-2"
                  />

                  <p className="text-sm font-medium text-mist-100">
                    {p.title}
                  </p>

                  <p className="text-xs text-mist-500 mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* IMAGE CARD */}
        <Card className="relative aspect-[4/3] overflow-hidden group">

          {/* Glow */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(400px circle at 50% 50%, rgba(23,185,196,0.2), transparent 65%)",
            }}
          />

          {/* IMAGE */}
          <img
            src="/images/about.png"
            alt="MedTrack Office"
            className="
              absolute inset-0
              w-full h-full
              object-cover
              scale-100
              transition-transform
              duration-700
              ease-out
              group-hover:scale-110
            "
          />

          {/* Overlay */}
          <div
            className="
              absolute inset-0
              z-20
              bg-black/10
              transition-all
              duration-500
              group-hover:bg-black/0
            "
          />

        </Card>

      </div>
    </section>
  );
}