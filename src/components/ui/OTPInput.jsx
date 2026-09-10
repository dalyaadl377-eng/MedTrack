import { useRef, useEffect } from "react";

export default function OTPInput({ length = 6, value, onChange, error, disabled = false }) {
  const inputsRef = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const setDigit = (idx, char) => {
    const next = digits.slice();
    next[idx] = char;
    onChange(next.join(""));
  };

  const handleChange = (idx, e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigit(idx, "");
      return;
    }
    const chars = raw.split("");
    let cursor = idx;
    chars.forEach((c) => {
      if (cursor < length) {
        setDigit(cursor, c);
        cursor++;
      }
    });
    const nextIndex = Math.min(idx + chars.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        setDigit(idx, "");
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        setDigit(idx - 1, "");
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div>
      <div className="flex gap-2.5 justify-between" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            value={d}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={disabled}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1} of ${length}`}
            className={[
              "w-full aspect-square max-w-[52px] text-center text-lg font-semibold rounded-xl",
              "bg-ink-850 border text-mist-100 outline-none transition-colors",
              "focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
              error ? "border-danger" : "border-ink-border",
            ].join(" ")}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
