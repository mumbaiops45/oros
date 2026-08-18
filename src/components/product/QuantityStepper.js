"use client";

/** Quantity control that will not go below the product's minimum order. */
export default function QuantityStepper({ qty, min = 1, onChange }) {
  const step = (delta) => onChange(Math.max(min, qty + delta));

  return (
    <div className="inline-flex items-center rounded-full border border-navy/15">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={qty <= min}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-navy transition hover:text-primary disabled:cursor-not-allowed disabled:text-navy/25"
      >
        −
      </button>
      <input
        type="number"
        min={min}
        value={qty}
        aria-label="Quantity"
        onChange={(event) => onChange(Math.max(min, Number(event.target.value) || min))}
        className="w-14 [appearance:textfield] border-0 bg-transparent text-center text-sm font-bold text-ink outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-navy transition hover:text-primary"
      >
        +
      </button>
    </div>
  );
}
