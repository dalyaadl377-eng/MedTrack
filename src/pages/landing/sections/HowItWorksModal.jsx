import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { howItWorksSteps } from "./HowItWorks";

export default function HowItWorksModal({ open, onClose }) {
  const [active, setActive] = useState(0);

  // Reset to the first step every time the walkthrough is reopened.
  useEffect(() => {
    if (open) setActive(0);
  }, [open]);

  const step = howItWorksSteps[active];
  const isFirst = active === 0;
  const isLast = active === howItWorksSteps.length - 1;

  const goNext = () => setActive((i) => Math.min(i + 1, howItWorksSteps.length - 1));
  const goPrev = () => setActive((i) => Math.max(i - 1, 0));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="How MedTrack Works"
      description="A quick, interactive walkthrough — step through to see how it all fits together."
      size="lg"
    >
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {howItWorksSteps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to step ${i + 1}: ${s.title}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-8 bg-teal-400" : "w-4 bg-ink-border hover:bg-mist-500"
            }`}
          />
        ))}
      </div>

      {/* Active step */}
      <div className="flex flex-col items-center text-center px-2 sm:px-8 py-2 min-h-[220px] justify-center">
        <div className="w-16 h-16 rounded-full bg-ink-850 border border-teal-500/30 flex items-center justify-center mb-5">
          <step.icon size={26} className="text-teal-400" />
        </div>

        <span className="text-xs text-teal-400 font-medium mb-1.5">
          Step {String(active + 1).padStart(2, "0")} of {howItWorksSteps.length}
        </span>

        <h3 className="text-xl font-semibold text-mist-100" style={{ fontFamily: "var(--font-display)" }}>
          {step.title}
        </h3>

        <p className="text-mist-400 mt-2 max-w-sm">{step.desc}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-ink-border">
        <Button variant="outline" size="sm" onClick={goPrev} disabled={isFirst}>
          <ChevronLeft size={15} /> Back
        </Button>

        {isLast ? (
          <Button size="sm" onClick={onClose}>
            Got it
          </Button>
        ) : (
          <Button size="sm" onClick={goNext}>
            Next <ChevronRight size={15} />
          </Button>
        )}
      </div>
    </Modal>
  );
}
