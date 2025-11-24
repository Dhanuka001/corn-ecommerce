"use client";

import type { Address } from "@/lib/api/addresses";

import { AddressCard } from "./address-card";

type AddressListProps = {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
};

export function AddressList({ addresses, onEdit, onDelete }: AddressListProps) {
  if (!addresses.length) {
    return (
      <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-8 text-center text-sm text-neutral-600">
        No addresses yet. Add your first delivery address to speed up checkout.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
