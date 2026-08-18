"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Generic request hook every resource hook is built on. Runs `request` on
 * mount and whenever `deps` change, and hands back a `reload` so a mutation
 * can refresh what it just changed.
 *
 * `deps` is serialised into a single key because the effect below has to
 * declare a literal dependency array. A refetch triggered by `reload` keeps
 * the previous data on screen — only a dependency change counts as loading.
 */
export function useApi(request, deps = []) {
  const key = JSON.stringify(deps);

  const [tick, setTick] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: "" });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const data = await request();
        if (!cancelled) setResult({ key, data, error: "" });
      } catch (error) {
        if (!cancelled) setResult({ key, data: null, error: error.message });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // `request` is a fresh closure every render; `key` already captures
    // everything it reads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick]);

  const reload = useCallback(() => {
    setTick((current) => current + 1);
  }, []);

  const setError = useCallback((error) => {
    setResult((current) => ({ ...current, error }));
  }, []);

  return {
    data: result.key === key ? result.data : null,
    error: result.key === key ? result.error : "",
    loading: result.key !== key,
    reload,
    setError,
  };
}
