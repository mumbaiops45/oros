"use client";

import { useEffect } from "react";

/* ------------------------------------------------------------------
   Primitives
   ------------------------------------------------------------------ */

const BUTTON_VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50",
  secondary:
    "bg-white text-navy ring-1 ring-slate-200 hover:bg-slate-50 disabled:text-slate-400",
  danger: "bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300",
  ghost: "text-slate-500 hover:bg-slate-100 hover:text-navy",
};

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  loading = false,
  disabled,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

export function Field({ label, hint, error, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-xs text-slate-400">{hint}</span>
      )}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}

const CONTROL =
  "w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-navy ring-1 ring-slate-200 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-400";

export function Input({ className = "", ...rest }) {
  return <input className={`${CONTROL} ${className}`} {...rest} />;
}

export function Textarea({ className = "", rows = 4, ...rest }) {
  return <textarea rows={rows} className={`${CONTROL} ${className}`} {...rest} />;
}

export function Select({ className = "", children, ...rest }) {
  return (
    <select className={`${CONTROL} ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function Checkbox({ label, className = "", ...rest }) {
  return (
    <label className={`flex items-center gap-2 text-sm text-navy ${className}`}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
        {...rest}
      />
      {label}
    </label>
  );
}

/* ------------------------------------------------------------------
   Surfaces
   ------------------------------------------------------------------ */

export function Card({ title, description, actions, className = "", children }) {
  return (
    <section className={`rounded-2xl bg-white ring-1 ring-slate-200/80 ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-bold text-navy">{title}</h2>}
            {description && (
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

const BADGE_TONES = {
  DRAFT: "bg-amber-50 text-amber-700 ring-amber-200",
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ARCHIVED: "bg-slate-100 text-slate-600 ring-slate-200",
  yes: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  no: "bg-slate-100 text-slate-500 ring-slate-200",
};

export function Badge({ tone = "no", children }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
        BADGE_TONES[tone] || BADGE_TONES.no
      }`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------
   Feedback
   ------------------------------------------------------------------ */

const ALERT_TONES = {
  error: "bg-rose-50 text-rose-800 ring-rose-200",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  info: "bg-sky-50 text-sky-800 ring-sky-200",
};

export function Alert({ tone = "error", children, onDismiss }) {
  if (!children) return null;

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-lg px-4 py-3 text-sm ring-1 ring-inset ${ALERT_TONES[tone]}`}
    >
      <span>{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-lg leading-none opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export function Spinner({ className = "" }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-primary ${className}`}
    />
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center">
      <p className="text-sm font-semibold text-navy">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------
   Table
   ------------------------------------------------------------------ */

export function Table({ head, children }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            {head.map((label) => (
              <th
                key={label}
                className="px-3 py-2.5 text-xs font-semibold tracking-wide text-slate-500 uppercase"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ className = "", children, ...rest }) {
  return (
    <td className={`px-3 py-3 align-middle text-navy ${className}`} {...rest}>
      {children}
    </td>
  );
}

/* ------------------------------------------------------------------
   Modal
   ------------------------------------------------------------------ */

export function Modal({ open, title, onClose, footer, wide = false, children }) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 sm:p-8">
      <div
        className={`relative w-full ${
          wide ? "max-w-3xl" : "max-w-lg"
        } rounded-2xl bg-white shadow-xl ring-1 ring-slate-200`}
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-navy">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-navy"
            aria-label="Close"
          >
            &times;
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  loading,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}
