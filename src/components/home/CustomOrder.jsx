"use client";

import { useState } from "react";
import Image from "next/image";
import { bulkTiers, customSteps, materials } from "@/data/catalog";
import {
  ArrowRightIcon,
  BoxesIcon,
  CalculatorIcon,
  CheckIcon,
  benefitIcons,
} from "@/components/Icons";

/** Nothing custom leaves the floor below this. Mirrored in the navbar badge. */
const MOQ = 10;
const QUICK_PICKS = [10, 25, 50, 100, 250];

/** Highest tier whose `min` the quantity has reached. */
const tierFor = (qty) =>
  bulkTiers.reduce((match, tier) => (qty >= tier.min ? tier : match), bulkTiers[0]);

export default function CustomOrder() {
  const [qty, setQty] = useState(25);

  const tier = tierFor(qty);
  const belowMoq = qty < MOQ;

  return (
    <section id="custom" className="relative overflow-hidden bg-slate-50/70 py-16 lg:py-24">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <BoxesIcon className="h-3.5 w-3.5" />
            Custom &amp; bulk orders
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            Your design, our printers, your quantity
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Send an STL, a sketch or just an idea. We model it, print a sample and
            run the full batch — with a{" "}
            <strong className="font-semibold text-slate-900">
              minimum order quantity of {MOQ} units
            </strong>{" "}
            on anything made to order.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.02fr_1fr]">
          {/* Left — how a made-to-order job runs */}
          <div className="rounded-4xl bg-white p-7 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] sm:p-9">
            <h3 className="font-display text-xl font-semibold text-slate-900">
              How a custom order works
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Four steps, one point of contact, no minimum design fee.
            </p>

            <ol className="mt-7 space-y-6">
              {customSteps.map((step) => {
                const Icon = benefitIcons[step.icon];
                return (
                  <li key={step.step} className="flex gap-4">
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                        {step.step}
                      </span>
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{step.title}</h4>
                      <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                        {step.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Materials the batch can be run in */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Choose a material
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {materials.map((material) => (
                  <li
                    key={material.name}
                    className={`rounded-2xl ${material.tone} px-3.5 py-2.5`}
                    title={material.blurb}
                  >
                    <span className={`block text-[13px] font-bold ${material.accent}`}>
                      {material.name}
                    </span>
                    <span className="block text-[10px] leading-tight text-slate-500">
                      {material.blurb}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — live minimum order quantity calculator */}
          <div className="relative overflow-hidden rounded-4xl bg-primary p-7 sm:p-9">
            <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15" />
            <span className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-black/10" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/30">
                  <CalculatorIcon className="h-3.5 w-3.5" />
                  MOQ calculator
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-white">
                  How many units do you need?
                </h3>
              </div>
              <Image
                src="/bulk-illustration.svg"
                alt="A crate of identical 3D printed units with a minimum order quantity tag"
                width={420}
                height={360}
                className="animate-float-soft hidden w-32 shrink-0 drop-shadow-2xl sm:block"
              />
            </div>

            {/* Stepper */}
            <div className="relative mt-6 flex items-center gap-3 rounded-2xl bg-white p-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 5))}
                className="h-11 w-11 shrink-0 rounded-xl bg-slate-100 text-lg font-bold text-slate-700 transition hover:bg-slate-200"
              >
                –
              </button>
              <label className="flex-1 text-center">
                <span className="sr-only">Order quantity</span>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-transparent text-center font-display text-3xl font-semibold text-slate-900 outline-none"
                />
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  units
                </span>
              </label>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 5)}
                className="h-11 w-11 shrink-0 rounded-xl bg-primary/10 text-lg font-bold text-primary transition hover:bg-primary/20"
              >
                +
              </button>
            </div>

            <div className="relative mt-3 flex flex-wrap gap-2">
              {QUICK_PICKS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQty(n)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    qty === n
                      ? "bg-white text-primary"
                      : "bg-white/20 text-white ring-1 ring-white/30 hover:bg-white/30"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Live verdict */}
            <div className="relative mt-5 rounded-2xl bg-white/15 p-5 ring-1 ring-white/25 backdrop-blur">
              {belowMoq ? (
                <p className="text-sm leading-relaxed text-white">
                  <strong className="font-bold">Below our minimum.</strong> Custom
                  jobs start at {MOQ} units — add {MOQ - qty} more, or browse the
                  ready-to-ship catalogue where single pieces are always fine.
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                      Your tier
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-primary">
                      {tier.label}
                    </span>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-white/70">
                        Batch pricing
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold text-white">
                        {tier.discount}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-white/70">
                        Lead time
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold text-white">
                        {tier.lead}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/85">{tier.note}</p>
                </>
              )}
            </div>

            <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#"
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Upload your design
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a
                href="#products"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/50 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Buy single pieces
              </a>
            </div>
          </div>
        </div>

        {/* The full MOQ ladder */}
        <div className="mt-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Minimum order quantity &amp; batch pricing
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                The more identical units in a run, the less each one costs to print.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Prices exclude GST · mixed designs are quoted per design
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bulkTiers.map((bulkTier) => (
              <li key={bulkTier.label}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5 ${
                    bulkTier.popular
                      ? "bg-slate-900 text-white shadow-[0_26px_50px_-30px_rgba(15,23,42,0.8)]"
                      : "border border-slate-200 bg-white"
                  }`}
                >
                  {bulkTier.popular && (
                    <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Most ordered
                    </span>
                  )}

                  <p
                    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      bulkTier.popular ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    {bulkTier.label}
                  </p>
                  <p
                    className={`mt-2 font-display text-xl font-semibold ${
                      bulkTier.popular ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {bulkTier.range}
                  </p>

                  <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-bold text-primary">
                    {bulkTier.discount}
                  </p>

                  <ul
                    className={`mt-4 mb-5 space-y-2 text-[13px] ${
                      bulkTier.popular ? "text-white/80" : "text-slate-600"
                    }`}
                  >
                    <li className="flex gap-2">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Ships in {bulkTier.lead}
                    </li>
                    <li className="flex gap-2">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {bulkTier.note}
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => setQty(bulkTier.min)}
                    className={`mt-auto w-full rounded-full px-5 py-2.5 text-xs font-bold transition ${
                      bulkTier.popular
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-slate-100 text-slate-700 hover:bg-primary hover:text-white"
                    }`}
                  >
                    Quote {bulkTier.min}
                    {bulkTier.min === 250 ? "+" : ""} units
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
