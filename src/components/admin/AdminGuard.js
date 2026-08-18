"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/admin/ui";

export const LOGIN_PATH = "/admin/login";

/**
 * Everything under /admin except the login screen needs an admin session.
 * The store hydrates once; until it has, `ready` is false and nothing is
 * rendered.
 *
 * A customer token is a valid session but not an admin one — the API would
 * reject every write with a 403 — so those are sent to their own panel
 * rather than left staring at a shell they cannot use.
 */
export default function AdminGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready, isAdmin } = useAuth();

  const onLoginPage = pathname === LOGIN_PATH;

  useEffect(() => {
    if (!ready) return;

    if (!user && !onLoginPage) {
      router.replace(LOGIN_PATH);
      return;
    }

    if (user && !isAdmin) {
      router.replace("/account");
      return;
    }

    if (user && onLoginPage) {
      router.replace("/admin");
    }
  }, [ready, user, isAdmin, onLoginPage, router]);

  if (onLoginPage) {
    return ready && !user ? children : null;
  }

  if (!ready || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return children;
}
