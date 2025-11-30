"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type SVGAttributes } from "react";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/context/notification-context";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { AddressFormModal } from "@/components/account/address-form-modal";
import { AddressList } from "@/components/account/address-list";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  type Address,
  type AddressPayload,
} from "@/lib/api/addresses";
import { getOrders, type Order } from "@/lib/api/orders";
import { OrderCard } from "@/components/account/order-card";
import { fetchFavorites } from "@/lib/favorites-api";

type IconProps = SVGAttributes<SVGSVGElement> & {
  size?: number;
};

const DashboardIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z" />
  </svg>
);

const OrdersIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M3 7h18M3 12h18M7 22h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z" />
  </svg>
);

const DownloadIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M12 3v14" />
    <path d="m5 12 7 7 7-7" />
    <path d="M5 21h14" />
  </svg>
);

const AddressIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
    <circle cx="12" cy="11" r="2" />
  </svg>
);

const DetailsIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <circle cx="12" cy="6" r="4" />
    <path d="M6 20a6 6 0 0 1 12 0" />
  </svg>
);

const LogoutIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

  const navigationItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Overview & profile",
    icon: DashboardIcon,
  },
  {
    key: "orders",
    label: "Orders",
    description: "Track deliveries & invoices",
    icon: OrdersIcon,
  },
  {
    key: "downloads",
    label: "Downloads",
    description: "Invoices & warranties",
    icon: DownloadIcon,
  },
  {
    key: "addresses",
    label: "Addresses",
    description: "Shipping & billing details",
    icon: AddressIcon,
  },
  {
    key: "details",
    label: "Account Details",
    description: "Profile & security",
    icon: DetailsIcon,
  },
] as const;

