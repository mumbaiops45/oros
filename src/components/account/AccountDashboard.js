"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { isAdmin } from "@/lib/auth";
import { formatMoney } from "@/lib/pricing";
import CartPanel from "./CartPanel";
import {
  BagIcon,
  BoxesIcon,
  MailIcon,
  PhoneIcon,
  TruckIcon,
  UserIcon,
} from "@/components/Icons";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "cart", label: "Cart" },
  { key: "orders", label: "Orders" },
  { key: "details", label: "Details" },
];

/** A section whose API is not built yet. */
function Pending({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-navy/20 bg-white px-6 py-12 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-navy/65">
        {description}
      </p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white px-5 py-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-2xl font-semibold text-ink">{value}</p>
        <p className="text-xs text-navy/60">{label}</p>
      </div>
    </div>
  );
}

function DetailsPanel({ user }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-3xl border border-navy/10 bg-navy/10 sm:grid-cols-3">
      {[
        { label: "Name", value: user.name, icon: UserIcon },
        {
          label: "Mobile",
          value: user.phone ? `+91 ${user.phone}` : "—",
          icon: PhoneIcon,
        },
        { label: "Email", value: user.email || "—", icon: MailIcon },
      ].map((row) => (
        <div key={row.label} className="bg-white px-5 py-5">
          <dt className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-navy/55 uppercase">
            <row.icon className="h-3.5 w-3.5 text-primary" />
            {row.label}
          </dt>
          <dd className="mt-1.5 truncate text-sm font-semibold text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function AccountDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, ready, logout } = useAuth();
  const { count, units, total } = useCart();

  const requested = searchParams.get("tab");
  const tab = TABS.some((item) => item.key === requested) ? requested : "overview";

  // The tab lives in the URL so the header cart button can deep-link straight
  // to it and a refresh keeps you where you were.
  const goTo = (key) =>
    router.replace(key === "overview" ? pathname : `${pathname}?tab=${key}`, {
      scroll: false,
    });

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      router.replace("/login?next=/account");
      return;
    }

    // Staff have a panel of their own; this one only knows how to show a
    // customer's cart and orders.
    if (isAdmin(user)) router.replace("/admin");
  }, [ready, user, router]);

  if (!ready || !user || isAdmin(user)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-navy/20 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 lg:pt-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
              Your account
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Hi {user.name}
            </h1>
            <p className="mt-2 text-sm text-navy/70">
              Your cart, orders and saved details live here.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="rounded-full border-2 border-navy/15 px-6 py-3 text-sm font-bold text-navy transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
          >
            Logout
          </button>
        </header>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar on desktop, a scrolling pill row on mobile — same shape
              as the admin shell so both dashboards feel like one product. */}
          <aside className="lg:w-52 lg:shrink-0">
            <nav className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
              {TABS.map((item) => {
                const active = item.key === tab;
                const badge = item.key === "cart" && count > 0 ? count : null;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => goTo(item.key)}
                    aria-current={active ? "page" : undefined}
                    className={`flex shrink-0 items-center justify-between gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition lg:rounded-xl ${
                      active
                        ? "bg-primary text-white lg:bg-primary/10 lg:text-primary"
                        : "bg-white text-navy/65 hover:text-ink lg:bg-transparent lg:hover:bg-white"
                    }`}
                  >
                    {item.label}
                    {badge && (
                      <span
                        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                          active
                            ? "bg-white text-primary lg:bg-primary lg:text-white"
                            : "bg-primary text-white"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0 flex-1">
            {tab === "overview" && (
              <div className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard icon={TruckIcon} label="Orders" value={0} />
                  <StatCard icon={BagIcon} label="In cart" value={count} />
                  <StatCard
                    icon={BoxesIcon}
                    label="Cart value"
                    value={formatMoney(total)}
                  />
                </div>

                <section>
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <h2 className="font-display text-xl font-semibold text-ink">
                      Your cart
                    </h2>
                    {count > 0 && (
                      <button
                        type="button"
                        onClick={() => goTo("cart")}
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        Manage · {units} units
                      </button>
                    )}
                  </div>
                  <CartPanel />
                </section>
              </div>
            )}

            {tab === "cart" && (
              <section>
                <h2 className="mb-4 font-display text-xl font-semibold text-ink">
                  Your cart
                </h2>
                <CartPanel />
              </section>
            )}

            {tab === "orders" && (
              <section>
                <h2 className="mb-4 font-display text-xl font-semibold text-ink">
                  Your orders
                </h2>
                {/* No orders endpoint exists yet — this is where the list lands. */}
                <Pending
                  icon={TruckIcon}
                  title="No orders yet"
                  description="Once checkout goes live, every order you place shows up here with its print status and delivery date."
                  action={
                    <Link
                      href="/"
                      className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
                    >
                      Browse the shop
                    </Link>
                  }
                />
              </section>
            )}

            {tab === "details" && (
              <section>
                <h2 className="mb-4 font-display text-xl font-semibold text-ink">
                  Your details
                </h2>
                <DetailsPanel user={user} />
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
