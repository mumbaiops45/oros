"use client";

import { create } from "zustand";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartQty,
} from "@/api/cart.api";

/**
 * The cart lives on the server, one row per (product + variant), so this
 * store is a cache of it rather than the source of truth: every mutation
 * calls the API and then refetches the list, which is cheap and keeps the
 * header badge, the product page and the dashboard showing the same thing.
 *
 * `loaded` guards the one-time fetch on sign-in; `logout()` in authStore
 * calls reset() so the next customer never sees the previous one's lines.
 */
export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,
  loaded: false,
  error: "",

  /** Fetches once per session unless `force` is passed after a mutation. */
  load: async (force = false) => {
    if (get().loading) return;
    if (get().loaded && !force) return;

    set({ loading: true });

    try {
      const data = await getCart();
      set({ items: data?.items || [], loaded: true, error: "" });
    } catch (error) {
      // a 401 just means "not signed in" — an empty cart, not a failure
      set({ items: [], loaded: true, error: error.status === 401 ? "" : error.message });
    } finally {
      set({ loading: false });
    }
  },

  add: async (body) => {
    const result = await addToCart(body);
    await get().load(true);
    return result;
  },

  setQty: async (id, qty) => {
    await updateCartQty(id, qty);
    await get().load(true);
  },

  remove: async (id) => {
    await removeCartItem(id);
    await get().load(true);
  },

  clear: async () => {
    await clearCart();
    set({ items: [] });
  },

  reset: () => set({ items: [], loaded: false, loading: false, error: "" }),
}));

/** Distinct lines, which is what the header badge counts. */
export const selectCartCount = (state) => state.items.length;

/** Every unit across every line. */
export const selectCartUnits = (state) =>
  state.items.reduce((total, item) => total + (item.qty || 0), 0);

export const selectCartTotal = (state) =>
  state.items.reduce(
    (total, item) => total + (item.unitPrice || 0) * (item.qty || 0),
    0
  );
