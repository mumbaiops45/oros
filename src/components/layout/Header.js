"use client";

import { useEffect, useRef, useState } from "react";
import { categories as demoCategories, announcements } from "@/data/catalog";
import { useCatalog } from "@/hooks/useCatalog";
import { useAuth } from "@/hooks/useAuth";
import { firstName } from "@/lib/auth";
import { orFallback, toNavCategory } from "@/lib/adapters";
import Image from "next/image";
import Link from "next/link";
import AccountDrawer from "./AccountDrawer";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import {
  BagIcon,
  BoxesIcon,
  ChevronDownIcon,
  HeartIcon,
  MenuIcon,
  SparkIcon,
  UserIcon,
} from "@/components/Icons";

export default function Header() {
  const { categories: liveCategories } = useCatalog();
  const { user } = useAuth();

  // Live tree from the API. Until categories have been created in the admin
  // panel the API returns nothing, and an empty menu is worse than the demo
  // catalogue — so fall back to it rather than render a blank panel.
  const categories = orFallback(
    liveCategories.map(toNavCategory),
    demoCategories
  );

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const closeTimer = useRef(null);

  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };

  // Short grace period: the pointer has to cross the navbar's own padding on
  // its way down to the panel, and that strip belongs to neither element.
  const closeMenu = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 180);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

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
                ? "shadow-[0_14px_40px_-16px_rgba(32,57,74,0.45)]"
                : "shadow-[0_10px_34px_-18px_rgba(32,57,74,0.35)]"
            }`}
          >
            {/* Left — category dropdown */}
            <div className="flex flex-1 items-center gap-1">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="rounded-full p-2 text-navy hover:bg-cream lg:hidden"
              >
                <MenuIcon />
              </button>

              <div
                className="hidden lg:block"
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
              >
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                    menuOpen ? "bg-cream text-ink" : "text-navy hover:bg-cream"
                  }`}
                >
                  Category
                  <ChevronDownIcon
                    className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`}
                  />
                  {/* Invisible bridge across the navbar padding so the pointer
                      stays inside the hover region all the way to the panel. */}
                  {menuOpen && (
                    <span aria-hidden="true" className="absolute inset-x-0 top-full h-5" />
                  )}
                </button>

                {/* Panel is anchored to the navbar, not the button, so it can span
                    the full width for the product pane. */}
                <div
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                  className={`absolute left-0 right-0 top-full pt-1 transition duration-200 ${
                    menuOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <MegaMenu categories={categories} />
                </div>
              </div>
            </div>

            {/* Centre — brand mark */}
            <Link
              href="/"
              aria-label="OROS 3D Studio — home"
              className=" flex shrink-0 items-center justify-center leading-none"
            >
              <Image
                src="/logo/Orosent-22.svg"
                alt="OROS 3D Studio"
                width={160}
                height={48}
                priority
                className="h-20 w-auto object-contain scale-300 sm:h-12"
              />
            </Link>

            {/* Right — bulk order sits alongside account, wishlist and cart */}
            <div className="flex flex-1 items-center justify-end gap-1">
              {/* Minimum order quantity / custom batch entry point */}
              <a
                href="#custom"
                title="Bulk & custom orders — minimum order quantity starts at 10 units"
                className="group relative mr-1 flex items-center gap-2 rounded-full bg-primary px-3 py-2.5 text-white shadow-[0_10px_22px_-12px_rgba(97,150,170,0.9)] transition hover:-translate-y-0.5 sm:px-3.5"
              >
                <BoxesIcon className="h-[18px] w-[18px]" />
                <span className="hidden text-xs font-bold leading-none xl:inline">
                  Bulk&nbsp;/&nbsp;MOQ
                </span>
                <span className="absolute -right-1 -top-1 flex h-4 items-center justify-center rounded-full bg-ink px-1.5 text-[9px] font-bold text-white">
                  10+
                </span>
              </a>

              {/* Signed in, the account control wears the customer's name and
                  opens the side sheet; signed out it is a plain icon link. */}
              {user ? (
                <button
                  type="button"
                  onClick={() => setAccountOpen(true)}
                  aria-label={`Account — signed in as ${user.name}`}
                  className="flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-1.5 text-primary transition hover:bg-primary/10"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <UserIcon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="hidden max-w-24 truncate text-xs font-bold text-navy sm:inline">
                    {firstName(user)}
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  aria-label="Sign in"
                  className="rounded-full p-2.5 text-primary transition hover:bg-primary/10"
                >
                  <UserIcon />
                </Link>
              )}
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

      <AccountDrawer
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
      />
    </header>
  );
}
