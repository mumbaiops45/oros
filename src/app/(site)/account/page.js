"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isAdmin } from "@/lib/auth";
import {
  BagIcon,
  BoxesIcon,
  MailIcon,
  PhoneIcon,
  TruckIcon,
  UserIcon,
} from "@/components/Icons";

/** A panel section that has nothing in it yet because its API is not built. */
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

export default function AccountPage() {
  const router = useRouter();
  const { user, ready, logout } = useAuth();

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      router.replace("/login?next=/account");
      return;
    }

    // Staff have a panel of their own; this one only knows how to show a
    // customer's orders.
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
    <div className="bg-cream pt-32 pb-20 lg:pt-36">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
              Your account
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Hi {user.name}
            </h1>
            <p className="mt-2 text-sm text-navy/70">
              Your orders, saved details and bulk quotes live here.
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

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Orders", value: 0, icon: TruckIcon },
            { label: "In cart", value: 0, icon: BagIcon },
            { label: "Bulk quotes", value: 0, icon: BoxesIcon },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white px-5 py-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-2xl font-semibold text-ink">
                  {stat.value}
                </p>
                <p className="text-xs text-navy/60">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-10">
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

        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Your cart
          </h2>
          <Pending
            icon={BagIcon}
            title="Your cart is empty"
            description="The cart API is still being built. Bulk orders can be placed from any product page in the meantime."
          />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Your details
          </h2>
          <dl className="grid gap-px overflow-hidden rounded-3xl border border-navy/10 bg-navy/10 sm:grid-cols-3">
            {[
              { label: "Name", value: user.name, icon: UserIcon },
              {
                label: "Mobile",
                value: user.phone ? `+91 ${user.phone}` : "—",
                icon: PhoneIcon,
              },
              { label: "Email", value: user.email, icon: MailIcon },
            ].map((row) => (
              <div key={row.label} className="bg-white px-5 py-5">
                <dt className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-navy/55 uppercase">
                  <row.icon className="h-3.5 w-3.5 text-primary" />
                  {row.label}
                </dt>
                <dd className="mt-1.5 truncate text-sm font-semibold text-ink">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
