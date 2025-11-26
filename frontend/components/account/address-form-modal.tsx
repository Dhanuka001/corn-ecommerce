"use client";

import { useEffect, useState } from "react";

import type { Address, AddressPayload } from "@/lib/api/addresses";
import { LoadingOverlay } from "@/components/loading-overlay";

export const SRI_LANKA_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

type AddressFormModalProps = {
  isOpen: boolean;
  title: string;
  initialValues?: Partial<Address>;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: AddressPayload) => Promise<void>;
};

const emptyForm: AddressPayload = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  postalCode: "",
};

export function AddressFormModal({
  isOpen,
  title,
  initialValues,
  loading = false,
  onClose,
  onSubmit,
}: AddressFormModalProps) {
  const [form, setForm] = useState<AddressPayload>(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    // Prefill the form when the modal opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(
      initialValues
        ? {
            fullName: initialValues.fullName ?? "",
            phone: initialValues.phone ?? "",
            addressLine1: initialValues.addressLine1 ?? "",
            addressLine2: initialValues.addressLine2 ?? "",
            city: initialValues.city ?? "",
            district: initialValues.district ?? "",
            postalCode: initialValues.postalCode ?? "",
          }
        : emptyForm,
    );
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const handleChange =
    (key: keyof AddressPayload) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
      <LoadingOverlay visible={loading} background="transparent" />
      <div className="relative w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">
              Add your delivery address for faster checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
            aria-label="Close address form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-700">
              Full name
              <input
                type="text"
                value={form.fullName}
                onChange={handleChange("fullName")}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                required
              />
            </label>
            <label className="text-sm text-slate-700">
              Phone
              <input
                type="text"
                value={form.phone}
                onChange={handleChange("phone")}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                required
              />
            </label>
          </div>

          <label className="text-sm text-slate-700">
            Address line 1
            <input
              type="text"
              value={form.addressLine1}
              onChange={handleChange("addressLine1")}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              required
            />
          </label>

          <label className="text-sm text-slate-700">
            Address line 2 (optional)
            <input
              type="text"
              value={form.addressLine2 ?? ""}
              onChange={handleChange("addressLine2")}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-700">
              City / Town
              <input
                type="text"
                value={form.city}
                onChange={handleChange("city")}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                required
              />
            </label>
            <label className="text-sm text-slate-700">
              District
              <select
                value={form.district}
                onChange={handleChange("district")}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                required
              >
                <option value="">Select district</option>
                {SRI_LANKA_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="text-sm text-slate-700">
            Postal code (optional)
            <input
              type="text"
              value={form.postalCode ?? ""}
              onChange={handleChange("postalCode")}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
            />
          </label>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full border border-primary bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              disabled={loading}
            >
              Save address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
