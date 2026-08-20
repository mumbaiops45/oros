"use client";

import { useCallback, useEffect, useState } from "react";
import { getAddress, saveAddress } from "@/api/address.api";
import { useAuthStore } from "@/store/authStore";

/** The shape the address form binds to — every field a string. */
export const EMPTY_ADDRESS = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
};

/** Drops the mongo bookkeeping so the API only ever sees form fields. */
export const toAddressForm = (address) => {
  if (!address) return { ...EMPTY_ADDRESS };

  return Object.fromEntries(
    Object.keys(EMPTY_ADDRESS).map((key) => [
      key,
      address[key] ?? EMPTY_ADDRESS[key],
    ])
  );
};

const INITIAL = { address: null, loading: true, error: "" };

/**
 * The signed-in customer's single saved address.
 *
 * `save` posts to the upsert route, so the same call covers "first time"
 * and "changed their mind" — the caller never has to know which it is.
 */
export function useAddress() {
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);

  const [state, setState] = useState(INITIAL);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!ready) return undefined;

    let cancelled = false;

    const run = async () => {
      // Signed out is an answer, not a request worth making — the route is
      // behind `protect` and would only 401.
      if (!user) {
        if (!cancelled) setState({ address: null, loading: false, error: "" });
        return;
      }

      try {
        const data = await getAddress();
        if (!cancelled) {
          setState({ address: data?.address || null, loading: false, error: "" });
        }
      } catch (loadError) {
        if (!cancelled) {
          setState({
            address: null,
            loading: false,
            error: loadError.status === 401 ? "" : loadError.message,
          });
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [ready, user, tick]);

  const save = useCallback(async (values) => {
    const data = await saveAddress(values);
    const address = data?.address || null;

    setState({ address, loading: false, error: "" });

    return address;
  }, []);

  const reload = useCallback(() => setTick((current) => current + 1), []);

  return { ...state, save, reload };
}
