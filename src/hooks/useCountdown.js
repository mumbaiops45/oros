"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Seconds remaining on a cooldown — used to stop an impatient customer from
 * asking for a fresh OTP on every keystroke.
 */
export function useCountdown() {
  const [until, setUntil] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!until) return undefined;

    const tick = () =>
      setSeconds(Math.max(0, Math.ceil((until - Date.now()) / 1000)));

    tick();
    const id = setInterval(tick, 500);

    return () => clearInterval(id);
  }, [until]);

  const start = useCallback((duration) => {
    setUntil(Date.now() + duration * 1000);
  }, []);

  return { seconds, start };
}
