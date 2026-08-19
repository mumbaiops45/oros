"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/store/authStore";
import {
  selectCartCount,
  selectCartTotal,
  selectCartUnits,
  useCartStore,
} from "@/store/cartStore";

/**
 * The signed-in customer's cart. Loads itself the moment the session is
 * known and empties itself on sign-out, so any component can just read
 * `items` / `count` without caring who fetched them.
 */
export function useCart() {
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);

  const { items, loading, loaded, error } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      loading: state.loading,
      loaded: state.loaded,
      error: state.error,
    }))
  );

  const count = useCartStore(selectCartCount);
  const units = useCartStore(selectCartUnits);
  const total = useCartStore(selectCartTotal);

  const load = useCartStore((state) => state.load);
  const reset = useCartStore((state) => state.reset);
  const add = useCartStore((state) => state.add);
  const setQty = useCartStore((state) => state.setQty);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);

  useEffect(() => {
    if (!ready) return;

    if (user) load();
    else reset();
  }, [ready, user, load, reset]);

  return {
    items,
    count,
    units,
    total,
    loading: loading || (Boolean(user) && !loaded),
    error,
    signedIn: Boolean(user),
    add,
    setQty,
    remove,
    clear,
    reload: () => load(true),
  };
}
