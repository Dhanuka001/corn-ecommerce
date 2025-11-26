"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { AddressFormModal } from "@/components/account/address-form-modal";
import { AddressList } from "@/components/account/address-list";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  type Address,
  type AddressPayload,
} from "@/lib/api/addresses";
import { useNotifications } from "@/context/notification-context";
import { useAuth } from "@/context/auth-context";

export default function AddressesPage() {
  const { user, openAuth } = useAuth();
  const { notifyError, notifySuccess } = useNotifications();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<Address | null>(null);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data.items);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load addresses.";
      notifyError("Addresses unavailable", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    void loadAddresses();
  }, [user]);

  const handleCreateOrUpdate = async (payload: AddressPayload) => {
    setFormLoading(true);
    try {
      if (editing) {
        const { address } = await updateAddress(editing.id, payload);
        setAddresses((prev) =>
          prev.map((item) => (item.id === editing.id ? address : item)),
        );
        notifySuccess("Address updated", "We saved your changes.");
      } else {
        const { address } = await createAddress(payload);
        setAddresses((prev) => [address, ...prev]);
        notifySuccess("Address added", "New delivery address created.");
      }
      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save address.";
      notifyError("Save failed", message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (address: Address) => {
    setConfirmingDelete(null);
    try {
      await deleteAddress(address.id);
      setAddresses((prev) => prev.filter((item) => item.id !== address.id));
      notifySuccess("Address removed", "The address was deleted.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete address.";
      notifyError("Delete failed", message);
    }
  };

  const openNewForm = () => {
    if (!user) {
      openAuth("login");
      return;
    }
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="rounded-[28px] border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xl font-semibold text-neutral-900">
            Sign in to manage addresses
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Save shipping details for faster checkout and order tracking.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              className="rounded-full border border-primary bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => openAuth("login")}
            >
              Sign in
            </button>
            <button
              className="rounded-full border border-neutral-200 px-6 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-50"
              onClick={() => openAuth("register")}
            >
              Create account
            </button>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 rounded-2xl border border-neutral-200 bg-neutral-50 shadow-inner"
            />
          ))}
        </div>
      );
    }

    return (
      <AddressList
        addresses={addresses}
        onEdit={openEditForm}
        onDelete={setConfirmingDelete}
      />
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              My Addresses
            </p>
            <h1 className="text-3xl font-semibold text-neutral-900">
              Shipping & delivery details
            </h1>
            <p className="text-sm text-neutral-600">
              Manage your saved locations for quick checkout.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-50"
            >
              Back to account
            </Link>
            <button
              className="rounded-full border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              onClick={openNewForm}
            >
              Add new address
            </button>
          </div>
        </div>

        <div className="mt-8">{renderContent()}</div>
      </main>
      <Footer />
      <MobileBottomNav />

      <AddressFormModal
        isOpen={formOpen}
        title={editing ? "Edit address" : "Add new address"}
        initialValues={editing ?? undefined}
        loading={formLoading}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleCreateOrUpdate}
      />

      {confirmingDelete ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl">
            <p className="text-lg font-semibold text-neutral-900">Delete address</p>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to remove this address? This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-50"
                onClick={() => setConfirmingDelete(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-full border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => handleDelete(confirmingDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
