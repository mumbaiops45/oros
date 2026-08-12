"use client";

import { useEffect, useState } from "react";
import { categories, announcements } from "@/data/catalog";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import {
  BagIcon,
  ChevronDownIcon,
  HeartIcon,
  MenuIcon,
  SparkIcon,
  UserIcon,
} from "@/components/Icons";

const NAV_LINKS = [
  { label: "Shop All", href: "#products" },
  { label: "Best Sellers", href: "#bestsellers" },
  { label: "Our Story", href: "#story" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Announcement bar is pinned to the very top and folds away on scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setTickerIndex((i) => (i + 1) % announcements.length),
      4500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Announcement bar */}
      <div
        className={`overflow-hidden bg-primary text-white transition-all duration-300 ${
          scrolled ? "h-0 opacity-0" : "h-9 opacity-100"
        }`}
      >
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-4 text-center">
          <SparkIcon className="h-3.5 w-3.5 shrink-0" />
          <p key={tickerIndex} className="truncate text-[11px] font-medium tracking-wide sm:text-xs">
            {announcements[tickerIndex]}
          </p>
        </div>
      </div>

      {/* Floating navbar */}
      <div className={`px-5 transition-all duration-300 sm:px-8 lg:px-15 ${scrolled ? "pt-2" : "pt-4"}`}>
        <div className="relative mx-auto max-w-7xl">
          <nav
            className={`flex items-center gap-4 rounded-2xl bg-white px-4 py-3 transition-shadow duration-300 sm:px-6 ${
              scrolled
                ? "shadow-[0_14px_40px_-16px_rgba(15,23,42,0.45)]"
                : "shadow-[0_10px_34px_-18px_rgba(15,23,42,0.35)]"
            }`}
          >
            {/* Left — category dropdown + links */}
            <div className="flex flex-1 items-center gap-1">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="rounded-full p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
              >
                <MenuIcon />
              </button>

              <div
                className="hidden lg:block"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                    menuOpen ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Category
                  <ChevronDownIcon
                    className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Panel is anchored to the navbar, not the button, so it can span
                    the full width for the product pane. */}
                <div
                  className={`absolute left-0 right-0 top-full pt-3 transition duration-200 ${
                    menuOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <MegaMenu categories={categories} />
                </div>
              </div>

              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 xl:block"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Centre — wordmark */}
            <a href="#" className="flex shrink-0 flex-col items-center leading-none">
              <span className="font-display text-2xl font-semibold tracking-[0.3em] text-slate-900 sm:text-[26px]">
                OROS
              </span>
              <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.42em] text-slate-400">
                Organics
              </span>
            </a>

            {/* Right — the only place primary appears in the navbar */}
            <div className="flex flex-1 items-center justify-end gap-1">
              <a
                href="#"
                aria-label="Account"
                className="rounded-full p-2.5 text-primary transition hover:bg-primary/10"
              >
                <UserIcon />
              </a>
              <a
                href="#"
                aria-label="Wishlist"
                className="relative rounded-full p-2.5 text-primary transition hover:bg-primary/10"
              >
                <HeartIcon />
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                  3
                </span>
              </a>
              <a
                href="#"
                aria-label="Cart"
                className="relative rounded-full p-2.5 text-primary transition hover:bg-primary/10"
              >
                <BagIcon />
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                  2
                </span>
              </a>
            </div>
          </nav>
        </div>
      </div>

      <MobileMenu
        categories={categories}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
