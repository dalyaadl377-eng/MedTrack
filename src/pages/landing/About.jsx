import { Link } from "react-router-dom";
import { Target, Eye, ShieldCheck, HeartPulse, ArrowRight } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SectionHeader from "../../components/ui/SectionHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const pillars = [
  { icon: Target, title: "Our Mission", desc: "Empower people to take control of their health by making medical information easy to organize and understand." },
  { icon: Eye, title: "Our Vision", desc: "A world where every health record tells a clear, connected story — for patients and the doctors who care for them." },
  { icon: ShieldCheck, title: "Our Values", desc: "Privacy, Innovation, Care, and Trust guide every decision we make about your data." },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-ink-border py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center flex flex-col items-center gap-5">
            <HeartPulse size={36} className="text-teal-400 pulse-glow" />
            <SectionHeader
              eyebrow="About MedTrack"
              title="Healthcare information,"
              highlight="organized for clarity"
              description="MedTrack helps patients and doctors organize medical reports, analyses, and history in one connected place — so nothing important gets lost between visits."
            />
          </div>
        </section>

        <section className="py-16 sm:py-24 border-b border-ink-border">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid sm:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <Card key={p.title} className="p-7">
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 flex items-center justify-center mb-5">
                  <p.icon size={20} className="text-teal-400" />
                </div>
                <p className="font-medium text-mist-100 mb-2">{p.title}</p>
                <p className="text-sm text-mist-500 leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-16 sm:py-24 border-b border-ink-border">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              The problem we saw
            </h2>
            <p className="text-mist-400 leading-relaxed">
              Doctors often meet patients carrying years of scattered blood tests, scans, and reports from
              different clinics, on different dates, in different formats. Making sense of a patient's full
              history under time pressure is hard — and important trends can be missed. MedTrack organizes
              that information in one place so history, changes, and trends are visible at a glance. It is a
              tool for organizing medical information, not a diagnostic system — the judgment always stays
              with the doctor.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-ink-border bg-ink-850 px-8 py-10">
            <div>
              <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                See MedTrack in action
              </h3>
              <p className="text-mist-400 mt-1.5">Create a free account as a patient or a doctor.</p>
            </div>
            <Button as={Link} to="/signup" size="lg">
              Sign Up Now <ArrowRight size={16} />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
