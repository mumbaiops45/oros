"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { isAdmin as isAdminRole } from "@/lib/auth";

/**
 * The signed-in session, customer or admin. Kicks off the one-time token
 * check on first mount so any component can just read `user` and `ready`.
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);
  const signInAdmin = useAuthStore((state) => state.signInAdmin);
  const signInWithOtp = useAuthStore((state) => state.signInWithOtp);
  const logout = useAuthStore((state) => state.logout);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    if (!ready) hydrate();
  }, [ready, hydrate]);

  return {
    user,
    ready,
    isAdmin: isAdminRole(user),
    signInAdmin,
    signInWithOtp,
    logout,
  };
}
