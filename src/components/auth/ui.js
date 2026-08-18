"use client";

import { useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------
   Storefront auth primitives — the admin panel has its own slate-toned
   set in components/admin/ui.jsx; these wear the brand palette.
------------------------------------------------------------------ */

/** The card every auth step renders inside, centred under the fixed header. */
export function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <section className="bg-cream px-5 pt-32 pb-20 sm:px-8 lg:pt-36">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          {eyebrow && (
            <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-navy/75">
              {subtitle}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-[0_22px_45px_-30px_rgba(32,57,74,0.6)] sm:p-8">
          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-navy/70">{footer}</p>
        )}
      </div>
    </section>
  );
}

export function AuthField({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.12em] text-navy/60 uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-navy/50">{hint}</span>}
    </label>
  );
}

const CONTROL =
  "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-navy/35 focus:border-primary focus:ring-2 focus:ring-primary/25";

export function AuthInput({ className = "", ...rest }) {
  return <input className={`${CONTROL} ${className}`} {...rest} />;
}

/** Phone field with a fixed +91 prefix — the API stores 10 digits. */
export function PhoneInput({ value, onChange, ...rest }) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-navy/15 bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
      <span className="flex items-center border-r border-navy/10 bg-cream px-3.5 text-sm font-semibold text-navy/70">
        +91
      </span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        maxLength={10}
        value={value}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, 10))
        }
        className="w-full bg-transparent px-4 py-3 text-sm tracking-wide text-ink outline-none placeholder:text-navy/35"
        {...rest}
      />
    </div>
  );
}

export function AuthButton({
  type = "button",
  loading = false,
  disabled,
  variant = "primary",
  className = "",
  children,
  ...rest
}) {
  const tone =
    variant === "primary"
      ? "bg-primary text-white hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-18px_rgba(97,150,170,1)] disabled:bg-primary/45"
      : "border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:border-primary/30 disabled:text-primary/40";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition disabled:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none ${tone} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

const NOTICE_TONES = {
  error: "border-rose-200 bg-rose-50 text-rose-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-primary/25 bg-primary/10 text-navy",
};

export function Notice({ tone = "error", children }) {
  if (!children) return null;

  return (
    <div
      className={`mb-5 rounded-xl border px-4 py-3 text-sm ${NOTICE_TONES[tone]}`}
    >
      {children}
    </div>
  );
}

export function AuthLink({ href, children }) {
  return (
    <Link href={href} className="font-semibold text-primary hover:underline">
      {children}
    </Link>
  );
}

/**
 * Six single-character boxes that behave like one field: typing advances,
 * backspace on an empty box steps back, and a pasted code fills the row.
 */
export function OtpInput({ value, onChange, length = 6, disabled }) {
  const inputs = useRef([]);

  const digits = Array.from({ length }, (_, index) => value[index] || "");

  const setAt = (index, digit) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, length));
  };

  const onKeyDown = (index) => (event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onPaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    event.preventDefault();
    onChange(pasted.slice(0, length));
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-between gap-2" onPaste={onPaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          onChange={(event) => {
            const next = event.target.value.replace(/\D/g, "").slice(-1);
            setAt(index, next);
            if (next && index < length - 1) inputs.current[index + 1]?.focus();
          }}
          onKeyDown={onKeyDown(index)}
          onFocus={(event) => event.target.select()}
          className="h-13 w-full rounded-xl border border-navy/15 bg-white py-3 text-center font-display text-xl font-semibold text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:bg-cream disabled:text-navy/40"
        />
      ))}
    </div>
  );
}
