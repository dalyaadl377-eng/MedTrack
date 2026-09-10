import { useEffect, useState, useCallback } from "react";

// Simulates a network fetch so pages have a real Loading state to show,
// with a retry-able Error path (useful for wiring in a real API later).
export function useSimulatedLoad(delay = 500, deps = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, delay, ...deps]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { loading, error, retry };
}
