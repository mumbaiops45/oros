"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOGIN_PATH } from "@/components/admin/AdminGuard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/admin/ui";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/subcategories", label: "Subcategories" },
  { href: "/admin/bulk", label: "Bulk import" },
];

const isActive = (pathname, item) =>
  item.exact ? pathname === item.href : pathname.startsWith(item.href);

function Nav({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            isActive(pathname, item)
              ? "bg-primary/10 text-primary"
              : "text-slate-500 hover:bg-slate-100 hover:text-navy"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // The login screen is the one admin route that renders without the shell.
  // AdminGuard has already proved there is a user by the time we get here.
  if (pathname === LOGIN_PATH) {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle navigation"
            >
              <span className="block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
            </button>
            <Link href="/admin" className="font-display text-lg font-bold text-navy">
              OROS <span className="text-primary">admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm font-semibold text-slate-500 hover:text-navy sm:block"
            >
              View store
            </Link>
            <span className="hidden text-sm text-slate-500 md:block">
              {user.email}
            </span>
            <Button variant="secondary" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 px-4 py-3 lg:hidden">
            <Nav pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          </div>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <Nav pathname={pathname} />
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
