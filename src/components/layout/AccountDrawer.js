"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { dashboardPath, isAdmin } from "@/lib/auth";
import { BagIcon, BoxesIcon, CloseIcon, UserIcon } from "@/components/Icons";

/**
 * The account sheet, anchored to the right edge. Signed in it holds the two
 * actions the header promises — dashboard and sign out — and the dashboard it
 * points at depends on the role: staff get the admin panel, customers get
 * their own.
 */
export default function AccountDrawer({ open, onClose }) {
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const { count: cartCount } = useCart();

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const staff = isAdmin(user);

  const onSignOut = () => {
    logout();
    onClose();
    router.push("/");
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-ink/45 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-label="Account"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-[61] flex h-full w-[86%] max-w-sm flex-col bg-white shadow-[0_0_60px_-15px_rgba(32,57,74,0.55)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-navy/10 bg-cream px-5 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <UserIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold text-ink">
                {user ? user.name : "Your account"}
              </p>
              <p className="truncate text-xs text-navy/60">
                {user
                  ? user.phone
                    ? `+91 ${user.phone}`
                    : user.email
                  : "Sign in to track your orders"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close account panel"
            className="rounded-full p-2 text-navy/60 transition hover:bg-white hover:text-ink"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {!ready && (
            <div className="h-24 animate-pulse rounded-2xl bg-cream" />
          )}

          {ready && !user && (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-navy/75">
                Sign in with your mobile number to see your orders, saved
                designs and bulk quotes.
              </p>
              <Link
                href="/login"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full border-2 border-primary px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
              >
                Create an account
              </Link>
            </div>
          )}

          {ready && user && (
            <nav className="space-y-2">
              <Link
                href={dashboardPath(user)}
                onClick={onClose}
                className="flex items-center justify-between gap-3 rounded-2xl border border-navy/10 px-4 py-4 transition hover:border-primary/40 hover:bg-cream"
              >
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    Dashboard
                  </span>
                  <span className="mt-0.5 block text-xs text-navy/60">
                    {staff
                      ? "Manage the catalogue"
                      : "Your orders, cart and details"}
                  </span>
                </span>
                <BoxesIcon className="h-5 w-5 shrink-0 text-primary" />
              </Link>

              {!staff && (
                <Link
                  href="/account?tab=cart"
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-navy/10 px-4 py-4 transition hover:border-primary/40 hover:bg-cream"
                >
                  <span>
                    <span className="block text-sm font-semibold text-ink">Cart</span>
                    <span className="mt-0.5 block text-xs text-navy/60">
                      {cartCount
                        ? `${cartCount} item${cartCount === 1 ? "" : "s"} waiting`
                        : "Nothing in it yet"}
                    </span>
                  </span>
                  <span className="relative shrink-0 text-primary">
                    <BagIcon className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </span>
                </Link>
              )}

              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-navy/10 px-4 py-4 text-left transition hover:border-rose-300 hover:bg-rose-50"
              >
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    Logout
                  </span>
                  <span className="mt-0.5 block text-xs text-navy/60">
                    Sign out on this device
                  </span>
                </span>
                <span className="text-lg leading-none text-rose-500">&rarr;</span>
              </button>
            </nav>
          )}
        </div>
      </aside>
    </>
  );
}
