"use client";

import type { Address } from "@/lib/api/addresses";
type CheckoutAddressSelectorProps = {
  addresses: Address[];
  selectedAddressId: string | null;
  onChange: (id: string) => void;
};

export function CheckoutAddressSelector({
  addresses,
  selectedAddressId,
  onChange,
}: CheckoutAddressSelectorProps) {
  if (!addresses.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-6 text-sm text-neutral-700 shadow-sm">
        <p className="font-semibold text-neutral-900">No saved addresses yet.</p>
        <p className="mt-1 text-xs text-neutral-500">
          Add an address from the button above so we can calculate shipping and keep your order ready.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addresses.map((address) => {
        const selected = selectedAddressId === address.id;
        return (
          <button
            key={address.id}
            type="button"
            onClick={() => onChange(address.id)}
            className={`flex h-full flex-col items-start gap-2 rounded-2xl border p-4 text-left shadow-sm transition ${
              selected
                ? "border-primary bg-primary/5"
                : "border-neutral-200 bg-white hover:border-primary/40"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-base font-semibold text-neutral-900">
                  {address.fullName}
                </p>
                <p className="text-sm text-neutral-600">{address.phone}</p>
              </div>
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                  selected
                    ? "border-primary bg-primary text-white"
                    : "border-neutral-300 text-neutral-400"
                }`}
                aria-hidden
              >
                {selected ? "•" : ""}
              </span>
            </div>
            <div className="text-sm text-neutral-700">
              <p>{address.addressLine1}</p>
              {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
              <p>
                {address.city}, {address.district}
              </p>
              {address.postalCode ? <p>Postal code: {address.postalCode}</p> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
