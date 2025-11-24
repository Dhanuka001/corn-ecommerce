"use client";

import type { Address } from "@/lib/api/addresses";

type AddressCardProps = {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
};

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-neutral-900">
            {address.fullName}
          </p>
          <p className="text-sm text-neutral-600">{address.phone}</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
          <button
            type="button"
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-50"
            onClick={() => onEdit(address)}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/15"
            onClick={() => onDelete(address)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="space-y-1 text-sm text-neutral-700">
        <p>{address.addressLine1}</p>
        {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
        <p>
          {address.city}, {address.district}
        </p>
        {address.postalCode ? <p>Postal code: {address.postalCode}</p> : null}
      </div>
    </article>
  );
}
