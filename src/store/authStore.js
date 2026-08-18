"use client";

import { create } from "zustand";
import { adminLogin, fetchMe, verifyLoginOtp } from "@/api/auth.api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const readUser = () => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * One session for the whole app. Customers sign in with a phone OTP and
 * admins with email + password, but both walk away with the same bearer
 * token, so both land here — `user.role` is what tells them apart.
 *
 * The token lives in localStorage under "token" because that is what the
 * axios request interceptor reads on every call.
 *
 * `ready` is false until hydrate() has settled, so route guards can tell
 * "not signed in" apart from "not checked yet".
 */
export const useAuthStore = create((set) => {
  const persist = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    set({ user: data.user, ready: true });

    return data.user;
  };

  return {
    user: null,
    ready: false,

    /**
     * Trusts the stored user first so the shell paints immediately, then
     * revalidates the token against /auth/me and signs out if it is stale.
     */
    hydrate: async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        set({ user: null, ready: true });
        return;
      }

      const stored = readUser();
      set({ user: stored });

      try {
        // /auth/me answers with the identity fields it can prove from the
        // token — name, email, role — and not the phone the customer signed
        // in with, so the stored record fills the rest back in.
        const data = await fetchMe();
        set({ user: { ...stored, ...data.user }, ready: true });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        set({ user: null, ready: true });
      }
    },

    /** Admin panel — email + password, no OTP. */
    signInAdmin: async (email, password) =>
      persist(await adminLogin(email, password)),

    /**
     * Storefront — the login OTP is what mints the token, so verifying it
     * and signing in are the same step.
     */
    signInWithOtp: async (phone, otp) =>
      persist(await verifyLoginOtp(phone, otp)),

    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      set({ user: null, ready: true });
    },
  };
});