type SectionKey = (typeof navigationItems)[number]["key"];

  export default function AccountPage() {
  const searchParams = useSearchParams();
  const { user, openAuth, logout } = useAuth();
  const { notifyError, notifySuccess } = useNotifications();
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const requestedTab = searchParams.get("tab");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressFormLoading, setAddressFormLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<Address | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!requestedTab) return;
    const match = navigationItems.find((item) => item.key === requestedTab);
    if (match) {
      setActiveSection(match.key);
    }
  }, [requestedTab]);

  const initials = useMemo(() => {
    if (!user) return "";
    if (user.firstName) {
      const lastInitial = user.lastName?.[0]?.toUpperCase() ?? "";
      return `${user.firstName[0]?.toUpperCase() ?? ""}${lastInitial}`;
    }
    return user.email?.slice(0, 2).toUpperCase();
  }, [user]);

  const membershipDate = useMemo(() => {
    if (!user) return "";
    const joinedYear = new Date().getFullYear() - 1;
    return `Member since ${joinedYear}`;
  }, [user]);

  const requestLogout = () => setShowLogoutConfirm(true);
  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user || activeSection !== "addresses") return;
      setAddressesLoading(true);
      try {
        const data = await getAddresses();
        setAddresses(data.items);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load addresses.";
        notifyError("Addresses unavailable", message);
      } finally {
        setAddressesLoading(false);
      }
    };
    void loadAddresses();
  }, [activeSection, user]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user || (activeSection !== "orders" && activeSection !== "dashboard")) return;
      setOrdersLoading(true);
      try {
        const data = await getOrders();
        setOrders(data.orders);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load orders.";
        notifyError("Orders unavailable", message);
      } finally {
        setOrdersLoading(false);
      }
    };
    void loadOrders();
  }, [activeSection, user, notifyError]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user || activeSection !== "dashboard") return;
      try {
        const items = await fetchFavorites();
        setFavoritesCount(items.length);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load wishlist.";
        notifyError("Wishlist unavailable", message);
      }
    };
    void loadFavorites();
  }, [activeSection, user, notifyError]);

  const handleSaveAddress = async (payload: AddressPayload) => {
    setAddressFormLoading(true);
    try {
      if (editingAddress) {
        const { address } = await updateAddress(editingAddress.id, payload);
        setAddresses((prev) =>
          prev.map((item) => (item.id === editingAddress.id ? address : item)),
        );
        notifySuccess("Address updated", "We saved your changes.");
      } else {
        const { address } = await createAddress(payload);
        setAddresses((prev) => [address, ...prev]);
        notifySuccess("Address added", "New delivery address created.");
      }
      setAddressFormOpen(false);
      setEditingAddress(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save address.";
      notifyError("Save failed", message);
    } finally {
      setAddressFormLoading(false);
    }
  };

  const handleDeleteAddress = async (address: Address) => {
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

  const renderSectionContent = () => {
    if (!user) {
      return (
        <section className="rounded-[32px] border border-slate-100 bg-white p-10 text-center shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
          <p className="text-2xl font-semibold text-slate-900">
            Ready to personalize your experience?
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Save addresses, sync your wishlist, and enjoy faster checkout when you create an
            account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              className="rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#e21717]"
              onClick={() => openAuth("login")}
            >
              Sign In
            </button>
            <button
              className="rounded-full border border-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/5"
              onClick={() => openAuth("register")}
            >
              Create Account
            </button>
          </div>
        </section>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-slate-900">
                    Hello {user.firstName ?? user.email}
                  </p>
                  <p className="text-sm text-slate-500">
                    View recent orders, manage addresses, and update account details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={requestLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                >
                  <LogoutIcon size={18} />
                  Sign out
                </button>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Open orders",
                    value: orders.filter(
                      (order) => !["FULFILLED", "CANCELLED", "REFUNDED"].includes(order.status),
                    ).length,
                  },
                  {
                    label: "Downloads",
                    value: 0,
                  },
                  {
                    label: "Wishlist",
                    value: favoritesCount,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-5 text-center"
                  >
                    <p className="text-2xl font-semibold text-slate-900">
                      {item.value.toString().padStart(2, "0")}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-semibold text-slate-900">Account details</h2>
              <p className="text-sm text-slate-500">
                Keep your contact details up to date so deliveries are never delayed.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <span className="text-slate-500">First name</span>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                    {user.firstName ?? "—"}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <span className="text-slate-500">Last name</span>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                    {user.lastName ?? "—"}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm">
                <span className="text-slate-500">Email address</span>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                  {user.email}
                </div>
              </div>
            </section>
          </>
        );
      case "orders":
        return (
          <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Your orders</h2>
                <p className="text-sm text-slate-500">
                  Track recent purchases and payment status.
                </p>
              </div>
              <button className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-50">
                Need help?
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {ordersLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-32 rounded-2xl border border-neutral-200 bg-neutral-50 shadow-inner"
                  />
                ))
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-8 text-center shadow-sm">
                  <p className="text-lg font-semibold text-neutral-900">
                    You don&apos;t have any orders!
                  </p>
                  <p className="text-sm text-neutral-600">
                    Every order you place will show up here with tracking details.
                  </p>
                  <Link
                    href="/shop"
                    className="rounded-full border border-primary bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                orders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          </section>
        );
      case "downloads":
        return (
          <section className="rounded-[32px] border border-slate-100 bg-white p-8 text-center shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
            <p className="text-xl font-semibold text-slate-900">No downloads yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Digital receipts and warranty documents will appear once you make a purchase.
            </p>
          </section>
        );
      case "addresses":
        return (
          <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
            {!user ? (
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Sign in to manage addresses
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Save shipping and billing details for faster checkout.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button
                    className="rounded-full border border-primary bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                    onClick={() => openAuth("login")}
                  >
                    Sign in
                  </button>
                  <button
                    className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
                    onClick={() => openAuth("register")}
                  >
                    Create account
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Saved addresses</h2>
                    <p className="text-sm text-slate-500">
                      Add shipping and billing details for faster checkout.
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressFormOpen(true);
                    }}
                  >
                    Add address
                  </button>
                </div>
                <div className="mt-6">
                  {addressesLoading ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-24 rounded-2xl border border-neutral-200 bg-neutral-50"
                        />
                      ))}
                    </div>
                  ) : (
                    <AddressList
                      addresses={addresses}
                      onEdit={(addr) => {
                        setEditingAddress(addr);
                        setAddressFormOpen(true);
                      }}
                      onDelete={setConfirmingDelete}
                    />
                  )}
                </div>
              </>
            )}
          </section>
        );
      case "details":
        return (
          <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-slate-900">Account preferences</h2>
            <p className="text-sm text-slate-500">
              Manage password, notifications, and privacy controls.
            </p>
            <div className="mt-6 space-y-4">
              {[
                { label: "Password", description: "Last updated 90 days ago", action: "Update" },
                {
                  label: "Two-factor authentication",
                  description: "Add an extra layer of security",
                  action: "Enable",
                },
                {
                  label: "Notifications",
                  description: "Choose how Corn contacts you",
                  action: "Manage",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:border-primary/20 hover:bg-primary/5 hover:text-primary">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-10 lg:px-0">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Account Center
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 lg:text-4xl">
              {user ? "My Account" : "Manage your account"}
            </h1>
            <p className="mt-2 text-base text-slate-500">
              {user
                ? "View your orders, addresses, downloads, and update your profile in one place."
                : "Sign in to see your dashboard, orders, and personalize your experience."}
            </p>
          </div>
          {user && (
            <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
              {membershipDate}
            </span>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row ">
          <aside className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] min-h-[420px]">
            {user ? (
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50/60 p-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xl font-semibold uppercase text-primary">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {user.firstName
                      ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                      : user.email}
                  </p>
                  <p className="text-sm text-slate-500">Corn Electronics</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50/60 p-4 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Join Corn Electronics
                </p>
                <p className="text-sm text-slate-500">
                  Unlock faster checkout, saved addresses, and VIP perks.
                </p>
              </div>
            )}

            <nav className="mt-6 grid grid-cols-2 gap-2 lg:block lg:space-y-2">
            {navigationItems.map(({ key, label, description, icon: Icon }) => {
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSection(key)}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-slate-100 text-slate-600 hover:border-primary/20 hover:bg-primary/5 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="flex flex-col text-sm">
                    <span className={`font-semibold ${isActive ? "text-white" : "text-slate-900"}`}>
                      {label}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide ${
                        isActive ? "text-white/80" : "text-slate-400"
                      }`}
                    >
                      {description}
                    </span>
                  </span>
                </button>
              );
            })}

            {user && (
              <button
                type="button"
                onClick={requestLogout}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-primary">
                  <LogoutIcon size={18} />
                </span>
                Logout
              </button>
            )}
          </nav>
          </aside>

          <div className="w-full lg:w-2/3 space-y-6 h-full">{renderSectionContent()}</div>
        </div>
      </main>
      <MobileBottomNav />

      <AddressFormModal
        isOpen={addressFormOpen}
        title={editingAddress ? "Edit address" : "Add new address"}
        initialValues={editingAddress ?? undefined}
        loading={addressFormLoading}
        onClose={() => {
          setAddressFormOpen(false);
          setEditingAddress(null);
        }}
        onSubmit={handleSaveAddress}
      />

      {confirmingDelete ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LogoutIcon size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Delete address?</h3>
            <p className="mt-2 text-sm text-slate-500">
              This address will be removed from your account.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                onClick={() => setConfirmingDelete(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e21717]"
                onClick={() => confirmingDelete && handleDeleteAddress(confirmingDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LogoutIcon size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Sign out of Corn?</h3>
            <p className="mt-2 text-sm text-slate-500">
              You&apos;ll need to log back in to manage your orders, downloads, and wishlist.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e21717]"
                onClick={handleLogoutConfirm}
              >
                Yes, sign me out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
